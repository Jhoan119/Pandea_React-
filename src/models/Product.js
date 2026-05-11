/**
 * @fileoverview Modelo de Producto
 * Define la estructura y comportamiento de un producto de la tienda.
 */

/**
 * Clase que representa un producto de Pandea.
 *
 * @example
 * const producto = new ProductModel({
 *   id: 1,
 *   name: "Camisa Casual",
 *   price: 85000,
 *   img: "/products/f1.jpg",
 *   category: "camisa",
 *   colors: ["#ffffff", "#000000"]
 * });
 * producto.getFormattedPrice(); // "$85.000"
 */
export class ProductModel {
  /**
   * @param {Object} params - Datos del producto
   * @param {number} params.id - ID único del producto
   * @param {string} params.name - Nombre del producto
   * @param {number} params.price - Precio en pesos colombianos
   * @param {string} params.img - Ruta de la imagen
   * @param {string} params.category - Categoría (camisa, sueter, pantalon, blusa)
   * @param {string} [params.brand] - Marca (por defecto "Pandea")
   * @param {string[]} [params.sizes] - Tallas disponibles
   * @param {string[]} [params.colors] - Colores disponibles en formato hex
   */
  constructor({ id, name, price, img, category, brand = "Pandea", sizes = ["XS","S","M","L","XL"], colors = [] }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.img = img;
    this.category = category;
    this.brand = brand;
    this.sizes = sizes;
    this.colors = colors;
  }

  /**
   * Formatea el precio con separador de miles.
   * @returns {string} Precio formateado (ej: "$85.000")
   */
  getFormattedPrice() {
    return `$${this.price.toLocaleString()}`;
  }
}
