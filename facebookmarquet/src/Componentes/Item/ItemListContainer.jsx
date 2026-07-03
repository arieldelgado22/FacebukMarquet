import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductosNacionales } from '../../services/productosNacionalesService';
import { ItemList } from './ItemList';

export function ItemListContainer({ Mensaje }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProductosNacionales()
      .then((productosFirestore) => setProductos(productosFirestore.slice(0, 3)))
      .catch((err) => {
        console.error(err);
        setError('No se pudieron cargar los productos nacionales.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="marketplace-shell">
      <div className="marketplace-hero mb-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <span className="badge text-bg-primary mb-3">Marketplace</span>
            <h1 className="display-6 fw-bold mb-3">Encontra productos nacionales cerca tuyo</h1>
            <p className="lead text-secondary mb-0">
              Publicaciones reales desde Firebase, listas para ver, comprar y administrar con login.
            </p>
          </div>
          <div className="col-lg-5">
            <div className="marketplace-panel p-3">
              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                <span className="fw-semibold">Destacados en home</span>
                <span className="fb-blue fw-bold">{productos.length}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Origen</span>
                <span className="fw-semibold">Firestore</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
        <h2 className="h3 fw-bold mb-0">{Mensaje}</h2>
        <Link className="btn btn-fb-soft" to="/productos-nacionales">
          Ver todos
        </Link>
      </div>

      {loading && <p className="text-center text-secondary py-5">Cargando destacados...</p>}
      {error && <p className="text-center text-danger py-5">{error}</p>}
      {!loading && !error && <ItemList productos={productos} />}
    </section>
  );
}
