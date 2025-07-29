import React from "react";
import { FaEdit, FaCog } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useProfileContext } from "../../ProfileContext";
import "../styles/UserProfile.css";

const UserProfile = ({ onEdit }) => {
  const { t } = useTranslation();
  const { profile, loading } = useProfileContext();

  if (loading || !profile) {
    return (
      <div className="dashboard-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="panel-header">
          <span>{t('account_profile')}</span>
        </div>
        <p>{t('common_loading')}</p>
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
    <div className="dashboard-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="panel-header">
        <span>{t('account_profile')}</span>
        <div className="profile-actions">
          <button className="edit-btn" onClick={onEdit}>
            <FaEdit className="edit-icon" /> {t('account_edit')}
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
              <span className="profile-label">{t('account_email')}</span>
              <br />
              {profile.email}
            </div>
            <div style={{ marginTop: "10px" }}>
              <span className="profile-label">{t('account_phone')}</span>
              <br />
              {profile.telefono}
            </div>

            <div style={{ marginTop: "10px" }}>
              <span className="profile-label">{t('account_total_points')}</span>
              <br />
              <b style={{ color: "#2d9e51", fontSize: "1.2rem" }}>{profile.puntos}</b>
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
  );
};

export default UserProfile;