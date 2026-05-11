/**
 * @fileoverview Página de Inicio (Home)
 * Página principal de Pandea. Contiene:
 * - Hero con imagen y llamado a la acción
 * - Carrusel de productos
 * - Productos destacados
 * - Banner promocional
 * - Newsletter
 */

import { Link } from "react-router-dom";
import { useCartController } from "../../controllers/useCartController";
import { useProductController } from "../../controllers/useProductController";
import ProductCard from "../components/ProductCard";
import ProductCarousel from "../components/ProductCarousel";

/**
 * Página principal de la tienda.
 * Muestra los primeros 8 productos como destacados.
 */
export default function Home() {
  const { handleAddToCart } = useCartController();
  const { products } = useProductController();

  /** Solo mostramos los primeros 8 productos como destacados */
  const featured = products.slice(0, 8);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────
          Sección principal con texto y imagen de modelo.
          El fondo es color lavanda definido en el CSS (#e6e9f8)
      ────────────────────────────────────────────────────── */}
      <section id="hero">
        <div className="hero-content">
          <p className="hero-tag">Oferta de intercambio</p>
          <h1>Grandes ofertas</h1>
          <h1 className="hero-highlight">On all products</h1>
          <p>¡Ahorra más hasta un 70% de descuento!</p>
          <Link to="/shop" className="btn-hero">Explorar ahora</Link>
        </div>
        <div className="hero-img">
          <img src="/img/hero4.png" alt="Modelo Pandea" />
        </div>
      </section>

      {/* ── CARRUSEL DE PRODUCTOS ─────────────────────────────
          Reemplaza el antiguo carrusel de iconos (INTUITIVA, LIGERA...)
          Muestra las prendas con auto-play y flechas manuales
      ────────────────────────────────────────────────────── */}
      <ProductCarousel />

      {/* ── PRODUCTOS DESTACADOS ──────────────────────────────
          Grid de los primeros 8 productos del catálogo
      ────────────────────────────────────────────────────── */}
      <section id="producto1" className="section-p1">
        <h2>Productos Destacados</h2>
        <p>Descubre nuestra selección especial</p>
        <div className="pro-container">
          {featured.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link to="/shop" className="btn-hero">Ver todos los productos</Link>
        </div>
      </section>

      {/* ── BANNER PROMOCIONAL ────────────────────────────────
          Franja oscura con imagen de fondo y oferta especial
      ────────────────────────────────────────────────────── */}
      <section id="banner" className="section-m1">
        <h4>Repair Services</h4>
        <h2>Up to <span>70% Off</span> — All T-Shirts & Accessories</h2>
        <Link to="/shop" className="btn-hero">Explore More</Link>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────
          Sección de suscripción por correo electrónico
      ────────────────────────────────────────────────────── */}
      <section id="newsletter" className="section-p1">
        <div className="newstext">
          <h4>Suscríbete a nuestro Newsletter</h4>
          <p>Recibe las últimas ofertas y novedades</p>
        </div>
        <div className="form">
          <input type="email" placeholder="Tu correo electrónico" />
          <button className="normal">Suscribirse</button>
        </div>
      </section>
    </>
  );
}
