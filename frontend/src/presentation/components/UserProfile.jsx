import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        setProfile({
          name: `${meta.nombre || ""} ${meta.apellidos || ""}`.trim(),
          email: user.email,
          telefono: meta.telefono,
          facultad: meta.facultad,
          programa: meta.programa,
        });
      }
    }
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="profile-bg">
        <div className="profile-container">
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <div className="profile-bg">
      <div className="profile-container">
        <div className="profile-header">
          <span className="profile-title">Mi Perfil</span>
          <div className="profile-actions">
            <button className="edit-btn" onClick={() => navigate('/editar-perfil')}>
              <span className="edit-icon">&#9998;</span> Editar Perfil
            </button>
            <span className="settings-icon">&#9881;</span>
          </div>
        </div>
        <div className="profile-content">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <h2 className="profile-name">{profile.name}</h2>
            <div className="profile-desc">
              {profile.programa}
              <br />
              <span className="profile-sem">{profile.facultad}</span>
            </div>
            <div className="profile-details">
              <div>
                <span className="profile-label">Correo Electrónico</span>
                <br />
                {profile.email}
              </div>
              <div style={{ marginTop: "10px" }}>
                <span className="profile-label">Teléfono</span>
                <br />
                {profile.telefono}
              </div>
              <div style={{ marginTop: "10px" }}>
                <span className="profile-label">Facultad</span>
                <br />
                {profile.facultad}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
