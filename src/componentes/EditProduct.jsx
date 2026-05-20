import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/EditProduct.css";
import prueba from "../assets/prueba.jpg";

const CATEGORIAS = ["Bebidas", "Entradas", "Platos fuertes", "Postres"];

const UNIDADES = {
  "Entradas":       ["porciones", "unidades", "kg"],
  "Bebidas":        ["litros", "vasos", "botellas", "unidades"],
  "Platos fuertes": ["porciones", "kg", "unidades"],
  "Postres":        ["porciones", "unidades", "kg"],
};

const PRODUCTOS_INICIALES = [
  { id: 1, nombre: "Jugo de Fresa",     categoria: "Bebidas",        precio: 15000, imagen: null, stock: 20, stockMinimo: 5, unidad: "vasos" },
  { id: 2, nombre: "Limonada",          categoria: "Bebidas",        precio: 15000, imagen: null, stock: 15, stockMinimo: 5, unidad: "vasos" },
  { id: 3, nombre: "Costilla BBQ",      categoria: "Platos fuertes", precio: 45000, imagen: null, stock: 8,  stockMinimo: 5, unidad: "porciones" },
  { id: 4, nombre: "Dedos de Queso",    categoria: "Entradas",       precio: 34000, imagen: null, stock: 12, stockMinimo: 5, unidad: "porciones" },
  { id: 5, nombre: "Pastel Tres Leches",categoria: "Postres",        precio: 4000,  imagen: null, stock: 6,  stockMinimo: 3, unidad: "porciones" },
];

