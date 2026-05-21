import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Waiter.css";

const MESAS_INICIALES = [
  { id: 1,  numero: "01", estado: "libre" },
  { id: 2,  numero: "02", estado: "libre" },
  { id: 3,  numero: "03", estado: "libre" },
  { id: 4,  numero: "04", estado: "libre" },
  { id: 5,  numero: "05", estado: "libre" },
  { id: 6,  numero: "06", estado: "libre" },
  { id: 7,  numero: "07", estado: "inhabilitada" },
  { id: 8,  numero: "08", estado: "libre" },
  { id: 9,  numero: "09", estado: "libre" },
  { id: 10, numero: "10", estado: "libre" },
];

const PRODUCTOS_INICIALES = [
  { id: 1, nombre: "Jugo de Fresa",     categoria: "Bebidas",        precio: 15000 },
  { id: 2, nombre: "Limonada",          categoria: "Bebidas",        precio: 15000 },
  { id: 3, nombre: "Costilla BBQ",      categoria: "Platos fuertes", precio: 45000 },
  { id: 4, nombre: "Dedos de Queso",    categoria: "Entradas",       precio: 34000 },
  { id: 5, nombre: "Pastel Tres Leche", categoria: "Postres",        precio: 4000  },
];

function formatPrecio(v) {
  return "$ " + v.toLocaleString("es-CO");
}

const hoy = new Date().toLocaleDateString("es-CO", {
  weekday: "long", day: "numeric", month: "long",
});

