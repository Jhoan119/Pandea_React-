/**
 * @fileoverview Configuración de Firebase
 * Inicializa Firebase y exporta los servicios necesarios.
 * - auth: Autenticación de usuarios
 * - db: Firestore (base de datos)
 */

import { initializeApp }       from "firebase/app";
import { getAuth }             from "firebase/auth";
import { getFirestore }        from "firebase/firestore";

/** Credenciales del proyecto Firebase de Pandea */
const firebaseConfig = {
  apiKey:            "AIzaSyAHtQ0E74_tAyyFCoYrJNDLQqGb7U2DrS0",
  authDomain:        "pandea-tienda.firebaseapp.com",
  projectId:         "pandea-tienda",
  storageBucket:     "pandea-tienda.firebasestorage.app",
  messagingSenderId: "1027160232171",
  appId:             "1:1027160232171:web:8fe399396619b2e4702eae",
  measurementId:     "G-NM1CRLQXG4"
};

/** Instancia principal de Firebase */
const app = initializeApp(firebaseConfig);

/** Servicio de autenticación */
export const auth = getAuth(app);

/** Servicio de base de datos Firestore */
export const db = getFirestore(app);

export default app;
