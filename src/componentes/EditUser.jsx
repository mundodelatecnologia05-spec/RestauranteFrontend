import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/EditUser.css";
import prueba from "../assets/prueba.jpg";

const CARGOS = ["Mesero", "Chef", "Cajero", "Administrador", "Bartender"];

// Datos de ejemplo — reemplaza con los datos reales del usuario a editar
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

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <div className="eu-page">
      <div className="eu-container">

        {/* Banner */}
        <div className="eu-banner">
          <img
            src={prueba}
            alt="Restaurant banner"
            className="eu-banner-img"
          />
        </div>

        {/* Form */}
        <div className="eu-card">
          <h2 className="eu-title">Editar Usuario</h2>

          {guardado && (
            <div className="eu-alert">
              ✅ Usuario actualizado correctamente
            </div>
          )}

          <div className="eu-fields">
            <div className="eu-field">
              <label className="eu-label">Nombre completo</label>
              <input
                className="eu-input"
                type="text"
                name="nombre"
                placeholder="Juanlito"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="eu-field">
              <label className="eu-label">Correo</label>
              <input
                className="eu-input"
                type="email"
                name="correo"
                placeholder="Juanlito@gmail.com"
                value={form.correo}
                onChange={handleChange}
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

            <div className="eu-field">
              <label className="eu-label">Usuario</label>
              <input
                className="eu-input"
                type="text"
                name="usuario"
                placeholder="tmontoya"
                value={form.usuario}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="eu-actions">
            <button className="eu-btn eu-btn--guardar" onClick={handleGuardar}>
              Guardar
            </button>
            <button className="eu-btn eu-btn--cancelar" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}