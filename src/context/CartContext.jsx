/**
 * @fileoverview Contexto del Carrito de Compras
 * Provee el estado del carrito y sus acciones a toda la aplicación.
 * El carrito persiste mientras la sesión esté activa (se reinicia al recargar).
 *
 * @example
 * // Envolver la app con el proveedor
 * <CartProvider>
 *   <App />
 * </CartProvider>
 *
 * // Consumir en cualquier componente
 * const { cart, addToCart } = useCart();
 */

import { createContext, useContext, useState } from "react";
import { CartModel } from "../models/Cart";
import { cartService } from "../services/cartService";

/** @type {React.Context} Contexto del carrito */
const CartContext = createContext(null);

/**
 * Proveedor del carrito de compras.
 * Maneja el estado global del carrito y el drawer lateral.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export function CartProvider({ children }) {
  /** @type {CartModel} Estado actual del carrito */
  const [cart, setCart] = useState(new CartModel());

  /** @type {boolean} Controla si el drawer lateral está abierto */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Agrega un producto al carrito.
   * Si el producto ya existe, incrementa su cantidad.
   * @param {Object} product - Producto a agregar
   */
  const addToCart = (product) => {
    setCart(prev => cartService.addToCart(prev, product));
  };

  /**
   * Elimina un producto del carrito por su ID.
   * @param {number|string} productId - ID del producto
   */
  const removeFromCart = (productId) => {
    setCart(prev => cartService.removeFromCart(prev, productId));
  };

  /**
   * Actualiza la cantidad de un producto.
   * Si la cantidad es 0 o menos, elimina el producto.
   * @param {number|string} productId - ID del producto
   * @param {number} quantity - Nueva cantidad
   */
  const updateQuantity = (productId, quantity) => {
    setCart(prev => cartService.updateQuantity(prev, productId, quantity));
  };

  /** Vacía completamente el carrito */
  const clearCart = () => setCart(cartService.clearCart());

  /** Abre el drawer lateral del carrito */
  const openCart  = () => setIsOpen(true);

  /** Cierra el drawer lateral del carrito */
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider value={{
      cart, isOpen,
      addToCart, removeFromCart, updateQuantity, clearCart,
      openCart, closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * Hook para consumir el contexto del carrito.
 * Debe usarse dentro de un CartProvider.
 *
 * @returns {{
 *   cart: CartModel,
 *   isOpen: boolean,
 *   addToCart: Function,
 *   removeFromCart: Function,
 *   updateQuantity: Function,
 *   clearCart: Function,
 *   openCart: Function,
 *   closeCart: Function
 * }}
 */
export function useCart() {
  return useContext(CartContext);
}
