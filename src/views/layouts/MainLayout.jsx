/**
 * @fileoverview Layout Principal
 * Estructura base que envuelve todas las páginas de la aplicación.
 * Incluye el Navbar arriba, el contenido en el medio y el Footer abajo.
 * También incluye el CartDrawer que es el carrito lateral.
 *
 * @example
 * // Se usa en App.jsx para envolver todas las rutas
 * <MainLayout>
 *   <Routes>...</Routes>
 * </MainLayout>
 */

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";

/**
 * Layout principal de la aplicación.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Página activa según la ruta
 */
export default function MainLayout({ children }) {
  return (
    <>
      {/* Barra de navegación superior — sticky, siempre visible */}
      <Navbar />

      {/* Carrito lateral — se muestra/oculta según isOpen en CartContext */}
      <CartDrawer />

      {/* Contenido de la página activa */}
      <main>{children}</main>

      {/* Pie de página */}
      <Footer />
    </>
  );
}
