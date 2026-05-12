/**
 * @fileoverview Componente Footer
 * Pie de página de la aplicación con logo, navegación y redes sociales.
 * Se renderiza en todas las páginas a través del MainLayout.
 */

import { Link } from "react-router-dom";

/**
 * Footer de Pandea.
 * Contiene 3 columnas: descripción de la marca, links de navegación y redes sociales.
 */
export default function Footer() {
  return (
    <footer>
      <div className="footer-content section-p1">

        {/* Columna 1 — Descripción de la marca */}
        <div className="footer-col">
          <h2 className="logo-text">PANDEA</h2>
          <p>Tu tienda de moda favorita. Calidad y estilo en cada prenda.</p>
        </div>

        {/* Columna 2 — Links de navegación */}
        <div className="footer-col">
          <h4>Navegación</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/shop">Productos</Link></li>
            <li><Link to="/about">Acerca De</Link></li>
          </ul>
        </div>

        {/* Columna 3 — Redes sociales */}
        <div className="footer-col">
          <h4>Síguenos</h4>
          <div className="social-icons">
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook" /></a>
            <a href="#" aria-label="TikTok"><i className="fab fa-tiktok" /></a>
          </div>
        </div>

      </div>

      {/* Barra de derechos reservados */}
      <div className="footer-bottom">
        <p>© 2026 Pandea. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
