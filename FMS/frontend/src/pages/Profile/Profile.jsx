import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaBuilding, FaCalendarAlt, FaClock, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    // Clear token and user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Remove Authorization header
    delete axios.defaults.headers.common["Authorization"];
    
    // Dispatch an event to notify the app about authentication state change
    window.dispatchEvent(new Event('userLoggedOut'));
    
    // Redirect to home page
    navigate('/');
    
    // Force a page refresh to ensure the sidebar is re-rendered
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (isLoading) {
    return <div className="profile-page"><div className="loading">Loading profile...</div></div>;
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="error-message">
          User information not found. Please log out and log in again.
        </div>
      </div>
    );
  }

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="page-title">My Profile</h1>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
          <div className="profile-details">
            <h2 className="profile-name">{user.full_name}</h2>
            
            <div className="info-section">
              <div className="info-item">
                <div className="info-icon"><FaEnvelope /></div>
                <div className="info-content">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
              </div>
              
              {user.company && (
                <div className="info-item">
                  <div className="info-icon"><FaBuilding /></div>
                  <div className="info-content">
                    <span className="info-label">Company</span>
                    <span className="info-value">{user.company}</span>
                  </div>
                </div>
              )}
              
              {user.created_at && (
                <div className="info-item">
                  <div className="info-icon"><FaCalendarAlt /></div>
                  <div className="info-content">
                    <span className="info-label">Member Since</span>
                    <span className="info-value">{formatDate(user.created_at)}</span>
                  </div>
                </div>
              )}
              
              <div className="info-item">
                <div className="info-icon"><FaClock /></div>
                <div className="info-content">
                  <span className="info-label">Status</span>
                  <span className="info-value active">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-card">
          <h3 className="section-title">Account Information</h3>
          <div className="account-stats">
            <div className="stat-item">
              <div className="stat-value">-</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">-</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">-</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 