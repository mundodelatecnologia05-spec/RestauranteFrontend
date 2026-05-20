import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/AddProduct.css";
import prueba from "../assets/prueba.jpg";

const CATEGORIA = ["Entradas", "Bebidas", "Platos fuertes", "Postres"];

const UNIDADES = {
  "Entradas":       ["porciones", "unidades", "kg"],
  "Bebidas":        ["litros", "vasos", "botellas", "unidades"],
  "Platos fuertes": ["porciones", "kg", "unidades"],
  "Postres":        ["porciones", "unidades", "kg"],
};

export default function AddProduct() {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
    stockMinimo: "",
    unidad: "",
  });

  const navigate = useNavigate();

  const formatearPrecio = (valor) => {
    const numero = valor.replace(/\D/g, "");
    return new Intl.NumberFormat("es-CO").format(numero);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoria") {
      setForm({ ...form, categoria: value, unidad: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handlePrecio = (e) => {
    const limpio = e.target.value.replace(/\D/g, "");
    setForm({ ...form, precio: formatearPrecio(limpio) });
  };

  const handleAdd = () => {
    if (!form.nombre || !form.categoria || !form.precio || !form.stock || !form.unidad) {
      alert("Completa todos los campos");
      return;
    }

    const precioNumerico = Number(form.precio.replace(/\./g, ""));

    const nuevoProducto = {
      id: Date.now(),
      nombre: form.nombre,
      categoria: form.categoria,
      precio: precioNumerico,
      stock: Number(form.stock),
      stockMinimo: Number(form.stockMinimo) || 5,
      unidad: form.unidad,
      estado: "Disponible",
    };

    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    productosGuardados.push(nuevoProducto);
    localStorage.setItem("productos", JSON.stringify(productosGuardados));

    alert("Producto añadido correctamente");

    setForm({ nombre: "", categoria: "", precio: "", stock: "", stockMinimo: "", unidad: "" });
    navigate("/create-menu");
  };

  const unidadesDisponibles = UNIDADES[form.categoria] || [];

  const stockNum = Number(form.stock);
  const minimoNum = Number(form.stockMinimo) || 5;
  const stockStatus =
    !form.stock ? null :
    stockNum <= 0 ? "agotado" :
    stockNum <= minimoNum ? "bajo" : "ok";

  return (
    <div className="au-layout">
      <aside className="au-sidebar">
        <div className="au-sidebar-hero">
          <img src={prueba} alt="Restaurant" className="au-sidebar-hero-img" />
          <div className="au-sidebar-hero-overlay">
            <p className="au-brand">La Mesa Dorada</p>
            <p className="au-brand-sub">Panel de gestión</p>
            <div className="au-gold-line" />
          </div>
        </div>

        <div className="au-sidebar-profile">
          <div className="au-avatar-big">
            {form.nombre ? form.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "🍽️"}
          </div>
          <p className="au-profile-name">{form.nombre || "Nuevo producto"}</p>
          <p className="au-profile-hint">
            {form.nombre ? "Revisá los datos antes de guardar" : "Completa el formulario para registrar el producto"}
          </p>
        </div>

        <div className="au-sidebar-info">
          <div className="au-info-row">
            <span className="au-info-label">Nombre</span>
            <span className={`au-info-value ${!form.nombre ? "au-info-value--empty" : ""}`}>{form.nombre || "—"}</span>
          </div>
          <div className="au-info-row">
            <span className="au-info-label">Categoría</span>
            <span className="au-info-value">{form.categoria || "—"}</span>
          </div>
          <div className="au-info-row">
            <span className="au-info-label">Precio</span>
            <span className="au-info-value">{form.precio ? `$${form.precio}` : "—"}</span>
          </div>
          <div className="au-info-row">
            <span className="au-info-label">Stock</span>
            <span className={`au-info-value au-stock-badge au-stock-badge--${stockStatus || "empty"}`}>
              {form.stock
                ? `${form.stock} ${form.unidad || ""} ${stockStatus === "agotado" ? "🔴" : stockStatus === "bajo" ? "🟡" : "🟢"}`
                : "—"}
            </span>
          </div>
          <div className="au-info-row">
            <span className="au-info-label">Estado</span>
            <span className="au-info-value au-info-value--active">● Disponible</span>
          </div>
        </div>

        <div className="au-sidebar-footer">
          <button className="au-back-btn" onClick={() => navigate("/create-menu")}>← Volver</button>
        </div>
      </aside>

      <main className="au-main">
        <div className="au-topbar">
          <div>
            <p className="au-topbar-title">Añadir Producto</p>
            <p className="au-topbar-sub">Registrar nuevo producto al menú</p>
          </div>
          <span className="au-status-pill">+ Nuevo registro</span>
        </div>

        <div className="au-divider" />

        <div className="au-content">
          <p className="au-section-label">Información del producto</p>

          <div className="au-fields">
            <div className="au-field">
              <label className="au-label">Nombre del producto</label>
              <input className="au-input" type="text" name="nombre" placeholder="Ej: Hamburguesa Clásica" value={form.nombre} onChange={handleChange} />
            </div>

            <div className="au-field">
              <label className="au-label">Categoría</label>
              <div className="au-select-wrapper">
                <select className="au-select" name="categoria" value={form.categoria} onChange={handleChange}>
                  <option value="" disabled hidden>Seleccionar categoría</option>
                  {CATEGORIA.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="au-select-arrow">▼</span>
              </div>
            </div>

            <div className="au-field">
              <label className="au-label">Precio</label>
              <input className="au-input" type="text" name="precio" value={form.precio} onChange={handlePrecio} placeholder="Ej: 15.000" />
            </div>
          </div>

          <div className="au-divider" style={{ margin: "24px 0" }} />
          <p className="au-section-label">Control de stock</p>

          <div className="au-fields">
            <div className="au-field">
              <label className="au-label">Unidad de medida</label>
              <div className="au-select-wrapper">
                <select
                  className="au-select"
                  name="unidad"
                  value={form.unidad}
                  onChange={handleChange}
                  disabled={!form.categoria}
                >
                  <option value="" disabled hidden>
                    {form.categoria ? "Seleccionar unidad" : "Primero elige categoría"}
                  </option>
                  {unidadesDisponibles.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                <span className="au-select-arrow">▼</span>
              </div>
            </div>

            <div className="au-field">
              <label className="au-label">Stock actual</label>
              <div className="au-input-with-unit">
                <input
                  className="au-input"
                  type="number"
                  name="stock"
                  min="0"
                  placeholder="Ej: 20"
                  value={form.stock}
                  onChange={handleChange}
                />
                {form.unidad && <span className="au-unit-tag">{form.unidad}</span>}
              </div>
            </div>

            <div className="au-field">
              <label className="au-label">Stock mínimo (alerta)</label>
              <div className="au-input-with-unit">
                <input
                  className="au-input"
                  type="number"
                  name="stockMinimo"
                  min="1"
                  placeholder="Ej: 5"
                  value={form.stockMinimo}
                  onChange={handleChange}
                />
                {form.unidad && <span className="au-unit-tag">{form.unidad}</span>}
              </div>
              <p className="au-field-hint">Te avisaremos cuando el stock baje de este número</p>
            </div>

            {form.stock !== "" && (
              <div className={`au-stock-preview au-stock-preview--${stockStatus}`}>
                <div className="au-stock-preview-bar">
                  <div
                    className="au-stock-preview-fill"
                    style={{ width: `${Math.min(100, (stockNum / (minimoNum * 2)) * 100)}%` }}
                  />
                </div>
                <div className="au-stock-preview-info">
                  <span>
                    {stockStatus === "agotado" && "🔴 Sin stock"}
                    {stockStatus === "bajo" && "🟡 Stock bajo — considera reabastecer"}
                    {stockStatus === "ok" && "🟢 Stock suficiente"}
                  </span>
                  <span>{form.stock} / mín. {form.stockMinimo || 5} {form.unidad}</span>
                </div>
              </div>
            )}
          </div>

          <div className="au-actions">
            <button className="au-btn au-btn--cancel" onClick={() => navigate("/create-menu")}>Cancelar</button>
            <button className="au-btn au-btn--add" onClick={handleAdd}>Añadir producto</button>
          </div>
        </div>
      </main>
    </div>
  );
}