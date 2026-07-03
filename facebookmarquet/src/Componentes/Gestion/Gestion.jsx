import { useCallback, useEffect, useState } from 'react';
import { FormularioContainer } from '../FormularioProductos/FormularioContainer';
import { CuponManager } from '../CuponManager/CuponManager';
import {
  deleteProductoNacional,
  getProductosNacionales,
} from '../../services/productosNacionalesService';

const TABS = {
  PRODUCTOS: 'productos',
  CUPONES: 'cupones',
};

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

const Gestion = () => {
  const [tab, setTab] = useState(TABS.PRODUCTOS);
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const productosFirestore = await getProductosNacionales();
      setProductos(productosFirestore);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los productos nacionales.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleDeleteClick = (prod) => {
    setDeleteTarget(prod);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProductoNacional(deleteTarget.firebaseId);
      setProductos((currentProducts) =>
        currentProducts.filter((prod) => prod.firebaseId !== deleteTarget.firebaseId)
      );
      if (productoEditando?.firebaseId === deleteTarget.firebaseId) {
        setProductoEditando(null);
      }
      setNotification({ message: `"${deleteTarget.nombre}" eliminado correctamente.`, type: 'danger' });
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      setNotification({ message: 'No se pudo eliminar el producto.', type: 'danger' });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const handleSaved = () => {
    setProductoEditando(null);
    fetchProductos();
  };

  const dismissNotification = () => setNotification(null);

  return (
    <section className="marketplace-shell">
      {/* Notification */}
      {notification && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show d-flex align-items-center`} role="alert">
          <span className="flex-grow-1">{notification.message}</span>
          <button className="btn-close" type="button" aria-label="Cerrar" onClick={dismissNotification} />
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4">
        <div>
          <span className="badge text-bg-primary mb-2">Panel privado</span>
          <h1 className="h2 fw-bold mb-1">Gestion de Productos Nacionales</h1>
          <p className="text-secondary mb-0">Alta, edicion y baja de publicaciones en Firestore.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4">
        <button
          className={`btn ${tab === TABS.PRODUCTOS ? 'btn-fb' : 'btn-light border'} fw-semibold`}
          type="button"
          onClick={() => { setTab(TABS.PRODUCTOS); setProductoEditando(null); }}
        >
          Productos
        </button>
        <button
          className={`btn ${tab === TABS.CUPONES ? 'btn-fb' : 'btn-light border'} fw-semibold`}
          type="button"
          onClick={() => setTab(TABS.CUPONES)}
        >
          Cupones de Descuento
        </button>
      </div>

      {/* Tab: Productos */}
      {tab === TABS.PRODUCTOS && (
        <div className="row g-4">
          <div className="col-lg-5">
            {productoEditando && (
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="fw-semibold text-secondary">Editando: <span className="text-dark">{productoEditando.nombre}</span></span>
                <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setProductoEditando(null)}>
                  Cancelar
                </button>
              </div>
            )}
            <FormularioContainer
              productoEditando={productoEditando}
              onNotify={setNotification}
              onSaved={handleSaved}
            />
          </div>

          <div className="col-lg-7">
            <div className="marketplace-panel p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="h4 fw-bold mb-0">Publicaciones</h2>
                <span className="badge text-bg-light border">{productos.length} productos</span>
              </div>

              {loading && (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <span className="visually-hidden">Cargando productos...</span>
                  </div>
                  <p className="text-secondary mb-0">Cargando productos...</p>
                </div>
              )}

              {error && <div className="alert alert-danger">{error}</div>}

              {!loading && !productos.length && !error && (
                <p className="text-secondary mb-0 text-center py-4">No hay productos cargados todavia.</p>
              )}

              {!loading && productos.length > 0 && (
                <div className="d-grid gap-3">
                  {productos.map((prod) => (
                    <article className="border rounded-3 p-3 bg-white" key={prod.firebaseId || prod.id}>
                      <div className="d-flex gap-3 align-items-center">
                        {prod.imagen ? (
                          <img
                            alt={prod.nombre}
                            className="rounded bg-light"
                            src={prod.imagen}
                            style={{ height: '76px', objectFit: 'contain', width: '76px' }}
                          />
                        ) : (
                          <div className="rounded bg-light d-flex align-items-center justify-content-center text-secondary" style={{ height: '76px', width: '76px' }}>
                            Sin imagen
                          </div>
                        )}
                        <div className="flex-grow-1">
                          <h3 className="h6 fw-bold mb-1">{prod.nombre}</h3>
                          <p className="small text-secondary mb-1">{prod.categoria || 'Sin categoria'}</p>
                          <p className="fw-semibold mb-0">
                            ${Number(prod.precio).toLocaleString('es-AR')} - Stock: {prod.stock}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-fb-soft flex-fill" type="button" onClick={() => setProductoEditando(prod)}>
                          Editar
                        </button>
                        <button className="btn btn-outline-danger flex-fill" type="button" onClick={() => handleDeleteClick(prod)}>
                          Eliminar
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Cupones */}
      {tab === TABS.CUPONES && (
        <CuponManager onNotify={setNotification} />
      )}

      {/* Modal de confirmacion para eliminar producto */}
      <ConfirmarModal
        show={Boolean(deleteTarget)}
        titulo="Eliminar producto"
        mensaje={
          deleteTarget
            ? `¿Estas seguro de eliminar "${deleteTarget.nombre}"? Esta accion no se puede deshacer.`
            : ''
        }
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </section>
  );
};

export default Gestion;
