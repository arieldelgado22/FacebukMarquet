import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProductoNacionalById } from '../../services/productosNacionalesService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './ProductoNacionalesDetalle.module.css';

const ProductosNacionalesDetalle = () => {
  const [prod, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [message, setMessage] = useState(null);
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getProductoNacionalById(id)
      .then(setItem)
      .catch((err) => {
        console.error(err);
        setItem(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const incrementar = () => {
    if (prod && cantidad < prod.stock) {
      setCantidad((currentCantidad) => currentCantidad + 1);
    }
  };

  const decrementar = () => {
    if (cantidad > 1) {
      setCantidad((currentCantidad) => currentCantidad - 1);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    addToCart(
      {
        id: prod.id,
        firebaseId: prod.firebaseId,
        nombre: prod.nombre,
        precio: prod.precio,
        imagen: prod.imagen,
        stock: prod.stock,
      },
      cantidad,
    );
    setMessage({ type: 'success', text: `${cantidad} ${prod.nombre} agregado al carrito.` });
  };

  if (loading) {
    return <p className="text-center text-secondary py-5">Cargando producto...</p>;
  }

  if (!prod) {
    return <p className="text-center text-secondary py-5">Producto no encontrado.</p>;
  }

  return (
    <section className="marketplace-shell">
      <div className={`${styles.detailCard} marketplace-panel`}>
        <div className={styles.imageArea}>
          {prod.imagen && prod.imagen !== '-' ? (
            <img src={prod.imagen} alt={prod.nombre} />
          ) : (
            <span className="text-secondary">Sin imagen</span>
          )}
        </div>
        <div className={styles.infoArea}>
          <span className="badge text-bg-light border mb-3">{prod.categoria || 'Sin categoria'}</span>
          <h1 className="h2 fw-bold mb-2">{prod.nombre}</h1>
          <p className={styles.price}>${Number(prod.precio).toLocaleString('es-AR')}</p>
          <p className="text-secondary">Stock disponible: {prod.stock} unidades</p>

          {message && (
            <div className={`alert alert-${message.type}`} role="alert">
              {message.text}
            </div>
          )}

          <div className="d-flex align-items-center gap-3 my-4">
            <div className={styles.quantityControl}>
              <button className="btn btn-light rounded-circle" type="button" onClick={decrementar}>-</button>
              <span className="fw-bold">{cantidad}</span>
              <button className="btn btn-light rounded-circle" type="button" onClick={incrementar} disabled={cantidad >= prod.stock}>+</button>
            </div>
            <span className="text-secondary small">
              {isAuthenticated ? 'Listo para agregar al carrito' : 'Inicia sesion para comprar'}
            </span>
          </div>

          <button className="btn btn-fb btn-lg w-100" type="button" onClick={handleAddToCart}>
            {isAuthenticated ? 'Agregar al carrito' : 'Ingresar para comprar'}
          </button>

          <Link className="btn btn-fb-soft w-100 mt-3" to="/productos-nacionales">
            Volver a productos nacionales
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductosNacionalesDetalle;
