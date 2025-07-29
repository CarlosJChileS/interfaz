import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaRecycle,
  FaGift,
  FaMapMarkerAlt,
  FaSearch,
  FaBell,
  FaQuestionCircle,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";
import { supabase } from "../../utils/supabase";
import { useLang } from "../../LanguageContext";
import { useTheme } from "../../ThemeContext";
import NotificationModal from "../components/NotificationModal";
import { useTranslation } from "react-i18next";
import "../styles/Dashboard.css";

// Función para normalizar cadenas (tildes, case, etc)
function normalize(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function Dashboard() {
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
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        setUserName(meta.nombre || user.email);

        // CONSULTAS por auth_id en vez de usuario_id
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

        // ACTIVIDAD RECIENTE
        // Reciclaje por auth_id
        const { data: recycling } = await supabase
          .from('solicitud_recoleccion')
          .select('id, tipo_residuo, fecha, direccion, estado')
          .eq('auth_id', user.id)
          .order('fecha', { ascending: false })
          .limit(5);

        // Canje de recompensas por auth_id
        const { data: rewards } = await supabase
          .from('canje_recompensa')
          .select('id, recompensa_id, fecha, estado, recompensa(nombre, puntos_necesarios)')
          .eq('auth_id', user.id)
          .order('fecha', { ascending: false })
          .limit(5);

        const formatted = [
          ...(recycling || []).map(r => ({
            type: 'recycling',
            id: r.id,
            title: `${t('dashboard_recycled')} ${r.tipo_residuo}`,
            desc: `${t('dashboard_address')}: ${r.direccion} · ${t('dashboard_status')}: ${r.estado}`,
            date: r.fecha,
            points: '+50', // Personaliza según tu lógica
          })),
          ...(rewards || []).map(r => ({
            type: 'reward',
            id: r.id,
            title: `${t('dashboard_redeemed')}: ${r.recompensa?.nombre || 'Recompensa'}`,
            desc: `${t('dashboard_cost')}: ${r.recompensa?.puntos_necesarios || ''} pts · ${t('dashboard_status')}: ${r.estado}`,
            date: r.fecha,
            points: `-${r.recompensa?.puntos_necesarios || ''}`,
          }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

        setRecentActivities(formatted);
      }
    }
    loadData();
  }, []);

  // Secciones con ícono y descripción para la barra de búsqueda
  const sections = [
    {
      label: 'mapa',
      name: t('dashboard_map'),
      path: '/puntos',
      keywords: ['mapa', 'map', 'puntos', 'mapa interactivo'],
      desc: t('navbar_search_desc_map'),
      icon: <FaMapMarkerAlt />
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
      icon: <FaGift />
    },
    {
      label: 'ayuda',
      name: t('dashboard_help'),
      path: '/ayuda',
      keywords: ['ayuda', 'help', 'soporte', 'contacto'],
      desc: t('navbar_search_desc_help'),
      icon: <FaQuestionCircle />
    },
    {
      label: 'reportes',
      name: t('dashboard_reports'),
      path: '/reportes',
      keywords: ['reportes', 'reports', 'problemas'],
      desc: t('navbar_search_desc_reports'),
      icon: <FaExclamationTriangle />
    }
  ];

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
  }, [search, lang]);

  return (
    <div className="dashboard-root">
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
                  <li className="no-results">{t('dashboard_search_no_results')}</li>
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
            title={t('dashboard_notifications')}
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
              <Link to="/perfil">{t('dashboard_my_profile')}</Link>
            </div>
          )}
        </div>
      </nav>
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>{t('dashboard_welcome_hello')} {userName}! <span>👋</span></h2>
          <div className="dashboard-progress-bar">
            <span>{t('dashboard_recycled_month')} 8.5 {t('dashboard_recycled_month_kg')}</span>
            <div className="bar">
              <div className="bar-filled" style={{ width: "80%" }} />
            </div>
            <small>{t('dashboard_top_students')}</small>
          </div>
        </div>
        <div className="dashboard-main-panels">
          <div className="dashboard-panel clean-points">
            <div className="panel-header">
              <span>{t('dashboard_clean_points')}</span>
              <span className="badge">12 {t('dashboard_clean_points_nearby')}</span>
            </div>
            <p>{t('dashboard_clean_points_desc')}</p>
            <Link className="blue-btn" to="/puntos">
              <FaMapMarkerAlt /> {t('dashboard_interactive_map')}
            </Link>
          </div>
          <div className="dashboard-panel register">
            <div className="panel-header">
              <span>{t('dashboard_register_recycling')}</span>
            </div>
            <p>{t('dashboard_register_desc')}</p>
            <Link className="green-btn" to="/registrar">
              <FaRecycle /> {t('dashboard_register_btn')}
            </Link>
          </div>
          <div className="dashboard-panel rewards">
            <div className="panel-header">
              <span>{t('dashboard_rewards')}</span>
              <span className="badge orange">23 {t('dashboard_rewards_available')}</span>
            </div>
            <p>{t('dashboard_rewards_desc')}</p>
            <Link className="orange-btn" to="/recompensas">
              <FaGift /> {t('dashboard_explore_rewards')}
            </Link>
          </div>
        </div>
        <div className="dashboard-main-panels">
          <div className="dashboard-panel help">
            <div className="panel-header">
              <span>{t('dashboard_help')}</span>
            </div>
            <p>{t('dashboard_help_desc')}</p>
            <Link className="blue-btn" to="/ayuda">
              <FaQuestionCircle /> {t('dashboard_help_btn')}
            </Link>
          </div>
          <div className="dashboard-panel reports">
            <div className="panel-header">
              <span>{t('dashboard_reports')}</span>
            </div>
            <p>{t('dashboard_reports_desc')}</p>
            <Link className="green-btn" to="/reportes">
              <FaExclamationTriangle /> {t('dashboard_reports_btn')}
            </Link>
          </div>
          <div className="dashboard-panel upcoming">
            <div className="panel-header">
              <span>{t('dashboard_coming_soon')}</span>
            </div>
            <p>{t('dashboard_coming_soon_desc')}</p>
            <div className="orange-btn" style={{ pointerEvents: 'none', opacity: 0.6 }}>
              <FaClock /> {t('dashboard_coming_soon')}
            </div>
          </div>
        </div>
        <div className="dashboard-activity">
          <h3>{t('dashboard_recent_activity_title')}</h3>
          <ul>
            {recentActivities.length === 0 && (
              <li>{t('dashboard_activity_empty')}</li>
            )}
            {recentActivities.map(act => (
              <li key={`${act.type}-${act.id}`}>
                <span className={`activity-icon ${act.type === 'recycling' ? 'success' : 'reward'}`}>
                  {act.type === 'recycling' ? '✔️' : '🎁'}
                </span>
                <div>
                  <strong>{act.title}</strong><br />
                  <span>{act.desc}</span>
                </div>
                <span className={act.type === 'recycling' ? "points-pos" : "points-neg"}>
                  {act.points} pts
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="dashboard-stats">
          <div className="stat green">
            <span className="stat-title">#47</span>
            <span className="stat-desc">{t('dashboard_ranking')} 2,847 {t('dashboard_ranking_students')}</span>
          </div>
          <div className="stat blue">
            <span className="stat-title">Top 15%</span>
            <span className="stat-desc">{t('dashboard_this_week')}</span>
          </div>
          <div className="stat orange">
            <span className="stat-title">Eco Warrior</span>
            <span className="stat-desc">{t('dashboard_achievement_unlocked')}</span>
          </div>
          <div className="stat pink">
            <span className="stat-title">2.8 kg</span>
            <span className="stat-desc">{t('dashboard_next_level')}</span>
          </div>
        </div>
      </div>
      {showNotif && (
        <NotificationModal
          onClose={() => {
            setShowNotif(false);
            setAlertCount(0);
          }}
        />
      )}
    </div>
  );
}