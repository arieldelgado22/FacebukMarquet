import { useCallback, useEffect, useState } from 'react';
import {
  createCupon,
  deleteCupon,
  getCupones,
  updateCupon,
} from '../../services/cuponService';

function CuponFormulario({ cuponEditando, onSaved, onCancel, onNotify }) {
  const emptyForm = {
    codigo: '',
    tipo: 'porcentaje',
    valor: '',
    usosMaximos: '',
    descripcion: '',
    activo: true,
  };

  const [form, setForm] = useState({ ...emptyForm, ...cuponEditando });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ ...emptyForm, ...cuponEditando });
    setErrors({});
  }, [cuponEditando]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.codigo.trim()) errs.codigo = 'El codigo es obligatorio.';
    else if (!/^[A-Za-z0-9_-]{2,20}$/.test(form.codigo.trim())) {
      errs.codigo = 'Usa 2-20 caracteres alfanumericos, guiones o guion bajo.';
    }
    const valor = Number(form.valor);
    if (!form.valor || isNaN(valor) || valor <= 0) {
      errs.valor = 'El valor debe ser mayor a 0.';
    }
    if (form.tipo === 'porcentaje' && valor > 100) {
      errs.valor = 'El porcentaje no puede superar 100.';
    }
    const usos = Number(form.usosMaximos);
    if (form.usosMaximos !== '' && (isNaN(usos) || usos < 0)) {
      errs.usosMaximos = 'Los usos maximos no pueden ser negativos.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      if (cuponEditando?.firebaseId) {
        await updateCupon(cuponEditando.firebaseId, form);
        onNotify?.({ message: `Cupon "${form.codigo}" actualizado.`, type: 'primary' });
      } else {
        await createCupon(form);
        onNotify?.({ message: `Cupon "${form.codigo}" creado correctamente.`, type: 'success' });
      }
      setForm(emptyForm);
      onSaved?.();
    } catch (err) {
      onNotify?.({ message: err.message || 'Error al guardar el cupon.', type: 'danger' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="marketplace-panel p-4" onSubmit={handleSubmit} noValidate>
      <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
        <div>
          <span className="badge text-bg-light border mb-2">Firestore</span>
          <h3 className="h4 fw-bold mb-0">{cuponEditando ? 'Editar cupon' : 'Nuevo cupon'}</h3>
        </div>
        {cuponEditando && (
          <button className="btn btn-sm btn-outline-secondary" type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold" htmlFor="cupon-codigo">Codigo *</label>
          <input
            className={`form-control ${errors.codigo ? 'is-invalid' : ''}`}
            id="cupon-codigo"
            name="codigo"
            placeholder="Ej: DESCUENTO10"
            required
            type="text"
            value={form.codigo}
            onChange={handleChange}
          />
          {errors.codigo && <div className="invalid-feedback d-block">{errors.codigo}</div>}
          <div className="form-text">Se guarda en mayusculas automaticamente.</div>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold" htmlFor="cupon-tipo">Tipo</label>
          <select
            className="form-select"
            id="cupon-tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
          >
            <option value="porcentaje">Porcentaje (%)</option>
            <option value="fijo">Monto fijo ($)</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold" htmlFor="cupon-valor">
            {form.tipo === 'porcentaje' ? 'Porcentaje de descuento *' : 'Monto de descuento *'}
          </label>
          <input
            className={`form-control ${errors.valor ? 'is-invalid' : ''}`}
            id="cupon-valor"
            min="0"
            name="valor"
            placeholder={form.tipo === 'porcentaje' ? 'Ej: 10' : 'Ej: 5000'}
            required
            step="any"
            type="number"
            value={form.valor}
            onChange={handleChange}
          />
          {errors.valor && <div className="invalid-feedback d-block">{errors.valor}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold" htmlFor="cupon-usos">Usos maximos</label>
          <input
            className={`form-control ${errors.usosMaximos ? 'is-invalid' : ''}`}
            id="cupon-usos"
            min="0"
            name="usosMaximos"
            placeholder="0 = ilimitado"
            type="number"
            value={form.usosMaximos}
            onChange={handleChange}
          />
          {errors.usosMaximos && <div className="invalid-feedback d-block">{errors.usosMaximos}</div>}
          <div className="form-text">Dejalo en 0 para usos ilimitados.</div>
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold" htmlFor="cupon-descripcion">Descripcion</label>
          <input
            className="form-control"
            id="cupon-descripcion"
            name="descripcion"
            placeholder="Ej: Descuento por lanzamiento"
            type="text"
            value={form.descripcion}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              id="cupon-activo"
              name="activo"
              role="switch"
              type="checkbox"
              checked={form.activo}
              onChange={handleChange}
            />
            <label className="form-check-label fw-semibold" htmlFor="cupon-activo">
              Cupon activo
            </label>
          </div>
        </div>
      </div>

      <button className="btn btn-fb w-100 mt-4" disabled={saving} type="submit">
        {saving ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
            Guardando...
          </>
        ) : (
          cuponEditando ? 'Actualizar cupon' : 'Crear cupon'
        )}
      </button>
    </form>
  );
}

function ConfirmarModal({ show, titulo, mensaje, onConfirm, onCancel, loading }) {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onCancel} style={{ cursor: 'pointer' }} />
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow" style={{ borderRadius: '14px' }}>
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">{titulo}</h5>
              <button className="btn-close" type="button" aria-label="Cerrar" onClick={onCancel} />
            </div>
            <div className="modal-body">
              <p className="text-secondary mb-0">{mensaje}</p>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button className="btn btn-light fw-semibold" type="button" onClick={onCancel}>
                Cancelar
              </button>
              <button className="btn btn-danger fw-semibold" disabled={loading} type="button" onClick={onConfirm}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Eliminando...
                  </>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function CuponManager({ onNotify }) {
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cuponEditando, setCuponEditando] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCupones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCupones();
      setCupones(data);
    } catch (err) {
      console.error(err);
      onNotify?.({ message: 'No se pudieron cargar los cupones.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  }, [onNotify]);

  useEffect(() => {
    fetchCupones();
  }, [fetchCupones]);

  const handleDeleteClick = (cupon) => {
    setDeleteTarget(cupon);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCupon(deleteTarget.firebaseId);
      setCupones((prev) => prev.filter((c) => c.firebaseId !== deleteTarget.firebaseId));
      if (cuponEditando?.firebaseId === deleteTarget.firebaseId) {
        setCuponEditando(null);
      }
      onNotify?.({ message: `Cupon "${deleteTarget.codigo}" eliminado.`, type: 'danger' });
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      onNotify?.({ message: 'No se pudo eliminar el cupon.', type: 'danger' });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const handleSaved = () => {
    setCuponEditando(null);
    fetchCupones();
  };

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <CuponFormulario
          cuponEditando={cuponEditando}
          onCancel={() => setCuponEditando(null)}
          onNotify={onNotify}
          onSaved={handleSaved}
        />
      </div>

      <div className="col-lg-7">
        <div className="marketplace-panel p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="h4 fw-bold mb-0">Cupones de Descuento</h2>
            <span className="badge text-bg-light border">{cupones.length} cupones</span>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
                <span className="visually-hidden">Cargando cupones...</span>
              </div>
              <p className="text-secondary mb-0">Cargando cupones...</p>
            </div>
          )}

          {!loading && cupones.length === 0 && (
            <p className="text-secondary mb-0 text-center py-4">No hay cupones todavia. Crea el primero.</p>
          )}

          {!loading && cupones.length > 0 && (
            <div className="d-grid gap-3">
              {cupones.map((cupon) => {
                const usos = cupon.usosActuales || 0;
                const maxUsos = cupon.usosMaximos || 0;
                const usosText = maxUsos > 0 ? `${usos}/${maxUsos}` : `${usos} (ilimitado)`;
                const badgeClass = cupon.activo ? 'text-bg-success' : 'text-bg-secondary';

                return (
                  <article className={`border rounded-3 p-3 bg-white ${!cupon.activo ? 'opacity-75' : ''}`} key={cupon.firebaseId}>
                    <div className="d-flex gap-3 align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className={`badge ${badgeClass}`}>
                            {cupon.activo ? 'Activo' : 'Inactivo'}
                          </span>
                          <code className="fw-bold fs-6">{cupon.codigo}</code>
                        </div>
                        <p className="small text-secondary mb-1">
                          {cupon.tipo === 'porcentaje'
                            ? `${cupon.valor}% de descuento`
                            : `$${Number(cupon.valor).toLocaleString('es-AR')} de descuento`}
                          {cupon.descripcion ? ` — ${cupon.descripcion}` : ''}
                        </p>
                        <p className="small text-secondary mb-0">
                          Usos: {usosText}
                        </p>
                      </div>
                      <div className="d-flex gap-2 flex-shrink-0">
                        <button className="btn btn-sm btn-fb-soft" type="button" onClick={() => setCuponEditando(cupon)}>
                          Editar
                        </button>
                        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDeleteClick(cupon)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmarModal
        show={Boolean(deleteTarget)}
        titulo="Eliminar cupon"
        mensaje={
          deleteTarget
            ? `¿Estas seguro de eliminar el cupon "${deleteTarget.codigo}"? Esta accion no se puede deshacer.`
            : ''
        }
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
