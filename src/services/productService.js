/**
 * @fileoverview Servicio de Productos
 * Obtiene los productos desde Firebase Firestore.
 * Los productos son creados por el administrador desde el panel /admin.
 */

import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import { ProductModel } from "../models/Product";

/** Referencia a la colección de productos en Firestore */
const productsRef = collection(db, "products");

export const productService = {

  /**
   * Obtiene todos los productos de Firestore.
   * @returns {Promise<ProductModel[]>}
   */
  async getAll() {
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => new ProductModel({ id: d.id, ...d.data() }));
  },

  /**
   * Filtra productos por categoría.
   * @param {string} category
   * @returns {Promise<ProductModel[]>}
   */
  async getByCategory(category) {
    const all = await this.getAll();
    if (category === "all") return all;
    return all.filter(p => p.category === category);
  },

  /**
   * Busca productos por nombre.
   * @param {string} query
   * @returns {Promise<ProductModel[]>}
   */
  async search(queryText) {
    const all = await this.getAll();
    const q = queryText.toLowerCase();
    return all.filter(p => p.name.toLowerCase().includes(q));
  },

  /**
   * Obtiene un producto por su ID.
   * @param {string} id
   * @returns {Promise<ProductModel|null>}
   */
  async getById(id) {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return new ProductModel({ id: docSnap.id, ...docSnap.data() });
  }
};
