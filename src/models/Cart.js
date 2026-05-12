/**
 * @fileoverview Modelo de Carrito de Compras
 * Maneja la lógica del carrito de forma inmutable.
 * Cada operación devuelve un nuevo CartModel en lugar de modificar el actual.
 */

/**
 * Clase que representa el carrito de compras.
 * Es inmutable — cada modificación devuelve un nuevo carrito.
 *
 * @example
 * const carrito = new CartModel();
 * const carritoConProducto = carrito.addItem(producto);
 * carritoConProducto.getTotal(); // 85000
 */
export class CartModel {
  /**
   * @param {Array} [items=[]] - Lista de productos en el carrito
   */
  constructor(items = []) {
    this.items = items;
  }

  /**
   * Calcula el total del carrito multiplicando precio por cantidad.
   * @returns {number} Total en pesos colombianos
   */
  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  /**
   * Cuenta el total de unidades en el carrito.
   * @returns {number} Cantidad total de items
   */
  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Agrega un producto al carrito.
   * Si ya existe, incrementa la cantidad en 1.
   * @param {Object} product - Producto a agregar
   * @returns {CartModel} Nuevo carrito con el producto agregado
   */
  addItem(product) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      return new CartModel(
        this.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      );
    }
    return new CartModel([...this.items, { ...product, quantity: 1 }]);
  }

  /**
   * Elimina un producto del carrito por su ID.
   * @param {number|string} productId - ID del producto a eliminar
   * @returns {CartModel} Nuevo carrito sin el producto
   */
  removeItem(productId) {
    return new CartModel(this.items.filter(i => i.id !== productId));
  }
}
