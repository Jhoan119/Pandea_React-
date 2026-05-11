/**
 * @fileoverview Controlador del Carrito
 * Hook que expone las acciones del carrito desde el CartContext.
 * Agrega lógica de UI como abrir el drawer al agregar un producto.
 *
 * @example
 * const { items, total, handleAddToCart } = useCartController();
 * handleAddToCart(producto); // agrega y abre el carrito
 */

import { useCart } from "../context/CartContext";

/**
 * Hook que conecta los componentes con el carrito de compras.
 * @returns {{
 *   items: Array,
 *   total: number,
 *   count: number,
 *   isOpen: boolean,
 *   handleAddToCart: Function,
 *   removeFromCart: Function,
 *   updateQuantity: Function,
 *   clearCart: Function,
 *   openCart: Function,
 *   closeCart: Function
 * }}
 */
export function useCartController() {
  const {
    cart, isOpen,
    addToCart, removeFromCart, updateQuantity,
    clearCart, openCart, closeCart
  } = useCart();

  /**
   * Agrega un producto al carrito y abre el drawer automáticamente.
   * @param {Object} product - Producto a agregar (con talla y color seleccionados)
   */
  function handleAddToCart(product) {
    addToCart(product);
    openCart();
  }

  return {
    items:    cart.items,
    total:    cart.getTotal(),
    count:    cart.getItemCount(),
    isOpen,
    handleAddToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
  };
}
