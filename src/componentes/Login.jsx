import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import prueba from "../assets/prueba.jpg";

// Credenciales de demostración
const CREDENCIALES = [
  { email: "admin@lamesadorada.com",   password: "admin123",   rol: "Administrador" },
  { email: "mesero@lamesadorada.com",  password: "mesero123",  rol: "Mesero"        },
  { email: "cocina@lamesadorada.com",  password: "cocina123",  rol: "Cocinero"      },
];

export default function Login() {
  const navigate = useNavigate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulación de autenticación
    setTimeout(() => {
      const usuario = CREDENCIALES.find(
        (c) => c.email === email.trim() && c.password === password
      );

      if (usuario) {
        // Guardar sesión básica
        localStorage.setItem("usuario", JSON.stringify(usuario));
        navigate("/panel-admin");
      } else {
        setError("Correo o contraseña incorrectos.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="login-page">

      {/* ── Panel izquierdo decorativo ── */}
      <div className="login-hero">
        <div className="login-hero-deco login-hero-deco-1" />
        <div className="login-hero-deco login-hero-deco-2" />
        <div className="login-hero-deco login-hero-deco-3" />
        <img src={prueba} alt="Restaurante" className="login-hero-img" />
        <div className="login-hero-gradient" />
        <div className="login-hero-pattern" />

        <div className="login-hero-inner">
          <div className="login-hero-icon">🍴</div>
          <h1 className="login-hero-name">La Mesa<br />Dorada</h1>
          <div className="login-hero-gold-line" />
          <p className="login-hero-tagline">Haute Cuisine</p>
          <p className="login-hero-desc">
            Sistema de gestión interno para el control de personal, mesas y pedidos.
          </p>
        </div>
      </div>

      {/* ── Panel formulario ── */}
      <div className="login-form-panel">
        <div className="login-form-inner">

          {/* Logo visible solo en móvil */}
          <div className="login-form-logo">
            <span className="login-form-logo-icon">🍴</span>
            <span className="login-form-logo-name">La Mesa Dorada</span>
          </div>

          <h2 className="login-form-title">Bienvenido</h2>
          <p className="login-form-sub">Ingresa tus credenciales para acceder al sistema</p>
          <div className="login-form-divider" />

          {/* Mensaje de error */}
          {error && (
            <div className="form-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="correo@lamesadorada.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Credenciales de demo */}
          <div className="login-hint">
            <strong>Cuentas de demostración:</strong>
            Admin: admin@lamesadorada.com / admin123<br />
            Mesero: mesero@lamesadorada.com / mesero123<br />
            Cocina: cocina@lamesadorada.com / cocina123
          </div>

        </div>
      </div>

    </div>
  );
}