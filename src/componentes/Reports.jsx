import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Reports.css";

/* ─────────────────────────────────────────
   DATOS SIMULADOS
───────────────────────────────────────── */
const PEDIDOS_HISTORICOS = [
  { id: 1,  mesero: "Carlos Ruiz",    mesa: "02", fecha: "2025-01-20", total: 78000,  items: [{ nombre: "Costilla BBQ", cantidad: 1, precio: 45000 }, { nombre: "Limonada", cantidad: 2, precio: 15000 }] },
  { id: 2,  mesero: "Ana Torres",     mesa: "05", fecha: "2025-01-20", total: 52000,  items: [{ nombre: "Bandeja Paisa", cantidad: 1, precio: 38000 }, { nombre: "Jugo de Fresa", cantidad: 1, precio: 15000 }] },
  { id: 3,  mesero: "Carlos Ruiz",    mesa: "03", fecha: "2025-01-21", total: 96000,  items: [{ nombre: "Filete de Res", cantidad: 1, precio: 52000 }, { nombre: "Costilla BBQ", cantidad: 1, precio: 45000 }] },
  { id: 4,  mesero: "Luis Mora",      mesa: "07", fecha: "2025-01-21", total: 34000,  items: [{ nombre: "Dedos de Queso", cantidad: 1, precio: 34000 }] },
  { id: 5,  mesero: "Ana Torres",     mesa: "01", fecha: "2025-01-22", total: 68000,  items: [{ nombre: "Pasta Alfredo", cantidad: 1, precio: 28000 }, { nombre: "Tiramisú", cantidad: 1, precio: 16000 }, { nombre: "Café Americano", cantidad: 4, precio: 6000 }] },
  { id: 6,  mesero: "Carlos Ruiz",    mesa: "04", fecha: "2025-01-22", total: 113000, items: [{ nombre: "Costilla BBQ", cantidad: 2, precio: 45000 }, { nombre: "Limonada", cantidad: 1, precio: 15000 }] },
  { id: 7,  mesero: "Luis Mora",      mesa: "06", fecha: "2025-01-23", total: 45000,  items: [{ nombre: "Costilla BBQ", cantidad: 1, precio: 45000 }] },
  { id: 8,  mesero: "Ana Torres",     mesa: "08", fecha: "2025-01-23", total: 57000,  items: [{ nombre: "Alitas BBQ", cantidad: 1, precio: 22000 }, { nombre: "Bandeja Paisa", cantidad: 1, precio: 38000 }] },
  { id: 9,  mesero: "Carlos Ruiz",    mesa: "02", fecha: "2025-01-24", total: 84000,  items: [{ nombre: "Filete de Res", cantidad: 1, precio: 52000 }, { nombre: "Brownie c/Helado", cantidad: 2, precio: 14000 }] },
  { id: 10, mesero: "María Díaz",     mesa: "03", fecha: "2025-01-24", total: 44000,  items: [{ nombre: "Pasta Alfredo", cantidad: 1, precio: 28000 }, { nombre: "Tiramisú", cantidad: 1, precio: 16000 }] },
  { id: 11, mesero: "María Díaz",     mesa: "05", fecha: "2025-01-25", total: 91000,  items: [{ nombre: "Costilla BBQ", cantidad: 2, precio: 45000 }] },
  { id: 12, mesero: "Luis Mora",      mesa: "01", fecha: "2025-01-25", total: 38000,  items: [{ nombre: "Bandeja Paisa", cantidad: 1, precio: 38000 }] },
  { id: 13, mesero: "Ana Torres",     mesa: "04", fecha: "2025-01-26", total: 63000,  items: [{ nombre: "Alitas BBQ", cantidad: 1, precio: 22000 }, { nombre: "Dedos de Queso", cantidad: 1, precio: 34000 }] },
  { id: 14, mesero: "Carlos Ruiz",    mesa: "07", fecha: "2025-01-26", total: 52000,  items: [{ nombre: "Filete de Res", cantidad: 1, precio: 52000 }] },
  { id: 15, mesero: "María Díaz",     mesa: "06", fecha: "2025-01-27", total: 71000,  items: [{ nombre: "Costilla BBQ", cantidad: 1, precio: 45000 }, { nombre: "Brownie c/Helado", cantidad: 1, precio: 14000 }, { nombre: "Café Americano", cantidad: 2, precio: 6000 }] },
];

