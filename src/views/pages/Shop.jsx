/**
 * @fileoverview Página de Tienda (Shop)
 * Muestra todos los productos con filtros por categoría y búsqueda por nombre.
 * Los filtros y la búsqueda se manejan en useProductController.
 *
 * Filtros disponibles:
 * - Todos
 * - Camisas
 * - Suéteres
 * - Pantalones
 * - Blusas
 */

import { useProductController } from "../../controllers/useProductController";
import { useCartController } from "../../controllers/useCartController";
import ProductCard from "../components/ProductCard";

/**
 * Opciones de filtro disponibles en la tienda.
 * @type {Array<{label: string, value: string}>}
 */
const FILTERS = [
  { label: "Todos",      value: "all"      },
  { label: "Camisas",    value: "camisa"   },
  { label: "Suéteres",   value: "sueter"   },
  { label: "Pantalones", value: "pantalon" },
  { label: "Blusas",     value: "blusa"    },
];

/**
 * Página de tienda con filtros y búsqueda.
 * Muestra un mensaje cuando no hay productos que coincidan con la búsqueda.
 */
export default function Shop() {
  const { products, category, setCategory, query, setQuery } = useProductController();
  const { handleAddToCart } = useCartController();

  return (
    <section id="shop-page" className="section-p1">

      {/* ── Encabezado con búsqueda ── */}
      <div className="shop-header">
        <h2>Todos los Productos</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button><i className="fas fa-search" /></button>
        </div>
      </div>

      {/* ── Filtros por categoría ──
          Al seleccionar un filtro se limpia la búsqueda y viceversa
      ── */}
      <div className="filter-bar">
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={`filter-btn ${category === f.value ? "active" : ""}`}
            onClick={() => { setCategory(f.value); setQuery(""); }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Grid de productos ──
          Si no hay resultados muestra un mensaje amigable
      ── */}
      <div className="pro-container">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px", width: "100%" }}>
            <i className="fas fa-search" style={{ fontSize: 48, color: "#ccc", marginBottom: 16 }} />
            <p>No se encontraron productos.</p>
          </div>
        )}
      </div>
    </section>
  );
}
