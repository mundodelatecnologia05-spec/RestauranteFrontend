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
  { id: "resumen",   label: "Resumen",    icon: "📊" },
  { id: "productos", label: "Productos",  icon: "🍽️" },
  { id: "mesas",     label: "Mesas",      icon: "🪑" },
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

export default function Reports() {
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState("resumen");

  const pedidos = useMemo(() => cargarTodosLosPedidos(), []);

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
    const productos = Object.values(prodMap).sort((a, b) => b.cantidad - a.cantidad);
    const maxProd = productos[0]?.cantidad || 1;

    const mesaMap = {};
    pedidos.forEach((p) => {
      const key = p.mesaNumero || p.mesaId;
      if (!mesaMap[key]) mesaMap[key] = { mesa: p.mesaNumero || String(p.mesaId), pedidos: 0, total: 0 };
      mesaMap[key].pedidos += 1;
      mesaMap[key].total   += p.total;
    });
    const mesas = Object.values(mesaMap).sort((a, b) => b.total - a.total);

    return { totalVentas, totalPedidos, ticketPromedio, productos, maxProd, mesas };
  }, [pedidos]);

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

      <main className="rp-main">
        <div className="rp-topbar">
          <div className="rp-topbar-left">
            <p className="rp-topbar-title">Reportes</p>
            <p className="rp-topbar-sub">
              {SECCIONES.find((s) => s.id === seccion)?.label}
            </p>
          </div>
        </div>

        <div className="rp-divider" />

        <div className="rp-content">

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
                    {stats.productos[0] && (
                      <div className="rp-card">
                        <p className="rp-card-title">⭐ Producto más vendido</p>
                        <div className="rp-top-prod">
                          <div className="rp-top-prod-icon">🍽️</div>
                          <div>
                            <p className="rp-top-name">{stats.productos[0].nombre}</p>
                            <p className="rp-top-sub">
                              {stats.productos[0].cantidad} unidades · {formatPrecio(stats.productos[0].ingresos)}
                            </p>
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
                            <p className="rp-top-sub">
                              {stats.mesas[0].pedidos} pedido{stats.mesas[0].pedidos !== 1 ? "s" : ""} · {formatPrecio(stats.mesas[0].total)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rp-card" style={{ marginTop: "1.5rem" }}>
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

          {seccion === "productos" && (
            <div className="rp-section">
              {stats.productos.length === 0 ? (
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
                  {stats.productos.map((p, idx) => (
                    <div key={p.nombre} className="rp-table-row rp-table-row--prod">
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
              )}
            </div>
          )}

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
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}