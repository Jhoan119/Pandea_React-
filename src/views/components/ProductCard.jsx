/**
 * @fileoverview Componente ProductCard
 * Tarjeta de producto reutilizable que se usa en Home y Shop.
 * Al hacer clic en la tarjeta navega al detalle del producto.
 * El botón del carrito agrega directamente sin ir al detalle.
 *
 * @example
 * <ProductCard
 *   product={producto}
 *   onAddToCart={handleAddToCart}
 * />
 */

import { useNavigate } from "react-router-dom";

/**
 * Tarjeta de producto con imagen, nombre, precio y botón de carrito.
 *
 * @param {Object} props
 * @param {ProductModel} props.product - Producto a mostrar
 * @param {Function} props.onAddToCart - Función para agregar al carrito
 */
export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  return (
    <div
      className="pro"
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ cursor: "pointer" }}
    >
      {/* Imagen del producto */}
      <img src={product.img} alt={product.name} loading="lazy" />

      {/* Información del producto */}
      <div className="des">
        <span>{product.brand}</span>
        <h5>{product.name}</h5>

        {/* Estrellas de calificación */}
        <div className="star">
          <i className="fas fa-star" />
          <i className="fas fa-star" />
          <i className="fas fa-star" />
          <i className="fas fa-star" />
          <i className="fas fa-star-half-alt" />
        </div>

        <h4>{product.getFormattedPrice()}</h4>
      </div>

      {/*
       * Botón agregar al carrito
       * stopPropagation evita que el clic en el botón
       * también navegue al detalle del producto
       */}
      <button
        className="add-to-cart"
        onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
        aria-label="Agregar al carrito"
      >
        <i className="bi bi-cart3" />
      </button>
    </div>
  );
}
