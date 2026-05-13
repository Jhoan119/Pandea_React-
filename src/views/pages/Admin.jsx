/**
 * @fileoverview Panel de Administrador — Pandea
 * Panel completo con 5 secciones:
 *   - Dashboard (estadísticas y gráficas)
 *   - Pedidos
 *   - Productos (CRUD real con Firestore + Cloudinary)
 *   - Inventario de telas (mock — conectar a BD luego)
 *   - Clientes (mock — conectar a BD luego)
 *
 * Ruta: /admin
 * Acceso: Solo usuarios en la colección "admins" de Firestore
 */

import { useState, useEffect, useRef } from "react";
import { useAdminController }          from "../../controllers/useAdminController";
import { useAuth }                     from "../../context/AuthContext";
import {
  MOCK_METRICS, MOCK_ORDERS, ORDER_STATUS,
  MOCK_CLIENTS, MOCK_FABRICS, MOCK_FABRIC_MOVEMENTS,
} from "../../services/adminDashboardService";

// ─── Constantes del formulario de producto ────────────────────────────────────

const ALL_SIZES  = ["XS", "S", "M", "L", "XL"];
const CATEGORIES = ["Camisa", "Sueter", "Pantalon", "Blusa"];
const EMPTY_FORM = {
  name: "", price: "", category: "camisa",
  brand: "Pandea", sizes: ["S", "M", "L"], colors: ["#000000"], img: "",
};

// ─── Utilidades de formato ────────────────────────────────────────────────────

