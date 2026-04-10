import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/AddUser.css";
import prueba from "../assets/prueba.jpg";

const CARGOS = ["Mesero", "Chef", "Cajero", "Administrador", "Bartender"];

export default function AddUser() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    cargo: "",
    usuario: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    console.log("Usuario añadido:", form);
  };

  return (
    <div className="au-layout">

      {/* ── Sidebar ── */}
      <aside className="au-sidebar">
        <div className="au-sidebar-hero">
          <img
            src={prueba}
            alt="Restaurant"
            className="au-sidebar-hero-img"
          />
          <div className="au-sidebar-hero-overlay">
            <p className="au-brand">La Mesa Dorada</p>
            <p className="au-brand-sub">Panel de gestión</p>
            <div className="au-gold-line" />
          </div>
        </div>

        <div className="au-sidebar-profile">
          <div className="au-avatar-big">
            {form.nombre
              ? form.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
              : "👤"}
          </div>
          <p className="au-profile-name">
            {form.nombre || "Nuevo miembro"}
          </p>
          <p className="au-profile-hint">
            {form.nombre
              ? "Revisá los datos antes de guardar"
              : "Completa el formulario\npara registrar al usuario"}
          </p>
        </div>

        <div className="au-sidebar-info">
          <div className="au-info-row">
            <span className="au-info-label">Nombre</span>
            <span className={`au-info-value ${!form.nombre ? "au-info-value--empty" : ""}`}>
              {form.nombre || "—"}
            </span>
          </div>
          <div className="au-info-row">
            <span className="au-info-label">Cargo</span>
            <span className={`au-info-value ${!form.cargo ? "au-info-value--empty" : ""}`}>
              {form.cargo || "—"}
            </span>
          </div>
          <div className="au-info-row">
            <span className="au-info-label">Estado</span>
            <span className="au-info-value au-info-value--pending">● Pendiente</span>
          </div>
        </div>

        <div className="au-sidebar-footer">
          <button className="au-back-btn" onClick={() => navigate("/users")}>
            ← Volver a usuarios
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="au-main">
        <div className="au-topbar">
          <div>
            <p className="au-topbar-title">Añadir Usuario</p>
            <p className="au-topbar-sub">Registrar nuevo miembro del personal</p>
          </div>
          <span className="au-status-pill">+ Nuevo registro</span>
        </div>

        <div className="au-divider" />

        <div className="au-content">
          <p className="au-section-label">Información personal</p>

          <div className="au-fields">
            <div className="au-field">
              <label className="au-label">Nombre completo</label>
              <input
                className="au-input"
                type="text"
                name="nombre"
                placeholder="Juanlito"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="au-field">
              <label className="au-label">Correo electrónico</label>
              <input
                className="au-input"
                type="email"
                name="correo"
                placeholder="juanlito@gmail.com"
                value={form.correo}
                onChange={handleChange}
              />
            </div>

            <div className="au-field">
              <label className="au-label">Usuario</label>
              <input
                className="au-input"
                type="text"
                name="usuario"
                placeholder="tmontoya"
                value={form.usuario}
                onChange={handleChange}
              />
            </div>

            <div className="au-field">
              <label className="au-label">Cargo</label>
              <div className="au-select-wrapper">
                <select
                  className="au-select"
                  name="cargo"
                  value={form.cargo}
                  onChange={handleChange}
                >
                  <option value="" disabled hidden>Seleccionar cargo</option>
                  {CARGOS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <span className="au-select-arrow">▼</span>
              </div>
            </div>
          </div>

          <div className="au-actions">
            <button className="au-btn au-btn--cancel" onClick={() => navigate("/users")}>
              Cancelar
            </button>
            <button className="au-btn au-btn--add" onClick={handleAdd}>
              Añadir usuario
            </button>
          </div>
        </div>
      </main>

    </div>
  );
}