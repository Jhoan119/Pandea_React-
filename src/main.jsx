/**
 * @fileoverview Punto de Entrada de la Aplicación
 * Archivo que React usa para montar la app en el DOM.
 * Importa el CSS global y renderiza el componente App.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App";

/**
 * StrictMode activa advertencias adicionales en desarrollo.
 * No afecta el comportamiento en producción.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
