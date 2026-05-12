/**
 * @fileoverview Controlador del Panel de Administrador
 * Hook que maneja toda la lógica del panel admin:
 * - Verificar si el usuario es admin
 * - CRUD de productos
 * - Subida de imágenes a Cloudinary
 *
 * @example
 * const { isAdmin, products, createProduct } = useAdminController();
 */

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { adminService } from "../services/adminService";
import { firestoreProductService } from "../services/firestoreProductService";
import { cloudinaryService } from "../services/cloudinaryService";

/**
 * Hook del panel de administrador.
 * @returns {{
 *   isAdmin: boolean,
 *   loading: boolean,
 *   products: ProductModel[],
 *   createProduct: Function,
 *   updateProduct: Function,
 *   deleteProduct: Function,
 *   uploadImage: Function,
 *   error: string,
 *   success: string
 * }}
 */
export function useAdminController() {
  const { user } = useAuth();

  /** @type {boolean} true si el usuario logueado es administrador */
  const [isAdmin,   setIsAdmin]   = useState(false);

  /** @type {boolean} true mientras verifica permisos o carga datos */
  const [loading,   setLoading]   = useState(true);

  /** @type {ProductModel[]} Lista de productos de Firestore */
  const [products,  setProducts]  = useState([]);

  /** @type {string} Mensaje de error */
  const [error,     setError]     = useState("");

  /** @type {string} Mensaje de éxito */
  const [success,   setSuccess]   = useState("");

  /** Verifica si el usuario es admin y carga los productos al montar */
  useEffect(() => {
    async function init() {
      if (!user) { setLoading(false); return; }
      const admin = await adminService.isAdmin(user.uid);
      setIsAdmin(admin);
      if (admin) await loadProducts();
      setLoading(false);
    }
    init();
  }, [user]);

  /** Carga todos los productos de Firestore */
  async function loadProducts() {
    const data = await firestoreProductService.getAll();
    setProducts(data);
  }

  /**
   * Crea un nuevo producto en Firestore.
   * @param {Object} productData - Datos del producto sin imagen
   * @returns {Promise<boolean>} true si fue exitoso
   */
  async function createProduct(productData) {
    setError(""); setSuccess("");
    try {
      await firestoreProductService.create(productData);
      await loadProducts();
      setSuccess("¡Producto creado exitosamente!");
      return true;
    } catch (err) {
      setError("Error al crear el producto. Inténtalo de nuevo.");
      return false;
    }
  }

  /**
   * Actualiza un producto existente en Firestore.
   * @param {string} id - ID del documento
   * @param {Object} productData - Datos actualizados
   * @returns {Promise<boolean>} true si fue exitoso
   */
  async function updateProduct(id, productData) {
    setError(""); setSuccess("");
    try {
      await firestoreProductService.update(id, productData);
      await loadProducts();
      setSuccess("¡Producto actualizado exitosamente!");
      return true;
    } catch (err) {
      setError("Error al actualizar el producto.");
      return false;
    }
  }

  /**
   * Elimina un producto de Firestore.
   * @param {string} id - ID del documento a eliminar
   * @returns {Promise<boolean>} true si fue exitoso
   */
  async function deleteProduct(id) {
    setError(""); setSuccess("");
    try {
      await firestoreProductService.delete(id);
      await loadProducts();
      setSuccess("Producto eliminado.");
      return true;
    } catch (err) {
      setError("Error al eliminar el producto.");
      return false;
    }
  }

  /**
   * Sube una imagen a Cloudinary.
   * @param {File} file - Archivo de imagen
   * @returns {Promise<string|null>} URL de la imagen o null si falló
   */
  async function uploadImage(file) {
    try {
      return await cloudinaryService.uploadImage(file);
    } catch (err) {
      setError("Error al subir la imagen.");
      return null;
    }
  }

  return {
    isAdmin, loading, products,
    createProduct, updateProduct, deleteProduct,
    uploadImage, error, success
  };
}
