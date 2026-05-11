/**
 * @fileoverview Controlador de Autenticación
 * Hook personalizado que conecta los componentes de vista con el authService.
 * Maneja estados de carga y errores para que la vista no tenga que hacerlo.
 *
 * @example
 * // Uso en un componente
 * const { login, loading, error } = useAuthController();
 * await login("daniel@pandea.com", "123456");
 */

import { useState } from "react";
import { authService } from "../services/authService";

/**
 * Hook que expone las acciones de autenticación con manejo de estado.
 * @returns {{
 *   login: Function,
 *   register: Function,
 *   resetPassword: Function,
 *   logout: Function,
 *   loading: boolean,
 *   error: string,
 *   clearError: Function
 * }}
 */
export function useAuthController() {
  /** @type {boolean} true mientras espera respuesta de Firebase */
  const [loading, setLoading] = useState(false);

  /** @type {string} Mensaje de error traducido al español */
  const [error, setError] = useState("");

  /** Limpia el mensaje de error actual */
  const clearError = () => setError("");

  /**
   * Inicia sesión con email y contraseña.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<boolean>} true si fue exitoso, false si hubo error
   */
  async function login(email, password) {
    setLoading(true); setError("");
    try {
      await authService.login(email, password);
      return true;
    } catch (err) {
      setError(authService.translateError(err.code));
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Registra un nuevo usuario.
   * @param {string} name - Nombre completo
   * @param {string} email
   * @param {string} password
   * @returns {Promise<boolean>} true si fue exitoso
   */
  async function register(name, email, password) {
    setLoading(true); setError("");
    try {
      await authService.register(name, email, password);
      return true;
    } catch (err) {
      setError(authService.translateError(err.code));
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Envía correo de recuperación de contraseña.
   * @param {string} email
   * @returns {Promise<boolean>} true si el correo fue enviado
   */
  async function resetPassword(email) {
    setLoading(true); setError("");
    try {
      await authService.resetPassword(email);
      return true;
    } catch (err) {
      setError(authService.translateError(err.code));
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Cierra la sesión del usuario actual.
   * @returns {Promise<void>}
   */
  async function logout() {
    await authService.logout();
  }

  return { login, register, resetPassword, logout, loading, error, clearError };
}
