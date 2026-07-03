import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || '/gestion';

  if (isAuthenticated) {
    return <Navigate replace to={from} />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.email.trim() || formData.password.length < 6) {
      setError('Ingresa un email valido y una contrasena de al menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password);
      }
      navigate(from, { replace: true });
    } catch {
      setError('No se pudo autenticar el usuario. Revisa email, contrasena y Firebase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="marketplace-shell">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="marketplace-panel overflow-hidden">
            <div className="row g-0">
              <div className="col-md-5 bg-light p-4 p-lg-5">
                <span className="badge text-bg-primary mb-3">Acceso privado</span>
                <h1 className="h2 fw-bold mb-3">
                  {mode === 'login' ? 'Ingresar al panel' : 'Crear cuenta'}
                </h1>
                <p className="text-secondary mb-0">
                  Administra productos nacionales con Firebase Authentication y rutas protegidas.
                </p>
              </div>

              <div className="col-md-7 p-4 p-lg-5">
                <form className="d-grid gap-3" onSubmit={handleSubmit}>
                  {error && <div className="alert alert-danger mb-0">{error}</div>}

                  <div>
                    <label className="form-label fw-semibold" htmlFor="email">Email</label>
                    <input
                      autoComplete="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="tu@email.com"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="form-label fw-semibold" htmlFor="password">Contrasena</label>
                    <input
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      className="form-control"
                      id="password"
                      minLength="6"
                      name="password"
                      placeholder="Minimo 6 caracteres"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <button className="btn btn-fb btn-lg" disabled={loading} type="submit">
                    {loading ? 'Procesando...' : mode === 'login' ? 'Ingresar' : 'Registrarme'}
                  </button>
                  <button
                    className="btn btn-fb-soft"
                    type="button"
                    onClick={() => {
                      setError('');
                      setMode(mode === 'login' ? 'register' : 'login');
                    }}
                  >
                    {mode === 'login' ? 'Crear cuenta' : 'Ya tengo cuenta'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
