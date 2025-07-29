import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {
  FaBook,
  FaSearch,
  FaQuestionCircle,
  FaPhone,
  FaPaperclip,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import "../styles/HelpCenter.css";

export default function HelpCenter() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const navigate = useNavigate();

  const faqList = [
    {
      question: t('help_faq_q1'),
      answer: t('help_faq_a1'),
    },
    {
      question: t('help_faq_q2'),
      answer: t('help_faq_a2'),
    },
    {
      question: t('help_faq_q3'),
      answer: t('help_faq_a3'),
    },
    {
      question: t('help_faq_q4'),
      answer: t('help_faq_a4'),
    },
    {
      question: t('help_faq_q5'),
      answer: t('help_faq_a5'),
    },
  ];

  return (
    <div className="help-center-bg">
      <div className="help-center-container">
        {/* Header */}
        <header className="help-header">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
            aria-label={t('common_back')}
          >
            ←
          </button>
          <div className="help-header__left">
            <FaBook className="help-header__icon" />
            <span className="help-header__title">
              {t('help_center_title')}
            </span>
          </div>
          <div className="help-header__right">
            <div className="help-search-wrapper">
              <FaSearch className="help-search-icon" />
              <input
                type="text"
                className="help-search"
                placeholder={t('help_search_placeholder')}
              />
            </div>
          </div>
        </header>

        <main>
          <h2 className="help-title">{t('help_question')}</h2>
          <div className="help-cards">
            <div className="help-card faq">
              <FaQuestionCircle className="help-card__icon" />
              <div className="help-card__text">
                <div className="help-card__title">{t('help_faq_title')}</div>
                <div className="help-card__desc">
                  {t('help_faq_description')}
                </div>
              </div>
            </div>
            <div className="help-card contact">
              <FaPhone className="help-card__icon" />
              <div className="help-card__text">
                <div className="help-card__title">{t('help_contact_title')}</div>
                <div className="help-card__desc">
                  {t('help_contact_description')}
                </div>
              </div>
              <button
                className="help-card__button contact"
                onClick={() => setShowContactInfo(!showContactInfo)}
              >
                {t('help_contact_button')}
              </button>
              {showContactInfo && (
                <div className="help-card-contact-info">
                  <div>soporte@ecogestor.unal.edu.co</div>
                  <div>+57 (1) 316-5000 Ext. 12345</div>
                </div>
              )}
            </div>
          </div>

          {/* Preguntas frecuentes */}
          <div className="help-faq-section">
            <h3 className="help-faq-title">{t('help_faq_title')}</h3>
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
                      {openFaq === idx ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
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
              <h3>{t('help_form_title')}</h3>
              <form>
                <label>
                  {t('help_form_subject')} *
                  <select>
                    <option>{t('help_form_subject_technical')}</option>
                    <option>{t('help_form_subject_general')}</option>
                    <option>{t('help_form_subject_other')}</option>
                  </select>
                </label>
                <label>
                  {t('help_form_name')} *
                  <input type="text" value="Ana María González" required />
                </label>
                <label>
                  {t('help_form_email')} *
                  <input
                    type="email"
                    value="ana.gonzalez@unal.edu.co"
                    required
                  />
                </label>
                <label>
                  {t('help_form_message')} *
                  <textarea
                    rows={3}
                    placeholder={t('help_form_message_placeholder')}
                    required
                  ></textarea>
                </label>
                <div className="help-form-actions">
                  <label className="help-form-upload">
                    <span><FaPaperclip /> {t('help_form_attach')}</span>
                    <input type="file" style={{ display: "none" }} />
                    <span className="help-form-upload-hint">
                      {t('help_form_attach_hint')}
                    </span>
                  </label>
                  <button type="button" className="help-form-clear">
                    {t('help_form_clear')}
                  </button>
                  <button type="submit" className="help-form-submit">
                    {t('help_form_send')}
                  </button>
                </div>
              </form>
            </section>
            {/* Información de Contacto */}
            <section className="help-contact">
              <h3>{t('help_contact_info_title')}</h3>
              <div className="help-contact-hours">
                <b className="help-contact-hours-title">
                  <FaClock /> {t('help_contact_hours')}
                </b>
                <div className="help-contact-hours-table">
                  <div>
                    {t('help_contact_weekdays')}: <b>8:00 AM - 6:00 PM</b>
                  </div>
                  <div>
                    {t('help_contact_saturday')}: <b>9:00 AM - 2:00 PM</b>
                  </div>
                  <div className="help-contact-hours-closed">
                    {t('help_contact_sunday')}: <b>{t('help_contact_closed')}</b>
                  </div>
                </div>
              </div>
              <div className="help-contact-data">
                <div>
                  <b>{t('help_contact_email_label')}</b>
                  <div className="help-contact-link">
                    soporte@ecogestor.unal.edu.co
                  </div>
                </div>
                <div>
                  <b>{t('help_contact_phone_label')}</b>
                  <div>+57 (1) 316-5000 Ext. 12345</div>
                </div>
                <div>
                  <b>{t('help_contact_office_label')}</b>
                  <div>{t('help_contact_office_location')}</div>
                </div>
              </div>
              <div className="help-contact-socials">
                <b>{t('help_contact_social_label')}</b>
                <div className="help-contact-social-icons">
                  <FaFacebook className="help-social-icon" style={{ color: "#1877F3" }} />
                  <FaInstagram className="help-social-icon" style={{ color: "#E1306C" }} />
                  <FaTwitter className="help-social-icon" style={{ color: "#08C9F8" }} />
                  <FaWhatsapp className="help-social-icon" style={{ color: "#25D366" }} />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

