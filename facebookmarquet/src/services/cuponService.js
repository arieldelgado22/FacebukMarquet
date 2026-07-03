import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const collectionName = 'cupones';

export async function getCupones() {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((docSnap) => ({
    firebaseId: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function getCuponById(id) {
  const snapshot = await getDoc(doc(db, collectionName, id));
  if (!snapshot.exists()) return null;
  return { firebaseId: snapshot.id, ...snapshot.data() };
}

export async function getCuponByCodigo(codigo) {
  const q = query(collection(db, collectionName), where('codigo', '==', codigo.toUpperCase().trim()));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { firebaseId: docSnap.id, ...docSnap.data() };
}

export async function createCupon(cuponData) {
  const codigo = cuponData.codigo.toUpperCase().trim();
  const existente = await getCuponByCodigo(codigo);
  if (existente) {
    throw new Error(`Ya existe un cupon con el codigo "${codigo}".`);
  }

  const docRef = await addDoc(collection(db, collectionName), {
    codigo,
    tipo: cuponData.tipo || 'porcentaje',
    valor: Number(cuponData.valor) || 0,
    usosMaximos: Number(cuponData.usosMaximos) || 0,
    usosActuales: 0,
    activo: cuponData.activo !== false,
    descripcion: cuponData.descripcion?.trim() || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { firebaseId: docRef.id, codigo, tipo: cuponData.tipo, valor: Number(cuponData.valor) };
}

export async function updateCupon(id, cuponData) {
  const data = {};
  if (cuponData.codigo !== undefined) data.codigo = cuponData.codigo.toUpperCase().trim();
  if (cuponData.tipo !== undefined) data.tipo = cuponData.tipo;
  if (cuponData.valor !== undefined) data.valor = Number(cuponData.valor);
  if (cuponData.usosMaximos !== undefined) data.usosMaximos = Number(cuponData.usosMaximos);
  if (cuponData.activo !== undefined) data.activo = cuponData.activo;
  if (cuponData.descripcion !== undefined) data.descripcion = cuponData.descripcion.trim();
  data.updatedAt = serverTimestamp();

  await updateDoc(doc(db, collectionName, id), data);
  return { firebaseId: id, ...data };
}

export async function deleteCupon(id) {
  await deleteDoc(doc(db, collectionName, id));
}

export async function validarCupon(codigo, totalCarrito) {
  const codigoUpper = codigo.toUpperCase().trim();

  // Fallback automatico: si es FACEBOOK, 10% de descuento aunque no exista en Firestore
  if (codigoUpper === 'FACEBOOK') {
    const descuento = Math.round((totalCarrito * 10) / 100 * 100) / 100;
    return {
      valido: true,
      cupon: {
        firebaseId: 'facebook-auto',
        codigo: 'FACEBOOK',
        tipo: 'porcentaje',
        valor: 10,
        usosMaximos: 0,
        usosActuales: 0,
        activo: true,
      },
      descuento,
      totalConDescuento: Math.round((totalCarrito - descuento) * 100) / 100,
      mensaje: 'Cupon aplicado: 10% OFF — Bienvenido a Facebook Marquet',
    };
  }

  const cupon = await getCuponByCodigo(codigoUpper);
  if (!cupon) {
    return { valido: false, mensaje: 'El codigo ingresado no es valido.' };
  }

  if (!cupon.activo) {
    return { valido: false, mensaje: 'Este cupon ya no esta activo.' };
  }

  if (cupon.usosMaximos > 0 && cupon.usosActuales >= cupon.usosMaximos) {
    return { valido: false, mensaje: 'Este cupon ya alcanzo su limite de usos.' };
  }

  let descuento = 0;
  if (cupon.tipo === 'porcentaje') {
    descuento = (totalCarrito * cupon.valor) / 100;
  } else {
    descuento = Math.min(cupon.valor, totalCarrito);
  }

  return {
    valido: true,
    cupon,
    descuento: Math.round(descuento * 100) / 100,
    totalConDescuento: Math.round((totalCarrito - descuento) * 100) / 100,
    mensaje: `Cupon aplicado: ${cupon.tipo === 'porcentaje' ? `${cupon.valor}% OFF` : `$${cupon.valor.toLocaleString('es-AR')} OFF`}`,
  };
}

export async function registrarUsoCupon(firebaseId) {
  const ref = doc(db, collectionName, firebaseId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;

  const usosActuales = (snapshot.data().usosActuales || 0) + 1;
  await updateDoc(ref, {
    usosActuales,
    updatedAt: serverTimestamp(),
  });
}
