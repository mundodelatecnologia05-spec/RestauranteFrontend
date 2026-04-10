import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserList.css";
import prueba from "../assets/prueba.jpg";

const USUARIOS_INICIALES = [
  { id: 1, nombre: "Pablito Perez Cuero",      cargo: "Cocinero",      activo: true },
  { id: 2, nombre: "Juan Pablo Granja Cuero",  cargo: "Mesero",        activo: true },
  { id: 3, nombre: "Jorge Montoya Serna",       cargo: "Administrador", activo: true },
];

function getIniciales(nombre) {
  const partes = nombre.trim().split(" ");
  if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
  return partes[0].slice(0, 2).toUpperCase();
}

const hoy = new Date().toLocaleDateString("es-CO", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
});

export default function UserList() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios]                 = useState(USUARIOS_INICIALES);
  const [mostrarModal, setMostrarModal]         = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const handleEditar = (id) => navigate(`/edit-user?id=${id}`);

  const handleInhabilitar = (id) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u))
    );
  };

  const confirmarEliminar = () => {
    setUsuarios((prev) => prev.filter((u) => u.id !== usuarioAEliminar));
    setMostrarModal(false);
    setUsuarioAEliminar(null);
  };

  const cancelarEliminar = () => {
    setMostrarModal(false);
    setUsuarioAEliminar(null);
  };

  const activos   = usuarios.filter((u) => u.activo).length;
  const inactivos = usuarios.length - activos;

  return (
    <>
      <div className="ul-layout">

        {/* ── SIDEBAR IZQUIERDO ── */}
        <aside className="ul-sidebar">

          {/* Hero con imagen */}
          <div className="ul-sidebar-hero">
            <img src={prueba} alt="Restaurante" className="ul-sidebar-hero-img" />
            <div className="ul-sidebar-hero-overlay">
              <p className="ul-brand-name">La Mesa Dorada</p>
              <p className="ul-brand-tagline">Haute Cuisine</p>
              <div className="ul-gold-line" />
            </div>
          </div>

          {/* Stats en el sidebar 
          <div className="ul-sidebar-stats">
            <div className="ul-sidebar-stat">
              <div className="ul-sidebar-stat-info">
                <span className="ul-sidebar-stat-label">Total personal</span>
                <span className="ul-sidebar-stat-value">{usuarios.length}</span>
              </div>
              <div className="ul-sidebar-stat-icon">👥</div>
            </div>

            <div className="ul-sidebar-stat">
              <div className="ul-sidebar-stat-info">
                <span className="ul-sidebar-stat-label">Activos hoy</span>
                <span className="ul-sidebar-stat-value">{activos}</span>
              </div>
              <div className="ul-sidebar-stat-icon">✅</div>
            </div>

            <div className="ul-sidebar-stat">
              <div className="ul-sidebar-stat-info">
                <span className="ul-sidebar-stat-label">Inactivos</span>
                <span className="ul-sidebar-stat-value">{inactivos}</span>
              </div>
              <div className="ul-sidebar-stat-icon">⏸️</div>
            </div>
          </div> */}

          {/* Botón volver abajo del sidebar */}
          <div className="ul-sidebar-footer">
            <button className="ul-back-btn" onClick={() => navigate("/panel-admin")}>
              ← Volver al panel
            </button>
          </div>
        </aside>

        {/* ── CONTENIDO PRINCIPAL ── */}
        <main className="ul-main">

          {/* Topbar */}
          <div className="ul-topbar">
            <div className="ul-topbar-left">
              <h1 className="ul-topbar-title">USUARIOS</h1>
              <p className="ul-topbar-sub">{hoy}</p>
            </div>
            <div className="ul-topbar-right">
              <span className="ul-count-pill">{activos} activos</span>
              <button className="ul-add-btn" onClick={() => navigate("/add-user")}>
                + Añadir usuario
              </button>
            </div>
          </div>

          <div className="ul-divider" />

          {/* Lista de usuarios */}
          <div className="ul-content">
            <div className="ul-list">
              {usuarios.length === 0 ? (
                <p className="ul-empty">No hay usuarios registrados</p>
              ) : (
                usuarios.map((u) => (
                  <div
                    key={u.id}
                    className={`ul-card${!u.activo ? " ul-card--disabled" : ""}`}
                  >
                    <div className="ul-card-top">
                      <div className={`ul-avatar${!u.activo ? " ul-avatar--disabled" : ""}`}>
                        {getIniciales(u.nombre)}
                      </div>
                      <div className="ul-card-info">
                        <span className="ul-nombre">{u.nombre}</span>
                        <span className={`ul-cargo-badge${!u.activo ? " ul-cargo-badge--disabled" : ""}`}>
                          {u.cargo}
                        </span>
                      </div>
                      <div className={`ul-status-dot${!u.activo ? " ul-status-dot--off" : ""}`} />
                    </div>

                    <div className="ul-card-actions">
                      <button
                        className="ul-btn ul-btn--editar"
                        onClick={() => handleEditar(u.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="ul-btn ul-btn--eliminar"
                        onClick={() => {
                          setUsuarioAEliminar(u.id);
                          setMostrarModal(true);
                        }}
                      >
                        Eliminar
                      </button>
                      <button
                        className={`ul-btn ${u.activo ? "ul-btn--inhabilitar" : "ul-btn--habilitar"}`}
                        onClick={() => handleInhabilitar(u.id)}
                      >
                        {u.activo ? "Inhabilitar" : "Habilitar"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal de confirmación */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">⚠️</div>
            <h2>¿Eliminar usuario?</h2>
            <p className="modal-desc">
              Esta acción no puede deshacerse. El registro será eliminado permanentemente del sistema.
            </p>
            <div className="modal-buttons">
              <button className="btn-si" onClick={confirmarEliminar}>Sí, eliminar</button>
              <button className="btn-no" onClick={cancelarEliminar}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}