import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateMenu.css";
import prueba from "../assets/prueba.jpg";

const PRODUCTOS_INICIALES = [
  { id: 1, nombre: "Jugo de Fresa",   categoria: "Bebidas",        precio: 15000, imagen: null },
  { id: 2, nombre: "Limonada",        categoria: "Bebidas",        precio: 15000, imagen: null },
  { id: 3, nombre: "Costilla BBQ",    categoria: "Platos fuertes", precio: 45000, imagen: null },
  { id: 4, nombre: "Dedos de Queso",  categoria: "Entradas",       precio: 34000, imagen: null },
];

function formatPrecio(valor) {
  return "$ " + valor.toLocaleString("es-CO");
}

function calcularPromedio(productos) {
  if (!productos.length) return 0;
  const suma = productos.reduce((acc, p) => acc + p.precio, 0);
  return Math.round(suma / productos.length);
}

function getCategorias(productos) {
  return new Set(productos.map((p) => p.categoria)).size;
}

export default function MenuList() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const handleEditar = (id) => navigate(`/edit-product?id=${id}`);

  const confirmarEliminar = () => {
    setProductos((prev) => prev.filter((p) => p.id !== productoAEliminar));
    setMostrarModal(false);
    setProductoAEliminar(null);
  };

  const cancelarEliminar = () => {
    setMostrarModal(false);
    setProductoAEliminar(null);
  };

  return (
    <>
      <div className="ml-layout">

        {/* ── SIDEBAR ── */}
        <aside className="ml-sidebar">
          <div className="ml-sidebar-hero">
            <img src={prueba} alt="Restaurante" className="ml-sidebar-hero-img" />
            <div className="ml-sidebar-hero-overlay">
              <p className="ml-brand">La Mesa Dorada</p>
              <p className="ml-brand-sub">Haute Cuisine</p>
              <div className="ml-gold-line" />
            </div>
          </div>

          <div className="ml-sidebar-stats">
            <div className="ml-stat">
              <div className="ml-stat-info">
                <span className="ml-stat-label">Total platos</span>
                <span className="ml-stat-value">{productos.length}</span>
              </div>
              <div className="ml-stat-icon">🍽️</div>
            </div>
            <div className="ml-stat">
              <div className="ml-stat-info">
                <span className="ml-stat-label">Categorías</span>
                <span className="ml-stat-value">{getCategorias(productos)}</span>
              </div>
              <div className="ml-stat-icon">📂</div>
            </div>
            <div className="ml-stat">
              <div className="ml-stat-info">
                <span className="ml-stat-label">Precio prom.</span>
                <span className="ml-stat-value ml-stat-value--sm">
                  {formatPrecio(calcularPromedio(productos))}
                </span>
              </div>
              <div className="ml-stat-icon">💰</div>
            </div>
          </div>

          <div className="ml-sidebar-footer">
            <button className="ml-back-btn" onClick={() => navigate("/panel-admin")}>
              ← Volver al panel
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="ml-main">
          <div className="ml-topbar">
            <div className="ml-topbar-left">
              <h1 className="ml-topbar-title">Menú</h1>
              <p className="ml-topbar-sub">Gestión de platos y categorías</p>
            </div>
            <div className="ml-topbar-right">
              <span className="ml-count-pill">{productos.length} productos</span>
              <button className="ml-add-btn" onClick={() => navigate("/add-product")}>
                + Añadir producto
              </button>
            </div>
          </div>

          <div className="ml-divider" />

          <div className="ml-content">
            <p className="ml-section-label">Productos disponibles</p>

            {productos.length === 0 ? (
              <p className="ml-empty">No hay productos registrados</p>
            ) : (
              <div className="ml-grid">
                {productos.map((p) => (
                  <div key={p.id} className="ml-card">
                    {p.imagen ? (
                      <img src={p.imagen} alt={p.nombre} className="ml-card-img" />
                    ) : (
                      <div className="ml-card-img-placeholder">🍽️</div>
                    )}
                    <div className="ml-card-body">
                      <p className="ml-card-name">{p.nombre}</p>
                      <span className="ml-card-category">{p.categoria}</span>
                      <p className="ml-card-price">{formatPrecio(p.precio)}</p>
                      <div className="ml-card-actions">
                        <button
                          className="ml-btn ml-btn--editar"
                          onClick={() => handleEditar(p.id)}
                        >
                          Editar
                        </button>
                        <button
                          className="ml-btn ml-btn--eliminar"
                          onClick={() => {
                            setProductoAEliminar(p.id);
                            setMostrarModal(true);
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de confirmación */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">⚠️</div>
            <h2>¿Eliminar producto?</h2>
            <p className="modal-desc">
              Esta acción no puede deshacerse. El producto será eliminado permanentemente del menú.
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