export default function MeseroPanel() {
  const navigate = useNavigate();

  const usuarioActual = JSON.parse(localStorage.getItem("usuario") || "{}");

  const [mesas, setMesas]                       = useState([]);
  const [productos, setProductos]               = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [mesaConsumo, setMesaConsumo]           = useState(null);
  const [categoriaActiva, setCategoriaActiva]   = useState("Todos");
  const [pedido, setPedido]                     = useState([]);
  const [confirming, setConfirming]             = useState(false);
  const [success, setSuccess]                   = useState(false);

  const cajaAbierta = JSON.parse(localStorage.getItem("caja_abierta") || "null");

  if (!cajaAbierta) {
    return (
      <div style={{ minHeight: "100vh", background: "#fafaf9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ background: "#ffffff", border: "2px solid rgba(220,38,38,0.2)", borderTop: "4px solid #A33333", borderRadius: "18px", padding: "48px 40px", textAlign: "center", maxWidth: "420px", width: "90%", boxShadow: "0 16px 50px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>🔒</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, color: "#1C1410", marginBottom: "10px" }}>Caja no disponible</h2>
          <p style={{ fontSize: "14px", color: "#8A7060", lineHeight: 1.6, marginBottom: "28px" }}>El administrador aún no ha abierto la caja del día.</p>
          <button onClick={() => { localStorage.removeItem("usuario"); navigate("/login"); }} style={{ background: "#1C1410", color: "#F5E6D0", border: "none", borderRadius: "10px", padding: "12px 28px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            ← Volver al login
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos([...PRODUCTOS_INICIALES, ...guardados]);

    const mesasAdmin = JSON.parse(localStorage.getItem("mesas")) || [];

    const mesasBase = MESAS_INICIALES.map((m) => {
      const override       = mesasAdmin.find((a) => a.id === m.id);
      const estadoBase     = override ? override.estado.toLowerCase() : m.estado;
      const pedidoGuardado = localStorage.getItem(`pedido_mesa_${m.id}`);
      if (pedidoGuardado && estadoBase !== "inhabilitada") return { ...m, estado: "ocupada" };
      return { ...m, estado: estadoBase };
    });

    const mesasExtra = mesasAdmin.filter((m) => m.id > 10).map((m) => {
      const estado         = m.estado.toLowerCase();
      const pedidoGuardado = localStorage.getItem(`pedido_mesa_${m.id}`);
      if (pedidoGuardado && estado !== "inhabilitada") return { ...m, estado: "ocupada" };
      return { ...m, estado };
    });

    setMesas([...mesasBase, ...mesasExtra]);
  }, []);

  const agregarItem = (producto) => {
    setPedido((prev) => {
      const existe = prev.find((i) => i.producto.id === producto.id);
      if (existe) return prev.map((i) => i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const quitarItem = (id) => {
    setPedido((prev) => {
      const existe = prev.find((i) => i.producto.id === id);
      if (!existe) return prev;
      if (existe.cantidad === 1) return prev.filter((i) => i.producto.id !== id);
      return prev.map((i) => i.producto.id === id ? { ...i, cantidad: i.cantidad - 1 } : i);
    });
  };

  const cantidadItem = (id)  => pedido.find((i) => i.producto.id === id)?.cantidad || 0;
  const totalPedido  = pedido.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0);
  const itemsCount   = pedido.reduce((acc, i) => acc + i.cantidad, 0);

  const normalizarCategoria = (cat) => {
    if (!cat) return "Otros";
    const c = cat.toLowerCase().trim();
    if (c.includes("entrada")) return "Entradas";
    if (c.includes("jugo") || c.includes("bebida")) return "Bebidas";
    if (c.includes("asado") || c.includes("plato")) return "Platos fuertes";
    if (c.includes("postre")) return "Postres";
    return cat;
  };

  const productosNormalizados = productos.map((p) => ({ ...p, categoria: normalizarCategoria(p.categoria) }));
  const categoriasDisponibles = ["Todos", ...Array.from(new Set(productosNormalizados.map((p) => p.categoria)))];
  const productosFiltrados    = categoriaActiva === "Todos" ? productosNormalizados : productosNormalizados.filter((p) => p.categoria === categoriaActiva);

  const seleccionarMesa = (mesa) => {
    if (mesa.estado === "inhabilitada") return;
    if (mesa.estado === "ocupada") {
      const consumo = JSON.parse(localStorage.getItem(`pedido_mesa_${mesa.id}`));
      setMesaConsumo({ mesa, consumo });
      setPedido([]);
      return;
    }
    setMesaSeleccionada(mesa);
    setPedido([]);
    setSuccess(false);
  };

  const volverAMesas = () => {
    setMesaSeleccionada(null);
    setMesaConsumo(null);
    setPedido([]);
    setSuccess(false);
    setConfirming(false);
  };

  const confirmarPedido = () => {
    const nuevoPedido = {
      mesaNumero    : mesaSeleccionada.numero,
      mesaId        : mesaSeleccionada.id,
      meseroUsuario : usuarioActual.usuario || "desconocido",
      meseroNombre  : usuarioActual.nombre  || "Mesero",
      items         : pedido.map((i) => ({ nombre: i.producto.nombre, precio: i.producto.precio, cantidad: i.cantidad })),
      total         : totalPedido,
      fecha         : new Date().toLocaleString("es-CO"),
      timestamp     : Date.now(),
    };
    localStorage.setItem(`pedido_mesa_${mesaSeleccionada.id}`, JSON.stringify(nuevoPedido));
    const mesasAdmin      = JSON.parse(localStorage.getItem("mesas")) || [];
    const mesasActualizadas = mesasAdmin.map((m) => m.id === mesaSeleccionada.id ? { ...m, estado: "consumo" } : m);
    if (!mesasAdmin.find((m) => m.id === mesaSeleccionada.id)) mesasActualizadas.push({ ...mesaSeleccionada, estado: "consumo" });
    localStorage.setItem("mesas", JSON.stringify(mesasActualizadas));
    setMesas((prev) => prev.map((m) => m.id === mesaSeleccionada.id ? { ...m, estado: "ocupada" } : m));
    setSuccess(true);
    setConfirming(false);
    setTimeout(() => volverAMesas(), 2200);
  };

  const libres   = mesas.filter((m) => m.estado === "libre").length;
  const ocupadas = mesas.filter((m) => m.estado === "ocupada").length;

  /* ── VISTA: CONSUMO ── */
  if (mesaConsumo) {
    const { mesa, consumo } = mesaConsumo;
    const esMia = consumo?.meseroUsuario === usuarioActual.usuario;

    return (
      <div className="mp-layout">
        <aside className="mp-sidebar">
          <div className="mp-sidebar-hero">
            <div className="mp-sidebar-hero-overlay">
              <p className="mp-brand">La Mesa Dorada</p>
              <p className="mp-brand-sub">Haute Cuisine</p>
              <div className="mp-gold-line" />
            </div>
          </div>
          <div className="mp-mesa-info">
            <div className="mp-mesa-num">{mesa.numero}</div>
            <p className="mp-mesa-label">Mesa ocupada</p>
            <span className="mp-mesa-badge mp-mesa-badge--busy">● Con consumo activo</span>
            {consumo?.meseroNombre && (
              <p style={{ fontSize: "11px", color: "#8A7060", marginTop: "6px" }}>
                Atendida por: <strong>{consumo.meseroNombre}</strong>
              </p>
            )}
          </div>
          {consumo && (
            <div className="mp-consumo-resumen">
              <p className="mp-order-title">Resumen</p>
              <div className="mp-consumo-row">
                <span className="mp-stat-label">Productos</span>
                <span className="mp-consumo-val">{consumo.items.reduce((a, i) => a + i.cantidad, 0)}</span>
              </div>
              <div className="mp-consumo-row">
                <span className="mp-stat-label">Total</span>
                <span className="mp-consumo-val mp-consumo-val--green">{formatPrecio(consumo.total)}</span>
              </div>
            </div>
          )}
          <div className="mp-sidebar-footer">
            <button className="mp-back-btn" onClick={volverAMesas}>← Volver a mesas</button>
          </div>
        </aside>

        <main className="mp-main">
          <div className="mp-topbar">
            <div className="mp-topbar-left">
              <p className="mp-topbar-title">Consumo — Mesa {mesa.numero}</p>
              <p className="mp-topbar-sub">
                {esMia ? "Esta mesa es tuya — puedes agregar productos" : `Atendida por ${consumo?.meseroNombre || "otro mesero"} — solo lectura`}
              </p>
            </div>
            {consumo && (
              <div className="mp-topbar-badge">Total: <span className="mp-topbar-badge-num">{formatPrecio(consumo.total)}</span></div>
            )}
          </div>
          <div className="mp-divider" />
          <div className="mp-content">
            {!consumo ? (
              <div className="mp-consumo-empty"><p>📋</p><p>No hay pedido registrado</p></div>
            ) : (
              <div className="mp-consumo-table">
                <p className="mp-section-label">Productos pedidos</p>
                <div className="mp-consumo-list">
                  <div className="mp-consumo-header">
                    <span>Producto</span><span>Cant.</span><span>Precio unit.</span><span>Subtotal</span>
                  </div>
                  {consumo.items.map((item, idx) => (
                    <div key={idx} className="mp-consumo-item">
                      <span className="mp-consumo-item-name">{item.nombre}</span>
                      <span className="mp-consumo-item-qty">{item.cantidad}</span>
                      <span className="mp-consumo-item-price">{formatPrecio(item.precio)}</span>
                      <span className="mp-consumo-item-sub">{formatPrecio(item.precio * item.cantidad)}</span>
                    </div>
                  ))}
                  <div className="mp-consumo-total-row">
                    <span className="mp-consumo-total-label">Total del pedido</span>
                    <span className="mp-consumo-total-val">{formatPrecio(consumo.total)}</span>
                  </div>
                </div>

                {esMia && (
                  <div style={{ marginTop: "24px" }}>
                    <p className="mp-section-label">Agregar más productos</p>
                    <div className="mp-cats" style={{ marginBottom: "12px" }}>
                      {categoriasDisponibles.map((cat) => (
                        <button key={cat} className={`mp-cat-btn${categoriaActiva === cat ? " mp-cat-btn--active" : ""}`} onClick={() => setCategoriaActiva(cat)}>{cat}</button>
                      ))}
                    </div>
                    <div className="mp-products-grid">
                      {productosFiltrados.map((p) => {
                        const qty = pedido.find((i) => i.producto.id === p.id)?.cantidad || 0;
                        return (
                          <div key={p.id} className={`mp-product-card${qty > 0 ? " mp-product-card--selected" : ""}`}>
                            <div className="mp-product-emoji">🍽️</div>
                            <div className="mp-product-body">
                              <p className="mp-product-name">{p.nombre}</p>
                              <span className="mp-product-cat">{p.categoria}</span>
                              <p className="mp-product-price">{formatPrecio(p.precio)}</p>
                            </div>
                            <div className="mp-product-actions">
                              {qty === 0 ? (
                                <button className="mp-add-item-btn" onClick={() => agregarItem(p)}>+ Agregar</button>
                              ) : (
                                <div className="mp-qty-control">
                                  <button className="mp-qty-ctrl-btn" onClick={() => quitarItem(p.id)}>−</button>
                                  <span className="mp-qty-ctrl-num">{qty}</span>
                                  <button className="mp-qty-ctrl-btn" onClick={() => agregarItem(p)}>+</button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {pedido.length > 0 && (
                      <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                        <button className="mp-confirm-btn" onClick={() => {
                          const pedidoActual    = JSON.parse(localStorage.getItem(`pedido_mesa_${mesa.id}`));
                          const itemsAnteriores = pedidoActual?.items || [];
                          const nuevosItems     = [...itemsAnteriores];
                          pedido.forEach((nuevo) => {
                            const existe = nuevosItems.find((i) => i.nombre === nuevo.producto.nombre);
                            if (existe) existe.cantidad += nuevo.cantidad;
                            else nuevosItems.push({ nombre: nuevo.producto.nombre, precio: nuevo.producto.precio, cantidad: nuevo.cantidad });
                          });
                          const nuevoTotal       = nuevosItems.reduce((a, i) => a + i.precio * i.cantidad, 0);
                          const pedidoActualizado = { ...pedidoActual, items: nuevosItems, total: nuevoTotal };
                          localStorage.setItem(`pedido_mesa_${mesa.id}`, JSON.stringify(pedidoActualizado));
                          setMesaConsumo({ mesa, consumo: pedidoActualizado });
                          setPedido([]);
                        }}>
                          ✅ Agregar al pedido ({formatPrecio(pedido.reduce((a, i) => a + i.producto.precio * i.cantidad, 0))})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  /* ── VISTA: MENÚ PRODUCTOS ── */
  if (mesaSeleccionada) {
    return (
      <>
        <div className="mp-layout">
          <aside className="mp-sidebar">
            <div className="mp-sidebar-hero">
              <div className="mp-sidebar-hero-overlay">
                <p className="mp-brand">La Mesa Dorada</p>
                <p className="mp-brand-sub">Haute Cuisine</p>
                <div className="mp-gold-line" />
              </div>
            </div>
            <div className="mp-mesa-info">
              <div className="mp-mesa-num">{mesaSeleccionada.numero}</div>
              <p className="mp-mesa-label">Mesa seleccionada</p>
              <span className="mp-mesa-badge">● Tomando pedido</span>
            </div>
            <div className="mp-order-summary">
              <p className="mp-order-title">Pedido {itemsCount > 0 && <span className="mp-order-count">{itemsCount}</span>}</p>
              {pedido.length === 0 ? (
                <p className="mp-order-empty">Aún no has añadido productos</p>
              ) : (
                <div className="mp-order-list">
                  {pedido.map((item) => (
                    <div key={item.producto.id} className="mp-order-item">
                      <div className="mp-order-item-info">
                        <span className="mp-order-item-name">{item.producto.nombre}</span>
                        <span className="mp-order-item-price">{formatPrecio(item.producto.precio)}</span>
                      </div>
                      <div className="mp-order-item-qty">
                        <button className="mp-qty-btn" onClick={() => quitarItem(item.producto.id)}>−</button>
                        <span className="mp-qty-num">{item.cantidad}</span>
                        <button className="mp-qty-btn" onClick={() => agregarItem(item.producto)}>+</button>
                      </div>
                    </div>
                  ))}
                  <div className="mp-order-total">
                    <span>Total</span>
                    <span className="mp-order-total-value">{formatPrecio(totalPedido)}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="mp-sidebar-footer">
              {pedido.length > 0 && <button className="mp-confirm-btn" onClick={() => setConfirming(true)}>Confirmar pedido →</button>}
              <button className="mp-back-btn" onClick={volverAMesas}>← Volver a mesas</button>
            </div>
          </aside>

          <main className="mp-main">
            <div className="mp-topbar">
              <div className="mp-topbar-left">
                <p className="mp-topbar-title">Menú del restaurante</p>
                <p className="mp-topbar-sub">Mesa {mesaSeleccionada.numero} · {usuarioActual.nombre}</p>
              </div>
              {itemsCount > 0 && (
                <div className="mp-topbar-badge">
                  <span className="mp-topbar-badge-num">{itemsCount}</span> producto{itemsCount !== 1 ? "s" : ""} · {formatPrecio(totalPedido)}
                </div>
              )}
            </div>
            <div className="mp-divider" />
            <div className="mp-cats">
              {categoriasDisponibles.map((cat) => (
                <button key={cat} className={`mp-cat-btn${categoriaActiva === cat ? " mp-cat-btn--active" : ""}`} onClick={() => setCategoriaActiva(cat)}>{cat}</button>
              ))}
            </div>
            <div className="mp-content">
              {productosFiltrados.length === 0 ? (
                <div className="mp-no-productos"><p>🍽️</p><p>No hay productos en esta categoría</p></div>
              ) : (
                <div className="mp-products-grid">
                  {productosFiltrados.map((p) => {
                    const qty = cantidadItem(p.id);
                    return (
                      <div key={p.id} className={`mp-product-card${qty > 0 ? " mp-product-card--selected" : ""}`}>
                        {p.imagen ? <img src={p.imagen} alt={p.nombre} className="mp-product-img" /> : <div className="mp-product-emoji">🍽️</div>}
                        <div className="mp-product-body">
                          <p className="mp-product-name">{p.nombre}</p>
                          <span className="mp-product-cat">{p.categoria}</span>
                          <p className="mp-product-price">{formatPrecio(p.precio)}</p>
                        </div>
                        <div className="mp-product-actions">
                          {qty === 0 ? (
                            <button className="mp-add-item-btn" onClick={() => agregarItem(p)}>+ Agregar</button>
                          ) : (
                            <div className="mp-qty-control">
                              <button className="mp-qty-ctrl-btn" onClick={() => quitarItem(p.id)}>−</button>
                              <span className="mp-qty-ctrl-num">{qty}</span>
                              <button className="mp-qty-ctrl-btn" onClick={() => agregarItem(p)}>+</button>
                            </div>
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

        {confirming && (
          <div className="mp-modal-overlay">
            <div className="mp-modal">
              <div className="mp-modal-icon">🧾</div>
              <h2>Confirmar pedido</h2>
              <p className="mp-modal-mesa">Mesa {mesaSeleccionada.numero}</p>
              <div className="mp-modal-items">
                {pedido.map((item) => (
                  <div key={item.producto.id} className="mp-modal-row">
                    <span>{item.cantidad}× {item.producto.nombre}</span>
                    <span>{formatPrecio(item.producto.precio * item.cantidad)}</span>
                  </div>
                ))}
              </div>
              <div className="mp-modal-total"><span>Total</span><span>{formatPrecio(totalPedido)}</span></div>
              <div className="mp-modal-btns">
                <button className="mp-modal-confirm" onClick={confirmarPedido}>Enviar pedido</button>
                <button className="mp-modal-cancel" onClick={() => setConfirming(false)}>Revisar</button>
              </div>
            </div>
          </div>
        )}
        {success && <div className="mp-toast">✅ ¡Pedido enviado! Mesa {mesaSeleccionada.numero} activa</div>}
      </>
    );
  }

  /* ── VISTA: MESAS ── */
  return (
    <div className="mp-layout">
      <aside className="mp-sidebar">
        <div className="mp-sidebar-hero">
          <div className="mp-sidebar-hero-overlay">
            <p className="mp-brand">La Mesa Dorada</p>
            <p className="mp-brand-sub">Haute Cuisine</p>
            <div className="mp-gold-line" />
          </div>
        </div>
        <div className="mp-mesero-info">
          <div className="mp-mesero-avatar">👨‍🍳</div>
          <p className="mp-mesero-name">{usuarioActual.nombre || "Mesero"}</p>
          <span style={{ fontSize: "11px", color: "#8A7060", display: "block", textAlign: "center", marginBottom: "4px" }}>@{usuarioActual.usuario}</span>
          <span className="mp-mesero-badge">● En servicio</span>
        </div>
        <div className="mp-sidebar-stats">
          <div className="mp-stat mp-stat--libre">
            <div className="mp-stat-info"><span className="mp-stat-label">Mesas libres</span><span className="mp-stat-value">{libres}</span></div>
            <div className="mp-stat-icon">🪑</div>
          </div>
          <div className="mp-stat mp-stat--ocupada">
            <div className="mp-stat-info"><span className="mp-stat-label">Mesas ocupadas</span><span className="mp-stat-value">{ocupadas}</span></div>
            <div className="mp-stat-icon">🧾</div>
          </div>
        </div>
        <div className="mp-sidebar-hint">
          <p>🟢 <strong>Libre</strong>: tomar pedido<br />🟠 <strong>Tu mesa</strong>: ver y editar<br />🔵 <strong>Otro mesero</strong>: solo ver</p>
        </div>
        <div className="mp-sidebar-footer">
          <button className="mp-back-btn" onClick={() => { localStorage.removeItem("usuario"); navigate("/login"); }}>← Cerrar Sesión</button>
        </div>
      </aside>

      <main className="mp-main">
        <div className="mp-topbar">
          <div className="mp-topbar-left">
            <p className="mp-topbar-title">Mesas del salón</p>
            <p className="mp-topbar-sub">{hoy}</p>
          </div>
          <div className="mp-topbar-right-pills">
            <span className="mp-pill mp-pill--libre">🪑 {libres} libres</span>
            <span className="mp-pill mp-pill--ocupada">🧾 {ocupadas} ocupadas</span>
          </div>
        </div>
        <div className="mp-divider" />
        <div className="mp-content">
          <p className="mp-section-label">Selecciona una mesa</p>
          <div className="mp-mesas-grid">
            {mesas.map((m) => {
              const pedidoMesa   = m.estado === "ocupada" ? JSON.parse(localStorage.getItem(`pedido_mesa_${m.id}`) || "null") : null;
              const esPropiaMesa = pedidoMesa?.meseroUsuario === usuarioActual.usuario;
              const meseroNombre = pedidoMesa?.meseroNombre;
              const accentClass  = m.estado === "ocupada" ? (esPropiaMesa ? "ocupada-propia" : "ocupada-otro") : m.estado;

              return (
                <div key={m.id} className={`mp-mesa-card mp-mesa-card--${m.estado}${m.estado !== "inhabilitada" ? " mp-mesa-card--clickable" : ""}`} onClick={() => seleccionarMesa(m)}>
                  <div className={`mp-mesa-card-accent mp-mesa-card-accent--${accentClass}`} />
                  <div className="mp-mesa-card-top">
                    <div className="mp-mesa-card-num">{m.numero}</div>
                    <span className={`mp-mesa-card-badge mp-mesa-card-badge--${m.estado}`}>
                      {m.estado === "libre" ? "Libre" : m.estado === "ocupada" ? (esPropiaMesa ? "Mi mesa" : "Ocupada") : "Inhabilitada"}
                    </span>
                  </div>
                  <div className="mp-mesa-card-icon">
                    {m.estado === "libre" ? "🪑" : m.estado === "ocupada" ? "🧾" : "🚫"}
                  </div>
                  {m.estado === "libre" && <div className="mp-mesa-card-cta">Tomar pedido →</div>}
                  {m.estado === "ocupada" && esPropiaMesa && <div className="mp-mesa-card-cta">Ver / editar →</div>}
                  {m.estado === "ocupada" && !esPropiaMesa && (
                    <div className="mp-mesa-card-cta mp-mesa-card-cta--readonly">{meseroNombre ? `${meseroNombre} · Ver` : "Ver consumo →"}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}