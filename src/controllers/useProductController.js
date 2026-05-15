/**
 * @fileoverview Controlador de Productos
 * Maneja el estado de productos, filtros y búsqueda.
 * Ahora es asíncrono porque los productos vienen de Firestore.
 */

import { useState, useEffect } from "react";
import { productService } from "../services/productService";

/**
 * Hook que provee productos filtrados desde Firestore.
 * @returns {{
 *   products: ProductModel[],
 *   loading: boolean,
 *   category: string,
 *   setCategory: Function,
 *   query: string,
 *   setQuery: Function,
 *   reload: Function
 * }}
 */
export function useProductController() {
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [category,  setCategory]  = useState("all");
  const [query,     setQuery]     = useState("");

  /** Carga productos según filtro o búsqueda activa */
  async function loadProducts() {
    setLoading(true);
    try {
      let data;
      if (query.trim()) {
        data = await productService.search(query);
      } else {
        data = await productService.getByCategory(category);
      }
      setProducts(data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setLoading(false);
    }
  }

  /** Recarga cuando cambia categoría o búsqueda */
  useEffect(() => {
    loadProducts();
  }, [category, query]);

  return {
    products, loading,
    category, setCategory,
    query, setQuery,
    reload: loadProducts
  };
}
