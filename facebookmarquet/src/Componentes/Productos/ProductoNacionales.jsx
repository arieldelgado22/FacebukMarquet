import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductosNacionales } from '../../services/productosNacionalesService';

const ProductosNacionales = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProductosNacionales()
      .then(setProductos)
      .catch((err) => {
        console.error(err);
        setError('No se pudieron cargar los productos nacionales.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="marketplace-shell">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
            <span className="visually-hidden">Cargando productos nacionales...</span>
          </div>
          <p className="text-secondary mb-0">Cargando productos nacionales...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="marketplace-shell">
        <div className="alert alert-danger text-center py-4 my-4" role="alert">
          <p className="fw-bold mb-1">Error al cargar productos</p>
          <p className="mb-0">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="marketplace-shell">
      <div className="marketplace-hero mb-4">
        <span className="badge text-bg-primary mb-2">Firestore</span>
        <h1 className="h2 fw-bold mb-2">Productos Nacionales</h1>
        <p className="text-secondary mb-0">
          Publicaciones administradas desde Firebase, listas para editar desde Gestion.
        </p>
      </div>

      <div className="row g-4">
        {productos.map((prod) => (
          <div className="col-12 col-md-6 col-xl-4" key={prod.firebaseId || prod.id}>
            <article className="marketplace-card h-100 overflow-hidden">
              <div className="bg-light d-flex align-items-center justify-content-center p-3" style={{ height: '220px' }}>
                {prod.imagen ? (
                  <img src={prod.imagen} alt={prod.nombre} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                ) : (
                  <span className="text-secondary">Sin imagen</span>
                )}
              </div>
              <div className="p-3">
                <p className="h4 fw-bold mb-1">${Number(prod.precio).toLocaleString('es-AR')}</p>
                <h3 className="h6 fw-semibold mb-2">{prod.nombre}</h3>
                <p className="text-secondary small mb-1">Categoria: {prod.categoria || 'Sin categoria'}</p>
                <p className="text-secondary small mb-3">Stock: {prod.stock} unidades</p>
                <Link className="btn btn-fb-soft w-100" to={`/productos-nacionales/${prod.id}`}>
                  Ver y comprar
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductosNacionales;
