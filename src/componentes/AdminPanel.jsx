import { useNavigate } from "react-router-dom";
import "../styles/AdminPanel.css";

const OPCIONES = [
  { nombre: "Menú",      icono: "🍽️", desc: "Platos y categorías",     ruta: "/create-menu",  color: "#f97316", bg: "#fff3e8" },
  { nombre: "Mesas",     icono: "🪑",  desc: "Estado y reservas",       ruta: "/tables",       color: "#22c55e", bg: "#f0fdf4" },
  { nombre: "Caja",      icono: "💰",  desc: "Apertura y cierre",       ruta: "/Opening",         color: "#C9A87C", bg: "#fdf8f0" },
  { nombre: "Usuarios",  icono: "👤",  desc: "Personal y roles",        ruta: "/users",        color: "#a855f7", bg: "#faf5ff" },
  { nombre: "Reportes",  icono: "📊",  desc: "Ventas y estadísticas",   ruta: "/reports",      color: "#ec4899", bg: "#fdf2f8" },
  { nombre: "Config",    icono: "⚙️",  desc: "Preferencias del sistema",ruta: null,            color: "#64748b", bg: "#f8fafc" },
];

const hoy = new Date().toLocaleDateString("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function AdminPanel() {
  const navigate = useNavigate();

  const cajaAbierta = JSON.parse(localStorage.getItem("caja_abierta") || "null");

  const historialFacturas = JSON.parse(localStorage.getItem("historial_facturas") || "[]");
  const mesasAdmin = JSON.parse(localStorage.getItem("mesas") || "[]");

  const ventasHoy = cajaAbierta
    ? historialFacturas
        .filter((f) => f.timestamp >= cajaAbierta.timestamp)
        .reduce((acc, f) => acc + f.total, 0)
    : 0;

  const mesasOcupadas = mesasAdmin.filter((m) => m.estado === "consumo").length;

  const pedidosHoy = cajaAbierta
    ? historialFacturas.filter((f) => f.timestamp >= cajaAbierta.timestamp).length
    : 0;

  const formatPrecio = (v) => "$ " + Number(v).toLocaleString("es-CO");

  const STATS = [
    { label: "Mesas activas", value: mesasOcupadas, dot: "#22c55e" },
    { label: "Pedidos hoy",   value: pedidosHoy,    dot: "#f97316" },
    { label: "Ingresos",      value: formatPrecio(ventasHoy), dot: "#a855f7" },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="admin-root">

      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-logo">🍴</div>
          <div className="admin-header-info">
            <p className="admin-title">La Mesa Dorada</p>
            <p className="admin-subtitle">Panel de administración</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            className="admin-badge"
            style={{
              background: cajaAbierta ? "rgba(58,175,106,0.15)" : "rgba(220,38,38,0.12)",
              color: cajaAbierta ? "#1A6B2E" : "#A33333",
              border: `1px solid ${cajaAbierta ? "rgba(58,175,106,0.3)" : "rgba(220,38,38,0.25)"}`,
              borderRadius: "20px",
              padding: "5px 14px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {cajaAbierta ? "● Caja abierta" : "● Caja cerrada"}
          </span>
          <span className="admin-badge">● En línea</span>
        </div>
      </header>

      {/* Bienvenida */}
      <section className="admin-welcome">
        <div>
          <p className="admin-welcome-greeting">Bienvenido de nuevo,</p>
          <p className="admin-welcome-name">Administrador</p>
        </div>
        <p className="admin-welcome-date">{hoy}</p>
      </section>

      {/* Alerta caja cerrada */}
      {!cajaAbierta && (
        <div
          style={{
            margin: "0 24px",
            padding: "14px 18px",
            background: "rgba(220,38,38,0.06)",
            border: "1px solid rgba(220,38,38,0.2)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>🔴</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: "14px", color: "#A33333" }}>Caja cerrada</p>
              <p style={{ fontSize: "12px", color: "#8A7060", marginTop: "2px" }}>
                Los meseros no pueden ver las mesas hasta que abras la caja.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/Opening")}
            style={{
              background: "#3aaf6a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 18px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
            }}
          >
            🔓 Abrir caja
          </button>
        </div>
      )}

      {/* Stats */}
      <section className="admin-stats">
        {STATS.map((s) => (
          <div key={s.label} className="admin-stat-card">
            <p className="admin-stat-label">
              <span className="admin-stat-dot" style={{ background: s.dot }} />
              {s.label}
            </p>
            <p className="admin-stat-value">{s.value}</p>
          </div>
        ))}
      </section>

      {/* Grid de tarjetas */}
      <section className="admin-grid">
        {OPCIONES.map((op, i) => (
          <div
            key={i}
            className="admin-card"
            onClick={() => op.ruta && navigate(op.ruta)}
          >
            <div className="admin-card-accent" style={{ background: op.color }} />
            <div className="admin-card-icon" style={{ background: op.bg }}>
              {op.icono}
            </div>
            <p className="admin-card-name">{op.nombre}</p>
            <p className="admin-card-desc">{op.desc}</p>
            {op.ruta && <p className="admin-card-arrow">Ver sección →</p>}
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="admin-footer">
        <button className="admin-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </footer>

    </div>
  );
}