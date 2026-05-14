/**
 * @fileoverview Servicio de Productos
 * Maneja el acceso a los datos de productos.
 * Por ahora los productos están en memoria — próximamente vendrán de Firestore.
 *
 * @todo Conectar con Firebase Firestore para productos dinámicos
 */

import { ProductModel } from "../models/Product";

/**
 * Lista de productos estáticos de la tienda.
 * Cada producto tiene: id, nombre, precio, imagen, categoría y colores.
 * @type {Array<Object>}
 */
const rawProducts = [
  { id: 1,  name: "Camisa Casual Azul",   price: 85000,  img: "/products/f1.jpg",  category: "camisa",   colors: ["#1e3a5f","#ffffff","#c8d8e8"] },
  { id: 2,  name: "Camisa Slim Fit",       price: 95000,  img: "/products/f2.jpg",  category: "camisa",   colors: ["#2d5016","#f5f5dc","#8b4513"] },
  { id: 3,  name: "Camisa Lino Blanca",    price: 90000,  img: "/products/f3.jpg",  category: "camisa",   colors: ["#ffffff","#f5f5dc","#d3d3d3"] },
  { id: 4,  name: "Camisa Oxford",         price: 88000,  img: "/products/f4.jpg",  category: "camisa",   colors: ["#4169e1","#ffffff","#808080"] },
  { id: 5,  name: "Blusa Floral",        price: 120000, img: "/products/f5.jpg",  category: "sueter",   colors: ["#8b0000","#2f4f4f","#f5deb3"] },
  { id: 6,  name: "Suéter Clásico",        price: 110000, img: "/products/f6.jpg",  category: "pantalon", colors: ["#d2b48c","#2f4f4f","#000000"] },
  { id: 7,  name: "Pantalon Chino",          price: 75000,  img: "/products/f7.jpg",  category: "blusa",    colors: ["#ff69b4","#ffffff","#98fb98"] },
  { id: 8,  name: "Camisa Rayas",          price: 92000,  img: "/products/f8.jpg",  category: "camisa",   colors: ["#000080","#ffffff","#dc143c"] },
  { id: 9,  name: "Camisa Manga Larga",    price: 98000,  img: "/products/f9.jpg",  category: "camisa",   colors: ["#ffffff","#000000","#708090"] },
  { id: 10, name: "Camisa Cuadros",        price: 87000,  img: "/products/f10.jpg", category: "camisa",   colors: ["#8b0000","#2f4f4f","#f5deb3"] },
  { id: 11, name: "Camisa Bordada",        price: 105000, img: "/products/f11.jpg", category: "camisa",   colors: ["#ffffff","#ffe4b5","#dda0dd"] },
  { id: 12, name: "Camisa Oversize",       price: 93000,  img: "/products/f12.jpg", category: "camisa",   colors: ["#808080","#000000","#ffffff"] },
];

/**
 * Servicio que provee acceso a los productos de la tienda.
 */
export const productService = {

  /**
   * Devuelve todos los productos de la tienda.
   * @returns {ProductModel[]} Lista completa de productos
   */
  getAll() {
    return rawProducts.map(p => new ProductModel(p));
  },

  /**
   * Filtra productos por categoría.
   * @param {string} category - Categoría a filtrar ("all" devuelve todos)
   * @returns {ProductModel[]} Productos de la categoría
   */
  getByCategory(category) {
    if (category === "all") return this.getAll();
    return this.getAll().filter(p => p.category === category);
  },

  /**
   * Busca productos por nombre (sin distinguir mayúsculas).
   * @param {string} query - Texto a buscar
   * @returns {ProductModel[]} Productos que coinciden con la búsqueda
   */
  search(query) {
    const q = query.toLowerCase();
    return this.getAll().filter(p => p.name.toLowerCase().includes(q));
  },

  /**
   * Busca un producto por su ID.
   * @param {number|string} id - ID del producto
   * @returns {ProductModel|null} Producto encontrado o null
   */
  getById(id) {
    const product = rawProducts.find(p => p.id === Number(id));
    return product ? new ProductModel(product) : null;
  }
};
