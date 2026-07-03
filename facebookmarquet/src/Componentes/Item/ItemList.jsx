import { Item } from './Item';

export function ItemList({ productos }) {
  return (
    <div className="row g-4">
      {productos.map((prod) => (
        <div className="col-12 col-md-6 col-xl-4" key={prod.id}>
          <Item {...prod} />
        </div>
      ))}
    </div>
  );
}
