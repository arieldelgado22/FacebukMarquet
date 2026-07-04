import { useEffect, useState } from 'react';
import './Footer.css';

function Footer() {
  const [equipo, setEquipo] = useState([]);

  useEffect(() => {
    fetch('/data/programadores.json')
      .then((response) => response.json())
      .then((data) => setEquipo(data));
  }, []);

  return (
    <footer className="footer">
      <div className="marketplace-shell">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>Facebook Marquet</h2>
            <p>Tu lugar para encontrar tecnologia, accesorios y oportunidades cerca tuyo.</p>
          </div>

          <div className="footer-team">
            <h3>Nuestro equipo</h3>
            <div className="team-grid">
              {equipo.map((persona) => (
                <div key={persona.id} className="dev-card">
                  <img src={persona.imagen} alt={persona.nombre} className="dev-img" />
                  <div className="dev-info">
                    <h4>{persona.nombre}</h4>
                    <p>{persona.informacion}</p>
                    <span>{persona.edad} años</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Facebook Marquet - Ariel Dev</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
