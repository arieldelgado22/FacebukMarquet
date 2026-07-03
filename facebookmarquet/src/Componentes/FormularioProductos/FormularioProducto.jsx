import { useState } from 'react';

function validateForm(datosForm) {
  const errors = {};

  if (!datosForm.nombre.trim()) {
    errors.nombre = 'El nombre del producto es obligatorio.';
  }

  const precio = Number(datosForm.precio);
  if (!datosForm.precio || isNaN(precio) || precio <= 0) {
    errors.precio = 'El precio debe ser mayor a 0.';
  }

  const stock = Number(datosForm.stock);
  if (datosForm.stock === '' || isNaN(stock) || stock < 0) {
    errors.stock = 'El stock no puede ser negativo.';
  }

  return errors;
}

export function FormularioProducto({
  datosForm,
  esEdicion = false,
  imagenArchivo,
  manejarCambio,
  manejarEnvio,
  manejarImagen,
  loading,
}) {
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const preview = imagenArchivo ? URL.createObjectURL(imagenArchivo) : datosForm.imagen;
  const errors = validateForm(datosForm);
  const hasErrors = Object.keys(errors).length > 0;

  const handleBlur = (e) => {
    const { name } = e.target;
    if (submitted) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTouched({ nombre: true, precio: true, stock: true });
    if (hasErrors) {
      return;
    }
    manejarEnvio(e);
  };

  return (
    <form className="marketplace-panel p-4" onSubmit={handleSubmit} noValidate>
      <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
        <div>
          <span className="badge text-bg-light border mb-2">Firestore</span>
          <h3 className="h4 fw-bold mb-0">{esEdicion ? 'Editar producto' : 'Nuevo producto'}</h3>
        </div>
        <span className="text-secondary small">{esEdicion ? 'Modo edicion' : 'Alta nueva'}</span>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold" htmlFor="nombre">Nombre *</label>
          <input
            className={`form-control ${touched.nombre && errors.nombre ? 'is-invalid' : ''}`}
            id="nombre"
            name="nombre"
            placeholder="Nombre del producto"
            required
            type="text"
            value={datosForm.nombre}
            onBlur={handleBlur}
            onChange={manejarCambio}
          />
          {touched.nombre && errors.nombre && (
            <div className="invalid-feedback d-block">{errors.nombre}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold" htmlFor="categoria">Categoria</label>
          <input
            className="form-control"
            id="categoria"
            name="categoria"
            placeholder="Ej: electronica"
            type="text"
            value={datosForm.categoria}
            onChange={manejarCambio}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold" htmlFor="precio">Precio *</label>
          <input
            className={`form-control ${touched.precio && errors.precio ? 'is-invalid' : ''}`}
            id="precio"
            min="0"
            name="precio"
            placeholder="Precio"
            required
            step="any"
            type="number"
            value={datosForm.precio}
            onBlur={handleBlur}
            onChange={manejarCambio}
          />
          {touched.precio && errors.precio && (
            <div className="invalid-feedback d-block">{errors.precio}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold" htmlFor="stock">Stock *</label>
          <input
            className={`form-control ${touched.stock && errors.stock ? 'is-invalid' : ''}`}
            id="stock"
            min="0"
            name="stock"
            placeholder="Stock"
            required
            type="number"
            value={datosForm.stock}
            onBlur={handleBlur}
            onChange={manejarCambio}
          />
          {touched.stock && errors.stock && (
            <div className="invalid-feedback d-block">{errors.stock}</div>
          )}
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold" htmlFor="imagenArchivo">Subir imagen</label>
          <input
            accept="image/*"
            className="form-control"
            id="imagenArchivo"
            name="imagenArchivo"
            type="file"
            onChange={manejarImagen}
          />
          <div className="form-text">
            Podes subir un archivo desde tu PC. Si no configuraste API key, se guarda comprimida en la base de datos.
          </div>
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold" htmlFor="imagen">URL de imagen</label>
          <input
            className="form-control"
            id="imagen"
            name="imagen"
            placeholder="https://..."
            type="text"
            value={datosForm.imagen}
            onChange={manejarCambio}
          />
        </div>
      </div>

      {preview && (
        <div className="bg-light border rounded-3 d-flex align-items-center justify-content-center mt-4 p-3" style={{ minHeight: '180px' }}>
          <img src={preview} alt="Preview" style={{ maxHeight: '160px', maxWidth: '100%', objectFit: 'contain' }} />
        </div>
      )}

      <button className="btn btn-fb w-100 mt-4" disabled={loading || (touched.nombre && hasErrors)} type="submit">
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Guardando...
          </>
        ) : (
          'Guardar producto'
        )}
      </button>
    </form>
  );
}
