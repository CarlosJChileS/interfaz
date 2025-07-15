import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Reportes.css";

const incidentTypes = [
  {
    key: "damaged",
    title: "Punto Limpio Dañado",
    description: "Contenedor roto, mal estado o fuera de funcionamiento",
    icon: "🛑",
    active: true,
  },
  {
    key: "technical",
    title: "Problema Técnico",
    description: "Fallas en la aplicación, problemas de sensores o tags",
    icon: "🛠️",
    active: false,
  },
  {
    key: "full",
    title: "Punto Limpio Lleno",
    description: "Contenedor sin espacio para recibir residuos",
    icon: "♻️",
    active: false,
  },
  {
    key: "security",
    title: "Problema de Seguridad",
    description: "Situación peligrosa o riesgo para los usuarios",
    icon: "⚠️",
    active: false,
  },
];

export default function Reportes() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("damaged");
  const [location, setLocation] = useState("Biblioteca Central");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("Alto");
  const [when, setWhen] = useState("Hace 2 horas (14:30 PM)");
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("gsa.problemas@uleam.edu.ec");
  const [phone, setPhone] = useState("+57 300 123 4567");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="reportes-root">
      <header className="reportes-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          ←
        </button>
        <button className="urgent-btn">Reporte Urgente</button>
      </header>
      <div className="incident-container">
        <h2 className="incident-title">Reportar Incidente o Problema</h2>
      
      <section>
        <h3 className="section-title">Selecciona el Tipo de Incidente</h3>
        <div className="incident-types">
          {incidentTypes.map((type) => (
            <div
              key={type.key}
              className={`incident-type-card ${selectedType === type.key ? "active" : ""}`}
              onClick={() => setSelectedType(type.key)}
            >
              <span className="icon">{type.icon}</span>
              <strong>{type.title}</strong>
              <span className="desc">{type.description}</span>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <h3 className="section-title">Detalles del Incidente</h3>
        <div className="incident-details">
          <label>Ubicación del Incidente</label>
          <div className="location-box">
            <span className="icon-location">📍</span>
            <span>{location}</span>
          </div>

          <label>Descripción del problema *</label>
          <textarea
            className="input"
            rows={2}
            placeholder="Describe el problema"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="row">
            <div className="col">
              <label>Nivel de Severidad *</label>
              <select className="input" value={urgency} onChange={e => setUrgency(e.target.value)}>
                <option value="Alto">Alto. Requiere atención inmediata</option>
                <option value="Medio">Medio</option>
                <option value="Bajo">Bajo</option>
              </select>
            </div>
            <div className="col">
              <label>¿Cuándo ocurrió?</label>
              <input
                className="input"
                value={when}
                onChange={e => setWhen(e.target.value)}
                type="text"
              />
            </div>
          </div>

          <label>Evidencia Fotográfica</label>
          <div className="file-upload">
            <input type="file" id="file" onChange={handleFileChange} />
            <label htmlFor="file">
              <span role="img" aria-label="upload">📷</span>
              {file ? file.name : "Arrastra fotos o haz click para seleccionar"}
            </label>
          </div>
        </div>
      </section>

      <section>
        <h3 className="section-title">Información de Contacto para Seguimiento</h3>
        <div className="contact-info">
          <label>Email *</label>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} />

          <label>Teléfono (Opcional)</label>
          <input className="input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div className="checkbox">
          <input type="checkbox" id="notify" defaultChecked />
          <label htmlFor="notify">Notificarme el estado del reporte</label>
        </div>
      </section>

      <section>
        <h3 className="section-title">Resumen del Reporte</h3>
        <div className="summary-box">
          <div>
            <strong>Tipo de Incidente:</strong> {incidentTypes.find(x=>x.key === selectedType).title}
          </div>
          <div>
            <strong>Ubicación:</strong> {location}
          </div>
          <div>
            <strong>Nivel de Severidad:</strong> {urgency}
          </div>
          <div>
            <strong>Descripción:</strong> {description || "(No ingresada)"}
          </div>
        </div>
      </section>

      <div className="incident-footer">
        <button className="cancel-btn">Cancelar</button>
        <button className="send-btn">Enviar Reporte</button>
      </div>
      </div>
    </div>
  );
}
