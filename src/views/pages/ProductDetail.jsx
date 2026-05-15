/**
 * @fileoverview Página de Detalle de Producto
 * Muestra la información completa de un producto desde Firestore.
 * Permite seleccionar talla, color y cantidad antes de agregar al carrito.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import { useCartController } from "../../controllers/useCartController";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleAddToCart } = useCartController();

  const [product,       setProduct]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [selectedSize,  setSelectedSize]  = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity,      setQuantity]      = useState(1);
  const [added,         setAdded]         = useState(false);
  const [error,         setError]         = useState("");

  /** Carga el producto desde Firestore al montar */
  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await productService.getById(id);
      setProduct(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: 80 }}>
      <p>Cargando producto...</p>
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <h2>Producto no encontrado</h2>
      <button className="btn-hero" onClick={() => navigate("/shop")}>
        Volver a la tienda
      </button>
    </div>
  );

  function handleAdd() {
    if (!selectedSize)  return setError("Por favor selecciona una talla.");
    if (!selectedColor) return setError("Por favor selecciona un color.");
    setError("");
    handleAddToCart({
      ...product,
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <section id="product-detail" className="section-p1">

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate("/")}>Inicio</span>
        <i className="fas fa-chevron-right" />
        <span onClick={() => navigate("/shop")}>Productos</span>
        <i className="fas fa-chevron-right" />
        <span className="active">{product.name}</span>
      </div>

      <div className="detail-grid">

        {/* Imagen */}
        <div className="detail-img-wrap">
          <img src={product.img} alt={product.name} />
        </div>

        {/* Info */}
        <div className="detail-info">
          <span className="detail-brand">{product.brand}</span>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-stars">
            <i className="fas fa-star" /><i className="fas fa-star" />
            <i className="fas fa-star" /><i className="fas fa-star" />
            <i className="fas fa-star-half-alt" />
            <span>(128 reseñas)</span>
          </div>

          <div className="detail-price">
            <h2>{product.getFormattedPrice()}</h2>
            <span className="detail-badge">En stock</span>
          </div>

          <hr className="detail-divider" />

          {/* Colores */}
          <div className="detail-section">
            <p className="detail-label">
              Color: {selectedColor
                ? <span style={{ background: selectedColor, display: "inline-block", width: 14, height: 14, borderRadius: "50%", marginLeft: 6, verticalAlign: "middle", border: "1px solid #ccc" }} />
                : <span className="detail-hint">— Selecciona uno</span>}
            </p>
            <div className="color-options">
              {product.colors?.map((color, i) => (
                <button key={i}
                  className={`color-dot ${selectedColor === color ? "selected" : ""}`}
                  style={{ background: color }}
                  onClick={() => { setSelectedColor(color); setError(""); }}
                />
              ))}
            </div>
          </div>

          {/* Tallas */}
          <div className="detail-section">
            <p className="detail-label">
              Talla: {selectedSize
                ? <strong>{selectedSize}</strong>
                : <span className="detail-hint">— Selecciona una</span>}
            </p>
            <div className="size-options">
              {product.sizes?.map(size => (
                <button key={size}
                  className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                  onClick={() => { setSelectedSize(size); setError(""); }}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Cantidad */}
          <div className="detail-section">
            <p className="detail-label">Cantidad:</p>
            <div className="quantity-control">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>

          {error && <p className="detail-error"><i className="fas fa-exclamation-circle" /> {error}</p>}

          <div className="detail-actions">
            <button className="btn-add-cart" onClick={handleAdd}>
              {added
                ? <><i className="fas fa-check" /> ¡Agregado!</>
                : <><i className="bi bi-cart3" /> Agregar al carrito</>}
            </button>
            <button className="btn-back" onClick={() => navigate(-1)}>
              <i className="fas fa-arrow-left" /> Volver
            </button>
          </div>

          <div className="detail-meta">
            <div><i className="fas fa-truck" /> Envío gratis en pedidos mayores a $150.000</div>
            <div><i className="fas fa-undo" /> Devolución gratuita en 30 días</div>
            <div><i className="fas fa-shield-alt" /> Pago 100% seguro</div>
          </div>
        </div>
      </div>
    </section>
  );
}
