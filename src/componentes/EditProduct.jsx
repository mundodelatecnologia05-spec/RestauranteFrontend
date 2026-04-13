import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/EditProduct.css";
import prueba from "../assets/prueba.jpg";

const CATEGORIAS = ["Bebidas", "Entradas", "Platos fuertes", "Postres"];

const PRODUCTO_INICIAL = {
  nombre: "Jugo de Fresa",
  categoria: "Bebidas",
  precio: 15000,
  imagen: "",
};

export default function EditProduct() {
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState(PRODUCTO_INICIAL);
  const [guardado, setGuardado] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setGuardado(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    console.log("Producto actualizado:", form);
    setGuardado(true);
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, imagen: file });

      // vista previa
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <div className="eu-layout">
      {/* ── Sidebar ── */}
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
          <div className="eu-avatar-big">
            {form.nombre.slice(0, 2).toUpperCase()}
          </div>
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
            <span className="eu-info-value">${form.precio}</span>
          </div>
          <div className="eu-info-row">
            <span className="eu-info-label">Estado</span>
            <span className="eu-info-value eu-info-value--active">
              ● Disponible
            </span>
          </div>
        </div>

        <div className="eu-sidebar-footer">
          <button
            className="eu-back-btn"
            onClick={() => navigate("/create-menu")}
          >
            ← Volver a productos
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
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
          {guardado && (
            <div className="eu-alert">
              ✅ Producto actualizado correctamente
            </div>
          )}

          <p className="eu-section-label">Información del producto</p>

          <div className="eu-fields">
            <div className="eu-field">
              <label className="eu-label">Nombre del producto</label>
              <input
                className="eu-input"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre del producto"
              />
            </div>

            <div className="eu-field">
              <label className="eu-label">Precio</label>
              <input
                className="eu-input"
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Precio"
              />
            </div>

            <div className="eu-field">
              <label className="eu-label">Categoría</label>
              <div className="eu-select-wrapper">
                <select
                  className="eu-select"
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                >
                  <option value="" disabled hidden>
                    Seleccionar categoría
                  </option>
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <span className="eu-select-arrow">▼</span>
              </div>
            </div>

            <div className="eu-field eu-field--full">
              <label className="eu-label">Imagen del producto</label>

              {/* Input URL */}
              <input
                className="eu-input"
                type="text"
                name="imagen"
                value={typeof form.imagen === "string" ? form.imagen : ""}
                onChange={handleChange}
                placeholder="Pegar URL de imagen"
              />

              {/* Separador */}
              <p
                style={{ fontSize: "11px", color: "#8A7060", margin: "6px 0" }}
              >
                o subir desde tu equipo
              </p>

              {/* Input file */}
              <input
                className="eu-input"
                type="file"
                accept="image/*"
                onChange={handleImagen}
              />

              {/* Preview */}
              {(preview || form.imagen) && (
                <img
                  src={preview || form.imagen}
                  alt="preview"
                  style={{
                    marginTop: "10px",
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #EDE8E0",
                  }}
                />
              )}
            </div>
          </div>

          <div className="eu-actions">
            <button
              className="eu-btn eu-btn--cancelar"
              onClick={() => navigate("/create-menu")}
            >
              Cancelar
            </button>
            <button className="eu-btn eu-btn--guardar" onClick={handleGuardar}>
              Guardar cambios
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
