import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaRecycle,
  FaSearch,
  FaBell,
} from 'react-icons/fa';
import { supabase } from '../../utils/supabase';
import { useLang } from '../../LanguageContext';
import { useTranslation } from 'react-i18next';
import NotificationModal from './NotificationModal';

// Función para normalizar cadenas (tildes, case, etc)
function normalize(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [points, setPoints] = useState(0);
  const [userName, setUserName] = useState("");
  const [alertCount, setAlertCount] = useState(0);
  const { lang, toggleLang } = useLang();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        setUserName(meta.nombre || user.email);

        // Perfil
        const { data } = await supabase
          .from("perfil")
          .select("puntos")
          .eq("auth_id", user.id)
          .single();
        if (data && typeof data.puntos === "number") setPoints(data.puntos);

        // ALERTAS por auth_id
        const { data: alerts } = await supabase
          .from("alertas")
          .select("id")
          .eq("auth_id", user.id)
          .is("leido", false);
        if (alerts) setAlertCount(alerts.length);
      }
    }
    loadData();
  }, []);

  // Secciones con ícono y descripción para la barra de búsqueda
  const sections = useMemo(() => [
    {
      label: 'mapa',
      name: t('dashboard_map'),
      path: '/puntos',
      keywords: ['mapa', 'map', 'puntos', 'mapa interactivo'],
      desc: t('navbar_search_desc_map'),
      icon: <FaRecycle />
    },
    {
      label: 'registrar',
      name: t('dashboard_register'),
      path: '/registrar',
      keywords: ['registrar', 'registro', 'reciclaje'],
      desc: t('navbar_search_desc_register'),
      icon: <FaRecycle />
    },
    {
      label: 'recompensas',
      name: t('dashboard_rewards'),
      path: '/recompensas',
      keywords: ['recompensas', 'rewards', 'premios'],
      desc: t('navbar_search_desc_rewards'),
      icon: <FaRecycle />
    },
    {
      label: 'ayuda',
      name: t('dashboard_help'),
      path: '/ayuda',
      keywords: ['ayuda', 'help', 'soporte', 'contacto'],
      desc: t('navbar_search_desc_help'),
      icon: <FaRecycle />
    },
    {
      label: 'reportes',
      name: t('dashboard_reports'),
      path: '/reportes',
      keywords: ['reportes', 'reports', 'problemas'],
      desc: t('navbar_search_desc_reports'),
      icon: <FaRecycle />
    }
  ], [t]);

  useEffect(() => {
    const query = normalize(search.trim());
    if (!query) {
      setResults([]);
      return;
    }
    const filtered = sections.filter(s =>
      normalize(s.label).includes(query) ||
      normalize(s.name).includes(query) ||
      s.keywords.some(k => normalize(k).includes(query))
    );
    setResults(filtered);
  }, [search, lang, sections]);

  return (
    <>
      <nav className="dashboard-navbar">
        <div className="navbar-left">
          <div className="dashboard-logo"><FaRecycle /> EcoGestor</div>
          <ul className="dashboard-links">
            <li tabIndex="0">
              <button className="link-btn" onClick={() => navigate('/puntos')}>
                {t('dashboard_map')}
              </button>
            </li>
            <li tabIndex="0">
              <button className="link-btn" onClick={() => navigate('/registrar')}>
                {t('dashboard_register')}
              </button>
            </li>
            <li tabIndex="0">
              <button className="link-btn" onClick={() => navigate('/recompensas')}>
                {t('dashboard_rewards')}
              </button>
            </li>
            <li tabIndex="0">
              <button className="link-btn" onClick={() => navigate('/ayuda')}>
                {t('dashboard_help')}
              </button>
            </li>
            <li tabIndex="0">
              <button className="link-btn" onClick={() => navigate('/reportes')}>
                {t('dashboard_reports')}
              </button>
            </li>
          </ul>
        </div>
        <div className="navbar-center">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('search_placeholder')}
            />
            {search.trim() && (
              <ul className="search-results">
                {results.length === 0 && (
                  <li className="no-results">No hay resultados</li>
                )}
                {results.map(r => (
                  <li key={r.path} onMouseDown={() => navigate(r.path)}>
                    <span className="result-icon">{r.icon}</span>
                    <span className="result-main">
                      <strong>{r.name}</strong>
                      <br />
                      <small>{r.desc}</small>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="navbar-right">
          <button onClick={toggleLang} className="lang-btn">
            {t('lang_button')}
          </button>
          <span className="dashboard-points">{points} pts</span>
          <span
            className="notif-bell"
            title="Notificaciones"
            onClick={() => setShowNotif(true)}
          >
            <FaBell />
            {alertCount > 0 && (
              <span className="notif-count">{alertCount}</span>
            )}
          </span>
          <span
            className="dashboard-avatar"
            onClick={() => setShowMenu(m => !m)}
            onKeyDown={e => e.key === 'Enter' && setShowMenu(m => !m)}
            tabIndex="0"
            style={{ cursor: 'pointer' }}
          >
            {userName
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map(n => n[0])
              .join('')}
          </span>
          {showMenu && (
            <div className="avatar-menu">
              <Link to="/perfil">Mi Perfil</Link>
            </div>
          )}
        </div>
      </nav>
      {showNotif && (
        <NotificationModal
          onClose={() => {
            setShowNotif(false);
            setAlertCount(0);
          }}
        />
      )}
    </>
  );
}
