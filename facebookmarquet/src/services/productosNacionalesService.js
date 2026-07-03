import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const collectionName = 'productos nacionales';

const normalizeProduct = (product, fallbackCodigo) => {
  const codigo = Number(product.codigo || product.id || fallbackCodigo);

  return {
    ...product,
    id: codigo ? String(codigo) : undefined,
    codigo,
    firebaseId: product.firebaseId ? String(product.firebaseId) : undefined,
    nombre: product.nombre?.trim() || '',
    categoria: product.categoria?.trim() || '',
    precio: Number(product.precio) || 0,
    stock: Number(product.stock) || 0,
    imagen: product.imagen?.trim() || product.urlImagen?.trim() || '',
  };
};

const toFirestoreProduct = (product) => ({
  id: Number(product.codigo),
  codigo: Number(product.codigo),
  nombre: product.nombre,
  categoria: product.categoria,
  precio: product.precio,
  stock: product.stock,
  imagen: product.imagen,
});

const sortProducts = (products) =>
  [...products].sort((a, b) => {
    if (a.codigo && b.codigo) return a.codigo - b.codigo;
    return a.nombre.localeCompare(b.nombre);
  });

export async function getProductosNacionales() {
  const snapshot = await getDocs(collection(db, collectionName));
  const products = snapshot.docs.map((productDoc, index) =>
    normalizeProduct(
      {
        firebaseId: productDoc.id,
        ...productDoc.data(),
      },
      index + 1,
    ),
  );

  return sortProducts(products).map((product, index) => ({
    ...product,
    id: String(product.codigo || index + 1),
    codigo: product.codigo || index + 1,
  }));
}

export async function getProductoNacionalById(productId) {
  const requestedId = String(productId);
  const directSnapshot = await getDoc(doc(db, collectionName, requestedId));

  if (directSnapshot.exists()) {
    return normalizeProduct({
      firebaseId: directSnapshot.id,
      ...directSnapshot.data(),
    });
  }

  const products = await getProductosNacionales();
  return products.find((product) => String(product.id) === requestedId) ?? null;
}

async function getNextCodigo() {
  const products = await getProductosNacionales();
  const maxCodigo = products.reduce((max, product) => {
    const numericId = Number(product.codigo || product.id) || 0;
    return Math.max(max, numericId);
  }, 0);

  return maxCodigo + 1;
}

export async function createProductoNacional(productData) {
  const codigo = productData.codigo || await getNextCodigo();
  const product = normalizeProduct({ ...productData, codigo });
  const createdProduct = await addDoc(collection(db, collectionName), {
    ...toFirestoreProduct(product),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { ...product, firebaseId: createdProduct.id, id: String(product.codigo) };
}

export async function updateProductoNacional(productId, productData) {
  const firebaseId = productData.firebaseId || productId;
  const product = normalizeProduct({
    ...productData,
    firebaseId,
    codigo: productData.codigo || productData.id,
  });

  await updateDoc(doc(db, collectionName, String(firebaseId)), {
    ...toFirestoreProduct(product),
    updatedAt: serverTimestamp(),
  });

  return product;
}

export async function deleteProductoNacional(productId) {
  await deleteDoc(doc(db, collectionName, String(productId)));
}

export async function comprarProductosNacionales(cartItems) {
  await runTransaction(db, async (transaction) => {
    const refs = cartItems.map((item) => ({
      item,
      ref: doc(db, collectionName, String(item.firebaseId)),
    }));

    const snapshots = await Promise.all(refs.map(({ ref }) => transaction.get(ref)));

    snapshots.forEach((snapshot, index) => {
      const { item } = refs[index];

      if (!snapshot.exists()) {
        throw new Error(`El producto ${item.nombre} ya no existe.`);
      }

      const currentStock = Number(snapshot.data().stock) || 0;

      if (currentStock < item.quantity) {
        throw new Error(`No hay stock suficiente de ${item.nombre}.`);
      }
    });

    snapshots.forEach((snapshot, index) => {
      const { item, ref } = refs[index];
      const currentStock = Number(snapshot.data().stock) || 0;

      transaction.update(ref, {
        stock: currentStock - item.quantity,
        updatedAt: serverTimestamp(),
      });
    });
  });
}
