/**
 * @fileoverview Modal de Registro
 * Formulario para crear una cuenta nueva en Pandea.
 * Valida que las contraseñas coincidan antes de enviar a Firebase.
 *
 * @example
 * <RegisterModal
 *   onClose={() => setModal(null)}
 *   onLogin={() => setModal("login")}
 * />
 */

import { useState } from "react";
import { useAuthController } from "../../../controllers/useAuthController";

/**
 * Modal de registro de usuario.
 *
 * @param {Object} props
 * @param {Function} props.onClose - Cierra el modal
 * @param {Function} props.onLogin - Abre el modal de login
 */
export default function RegisterModal({ onClose, onLogin }) {
  const { register, loading, error, clearError } = useAuthController();

  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [showPass,   setShowPass]   = useState(false);

  /** @type {string} Error de validación local (antes de llamar a Firebase) */
  const [localError, setLocalError] = useState("");

  /** Muestra el error local si existe, si no muestra el error de Firebase */
  const displayError = localError || error;

  /**
   * Valida el formulario y crea la cuenta.
   * Primero valida localmente, luego llama a Firebase.
   * @param {React.FormEvent} e
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");

    // Validaciones locales antes de llamar a Firebase
    if (password.length < 6) return setLocalError("La contraseña debe tener al menos 6 caracteres.");
    if (password !== confirm) return setLocalError("Las contraseñas no coinciden.");

    const ok = await register(name, email, password);
    if (ok) onClose();
  }

  return (
    <div
      className="modal open"
      onClick={(e) => e.target.classList.contains("modal") && onClose()}
    >
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>&times;</button>

        <div className="form-header">
          <h2>Crear cuenta</h2>
          <p>Únete a Pandea hoy</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label>NOMBRE COMPLETO</label>
          <div className="input-group">
            <i className="fas fa-user" />
            <input type="text" placeholder="Tu nombre" value={name}
              onChange={e => { setName(e.target.value); clearError(); }} required />
          </div>

          <label>CORREO ELECTRÓNICO</label>
          <div className="input-group">
            <i className="fas fa-envelope" />
            <input type="email" placeholder="correo@ejemplo.com" value={email}
              onChange={e => { setEmail(e.target.value); clearError(); }} required />
          </div>

          <label>CONTRASEÑA</label>
          <div className="input-group">
            <i className="fas fa-lock" />
            <input type={showPass ? "text" : "password"} placeholder="••••••••" value={password}
              onChange={e => { setPassword(e.target.value); clearError(); }} required />
            <i className={`fas ${showPass ? "fa-eye-slash" : "fa-eye"} toggle-pass`}
               onClick={() => setShowPass(p => !p)} />
          </div>

          <label>CONFIRMAR CONTRASEÑA</label>
          <div className="input-group">
            <i className="fas fa-lock" />
            <input type={showPass ? "text" : "password"} placeholder="••••••••" value={confirm}
              onChange={e => { setConfirm(e.target.value); setLocalError(""); }} required />
          </div>

          {displayError && <span className="auth-error">{displayError}</span>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <><span className="spinner" /> Cargando...</> : "Crear cuenta"}
          </button>
        </form>

        <div className="divider"><span>¿Ya tienes cuenta?</span></div>
        <button className="btn-outline" onClick={onLogin}>Iniciar sesión</button>
      </div>
    </div>
  );
}
