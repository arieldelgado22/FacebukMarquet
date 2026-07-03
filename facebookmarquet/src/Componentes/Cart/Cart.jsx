import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { comprarProductosNacionales } from '../../services/productosNacionalesService';
import { registrarUsoCupon, validarCupon } from '../../services/cuponService';

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

const Cart = () => {
  const { cart, clearCart, getCartTotal, removeItem } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Cupon state
  const [cuponCodigo, setCuponCodigo] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState(null);
  const [cuponLoading, setCuponLoading] = useState(false);
  const [cuponError, setCuponError] = useState('');

  // Modal eliminar item
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const totalSinDescuento = getCartTotal();
  const descuento = cuponAplicado?.descuento || 0;
  const totalFinal = cuponAplicado?.totalConDescuento ?? totalSinDescuento;

  const handleValidarCupon = async () => {
    const codigo = cuponCodigo.trim();
    if (!codigo) {
      setCuponError('Ingresa un codigo de cupon.');
      return;
    }

    setCuponLoading(true);
    setCuponError('');
    setCuponAplicado(null);

    try {
      const resultado = await validarCupon(codigo, totalSinDescuento);
      if (resultado.valido) {
        setCuponAplicado(resultado);
      } else {
        setCuponError(resultado.mensaje);
      }
    } catch (err) {
      console.error(err);
      setCuponError('Error al validar el cupon. Intenta de nuevo.');
    } finally {
      setCuponLoading(false);
    }
  };

  const removerCupon = () => {
    setCuponAplicado(null);
    setCuponError('');
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setMessage(null);

    try {
      await comprarProductosNacionales(cart);

      // Registrar uso del cupon si se aplico uno
      if (cuponAplicado?.cupon?.firebaseId) {
        await registrarUsoCupon(cuponAplicado.cupon.firebaseId);
      }

      clearCart();
      setCuponAplicado(null);
      setCuponCodigo('');
      setMessage({ type: 'success', text: 'Compra realizada correctamente. El stock fue actualizado.' });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'danger', text: error.message || 'No se pudo finalizar la compra.' });
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Modal eliminar item
  const handleDeleteClick = (item) => {
    setDeleteTarget(item);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    removeItem(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  if (cart.length === 0) {
    return (
      <section className="marketplace-shell">
        {message && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}
        <div className="marketplace-panel text-center p-5">
          <h1 className="h2 fw-bold mb-2">El carrito esta vacio</h1>
          <p className="text-secondary mb-4">Agrega productos para continuar la compra.</p>
          <Link className="btn btn-fb" to="/productos-nacionales">Ir a la tienda</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="marketplace-shell">
      {message && (
        <div className={`alert alert-${message.type} alert-dismissible fade show d-flex align-items-center`} role="alert">
          <span className="flex-grow-1">{message.text}</span>
          <button className="btn-close" type="button" aria-label="Cerrar" onClick={() => setMessage(null)} />
        </div>
      )}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="marketplace-panel p-4">
            <h1 className="h3 fw-bold mb-4">Tu carrito</h1>
            <div className="d-grid gap-3">
              {cart.map((item) => (
                <div className="d-flex gap-3 align-items-center border-bottom pb-3" key={item.id}>
                  {item.imagen && (
                    <img
                      alt={item.nombre}
                      className="rounded bg-light"
                      src={item.imagen}
                      style={{ height: '84px', objectFit: 'contain', width: '84px' }}
                    />
                  )}
                  <div className="flex-grow-1">
                    <h2 className="h6 fw-bold mb-1">{item.nombre}</h2>
                    <p className="text-secondary small mb-1">Cantidad: {item.quantity}</p>
                    <p className="fw-semibold mb-0">${Number(item.precio * item.quantity).toLocaleString('es-AR')}</p>
                  </div>
                  <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDeleteClick(item)}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <aside className="marketplace-panel p-4 position-sticky" style={{ top: '88px' }}>
            <h2 className="h5 fw-bold mb-3">Resumen</h2>

            {/* Cupon de descuento */}
            <div className="border rounded-3 p-3 mb-3 bg-light">
              <label className="form-label fw-semibold small mb-2" htmlFor="cupon-input">
                Cupon de descuento
              </label>

              <div className="bg-white border rounded-2 p-2 mb-2 text-center">
                <span className="badge text-bg-primary me-1">💡</span>
                <small className="fw-semibold">
                  Ingresa <span className="fb-blue fw-bold">FACEBOOK</span> como codigo y obtene un descuento
                </small>
              </div>

              {cuponAplicado ? (
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="badge text-bg-success me-1">{cuponAplicado.cupon.codigo}</span>
                    <small className="text-success fw-semibold">
                      -${Number(descuento).toLocaleString('es-AR')}
                    </small>
                  </div>
                  <button className="btn btn-sm btn-outline-secondary" type="button" onClick={removerCupon}>
                    Quitar
                  </button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <input
                    className={`form-control form-control-sm ${cuponError ? 'is-invalid' : ''}`}
                    id="cupon-input"
                    placeholder="Codigo"
                    type="text"
                    value={cuponCodigo}
                    onChange={(e) => { setCuponCodigo(e.target.value); setCuponError(''); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleValidarCupon(); }}
                  />
                  <button
                    className="btn btn-sm btn-fb flex-shrink-0"
                    disabled={cuponLoading}
                    type="button"
                    onClick={handleValidarCupon}
                  >
                    {cuponLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    ) : (
                      'Aplicar'
                    )}
                  </button>
                </div>
              )}
              {cuponError && <div className="text-danger small mt-1">{cuponError}</div>}
            </div>

            {/* Totales */}
            <div className="d-flex justify-content-between mb-1">
              <span className="text-secondary">Subtotal</span>
              <strong>${Number(totalSinDescuento).toLocaleString('es-AR')}</strong>
            </div>

            {cuponAplicado && (
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary">Descuento</span>
                <strong className="text-success">-${Number(descuento).toLocaleString('es-AR')}</strong>
              </div>
            )}

            <hr className="my-2" />

            <div className="d-flex justify-content-between mb-3">
              <span className="fw-bold">Total</span>
              <strong className="fs-5">${Number(totalFinal).toLocaleString('es-AR')}</strong>
            </div>

            {cuponAplicado && (
              <p className="small text-success mb-3">
                {cuponAplicado.mensaje}
              </p>
            )}

            <button className="btn btn-fb w-100 mb-2" disabled={checkoutLoading} type="button" onClick={handleCheckout}>
              {checkoutLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Procesando compra...
                </>
              ) : (
                'Finalizar compra'
              )}
            </button>
            <button className="btn btn-outline-secondary w-100" type="button" onClick={clearCart}>
              Vaciar carrito
            </button>
          </aside>
        </div>
      </div>

      {/* Modal de confirmacion para eliminar item del carrito */}
      <ConfirmarModal
        show={Boolean(deleteTarget)}
        titulo="Eliminar del carrito"
        mensaje={
          deleteTarget
            ? `¿Estas seguro de eliminar "${deleteTarget.nombre}" del carrito?`
            : ''
        }
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </section>
  );
};

export default Cart;
