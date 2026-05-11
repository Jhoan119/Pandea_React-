/**
 * @fileoverview Controlador de Productos
 * Hook que maneja el estado de filtros y búsqueda de productos.
 * Conecta la vista Shop con el productService.
 *
 * @example
 * const { products, setCategory, setQuery } = useProductController();
 * setCategory("camisa"); // filtra solo camisas
 * setQuery("azul");      // busca por nombre
 */

import { useState, useMemo } from "react";
import { productService } from "../services/productService";

/**
 * Hook que expone los productos filtrados y las acciones para filtrarlos.
 * Usa useMemo para no recalcular si no cambian los filtros.
 *
 * @returns {{
 *   products: ProductModel[],
 *   category: string,
 *   setCategory: Function,
 *   query: string,
 *   setQuery: Function
 * }}
 */
export function useProductController() {
  /** @type {string} Categoría activa ("all" muestra todos) */
  const [category, setCategory] = useState("all");

  /** @type {string} Texto de búsqueda actual */
  const [query, setQuery] = useState("");

  /**
   * Lista de productos filtrada.
   * Se recalcula solo cuando cambia category o query.
   * @type {ProductModel[]}
   */
  const products = useMemo(() => {
    if (query.trim()) return productService.search(query);
    return productService.getByCategory(category);
  }, [category, query]);

  return { products, category, setCategory, query, setQuery };
}
