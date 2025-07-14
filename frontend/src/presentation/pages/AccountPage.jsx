import React from 'react';
import UserProfile from '../components/UserProfile';
import EditProfileForm from '../components/EditProfileForm';
import RecycleHistory from '../components/RecycleHistory';
import '../styles/AccountPage.css';

export default function AccountPage() {
  return (
    <div className="account-bg">
      <div className="account-section">
        <UserProfile />
      </div>
      <div className="account-section">
        <EditProfileForm />
      </div>
      <div className="account-section">
        <RecycleHistory />
      </div>
    </div>
  );
}
