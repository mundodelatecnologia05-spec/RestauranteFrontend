import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateMenu.css";
import prueba from "../assets/prueba.jpg";

const PRODUCTOS_INICIALES = [
  {
    id: 1,
    nombre: "Jugo de Fresa",
    categoria: "Bebidas",
    precio: 15000,
    imagen: null,
  },
  {
    id: 2,
    nombre: "Limonada",
    categoria: "Bebidas",
    precio: 15000,
    imagen: null,
  },
  {
    id: 3,
    nombre: "Costilla BBQ",
    categoria: "Platos fuertes",
    precio: 45000,
    imagen: null,
  },
  {
    id: 4,
    nombre: "Dedos de Queso",
    categoria: "Entradas",
    precio: 34000,
    imagen: null,
  },
  {
    id: 5,
    nombre: "Pastel Tres Leches",
    categoria: "Postres",
    precio: 4000,
    imagen: null,
  },
];

function formatPrecio(valor) {
  return "$ " + Number(valor).toLocaleString("es-CO");
}

function calcularPromedio(productos) {

  if (!productos.length) return 0;

  const suma = productos.reduce(
    (acc, p) => acc + Number(p.precio),
    0
  );

  return Math.round(suma / productos.length);
}

function getCategorias(productos) {
  return new Set(productos.map((p) => p.categoria)).size;
}

export default function MenuList() {

  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [productoAEliminar, setProductoAEliminar] =
    useState(null);

  /* ───────── CARGAR PRODUCTOS ───────── */
  useEffect(() => {

    // productos personalizados
    const productosGuardados =
      JSON.parse(localStorage.getItem("productos")) || [];

    // productos iniciales editados
    const productosEditados =
      JSON.parse(localStorage.getItem("productosEditados")) || [];

    // reemplazar iniciales por editados
    const inicialesActualizados =
      PRODUCTOS_INICIALES.map((productoInicial) => {

        const editado = productosEditados.find(
          (p) => p.id === productoInicial.id
        );

        return editado || productoInicial;
      });

    // unir todos
    const todosLosProductos = [
      ...inicialesActualizados,
      ...productosGuardados,
    ];

    setProductos(todosLosProductos);

  }, []);

  /* ───────── EDITAR ───────── */
  const handleEditar = (id) => {
    navigate(`/edit-product?id=${id}`);
  };

  /* ───────── MODAL ELIMINAR ───────── */
  const abrirModalEliminar = (id) => {

    setProductoAEliminar(id);

    setMostrarModal(true);
  };

  /* ───────── ELIMINAR ───────── */
  const confirmarEliminar = () => {

    const nuevosProductos = productos.filter(
      (p) => p.id !== productoAEliminar
    );

    setProductos(nuevosProductos);

    // eliminar de productos editados
    const productosEditados =
      JSON.parse(localStorage.getItem("productosEditados")) || [];

    const nuevosEditados =
      productosEditados.filter(
        (p) => p.id !== productoAEliminar
      );

    localStorage.setItem(
      "productosEditados",
      JSON.stringify(nuevosEditados)
    );

    // guardar personalizados
    const productosPersonalizados =
      nuevosProductos.filter((p) => p.id > 5);

    localStorage.setItem(
      "productos",
      JSON.stringify(productosPersonalizados)
    );

    setMostrarModal(false);

    setProductoAEliminar(null);
  };

  /* ───────── CANCELAR MODAL ───────── */
  const cancelarEliminar = () => {

    setMostrarModal(false);

    setProductoAEliminar(null);
  };

  return (
    <>
      <div className="ml-layout">

        {/* ───────── SIDEBAR ───────── */}
        <aside className="ml-sidebar">

          <div className="ml-sidebar-hero">

            <img
              src={prueba}
              alt="Restaurante"
              className="ml-sidebar-hero-img"
            />

            <div className="ml-sidebar-hero-overlay">

              <p className="ml-brand">
                La Mesa Dorada
              </p>

              <p className="ml-brand-sub">
                Haute Cuisine
              </p>

              <div className="ml-gold-line" />

            </div>
          </div>

          {/* Stats */}
          <div className="ml-sidebar-stats">

            <div className="ml-stat">

              <div className="ml-stat-info">

                <span className="ml-stat-label">
                  Total platos
                </span>

                <span className="ml-stat-value">
                  {productos.length}
                </span>

              </div>

              <div className="ml-stat-icon">
                🍽️
              </div>

            </div>

            <div className="ml-stat">

              <div className="ml-stat-info">

                <span className="ml-stat-label">
                  Categorías
                </span>

                <span className="ml-stat-value">
                  {getCategorias(productos)}
                </span>

              </div>

              <div className="ml-stat-icon">
                📂
              </div>

            </div>

            <div className="ml-stat">

              <div className="ml-stat-info">

                <span className="ml-stat-label">
                  Precio prom.
                </span>

                <span className="ml-stat-value ml-stat-value--sm">
                  {formatPrecio(
                    calcularPromedio(productos)
                  )}
                </span>

              </div>

              <div className="ml-stat-icon">
                💰
              </div>

            </div>

          </div>

          <div className="ml-sidebar-footer">

            <button
              className="ml-back-btn"
              onClick={() => navigate("/panel-admin")}
            >
              ← Volver al panel
            </button>

          </div>
        </aside>

        {/* ───────── MAIN ───────── */}
        <main className="ml-main">

          {/* TOPBAR */}
          <div className="ml-topbar">

            <div className="ml-topbar-left">

              <h1 className="ml-topbar-title">
                Menú
              </h1>

              <p className="ml-topbar-sub">
                Gestión de platos y categorías
              </p>

            </div>

            <div className="ml-topbar-right">

              <span className="ml-count-pill">
                {productos.length} productos
              </span>

              <button
                className="ml-add-btn"
                onClick={() => navigate("/add-product")}
              >
                + Añadir producto
              </button>

            </div>
          </div>

          <div className="ml-divider" />

          {/* CONTENIDO */}
          <div className="ml-content">

            <p className="ml-section-label">
              Productos disponibles
            </p>

            {productos.length === 0 ? (

              <p className="ml-empty">
                No hay productos registrados
              </p>

            ) : (

              <div className="ml-grid">

                {productos.map((p) => (

                  <div key={p.id} className="ml-card">

                    {p.imagen ? (

                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        className="ml-card-img"
                      />

                    ) : (

                      <div className="ml-card-img-placeholder">
                        🍽️
                      </div>

                    )}

                    <div className="ml-card-body">

                      <p className="ml-card-name">
                        {p.nombre}
                      </p>

                      <span className="ml-card-category">
                        {p.categoria}
                      </span>

                      <p className="ml-card-price">
                        {formatPrecio(p.precio)}
                      </p>

                      <div className="ml-card-actions">

                        <button
                          className="ml-btn ml-btn--editar"
                          onClick={() => handleEditar(p.id)}
                        >
                          Editar
                        </button>

                        <button
                          className="ml-btn ml-btn--eliminar"
                          onClick={() =>
                            abrirModalEliminar(p.id)
                          }
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

      {/* ───────── MODAL ───────── */}
      {mostrarModal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-icon">
              ⚠️
            </div>

            <h2>
              ¿Eliminar producto?
            </h2>

            <p className="modal-desc">
              Esta acción no puede deshacerse.
              El producto será eliminado
              permanentemente del menú.
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
                onClick={cancelarEliminar}
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