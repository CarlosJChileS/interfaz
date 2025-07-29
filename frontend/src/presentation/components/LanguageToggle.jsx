import React from 'react';
import { useLang } from '../../LanguageContext';
import { useTranslation } from 'react-i18next';
import './LanguageToggle.css';

export default function LanguageToggle({ className = '', style = {} }) {
  const { toggleLang } = useLang();
  const { t } = useTranslation();

  return (
    <button 
      onClick={toggleLang} 
      className={`lang-toggle-btn ${className}`}
      style={style}
      title={t('toggle_language', 'Cambiar idioma')}
    >
      {t('lang_button')}
    </button>
  );
}
