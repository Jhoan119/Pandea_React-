/**
 * @fileoverview Carrusel de Productos
 * Muestra los productos de Firestore en un carrusel automático con flechas.
 */

import { useState, useEffect, useRef } from "react";
import { productService } from "../../services/productService";
import { useCartController } from "../../controllers/useCartController";

export default function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const { handleAddToCart } = useCartController();
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const timerRef = useRef(null);

  const VISIBLE = 4;

  useEffect(() => {
    productService.getAll().then(setProducts);
  }, []);

  const total = products.length;
  const next = () => setCurrent(c => (c + 1) % total);
  const prev = () => setCurrent(c => (c - 1 + total) % total);

  useEffect(() => {
    if (paused || total === 0) return;
    timerRef.current = setInterval(next, 3000);
    return () => clearInterval(timerRef.current);
  }, [paused, current, total]);

  if (products.length === 0) return null;

  const visible = Array.from({ length: Math.min(VISIBLE, total) }, (_, i) =>
    products[(current + i) % total]
  );

  return (
    <section id="product-carousel">
      <div className="carousel-header">
        <h2>Nuestras Prendas</h2>
        <p>Desliza y descubre toda la colección</p>
      </div>

      <div className="carousel-wrapper"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}>

        <button className="carousel-arrow left" onClick={() => { prev(); setPaused(true); }}>
          <i className="fas fa-chevron-left" />
        </button>

        <div className="carousel-track">
          {visible.map((product, i) => (
            <div className="carousel-card" key={`${product.id}-${i}`}>
              <div className="carousel-img-wrap">
                <img src={product.img} alt={product.name} loading="lazy" />
                <button className="carousel-cart-btn" onClick={() => handleAddToCart(product)}>
                  <i className="bi bi-cart3" /> Agregar
                </button>
              </div>
              <div className="carousel-info">
                <span>{product.brand}</span>
                <h5>{product.name}</h5>
                <h4>{product.getFormattedPrice()}</h4>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-arrow right" onClick={() => { next(); setPaused(true); }}>
          <i className="fas fa-chevron-right" />
        </button>
      </div>

      <div className="carousel-dots">
        {products.map((_, i) => (
          <button key={i}
            className={`carousel-dot ${i === current ? "active" : ""}`}
            onClick={() => { setCurrent(i); setPaused(true); }} />
        ))}
      </div>
    </section>
  );
}
