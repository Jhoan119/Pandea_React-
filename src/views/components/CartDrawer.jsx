import { useState } from "react";
import { useCartController } from "../../controllers/useCartController";

// ─── Configura aquí el número de WhatsApp del negocio ────────────────────────
// Formato: código de país + número, sin espacios ni símbolos
// Ejemplo Colombia: 573001234567
const WHATSAPP_NUMBER = "573001234567";

// ─── Genera el mensaje de WhatsApp con el resumen del pedido ─────────────────
function buildWhatsAppMessage(items, total) {
  const lines = items.map(
    (item) =>
      `• ${item.name}${item.size ? ` (Talla: ${item.size})` : ""} x${item.quantity} — $${(item.price * item.quantity).toLocaleString("es-CO")}`
  );

  const message = [
    "¡Hola! 👋 Me interesa hacer el siguiente pedido:",
    "",
    ...lines,
    "",
    `*Total: $${total.toLocaleString("es-CO")}*`,
    "",
    "¿Podrían confirmar disponibilidad y forma de pago? 😊",
  ].join("\n");

  return encodeURIComponent(message);
}

export default function CartDrawer() {
  const {
    items,
    total,
    count,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCartController();

  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  function handleWhatsApp() {
    const msg = buildWhatsAppMessage(items, total);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <>
      {/* ── Overlay ── */}
      <div
        onClick={closeCart}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 9998,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* ── Drawer ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 400,
          maxWidth: "100vw",
          height: "100vh",
          background: "#fff",
          boxShadow: "-6px 0 40px rgba(0,0,0,0.12)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          animation: "slideIn 0.3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 22px",
            borderBottom: "1px solid #f0f0f0",
            background: "#fafafa",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🛒</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>
              Mi carrito
            </span>
            {count > 0 && (
              <span
                style={{
                  background: "#088178",
                  color: "#fff",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 9px",
                }}
              >
                {count} {count === 1 ? "artículo" : "artículos"}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            style={{
              background: "#f0f0f0",
              border: "none",
              width: 32,
              height: 32,
              borderRadius: "50%",
              fontSize: 16,
              cursor: "pointer",
              color: "#555",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Items ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 22px" }}>
          {items.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "70px 0",
                color: "#bbb",
              }}
            >
              <div style={{ fontSize: 52, marginBottom: 14 }}>🛍️</div>
              <p style={{ fontWeight: 600, color: "#aaa", margin: 0 }}>
                Tu carrito está vacío
              </p>
              <p style={{ fontSize: 13, color: "#ccc", marginTop: 6 }}>
                Agrega productos para cotizar por WhatsApp
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: "14px 0",
                  borderBottom: "1px solid #f5f5f5",
                }}
              >
                {/* Imagen */}
                <img
                  src={item.img}
                  alt={item.name}
                  style={{
                    width: 72,
                    height: 72,
                    objectFit: "cover",
                    borderRadius: 10,
                    flexShrink: 0,
                    border: "1px solid #eee",
                  }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#1a1a1a",
                      lineHeight: 1.3,
                    }}
                  >
                    {item.name}
                  </p>

                  {/* Talla y color si existen */}
                  {(item.size || item.color) && (
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        marginTop: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      {item.size && (
                        <span
                          style={{
                            fontSize: 11,
                            background: "#f0f2fd",
                            color: "#3c52e3",
                            borderRadius: 6,
                            padding: "2px 7px",
                            fontWeight: 600,
                          }}
                        >
                          Talla {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 11,
                            background: "#f5f5f5",
                            borderRadius: 6,
                            padding: "2px 7px",
                            color: "#666",
                            fontWeight: 500,
                          }}
                        >
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: item.color,
                              border: "1px solid #ddd",
                              display: "inline-block",
                            }}
                          />
                          Color
                        </span>
                      )}
                    </div>
                  )}

                  {/* Precio + controles */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 8,
                    }}
                  >
                    <span
                      style={{
                        color: "#088178",
                        fontWeight: 700,
                        fontSize: 15,
                      }}
                    >
                      ${(item.price * item.quantity).toLocaleString("es-CO")}
                    </span>

                    {/* Cantidad */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0,
                        border: "1px solid #e8e8e8",
                        borderRadius: 20,
                        overflow: "hidden",
                      }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        style={{
                          width: 28,
                          height: 28,
                          border: "none",
                          background: "#f8f8f8",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: 15,
                          color: "#555",
                          transition: "background 0.15s",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          width: 28,
                          textAlign: "center",
                          fontWeight: 700,
                          fontSize: 13,
                          borderLeft: "1px solid #eee",
                          borderRight: "1px solid #eee",
                          lineHeight: "28px",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        style={{
                          width: 28,
                          height: 28,
                          border: "none",
                          background: "#f8f8f8",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: 15,
                          color: "#555",
                          transition: "background 0.15s",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Eliminar */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  title="Eliminar"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ccc",
                    cursor: "pointer",
                    fontSize: 16,
                    padding: "2px 4px",
                    flexShrink: 0,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#e74c3c")}
                  onMouseLeave={(e) => (e.target.style.color = "#ccc")}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {items.length > 0 && (
          <div
            style={{
              padding: "16px 22px 22px",
              borderTop: "1px solid #f0f0f0",
              background: "#fafafa",
            }}
          >
            {/* Subtotal */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
                fontSize: 13,
                color: "#888",
              }}
            >
              <span>Subtotal ({count} artículos)</span>
              <span>${total.toLocaleString("es-CO")}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                fontSize: 18,
                fontWeight: 700,
                color: "#1a1a1a",
              }}
            >
              <span>Total estimado</span>
              <span style={{ color: "#088178" }}>
                ${total.toLocaleString("es-CO")}
              </span>
            </div>

            {/* Banner WhatsApp */}
            <div
              style={{
                background: "linear-gradient(135deg, #e8f8f1 0%, #d5f5e8 100%)",
                border: "1px solid #b7e4c7",
                borderRadius: 12,
                padding: "10px 14px",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 20 }}>💬</span>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#1a5c38",
                  lineHeight: 1.4,
                }}
              >
                <strong>Pedido por WhatsApp:</strong> te enviamos el resumen y
                coordinamos el pago directo con el vendedor.
              </p>
            </div>

            {/* Botón WhatsApp principal */}
            <button
              onClick={handleWhatsApp}
              style={{
                width: "100%",
                padding: "14px",
                background: sent
                  ? "#1a7f52"
                  : "linear-gradient(135deg, #25D366 0%, #20bf5c 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 30,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                boxShadow: sent
                  ? "none"
                  : "0 4px 16px rgba(37,211,102,0.35)",
                transition: "all 0.25s ease",
                letterSpacing: "0.3px",
              }}
            >
              {sent ? (
                <>✅ ¡Pedido enviado a WhatsApp!</>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Pedir por WhatsApp
                </>
              )}
            </button>

            {/* Vaciar carrito */}
            <button
              onClick={clearCart}
              style={{
                width: "100%",
                padding: "9px",
                background: "none",
                color: "#aaa",
                border: "1px solid #eee",
                borderRadius: 30,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#e74c3c";
                e.target.style.borderColor = "#fcc";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#aaa";
                e.target.style.borderColor = "#eee";
              }}
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
