import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaRecycle,
  FaGift,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaExclamationTriangle,
  FaClock,
  FaPlus,
  FaEye,
} from "react-icons/fa";
import { supabase } from "../../utils/supabase";
import Navbar from "../components/Navbar";
import RewardSuggestionForm from "../components/RewardSuggestionForm";
import SuggestionsDrawer from "../components/SuggestionsDrawer";
import { useTranslation } from "react-i18next";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { t } = useTranslation();
  const [recentActivities, setRecentActivities] = useState([]);
  const [userName, setUserName] = useState("");
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [showSuggestionsDrawer, setShowSuggestionsDrawer] = useState(false);
  const [suggestionsCount, setSuggestionsCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        setUserName(meta.nombre || user.email);

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
    
    // Cargar conteo de sugerencias
    function loadSuggestionsCount() {
      const suggestions = JSON.parse(localStorage.getItem('rewardSuggestions') || '[]');
      setSuggestionsCount(suggestions.length);
    }
    
    loadData();
    loadSuggestionsCount();
  }, [t]);

  return (
    <div className="dashboard-root">
      <Navbar />
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
          <div className="dashboard-panel suggestions">
            <div className="panel-header">
              <span>{t('dashboard_suggestions')}</span>
              {suggestionsCount > 0 && (
                <span className="badge purple">{suggestionsCount}</span>
              )}
            </div>
            <p>¡Comparte tus ideas! Sugiere nuevas recompensas que te gustaría ver disponibles.</p>
            <div className="suggestions-actions">
              <button 
                className="purple-btn suggestion-btn"
                onClick={() => setShowSuggestionForm(true)}
              >
                <FaPlus /> {t('dashboard_suggest_reward')}
              </button>
              {suggestionsCount > 0 && (
                <button 
                  className="outline-btn suggestion-btn"
                  onClick={() => setShowSuggestionsDrawer(true)}
                >
                  <FaEye /> {t('dashboard_view_suggestions')}
                </button>
              )}
            </div>
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
      
      {/* Modales y Drawers */}
      <RewardSuggestionForm 
        isOpen={showSuggestionForm}
        onClose={() => {
          setShowSuggestionForm(false);
          // Actualizar conteo después de cerrar el formulario
          const suggestions = JSON.parse(localStorage.getItem('rewardSuggestions') || '[]');
          setSuggestionsCount(suggestions.length);
        }}
      />
      
      <SuggestionsDrawer 
        isOpen={showSuggestionsDrawer}
        onClose={() => setShowSuggestionsDrawer(false)}
      />
    </div>
  );
}