import { useEffect, useState } from 'react';
import { FormularioProducto } from './FormularioProducto';
import {
  createProductoNacional,
  updateProductoNacional,
} from '../../services/productosNacionalesService';
import { uploadProductImage } from '../../services/imageUploadService';

const emptyForm = {
  nombre: '',
  categoria: '',
  precio: '',
  stock: '',
  imagen: '',
};

export function FormularioContainer({ productoEditando = null, onNotify, onSaved }) {
  const [datosForm, setDatosForm] = useState({ ...emptyForm, ...productoEditando });
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localMessage, setLocalMessage] = useState(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    setDatosForm({ ...emptyForm, ...productoEditando });
    setImagenArchivo(null);
  }, [productoEditando]);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setDatosForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const manejarImagen = (evento) => {
    const file = evento.target.files?.[0] || null;
    setImagenArchivo(file);
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setLoading(true);

    try {
      const action = productoEditando?.firebaseId ? 'update' : 'create';
      const imagenSubida = imagenArchivo ? await uploadProductImage(imagenArchivo) : '';
      const datosParaGuardar = {
        ...datosForm,
        imagen: imagenSubida || datosForm.imagen,
      };

      const productoGuardado = productoEditando?.firebaseId
        ? await updateProductoNacional(productoEditando.firebaseId, datosParaGuardar)
        : await createProductoNacional(datosParaGuardar);

      const message = action === 'update'
        ? `Producto "${productoGuardado.nombre}" actualizado correctamente.`
        : `Producto "${productoGuardado.nombre}" agregado correctamente.`;
      const type = action === 'update' ? 'primary' : 'success';

      if (onNotify) {
        onNotify({ message, type });
      } else {
        setLocalMessage({ message, type });
      }

      setDatosForm(emptyForm);
      setImagenArchivo(null);
      setFormKey((k) => k + 1);
      onSaved?.(productoGuardado, action);
    } catch (error) {
      console.error('Error:', error);
      const notification = { message: 'Hubo un error al guardar el producto.', type: 'danger' };
      if (onNotify) {
        onNotify(notification);
      } else {
        setLocalMessage(notification);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {localMessage && (
        <div className={`alert alert-${localMessage.type}`} role="alert">
          {localMessage.message}
        </div>
      )}
      <FormularioProducto
        key={formKey}
        datosForm={datosForm}
        esEdicion={Boolean(productoEditando?.firebaseId)}
        manejarCambio={manejarCambio}
        manejarImagen={manejarImagen}
        manejarEnvio={manejarEnvio}
        imagenArchivo={imagenArchivo}
        loading={loading}
      />
    </>
  );
}
