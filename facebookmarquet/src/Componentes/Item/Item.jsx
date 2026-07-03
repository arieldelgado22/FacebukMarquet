import { Link } from 'react-router-dom';
import styles from './Item.module.css';

export function Item({ id, nombre, precio, stock, imagen, categoria }) {
  return (
    <article className={`${styles.itemCard} marketplace-card h-100`}>
      <div className={styles.imageWrap}>
        {imagen ? (
          <img src={imagen} alt={nombre} className={styles.itemImage} />
        ) : (
          <span className="text-secondary">Sin imagen</span>
        )}
      </div>

      <div className="p-3">
        <p className="h4 fw-bold mb-1">${Number(precio).toLocaleString('es-AR')}</p>
        <h3 className="h6 fw-semibold text-truncate mb-2">{nombre}</h3>
        <p className="text-secondary small mb-1">{categoria || 'Sin categoria'}</p>
        <p className="text-secondary small mb-3">Stock disponible: {stock}</p>

        <Link className="btn btn-fb w-100" to={`/productos-nacionales/${id}`}>
          Ver y comprar
        </Link>
      </div>
    </article>
  );
}
