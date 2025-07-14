import React from "react";
import { Link } from "react-router-dom";
import { FaRecycle, FaMapMarkerAlt, FaGift } from "react-icons/fa";
import "../styles/Bienvenida.css";

export default function Bienvenida() {
  return (
    <div className="bienvenida-container">
      <div className="bienvenida-hero">
        <FaRecycle className="bienvenida-main-icon" />
        <h1>EcoGestor Universitario</h1>
        <p className="bienvenida-subtitle">Recicla, Gana Puntos, Cambia el Mundo</p>
        <p className="bienvenida-desc">
          Únete a la comunidad de estudiantes comprometidos con el medio ambiente.
          Encuentra puntos limpios en tu universidad, acumula puntos por reciclar y
          canjea increíbles recompensas.
        </p>
        <div className="bienvenida-buttons">
          <Link className="primary-btn" to="/login">Comenzar Ahora</Link>
          <Link className="outline-btn" to="/puntos">Ver Puntos</Link>
        </div>
      </div>
      <div className="bienvenida-steps-section">
        <h2>¿Cómo Funciona?</h2>
        <p className="steps-desc">
          Tres pasos simples para comenzar tu impacto ambiental
        </p>
        <div className="bienvenida-steps">
          <div className="bienvenida-step">
            <FaMapMarkerAlt className="step-icon" />
            <h3>1. Encuentra Puntos</h3>
            <p>Localiza los puntos limpios más cercanos en tu universidad usando nuestro mapa interactivo</p>
          </div>
          <div className="bienvenida-step">
            <FaRecycle className="step-icon" />
            <h3>2. Recicla Materiales</h3>
            <p>Deposita tus materiales reciclables y registra tu actividad para ganar puntos automáticamente</p>
          </div>
          <div className="bienvenida-step">
            <FaGift className="step-icon" />
            <h3>3. Gana Recompensas</h3>
            <p>Canjea tus puntos por descuentos en cafeterías, libros, productos eco-friendly y más</p>
          </div>
        </div>
      </div>
      <div className="bienvenida-bottom">
        <h3>¿Listo para hacer la diferencia?</h3>
        <Link className="green-btn" to="/register">Crear Cuenta Gratis</Link>
      </div>
    </div>
  );
}
