import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Waiter.css";

/* ─────────────────────────────────────────
   MESAS
───────────────────────────────────────── */
const MESAS = [
  { id: 1, numero: "01", estado: "libre" },
  { id: 2, numero: "02", estado: "ocupada" },
  { id: 3, numero: "03", estado: "libre" },
  { id: 4, numero: "04", estado: "libre" },
  { id: 5, numero: "05", estado: "ocupada" },
  { id: 6, numero: "06", estado: "libre" },
  { id: 7, numero: "07", estado: "inhabilitada" },
  { id: 8, numero: "08", estado: "libre" },
  { id: 9, numero: "09", estado: "ocupada" },
  { id: 10, numero: "10", estado: "libre" },
];

/* ─────────────────────────────────────────
   CATEGORÍAS
───────────────────────────────────────── */
const CATEGORIAS = [
  "Todos",
  "Entradas",
  "Platos fuertes",
  "Bebidas",
  "Postres",
];

/* ─────────────────────────────────────────
   PRODUCTOS
   (TOMA LOS DE TU MENÚ + LOCALSTORAGE)
───────────────────────────────────────── */

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
    nombre: "Pastel Tres Leche",
    categoria: "Postres",
    precio: 4000,
    imagen: null,
  },
];

function formatPrecio(v) {
  return "$ " + v.toLocaleString("es-CO");
}

