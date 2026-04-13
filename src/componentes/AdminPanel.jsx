import { useNavigate } from "react-router-dom";
import "../styles/AdminPanel.css";

const STATS = [
  { label: "Mesas activas", value: "", dot: "#22c55e" },
  { label: "Pedidos hoy",   value: "",      dot: "#f97316" },
  { label: "Ingresos",      value: "",   dot: "#a855f7" },
];

const OPCIONES = [
  { nombre: "Menú",     icono: "🍽️", desc: "Platos y categorías",    ruta: '/create-menu',     color: "#f97316", bg: "#fff3e8" },
  { nombre: "Mesas",    icono: "🪑",  desc: "Estado y reservas",      ruta: "/mesas", color: "#22c55e", bg: "#f0fdf4" },
  { nombre: "Pedidos",  icono: "🧾", desc: "Órdenes en curso",        ruta: null,     color: "#3b82f6", bg: "#eff6ff" },
  { nombre: "Usuarios", icono: "👤", desc: "Personal y roles",        ruta: "/users", color: "#a855f7", bg: "#faf5ff" },
  { nombre: "Reportes", icono: "📊", desc: "Ventas y estadísticas",   ruta: null,     color: "#ec4899", bg: "#fdf2f8" },
  { nombre: "Config",   icono: "⚙️", desc: "Preferencias del sistema",ruta: null,     color: "#64748b", bg: "#f8fafc" },
];

const hoy = new Date().toLocaleDateString("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function AdminPanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // lógica de cierre de sesión
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
        <span className="admin-badge">● En línea</span>
      </header>

      {/* Bienvenida */}
      <section className="admin-welcome">
        <div>
          <p className="admin-welcome-greeting">Bienvenido de nuevo,</p>
          <p className="admin-welcome-name">Administrador</p>
        </div>
        <p className="admin-welcome-date">{hoy}</p>
      </section>

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
            <div
              className="admin-card-accent"
              style={{ background: op.color }}
            />
            <div
              className="admin-card-icon"
              style={{ background: op.bg }}
            >
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