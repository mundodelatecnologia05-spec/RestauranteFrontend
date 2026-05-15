import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/AddTables.css";
import prueba from "../assets/prueba.jpg";

const ESTADOS = [
  "disponible",
  "consumo",
  "inhabilitada",
];

export default function AddTable() {

  const [form, setForm] = useState({
    numero: "",
    capacidad: "",
    estado: "",
    ubicacion: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = () => {

    if (
      !form.numero ||
      !form.capacidad ||
      !form.estado ||
      !form.ubicacion
    ) {
      alert("Completa todos los campos");
      return;
    }

    // OBTENER MESAS GUARDADAS
    const mesas =
      JSON.parse(localStorage.getItem("mesas")) || [];

    // NUEVA MESA
    const nuevaMesa = {
      id: Date.now(),
      numero: form.numero,
      capacidad: form.capacidad,
      estado: form.estado,
      ubicacion: form.ubicacion,
    };

    // AGREGAR
    mesas.push(nuevaMesa);

    // GUARDAR
    localStorage.setItem(
      "mesas",
      JSON.stringify(mesas)
    );

    alert("Mesa añadida correctamente");

    // LIMPIAR
    setForm({
      numero: "",
      capacidad: "",
      estado: "",
      ubicacion: "",
    });

    navigate("/tables");
  };

  return (
    <div className="mt-layout">

      {/* ── Sidebar ── */}
      <aside className="mt-sidebar">

        <div className="mt-sidebar-hero">
          <img
            src={prueba}
            alt="Restaurant"
            className="mt-sidebar-hero-img"
          />

          <div className="mt-sidebar-hero-overlay">
            <p className="mt-brand">La Mesa Dorada</p>
            <p className="mt-brand-sub">
              Panel de gestión
            </p>

            <div className="mt-gold-line" />
          </div>
        </div>

        <div className="mt-sidebar-profile">

          <div className="mt-avatar-big">
            {form.numero
              ? `#${form.numero}`
              : "🍽️"}
          </div>

          <p className="mt-profile-name">
            {form.numero
              ? `Mesa ${form.numero}`
              : "Nueva mesa"}
          </p>

          <p className="mt-profile-hint">
            {form.numero
              ? "Revisá los datos antes de guardar"
              : "Completa el formulario\npara registrar la mesa"}
          </p>

        </div>

        <div className="mt-sidebar-info">

          <div className="mt-info-row">
            <span className="mt-info-label">
              Mesa
            </span>

            <span
              className={`mt-info-value ${
                !form.numero
                  ? "mt-info-value--empty"
                  : ""
              }`}
            >
              {form.numero || "—"}
            </span>
          </div>

          <div className="mt-info-row">
            <span className="mt-info-label">
              Capacidad
            </span>

            <span
              className={`mt-info-value ${
                !form.capacidad
                  ? "mt-info-value--empty"
                  : ""
              }`}
            >
              {form.capacidad
                ? `${form.capacidad} personas`
                : "—"}
            </span>
          </div>

          <div className="mt-info-row">
            <span className="mt-info-label">
              Estado
            </span>

            <span className="mt-info-value mt-info-value--pending">
              {form.estado || "Pendiente"}
            </span>
          </div>

        </div>

        <div className="mt-sidebar-footer">
          <button
            className="mt-back-btn"
            onClick={() => navigate("/tables")}
          >
            ← Volver a mesas
          </button>
        </div>

      </aside>

      {/* ── Main ── */}
      <main className="mt-main">

        <div className="mt-topbar">

          <div>
            <p className="mt-topbar-title">
              Añadir Mesa
            </p>

            <p className="mt-topbar-sub">
              Registrar nueva mesa del restaurante
            </p>
          </div>

          <span className="mt-status-pill">
            + Nueva mesa
          </span>

        </div>

        <div className="mt-divider" />

        <div className="mt-content">

          <p className="mt-section-label">
            Información de la mesa
          </p>

          <div className="mt-fields">

            <div className="mt-field">
              <label className="mt-label">
                Número de mesa
              </label>

              <input
                className="mt-input"
                type="text"
                name="numero"
                placeholder="10"
                value={form.numero}
                onChange={handleChange}
              />
            </div>

            <div className="mt-field">
              <label className="mt-label">
                Capacidad
              </label>

              <input
                className="mt-input"
                type="number"
                name="capacidad"
                placeholder="4"
                value={form.capacidad}
                onChange={handleChange}
              />
            </div>

            <div className="mt-field">
              <label className="mt-label">
                Ubicación
              </label>

              <input
                className="mt-input"
                type="text"
                name="ubicacion"
                placeholder="Terraza"
                value={form.ubicacion}
                onChange={handleChange}
              />
            </div>

            <div className="mt-field">

              <label className="mt-label">
                Estado
              </label>

              <div className="mt-select-wrapper">

                <select
                  className="mt-select"
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                >

                  <option
                    value=""
                    disabled
                    hidden
                  >
                    Seleccionar estado
                  </option>

                  <option value="disponible">
                    Disponible
                  </option>

                  <option value="consumo">
                    Con consumo
                  </option>

                  <option value="inhabilitada">
                    Inhabilitada
                  </option>

                </select>

                <span className="mt-select-arrow">
                  ▼
                </span>

              </div>

            </div>

          </div>

          <div className="mt-actions">

            <button
              className="mt-btn mt-btn--cancel"
              onClick={() => navigate("/tables")}
            >
              Cancelar
            </button>

            <button
              className="mt-btn mt-btn--add"
              onClick={handleAdd}
            >
              Añadir mesa
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}