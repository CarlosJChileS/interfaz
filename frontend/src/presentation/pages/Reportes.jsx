import React from "react";
import "../styles/Reportes.css";
import { useNavigate } from "react-router-dom";

export default function Reportes() {
  const navigate = useNavigate();
  return (
    <div className="reportes-root">
      <div className="reportes-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Volver">←</button>
        <span>Reportes</span>
      </div>
      <div className="reportes-content">
        <p>Aquí podrás ver y enviar reportes sobre problemas o incidencias relacionadas con los puntos de reciclaje.</p>
        <p>Próximamente se añadirán más funcionalidades.</p>
      </div>
    </div>
  );
}
