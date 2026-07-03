import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <section className="marketplace-shell">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
            <span className="visually-hidden">Validando sesion...</span>
          </div>
          <p className="text-secondary mb-0">Validando sesion...</p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate replace to="/productos-nacionales" />;
  }

  return children;
}

export default ProtectedRoute;
