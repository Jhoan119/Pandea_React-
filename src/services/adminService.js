/**
 * @fileoverview Servicio de Administrador
 * Verifica si el usuario actual tiene permisos de administrador.
 * Los admins se guardan en la colección "admins" de Firestore.
 *
 * Estructura en Firestore:
 * admins/
 *   {uid}/
 *     email: "admin@pandea.com"
 */

import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Servicio para verificar permisos de administrador.
 */
export const adminService = {

  /**
   * Verifica si un usuario es administrador consultando Firestore.
   * @param {string} uid - UID del usuario de Firebase Auth
   * @returns {Promise<boolean>} true si es admin, false si no
   */
  async isAdmin(uid) {
    if (!uid) return false;
    const docRef = doc(db, "admins", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }
};
