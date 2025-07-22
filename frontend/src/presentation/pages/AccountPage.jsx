import React, { useState } from 'react';
import UserProfile from '../components/UserProfile';
import EditProfileForm from '../components/EditProfileForm';
import RecycleHistory from '../components/RecycleHistory';
import Navbar from '../components/Navbar';
import '../styles/AccountPage.css';
import '../styles/Dashboard.css';

export default function AccountPage() {
  const [showEditProfile, setShowEditProfile] = useState(false);

  return (
    <div className="dashboard-root">
      <Navbar />
      <div className="dashboard-content">
        <UserProfile onEdit={() => setShowEditProfile(true)} />
        <RecycleHistory />
        {showEditProfile && (
          <div className="editprofile-modal-backdrop">
            <div className="editprofile-modal">
              <EditProfileForm onClose={() => setShowEditProfile(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}