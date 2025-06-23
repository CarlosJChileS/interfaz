import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import "./MapaPuntos.css";

export default function MapaPuntos() {
  return (
    <div className="mapa-root">
      <div className="mapa-header">
        <span className="breadcrumb">Inicio &gt; Mapa de Puntos &gt; </span>
        <strong>Puntos Limpios - Campus Universidad Nacional</strong>
        <button className="mapa-btn right">Mi Ubicación</button>
        <button className="mapa-btn right">Filtros</button>
      </div>
      <div className="mapa-main">
        <div className="mapa-sidebar">
          <div className="mapa-filtros">
            <strong>Filtrar por Tipo de Material</strong>
            <div className="filtro-item selected">Papel y Cartón (23)</div>
            <div className="filtro-item">Plásticos (18)</div>
            <div className="filtro-item">Vidrio (12)</div>
            <div className="filtro-item">Metales (15)</div>
          </div>
          <div className="mapa-cercanos">
            <strong>Puntos Cercanos (12)</strong>
            <div className="cercano-card disponible">
              <span><FaMapMarkerAlt /> Biblioteca Central</span>
              <span className="badge verde">Disponible</span>
            </div>
            <div className="cercano-card medio">
              <span><FaMapMarkerAlt /> Facultad de Ingeniería</span>
              <span className="badge naranja">75% Lleno</span>
            </div>
            <div className="cercano-card disponible">
              <span><FaMapMarkerAlt /> Cafetería Principal</span>
              <span className="badge verde">Disponible</span>
            </div>
          </div>
        </div>
        <div className="mapa-mapa">
          <div className="mapa-mapa-placeholder">
            <FaMapMarkerAlt size={60} color="#b3e1bc" />
            <p>Mapa Interactivo del Campus<br /><small>Aquí se mostrará el mapa con los puntos limpios marcados</small></p>
            <div style={{marginTop: 10}}>
              <span className="badge verde">Disponible</span> &nbsp;
              <span className="badge naranja">Parcialmente lleno</span> &nbsp;
              <span className="badge rojo">Lleno</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
