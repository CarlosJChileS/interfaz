import React, { useState } from "react";
import "../styles/HelpCenter.css";

const faqList = [
  {
    question: "¿Cómo registro que deposité material reciclable?",
    answer:
      "Para registrar tu reciclaje, ve a la sección 'Registrar Reciclaje', selecciona el punto limpio donde depositaste el material, elige el tipo y cantidad de material, y confirma el registro. Automáticamente se sumarán los puntos a tu cuenta.",
  },
  {
    question: "¿Cómo puedo canjear mis puntos por recompensas?",
    answer: "",
  },
  {
    question: "¿Qué tipos de materiales puedo reciclar?",
    answer: "",
  },
  {
    question: "¿Cómo encuentro el punto limpio más cercano?",
    answer: "",
  },
  {
    question: "¿Qué hago si un punto limpio está lleno?",
    answer: "",
  },
];

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="help-center-bg">
      <div className="help-center-container">
        {/* Header */}
        <header className="help-header">
          <div className="help-header__left">
            <span className="help-header__icon">📘</span>
            <span className="help-header__title">
              Centro de Ayuda y Contacto
            </span>
          </div>
          <div className="help-header__right">
            <input
              type="text"
              className="help-search"
              placeholder="🔍 Buscar en ayuda..."
            />
          </div>
        </header>

        <main>
          <h2 className="help-title">¿Cómo podemos ayudarte?</h2>
          <div className="help-cards">
            <div className="help-card faq">
              <div className="help-card__icon">📄</div>
              <div className="help-card__text">
                <div className="help-card__title">Preguntas Frecuentes</div>
                <div className="help-card__desc">
                  Encuentra respuestas rápidas a las dudas más comunes
                </div>
              </div>
            </div>
            <div className="help-card contact">
              <div className="help-card__icon">📞</div>
              <div className="help-card__text">
                <div className="help-card__title">Contacto Directo</div>
                <div className="help-card__desc">
                  Habla directamente con nuestro equipo de soporte
                </div>
              </div>
              <button className="help-card__button contact">Contactar</button>
            </div>
            <div className="help-card report">
              <div className="help-card__icon">⚠️</div>
              <div className="help-card__text">
                <div className="help-card__title">Reportar Problema</div>
                <div className="help-card__desc">
                  Informa sobre problemas técnicos o incidentes
                </div>
              </div>
              <button className="help-card__button report">Reportar</button>
            </div>
            <div className="help-card guides">
              <div className="help-card__icon">📚</div>
              <div className="help-card__text">
                <div className="help-card__title">Guías y Tutoriales</div>
                <div className="help-card__desc">
                  Aprende a usar todas las funciones de la plataforma
                </div>
              </div>
              <button className="help-card__button guides">Ver Guías</button>
            </div>
          </div>

          {/* Preguntas frecuentes */}
          <div className="help-faq-section">
            <h3 className="help-faq-title">Preguntas Frecuentes</h3>
            <div className="help-faq-list">
              {faqList.map((faq, idx) => (
                <div
                  className={`help-faq-item ${openFaq === idx ? "open" : ""}`}
                  key={faq.question}
                >
                  <button
                    className="help-faq-question"
                    onClick={() => setOpenFaq(idx === openFaq ? -1 : idx)}
                  >
                    {faq.question}
                    <span className="help-faq-arrow">
                      {openFaq === idx ? "▲" : "▼"}
                    </span>
                  </button>
                  {openFaq === idx && faq.answer && (
                    <div className="help-faq-answer">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Formulario y contacto */}
          <div className="help-form-contact-row">
            {/* Formulario de Contacto */}
            <section className="help-form">
              <h3>Formulario de Contacto</h3>
              <form>
                <label>
                  Asunto *
                  <select>
                    <option>Problema técnico</option>
                    <option>Consulta general</option>
                    <option>Otro</option>
                  </select>
                </label>
                <label>
                  Nombre Completo *
                  <input type="text" value="Ana María González" required />
                </label>
                <label>
                  Correo Electrónico *
                  <input
                    type="email"
                    value="ana.gonzalez@unal.edu.co"
                    required
                  />
                </label>
                <label>
                  Mensaje *
                  <textarea
                    rows={3}
                    placeholder="Describe tu consulta o problema de manera detallada..."
                    required
                  ></textarea>
                </label>
                <div className="help-form-actions">
                  <label className="help-form-upload">
                    <span>📎 Adjuntar archivo</span>
                    <input type="file" style={{ display: "none" }} />
                    <span className="help-form-upload-hint">
                      Opcional: capturas de pantalla, documentos
                    </span>
                  </label>
                  <button type="button" className="help-form-clear">
                    Limpiar
                  </button>
                  <button type="submit" className="help-form-submit">
                    Enviar Mensaje
                  </button>
                </div>
              </form>
            </section>
            {/* Información de Contacto */}
            <section className="help-contact">
              <h3>Información de Contacto</h3>
              <div className="help-contact-hours">
                <b className="help-contact-hours-title">
                  <span>⏰</span> Horarios de Atención
                </b>
                <div className="help-contact-hours-table">
                  <div>
                    Lunes a Viernes: <b>8:00 AM - 6:00 PM</b>
                  </div>
                  <div>
                    Sábados: <b>9:00 AM - 2:00 PM</b>
                  </div>
                  <div className="help-contact-hours-closed">
                    Domingos: <b>Cerrado</b>
                  </div>
                </div>
              </div>
              <div className="help-contact-data">
                <div>
                  <b>Correo Electrónico</b>
                  <div className="help-contact-link">
                    soporte@ecogestor.unal.edu.co
                  </div>
                </div>
                <div>
                  <b>Teléfono de Soporte</b>
                  <div>+57 (1) 316-5000 Ext. 12345</div>
                </div>
                <div>
                  <b>Oficina de Sostenibilidad</b>
                  <div>Edificio de Bienestar, Oficina 201</div>
                </div>
              </div>
              <div className="help-contact-socials">
                <b>Síguenos en Redes Sociales</b>
                <div className="help-contact-social-icons">
                  <span className="help-social-icon" style={{ color: "#1877F3" }}>📘</span>
                  <span className="help-social-icon" style={{ color: "#E1306C" }}>📸</span>
                  <span className="help-social-icon" style={{ color: "#08C9F8" }}>🐦</span>
                  <span className="help-social-icon" style={{ color: "#25D366" }}>💬</span>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