export default function EditProduct() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = Number(searchParams.get("id"));
  const [preview, setPreview] = useState("");
  const [guardado, setGuardado] = useState(false);
  const [form, setForm] = useState({
    id: "", nombre: "", categoria: "", precio: "", imagen: "",
    stock: "", stockMinimo: "", unidad: "",
  });

  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    const todos = [...PRODUCTOS_INICIALES, ...productosGuardados];
    const prod = todos.find((p) => p.id === id);
    if (prod) {
      setForm({
        ...prod,
        stock: prod.stock ?? "",
        stockMinimo: prod.stockMinimo ?? 5,
        unidad: prod.unidad ?? "",
      });
      if (prod.imagen) setPreview(prod.imagen);
    }
  }, [id]);

  const handleChange = (e) => {
    setGuardado(false);
    const { name, value } = e.target;
    if (name === "categoria") {
      setForm({ ...form, categoria: value, unidad: "" });
    } else {
      setForm({ ...form, [name]: name === "precio" ? Number(value) : value });
    }
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setForm({ ...form, imagen: reader.result }); setPreview(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardar = () => {
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    const todos = [...PRODUCTOS_INICIALES, ...productosGuardados];
    const actualizados = todos.map((p) => p.id === id ? { ...form, stock: Number(form.stock), stockMinimo: Number(form.stockMinimo) } : p);
    const personalizados = actualizados.filter((p) => p.id > 5);
    localStorage.setItem("productos", JSON.stringify(personalizados));
    setGuardado(true);
    setTimeout(() => navigate("/create-menu"), 1200);
  };

  const stockNum  = Number(form.stock);
  const minimoNum = Number(form.stockMinimo) || 5;
  const stockStatus =
    !form.stock && form.stock !== 0 ? null :
    stockNum <= 0 ? "agotado" :
    stockNum <= minimoNum ? "bajo" : "ok";

  const unidadesDisponibles = UNIDADES[form.categoria] || [];

  return (
    <div className="eu-layout">
      <aside className="eu-sidebar">
        <div className="eu-sidebar-hero">
          <img src={prueba} alt="Restaurant" className="eu-sidebar-hero-img" />
          <div className="eu-sidebar-hero-overlay">
            <p className="eu-brand">La Mesa Dorada</p>
            <p className="eu-brand-sub">Panel de productos</p>
            <div className="eu-gold-line" />
          </div>
        </div>

        <div className="eu-sidebar-profile">
          <div className="eu-avatar-big">{form.nombre ? form.nombre.slice(0, 2).toUpperCase() : "PR"}</div>
          <p className="eu-profile-name">{form.nombre}</p>
          <span className="eu-profile-badge">{form.categoria}</span>
        </div>

        <div className="eu-sidebar-info">
          <div className="eu-info-row">
            <span className="eu-info-label">Categoría</span>
            <span className="eu-info-value">{form.categoria}</span>
          </div>
          <div className="eu-info-row">
            <span className="eu-info-label">Precio</span>
            <span className="eu-info-value">${Number(form.precio).toLocaleString("es-CO")}</span>
          </div>
          <div className="eu-info-row">
            <span className="eu-info-label">Stock</span>
            <span className={`eu-info-value eu-stock-badge eu-stock-badge--${stockStatus || "empty"}`}>
              {stockStatus
                ? `${form.stock} ${form.unidad} ${stockStatus === "agotado" ? "🔴" : stockStatus === "bajo" ? "🟡" : "🟢"}`
                : "—"}
            </span>
          </div>
          <div className="eu-info-row">
            <span className="eu-info-label">Estado</span>
            <span className="eu-info-value eu-info-value--active">● Disponible</span>
          </div>
        </div>

        <div className="eu-sidebar-footer">
          <button className="eu-back-btn" onClick={() => navigate("/create-menu")}>← Volver a productos</button>
        </div>
      </aside>

      <main className="eu-main">
        <div className="eu-topbar">
          <div>
            <p className="eu-topbar-title">Editar Producto</p>
            <p className="eu-topbar-sub">Modificar información del menú</p>
          </div>
          <span className="eu-status-pill">● Editando</span>
        </div>

        <div className="eu-divider" />

        <div className="eu-content">
          {guardado && <div className="eu-alert">✅ Producto actualizado correctamente</div>}

          <p className="eu-section-label">Información del producto</p>

          <div className="eu-fields">
            <div className="eu-field">
              <label className="eu-label">Nombre del producto</label>
              <input className="eu-input" type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del producto" />
            </div>

            <div className="eu-field">
              <label className="eu-label">Precio</label>
              <input className="eu-input" type="number" name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" />
            </div>

            <div className="eu-field">
              <label className="eu-label">Categoría</label>
              <div className="eu-select-wrapper">
                <select className="eu-select" name="categoria" value={form.categoria} onChange={handleChange}>
                  {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="eu-select-arrow">▼</span>
              </div>
            </div>

            <div className="eu-field eu-field--full">
              <label className="eu-label">Imagen del producto</label>
              <input className="eu-input" type="text" name="imagen" value={typeof form.imagen === "string" ? form.imagen : ""} onChange={handleChange} placeholder="Pegar URL de imagen" />
              <p style={{ fontSize: "11px", color: "#8A7060", margin: "6px 0" }}>o subir desde tu equipo</p>
              <input className="eu-input" type="file" accept="image/*" onChange={handleImagen} />
              {(preview || form.imagen) && (
                <img src={preview || form.imagen} alt="preview" style={{ marginTop: "10px", width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px", border: "1px solid #EDE8E0" }} />
              )}
            </div>
          </div>

          <div className="eu-divider" style={{ margin: "24px 0" }} />
          <p className="eu-section-label">Control de stock</p>

          <div className="eu-fields">
            <div className="eu-field">
              <label className="eu-label">Unidad de medida</label>
              <div className="eu-select-wrapper">
                <select className="eu-select" name="unidad" value={form.unidad} onChange={handleChange}>
                  <option value="" disabled hidden>Seleccionar unidad</option>
                  {unidadesDisponibles.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                <span className="eu-select-arrow">▼</span>
              </div>
            </div>

            <div className="eu-field">
              <label className="eu-label">Stock actual</label>
              <div className="eu-input-with-unit">
                <input className="eu-input" type="number" name="stock" min="0" placeholder="Ej: 20" value={form.stock} onChange={handleChange} />
                {form.unidad && <span className="eu-unit-tag">{form.unidad}</span>}
              </div>
            </div>

            <div className="eu-field">
              <label className="eu-label">Stock mínimo (alerta)</label>
              <div className="eu-input-with-unit">
                <input className="eu-input" type="number" name="stockMinimo" min="1" placeholder="Ej: 5" value={form.stockMinimo} onChange={handleChange} />
                {form.unidad && <span className="eu-unit-tag">{form.unidad}</span>}
              </div>
              <p className="eu-field-hint">Te avisaremos cuando el stock baje de este número</p>
            </div>

            {(form.stock !== "" || form.stock === 0) && (
              <div className={`eu-stock-preview eu-stock-preview--${stockStatus}`}>
                <div className="eu-stock-preview-bar">
                  <div className="eu-stock-preview-fill" style={{ width: `${Math.min(100, (stockNum / (minimoNum * 2)) * 100)}%` }} />
                </div>
                <div className="eu-stock-preview-info">
                  <span>
                    {stockStatus === "agotado" && "🔴 Sin stock"}
                    {stockStatus === "bajo" && "🟡 Stock bajo — considera reabastecer"}
                    {stockStatus === "ok" && "🟢 Stock suficiente"}
                  </span>
                  <span>{form.stock} / mín. {form.stockMinimo || 5} {form.unidad}</span>
                </div>
              </div>
            )}
          </div>

          <div className="eu-actions">
            <button className="eu-btn eu-btn--cancelar" onClick={() => navigate("/create-menu")}>Cancelar</button>
            <button className="eu-btn eu-btn--guardar" onClick={handleGuardar}>Guardar cambios</button>
          </div>
        </div>
      </main>
    </div>
  );
}