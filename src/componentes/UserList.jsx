import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserList.css";
import prueba from "../assets/prueba.jpg";

// Datos iniciales
const USUARIOS_INICIALES = [
  { id: 1, nombre: "Pablito Perez Cuero", cargo: "Cocinero", activo: true },
  { id: 2, nombre: "Juan Pablo Granja Cuero", cargo: "Mesero", activo: true },
  { id: 3, nombre: "Jorge Montoya Serna", cargo: "Administrador", activo: true },
];

export default function UserList() {
  const navigate = useNavigate();

  // ✅ ESTADOS (DEBEN IR DENTRO DEL COMPONENTE)
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIALES);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  // 🔹 Editar
  const handleEditar = (id) => {
    navigate(`/edit-user?id=${id}`);
  };

  // 🔹 Inhabilitar / Habilitar
  const handleInhabilitar = (id) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, activo: !u.activo } : u
      )
    );
  };

  // 🔹 Confirmar eliminar
  const confirmarEliminar = () => {
    setUsuarios((prev) =>
      prev.filter((u) => u.id !== usuarioAEliminar)
    );
    setMostrarModal(false);
    setUsuarioAEliminar(null);
  };

  // 🔹 Cancelar eliminar
  const cancelarEliminar = () => {
    setMostrarModal(false);
    setUsuarioAEliminar(null);
  };

  return (
    <div className="ul-page">
      <div className="ul-container">

        {/* Banner */}
        <div className="ul-banner">
          <img src={prueba} alt="Banner" className="ul-banner-img" />
        </div>

        {/* Navbar */}
        <div className="ul-navbar">
          <button className="ul-back-btn" onClick={() => navigate(-1)}>
            <span className="ul-back-icon">|←</span>
          </button>

          <button className="ul-add-btn" onClick={() => navigate("/add-user")}>
            <span className="ul-add-icon">+</span> AÑADIR USUARIO
          </button>
        </div>

        {/* Contenido */}
        <div className="ul-content">
          <h1 className="ul-title">USUARIOS</h1>
          <p className="ul-subtitle">Agregar Usuarios:</p>

          <div className="ul-list">
            {usuarios.length === 0 ? (
              <p className="ul-empty">No hay usuarios registrados</p>
            ) : (
              usuarios.map((u) => (
                <div
                  key={u.id}
                  className={`ul-card ${!u.activo ? "ul-card--disabled" : ""}`}
                >
                  <div className="ul-card-top">
                    <span className="ul-nombre">{u.nombre}</span>
                    <span className="ul-cargo">{u.cargo}</span>
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
                      className={`ul-btn ${
                        u.activo ? "ul-btn--verde" : "ul-btn--rojo"
                      }`}
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
      </div>

      {/* ✅ MODAL */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>¿Está seguro que desea eliminar este usuario?</h2>

            <div className="modal-buttons">
              <button className="btn-si" onClick={confirmarEliminar}>
                SI
              </button>
              <button className="btn-no" onClick={cancelarEliminar}>
                NO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}