const hoy = new Date().toLocaleDateString("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

/* ─────────────────────────────────────────
   COMPONENTE
───────────────────────────────────────── */

export default function MeseroPanel() {

  const navigate = useNavigate();

  /* PRODUCTOS GUARDADOS */
  const productosGuardados =
    JSON.parse(localStorage.getItem("productos")) || [];

  /* UNIR PRODUCTOS */
  const PRODUCTOS = [
    ...PRODUCTOS_INICIALES,
    ...productosGuardados,
  ];

  const [mesas, setMesas] =
    useState(MESAS);

  const [mesaSeleccionada, setMesaSeleccionada] =
    useState(null);

  const [categoriaActiva, setCategoriaActiva] =
    useState("Todos");

  const [pedido, setPedido] =
    useState([]);

  const [confirming, setConfirming] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  /* ─────────────────────────────────────
     AGREGAR PRODUCTO
  ───────────────────────────────────── */

  const agregarItem = (producto) => {

    setPedido((prev) => {

      const existe = prev.find(
        (i) => i.producto.id === producto.id
      );

      if (existe) {

        return prev.map((i) =>
          i.producto.id === producto.id
            ? {
                ...i,
                cantidad: i.cantidad + 1,
              }
            : i
        );
      }

      return [
        ...prev,
        {
          producto,
          cantidad: 1,
        },
      ];
    });
  };

  /* ─────────────────────────────────────
     QUITAR PRODUCTO
  ───────────────────────────────────── */

  const quitarItem = (id) => {

    setPedido((prev) => {

      const existe = prev.find(
        (i) => i.producto.id === id
      );

      if (!existe) return prev;

      if (existe.cantidad === 1) {

        return prev.filter(
          (i) => i.producto.id !== id
        );
      }

      return prev.map((i) =>
        i.producto.id === id
          ? {
              ...i,
              cantidad: i.cantidad - 1,
            }
          : i
      );
    });
  };

  const cantidadItem = (id) =>
    pedido.find((i) => i.producto.id === id)
      ?.cantidad || 0;

  const totalPedido = pedido.reduce(
    (acc, i) =>
      acc + i.producto.precio * i.cantidad,
    0
  );

  const itemsCount = pedido.reduce(
    (acc, i) => acc + i.cantidad,
    0
  );

  /* ─────────────────────────────────────
     FILTRAR PRODUCTOS
  ───────────────────────────────────── */

  const productosFiltrados =
    categoriaActiva === "Todos"
      ? PRODUCTOS
      : PRODUCTOS.filter(
          (p) =>
            p.categoria === categoriaActiva
        );

  /* ─────────────────────────────────────
     SELECCIONAR MESA
  ───────────────────────────────────── */

  const seleccionarMesa = (mesa) => {

    if (mesa.estado !== "libre") return;

    setMesaSeleccionada(mesa);

    setPedido([]);

    setSuccess(false);
  };

  /* ─────────────────────────────────────
     VOLVER
  ───────────────────────────────────── */

  const volverAMesas = () => {

    setMesaSeleccionada(null);

    setPedido([]);

    setSuccess(false);

    setConfirming(false);
  };

  /* ─────────────────────────────────────
     CONFIRMAR PEDIDO
  ───────────────────────────────────── */

  const confirmarPedido = () => {

    setMesas((prev) =>
      prev.map((m) =>
        m.id === mesaSeleccionada.id
          ? {
              ...m,
              estado: "ocupada",
            }
          : m
      )
    );

    setSuccess(true);

    setConfirming(false);

    setTimeout(() => {
      volverAMesas();
    }, 2200);
  };

  const libres =
    mesas.filter(
      (m) => m.estado === "libre"
    ).length;

  const ocupadas =
    mesas.filter(
      (m) => m.estado === "ocupada"
    ).length;

  /* ════════════════════════════════════════
     VISTA PRODUCTOS
  ════════════════════════════════════════ */

  if (mesaSeleccionada) {

    return (
      <>
        <div className="mp-layout">

          {/* SIDEBAR */}
          <aside className="mp-sidebar">

            <div className="mp-sidebar-hero">

              <div className="mp-sidebar-hero-overlay">

                <p className="mp-brand">
                  La Mesa Dorada
                </p>

                <p className="mp-brand-sub">
                  Haute Cuisine
                </p>

                <div className="mp-gold-line" />

              </div>

            </div>

            <div className="mp-mesa-info">

              <div className="mp-mesa-num">
                {mesaSeleccionada.numero}
              </div>

              <p className="mp-mesa-label">
                Mesa seleccionada
              </p>

              <span className="mp-mesa-badge">
                ● Tomando pedido
              </span>

            </div>

            <div className="mp-order-summary">

              <p className="mp-order-title">

                Pedido

                {itemsCount > 0 && (
                  <span className="mp-order-count">
                    {itemsCount}
                  </span>
                )}

              </p>

              {pedido.length === 0 ? (

                <p className="mp-order-empty">
                  Aún no has añadido productos
                </p>

              ) : (

                <div className="mp-order-list">

                  {pedido.map((item) => (

                    <div
                      key={item.producto.id}
                      className="mp-order-item"
                    >

                      <div className="mp-order-item-info">

                        <span className="mp-order-item-name">
                          {item.producto.nombre}
                        </span>

                        <span className="mp-order-item-price">
                          {formatPrecio(item.producto.precio)}
                        </span>

                      </div>

                      <div className="mp-order-item-qty">

                        <button
                          className="mp-qty-btn"
                          onClick={() =>
                            quitarItem(item.producto.id)
                          }
                        >
                          −
                        </button>

                        <span className="mp-qty-num">
                          {item.cantidad}
                        </span>

                        <button
                          className="mp-qty-btn"
                          onClick={() =>
                            agregarItem(item.producto)
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>
                  ))}

                  <div className="mp-order-total">

                    <span>Total</span>

                    <span className="mp-order-total-value">
                      {formatPrecio(totalPedido)}
                    </span>

                  </div>

                </div>
              )}

            </div>

            <div className="mp-sidebar-footer">

              {pedido.length > 0 && (

                <button
                  className="mp-confirm-btn"
                  onClick={() =>
                    setConfirming(true)
                  }
                >
                  Confirmar pedido →
                </button>

              )}

              <button
                className="mp-back-btn"
                onClick={volverAMesas}
              >
                ← Volver a mesas
              </button>

            </div>

          </aside>

          {/* MAIN */}
          <main className="mp-main">

            <div className="mp-topbar">

              <div className="mp-topbar-left">

                <p className="mp-topbar-title">
                  Menú del restaurante
                </p>

                <p className="mp-topbar-sub">
                  Selecciona productos para la mesa{" "}
                  {mesaSeleccionada.numero}
                </p>

              </div>

            </div>

            <div className="mp-divider" />

            {/* CATEGORÍAS */}
            <div className="mp-cats">

              {CATEGORIAS.map((cat) => (

                <button
                  key={cat}
                  className={`mp-cat-btn${
                    categoriaActiva === cat
                      ? " mp-cat-btn--active"
                      : ""
                  }`}
                  onClick={() =>
                    setCategoriaActiva(cat)
                  }
                >
                  {cat}
                </button>

              ))}

            </div>

            {/* PRODUCTOS */}
            <div className="mp-content">

              <div className="mp-products-grid">

                {productosFiltrados.map((p) => {

                  const qty =
                    cantidadItem(p.id);

                  return (

                    <div
                      key={p.id}
                      className={`mp-product-card${
                        qty > 0
                          ? " mp-product-card--selected"
                          : ""
                      }`}
                    >

                      {p.imagen ? (

                        <img
                          src={p.imagen}
                          alt={p.nombre}
                          className="mp-product-img"
                        />

                      ) : (

                        <div className="mp-product-emoji">
                          🍽️
                        </div>

                      )}

                      <div className="mp-product-body">

                        <p className="mp-product-name">
                          {p.nombre}
                        </p>

                        <span className="mp-product-cat">
                          {p.categoria}
                        </span>

                        <p className="mp-product-price">
                          {formatPrecio(p.precio)}
                        </p>

                      </div>

                      <div className="mp-product-actions">

                        {qty === 0 ? (

                          <button
                            className="mp-add-item-btn"
                            onClick={() =>
                              agregarItem(p)
                            }
                          >
                            + Agregar
                          </button>

                        ) : (

                          <div className="mp-qty-control">

                            <button
                              className="mp-qty-ctrl-btn"
                              onClick={() =>
                                quitarItem(p.id)
                              }
                            >
                              −
                            </button>

                            <span className="mp-qty-ctrl-num">
                              {qty}
                            </span>

                            <button
                              className="mp-qty-ctrl-btn"
                              onClick={() =>
                                agregarItem(p)
                              }
                            >
                              +
                            </button>

                          </div>

                        )}

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

          </main>

        </div>

        {/* MODAL */}
        {confirming && (

          <div className="mp-modal-overlay">

            <div className="mp-modal">

              <div className="mp-modal-icon">
                🧾
              </div>

              <h2>
                Confirmar pedido
              </h2>

              <p className="mp-modal-mesa">
                Mesa {mesaSeleccionada.numero}
              </p>

              <div className="mp-modal-items">

                {pedido.map((item) => (

                  <div
                    key={item.producto.id}
                    className="mp-modal-row"
                  >

                    <span>
                      {item.cantidad}×{" "}
                      {item.producto.nombre}
                    </span>

                    <span>
                      {formatPrecio(
                        item.producto.precio *
                          item.cantidad
                      )}
                    </span>

                  </div>

                ))}

              </div>

              <div className="mp-modal-total">

                <span>Total</span>

                <span>
                  {formatPrecio(totalPedido)}
                </span>

              </div>

              <div className="mp-modal-btns">

                <button
                  className="mp-modal-confirm"
                  onClick={confirmarPedido}
                >
                  Enviar pedido
                </button>

                <button
                  className="mp-modal-cancel"
                  onClick={() =>
                    setConfirming(false)
                  }
                >
                  Revisar
                </button>

              </div>

            </div>

          </div>

        )}

        {/* TOAST */}
        {success && (

          <div className="mp-toast">
            ✅ ¡Pedido enviado!
            Mesa {mesaSeleccionada.numero} activa
          </div>

        )}
      </>
    );
  }

  /* ════════════════════════════════════════
     VISTA MESAS
  ════════════════════════════════════════ */

  return (
    <div className="mp-layout">

      {/* SIDEBAR */}
      <aside className="mp-sidebar">

        <div className="mp-sidebar-hero">

          <div className="mp-sidebar-hero-overlay">

            <p className="mp-brand">
              La Mesa Dorada
            </p>

            <p className="mp-brand-sub">
              Haute Cuisine
            </p>

            <div className="mp-gold-line" />

          </div>

        </div>

        <div className="mp-mesero-info">

          <div className="mp-mesero-avatar">
            👨‍🍳
          </div>

          <p className="mp-mesero-name">
            Mesero
          </p>

          <span className="mp-mesero-badge">
            ● En servicio
          </span>

        </div>

        <div className="mp-sidebar-stats">

          <div className="mp-stat mp-stat--libre">

            <div className="mp-stat-info">

              <span className="mp-stat-label">
                Mesas libres
              </span>

              <span className="mp-stat-value">
                {libres}
              </span>

            </div>

            <div className="mp-stat-icon">
              🪑
            </div>

          </div>

          <div className="mp-stat mp-stat--ocupada">

            <div className="mp-stat-info">

              <span className="mp-stat-label">
                Mesas ocupadas
              </span>

              <span className="mp-stat-value">
                {ocupadas}
              </span>

            </div>

            <div className="mp-stat-icon">
              🧾
            </div>

          </div>

        </div>

        <div className="mp-sidebar-footer">

        <button
          className="mp-back-btn"
          onClick={() => {

            // ELIMINAR SESIÓN
            localStorage.removeItem("usuario");

            // REDIRIGIR AL LOGIN
            navigate("/login");
          }}
        >
          ← Cerrar Sesión
        </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="mp-main">

        <div className="mp-topbar">

          <div className="mp-topbar-left">

            <p className="mp-topbar-title">
              Mesas del salón
            </p>

            <p className="mp-topbar-sub">
              {hoy}
            </p>

          </div>

        </div>

        <div className="mp-divider" />

        <div className="mp-content">

          <p className="mp-section-label">
            Selecciona una mesa libre
          </p>

          <div className="mp-mesas-grid">

            {mesas.map((m) => (

              <div
                key={m.id}
                className={`mp-mesa-card mp-mesa-card--${m.estado}${
                  m.estado === "libre"
                    ? " mp-mesa-card--clickable"
                    : ""
                }`}
                onClick={() =>
                  seleccionarMesa(m)
                }
              >

                <div
                  className={`mp-mesa-card-accent mp-mesa-card-accent--${m.estado}`}
                />

                <div className="mp-mesa-card-top">

                  <div className="mp-mesa-card-num">
                    {m.numero}
                  </div>

                  <span
                    className={`mp-mesa-card-badge mp-mesa-card-badge--${m.estado}`}
                  >

                    {m.estado === "libre"
                      ? "Libre"
                      : m.estado === "ocupada"
                      ? "Ocupada"
                      : "Inhabilitada"}

                  </span>

                </div>

                <div className="mp-mesa-card-icon">

                  {m.estado === "libre"
                    ? "🪑"
                    : m.estado === "ocupada"
                    ? "🧾"
                    : "🚫"}

                </div>

                {m.estado === "libre" && (

                  <div className="mp-mesa-card-cta">
                    Tomar pedido →
                  </div>

                )}

              </div>

            ))}

          </div>

        </div>

      </main>

    </div>
  );
}