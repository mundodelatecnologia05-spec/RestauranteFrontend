import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Tables.css";
import prueba from "../assets/prueba.jpg";

const MESAS_INICIALES = [
  { id: 1, numero: "01", estado: "disponible" },
  { id: 2, numero: "02", estado: "disponible" },
  { id: 3, numero: "03", estado: "disponible" },
  { id: 4, numero: "04", estado: "disponible" },
  { id: 5, numero: "05", estado: "disponible" },
  { id: 6, numero: "06", estado: "disponible" },
  { id: 7, numero: "07", estado: "disponible" },
  { id: 8, numero: "08", estado: "inhabilitada" },
];

const ESTADO_CONFIG = {
  disponible: {
    label: "Disponible",
    badge: "ms-status-badge--active",
    accent: "ms-card-accent--active",
    icon: "🪑",
  },
  consumo: {
    label: "Con consumo",
    badge: "ms-status-badge--busy",
    accent: "ms-card-accent--busy",
    icon: "🧾",
  },
  inhabilitada: {
    label: "Inhabilitada",
    badge: "ms-status-badge--off",
    accent: "ms-card-accent--off",
    icon: "🚫",
  },
};

function formatPrecio(v) {
  return "$ " + v.toLocaleString("es-CO");
}

/* ── Modal Historial ── */
function HistorialModal({ onClose }) {
  const [facturas, setFacturas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("historial_facturas")) || [];
    setFacturas(data.sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  const handleReimprimir = () => {
    const contenido = printRef.current.innerHTML;
    const ventana = window.open("", "_blank", "width=800,height=600");
    ventana.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Factura ${seleccionada.numeroFactura}</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #1C1410; padding: 32px 28px; max-width: 380px; margin: auto; background: #fff; }
            .fac-brand { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; text-align: center; letter-spacing: 3px; text-transform: uppercase; color: #1C1410; margin-bottom: 2px; }
            .fac-brand-sub { font-size: 9px; color: #C9A87C; letter-spacing: 5px; text-transform: uppercase; text-align: center; margin-bottom: 4px; }
            .fac-gold-line { width: 50px; height: 1.5px; background: #C9A87C; margin: 6px auto 14px; }
            .fac-numero { text-align: center; font-size: 11px; font-weight: 600; color: #8A7060; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px; }
            .fac-dashed { border: none; border-top: 1px dashed #C9A87C; margin: 12px 0; }
            .fac-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 10px; font-size: 11px; margin-bottom: 4px; }
            .fac-info-grid .lbl { color: #8A7060; font-weight: 500; }
            .fac-info-grid .val { color: #1C1410; font-weight: 600; }
            .fac-table-head { display: grid; grid-template-columns: 1fr auto auto auto; gap: 6px; font-size: 10px; font-weight: 600; color: #8A7060; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #EDE8E0; padding-bottom: 5px; margin-bottom: 4px; }
            .fac-item { display: grid; grid-template-columns: 1fr auto auto auto; gap: 6px; font-size: 12px; padding: 4px 0; border-bottom: 1px solid #F5EFE8; color: #1C1410; }
            .r { text-align: right; }
            .fac-totales { margin-top: 6px; }
            .fac-fila { display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; color: #8A7060; }
            .fac-fila.propina { color: #3aaf6a; font-weight: 600; }
            .fac-fila.total { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: #1C1410; border-top: 1.5px solid #C9A87C; padding-top: 8px; margin-top: 4px; }
            .fac-footer { text-align: center; font-size: 11px; color: #8A7060; margin-top: 16px; letter-spacing: 0.5px; }
          </style>
        </head>
        <body>
          ${contenido}
          <script>window.onload = function(){ window.print(); window.onafterprint = function(){ window.close(); }; }<\/script>
        </body>
      </html>
    `);
    ventana.document.close();
  };

  return (
    <div className="modal-overlay">
      <div className="modal fac-modal-wrapper" style={{ width: "720px", maxWidth: "95vw" }}>
        <div className="modal-icon">📋</div>
        <h2>Historial de Facturas</h2>

        {facturas.length === 0 ? (
          <p className="modal-desc">No hay facturas registradas aún.</p>
        ) : !seleccionada ? (
          <div style={{ width: "100%", maxHeight: "60vh", overflowY: "auto" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr 1fr 1fr auto",
              gap: "0.5rem",
              padding: "0.4rem 0.6rem",
              background: "rgba(0,0,0,0.06)",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "0.4rem",
            }}>
              <span>Factura</span>
              <span>Mesa</span>
              <span>Fecha</span>
              <span style={{ textAlign: "right" }}>Total</span>
              <span></span>
            </div>
            {facturas.map((f, idx) => (
              <div key={idx} style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr 1fr 1fr auto",
                gap: "0.5rem",
                padding: "0.5rem 0.6rem",
                borderBottom: "1px solid rgba(0,0,0,0.07)",
                fontSize: "0.85rem",
                alignItems: "center",
              }}>
                <span style={{ fontWeight: 600, color: "#8A7060", fontSize: "0.75rem" }}>{f.numeroFactura}</span>
                <span>Mesa {f.mesaNumero}</span>
                <span style={{ color: "#8A7060" }}>{f.fecha} {f.hora}</span>
                <span style={{ textAlign: "right", fontWeight: 700 }}>{formatPrecio(f.total)}</span>
                <button
                  className="ms-btn ms-btn--consumo"
                  style={{ padding: "6px 12px", fontSize: "11px", whiteSpace: "nowrap" }}
                  onClick={() => setSeleccionada(f)}
                >
                  Ver
                </button>
              </div>
            ))}
          </div>
        ) : (
          <>
            <button
              onClick={() => setSeleccionada(null)}
              style={{
                background: "none",
                border: "none",
                color: "#8A7060",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "12px",
                padding: 0,
              }}
            >
              ← Volver al listado
            </button>

            <div ref={printRef} style={{ width: "100%", textAlign: "left" }}>
              <div className="fac-brand">La Mesa Dorada</div>
              <div className="fac-brand-sub">Haute Cuisine</div>
              <div className="fac-gold-line" />
              <div className="fac-numero">Factura {seleccionada.numeroFactura}</div>
              <div className="fac-dashed" />
              <div className="fac-info-grid">
                <span className="lbl">Mesa</span>
                <span className="val">{seleccionada.mesaNumero}</span>
                <span className="lbl">Fecha</span>
                <span className="val">{seleccionada.fecha}</span>
                <span className="lbl">Hora</span>
                <span className="val">{seleccionada.hora}</span>
                <span className="lbl">Pago</span>
                <span className="val">{seleccionada.metodoPago}</span>
                {seleccionada.clienteNombre && (
                  <>
                    <span className="lbl">Cliente</span>
                    <span className="val">{seleccionada.clienteNombre}</span>
                  </>
                )}
                {seleccionada.clienteNit && (
                  <>
                    <span className="lbl">NIT/CC</span>
                    <span className="val">{seleccionada.clienteNit}</span>
                  </>
                )}
              </div>
              <div className="fac-dashed" />
              <div className="fac-table-head">
                <span>Producto</span>
                <span className="r">Cant.</span>
                <span className="r">Precio</span>
                <span className="r">Subtotal</span>
              </div>
              {seleccionada.items.map((item, idx) => (
                <div className="fac-item" key={idx}>
                  <span>{item.nombre}</span>
                  <span className="r">{item.cantidad}</span>
                  <span className="r">{formatPrecio(item.precio)}</span>
                  <span className="r">{formatPrecio(item.precio * item.cantidad)}</span>
                </div>
              ))}
              <div className="fac-dashed" />
              <div className="fac-totales">
                <div className="fac-fila">
                  <span>Subtotal</span>
                  <span>{formatPrecio(seleccionada.subtotal)}</span>
                </div>
                <div className="fac-fila">
                  <span>IVA (19%)</span>
                  <span>{formatPrecio(seleccionada.iva)}</span>
                </div>
                {seleccionada.propinaValor > 0 && (
                  <div className="fac-fila propina">
                    <span>Propina</span>
                    <span>{formatPrecio(seleccionada.propinaValor)}</span>
                  </div>
                )}
                <div className="fac-fila total">
                  <span>Total</span>
                  <span>{formatPrecio(seleccionada.total)}</span>
                </div>
              </div>
              <div className="fac-footer">¡Gracias por su visita!</div>
            </div>
          </>
        )}

        <div className="modal-buttons" style={{ marginTop: "20px" }}>
          <button className="btn-no" onClick={onClose}>Cerrar</button>
          {seleccionada && (
            <button className="btn-imprimir" onClick={handleReimprimir}>
              🖨️ Reimprimir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Modal Factura ── */
function FacturaModal({ mesa, consumo, onClose, onFacturar }) {
  const printRef = useRef();
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteNit, setClienteNit] = useState("");
  const [propinaPct, setPropinaPct] = useState(0);
  const [propinaCustom, setPropinaCustom] = useState("");

  const subtotal = consumo?.total ?? 0;
  const propinaValor =
    propinaCustom !== ""
      ? Math.round(parseFloat(propinaCustom.replace(/\./g, "").replace(",", ".")) || 0)
      : Math.round(subtotal * (propinaPct / 100));
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva + propinaValor;

  const numeroFactura = `FAC-${String(mesa.id).padStart(3, "0")}-${Date.now().toString().slice(-4)}`;
  const fecha = new Date().toLocaleDateString("es-CO");
  const hora = new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  const guardarEnHistorial = () => {
    const historial = JSON.parse(localStorage.getItem("historial_facturas")) || [];
    historial.push({
      numeroFactura,
      mesaId: mesa.id,
      mesaNumero: mesa.numero,
      fecha,
      hora,
      metodoPago,
      clienteNombre,
      clienteNit,
      items: consumo.items,
      subtotal,
      iva,
      propinaValor,
      total,
      timestamp: Date.now(),
    });
    localStorage.setItem("historial_facturas", JSON.stringify(historial));
  };

  const handlePrint = () => {
    const contenido = printRef.current.innerHTML;
    const ventana = window.open("", "_blank", "width=800,height=600");
    ventana.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Factura ${numeroFactura}</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #1C1410; padding: 32px 28px; max-width: 380px; margin: auto; background: #fff; }
            .fac-brand { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; text-align: center; letter-spacing: 3px; text-transform: uppercase; color: #1C1410; margin-bottom: 2px; }
            .fac-brand-sub { font-size: 9px; color: #C9A87C; letter-spacing: 5px; text-transform: uppercase; text-align: center; margin-bottom: 4px; }
            .fac-gold-line { width: 50px; height: 1.5px; background: #C9A87C; margin: 6px auto 14px; }
            .fac-numero { text-align: center; font-size: 11px; font-weight: 600; color: #8A7060; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px; }
            .fac-dashed { border: none; border-top: 1px dashed #C9A87C; margin: 12px 0; }
            .fac-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 10px; font-size: 11px; margin-bottom: 4px; }
            .fac-info-grid .lbl { color: #8A7060; font-weight: 500; }
            .fac-info-grid .val { color: #1C1410; font-weight: 600; }
            .fac-table-head { display: grid; grid-template-columns: 1fr auto auto auto; gap: 6px; font-size: 10px; font-weight: 600; color: #8A7060; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #EDE8E0; padding-bottom: 5px; margin-bottom: 4px; }
            .fac-item { display: grid; grid-template-columns: 1fr auto auto auto; gap: 6px; font-size: 12px; padding: 4px 0; border-bottom: 1px solid #F5EFE8; color: #1C1410; }
            .r { text-align: right; }
            .fac-totales { margin-top: 6px; }
            .fac-fila { display: flex; justify-content: space-between; font-size: 12px; padding: 3px 0; color: #8A7060; }
            .fac-fila.propina { color: #3aaf6a; font-weight: 600; }
            .fac-fila.total { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: #1C1410; border-top: 1.5px solid #C9A87C; padding-top: 8px; margin-top: 4px; }
            .fac-footer { text-align: center; font-size: 11px; color: #8A7060; margin-top: 16px; letter-spacing: 0.5px; }
          </style>
        </head>
        <body>
          ${contenido}
          <script>window.onload = function(){ window.print(); window.onafterprint = function(){ window.close(); }; }<\/script>
        </body>
      </html>
    `);
    ventana.document.close();
    guardarEnHistorial();
    onFacturar(mesa.id);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal fac-modal-wrapper">
        <div className="modal-icon">🧾</div>
        <h2>Factura — Mesa {mesa.numero}</h2>

        {!consumo ? (
          <p className="modal-desc">No hay registro de pedido para esta mesa.</p>
        ) : (
          <>
            <div className="fac-form">
              <div className="fac-form-row">
                <div className="fac-form-group">
                  <label>Nombre cliente</label>
                  <input
                    type="text"
                    placeholder="Opcional"
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                  />
                </div>
                <div className="fac-form-group">
                  <label>NIT / Cédula</label>
                  <input
                    type="text"
                    placeholder="Opcional"
                    value={clienteNit}
                    onChange={(e) => setClienteNit(e.target.value)}
                  />
                </div>
              </div>
              <div className="fac-form-row">
                <div className="fac-form-group">
                  <label>Método de pago</label>
                  <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                    <option>Efectivo</option>
                    <option>Tarjeta débito</option>
                    <option>Tarjeta crédito</option>
                    <option>Transferencia</option>
                  </select>
                </div>
                <div className="fac-form-group">
                  <label>Propina (opcional)</label>
                  <div className="fac-propina-row">
                    {[0, 5, 10, 15].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        className={`fac-propina-btn${propinaPct === pct && propinaCustom === "" ? " fac-propina-btn--active" : ""}`}
                        onClick={() => { setPropinaPct(pct); setPropinaCustom(""); }}
                      >
                        {pct === 0 ? "Sin propina" : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {propinaPct > 0 && propinaCustom === "" && (
                <div className="fac-propina-preview">
                  💰 Propina ({propinaPct}%): <strong>{formatPrecio(propinaValor)}</strong>
                </div>
              )}

              <div className="fac-form-group" style={{ marginTop: "10px" }}>
                <label>O ingresa un monto personalizado</label>
                <input
                  type="text"
                  placeholder="Ej: 5.000"
                  value={propinaCustom}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\./g, "").replace(/\D/g, "");
                    const formatted = raw ? parseInt(raw).toLocaleString("es-CO") : "";
                    setPropinaCustom(formatted);
                    setPropinaPct(0);
                  }}
                />
              </div>
            </div>

            <div className="fac-divider-gold" />

            <div ref={printRef} style={{ width: "100%", textAlign: "left" }}>
              <div className="fac-brand">La Mesa Dorada</div>
              <div className="fac-brand-sub">Haute Cuisine</div>
              <div className="fac-gold-line" />
              <div className="fac-numero">Factura {numeroFactura}</div>
              <div className="fac-dashed" />
              <div className="fac-info-grid">
                <span className="lbl">Mesa</span>
                <span className="val">{mesa.numero}</span>
                <span className="lbl">Fecha</span>
                <span className="val">{fecha}</span>
                <span className="lbl">Hora</span>
                <span className="val">{hora}</span>
                <span className="lbl">Pago</span>
                <span className="val">{metodoPago}</span>
                {clienteNombre && (<><span className="lbl">Cliente</span><span className="val">{clienteNombre}</span></>)}
                {clienteNit && (<><span className="lbl">NIT/CC</span><span className="val">{clienteNit}</span></>)}
              </div>
              <div className="fac-dashed" />
              <div className="fac-table-head">
                <span>Producto</span>
                <span className="r">Cant.</span>
                <span className="r">Precio</span>
                <span className="r">Subtotal</span>
              </div>
              {consumo.items.map((item, idx) => (
                <div className="fac-item" key={idx}>
                  <span>{item.nombre}</span>
                  <span className="r">{item.cantidad}</span>
                  <span className="r">{formatPrecio(item.precio)}</span>
                  <span className="r">{formatPrecio(item.precio * item.cantidad)}</span>
                </div>
              ))}
              <div className="fac-dashed" />
              <div className="fac-totales">
                <div className="fac-fila"><span>Subtotal</span><span>{formatPrecio(subtotal)}</span></div>
                <div className="fac-fila"><span>IVA (19%)</span><span>{formatPrecio(iva)}</span></div>
                {propinaValor > 0 && (
                  <div className="fac-fila propina">
                    <span>Propina{propinaCustom === "" && propinaPct > 0 ? ` (${propinaPct}%)` : " (voluntaria)"}</span>
                    <span>{formatPrecio(propinaValor)}</span>
                  </div>
                )}
                <div className="fac-fila total"><span>Total</span><span>{formatPrecio(total)}</span></div>
              </div>
              <div className="fac-footer">¡Gracias por su visita!</div>
            </div>
          </>
        )}

        <div className="modal-buttons" style={{ marginTop: "20px" }}>
          <button className="btn-no" onClick={onClose}>Cancelar</button>
          {consumo && (
            <button className="btn-imprimir" onClick={handlePrint}>🖨️ Imprimir</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Componente principal ── */
export default function MesaList() {
  const navigate = useNavigate();

  const [mesas, setMesas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mesaAEliminar, setMesaAEliminar] = useState(null);
  const [consumoModal, setConsumoModal] = useState(null);
  const [facturaModal, setFacturaModal] = useState(null);
  const [historialModal, setHistorialModal] = useState(false);

  useEffect(() => {
    const mesasAdmin = JSON.parse(localStorage.getItem("mesas")) || [];

    const mesasBase = MESAS_INICIALES.map((m) => {
      const overrideAdmin = mesasAdmin.find((a) => a.id === m.id);
      const estadoBase = overrideAdmin ? overrideAdmin.estado.toLowerCase() : m.estado;
      const pedidoGuardado = localStorage.getItem(`pedido_mesa_${m.id}`);
      if (pedidoGuardado && estadoBase !== "inhabilitada") return { ...m, estado: "consumo" };
      return { ...m, estado: estadoBase };
    });

    const mesasExtra = mesasAdmin
      .filter((m) => m.id > 8)
      .map((m) => {
        const estado = m.estado.toLowerCase();
        const pedidoGuardado = localStorage.getItem(`pedido_mesa_${m.id}`);
        if (pedidoGuardado && estado !== "inhabilitada") return { ...m, estado: "consumo" };
        return { ...m, estado };
      });

    setMesas([...mesasBase, ...mesasExtra]);
  }, []);

  const actualizarLocalStorage = (nuevasMesas) => {
    localStorage.setItem("mesas", JSON.stringify(nuevasMesas));
  };

  const toggleHabilitar = (id) => {
    const nuevasMesas = mesas.map((m) =>
      m.id === id
        ? { ...m, estado: m.estado === "inhabilitada" ? "disponible" : "inhabilitada" }
        : m
    );
    setMesas(nuevasMesas);
    actualizarLocalStorage(nuevasMesas);
  };

  const abrirModalEliminar = (id) => {
    setMesaAEliminar(id);
    setMostrarModal(true);
  };

  const confirmarEliminar = () => {
    const nuevasMesas = mesas.filter((m) => m.id !== mesaAEliminar);
    setMesas(nuevasMesas);
    actualizarLocalStorage(nuevasMesas);
    setMostrarModal(false);
    setMesaAEliminar(null);
  };

  const verConsumo = (mesa) => {
    const consumo = JSON.parse(localStorage.getItem(`pedido_mesa_${mesa.id}`));
    setConsumoModal({ mesa, consumo });
  };

  const verFactura = (mesa) => {
    const consumo = JSON.parse(localStorage.getItem(`pedido_mesa_${mesa.id}`));
    setFacturaModal({ mesa, consumo });
  };

  const liberarMesa = (id) => {
    localStorage.removeItem(`pedido_mesa_${id}`);
    const nuevasMesas = mesas.map((m) =>
      m.id === id ? { ...m, estado: "disponible" } : m
    );
    setMesas(nuevasMesas);
    actualizarLocalStorage(nuevasMesas);
  };

  const total = mesas.length;
  const disponibles = mesas.filter((m) => m.estado === "disponible").length;
  const conConsumo = mesas.filter((m) => m.estado === "consumo").length;
  const inhabilitadas = mesas.filter((m) => m.estado === "inhabilitada").length;

  return (
    <>
      <div className="ms-layout">
        <aside className="ms-sidebar">
          <div className="ms-sidebar-hero">
            <img src={prueba} alt="Restaurante" className="ms-sidebar-hero-img" />
            <div className="ms-sidebar-hero-overlay">
              <p className="ms-brand">La Mesa Dorada</p>
              <p className="ms-brand-sub">Haute Cuisine</p>
              <div className="ms-gold-line" />
            </div>
          </div>

          <div className="ms-sidebar-stats">
            <div className="ms-stat ms-stat--total">
              <div className="ms-stat-info">
                <span className="ms-stat-label">Total mesas</span>
                <span className="ms-stat-value">{total}</span>
              </div>
              <div className="ms-stat-icon">🪑</div>
            </div>
            <div className="ms-stat ms-stat--active">
              <div className="ms-stat-info">
                <span className="ms-stat-label">Disponibles</span>
                <span className="ms-stat-value">{disponibles}</span>
              </div>
              <div className="ms-stat-icon">✅</div>
            </div>
            <div className="ms-stat ms-stat--busy">
              <div className="ms-stat-info">
                <span className="ms-stat-label">Con consumo</span>
                <span className="ms-stat-value">{conConsumo}</span>
              </div>
              <div className="ms-stat-icon">🧾</div>
            </div>
            <div className="ms-stat ms-stat--off">
              <div className="ms-stat-info">
                <span className="ms-stat-label">Inhabilitadas</span>
                <span className="ms-stat-value">{inhabilitadas}</span>
              </div>
              <div className="ms-stat-icon">⏸️</div>
            </div>
          </div>

          <div className="ms-sidebar-footer">
            <button
              className="ms-back-btn"
              style={{ marginBottom: "8px", background: "#C9A87C", borderColor: "#e8c99a" }}
              onClick={() => setHistorialModal(true)}
            >
              📋 Ver historial
            </button>
            <button className="ms-back-btn" onClick={() => navigate("/panel-admin")}>
              ← Volver al panel
            </button>
          </div>
        </aside>

        <main className="ms-main">
          <div className="ms-topbar">
            <div className="ms-topbar-left">
              <h1 className="ms-topbar-title">Gestión de Mesas</h1>
              <p className="ms-topbar-sub">Administrar número y asignación de mesas</p>
            </div>
            <div className="ms-topbar-right">
              <span className="ms-pill ms-pill--active">{disponibles} disponibles</span>
              <span className="ms-pill ms-pill--busy">{conConsumo} activas</span>
              <button className="ms-add-btn" onClick={() => navigate("/add-tables")}>
                + Añadir mesa
              </button>
            </div>
          </div>

          <div className="ms-divider" />

          <div className="ms-content">
            <p className="ms-section-label">Todas las mesas</p>

            {mesas.length === 0 ? (
              <p className="ms-empty">No hay mesas registradas</p>
            ) : (
              <div className="ms-grid">
                {mesas.map((m) => {
                  const cfg = ESTADO_CONFIG[m.estado] || ESTADO_CONFIG["disponible"];
                  return (
                    <div
                      key={m.id}
                      className={`ms-card${m.estado === "inhabilitada" ? " ms-card--off" : ""}`}
                    >
                      <div className={`ms-card-accent ${cfg.accent}`} />
                      <div className="ms-card-top">
                        <div>
                          <div className="ms-card-num">{m.numero}</div>
                          <div className="ms-card-num-label">Mesa</div>
                        </div>
                        <span className={`ms-status-badge ${cfg.badge}`}>{cfg.label}</span>
                      </div>
                      <div className="ms-card-icon">{cfg.icon}</div>
                      <div className="ms-card-actions">
                        <button className="ms-btn ms-btn--editar" onClick={() => navigate(`/edit-tables?id=${m.id}`)}>
                          Editar
                        </button>
                        <button className="ms-btn ms-btn--cancel" onClick={() => abrirModalEliminar(m.id)}>
                          Eliminar
                        </button>

                        {m.estado === "consumo" && (
                          <>
                            <button className="ms-btn ms-btn--consumo" onClick={() => verConsumo(m)}>
                              Ver consumo
                            </button>
                            <button className="ms-btn ms-btn--factura" onClick={() => verFactura(m)}>
                              Facturar
                            </button>
                          </>
                        )}

                        {m.estado === "disponible" && (
                          <button className="ms-btn ms-btn--inhabilitar" onClick={() => toggleHabilitar(m.id)}>
                            Inhabilitar
                          </button>
                        )}

                        {m.estado === "inhabilitada" && (
                          <button className="ms-btn ms-btn--habilitar" onClick={() => toggleHabilitar(m.id)}>
                            Habilitar
                          </button>
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

      {/* ── MODAL ELIMINAR ── */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">⚠️</div>
            <h2>¿Eliminar mesa?</h2>
            <p className="modal-desc">Esta acción no puede deshacerse.</p>
            <div className="modal-buttons">
              <button className="btn-si" onClick={confirmarEliminar}>Sí, eliminar</button>
              <button className="btn-no" onClick={() => setMostrarModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONSUMO ── */}
      {consumoModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "520px", width: "90%" }}>
            <div className="modal-icon">🧾</div>
            <h2>Consumo — Mesa {consumoModal.mesa.numero}</h2>
            {!consumoModal.consumo ? (
              <p className="modal-desc">No hay registro de pedido para esta mesa.</p>
            ) : (
              <>
                <p className="modal-desc" style={{ marginBottom: "0.5rem" }}>{consumoModal.consumo.fecha}</p>
                <div style={{ width: "100%", marginBottom: "1rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "0.5rem", padding: "0.4rem 0.6rem", background: "rgba(0,0,0,0.06)", borderRadius: "6px", fontWeight: 600, fontSize: "0.78rem", textAlign: "right", marginBottom: "0.3rem" }}>
                    <span style={{ textAlign: "left" }}>Producto</span>
                    <span>Cant.</span><span>Precio</span><span>Subtotal</span>
                  </div>
                  {consumoModal.consumo.items.map((item, idx) => (
                    <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "0.5rem", padding: "0.4rem 0.6rem", borderBottom: "1px solid rgba(0,0,0,0.07)", fontSize: "0.85rem", textAlign: "right" }}>
                      <span style={{ textAlign: "left" }}>{item.nombre}</span>
                      <span>{item.cantidad}</span>
                      <span>{formatPrecio(item.precio)}</span>
                      <span style={{ fontWeight: 600 }}>{formatPrecio(item.precio * item.cantidad)}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.6rem 0", fontWeight: 700, fontSize: "1rem" }}>
                    <span>Total</span>
                    <span>{formatPrecio(consumoModal.consumo.total)}</span>
                  </div>
                </div>
              </>
            )}
            <div className="modal-buttons">
              <button className="btn-no" onClick={() => setConsumoModal(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL FACTURA ── */}
      {facturaModal && (
        <FacturaModal
          mesa={facturaModal.mesa}
          consumo={facturaModal.consumo}
          onClose={() => setFacturaModal(null)}
          onFacturar={liberarMesa}
        />
      )}

      {/* ── MODAL HISTORIAL ── */}
      {historialModal && (
        <HistorialModal onClose={() => setHistorialModal(false)} />
      )}
    </>
  );
}