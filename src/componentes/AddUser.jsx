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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    console.log("Usuario añadido:", form);
  };

  const handleCancel = () => {
    setForm({ nombre: "", correo: "", cargo: "", usuario: "" });
  };

  return (
    <div className="au-page">
      <div className="au-container">


        {/* Banner */}
        <div className="au-banner">
          <img
            src={prueba}
            alt="Restaurant banner"
            className="au-banner-img"
          />
        </div>

        {/* Form */}
        <div className="au-card">
          <h2 className="au-title">Añadir Usuario</h2>

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
              <label className="au-label">Correo</label>
              <input
                className="au-input"
                type="email"
                name="correo"
                placeholder="Juanlito@gmail.com"
                value={form.correo}
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
                  <option value="" disabled hidden>Mesero</option>
                  {CARGOS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <span className="au-select-arrow">▼</span>
              </div>
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
          </div>

          <div className="au-actions">
            <button className="au-btn au-btn--add" onClick={handleAdd}>Añadir</button>
            <button className="au-btn au-btn--cancel" onClick={handleCancel}>Cancelar</button>
          </div>
        </div>

      </div>
    </div>
  );
}