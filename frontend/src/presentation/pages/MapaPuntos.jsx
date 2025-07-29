import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "../styles/MapaPuntos.css";
import { usePuntos } from "../../PuntosContext";
import { useTranslation } from 'react-i18next';
import LanguageToggle from "../components/LanguageToggle";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapaPuntos() {
  const { t } = useTranslation();
  const { puntos, addPunto, deletePunto: removePunto, updatePunto } = usePuntos();
  const [selected, setSelected] = useState("");
  const [creating, setCreating] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [showCreateHelp, setShowCreateHelp] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const latParam = parseFloat(searchParams.get("lat"));
  const lngParam = parseFloat(searchParams.get("lng"));
  const initialCenter =
    !Number.isNaN(latParam) && !Number.isNaN(lngParam)
      ? [latParam, lngParam]
      : [-0.9526, -80.7454];

  // puntos se cargan desde el contexto

  const [newPoint, setNewPoint] = useState(null);
  const [manualPoint, setManualPoint] = useState({
    nombre: "",
    material: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    const handleKey = e => {
      if (e.key.toLowerCase() === "c") {
        setCreating(true);
        setShowCreateHelp(false);
      }
    };
    if (showCreateHelp) {
      window.addEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [showCreateHelp]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (creating) {
      mapRef.current.dragging.disable();
    } else {
      mapRef.current.dragging.enable();
    }
  }, [creating]);

  const handleMapClick = e => {
    if (!creating) return;
    setNewPoint({ lat: e.latlng.lat, lng: e.latlng.lng, nombre: "", material: "" });
    setCreating(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setNewPoint(prev => ({ ...prev, [name]: value }));
  };

  const handleManualChange = e => {
    const { name, value } = e.target;
    setManualPoint(prev => ({ ...prev, [name]: value }));
  };

  const submitManualPoint = e => {
    e.preventDefault();
    if (
      !manualPoint.nombre ||
      !manualPoint.material ||
      manualPoint.lat === "" ||
      manualPoint.lng === ""
    )
      return;
    addPunto({
      nombre: manualPoint.nombre,
      material: manualPoint.material,
      posicion: [parseFloat(manualPoint.lat), parseFloat(manualPoint.lng)],
      estado: "Disponible",
    });
    setManualPoint({ nombre: "", material: "", lat: "", lng: "" });
    setShowManualForm(false);
  };

  const submitNewPoint = e => {
    e.preventDefault();
    if (!newPoint.nombre || !newPoint.material) return;
    addPunto({
      nombre: newPoint.nombre,
      material: newPoint.material,
      posicion: [newPoint.lat, newPoint.lng],
      estado: "Disponible",
    });
    setNewPoint(null);
  };

  const deletePunto = id => {
    removePunto(id);
  };

  const editPunto = async p => {
    const nombre = window.prompt(t('map_edit_name'), p.nombre);
    if (nombre === null) return;
    const material = window.prompt(t('map_edit_material'), p.material);
    if (material === null) return;
    updatePunto(p.id, { nombre, material });
  };

  const filtered = selected
    ? puntos.filter(p => p.material === selected)
    : puntos;

  const handleSelect = material => setSelected(material);
  const clearFilters = () => setSelected("");

  const toggleFilters = () => setShowFilters(prev => !prev);

  const goToMyLocation = () => {
    if (!mapRef.current || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      mapRef.current.setView([latitude, longitude], mapRef.current.getZoom());
    });
  };

  return (
    <div className="mapa-root">
      <LanguageToggle className="lang-toggle-bottom-left" />
      <div className="mapa-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Volver">←</button>
        <strong>{t('map_title')}</strong>
        {creating && <span className="breadcrumb">{t('map_select_point')}</span>}
        <button
          className="mapa-btn"
          onClick={() => setShowCreateHelp(true)}
          disabled={creating || newPoint || showCreateHelp}
        >
          {t('map_create_point')}
        </button>
        <button
          className="mapa-btn"
          onClick={() => setShowManualForm(true)}
          disabled={creating || newPoint || showManualForm}
        >
          {t('map_create_manually')}
        </button>
        <button className="mapa-btn right" onClick={goToMyLocation}>{t('map_my_location')}</button>
        <button className="mapa-btn right" onClick={toggleFilters}>{t('map_filters')}</button>
      </div>
      {showCreateHelp && (
        <div className="create-panel">
          <p>{t('map_create_help')}</p>
          <button className="mapa-btn" onClick={() => setShowCreateHelp(false)}>
            {t('common_cancel')}
          </button>
        </div>
      )}
      {showManualForm && (
        <div className="create-panel">
          <form onSubmit={submitManualPoint} className="popup-form">
            <div>
              <input
                type="text"
                name="nombre"
                placeholder={t('map_name_placeholder')}
                value={manualPoint.nombre}
                onChange={handleManualChange}
                required
              />
            </div>
            <div>
              <select
                name="material"
                value={manualPoint.material}
                onChange={handleManualChange}
                required
              >
                <option value="" disabled>
                  {t('map_select_material')}
                </option>
                {[t('material_paper'), t('material_plastic'), t('material_glass'), t('material_metal')].map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="number"
                step="any"
                name="lat"
                placeholder={t('map_latitude')}
                value={manualPoint.lat}
                onChange={handleManualChange}
                required
              />
            </div>
            <div>
              <input
                type="number"
                step="any"
                name="lng"
                placeholder={t('map_longitude')}
                value={manualPoint.lng}
                onChange={handleManualChange}
                required
              />
            </div>
            <div style={{ marginTop: '6px', textAlign: 'right' }}>
              <button
                type="button"
                className="mapa-btn"
                onClick={() => {
                  setShowManualForm(false);
                  setManualPoint({ nombre: '', material: '', lat: '', lng: '' });
                }}
              >
                {t('common_cancel')}
              </button>
              <button type="submit" className="mapa-btn" style={{ marginLeft: '6px' }}>
                {t('common_save')}
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="mapa-main">
        {showFilters && (
        <div className="mapa-sidebar">
          <div className="mapa-filtros">
            <strong>{t('map_filter_material')}</strong>
            {[t('material_paper'), t('material_plastic'), t('material_glass'), t('material_metal')].map(m => (
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
                {t('map_clear_filters')}
              </button>
            )}
          </div>
          <div className="mapa-cercanos">
            <strong>{t('map_nearby_points')} ({filtered.length})</strong>
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
                <div>
                  <button
                    className="mapa-btn"
                    onClick={() => editPunto(p)}
                    style={{ marginRight: '6px' }}
                  >
                    {t('common_edit')}
                  </button>
                  <button className="mapa-btn" onClick={() => deletePunto(p.id)}>
                    {t('common_delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
        <div className="mapa-mapa">
          <MapContainer
            center={initialCenter}
            zoom={17}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            onClick={handleMapClick}
            whenCreated={map => {
              mapRef.current = map;
            }}
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
                      <select
                        name="material"
                        value={newPoint.material}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Seleccionar material
                        </option>
                        {['Papel y Cartón', 'Plásticos', 'Vidrio', 'Metales'].map(m => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ marginTop: '6px', textAlign: 'right' }}>
                      <button
                        type="button"
                        className="mapa-btn"
                        onClick={() => {
                          setNewPoint(null);
                          setCreating(false);
                        }}
                      >
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
