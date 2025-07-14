import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "../styles/MapaPuntos.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const puntos = [
  {
    id: 1,
    position: [-0.952, -80.744],
    label: "Biblioteca Central",
    material: "Papel y Cartón",
    estado: "Disponible",
  },
  {
    id: 2,
    position: [-0.9535, -80.745],
    label: "Facultad de Ingeniería",
    material: "Plásticos",
    estado: "75% Lleno",
  },
  {
    id: 3,
    position: [-0.9515, -80.746],
    label: "Cafetería Principal",
    material: "Vidrio",
    estado: "Disponible",
  },
  {
    id: 4,
    position: [-0.9528, -80.7445],
    label: "Centro de Estudiantes",
    material: "Metales",
    estado: "Disponible",
  },
];
export default function MapaPuntos() {
  const [selected, setSelected] = useState("");

  const filtered = selected
    ? puntos.filter(p => p.material === selected)
    : puntos;

  const handleSelect = material => setSelected(material);
  const clearFilters = () => setSelected("");

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
            {["Papel y Cartón", "Plásticos", "Vidrio", "Metales"].map(m => (
              <div
                key={m}
                className={`filtro-item ${selected === m ? "selected" : ""}`}
                onClick={() => handleSelect(m)}
                onKeyDown={e => e.key === "Enter" && handleSelect(m)}
                role="button"
                tabIndex="0"
              >
                {m}
              </div>
            ))}
            {selected && (
              <button
                onClick={clearFilters}
                className="mapa-btn clear-filtros"
              >
                Limpiar filtros
              </button>
            )}
          </div>
          <div className="mapa-cercanos">
            <strong>Puntos Cercanos (12)</strong>
            {filtered.map(p => (
              <div
                key={p.id}
                className={`cercano-card ${
                  p.estado === "Disponible" ? "disponible" : "medio"
                }`}
              >
                <span>
                  <FaMapMarkerAlt /> {p.label}
                </span>
                <span
                  className={`badge ${
                    p.estado === "Disponible" ? "verde" : "naranja"
                  }`}
                >
                  {p.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mapa-mapa">
          <MapContainer center={[-0.9526, -80.7454]} zoom={17} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map(p => (
              <Marker position={p.position} key={p.id}>
                <Popup>{p.label}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
