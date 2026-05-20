import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Reports.css";

function formatPrecio(v) {
  return "$ " + v.toLocaleString("es-CO");
}

function pct(val, max) {
  return Math.min(100, Math.round((val / max) * 100));
}

const SECCIONES = [
  { id: "resumen",    label: "Resumen",    icon: "📊" },
  { id: "productos",  label: "Productos",  icon: "🍽️" },
  { id: "stock",      label: "Stock",      icon: "📦" },
  { id: "mesas",      label: "Mesas",      icon: "🪑" },
];

const PRODUCTOS_INICIALES = [
  { id: 1, nombre: "Jugo de Fresa",      categoria: "Bebidas",        precio: 15000, stock: 20, stockMinimo: 5,  unidad: "vasos" },
  { id: 2, nombre: "Limonada",           categoria: "Bebidas",        precio: 15000, stock: 15, stockMinimo: 5,  unidad: "vasos" },
  { id: 3, nombre: "Costilla BBQ",       categoria: "Platos fuertes", precio: 45000, stock: 8,  stockMinimo: 5,  unidad: "porciones" },
  { id: 4, nombre: "Dedos de Queso",     categoria: "Entradas",       precio: 34000, stock: 12, stockMinimo: 5,  unidad: "porciones" },
  { id: 5, nombre: "Pastel Tres Leches", categoria: "Postres",        precio: 4000,  stock: 6,  stockMinimo: 3,  unidad: "porciones" },
];

function cargarTodosLosPedidos() {
  const pedidos = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("pedido_mesa_")) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data) pedidos.push(data);
      } catch {}
    }
  }
  return pedidos;
}

function cargarTodosLosProductos() {
  const guardados = JSON.parse(localStorage.getItem("productos")) || [];
  const ids = new Set(guardados.map((p) => p.id));
  const iniciales = PRODUCTOS_INICIALES.filter((p) => !ids.has(p.id));
  return [...iniciales, ...guardados];
}

