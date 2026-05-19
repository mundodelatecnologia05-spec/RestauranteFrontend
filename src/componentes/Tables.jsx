import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Tables.css";
import prueba from "../assets/prueba.jpg";

const MESAS_INICIALES = [
  { id: 1, numero: "01", estado: "disponible" },
  { id: 2, numero: "02", estado: "disponible" },
  { id: 3, numero: "03", estado: "disponible" },
  { id: 4, numero: "04", estado: "disponible" },
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

function formatPrecio(v) {
  return "$ " + v.toLocaleString("es-CO");
}

export default function MesaList() {
  const navigate = useNavigate();

  const [mesas, setMesas]                         = useState([]);
  const [mostrarModal, setMostrarModal]           = useState(false);
  const [mesaAEliminar, setMesaAEliminar]         = useState(null);
  const [consumoModal, setConsumoModal]           = useState(null); // { mesa, consumo }

  // CARGAR MESAS — sincroniza estado con pedidos guardados por el mesero
  useEffect(() => {
    const mesasAdmin = JSON.parse(localStorage.getItem("mesas")) || [];

    const mesasBase = MESAS_INICIALES.map((m) => {
      // Si el admin ya guardó un estado para esta mesa, usarlo
      const overrideAdmin = mesasAdmin.find((a) => a.id === m.id);
      const estadoBase = overrideAdmin ? overrideAdmin.estado.toLowerCase() : m.estado;

      // Si hay pedido activo del mesero, marcar como consumo
      const pedidoGuardado = localStorage.getItem(`pedido_mesa_${m.id}`);
      if (pedidoGuardado && estadoBase !== "inhabilitada") {
        return { ...m, estado: "consumo" };
      }
      return { ...m, estado: estadoBase };
    });

    // Mesas extra creadas desde el admin (id > 8)
    const mesasExtra = mesasAdmin
      .filter((m) => m.id > 8)
      .map((m) => {
        const estado = m.estado.toLowerCase();
        const pedidoGuardado = localStorage.getItem(`pedido_mesa_${m.id}`);
        if (pedidoGuardado && estado !== "inhabilitada") {
          return { ...m, estado: "consumo" };
        }
        return { ...m, estado };
      });

    setMesas([...mesasBase, ...mesasExtra]);
  }, []);

  const actualizarLocalStorage = (nuevasMesas) => {
    // Guardar TODAS las mesas para preservar overrides de estado
    localStorage.setItem("mesas", JSON.stringify(nuevasMesas));
  };

  const toggleHabilitar = (id) => {
    const nuevasMesas = mesas.map((m) =>
      m.id === id
        ? { ...m, estado: m.estado === "inhabilitada" ? "disponible" : "inhabilitada" }
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
    const nuevasMesas = mesas.filter((m) => m.id !== mesaAEliminar);
    setMesas(nuevasMesas);
    actualizarLocalStorage(nuevasMesas);
    setMostrarModal(false);
    setMesaAEliminar(null);
  };

  const verConsumo = (mesa) => {
    const consumo = JSON.parse(localStorage.getItem(`pedido_mesa_${mesa.id}`));
    setConsumoModal({ mesa, consumo });
  };

  const total        = mesas.length;
  const disponibles  = mesas.filter((m) => m.estado === "disponible").length;
  const conConsumo   = mesas.filter((m) => m.estado === "consumo").length;
  const inhabilitadas = mesas.filter((m) => m.estado === "inhabilitada").length;

  return (
    <>
      <div className="ms-layout">

        {/* ── SIDEBAR ── */}
        <aside className="ms-sidebar">
          <div className="ms-sidebar-hero">
            <img src={prueba} alt="Restaurante" className="ms-sidebar-hero-img" />
            <div className="ms-sidebar-hero-overlay">
              <p className="ms-brand">La Mesa Dorada</p>
              <p className="ms-brand-sub">Haute Cuisine</p>
              <div className="ms-gold-line" />
            </div>
          </div>

          <div className="ms-sidebar-stats">
            <div className="ms-stat ms-stat--total">
              <div className="ms-stat-info">
                <span className="ms-stat-label">Total mesas</span>
                <span className="ms-stat-value">{total}</span>
              </div>
              <div className="ms-stat-icon">🪑</div>
            </div>
            <div className="ms-stat ms-stat--active">
              <div className="ms-stat-info">
                <span className="ms-stat-label">Disponibles</span>
                <span className="ms-stat-value">{disponibles}</span>
              </div>
              <div className="ms-stat-icon">✅</div>
            </div>
            <div className="ms-stat ms-stat--busy">
              <div className="ms-stat-info">
                <span className="ms-stat-label">Con consumo</span>
                <span className="ms-stat-value">{conConsumo}</span>
              </div>
              <div className="ms-stat-icon">🧾</div>
            </div>
            <div className="ms-stat ms-stat--off">
              <div className="ms-stat-info">
                <span className="ms-stat-label">Inhabilitadas</span>
                <span className="ms-stat-value">{inhabilitadas}</span>
              </div>
              <div className="ms-stat-icon">⏸️</div>
            </div>
          </div>

          <div className="ms-sidebar-footer">
            <button className="ms-back-btn" onClick={() => navigate("/panel-admin")}>
              ← Volver al panel
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="ms-main">
          <div className="ms-topbar">
            <div className="ms-topbar-left">
              <h1 className="ms-topbar-title">Gestión de Mesas</h1>
              <p className="ms-topbar-sub">Administrar número y asignación de mesas</p>
            </div>
            <div className="ms-topbar-right">
              <span className="ms-pill ms-pill--active">{disponibles} disponibles</span>
              <span className="ms-pill ms-pill--busy">{conConsumo} activas</span>
              <button className="ms-add-btn" onClick={() => navigate("/add-tables")}>
                + Añadir mesa
              </button>
            </div>
          </div>

          <div className="ms-divider" />

          <div className="ms-content">
            <p className="ms-section-label">Todas las mesas</p>

            {mesas.length === 0 ? (
              <p className="ms-empty">No hay mesas registradas</p>
            ) : (
              <div className="ms-grid">
                {mesas.map((m) => {
                  const cfg = ESTADO_CONFIG[m.estado] || ESTADO_CONFIG["disponible"];
                  return (
                    <div
                      key={m.id}
                      className={`ms-card${m.estado === "inhabilitada" ? " ms-card--off" : ""}`}
                    >
                      <div className={`ms-card-accent ${cfg.accent}`} />
                      <div className="ms-card-top">
                        <div>
                          <div className="ms-card-num">{m.numero}</div>
                          <div className="ms-card-num-label">Mesa</div>
                        </div>
                        <span className={`ms-status-badge ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="ms-card-icon">{cfg.icon}</div>
                      <div className="ms-card-actions">
                        <button
                          className="ms-btn ms-btn--editar"
                          onClick={() => navigate(`/edit-tables?id=${m.id}`)}
                        >
                          Editar
                        </button>
                        <button
                          className="ms-btn ms-btn--cancel"
                          onClick={() => abrirModalEliminar(m.id)}
                        >
                          Eliminar
                        </button>

                        {m.estado === "consumo" && (
                          <button
                            className="ms-btn ms-btn--consumo"
                            onClick={() => verConsumo(m)}
                          >
                            Ver consumo
                          </button>
                        )}

                        {m.estado === "disponible" && (
                          <button
                            className="ms-btn ms-btn--inhabilitar"
                            onClick={() => toggleHabilitar(m.id)}
                          >
                            Inhabilitar
                          </button>
                        )}

                        {m.estado === "inhabilitada" && (
                          <button
                            className="ms-btn ms-btn--habilitar"
                            onClick={() => toggleHabilitar(m.id)}
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

      {/* ── MODAL ELIMINAR ── */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">⚠️</div>
            <h2>¿Eliminar mesa?</h2>
            <p className="modal-desc">Esta acción no puede deshacerse.</p>
            <div className="modal-buttons">
              <button className="btn-si" onClick={confirmarEliminar}>Sí, eliminar</button>
              <button className="btn-no" onClick={() => setMostrarModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONSUMO ── */}
      {consumoModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "520px", width: "90%" }}>
            <div className="modal-icon">🧾</div>
            <h2>Consumo — Mesa {consumoModal.mesa.numero}</h2>

            {!consumoModal.consumo ? (
              <p className="modal-desc">No hay registro de pedido para esta mesa.</p>
            ) : (
              <>
                <p className="modal-desc" style={{ marginBottom: "0.5rem" }}>
                  {consumoModal.consumo.fecha}
                </p>
                <div style={{ width: "100%", marginBottom: "1rem" }}>
                  {/* Cabecera */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto auto",
                    gap: "0.5rem",
                    padding: "0.4rem 0.6rem",
                    background: "rgba(0,0,0,0.06)",
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: "0.78rem",
                    textAlign: "right",
                    marginBottom: "0.3rem",
                  }}>
                    <span style={{ textAlign: "left" }}>Producto</span>
                    <span>Cant.</span>
                    <span>Precio</span>
                    <span>Subtotal</span>
                  </div>
                  {/* Items */}
                  {consumoModal.consumo.items.map((item, idx) => (
                    <div key={idx} style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto auto",
                      gap: "0.5rem",
                      padding: "0.4rem 0.6rem",
                      borderBottom: "1px solid rgba(0,0,0,0.07)",
                      fontSize: "0.85rem",
                      textAlign: "right",
                    }}>
                      <span style={{ textAlign: "left" }}>{item.nombre}</span>
                      <span>{item.cantidad}</span>
                      <span>{formatPrecio(item.precio)}</span>
                      <span style={{ fontWeight: 600 }}>{formatPrecio(item.precio * item.cantidad)}</span>
                    </div>
                  ))}
                  {/* Total */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.6rem 0.6rem 0",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}>
                    <span>Total</span>
                    <span>{formatPrecio(consumoModal.consumo.total)}</span>
                  </div>
                </div>
              </>
            )}

            <div className="modal-buttons">
              <button className="btn-no" onClick={() => setConsumoModal(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}