import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/AddTables.css";
import prueba from "../assets/prueba.jpg";

export default function EditMesa() {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const mesaId = Number(searchParams.get("id"));

  const [form, setForm] = useState({
    id: "",
    numero: "",
    capacidad: "",
    estado: "",
    ubicacion: "",
  });

  useEffect(() => {

    const mesasGuardadas =
      JSON.parse(localStorage.getItem("mesas")) || [];

    const mesaEncontrada =
      mesasGuardadas.find((m) => m.id === mesaId);

    if (mesaEncontrada) {
      setForm(mesaEncontrada);
    }

  }, [mesaId]);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleEdit = () => {

    if (
      !form.numero ||
      !form.capacidad ||
      !form.estado ||
      !form.ubicacion
    ) {
      alert("Completa todos los campos");
      return;
    }

    const mesas =
      JSON.parse(localStorage.getItem("mesas")) || [];

    const nuevasMesas = mesas.map((m) =>
      m.id === form.id ? form : m
    );

    localStorage.setItem(
      "mesas",
      JSON.stringify(nuevasMesas)
    );

    alert("Mesa actualizada correctamente");

    navigate("/tables");
  };

  return (
    <div className="mt-layout">

      {/* ── SIDEBAR ── */}
      <aside className="mt-sidebar">

        <div className="mt-sidebar-hero">

          <img
            src={prueba}
            alt="Restaurant"
            className="mt-sidebar-hero-img"
          />

          <div className="mt-sidebar-hero-overlay">

            <p className="mt-brand">
              La Mesa Dorada
            </p>

            <p className="mt-brand-sub">
              Panel de gestión
            </p>

            <div className="mt-gold-line" />

          </div>

        </div>

        <div className="mt-sidebar-profile">

          <div className="mt-avatar-big">
            #{form.numero || "?"}
          </div>

          <p className="mt-profile-name">
            Mesa {form.numero || ""}
          </p>

          <p className="mt-profile-hint">
            Edita la información de la mesa
          </p>

        </div>

        <div className="mt-sidebar-info">

          <div className="mt-info-row">

            <span className="mt-info-label">
              Mesa
            </span>

            <span className="mt-info-value">
              {form.numero || "—"}
            </span>

          </div>

          <div className="mt-info-row">

            <span className="mt-info-label">
              Capacidad
            </span>

            <span className="mt-info-value">
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
              {form.estado || "—"}
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

      {/* ── MAIN ── */}
      <main className="mt-main">

        <div className="mt-topbar">

          <div>

            <p className="mt-topbar-title">
              Editar Mesa
            </p>

            <p className="mt-topbar-sub">
              Modificar información de la mesa
            </p>

          </div>

          <span className="mt-status-pill">
            ✏️ Editando
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
              onClick={handleEdit}
            >
              Guardar cambios
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}