const INVENTARIO = [
  { id: 1, nombre: "Costilla de Res",    unidad: "kg",    stock: 3.5,  minimo: 5,   categoria: "Carnes" },
  { id: 2, nombre: "Filete de Res",      unidad: "kg",    stock: 2.0,  minimo: 4,   categoria: "Carnes" },
  { id: 3, nombre: "Pollo (Alitas)",     unidad: "kg",    stock: 6.0,  minimo: 5,   categoria: "Carnes" },
  { id: 4, nombre: "Fresa (Jugo)",       unidad: "kg",    stock: 1.2,  minimo: 3,   categoria: "Frutas" },
  { id: 5, nombre: "Limón",              unidad: "kg",    stock: 4.0,  minimo: 3,   categoria: "Frutas" },
  { id: 6, nombre: "Pasta",              unidad: "kg",    stock: 8.0,  minimo: 5,   categoria: "Secos" },
  { id: 7, nombre: "Queso Mozzarella",   unidad: "kg",    stock: 0.8,  minimo: 2,   categoria: "Lácteos" },
  { id: 8, nombre: "Crema de Leche",     unidad: "lt",   stock: 1.5,  minimo: 3,   categoria: "Lácteos" },
  { id: 9, nombre: "Café Molido",        unidad: "kg",    stock: 0.4,  minimo: 1,   categoria: "Bebidas" },
  { id: 10, nombre: "Agua Mineral (Cj)", unidad: "caja",  stock: 5,    minimo: 4,   categoria: "Bebidas" },
  { id: 11, nombre: "Harina",            unidad: "kg",    stock: 12.0, minimo: 5,   categoria: "Secos" },
  { id: 12, nombre: "Frijol",            unidad: "kg",    stock: 7.0,  minimo: 5,   categoria: "Secos" },
];

function formatPrecio(v) {
  return "$ " + v.toLocaleString("es-CO");
}

function pct(val, max) {
  return Math.min(100, Math.round((val / max) * 100));
}

const SECCIONES = [
  { id: "resumen",   label: "Resumen",          icon: "📊" },
  { id: "meseros",   label: "Meseros",           icon: "👨‍🍳" },
  { id: "productos", label: "Productos",         icon: "🍽️" },
  { id: "inventario",label: "Inventario",        icon: "📦" },
  { id: "mesas",     label: "Mesas",             icon: "🪑" },
];

