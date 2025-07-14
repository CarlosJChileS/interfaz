import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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

export default function MapaPuntos() {
  const [puntos, setPuntos] = useState([]);
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/puntos")
      .then(res => res.json())
      .then(data => setPuntos(data))
      .catch(() => setPuntos([]));
  }, []);

  const [newPoint, setNewPoint] = useState(null);

  const handleMapClick = e => {
    setNewPoint({ lat: e.latlng.lat, lng: e.latlng.lng, nombre: "", material: "" });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setNewPoint(prev => ({ ...prev, [name]: value }));
  };

  const submitNewPoint = async e => {
    e.preventDefault();
    if (!newPoint.nombre || !newPoint.material) return;
    const res = await fetch("/api/puntos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: newPoint.nombre,
        material: newPoint.material,
        posicion: [newPoint.lat, newPoint.lng],
        estado: "Disponible",
      }),
    });
    const nuevo = await res.json();
    setPuntos(prev => [...prev, nuevo]);
    setNewPoint(null);
  };

  const deletePunto = async id => {
    await fetch(`/api/puntos/${id}`, { method: "DELETE" });
    setPuntos(prev => prev.filter(p => p.id !== id));
  };

  const filtered = selected
    ? puntos.filter(p => p.material === selected)
    : puntos;

  const handleSelect = material => setSelected(material);
  const clearFilters = () => setSelected("");

  return (
    <div className="mapa-root">
      <div className="mapa-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Volver">←</button>
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
            <strong>Puntos Cercanos ({filtered.length})</strong>
            {filtered.map(p => (
              <div
                key={p.id}
                className={`cercano-card ${
                  p.estado === "Disponible" ? "disponible" : "medio"
                }`}
              >
                <span>
                  <FaMapMarkerAlt /> {p.nombre}
                </span>
                <span
                  className={`badge ${
                    p.estado === "Disponible" ? "verde" : "naranja"
                  }`}
                >
                  {p.estado}
                </span>
                <button className="mapa-btn" onClick={() => deletePunto(p.id)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mapa-mapa">
          <MapContainer
            center={[-0.9526, -80.7454]}
            zoom={17}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            onClick={handleMapClick}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map(p => (
              <Marker position={p.posicion} key={p.id}>
                <Popup>{p.nombre}</Popup>
              </Marker>
            ))}
            {newPoint && (
              <Marker position={[newPoint.lat, newPoint.lng]}>
                <Popup>
                  <form onSubmit={submitNewPoint} className="popup-form">
                    <div>
                      <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={newPoint.nombre}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="material"
                        placeholder="Material"
                        value={newPoint.material}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div style={{ marginTop: '6px', textAlign: 'right' }}>
                      <button type="button" className="mapa-btn" onClick={() => setNewPoint(null)}>
                        Cancelar
                      </button>
                      <button type="submit" className="mapa-btn" style={{ marginLeft: '6px' }}>
                        Guardar
                      </button>
                    </div>
                  </form>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
