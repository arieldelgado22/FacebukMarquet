import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import styles from './ProductoDetalle.module.css';

const ProductoDetalle = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/data/productos.json')
      .then((res) => res.json())
      .then((data) => {
        const encontrado = data.find((p) => String(p.id) === String(id));
        setProducto(encontrado);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error cargando el JSON:', err);
        setCargando(false);
      });
  }, [id]);

  const incrementar = () => {
    if (cantidad < producto.stock) setCantidad((prev) => prev + 1);
  };

  const decrementar = () => {
    if (cantidad > 1) setCantidad((prev) => prev - 1);
  };

  const handleOnAdd = () => {
    addToCart(producto, cantidad);
    alert(`Agregaste ${cantidad} ${producto.nombre} al carrito.`);
  };

  if (cargando) return <div className="marketplace-shell text-center py-5"><h3>Cargando producto...</h3></div>;
  if (!producto) return <div className="marketplace-shell text-center py-5"><h3>Producto no encontrado</h3></div>;

  return (
    <section className="marketplace-shell">
      <div className={`${styles.card} marketplace-panel`}>
        <div className={styles.imageContainer}>
          <img src={producto.imagen} alt={producto.nombre} className={styles.mainImage} />
        </div>

        <div className={styles.content}>
          <nav className="small text-secondary mb-3">
            <Link to="/productos" className="fw-semibold">Marketplace</Link> / {producto.nombre}
          </nav>

          <h1 className="h2 fw-bold mb-2">{producto.nombre}</h1>
          <p className={styles.price}>$ {Number(producto.precio).toLocaleString('es-AR')}</p>
          <p className="text-secondary mb-4">{producto.descripcion || 'Sin descripcion disponible.'}</p>

          <div className="d-flex align-items-center gap-3 mb-4">
            <div className={styles.quantityControl}>
              <button className="btn btn-light rounded-circle" type="button" onClick={decrementar}>-</button>
              <span className="fw-bold">{cantidad}</span>
              <button className="btn btn-light rounded-circle" type="button" onClick={incrementar}>+</button>
            </div>
            <span className="text-secondary small">{producto.stock} disponibles</span>
          </div>

          <button className="btn btn-fb btn-lg w-100 mb-3" type="button" onClick={handleOnAdd}>
            Agregar al carrito
          </button>

          <Link to="/productos" className="btn btn-fb-soft w-100">Volver al listado</Link>
        </div>
      </div>
    </section>
  );
};

export default ProductoDetalle;
