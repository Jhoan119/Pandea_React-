/**
 * @fileoverview Panel de Administrador
 * Página exclusiva para el administrador de Pandea.
 * Permite crear, editar y eliminar productos con imágenes.
 *
 * Acceso: Solo usuarios registrados en la colección "admins" de Firestore.
 * Ruta: /admin
 */

import { useState } from "react";
import { useAdminController } from "../../controllers/useAdminController";
import { useAuth } from "../../context/AuthContext";

/** Tallas disponibles para seleccionar */
const ALL_SIZES = ["XS", "S", "M", "L", "XL"];

/** Categorías disponibles */
const CATEGORIES = ["camisa", "sueter", "pantalon", "blusa"];

/**
 * Estado inicial del formulario de producto.
 * Se usa tanto para crear como para resetear el formulario.
 */
const EMPTY_FORM = {
  name:     "",
  price:    "",
  category: "camisa",
  brand:    "Pandea",
  sizes:    ["S", "M", "L"],
  colors:   ["#000000"],
  img:      ""
};

/**
 * Panel de administración de productos.
 * Muestra acceso denegado si el usuario no es admin.
 */
export default function Admin() {
  const { user } = useAuth();
  const {
    isAdmin, loading, products,
    createProduct, updateProduct, deleteProduct,
    uploadImage, error, success
  } = useAdminController();

  /** @type {Object} Datos del formulario */
  const [form, setForm] = useState(EMPTY_FORM);

  /** @type {string|null} ID del producto que se está editando */
  const [editingId, setEditingId] = useState(null);

  /** @type {boolean} true mientras sube la imagen */
  const [uploading, setUploading] = useState(false);

  /** @type {boolean} true mientras guarda el producto */
  const [saving, setSaving] = useState(false);

  /** @type {string} Vista activa: "list" o "form" */
  const [view, setView] = useState("list");

  // ── Estados de carga ────────────────────────────────────
  if (loading) return (
    <div style={{ textAlign: "center", padding: 80 }}>
      <span className="spinner" style={{ width: 40, height: 40 }} />
      <p>Verificando permisos...</p>
    </div>
  );

  // ── Acceso denegado ─────────────────────────────────────
  if (!user) return (
    <div className="admin-denied">
      <i className="fas fa-lock" />
      <h2>Acceso restringido</h2>
      <p>Debes iniciar sesión para ver esta página.</p>
    </div>
  );

  if (!isAdmin) return (
    <div className="admin-denied">
      <i className="fas fa-ban" />
      <h2>Sin permisos</h2>
      <p>No tienes permisos de administrador.</p>
    </div>
  );

  // ── Manejo del formulario ───────────────────────────────

  /** Actualiza un campo del formulario */
  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  /** Agrega o quita una talla del array de tallas */
  function toggleSize(size) {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  }

  /** Agrega un color nuevo al array */
  function addColor() {
    setForm(prev => ({ ...prev, colors: [...prev.colors, "#ffffff"] }));
  }

  /** Actualiza un color específico por índice */
  function updateColor(index, value) {
    setForm(prev => ({
      ...prev,
      colors: prev.colors.map((c, i) => i === index ? value : c)
    }));
  }

  /** Elimina un color por índice */
  function removeColor(index) {
    setForm(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  }

  /**
   * Maneja la subida de imagen a Cloudinary.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) setForm(prev => ({ ...prev, img: url }));
    setUploading(false);
  }

  /**
   * Carga un producto en el formulario para editarlo.
   * @param {ProductModel} product
   */
  function handleEdit(product) {
    setForm({
      name:     product.name,
      price:    product.price,
      category: product.category,
      brand:    product.brand,
      sizes:    product.sizes,
      colors:   product.colors,
      img:      product.img
    });
    setEditingId(product.id);
    setView("form");
  }

  /** Cancela la edición y resetea el formulario */
  function handleCancel() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setView("list");
  }

  /**
   * Guarda el producto (crea o actualiza según editingId).
   * @param {React.FormEvent} e
   */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.img) return alert("Por favor sube una imagen.");
    if (form.sizes.length === 0) return alert("Selecciona al menos una talla.");

    setSaving(true);
    const data = { ...form, price: Number(form.price) };
    const ok = editingId
      ? await updateProduct(editingId, data)
      : await createProduct(data);

    setSaving(false);
    if (ok) {
      setForm(EMPTY_FORM);
      setEditingId(null);
      setView("list");
    }
  }

  /**
   * Elimina un producto previa confirmación.
   * @param {string} id
   * @param {string} name
   */
  async function handleDelete(id, name) {
    if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    await deleteProduct(id);
  }

  // ── Render ──────────────────────────────────────────────
  return (
    <section id="admin-panel" className="section-p1">

      {/* Encabezado */}
      <div className="admin-header">
        <div>
          <h2>Panel de Administrador</h2>
          <p>Gestiona los productos de Pandea</p>
        </div>
        {view === "list" ? (
          <button className="btn-hero" onClick={() => setView("form")}>
            <i className="fas fa-plus" /> Nuevo Producto
          </button>
        ) : (
          <button className="btn-back" onClick={handleCancel}>
            <i className="fas fa-arrow-left" /> Volver a la lista
          </button>
        )}
      </div>

      {/* Mensajes de éxito y error */}
      {error   && <div className="admin-alert error">  <i className="fas fa-exclamation-circle" /> {error}   </div>}
      {success && <div className="admin-alert success"> <i className="fas fa-check-circle" />      {success} </div>}

      {/* ── LISTA DE PRODUCTOS ── */}
      {view === "list" && (
        <div className="admin-grid">
          {products.length === 0 ? (
            <div className="admin-empty">
              <i className="fas fa-box-open" />
              <p>No hay productos aún. ¡Crea el primero!</p>
            </div>
          ) : (
            products.map(product => (
              <div className="admin-card" key={product.id}>
                <img src={product.img} alt={product.name} />
                <div className="admin-card-info">
                  <span className="admin-category">{product.category}</span>
                  <h4>{product.name}</h4>
                  <p className="admin-price">{product.getFormattedPrice()}</p>
                  <div className="admin-card-actions">
                    <button className="btn-edit" onClick={() => handleEdit(product)}>
                      <i className="fas fa-edit" /> Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(product.id, product.name)}>
                      <i className="fas fa-trash" /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── FORMULARIO CREAR / EDITAR ── */}
      {view === "form" && (
        <form className="admin-form" onSubmit={handleSubmit} noValidate>
          <h3>{editingId ? "Editar Producto" : "Nuevo Producto"}</h3>

          {/* Nombre */}
          <div className="form-group">
            <label>Nombre del producto *</label>
            <input type="text" placeholder="Ej: Camisa Casual Azul"
              value={form.name} onChange={e => handleChange("name", e.target.value)} required />
          </div>

          {/* Precio */}
          <div className="form-group">
            <label>Precio (COP) *</label>
            <input type="number" placeholder="Ej: 85000"
              value={form.price} onChange={e => handleChange("price", e.target.value)} required />
          </div>

          {/* Categoría y Marca */}
          <div className="form-row">
            <div className="form-group">
              <label>Categoría *</label>
              <select value={form.category} onChange={e => handleChange("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Marca</label>
              <input type="text" value={form.brand}
                onChange={e => handleChange("brand", e.target.value)} />
            </div>
          </div>

          {/* Tallas */}
          <div className="form-group">
            <label>Tallas disponibles *</label>
            <div className="size-options">
              {ALL_SIZES.map(size => (
                <button
                  type="button"
                  key={size}
                  className={`size-btn ${form.sizes.includes(size) ? "selected" : ""}`}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colores */}
          <div className="form-group">
            <label>Colores disponibles</label>
            <div className="color-picker-row">
              {form.colors.map((color, i) => (
                <div key={i} className="color-picker-item">
                  <input
                    type="color"
                    value={color}
                    onChange={e => updateColor(i, e.target.value)}
                  />
                  {form.colors.length > 1 && (
                    <button type="button" className="remove-color"
                      onClick={() => removeColor(i)}>✕</button>
                  )}
                </div>
              ))}
              <button type="button" className="add-color-btn" onClick={addColor}>
                <i className="fas fa-plus" /> Color
              </button>
            </div>
          </div>

          {/* Imagen */}
          <div className="form-group">
            <label>Imagen del producto *</label>
            <div className="image-upload-area">
              {form.img ? (
                <div className="image-preview">
                  <img src={form.img} alt="Preview" />
                  <button type="button" className="change-img"
                    onClick={() => document.getElementById("img-input").click()}>
                    <i className="fas fa-camera" /> Cambiar
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder"
                  onClick={() => document.getElementById("img-input").click()}>
                  {uploading ? (
                    <><span className="spinner" /> Subiendo imagen...</>
                  ) : (
                    <><i className="fas fa-cloud-upload-alt" />
                    <p>Haz clic para subir una imagen</p>
                    <span>PNG, JPG hasta 10MB</span></>
                  )}
                </div>
              )}
              <input
                id="img-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button type="submit" className="btn-add-cart" disabled={saving || uploading}>
              {saving
                ? <><span className="spinner" /> Guardando...</>
                : <><i className="fas fa-save" /> {editingId ? "Actualizar" : "Crear producto"}</>
              }
            </button>
            <button type="button" className="btn-back" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
