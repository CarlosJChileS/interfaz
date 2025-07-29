import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRecycle, FaMapMarkerAlt, FaGift } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../ThemeContext";
import { useAuth } from "../../AuthContext";
import LanguageToggle from "../components/LanguageToggle";
import "../styles/Bienvenida.css";

export default function Bienvenida() {
  const { t } = useTranslation();
  const { dark } = useTheme();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleStartNow = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleCreateAccount = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };
  
  return (
    <div className={`bienvenida-container ${dark ? 'dark' : ''}`}>
      <LanguageToggle className="lang-toggle-bottom-left" />
      <div className="bienvenida-hero">
        <FaRecycle className="bienvenida-main-icon" />
        <h1>{t('welcome_title')}</h1>
        <p className="bienvenida-subtitle">{t('welcome_subtitle')}</p>
        <p className="bienvenida-desc">
          {t('welcome_desc')}
        </p>
        <div className="bienvenida-buttons">
          <button className="primary-btn" onClick={handleStartNow}>{t('welcome_start')}</button>
          <Link className="outline-btn" to="/puntos">{t('welcome_points')}</Link>
        </div>
      </div>
      <div className="bienvenida-steps-section">
        <h2>{t('how_it_works')}</h2>
        <p className="steps-desc">{t('steps_desc')}</p>
        <div className="bienvenida-steps">
          <div className="bienvenida-step">
            <FaMapMarkerAlt className="step-icon" />
            <h3>{t('step1_title')}</h3>
            <p>{t('step1_desc')}</p>
          </div>
          <div className="bienvenida-step">
            <FaRecycle className="step-icon" />
            <h3>{t('step2_title')}</h3>
            <p>{t('step2_desc')}</p>
          </div>
          <div className="bienvenida-step">
            <FaGift className="step-icon" />
            <h3>{t('step3_title')}</h3>
            <p>{t('step3_desc')}</p>
          </div>
        </div>
      </div>
      <div className="bienvenida-bottom">
        <h3>{t('ready')}</h3>
        <button className="green-btn" onClick={handleCreateAccount}>{t('create_account')}</button>
      </div>
    </div>
  );
}
