import './Header.css';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

function Header() {
  const { getCartQuantity } = useCart();
  const { isAdmin, isAuthenticated, logout, user } = useAuth();
  const totalItems = getCartQuantity();

  return (
    <header className="market-header">
      <nav className="navbar navbar-expand-lg bg-white">
        <div className="container-fluid market-nav">
          <Link className="navbar-brand market-brand" to="/">
            <span className="brand-mark">f</span>
            <span>Facebook Marquet</span>
          </Link>

          <button
            aria-controls="marketNavbar"
            aria-expanded="false"
            aria-label="Abrir navegacion"
            className="navbar-toggler"
            data-bs-target="#marketNavbar"
            data-bs-toggle="collapse"
            type="button"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="marketNavbar">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
              <li className="nav-item">
                <NavLink className="nav-link market-link" to="/">
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link market-link" to="/productos-nacionales">
                  Productos Nacionales
                </NavLink>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <NavLink className="nav-link market-link" to="/gestion">
                    Gestion
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <NavLink className="nav-link market-link cart-link" to="/carrito">
                  Carrito
                  {totalItems > 0 && <span className="badge rounded-pill text-bg-primary">{totalItems}</span>}
                </NavLink>
              </li>
              <li className="nav-item">
                {isAuthenticated ? (
                  <button className="btn btn-sm btn-outline-secondary market-user" type="button" onClick={logout}>
                    Salir {user?.email ? `(${user.email})` : ''}
                  </button>
                ) : (
                  <NavLink className="btn btn-sm btn-fb" to="/login">
                    Ingresar
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
