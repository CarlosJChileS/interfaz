import React, { useState } from "react";
import ReportConfirmModal from "../components/ReportConfirmModal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../../utils/supabase";
import LanguageToggle from "../components/LanguageToggle";
import "../styles/Reportes.css";

export default function Reportes() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const incidentTypes = [
    {
      key: "damaged",
      title: t('reports_damaged'),
      description: t('reports_damaged_desc'),
      icon: "🛑",
      active: true,
    },
    {
      key: "technical",
      title: t('reports_technical'),
      description: t('reports_technical_desc'),
      icon: "🛠️",
      active: false,
    },
    {
      key: "full",
      title: t('reports_full'),
      description: t('reports_full_desc'),
      icon: "♻️",
      active: false,
    },
    {
      key: "security",
      title: t('reports_security'),
      description: t('reports_security_desc'),
      icon: "⚠️",
      active: false,
    },
  ];

  const [selectedType, setSelectedType] = useState("damaged");
  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useState("Biblioteca Central");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState(t('reports_urgency_high'));
  const [when, setWhen] = useState("Hace 2 horas (14:30 PM)");
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("gsa.problemas@uleam.edu.ec");
  const [phone, setPhone] = useState("+57 300 123 4567");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSend = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    // Obtiene el usuario actual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert(t('reports_error_user'));
      setShowConfirm(false);
      return;
    }

    // Inserta el reporte en la BD
    const { error: reportError } = await supabase
      .from("reporte")
      .insert({
        auth_id: user.id,
        tipo: incidentTypes.find(x => x.key === selectedType).title,
        descripcion: description,
        ubicacion: location,
        estado: "abierto",
        fecha: new Date().toISOString()
        // Puedes agregar otros campos como urgencia, email, phone, evidencia, etc.
      });

    // Inserta la acción en historial
    await supabase
      .from("historial")
      .insert({
        auth_id: user.id,
        accion: "Reporte de incidente",
        descripcion: `Reportaste: ${incidentTypes.find(x=>x.key === selectedType).title} en ${location}. Severidad: ${urgency}. Detalle: ${description}`,
        fecha: new Date().toISOString()
      });

    if (reportError) {
      alert(t('reports_error_submit'));
    } else {
      alert(t('reports_confirm_sent'));
      // Puedes limpiar el formulario aquí si lo deseas
      setDescription("");
      setFile(null);
    }
    setShowConfirm(false);
  };

  return (
    <div className="reportes-root">
      <LanguageToggle className="lang-toggle-bottom-left" />
      <header className="reportes-header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          aria-label={t('common_back')}
        >
          ←
        </button>
        <button className="urgent-btn">{t('reports_urgent_btn')}</button>
      </header>
      <div className="incident-container">
        <h2 className="incident-title">{t('reports_title')}</h2>
      
      <section>
        <h3 className="section-title">{t('reports_type')}</h3>
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
        <h3 className="section-title">{t('reports_incident_details')}</h3>
        <div className="incident-details">
          <label>{t('reports_location')}</label>
          <div className="location-box">
            <span className="icon-location">📍</span>
            <span>{location}</span>
          </div>

          <label>{t('reports_description')} *</label>
          <textarea
            className="input"
            rows={2}
            placeholder={t('reports_description_placeholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="row">
            <div className="col">
              <label>{t('reports_urgency')} *</label>
              <select className="input" value={urgency} onChange={e => setUrgency(e.target.value)}>
                <option value={t('reports_urgency_high')}>{t('reports_urgency_high')}{t('reports_urgency_high_desc')}</option>
                <option value={t('reports_urgency_medium')}>{t('reports_urgency_medium')}</option>
                <option value={t('reports_urgency_low')}>{t('reports_urgency_low')}</option>
              </select>
            </div>
            <div className="col">
              <label>{t('reports_when')}</label>
              <input
                className="input"
                value={when}
                onChange={e => setWhen(e.target.value)}
                type="text"
              />
            </div>
          </div>

          <label>{t('reports_evidence')}</label>
          <div className="file-upload">
            <input type="file" id="file" onChange={handleFileChange} />
            <label htmlFor="file">
              <span role="img" aria-label="upload">📷</span>
              {file ? file.name : t('reports_evidence_placeholder')}
            </label>
          </div>
        </div>
      </section>

      <section>
        <h3 className="section-title">{t('reports_contact_followup')}</h3>
        <div className="contact-info">
          <label>{t('reports_email')} *</label>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} />

          <label>{t('reports_phone')}</label>
          <input className="input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div className="checkbox">
          <input type="checkbox" id="notify" defaultChecked />
          <label htmlFor="notify">{t('reports_notify')}</label>
        </div>
      </section>

      <section>
        <h3 className="section-title">{t('reports_summary')}</h3>
        <div className="summary-box">
          <div>
            <strong>{t('reports_summary_type')}</strong> {incidentTypes.find(x=>x.key === selectedType).title}
          </div>
          <div>
            <strong>{t('reports_summary_location')}</strong> {location}
          </div>
          <div>
            <strong>{t('reports_summary_severity')}</strong> {urgency}
          </div>
          <div>
            <strong>{t('reports_summary_description')}</strong> {description || t('reports_summary_no_description')}
          </div>
        </div>
      </section>

      <div className="incident-footer">
        <button className="cancel-btn">{t('common_cancel')}</button>
        <button className="send-btn" onClick={handleSend}>{t('reports_submit')}</button>
      </div>
      </div>
      {showConfirm && (
        <ReportConfirmModal
          data={{
            type: incidentTypes.find((x) => x.key === selectedType).title,
            location,
            urgency,
            description,
          }}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}