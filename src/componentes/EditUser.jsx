import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/EditUser.css";
import prueba from "../assets/prueba.jpg";

const CARGOS = ["Mesero", "Chef", "Cajero", "Administrador", "Bartender"];

const USUARIO_INICIAL = {
  nombre: "Juan Montoya",
  correo: "jmontoya@gmail.com",
  cargo: "Mesero",
  usuario: "jmontoya",
};

export default function EditUser() {
  const [form, setForm] = useState(USUARIO_INICIAL);
  const [guardado, setGuardado] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setGuardado(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    console.log("Usuario actualizado:", form);
    setGuardado(true);
  };

  const initiales = form.nombre
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="eu-layout">

      {/* ── Sidebar ── */}
      <aside className="eu-sidebar">
        <div className="eu-sidebar-hero">
          <img
            src={prueba}
            alt="Restaurant"
            className="eu-sidebar-hero-img"
          />
          <div className="eu-sidebar-hero-overlay">
            <p className="eu-brand">La Mesa Dorada</p>
            <p className="eu-brand-sub">Panel de gestión</p>
            <div className="eu-gold-line" />
          </div>
        </div>

        <div className="eu-sidebar-profile">
          <div className="eu-avatar-big">{initiales}</div>
          <p className="eu-profile-name">{form.nombre}</p>
          <span className="eu-profile-badge">{form.cargo}</span>
        </div>

        <div className="eu-sidebar-info">
          <div className="eu-info-row">
            <span className="eu-info-label">Usuario</span>
            <span className="eu-info-value">{form.usuario}</span>
          </div>
          <div className="eu-info-row">
            <span className="eu-info-label">Estado</span>
            <span className="eu-info-value eu-info-value--active">● Activo</span>
          </div>
          <div className="eu-info-row">
            <span className="eu-info-label">Correo</span>
            <span className="eu-info-value eu-info-value--muted">{form.correo}</span>
          </div>
        </div>

        <div className="eu-sidebar-footer">
          <button className="eu-back-btn" onClick={() => navigate("/users")}>
            ← Volver a usuarios
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="eu-main">
        <div className="eu-topbar">
          <div>
            <p className="eu-topbar-title">Editar Usuario</p>
            <p className="eu-topbar-sub">Modificar información del personal</p>
          </div>
          <span className="eu-status-pill">● Editando</span>
        </div>

        <div className="eu-divider" />

        <div className="eu-content">
          {guardado && (
            <div className="eu-alert">✅ Usuario actualizado correctamente</div>
          )}

          <p className="eu-section-label">Información personal</p>

          <div className="eu-fields">
            <div className="eu-field">
              <label className="eu-label">Nombre completo</label>
              <input
                className="eu-input"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre completo"
              />
            </div>

            <div className="eu-field">
              <label className="eu-label">Correo electrónico</label>
              <input
                className="eu-input"
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="eu-field">
              <label className="eu-label">Usuario</label>
              <input
                className="eu-input"
                type="text"
                name="usuario"
                value={form.usuario}
                onChange={handleChange}
                placeholder="nombre de usuario"
              />
            </div>

            <div className="eu-field">
              <label className="eu-label">Cargo</label>
              <div className="eu-select-wrapper">
                <select
                  className="eu-select"
                  name="cargo"
                  value={form.cargo}
                  onChange={handleChange}
                >
                  <option value="" disabled hidden>Seleccionar cargo</option>
                  {CARGOS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <span className="eu-select-arrow">▼</span>
              </div>
            </div>
          </div>

          <div className="eu-actions">
            <button className="eu-btn eu-btn--cancelar" onClick={() => navigate("/users")}>
              Cancelar
            </button>
            <button className="eu-btn eu-btn--guardar" onClick={handleGuardar}>
              Guardar cambios
            </button>
          </div>
        </div>
      </main>

    </div>
  );
}