import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/AddProduct.css";
import prueba from "../assets/prueba.jpg";

const CATEGORIA = ["Entrada", "Jugos", "Asados", "Postres"];

export default function AddUser() {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    estado: "",
  });

  const navigate = useNavigate();

  // 👉 Formatear precio
  const formatearPrecio = (valor) => {
    const numero = valor.replace(/\D/g, "");
    return new Intl.NumberFormat("es-CO").format(numero);
  };

  // 👉 Manejo normal
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 👉 Manejo especial precio
  const handlePrecio = (e) => {
    const valor = e.target.value;
    const limpio = valor.replace(/\D/g, "");
    const formateado = formatearPrecio(limpio);

    setForm({
      ...form,
      precio: formateado,
    });
  };

  const handleAdd = () => {
    // 🔥 convertir a número real para backend
    const precioNumerico = form.precio.replace(/\./g, "");

    const dataFinal = {
      ...form,
      precio: Number(precioNumerico),
    };

    console.log("Producto añadido:", dataFinal);
  };

  return (
    <div className="au-layout">
      {/* ── Sidebar ── */}
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
            {form.nombre
              ? form.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              : "👤"}
          </div>
          <p className="au-profile-name">{form.nombre || "Nuevo producto"}</p>
          <p className="au-profile-hint">
            {form.nombre
              ? "Revisá los datos antes de guardar"
              : "Completa el formulario\npara registrar el producto"}
          </p>
        </div>

        <div className="au-sidebar-info">
          <div className="au-info-row">
            <span className="au-info-label">Nombre</span>
            <span
              className={`au-info-value ${
                !form.nombre ? "au-info-value--empty" : ""
              }`}
            >
              {form.nombre || "—"}
            </span>
          </div>

          <div className="eu-sidebar-info">
            <div className="eu-info-row">
              <span className="eu-info-label">Categoría</span>
              <span className="eu-info-value">{form.categoria || "—"}</span>
            </div>
            <div className="eu-info-row">
              <span className="eu-info-label">Precio</span>
              <span className="eu-info-value">
                {form.precio ? `$${form.precio}` : "—"}
              </span>
            </div>
            <div className="eu-info-row">
              <span className="eu-info-label">Estado</span>
              <span className="eu-info-value eu-info-value--active">
                ● Disponible
              </span>
            </div>
          </div>
        </div>

        <div className="au-sidebar-footer">
          <button className="au-back-btn" onClick={() => navigate("/create-menu")}>
            ← Volver
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="au-main">
        <div className="au-topbar">
          <div>
            <p className="au-topbar-title">Añadir Producto</p>
            <p className="au-topbar-sub">Registrar nuevo producto</p>
          </div>
          <span className="au-status-pill">+ Nuevo registro</span>
        </div>

        <div className="au-divider" />

        <div className="au-content">
          <p className="au-section-label">Información del producto</p>

          <div className="au-fields">
            <div className="au-field">
              <label className="au-label">Nombre del producto</label>
              <input
                className="au-input"
                type="text"
                name="nombre"
                placeholder="Camarones"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="au-field">
              <label className="au-label">Categoría</label>
              <div className="au-select-wrapper">
                <select
                  className="au-select"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                >
                  <option value="" disabled hidden>
                    Seleccionar categoría
                  </option>
                  {CATEGORIA.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="au-select-arrow">▼</span>
              </div>
            </div>

            {/* 🔥 PRECIO FORMATEADO */}
            <div className="eu-field">
              <label className="eu-label">Precio</label>
              <input
                className="eu-input"
                type="text"
                name="precio"
                value={form.precio}
                onChange={handlePrecio}
                placeholder="Ej: 15.000"
              />
            </div>
          </div>

          <div className="au-actions">
            <button
              className="au-btn au-btn--cancel"
              onClick={() => navigate("/create-menu")}
            >
              Cancelar
            </button>
            <button className="au-btn au-btn--add" onClick={handleAdd}>
              Añadir producto
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}