/* ─────────────────────────────────────────
   COMPONENTE
───────────────────────────────────────── */
export default function Reports() {
  const navigate  = useNavigate();
  const [seccion, setSeccion] = useState("resumen");

  /* ── cálculos ── */
  const stats = useMemo(() => {
    const totalVentas    = PEDIDOS_HISTORICOS.reduce((a, p) => a + p.total, 0);
    const totalPedidos   = PEDIDOS_HISTORICOS.length;
    const ticketPromedio = Math.round(totalVentas / totalPedidos);

    /* ventas por mesero */
    const meseroMap = {};
    PEDIDOS_HISTORICOS.forEach((p) => {
      if (!meseroMap[p.mesero]) meseroMap[p.mesero] = { nombre: p.mesero, ventas: 0, pedidos: 0 };
      meseroMap[p.mesero].ventas  += p.total;
      meseroMap[p.mesero].pedidos += 1;
    });
    const meseros = Object.values(meseroMap).sort((a, b) => b.ventas - a.ventas);
    const maxMeseroVentas = meseros[0]?.ventas || 1;

    /* productos más vendidos */
    const prodMap = {};
    PEDIDOS_HISTORICOS.forEach((p) => {
      p.items.forEach((i) => {
        if (!prodMap[i.nombre]) prodMap[i.nombre] = { nombre: i.nombre, cantidad: 0, ingresos: 0 };
        prodMap[i.nombre].cantidad += i.cantidad;
        prodMap[i.nombre].ingresos += i.cantidad * i.precio;
      });
    });
    const productos = Object.values(prodMap).sort((a, b) => b.cantidad - a.cantidad);
    const maxProd = productos[0]?.cantidad || 1;

    /* ventas por mesa */
    const mesaMap = {};
    PEDIDOS_HISTORICOS.forEach((p) => {
      if (!mesaMap[p.mesa]) mesaMap[p.mesa] = { mesa: p.mesa, pedidos: 0, total: 0 };
      mesaMap[p.mesa].pedidos += 1;
      mesaMap[p.mesa].total   += p.total;
    });
    const mesas = Object.values(mesaMap).sort((a, b) => b.total - a.total);

    /* inventario crítico */
    const critico = INVENTARIO.filter((i) => i.stock < i.minimo)
      .sort((a, b) => (a.stock / a.minimo) - (b.stock / b.minimo));

    return { totalVentas, totalPedidos, ticketPromedio, meseros, maxMeseroVentas, productos, maxProd, mesas, critico };
  }, []);

  return (
    <div className="rp-layout">

      {/* ── SIDEBAR ── */}
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
              {s.id === "inventario" && stats.critico.length > 0 && (
                <span className="rp-nav-alert">{stats.critico.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="rp-sidebar-meta">
          <div className="rp-sidebar-meta-row">
            <span className="rp-sidebar-meta-label">Período</span>
            <span className="rp-sidebar-meta-val">Ene 2025</span>
          </div>
          <div className="rp-sidebar-meta-row">
            <span className="rp-sidebar-meta-label">Pedidos</span>
            <span className="rp-sidebar-meta-val">{stats.totalPedidos}</span>
          </div>
          <div className="rp-sidebar-meta-row">
            <span className="rp-sidebar-meta-label">Ingresos</span>
            <span className="rp-sidebar-meta-val rp-sidebar-meta-val--green">
              {formatPrecio(stats.totalVentas)}
            </span>
          </div>
        </div>

        <div className="rp-sidebar-footer">
          <button className="rp-back-btn" onClick={() => navigate("/panel-admin")}>
            ← Volver al panel
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="rp-main">
        <div className="rp-topbar">
          <div className="rp-topbar-left">
            <p className="rp-topbar-title">Reportes</p>
            <p className="rp-topbar-sub">
              {SECCIONES.find((s) => s.id === seccion)?.label} — Enero 2025
            </p>
          </div>
          {stats.critico.length > 0 && (
            <div
              className="rp-alert-pill"
              onClick={() => setSeccion("inventario")}
            >
              ⚠️ {stats.critico.length} ingrediente{stats.critico.length !== 1 ? "s" : ""} por agotarse
            </div>
          )}
        </div>

        <div className="rp-divider" />

        <div className="rp-content">

          {/* ════════ RESUMEN ════════ */}
          {seccion === "resumen" && (
            <div className="rp-section">
              <div className="rp-kpi-grid">
                <div className="rp-kpi rp-kpi--gold">
                  <p className="rp-kpi-label">Ingresos totales</p>
                  <p className="rp-kpi-value">{formatPrecio(stats.totalVentas)}</p>
                  <p className="rp-kpi-sub">Enero 2025</p>
                </div>
                <div className="rp-kpi rp-kpi--green">
                  <p className="rp-kpi-label">Total pedidos</p>
                  <p className="rp-kpi-value">{stats.totalPedidos}</p>
                  <p className="rp-kpi-sub">pedidos procesados</p>
                </div>
                <div className="rp-kpi rp-kpi--orange">
                  <p className="rp-kpi-label">Ticket promedio</p>
                  <p className="rp-kpi-value">{formatPrecio(stats.ticketPromedio)}</p>
                  <p className="rp-kpi-sub">por pedido</p>
                </div>
                <div className="rp-kpi rp-kpi--red">
                  <p className="rp-kpi-label">Stock crítico</p>
                  <p className="rp-kpi-value">{stats.critico.length}</p>
                  <p className="rp-kpi-sub">ingredientes por agotarse</p>
                </div>
              </div>

              <div className="rp-row-2">
                {/* top mesero */}
                <div className="rp-card">
                  <p className="rp-card-title">🏆 Top mesero del mes</p>
                  {stats.meseros[0] && (
                    <div className="rp-top-mesero">
                      <div className="rp-top-avatar">
                        {stats.meseros[0].nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="rp-top-name">{stats.meseros[0].nombre}</p>
                        <p className="rp-top-sub">
                          {stats.meseros[0].pedidos} pedidos · {formatPrecio(stats.meseros[0].ventas)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* producto estrella */}
                <div className="rp-card">
                  <p className="rp-card-title">⭐ Producto más vendido</p>
                  {stats.productos[0] && (
                    <div className="rp-top-prod">
                      <div className="rp-top-prod-icon">🍽️</div>
                      <div>
                        <p className="rp-top-name">{stats.productos[0].nombre}</p>
                        <p className="rp-top-sub">
                          {stats.productos[0].cantidad} unidades · {formatPrecio(stats.productos[0].ingresos)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* alertas inventario */}
              {stats.critico.length > 0 && (
                <div className="rp-card rp-card--alert">
                  <p className="rp-card-title">⚠️ Ingredientes por agotarse</p>
                  <div className="rp-alert-list">
                    {stats.critico.slice(0, 3).map((item) => (
                      <div key={item.id} className="rp-alert-row">
                        <span className="rp-alert-name">{item.nombre}</span>
                        <span className="rp-alert-stock">
                          {item.stock} {item.unidad} / mín. {item.minimo}
                        </span>
                        <div className="rp-alert-bar-wrap">
                          <div
                            className="rp-alert-bar"
                            style={{ width: `${pct(item.stock, item.minimo)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    {stats.critico.length > 3 && (
                      <button className="rp-ver-mas" onClick={() => setSeccion("inventario")}>
                        Ver {stats.critico.length - 3} más →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════ MESEROS ════════ */}
          {seccion === "meseros" && (
            <div className="rp-section">
              <div className="rp-table-card">
                <div className="rp-table-head">
                  <span>Mesero</span>
                  <span>Pedidos</span>
                  <span>Ingresos</span>
                  <span>Ticket prom.</span>
                  <span>Rendimiento</span>
                </div>
                {stats.meseros.map((m, idx) => (
                  <div key={m.nombre} className="rp-table-row">
                    <div className="rp-table-mesero">
                      <div className={`rp-rank rp-rank--${idx + 1}`}>{idx + 1}</div>
                      <div className="rp-table-avatar">
                        {m.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span>{m.nombre}</span>
                    </div>
                    <span className="rp-table-center">{m.pedidos}</span>
                    <span className="rp-table-money">{formatPrecio(m.ventas)}</span>
                    <span className="rp-table-money rp-muted">
                      {formatPrecio(Math.round(m.ventas / m.pedidos))}
                    </span>
                    <div className="rp-bar-cell">
                      <div className="rp-bar-wrap">
                        <div
                          className="rp-bar rp-bar--green"
                          style={{ width: `${pct(m.ventas, stats.maxMeseroVentas)}%` }}
                        />
                      </div>
                      <span className="rp-bar-pct">
                        {pct(m.ventas, stats.maxMeseroVentas)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* detalle por mesero */}
              <p className="rp-sub-section-label">Pedidos por mesero</p>
              <div className="rp-mesero-cards">
                {stats.meseros.map((m) => {
                  const pedidosMesero = PEDIDOS_HISTORICOS.filter((p) => p.mesero === m.nombre);
                  return (
                    <div key={m.nombre} className="rp-mesero-detail-card">
                      <div className="rp-mesero-detail-head">
                        <div className="rp-detail-avatar">
                          {m.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="rp-detail-name">{m.nombre}</p>
                          <p className="rp-detail-sub">{m.pedidos} pedidos</p>
                        </div>
                        <span className="rp-detail-total">{formatPrecio(m.ventas)}</span>
                      </div>
                      <div className="rp-detail-list">
                        {pedidosMesero.map((p) => (
                          <div key={p.id} className="rp-detail-row">
                            <span className="rp-detail-fecha">{p.fecha}</span>
                            <span className="rp-detail-mesa">Mesa {p.mesa}</span>
                            <span className="rp-detail-monto">{formatPrecio(p.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════ PRODUCTOS ════════ */}
          {seccion === "productos" && (
            <div className="rp-section">
              <div className="rp-table-card">
                <div className="rp-table-head rp-table-head--prod">
                  <span>Producto</span>
                  <span>Unidades</span>
                  <span>Ingresos</span>
                  <span>Demanda</span>
                </div>
                {stats.productos.map((p, idx) => (
                  <div key={p.nombre} className="rp-table-row">
                    <div className="rp-table-prod-name">
                      <div className={`rp-rank rp-rank--${idx < 3 ? idx + 1 : "rest"}`}>
                        {idx + 1}
                      </div>
                      <span>{p.nombre}</span>
                    </div>
                    <span className="rp-table-center rp-table-qty">{p.cantidad}</span>
                    <span className="rp-table-money">{formatPrecio(p.ingresos)}</span>
                    <div className="rp-bar-cell">
                      <div className="rp-bar-wrap">
                        <div
                          className={`rp-bar rp-bar--${idx === 0 ? "gold" : "green"}`}
                          style={{ width: `${pct(p.cantidad, stats.maxProd)}%` }}
                        />
                      </div>
                      <span className="rp-bar-pct">{pct(p.cantidad, stats.maxProd)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════════ INVENTARIO ════════ */}
          {seccion === "inventario" && (
            <div className="rp-section">
              {stats.critico.length > 0 && (
                <div className="rp-inv-alert-banner">
                  <span className="rp-inv-alert-icon">⚠️</span>
                  <span>
                    <strong>{stats.critico.length}</strong> ingrediente
                    {stats.critico.length !== 1 ? "s" : ""} por debajo del stock mínimo
                  </span>
                </div>
              )}

              <div className="rp-inv-grid">
                {INVENTARIO.map((item) => {
                  const ratio     = item.stock / item.minimo;
                  const status    = ratio < 0.5 ? "critico" : ratio < 1 ? "bajo" : "ok";
                  const barWidth  = pct(item.stock, item.minimo * 1.5);
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
                            {item.stock} {item.unidad}
                          </span>
                        </div>
                        <div className="rp-inv-stock-row">
                          <span className="rp-inv-stock-label">Mínimo requerido</span>
                          <span className="rp-inv-stock-val rp-inv-stock-val--muted">
                            {item.minimo} {item.unidad}
                          </span>
                        </div>
                      </div>
                      <div className="rp-inv-bar-wrap">
                        <div
                          className={`rp-inv-bar rp-inv-bar--${status}`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════ MESAS ════════ */}
          {seccion === "mesas" && (
            <div className="rp-section">
              <div className="rp-table-card">
                <div className="rp-table-head rp-table-head--mesa">
                  <span>Mesa</span>
                  <span>Pedidos</span>
                  <span>Ingresos</span>
                  <span>Ticket prom.</span>
                  <span>Actividad</span>
                </div>
                {stats.mesas.map((m, idx) => (
                  <div key={m.mesa} className="rp-table-row">
                    <div className="rp-table-mesa-cell">
                      <div className="rp-mesa-bubble">{m.mesa}</div>
                    </div>
                    <span className="rp-table-center">{m.pedidos}</span>
                    <span className="rp-table-money">{formatPrecio(m.total)}</span>
                    <span className="rp-table-money rp-muted">
                      {formatPrecio(Math.round(m.total / m.pedidos))}
                    </span>
                    <div className="rp-bar-cell">
                      <div className="rp-bar-wrap">
                        <div
                          className="rp-bar rp-bar--gold"
                          style={{ width: `${pct(m.pedidos, stats.mesas[0].pedidos)}%` }}
                        />
                      </div>
                      <span className="rp-bar-pct">
                        {pct(m.pedidos, stats.mesas[0].pedidos)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}