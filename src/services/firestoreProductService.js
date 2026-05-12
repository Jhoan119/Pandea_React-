/**
 * @fileoverview Servicio de Productos con Firestore
 * Maneja el CRUD de productos en Firebase Firestore.
 * Solo el administrador puede crear, editar y eliminar productos.
 *
 * Colección en Firestore: "products"
 * Cada documento tiene: name, price, img, category, brand, sizes, colors, createdAt
 */

import {
  collection, addDoc, getDocs, doc,
  updateDoc, deleteDoc, serverTimestamp, query, orderBy
} from "firebase/firestore";
import { db } from "../config/firebase";
import { ProductModel } from "../models/Product";

/** Referencia a la colección de productos en Firestore */
const productsRef = collection(db, "products");

/**
 * Servicio CRUD de productos con Firestore.
 */
export const firestoreProductService = {

  /**
   * Obtiene todos los productos de Firestore ordenados por fecha de creación.
   * @returns {Promise<ProductModel[]>} Lista de productos
   */
  async getAll() {
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => new ProductModel({
      id: doc.id,
      ...doc.data()
    }));
  },

  /**
   * Crea un nuevo producto en Firestore.
   * @param {Object} productData - Datos del producto
   * @param {string} productData.name - Nombre del producto
   * @param {number} productData.price - Precio en pesos
   * @param {string} productData.img - URL de la imagen (Cloudinary)
   * @param {string} productData.category - Categoría
   * @param {string} productData.brand - Marca
   * @param {string[]} productData.sizes - Tallas disponibles
   * @param {string[]} productData.colors - Colores en hex
   * @returns {Promise<string>} ID del documento creado
   */
  async create(productData) {
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  /**
   * Actualiza un producto existente en Firestore.
   * @param {string} id - ID del documento en Firestore
   * @param {Object} productData - Datos a actualizar
   * @returns {Promise<void>}
   */
  async update(id, productData) {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: serverTimestamp()
    });
  },

  /**
   * Elimina un producto de Firestore.
   * @param {string} id - ID del documento a eliminar
   * @returns {Promise<void>}
   */
  async delete(id) {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
  }
};