const fmt  = (n) => `$${Number(n).toLocaleString("es-CO")}`;
const fmtK = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${Math.round(n / 1000)}K`;

// ─── Estilos inline compartidos (evita afectar el CSS global de la tienda) ────

const S = {
  wrap:       { display: "flex", minHeight: "calc(100vh - 80px)", background: "#f8f7f4", fontFamily: "inherit" },
  sidebar:    (mobile, open) => ({
    width: mobile ? "85%" : 220,
    minWidth: mobile ? "auto" : 220,
    background: "#fff",
    borderRight: mobile ? "none" : "0.5px solid rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    position: mobile ? "fixed" : "relative",
    left: mobile ? 0 : undefined,
    top: mobile ? 0 : undefined,
    height: mobile ? "100vh" : undefined,
    zIndex: mobile ? 30 : undefined,
    transform: mobile ? `translateX(${open ? "0" : "-100%"})` : undefined,
    transition: mobile ? "transform 180ms ease" : undefined,
    boxShadow: mobile ? "0 20px 40px rgba(0,0,0,0.12)" : undefined,
  }),
  overlay:    { position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 20 },
  logo:       { padding: "20px 18px 14px", borderBottom: "0.5px solid rgba(0,0,0,0.08)" },
  logoName:   { fontSize: 16, fontWeight: 600, letterSpacing: ".5px", color: "#1a1a1a" },
  logoSub:    { fontSize: 11, color: "#999", marginTop: 2 },
  nav:        { padding: "10px 8px", flex: 1 },
  navLabel:   { fontSize: 10, color: "#bbb", padding: "8px 10px 4px", letterSpacing: ".8px", display: "block" },
  navBtn:     (active) => ({
    display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
    borderRadius: 8, cursor: "pointer", fontSize: 13, width: "100%",
    textAlign: "left", border: "none", marginBottom: 2,
    background: active ? "#f1efe8" : "transparent",
    color:      active ? "#1a1a1a" : "#666",
    fontWeight: active ? 500 : 400,
  }),
  main:       { flex: 1, overflowY: "auto", padding: "24px 28px" },
  topbar:     { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 },
  mobileMenuBtn: { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", background: "#fff", cursor: "pointer", fontSize: 14 },
  pageTitle:  { fontSize: 18, fontWeight: 600, color: "#1a1a1a" },
  pageSub:    { fontSize: 13, color: "#999", marginTop: 2 },
  btn:        { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", border: "0.5px solid rgba(0,0,0,0.2)", background: "#fff", color: "#1a1a1a" },
  btnPrimary: { display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", border: "none", background: "#1a1a1a", color: "#fff" },
  metrics:    (cols) => ({ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12, marginBottom: 20 }),
  metricCard: { background: "#f1efe8", borderRadius: 8, padding: "14px 16px" },
  metricLbl:  { fontSize: 12, color: "#888", marginBottom: 6 },
  metricVal:  { fontSize: 22, fontWeight: 600, color: "#1a1a1a" },
  metricDelta:{ fontSize: 11, marginTop: 4 },
  grid2:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  card:       { background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "16px 18px" },
  cardTitle:  { fontSize: 13, fontWeight: 500, color: "#1a1a1a", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" },
  cardTitleSub:{ fontWeight: 400, fontSize: 12, color: "#bbb" },
  fullCard:   { background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: "16px 18px", marginBottom: 16 },
  table:      { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th:         { textAlign: "left", fontWeight: 500, fontSize: 11, color: "#bbb", padding: "6px 8px", borderBottom: "0.5px solid rgba(0,0,0,0.08)" },
  td:         { padding: "9px 8px", borderBottom: "0.5px solid rgba(0,0,0,0.06)", color: "#1a1a1a", verticalAlign: "middle" },
  badge:      (bg, color) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: bg, color }),
  avatar:     (bg, color) => ({ width: 28, height: 28, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, background: bg, color, marginRight: 8 }),
  searchBar:  { display: "flex", alignItems: "center", gap: 8, marginBottom: 16 },
  input:      { flex: 1, padding: "7px 12px", borderRadius: 8, border: "0.5px solid rgba(0,0,0,0.2)", fontSize: 13, outline: "none" },
  tag:        { display: "inline-block", padding: "1px 7px", borderRadius: 12, fontSize: 11, background: "#f1efe8", color: "#666", marginRight: 4 },
  progressRow:{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 13 },
  progressLbl:{ minWidth: 130, color: "#666", fontSize: 12 },
  progressBar:{ flex: 1, height: 6, background: "#f1efe8", borderRadius: 4, overflow: "hidden" },
  progressFil:{ height: "100%", borderRadius: 4, background: "#1a1a1a" },
  progressPct:{ minWidth: 36, textAlign: "right", color: "#1a1a1a", fontWeight: 500, fontSize: 12 },
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Badge({ status }) {
  const s = ORDER_STATUS[status] || ORDER_STATUS.pendiente;
  return <span style={S.badge(s.bg, s.color)}>{s.label}</span>;
}

function Avatar({ initials, bg = "#e8e8e8", color = "#555" }) {
  return <span style={S.avatar(bg, color)}>{initials}</span>;
}

function StockBar({ stock, max, barColor }) {
  const pct = Math.round((stock / max) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 70, height: 6, background: "#f1efe8", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: barColor }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: stock <= 20 ? "#A32D2D" : "#1a1a1a" }}>
        {stock} m
      </span>
    </div>
  );
}

// ─── Sección: Dashboard ───────────────────────────────────────────────────────

function SectionDashboard() {
  const chartRef  = useRef(null);
  const donutRef  = useRef(null);
  const m = MOCK_METRICS;

  useEffect(() => {
    if (!window.Chart) return;
    const bar = new window.Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: m.weeklyLabels,
        datasets: [{ data: m.weeklyData, backgroundColor: "#2C2C2A", borderRadius: 4, label: "Ventas" }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#aaa", font: { size: 11 } } },
          y: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { color: "#aaa", font: { size: 11 }, callback: v => fmtK(v) } },
        },
      },
    });
    const donut = new window.Chart(donutRef.current, {
      type: "doughnut",
      data: {
        labels: m.categoryLabels,
        datasets: [{ data: m.categoryData, backgroundColor: ["#2C2C2A","#888780","#B4B2A9","#D3D1C7","#F1EFE8"], borderWidth: 0 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "65%",
        plugins: { legend: { position: "right", labels: { font: { size: 11 }, color: "#888", boxWidth: 10, padding: 10 } } },
      },
    });
    return () => { bar.destroy(); donut.destroy(); };
  }, []);

  return (
    <>
      <div style={S.metrics(4)}>
        <div style={S.metricCard}><div style={S.metricLbl}>Ventas del mes</div><div style={S.metricVal}>{fmtK(m.salesMonth)}</div><div style={{ ...S.metricDelta, color: "#3B6D11" }}>▲ +18% vs mes anterior</div></div>
        <div style={S.metricCard}><div style={S.metricLbl}>Pedidos totales</div><div style={S.metricVal}>{m.ordersMonth}</div><div style={{ ...S.metricDelta, color: "#3B6D11" }}>▲ +12 nuevos hoy</div></div>
        <div style={S.metricCard}><div style={S.metricLbl}>Clientes activos</div><div style={S.metricVal}>294</div><div style={{ ...S.metricDelta, color: "#3B6D11" }}>▲ +6 esta semana</div></div>
        <div style={S.metricCard}><div style={S.metricLbl}>Ticket promedio</div><div style={S.metricVal}>{fmtK(m.avgTicket)}</div><div style={{ ...S.metricDelta, color: "#A32D2D" }}>▼ -3% vs mes anterior</div></div>
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <div style={S.cardTitle}>Ventas por semana <span style={S.cardTitleSub}>Mayo 2026</span></div>
          <div style={{ position: "relative", height: 180 }}>
            <canvas ref={chartRef} role="img" aria-label="Ventas semanales mayo 2026" />
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Ventas por categoría <span style={S.cardTitleSub}>Acumulado</span></div>
          <div style={{ position: "relative", height: 180 }}>
            <canvas ref={donutRef} role="img" aria-label="Ventas por categoría" />
          </div>
        </div>
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <div style={S.cardTitle}>Productos más vendidos</div>
          {m.topProducts.map(p => (
            <div key={p.name} style={S.progressRow}>
              <span style={S.progressLbl}>{p.name}</span>
              <div style={S.progressBar}><div style={{ ...S.progressFil, width: `${p.pct}%` }} /></div>
              <span style={S.progressPct}>{p.pct}%</span>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Pedidos recientes</div>
          <table style={S.table}>
            <thead><tr><th style={S.th}>ID</th><th style={S.th}>Cliente</th><th style={S.th}>Total</th><th style={S.th}>Estado</th></tr></thead>
            <tbody>
              {MOCK_ORDERS.slice(0, 5).map(o => (
                <tr key={o.id}>
                  <td style={S.td}>{o.id}</td>
                  <td style={S.td}>{o.client.split(" ")[0]} {o.client.split(" ")[1]?.[0]}.</td>
                  <td style={S.td}>{fmt(o.total)}</td>
                  <td style={S.td}><Badge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── Sección: Pedidos ─────────────────────────────────────────────────────────

function SectionPedidos() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_ORDERS.filter(o =>
    o.client.toLowerCase().includes(search.toLowerCase()) ||
    o.id.includes(search)
  );
  const counts = { pendiente: 14, transito: 27, entregado: 91, cancelado: 6 };

  return (
    <>
      <div style={S.metrics(4)}>
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} style={S.metricCard}>
            <div style={S.metricLbl}>{ORDER_STATUS[k]?.label || k}</div>
            <div style={S.metricVal}>{v}</div>
          </div>
        ))}
      </div>
      <div style={S.fullCard}>
        <div style={S.searchBar}>
          <input style={S.input} placeholder="Buscar por ID o cliente..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>ID</th><th style={S.th}>Cliente</th><th style={S.th}>Productos</th>
              <th style={S.th}>Total</th><th style={S.th}>Fecha</th><th style={S.th}>Estado</th><th style={S.th}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td style={S.td}>{o.id}</td>
                <td style={S.td}><Avatar initials={o.initials} />{o.client}</td>
                <td style={S.td}>{o.products.map(p => <span key={p} style={S.tag}>{p}</span>)}</td>
                <td style={S.td}>{fmt(o.total)}</td>
                <td style={S.td}>{o.date}</td>
                <td style={S.td}><Badge status={o.status} /></td>
                <td style={S.td}><button style={{ ...S.btn, padding: "4px 10px", fontSize: 12 }}>Ver</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Sección: Productos (CRUD real) ───────────────────────────────────────────

function SectionProductos({ products, createProduct, updateProduct, deleteProduct, uploadImage, error, success }) {
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [view,      setView]      = useState("list");
  const [search,    setSearch]    = useState("");

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  function handleChange(field, value) { setForm(prev => ({ ...prev, [field]: value })); }
  function toggleSize(size) {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size],
    }));
  }
  function addColor()           { setForm(prev => ({ ...prev, colors: [...prev.colors, "#ffffff"] })); }
  function updateColor(i, val)  { setForm(prev => ({ ...prev, colors: prev.colors.map((c, idx) => idx === i ? val : c) })); }
  function removeColor(i)       { setForm(prev => ({ ...prev, colors: prev.colors.filter((_, idx) => idx !== i) })); }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) setForm(prev => ({ ...prev, img: url }));
    setUploading(false);
  }

  function handleEdit(product) {
    setForm({ name: product.name, price: product.price, category: product.category, brand: product.brand, sizes: product.sizes || [], colors: product.colors || ["#000000"], img: product.img });
    setEditingId(product.id);
    setView("form");
  }

  function handleCancel() { setForm(EMPTY_FORM); setEditingId(null); setView("list"); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.img)              return alert("Por favor sube una imagen.");
    if (!form.sizes.length)     return alert("Selecciona al menos una talla.");
    setSaving(true);
    const data = { ...form, price: Number(form.price) };
    const ok   = editingId ? await updateProduct(editingId, data) : await createProduct(data);
    setSaving(false);
    if (ok) handleCancel();
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    await deleteProduct(id);
  }

  // ── lista ──
  if (view === "list") return (
    <>
      {error   && <div style={{ background: "#FCEBEB", color: "#A32D2D", padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 13 }}>{error}</div>}
      {success && <div style={{ background: "#EAF3DE", color: "#3B6D11", padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 13 }}>{success}</div>}
      <div style={S.fullCard}>
        <div style={S.searchBar}>
          <input style={S.input} placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
          <button style={S.btnPrimary} onClick={() => setView("form")}>+ Nuevo producto</button>
        </div>
        {filtered.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", padding: 40 }}>No hay productos. ¡Crea el primero!</p>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Producto</th><th style={S.th}>Categoría</th>
                <th style={S.th}>Precio</th><th style={S.th}>Tallas</th><th style={S.th}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ ...S.td, display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={p.img} alt={p.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }} />
                    <span style={{ fontWeight: 500 }}>{p.name}</span>
                  </td>
                  <td style={S.td}><span style={S.tag}>{p.category}</span></td>
                  <td style={S.td}>{p.getFormattedPrice ? p.getFormattedPrice() : fmt(p.price)}</td>
                  <td style={S.td}>{(p.sizes || []).map(s => <span key={s} style={S.tag}>{s}</span>)}</td>
                  <td style={{ ...S.td, whiteSpace: "nowrap" }}>
                    <button style={{ ...S.btn, marginRight: 6, padding: "4px 10px", fontSize: 12 }} onClick={() => handleEdit(p)}>Editar</button>
                    <button style={{ ...S.btn, padding: "4px 10px", fontSize: 12, color: "#A32D2D", borderColor: "#f5c4c4" }} onClick={() => handleDelete(p.id, p.name)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );

  // ── formulario ──
  const formStyle = { maxWidth: 600 };
  const groupStyle = { marginBottom: 16 };
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 500, color: "#444", marginBottom: 6 };
  const fieldStyle = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "0.5px solid rgba(0,0,0,0.2)", fontSize: 13, outline: "none" };

  return (
    <div style={{ ...S.fullCard, ...formStyle }}>
      {error   && <div style={{ background: "#FCEBEB", color: "#A32D2D", padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 13 }}>{error}</div>}
      {success && <div style={{ background: "#EAF3DE", color: "#3B6D11", padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 13 }}>{success}</div>}

      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>{editingId ? "Editar producto" : "Nuevo producto"}</h3>

      <form onSubmit={handleSubmit} noValidate>
        <div style={groupStyle}>
          <label style={labelStyle}>Nombre *</label>
          <input style={fieldStyle} value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="Ej: Camisa Casual Azul" required />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Precio (COP) *</label>
            <input style={fieldStyle} type="number" value={form.price} onChange={e => handleChange("price", e.target.value)} placeholder="85000" required />
          </div>
          <div>
            <label style={labelStyle}>Marca</label>
            <input style={fieldStyle} value={form.brand} onChange={e => handleChange("brand", e.target.value)} />
          </div>
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Categoría *</label>
          <select style={fieldStyle} value={form.category} onChange={e => handleChange("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Tallas disponibles *</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ALL_SIZES.map(size => (
              <button key={size} type="button"
                onClick={() => toggleSize(size)}
                style={{
                  padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, border: "0.5px solid",
                  background: form.sizes.includes(size) ? "#1a1a1a" : "#fff",
                  color:      form.sizes.includes(size) ? "#fff"    : "#444",
                  borderColor:form.sizes.includes(size) ? "#1a1a1a" : "rgba(0,0,0,0.2)",
                }}>
                {size}
              </button>
            ))}
          </div>
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Colores disponibles</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {form.colors.map((color, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input type="color" value={color} onChange={e => updateColor(i, e.target.value)} style={{ width: 36, height: 36, borderRadius: 6, border: "none", cursor: "pointer" }} />
                {form.colors.length > 1 && (
                  <button type="button" onClick={() => removeColor(i)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 16 }}>✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addColor}
              style={{ ...S.btn, fontSize: 12, padding: "5px 10px" }}>+ Color</button>
          </div>
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>Imagen del producto *</label>
          <div
            onClick={() => document.getElementById("img-input").click()}
            style={{ border: "1.5px dashed rgba(0,0,0,0.15)", borderRadius: 10, padding: 20, textAlign: "center", cursor: "pointer", background: "#fafafa" }}>
            {form.img ? (
              <img src={form.img} alt="preview" style={{ maxHeight: 140, borderRadius: 8, objectFit: "cover" }} />
            ) : uploading ? (
              <p style={{ color: "#aaa", fontSize: 13 }}>Subiendo imagen...</p>
            ) : (
              <>
                <p style={{ color: "#aaa", fontSize: 13 }}>Haz clic para subir una imagen</p>
                <p style={{ color: "#ccc", fontSize: 11, marginTop: 4 }}>PNG, JPG hasta 10MB</p>
              </>
            )}
          </div>
          <input id="img-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button type="submit" style={S.btnPrimary} disabled={saving || uploading}>
            {saving ? "Guardando..." : editingId ? "Actualizar producto" : "Crear producto"}
          </button>
          <button type="button" style={S.btn} onClick={handleCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

// ─── Sección: Inventario de telas ─────────────────────────────────────────────

function SectionInventario() {
  const lowCount   = MOCK_FABRICS.filter(f => f.low).length;
  const totalStock = MOCK_FABRICS.reduce((s, f) => s + f.stock, 0);

  return (
    <>
      <div style={S.metrics(3)}>
        <div style={S.metricCard}><div style={S.metricLbl}>Stock total</div><div style={S.metricVal}>{totalStock} m</div><div style={{ ...S.metricDelta, color: "#888" }}>en {MOCK_FABRICS.length} tipos de tela</div></div>
        <div style={S.metricCard}><div style={S.metricLbl}>Telas en nivel bajo</div><div style={{ ...S.metricVal, color: "#A32D2D" }}>{lowCount}</div><div style={{ ...S.metricDelta, color: "#A32D2D" }}>requieren reposición</div></div>
        <div style={S.metricCard}><div style={S.metricLbl}>Última entrada</div><div style={{ ...S.metricVal, fontSize: 16, paddingTop: 4 }}>7 may</div><div style={{ ...S.metricDelta, color: "#888" }}>Lino crudo · 40m</div></div>
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <div style={S.cardTitle}>Stock actual por tela</div>
          {MOCK_FABRICS.map(f => (
            <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "0.5px solid rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", fontSize: 13 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: f.color, display: "inline-block", marginRight: 8 }} />
                {f.name}
                {f.low && <span style={{ ...S.badge("#FCEBEB", "#A32D2D"), fontSize: 10, marginLeft: 6 }}>Bajo</span>}
              </div>
              <StockBar stock={f.stock} max={f.maxStock} barColor={f.color} />
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Movimientos recientes</div>
          <table style={S.table}>
            <thead><tr><th style={S.th}>Tela</th><th style={S.th}>Tipo</th><th style={S.th}>Cantidad</th><th style={S.th}>Fecha</th></tr></thead>
            <tbody>
              {MOCK_FABRIC_MOVEMENTS.map((m, i) => (
                <tr key={i}>
                  <td style={S.td}>{m.fabric}</td>
                  <td style={S.td}>
                    {m.type === "entrada"
                      ? <span style={S.badge("#EAF3DE", "#3B6D11")}>Entrada</span>
                      : <span style={S.badge("#FCEBEB", "#A32D2D")}>Uso</span>}
                  </td>
                  <td style={{ ...S.td, color: m.qty > 0 ? "#3B6D11" : "#A32D2D", fontWeight: 500 }}>
                    {m.qty > 0 ? `+${m.qty}` : m.qty} m
                  </td>
                  <td style={{ ...S.td, color: "#aaa" }}>{m.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── Sección: Clientes ────────────────────────────────────────────────────────

function SectionClientes() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_CLIENTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={S.metrics(3)}>
        <div style={S.metricCard}><div style={S.metricLbl}>Total clientes</div><div style={S.metricVal}>294</div><div style={{ ...S.metricDelta, color: "#3B6D11" }}>▲ +6 esta semana</div></div>
        <div style={S.metricCard}><div style={S.metricLbl}>Compraron este mes</div><div style={S.metricVal}>87</div><div style={{ ...S.metricDelta, color: "#888" }}>30% del total</div></div>
        <div style={S.metricCard}><div style={S.metricLbl}>Clientes nuevos</div><div style={S.metricVal}>34</div><div style={{ ...S.metricDelta, color: "#3B6D11" }}>este mes</div></div>
      </div>
      <div style={S.fullCard}>
        <div style={S.searchBar}>
          <input style={S.input} placeholder="Buscar por nombre o correo..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Cliente</th><th style={S.th}>Correo</th>
              <th style={S.th}>Pedidos</th><th style={S.th}>Total gastado</th>
              <th style={S.th}>Último pedido</th><th style={S.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td style={{ ...S.td, display: "flex", alignItems: "center" }}>
                  <Avatar initials={c.initials} bg={c.avatarBg} color={c.avatarColor} />{c.name}
                </td>
                <td style={{ ...S.td, color: "#aaa" }}>{c.email}</td>
                <td style={S.td}>{c.orders}</td>
                <td style={S.td}>{fmt(c.total)}</td>
                <td style={{ ...S.td, color: "#aaa" }}>{c.lastOrder}</td>
                <td style={S.td}>
                  {c.active
                    ? <span style={S.badge("#EAF3DE", "#3B6D11")}>Activo</span>
                    : <span style={S.badge("#F1EFE8", "#888")}>Inactivo</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Admin() {
  const { user } = useAuth();
  const { isAdmin, loading, products, createProduct, updateProduct, deleteProduct, uploadImage, error, success } = useAdminController();
  const [section, setSection] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth <= 768);
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  // Carga Chart.js dinámicamente
  useEffect(() => {
    if (window.Chart) return;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    document.head.appendChild(script);
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: 80, color: "#aaa" }}>Verificando permisos...</div>;
  if (!user)   return <div style={{ textAlign: "center", padding: 80 }}><h2>Inicia sesión para acceder al panel.</h2></div>;
  if (!isAdmin)return <div style={{ textAlign: "center", padding: 80 }}><h2>No tienes permisos de administrador.</h2></div>;

  const NAV = [
    { id: "dashboard",  label: "Dashboard",          icon: "📊" },
    { id: "pedidos",    label: "Pedidos",             icon: "🛍️" },
    { id: "productos",  label: "Productos",           icon: "👔" },
    { id: "inventario", label: "Inventario de telas", icon: "🧵" },
    { id: "clientes",   label: "Clientes",            icon: "👥" },
  ];

  const TITLES = {
    dashboard:  { title: "Dashboard",          sub: "Resumen de Mayo 2026" },
    pedidos:    { title: "Pedidos",             sub: "138 pedidos este mes" },
    productos:  { title: "Productos",           sub: `${products.length} productos en Firestore` },
    inventario: { title: "Inventario de telas", sub: "8 tipos de tela registrados" },
    clientes:   { title: "Clientes",            sub: "294 clientes registrados" },
  };

  return (
    <div style={S.wrap}>
      {/* ── Sidebar ── */}
      {isMobile && menuOpen && <div style={S.overlay} onClick={() => setMenuOpen(false)} />}
      <aside style={S.sidebar(isMobile, menuOpen)}>
        <div style={S.logo}>
          <div style={S.logoName}>PANDEA</div>
          <div style={S.logoSub}>Panel de administración</div>
        </div>
        <nav style={S.nav}>
          {NAV.map(n => (
            <button
              key={n.id}
              style={S.navBtn(section === n.id)}
              onClick={() => {
                setSection(n.id);
                if (isMobile) setMenuOpen(false);
              }}
            >
              <span style={{ fontSize: 16 }}>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "10px 8px", borderTop: "0.5px solid rgba(0,0,0,0.08)" }}>
          <button style={S.navBtn(false)}>⚙️  Configuración</button>
        </div>
      </aside>

      {/* ── Contenido ── */}
      <main style={S.main}>
        <div style={{ ...S.topbar, alignItems: "center" }}>
          <div>
            <div style={S.pageTitle}>{TITLES[section].title}</div>
            <div style={S.pageSub}>{TITLES[section].sub}</div>
          </div>
          {isMobile && (
            <button style={S.mobileMenuBtn} onClick={() => setMenuOpen(prev => !prev)} aria-expanded={menuOpen}>
              ☰ Menú
            </button>
          )}
        </div>

        {section === "dashboard"  && <SectionDashboard />}
        {section === "pedidos"    && <SectionPedidos />}
        {section === "productos"  && (
          <SectionProductos
            products={products}
            createProduct={createProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            uploadImage={uploadImage}
            error={error}
            success={success}
          />
        )}
        {section === "inventario" && <SectionInventario />}
        {section === "clientes"   && <SectionClientes />}
      </main>
    </div>
  );
}
