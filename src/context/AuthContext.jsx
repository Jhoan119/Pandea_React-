/**
 * @fileoverview Contexto de Autenticación
 * Provee el estado del usuario logueado a toda la aplicación.
 * Usa Firebase onAuthStateChanged para mantener la sesión automáticamente.
 *
 * @example
 * // Envolver la app con el proveedor
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 *
 * // Consumir en cualquier componente
 * const { user } = useAuth();
 * if (user) console.log(user.getFirstName());
 */

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { UserModel } from "../models/User";

/** @type {React.Context} Contexto de autenticación */
const AuthContext = createContext(null);

/**
 * Proveedor de autenticación.
 * Escucha los cambios de sesión de Firebase y actualiza el estado global.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export function AuthProvider({ children }) {
  /** @type {UserModel|null} Usuario logueado o null si no hay sesión */
  const [user, setUser] = useState(null);

  /** @type {boolean} true mientras Firebase verifica la sesión inicial */
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suscribirse a cambios de sesión de Firebase
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Convertir el usuario de Firebase a nuestro modelo
        setUser(new UserModel({
          uid:         firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email:       firebaseUser.email,
          photoURL:    firebaseUser.photoURL,
        }));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cancelar suscripción al desmontar el componente
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {/* No renderizar hijos hasta que Firebase confirme el estado de sesión */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para consumir el contexto de autenticación.
 * Debe usarse dentro de un AuthProvider.
 *
 * @returns {{ user: UserModel|null, loading: boolean }}
 */
export function useAuth() {
  return useContext(AuthContext);
}
