import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRecycle, FaGift, FaMapMarkerAlt } from "react-icons/fa";
import { supabase } from "../../utils/supabase";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [showMenu, setShowMenu] = useState(false);
  const [points, setPoints] = useState(0);
  const [userName, setUserName] = useState("");
  const [search, setSearch] = useState("");

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
      }
    }
    loadData();
  }, []);

  const searchLower = search.toLowerCase();

  return (
    <div className="dashboard-root">
      <nav className="dashboard-navbar">
        <div className="dashboard-logo"><FaRecycle /> EcoGestor</div>
        <ul>
          <li><Link to="/puntos">Mapa</Link></li>
          <li><Link to="/recompensas">Recompensas</Link></li>
          <li><Link to="/">Inicio</Link></li>
        </ul>
        <div className="dashboard-userinfo">
          <span className="dashboard-points">{points} pts</span>
          <span
            className="dashboard-avatar"
            onClick={() => setShowMenu(m => !m)}
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
              <Link to="/historial">Historial</Link>
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
        <input
          className="dashboard-search"
          placeholder="Buscar secciones"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="dashboard-main-panels">
          {"puntos limpios".includes(searchLower) && (
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
          )}
          {"registrar reciclaje".includes(searchLower) && (
          <div className="dashboard-panel register">
            <div className="panel-header">
              <span>Registrar Reciclaje</span>
            </div>
            <p>Registra los materiales reciclados para sumar puntos a tu cuenta</p>
            <Link className="green-btn" to="/registrar">
              <FaRecycle /> Registrar
            </Link>
          </div>
          )}
          {"recompensas".includes(searchLower) && (
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
          )}
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
