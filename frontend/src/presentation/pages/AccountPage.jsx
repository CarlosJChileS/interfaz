import React, { useState } from 'react';
import UserProfile from '../components/UserProfile';
import EditProfileForm from '../components/EditProfileForm';
import RecycleHistory from '../components/RecycleHistory';
import '../styles/AccountPage.css';

export default function AccountPage() {
  const [showEditProfile, setShowEditProfile] = useState(false);

  return (
    <div className="account-bg">
      <div className="account-section">
        <UserProfile onEdit={() => setShowEditProfile(true)} />
      </div>
      <div className="account-section">
        <RecycleHistory />
      </div>
      {showEditProfile && (
        <div className="editprofile-modal-backdrop">
          <div className="editprofile-modal">
            <EditProfileForm onClose={() => setShowEditProfile(false)} />
          </div>
        </div>
      )}
    </div>
  );
}