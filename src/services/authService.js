/**
 * @fileoverview Servicio de Autenticación
 * Maneja toda la comunicación con Firebase Authentication.
 * Es la única capa que conoce Firebase — el resto de la app no lo toca.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut
} from "firebase/auth";
import { auth } from "../config/firebase";
import { UserModel } from "../models/User";

/**
 * Servicio de autenticación con Firebase.
 * Todos los métodos son asíncronos y devuelven un UserModel o lanzan un error.
 */
export const authService = {

  /**
   * Registra un nuevo usuario en Firebase.
   * @param {string} name - Nombre completo del usuario
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña (mínimo 6 caracteres)
   * @returns {Promise<UserModel>} Usuario creado
   * @throws {FirebaseError} Si el correo ya existe o la contraseña es débil
   */
  async register(name, email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    return new UserModel({
      uid: cred.user.uid,
      displayName: name,
      email: cred.user.email,
    });
  },

  /**
   * Inicia sesión con email y contraseña.
   * @param {string} email - Correo electrónico
   * @param {string} password - Contraseña
   * @returns {Promise<UserModel>} Usuario autenticado
   * @throws {FirebaseError} Si las credenciales son incorrectas
   */
  async login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return new UserModel({
      uid: cred.user.uid,
      displayName: cred.user.displayName,
      email: cred.user.email,
    });
  },

  /**
   * Cierra la sesión del usuario actual.
   * @returns {Promise<void>}
   */
  async logout() {
    await signOut(auth);
  },

  /**
   * Envía un correo de recuperación de contraseña.
   * @param {string} email - Correo del usuario
   * @returns {Promise<void>}
   * @throws {FirebaseError} Si el correo no existe
   */
  async resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  },

  /**
   * Traduce los códigos de error de Firebase al español.
   * @param {string} code - Código de error de Firebase (ej: "auth/user-not-found")
   * @returns {string} Mensaje de error en español
   */
  translateError(code) {
    const errors = {
      "auth/email-already-in-use":   "Este correo ya está registrado.",
      "auth/invalid-email":          "El correo no es válido.",
      "auth/weak-password":          "La contraseña debe tener al menos 6 caracteres.",
      "auth/user-not-found":         "No existe una cuenta con ese correo.",
      "auth/wrong-password":         "Contraseña incorrecta.",
      "auth/invalid-credential":     "Correo o contraseña incorrectos.",
      "auth/too-many-requests":      "Demasiados intentos. Espera un momento.",
      "auth/network-request-failed": "Sin conexión a internet.",
    };
    return errors[code] || "Ocurrió un error. Inténtalo de nuevo.";
  }
};
