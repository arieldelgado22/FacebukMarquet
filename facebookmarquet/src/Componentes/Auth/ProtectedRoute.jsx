import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Validando sesion...</p>;
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
