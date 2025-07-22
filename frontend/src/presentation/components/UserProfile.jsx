import React, { useEffect, useState } from "react";
import { FaEdit, FaCog } from "react-icons/fa";
import { supabase } from "../../utils/supabase";
import "../styles/UserProfile.css";

const UserProfile = ({ onEdit }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata || {};
        const { data: perfilData } = await supabase
          .from("perfil")
          .select("foto_url, puntos, preferencias, datos_extra")
          .eq("auth_id", user.id)
          .single();

        setProfile({
          name: `${meta.nombre || ""} ${meta.apellidos || ""}`.trim(),
          email: user.email,
          telefono: meta.telefono,
          foto_url: perfilData?.foto_url,
          puntos: perfilData?.puntos ?? 0,
          preferencias: perfilData?.preferencias,
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
            <button className="edit-btn" onClick={onEdit}>
              <FaEdit className="edit-icon" /> Editar Perfil
            </button>
            <FaCog className="settings-icon" />
          </div>
        </div>
        <div className="profile-content">
          <div className="profile-avatar">
            {profile.foto_url ? (
              <img src={profile.foto_url} alt={initials} className="profile-img" />
            ) : (
              initials
            )}
          </div>
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
              <div style={{ marginTop: "10px" }}>
                <span className="profile-label">Puntos</span>
                <br />
                <b>{profile.puntos}</b>
              </div>
            </div>
            {profile.preferencias && (
              <div style={{ marginTop: "10px" }}>
                <span className="profile-label">Preferencias</span>
                <br />
                <pre style={{ fontSize: "12px", background: "#f8f8f8", padding: "5px", borderRadius: "4px" }}>
                  {JSON.stringify(profile.preferencias, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;