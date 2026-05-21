import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import prueba from "../assets/prueba.jpg";

const CREDENCIALES_DEFAULT = [
  { usuario: "admin",  password: "admin123",  rol: "Administrador", nombre: "Administrador" },
  { usuario: "mesero", password: "mesero123", rol: "Mesero",        nombre: "Mesero"        },
  { usuario: "cocina", password: "cocina123", rol: "Cocinero",      nombre: "Cocinero"      },
];

export default function Login() {
  const navigate  = useNavigate();
  const [usuario,  setUsuario]  = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      /* buscar en usuarios guardados por el admin */
      const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios_sistema") || "[]");
      const todosLosUsuarios  = [...CREDENCIALES_DEFAULT, ...usuariosGuardados];

      const encontrado = todosLosUsuarios.find(
        (c) => c.usuario === usuario.trim() && c.password === password
      );

      if (encontrado) {
        localStorage.setItem("usuario", JSON.stringify(encontrado));
        if (encontrado.rol === "Administrador") {
          navigate("/panel-admin");
        } else if (encontrado.rol === "Mesero") {
          navigate("/waiter");
        } else if (encontrado.rol === "Cocinero") {
          navigate("/kitchen");
        } else {
          navigate("/");
        }
      } else {
        setError("Usuario o contraseña incorrectos.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="login-page">

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

      <div className="login-form-panel">
        <div className="login-form-inner">

          <div className="login-form-logo">
            <span className="login-form-logo-icon">🍴</span>
            <span className="login-form-logo-name">La Mesa Dorada</span>
          </div>

          <h2 className="login-form-title">Bienvenido</h2>
          <p className="login-form-sub">Ingresa tus credenciales para acceder al sistema</p>
          <div className="login-form-divider" />

          {error && (
            <div className="form-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="usuario">Usuario</label>
              <input
                id="usuario"
                type="text"
                className="form-input"
                placeholder="Ej: jmontoya"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Contraseña</label>
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

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Verificando..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="login-hint">
            <strong>Cuentas de demostración:</strong><br />
            Admin: <strong>admin</strong> / admin123<br />
            Mesero: <strong>mesero</strong> / mesero123<br />
            Cocina: <strong>cocina</strong> / cocina123
          </div>

        </div>
      </div>

    </div>
  );
}