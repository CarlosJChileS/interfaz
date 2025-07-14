import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaRecycle,
  FaGift,
  FaMapMarkerAlt,
  FaBell,
  FaQuestionCircle,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";
import { supabase } from "../../utils/supabase";
import { useLang } from "../../LanguageContext";
import { useTranslation } from "react-i18next";
import "../styles/Dashboard.css";


export default function Dashboard() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [points, setPoints] = useState(0);
  const [userName, setUserName] = useState("");
  const [alertCount, setAlertCount] = useState(0);
  const { lang, toggleLang } = useLang();
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        setUserName(meta.nombre || user.email);
        const { data } = await supabase
          .from("perfil")
          .select("puntos")
          .eq("usuario_id", user.id)
          .single();
        if (data && data.puntos) setPoints(data.puntos);

        const { data: alerts } = await supabase
          .from("alertas")
          .select("id")
          .eq("usuario_id", user.id)
          .is("leido", false);
        if (alerts) setAlertCount(alerts.length);
      }
    }
    loadData();
  }, []);

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
          <input
            type="text"
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('search_placeholder')}
          />
        </div>
        <div className="navbar-right">
          <button onClick={toggleLang} className="lang-btn">
            {t('lang_button')}
          </button>
          <span className="dashboard-points">{points} pts</span>
          <span className="notif-bell" title="Notificaciones">
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
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>¡Hola {userName}! <span>👋</span></h2>
          <div className="dashboard-progress-bar">
            <span>Has reciclado 8.5 kg este mes</span>
            <div className="bar">
              <div className="bar-filled" style={{ width: "80%" }} />
            </div>
            <small>¡Estás en el top 10% de estudiantes más activos!</small>
          </div>
        </div>
        <div className="dashboard-main-panels">
          <div className="dashboard-panel clean-points">
            <div className="panel-header">
              <span>Puntos Limpios</span>
              <span className="badge">12 cercanos</span>
            </div>
            <p>Encuentra los puntos de reciclaje más cercanos a tu ubicación en el campus universitario</p>
            <Link className="blue-btn" to="/puntos">
              <FaMapMarkerAlt /> Mapa Interactivo
            </Link>
          </div>
          <div className="dashboard-panel register">
            <div className="panel-header">
              <span>Registrar Reciclaje</span>
            </div>
            <p>Registra los materiales reciclados para sumar puntos a tu cuenta</p>
            <Link className="green-btn" to="/registrar">
              <FaRecycle /> Registrar
            </Link>
          </div>
          <div className="dashboard-panel rewards">
            <div className="panel-header">
              <span>Recompensas</span>
              <span className="badge orange">23 disponibles</span>
            </div>
            <p>Canjea tus puntos por descuentos en cafeterías, papelería, libros y productos sostenibles</p>
          <Link className="orange-btn" to="/recompensas">
            <FaGift /> Explorar Premios
          </Link>
        </div>
        </div>

        <div className="dashboard-main-panels">
          <div className="dashboard-panel help">
            <div className="panel-header">
              <span>Ayuda</span>
            </div>
            <p>Accede al centro de ayuda para resolver dudas sobre la plataforma</p>
            <Link className="blue-btn" to="/ayuda">
              <FaQuestionCircle /> Ver Ayuda
            </Link>
          </div>
          <div className="dashboard-panel reports">
            <div className="panel-header">
              <span>Reportes</span>
            </div>
            <p>Envía reportes o revisa problemas comunicados por la comunidad</p>
            <Link className="green-btn" to="/reportes">
              <FaExclamationTriangle /> Ir a Reportes
            </Link>
          </div>
          <div className="dashboard-panel upcoming">
            <div className="panel-header">
              <span>Próximamente</span>
            </div>
            <p>Estamos trabajando en nuevas funcionalidades que verás pronto</p>
            <div className="orange-btn" style={{ pointerEvents: 'none', opacity: 0.6 }}>
              <FaClock /> Próximamente
            </div>
          </div>
        </div>

        <div className="dashboard-activity">
          <h3>Tu Actividad Reciente</h3>
          <ul>
            <li>
              <span className="activity-icon success">✔️</span>
              <div>
                <strong>Reciclaste papel y cartón</strong><br />
                <span>Punto limpio: Biblioteca Central - Hace 2 horas</span>
              </div>
              <span className="points-pos">+50 pts</span>
            </li>
            <li>
              <span className="activity-icon reward">🎁</span>
              <div>
                <strong>Canjeaste: Descuento 20% Cafetería</strong><br />
                <span>Costo: 200 puntos · Ayer</span>
              </div>
              <span className="points-neg">-200 pts</span>
            </li>
          </ul>
        </div>
        <div className="dashboard-stats">
          <div className="stat green">
            <span className="stat-title">#47</span>
            <span className="stat-desc">de 2,847 estudiantes</span>
          </div>
          <div className="stat blue">
            <span className="stat-title">Top 15%</span>
            <span className="stat-desc">Esta semana</span>
          </div>
          <div className="stat orange">
            <span className="stat-title">Eco Warrior</span>
            <span className="stat-desc">Logro desbloqueado</span>
          </div>
          <div className="stat pink">
            <span className="stat-title">2.8 kg</span>
            <span className="stat-desc">Para siguiente nivel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
