/**
 * @fileoverview Modal de Recuperar Contraseña
 * Envía un correo de recuperación usando Firebase Auth.
 * Muestra una pantalla de éxito cuando el correo fue enviado.
 *
 * @example
 * <ForgotModal
 *   onClose={() => setModal(null)}
 *   onLogin={() => setModal("login")}
 * />
 */

import { useState } from "react";
import { useAuthController } from "../../../controllers/useAuthController";

/**
 * Modal de recuperación de contraseña.
 *
 * @param {Object} props
 * @param {Function} props.onClose - Cierra el modal
 * @param {Function} props.onLogin - Vuelve al modal de login
 */
export default function ForgotModal({ onClose, onLogin }) {
  const { resetPassword, loading, error, clearError } = useAuthController();

  const [email,   setEmail]   = useState("");

  /** @type {boolean} true cuando el correo fue enviado exitosamente */
  const [success, setSuccess] = useState(false);

  /**
   * Envía el correo de recuperación.
   * Si es exitoso muestra la pantalla de confirmación.
   * @param {React.FormEvent} e
   */
  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await resetPassword(email);
    if (ok) setSuccess(true);
  }

  return (
    <div
      className="modal open"
      onClick={(e) => e.target.classList.contains("modal") && onClose()}
    >
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>&times;</button>

        <div className="form-header">
          <h2>Recuperar contraseña</h2>
          <p>Ingresa tu correo para recibir instrucciones</p>
        </div>

        {/* Pantalla de éxito — se muestra después de enviar el correo */}
        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <i className="fas fa-envelope-open-text"
               style={{ fontSize: 48, color: "#1a7f52", marginBottom: 16 }} />
            <p>¡Correo enviado! Revisa tu bandeja de entrada.</p>
            <button className="btn-submit" onClick={onClose}>Cerrar</button>
          </div>
        ) : (
          /* Formulario de recuperación */
          <form onSubmit={handleSubmit} noValidate>
            <label>CORREO ELECTRÓNICO</label>
            <div className="input-group">
              <i className="fas fa-envelope" />
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={e => { setEmail(e.target.value); clearError(); }}
                required
              />
            </div>

            {error && <span className="auth-error">{error}</span>}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading
                ? <><span className="spinner" /> Cargando...</>
                : "Enviar instrucciones"
              }
            </button>
          </form>
        )}

        <div className="divider"><span>¿Recordaste tu contraseña?</span></div>
        <button className="btn-outline" onClick={onLogin}>Iniciar sesión</button>
      </div>
    </div>
  );
}