export default function Reports() {
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState("resumen");

  const pedidos   = useMemo(() => cargarTodosLosPedidos(), []);
  const productos = useMemo(() => cargarTodosLosProductos(), []);

  const stats = useMemo(() => {
    const totalVentas    = pedidos.reduce((a, p) => a + p.total, 0);
    const totalPedidos   = pedidos.length;
    const ticketPromedio = totalPedidos > 0 ? Math.round(totalVentas / totalPedidos) : 0;

    const prodMap = {};
    pedidos.forEach((p) => {
      (p.items || []).forEach((i) => {
        if (!prodMap[i.nombre]) prodMap[i.nombre] = { nombre: i.nombre, cantidad: 0, ingresos: 0 };
        prodMap[i.nombre].cantidad += i.cantidad;
        prodMap[i.nombre].ingresos += i.cantidad * i.precio;
      });
    });
    const productosMasVendidos = Object.values(prodMap).sort((a, b) => b.cantidad - a.cantidad);
    const maxProd = productosMasVendidos[0]?.cantidad || 1;

    const mesaMap = {};
    pedidos.forEach((p) => {
      const key = p.mesaNumero || p.mesaId;
      if (!mesaMap[key]) mesaMap[key] = { mesa: p.mesaNumero || String(p.mesaId), pedidos: 0, total: 0 };
      mesaMap[key].pedidos += 1;
      mesaMap[key].total   += p.total;
    });
    const mesas = Object.values(mesaMap).sort((a, b) => b.total - a.total);

    const stockCritico = productos
      .filter((p) => p.stock != null && p.stock <= (p.stockMinimo || 5))
      .sort((a, b) => (a.stock / (a.stockMinimo || 5)) - (b.stock / (b.stockMinimo || 5)));

    return { totalVentas, totalPedidos, ticketPromedio, productosMasVendidos, maxProd, mesas, stockCritico };
  }, [pedidos, productos]);

  return (
    <div className="rp-layout">
      <aside className="rp-sidebar">
        <div className="rp-sidebar-hero">
          <div className="rp-sidebar-hero-overlay">
            <p className="rp-brand">La Mesa Dorada</p>
            <p className="rp-brand-sub">Haute Cuisine</p>
            <div className="rp-gold-line" />
          </div>
        </div>

        <nav className="rp-nav">
          <p className="rp-nav-label">Secciones</p>
          {SECCIONES.map((s) => (
            <button
              key={s.id}
              className={`rp-nav-btn${seccion === s.id ? " rp-nav-btn--active" : ""}`}
              onClick={() => setSeccion(s.id)}
            >
              <span className="rp-nav-icon">{s.icon}</span>
              {s.label}
              {s.id === "stock" && stats.stockCritico.length > 0 && (
                <span className="rp-nav-alert">{stats.stockCritico.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="rp-sidebar-meta">
          <div className="rp-sidebar-meta-row">
            <span className="rp-sidebar-meta-label">Pedidos</span>
            <span className="rp-sidebar-meta-val">{stats.totalPedidos}</span>
          </div>
          <div className="rp-sidebar-meta-row">
            <span className="rp-sidebar-meta-label">Ingresos</span>
            <span className="rp-sidebar-meta-val rp-sidebar-meta-val--green">{formatPrecio(stats.totalVentas)}</span>
          </div>
          <div className="rp-sidebar-meta-row">
            <span className="rp-sidebar-meta-label">Stock crítico</span>
            <span className={`rp-sidebar-meta-val ${stats.stockCritico.length > 0 ? "rp-sidebar-meta-val--red" : ""}`}>
              {stats.stockCritico.length} producto{stats.stockCritico.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="rp-sidebar-footer">
          <button className="rp-back-btn" onClick={() => navigate("/panel-admin")}>← Volver al panel</button>
        </div>
      </aside>

      <main className="rp-main">
        <div className="rp-topbar">
          <div className="rp-topbar-left">
            <p className="rp-topbar-title">Reportes</p>
            <p className="rp-topbar-sub">{SECCIONES.find((s) => s.id === seccion)?.label}</p>
          </div>
          {stats.stockCritico.length > 0 && (
            <div className="rp-alert-pill" onClick={() => setSeccion("stock")}>
              ⚠️ {stats.stockCritico.length} producto{stats.stockCritico.length !== 1 ? "s" : ""} por agotarse
            </div>
          )}
        </div>

        <div className="rp-divider" />

        <div className="rp-content">

          {/* ═══════ RESUMEN ═══════ */}
          {seccion === "resumen" && (
            <div className="rp-section">
              {pedidos.length === 0 ? (
                <div className="rp-empty">
                  <p className="rp-empty-icon">📋</p>
                  <p>No hay pedidos registrados aún</p>
                </div>
              ) : (
                <>
                  <div className="rp-kpi-grid">
                    <div className="rp-kpi rp-kpi--gold">
                      <p className="rp-kpi-label">Ingresos totales</p>
                      <p className="rp-kpi-value">{formatPrecio(stats.totalVentas)}</p>
                    </div>
                    <div className="rp-kpi rp-kpi--green">
                      <p className="rp-kpi-label">Total pedidos</p>
                      <p className="rp-kpi-value">{stats.totalPedidos}</p>
                    </div>
                    <div className="rp-kpi rp-kpi--orange">
                      <p className="rp-kpi-label">Ticket promedio</p>
                      <p className="rp-kpi-value">{formatPrecio(stats.ticketPromedio)}</p>
                    </div>
                  </div>

                  <div className="rp-row-2">
                    {stats.productosMasVendidos[0] && (
                      <div className="rp-card">
                        <p className="rp-card-title">⭐ Producto más vendido</p>
                        <div className="rp-top-prod">
                          <div className="rp-top-prod-icon">🍽️</div>
                          <div>
                            <p className="rp-top-name">{stats.productosMasVendidos[0].nombre}</p>
                            <p className="rp-top-sub">{stats.productosMasVendidos[0].cantidad} unidades · {formatPrecio(stats.productosMasVendidos[0].ingresos)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {stats.mesas[0] && (
                      <div className="rp-card">
                        <p className="rp-card-title">🪑 Mesa más activa</p>
                        <div className="rp-top-prod">
                          <div className="rp-top-prod-icon">🧾</div>
                          <div>
                            <p className="rp-top-name">Mesa {stats.mesas[0].mesa}</p>
                            <p className="rp-top-sub">{stats.mesas[0].pedidos} pedido{stats.mesas[0].pedidos !== 1 ? "s" : ""} · {formatPrecio(stats.mesas[0].total)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {stats.stockCritico.length > 0 && (
                    <div className="rp-card rp-card--alert">
                      <p className="rp-card-title">⚠️ Productos por agotarse</p>
                      <div className="rp-alert-list">
                        {stats.stockCritico.slice(0, 3).map((item) => (
                          <div key={item.id} className="rp-alert-row">
                            <span className="rp-alert-name">{item.nombre}</span>
                            <span className="rp-alert-stock">{item.stock} {item.unidad} / mín. {item.stockMinimo || 5}</span>
                            <div className="rp-alert-bar-wrap">
                              <div className="rp-alert-bar" style={{ width: `${pct(item.stock, item.stockMinimo || 5)}%` }} />
                            </div>
                          </div>
                        ))}
                        {stats.stockCritico.length > 3 && (
                          <button className="rp-ver-mas" onClick={() => setSeccion("stock")}>Ver {stats.stockCritico.length - 3} más →</button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="rp-card">
                    <p className="rp-card-title">📋 Pedidos registrados</p>
                    <div className="rp-detail-list" style={{ marginTop: "0.75rem" }}>
                      {pedidos.map((p, idx) => (
                        <div key={idx} className="rp-detail-row">
                          <span className="rp-detail-mesa">Mesa {p.mesaNumero}</span>
                          <span className="rp-detail-fecha">{p.fecha}</span>
                          <span className="rp-detail-monto">{formatPrecio(p.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══════ PRODUCTOS ═══════ */}
          {seccion === "productos" && (
            <div className="rp-section">
              {stats.productosMasVendidos.length === 0 ? (
                <div className="rp-empty">
                  <p className="rp-empty-icon">🍽️</p>
                  <p>No hay productos vendidos aún</p>
                </div>
              ) : (
                <div className="rp-table-card">
                  <div className="rp-table-head rp-table-head--prod">
                    <span>Producto</span>
                    <span>Unidades</span>
                    <span>Ingresos</span>
                    <span>Demanda</span>
                  </div>
                  {stats.productosMasVendidos.map((p, idx) => (
                    <div key={p.nombre} className="rp-table-row rp-table-row--prod">
                      <div className="rp-table-prod-name">
                        <div className={`rp-rank rp-rank--${idx < 3 ? idx + 1 : "rest"}`}>{idx + 1}</div>
                        <span>{p.nombre}</span>
                      </div>
                      <span className="rp-table-center rp-table-qty">{p.cantidad}</span>
                      <span className="rp-table-money">{formatPrecio(p.ingresos)}</span>
                      <div className="rp-bar-cell">
                        <div className="rp-bar-wrap">
                          <div className={`rp-bar rp-bar--${idx === 0 ? "gold" : "green"}`} style={{ width: `${pct(p.cantidad, stats.maxProd)}%` }} />
                        </div>
                        <span className="rp-bar-pct">{pct(p.cantidad, stats.maxProd)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════ STOCK ═══════ */}
          {seccion === "stock" && (
            <div className="rp-section">
              {stats.stockCritico.length > 0 && (
                <div className="rp-inv-alert-banner">
                  <span className="rp-inv-alert-icon">⚠️</span>
                  <span><strong>{stats.stockCritico.length}</strong> producto{stats.stockCritico.length !== 1 ? "s" : ""} por debajo del stock mínimo</span>
                </div>
              )}

              <div className="rp-inv-grid">
                {productos.map((item) => {
                  const stock    = item.stock ?? null;
                  const minimo   = item.stockMinimo || 5;
                  const unidad   = item.unidad || "und";
                  const ratio    = stock != null ? stock / minimo : 1;
                  const status   = stock == null ? "ok" : stock <= 0 ? "critico" : ratio < 1 ? "bajo" : "ok";
                  const barWidth = stock != null ? pct(stock, minimo * 1.5) : 100;

                  return (
                    <div key={item.id} className={`rp-inv-card rp-inv-card--${status}`}>
                      <div className="rp-inv-card-head">
                        <span className="rp-inv-cat">{item.categoria}</span>
                        <span className={`rp-inv-badge rp-inv-badge--${status}`}>
                          {status === "critico" ? "🔴 Crítico" : status === "bajo" ? "🟡 Bajo" : "🟢 OK"}
                        </span>
                      </div>
                      <p className="rp-inv-name">{item.nombre}</p>
                      <div className="rp-inv-stocks">
                        <div className="rp-inv-stock-row">
                          <span className="rp-inv-stock-label">Stock actual</span>
                          <span className={`rp-inv-stock-val rp-inv-stock-val--${status}`}>
                            {stock != null ? `${stock} ${unidad}` : "Sin registro"}
                          </span>
                        </div>
                        <div className="rp-inv-stock-row">
                          <span className="rp-inv-stock-label">Mínimo requerido</span>
                          <span className="rp-inv-stock-val rp-inv-stock-val--muted">{minimo} {unidad}</span>
                        </div>
                      </div>
                      <div className="rp-inv-bar-wrap">
                        <div className={`rp-inv-bar rp-inv-bar--${status}`} style={{ width: `${barWidth}%` }} />
                      </div>
                      <div className="rp-inv-price">
                        <span className="rp-inv-stock-label">Precio</span>
                        <span className="rp-inv-price-val">{formatPrecio(item.precio)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════ MESAS ═══════ */}
          {seccion === "mesas" && (
            <div className="rp-section">
              {stats.mesas.length === 0 ? (
                <div className="rp-empty">
                  <p className="rp-empty-icon">🪑</p>
                  <p>No hay actividad en mesas aún</p>
                </div>
              ) : (
                <div className="rp-table-card">
                  <div className="rp-table-head rp-table-head--mesa">
                    <span>Mesa</span>
                    <span>Pedidos</span>
                    <span>Ingresos</span>
                    <span>Ticket prom.</span>
                    <span>Actividad</span>
                  </div>
                  {stats.mesas.map((m) => (
                    <div key={m.mesa} className="rp-table-row rp-table-row--mesa">
                      <div className="rp-table-mesa-cell">
                        <div className="rp-mesa-bubble">{m.mesa}</div>
                      </div>
                      <span className="rp-table-center">{m.pedidos}</span>
                      <span className="rp-table-money">{formatPrecio(m.total)}</span>
                      <span className="rp-table-money rp-muted">{formatPrecio(Math.round(m.total / m.pedidos))}</span>
                      <div className="rp-bar-cell">
                        <div className="rp-bar-wrap">
                          <div className="rp-bar rp-bar--gold" style={{ width: `${pct(m.pedidos, stats.mesas[0].pedidos)}%` }} />
                        </div>
                        <span className="rp-bar-pct">{pct(m.pedidos, stats.mesas[0].pedidos)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}