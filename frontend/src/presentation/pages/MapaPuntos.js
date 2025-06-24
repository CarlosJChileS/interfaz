import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./MapaPuntos.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const puntos = [
  { position: [-0.952, -80.744], label: "Bote 1" },
  { position: [-0.9535, -80.745], label: "Bote 2" },
  { position: [-0.9515, -80.746], label: "Bote 3" },
];
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
          <MapContainer center={[-0.9526, -80.7454]} zoom={17} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {puntos.map((p, idx) => (
              <Marker position={p.position} key={idx}>
                <Popup>{p.label}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
