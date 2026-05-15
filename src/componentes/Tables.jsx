import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Tables.css";
import prueba from "../assets/prueba.jpg";

const MESAS_INICIALES = [
  { id: 1, numero: "01", estado: "disponible" },
  { id: 2, numero: "02", estado: "consumo" },
  { id: 3, numero: "03", estado: "disponible" },
  { id: 4, numero: "04", estado: "consumo" },
  { id: 5, numero: "05", estado: "disponible" },
  { id: 6, numero: "06", estado: "disponible" },
  { id: 7, numero: "07", estado: "disponible" },
  { id: 8, numero: "08", estado: "inhabilitada" },
];

const ESTADO_CONFIG = {
  disponible: {
    label: "Disponible",
    badge: "ms-status-badge--active",
    accent: "ms-card-accent--active",
    icon: "🪑",
  },

  consumo: {
    label: "Con consumo",
    badge: "ms-status-badge--busy",
    accent: "ms-card-accent--busy",
    icon: "🧾",
  },

  inhabilitada: {
    label: "Inhabilitada",
    badge: "ms-status-badge--off",
    accent: "ms-card-accent--off",
    icon: "🚫",
  },
};

export default function MesaList() {

  const navigate = useNavigate();

  const [mesas, setMesas] = useState([]);

  const [mostrarModal, setMostrarModal] =
    useState(false);

  const [mesaAEliminar, setMesaAEliminar] =
    useState(null);

  // CARGAR MESAS
  useEffect(() => {

    const mesasGuardadas =
      JSON.parse(localStorage.getItem("mesas")) || [];

    setMesas([
      ...MESAS_INICIALES,

      ...mesasGuardadas.map((m) => ({
        ...m,
        estado: m.estado.toLowerCase(),
      })),
    ]);

  }, []);

  const actualizarLocalStorage = (nuevasMesas) => {

    const mesasPersonalizadas =
      nuevasMesas.filter((m) => m.id > 8);

    localStorage.setItem(
      "mesas",
      JSON.stringify(mesasPersonalizadas)
    );

  };

  const toggleHabilitar = (id) => {

    const nuevasMesas = mesas.map((m) =>
      m.id === id
        ? {
            ...m,
            estado:
              m.estado === "inhabilitada"
                ? "disponible"
                : "inhabilitada",
          }
        : m
    );

    setMesas(nuevasMesas);

    actualizarLocalStorage(nuevasMesas);
  };

  const abrirModalEliminar = (id) => {

    setMesaAEliminar(id);

    setMostrarModal(true);

  };

  const confirmarEliminar = () => {

    const nuevasMesas = mesas.filter(
      (m) => m.id !== mesaAEliminar
    );

    setMesas(nuevasMesas);

    actualizarLocalStorage(nuevasMesas);

    setMostrarModal(false);

    setMesaAEliminar(null);
  };

  const total = mesas.length;

  const disponibles = mesas.filter(
    (m) => m.estado === "disponible"
  ).length;

  const conConsumo = mesas.filter(
    (m) => m.estado === "consumo"
  ).length;

  const inhabilitadas = mesas.filter(
    (m) => m.estado === "inhabilitada"
  ).length;

  return (
    <>
      <div className="ms-layout">

        {/* ── SIDEBAR ── */}
        <aside className="ms-sidebar">

          <div className="ms-sidebar-hero">

            <img
              src={prueba}
              alt="Restaurante"
              className="ms-sidebar-hero-img"
            />

            <div className="ms-sidebar-hero-overlay">

              <p className="ms-brand">
                La Mesa Dorada
              </p>

              <p className="ms-brand-sub">
                Haute Cuisine
              </p>

              <div className="ms-gold-line" />

            </div>

          </div>

          <div className="ms-sidebar-stats">

            <div className="ms-stat ms-stat--total">

              <div className="ms-stat-info">

                <span className="ms-stat-label">
                  Total mesas
                </span>

                <span className="ms-stat-value">
                  {total}
                </span>

              </div>

              <div className="ms-stat-icon">
                🪑
              </div>

            </div>

            <div className="ms-stat ms-stat--active">

              <div className="ms-stat-info">

                <span className="ms-stat-label">
                  Disponibles
                </span>

                <span className="ms-stat-value">
                  {disponibles}
                </span>

              </div>

              <div className="ms-stat-icon">
                ✅
              </div>

            </div>

            <div className="ms-stat ms-stat--busy">

              <div className="ms-stat-info">

                <span className="ms-stat-label">
                  Con consumo
                </span>

                <span className="ms-stat-value">
                  {conConsumo}
                </span>

              </div>

              <div className="ms-stat-icon">
                🧾
              </div>

            </div>

            <div className="ms-stat ms-stat--off">

              <div className="ms-stat-info">

                <span className="ms-stat-label">
                  Inhabilitadas
                </span>

                <span className="ms-stat-value">
                  {inhabilitadas}
                </span>

              </div>

              <div className="ms-stat-icon">
                ⏸️
              </div>

            </div>

          </div>

          <div className="ms-sidebar-footer">

            <button
              className="ms-back-btn"
              onClick={() => navigate("/panel-admin")}
            >
              ← Volver al panel
            </button>

          </div>

        </aside>

        {/* ── MAIN ── */}
        <main className="ms-main">

          <div className="ms-topbar">

            <div className="ms-topbar-left">

              <h1 className="ms-topbar-title">
                Gestión de Mesas
              </h1>

              <p className="ms-topbar-sub">
                Administrar número y asignación de mesas
              </p>

            </div>

            <div className="ms-topbar-right">

              <span className="ms-pill ms-pill--active">
                {disponibles} disponibles
              </span>

              <span className="ms-pill ms-pill--busy">
                {conConsumo} activas
              </span>

              <button
                className="ms-add-btn"
                onClick={() => navigate("/add-tables")}
              >
                + Añadir mesa
              </button>

            </div>

          </div>

          <div className="ms-divider" />

          <div className="ms-content">

            <p className="ms-section-label">
              Todas las mesas
            </p>

            {mesas.length === 0 ? (

              <p className="ms-empty">
                No hay mesas registradas
              </p>

            ) : (

              <div className="ms-grid">

                {mesas.map((m) => {

                  const cfg =
                    ESTADO_CONFIG[m.estado];

                  return (

                    <div
                      key={m.id}
                      className={`ms-card${
                        m.estado === "inhabilitada"
                          ? " ms-card--off"
                          : ""
                      }`}
                    >

                      <div
                        className={`ms-card-accent ${cfg.accent}`}
                      />

                      <div className="ms-card-top">

                        <div>

                          <div className="ms-card-num">
                            {m.numero}
                          </div>

                          <div className="ms-card-num-label">
                            Mesa
                          </div>

                        </div>

                        <span
                          className={`ms-status-badge ${cfg.badge}`}
                        >
                          {cfg.label}
                        </span>

                      </div>

                      <div className="ms-card-icon">
                        {cfg.icon}
                      </div>

                      <div className="ms-card-actions">

                        <button
                          className="ms-btn ms-btn--editar"
                          onClick={() =>
                            navigate(`/edit-tables?id=${m.id}`)
                          }
                        >
                          Editar
                        </button>

                        <button
                          className="ms-btn ms-btn--cancel"
                          onClick={() =>
                            abrirModalEliminar(m.id)
                          }
                        >
                          Eliminar
                        </button>

                        {m.estado === "consumo" && (

                          <button
                            className="ms-btn ms-btn--consumo"
                            onClick={() =>
                              navigate(`/consumo?mesa=${m.id}`)
                            }
                          >
                            Ver consumo
                          </button>

                        )}

                        {m.estado === "disponible" && (

                          <button
                            className="ms-btn ms-btn--inhabilitar"
                            onClick={() =>
                              toggleHabilitar(m.id)
                            }
                          >
                            Inhabilitar
                          </button>

                        )}

                        {m.estado === "inhabilitada" && (

                          <button
                            className="ms-btn ms-btn--habilitar"
                            onClick={() =>
                              toggleHabilitar(m.id)
                            }
                          >
                            Habilitar
                          </button>

                        )}

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>

        </main>

      </div>

      {/* ── MODAL ── */}
      {mostrarModal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-icon">
              ⚠️
            </div>

            <h2>
              ¿Eliminar mesa?
            </h2>

            <p className="modal-desc">
              Esta acción no puede deshacerse.
            </p>

            <div className="modal-buttons">

              <button
                className="btn-si"
                onClick={confirmarEliminar}
              >
                Sí, eliminar
              </button>

              <button
                className="btn-no"
                onClick={() =>
                  setMostrarModal(false)
                }
              >
                Cancelar
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}