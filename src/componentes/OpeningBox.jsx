import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OpeningBox.css";

export default function CajaApertura() {
  const navigate = useNavigate();
  const [montoInicial, setMontoInicial] = useState("60.000");
  const [nota, setNota] = useState("");
  const [confirmandoCierre, setConfirmandoCierre] = useState(false);
  const [montoCierre, setMontoCierre] = useState("");
  const [notaCierre, setNotaCierre] = useState("");

  const cajaAbierta = JSON.parse(localStorage.getItem("caja_abierta") || "null");
  const historialCajas = JSON.parse(localStorage.getItem("historial_cajas") || "[]");

  const formatPrecio = (v) => "$ " + Number(v || 0).toLocaleString("es-CO");

  const calcularVentasJornada = () => {
    if (!cajaAbierta) return { total: 0, facturas: [] };
    const historialFacturas = JSON.parse(localStorage.getItem("historial_facturas") || "[]");
    const facturasDejornada = historialFacturas.filter(
      (f) => f.timestamp >= cajaAbierta.timestamp
    );
    const total = facturasDejornada.reduce((acc, f) => acc + f.total, 0);
    return { total, facturas: facturasDejornada };
  };

  const abrirCaja = () => {
    const monto = parseFloat(montoInicial.replace(/\./g, "").replace(",", ".")) || 0;
    const nuevaCaja = {
      timestamp: Date.now(),
      fecha: new Date().toLocaleDateString("es-CO"),
      hora: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      montoInicial: monto,
      nota,
      abiertaPor: JSON.parse(localStorage.getItem("usuario") || "{}").email || "Admin",
    };
    localStorage.setItem("caja_abierta", JSON.stringify(nuevaCaja));
    setMontoInicial("");
    setNota("");
    window.location.reload();
  };

  const cerrarCaja = () => {
    const { total, facturas } = calcularVentasJornada();
    const montoCierreParsed = parseFloat(montoCierre.replace(/\./g, "").replace(",", ".")) || 0;
    const registro = {
      ...cajaAbierta,
      cierreTimestamp: Date.now(),
      fechaCierre: new Date().toLocaleDateString("es-CO"),
      horaCierre: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      ventas: total,
      cantidadFacturas: facturas.length,
      montoCierre: montoCierreParsed,
      diferencia: montoCierreParsed - (cajaAbierta.montoInicial + total),
      notaCierre,
    };
    const nuevoHistorial = [registro, ...historialCajas];
    localStorage.setItem("historial_cajas", JSON.stringify(nuevoHistorial));
    localStorage.removeItem("caja_abierta");
    setConfirmandoCierre(false);
    setMontoCierre("");
    setNotaCierre("");
    window.location.reload();
  };

  const { total: ventasHoy, facturas: facturasHoy } = calcularVentasJornada();

  return (
    <div className="caja-root">
      <div className="caja-header">
        <button className="caja-back-btn" onClick={() => navigate("/panel-admin")}>
          ← Volver al panel
        </button>
        <div className="caja-header-title">
          <span className="caja-header-icon">💰</span>
          <div>
            <h1>Apertura y Cierre de Caja</h1>
            <p>Control de jornada laboral</p>
          </div>
        </div>
      </div>

      <div className="caja-body">

        {/* Estado actual */}
        <div className={`caja-estado-card ${cajaAbierta ? "caja-estado--abierta" : "caja-estado--cerrada"}`}>
          <div className="caja-estado-icon">{cajaAbierta ? "🟢" : "🔴"}</div>
          <div className="caja-estado-info">
            <p className="caja-estado-label">Estado de caja</p>
            <p className="caja-estado-value">{cajaAbierta ? "ABIERTA" : "CERRADA"}</p>
            {cajaAbierta && (
              <p className="caja-estado-sub">
                Apertura: {cajaAbierta.fecha} a las {cajaAbierta.hora} — Monto inicial: {formatPrecio(cajaAbierta.montoInicial)}
              </p>
            )}
          </div>
        </div>

        {/* Si caja abierta: resumen y cierre */}
        {cajaAbierta ? (
          <>
            <div className="caja-resumen-grid">
              <div className="caja-resumen-card">
                <p className="caja-resumen-label">Monto inicial</p>
                <p className="caja-resumen-value">{formatPrecio(cajaAbierta.montoInicial)}</p>
              </div>
              <div className="caja-resumen-card caja-resumen-card--ventas">
                <p className="caja-resumen-label">Ventas en jornada</p>
                <p className="caja-resumen-value">{formatPrecio(ventasHoy)}</p>
              </div>
              <div className="caja-resumen-card">
                <p className="caja-resumen-label">Facturas emitidas</p>
                <p className="caja-resumen-value">{facturasHoy.length}</p>
              </div>
              <div className="caja-resumen-card caja-resumen-card--total">
                <p className="caja-resumen-label">Total esperado en caja</p>
                <p className="caja-resumen-value">{formatPrecio(cajaAbierta.montoInicial + ventasHoy)}</p>
              </div>
            </div>

            {/* Detalle facturas */}
            {facturasHoy.length > 0 && (
              <div className="caja-facturas">
                <p className="caja-section-label">Facturas de esta jornada</p>
                <div className="caja-facturas-list">
                  {facturasHoy.map((f, i) => (
                    <div key={i} className="caja-factura-row">
                      <span className="caja-factura-num">{f.numeroFactura}</span>
                      <span className="caja-factura-mesa">Mesa {f.mesaNumero}</span>
                      <span className="caja-factura-hora">{f.fecha} {f.hora}</span>
                      <span className="caja-factura-metodo">{f.metodoPago}</span>
                      <span className="caja-factura-total">{formatPrecio(f.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botón cerrar caja */}
            {!confirmandoCierre ? (
              <button className="caja-btn-cerrar" onClick={() => setConfirmandoCierre(true)}>
                🔒 Cerrar Caja
              </button>
            ) : (
              <div className="caja-cierre-form">
                <p className="caja-section-label">Cierre de caja</p>
                <div className="caja-form-group">
                  <label>Monto contado en caja (efectivo real)</label>
                  <input
                    type="text"
                    placeholder="Ej: 350.000"
                    value={montoCierre}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\./g, "").replace(/\D/g, "");
                      setMontoCierre(raw ? parseInt(raw).toLocaleString("es-CO") : "");
                    }}
                  />
                </div>
                <div className="caja-form-group">
                  <label>Nota de cierre (opcional)</label>
                  <textarea
                    placeholder="Observaciones del cierre..."
                    value={notaCierre}
                    onChange={(e) => setNotaCierre(e.target.value)}
                    rows={2}
                  />
                </div>
                {montoCierre && (
                  <div className="caja-diferencia">
                    <span>Diferencia:</span>
                    <span className={
                      (parseFloat(montoCierre.replace(/\./g, "")) - (cajaAbierta.montoInicial + ventasHoy)) >= 0
                        ? "caja-dif--pos" : "caja-dif--neg"
                    }>
                      {formatPrecio(parseFloat(montoCierre.replace(/\./g, "")) - (cajaAbierta.montoInicial + ventasHoy))}
                    </span>
                  </div>
                )}
                <div className="caja-cierre-btns">
                  <button className="caja-btn-cancelar" onClick={() => setConfirmandoCierre(false)}>
                    Cancelar
                  </button>
                  <button className="caja-btn-confirmar-cierre" onClick={cerrarCaja}>
                    ✅ Confirmar cierre
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Formulario apertura */
          <div className="caja-apertura-form">
            <p className="caja-section-label">Apertura de caja</p>
            <div className="caja-form-group">
              <label>Monto inicial en caja</label>
              <input
                type="text"
                placeholder="Ej: 100.000"
                value={montoInicial}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\./g, "").replace(/\D/g, "");
                  setMontoInicial(raw ? parseInt(raw).toLocaleString("es-CO") : "");
                }}
              />
            </div>
            <div className="caja-form-group">
              <label>Nota de apertura (opcional)</label>
              <textarea
                placeholder="Observaciones..."
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows={2}
              />
            </div>
            <button className="caja-btn-abrir" onClick={abrirCaja}>
              🔓 Abrir Caja
            </button>
          </div>
        )}

        {/* Historial de cierres */}
        {historialCajas.length > 0 && (
          <div className="caja-historial">
            <p className="caja-section-label">Historial de jornadas</p>
            <div className="caja-historial-list">
              {historialCajas.slice(0, 10).map((c, i) => (
                <div key={i} className="caja-historial-row">
                  <div className="caja-historial-fechas">
                    <span className="caja-hist-fecha">📅 {c.fecha} {c.hora}</span>
                    <span className="caja-hist-cierre">→ Cierre: {c.fechaCierre} {c.horaCierre}</span>
                  </div>
                  <div className="caja-historial-nums">
                    <span>Inicial: {formatPrecio(c.montoInicial)}</span>
                    <span>Ventas: {formatPrecio(c.ventas)}</span>
                    <span>Facturas: {c.cantidadFacturas}</span>
                    <span className={c.diferencia >= 0 ? "caja-dif--pos" : "caja-dif--neg"}>
                      Dif: {formatPrecio(c.diferencia)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}