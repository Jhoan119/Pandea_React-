/**
 * @fileoverview Modelo de Usuario
 * Define la estructura y comportamiento de un usuario autenticado.
 */

/**
 * Clase que representa un usuario de Pandea.
 * Se crea a partir de los datos que devuelve Firebase Auth.
 *
 * @example
 * const user = new UserModel({
 *   uid: "abc123",
 *   displayName: "Daniel Pedreros",
 *   email: "daniel@pandea.com"
 * });
 * user.getFirstName(); // "Daniel"
 */
export class UserModel {
  /**
   * @param {Object} params - Datos del usuario
   * @param {string} params.uid - ID único del usuario en Firebase
   * @param {string} params.displayName - Nombre completo
   * @param {string} params.email - Correo electrónico
   * @param {string|null} [params.photoURL] - URL de la foto de perfil
   */
  constructor({ uid, displayName, email, photoURL = null }) {
    this.uid = uid;
    this.displayName = displayName;
    this.email = email;
    this.photoURL = photoURL;
  }

  /**
   * Devuelve solo el primer nombre del usuario.
   * Se usa en el botón de Login del Navbar cuando el usuario está logueado.
   *
   * @returns {string} Primer nombre o "Usuario" si no hay nombre
   */
  getFirstName() {
    return this.displayName?.split(" ")[0] || "Usuario";
  }
}
