/**
 * @fileoverview Servicio del Carrito
 * Contiene la lógica de negocio del carrito de compras.
 * Trabaja con CartModel de forma inmutable — siempre devuelve un nuevo carrito.
 */

import { CartModel } from "../models/Cart";

/**
 * Servicio que maneja las operaciones del carrito.
 * Cada método recibe el carrito actual y devuelve uno nuevo modificado.
 */
export const cartService = {

  /**
   * Agrega un producto al carrito.
   * @param {CartModel} cart - Carrito actual
   * @param {Object} product - Producto a agregar
   * @returns {CartModel} Nuevo carrito con el producto
   */
  addToCart(cart, product) {
    return cart.addItem(product);
  },

  /**
   * Elimina un producto del carrito.
   * @param {CartModel} cart - Carrito actual
   * @param {number|string} productId - ID del producto a eliminar
   * @returns {CartModel} Nuevo carrito sin el producto
   */
  removeFromCart(cart, productId) {
    return cart.removeItem(productId);
  },

  /**
   * Actualiza la cantidad de un producto.
   * Si la cantidad es 0 o menos, elimina el producto del carrito.
   * @param {CartModel} cart - Carrito actual
   * @param {number|string} productId - ID del producto
   * @param {number} quantity - Nueva cantidad
   * @returns {CartModel} Nuevo carrito con la cantidad actualizada
   */
  updateQuantity(cart, productId, quantity) {
    if (quantity <= 0) return cartService.removeFromCart(cart, productId);
    return new CartModel(
      cart.items.map(i => i.id === productId ? { ...i, quantity } : i)
    );
  },

  /**
   * Vacía completamente el carrito.
   * @returns {CartModel} Carrito vacío
   */
  clearCart() {
    return new CartModel([]);
  }
};
