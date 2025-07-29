import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLightbulb, FaTimes, FaCoins, FaClock, FaTrash, FaEye } from 'react-icons/fa';
import '../styles/SuggestionsDrawer.css';

export default function SuggestionsDrawer({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const categories = {
    food: t('suggestion_category_food'),
    books: t('suggestion_category_books'),
    discounts: t('suggestion_category_discounts'),
    technology: t('suggestion_category_technology'),
    transport: t('suggestion_category_transport'),
    eco_products: t('suggestion_category_eco_products'),
    events: t('suggestion_category_events'),
    other: t('suggestion_category_other')
  };

  const statusLabels = {
    pending: t('suggestion_status_pending'),
    approved: t('suggestion_status_approved'),
    rejected: t('suggestion_status_rejected')
  };

  useEffect(() => {
    loadSuggestions();
  }, [isOpen]);

  const loadSuggestions = () => {
    const saved = JSON.parse(localStorage.getItem('rewardSuggestions') || '[]');
    setSuggestions(saved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const deleteSuggestion = (id) => {
    if (window.confirm(t('suggestion_confirm_delete'))) {
      const updated = suggestions.filter(s => s.id !== id);
      setSuggestions(updated);
      localStorage.setItem('rewardSuggestions', JSON.stringify(updated));
      if (selectedSuggestion && selectedSuggestion.id === id) {
        setSelectedSuggestion(null);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food': return '🍽️';
      case 'books': return '📚';
      case 'discounts': return '💰';
      case 'technology': return '💻';
      case 'transport': return '🚌';
      case 'eco_products': return '🌱';
      case 'events': return '🎫';
      default: return '💡';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`suggestions-drawer ${isOpen ? 'open' : ''}`}>
      <div className="suggestions-header">
        <h2>
          <FaLightbulb className="header-icon" />
          {t('suggestions_title')}
          <span className="suggestions-count">({suggestions.length})</span>
        </h2>
        <button className="close-drawer" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="suggestions-content">
        {suggestions.length === 0 ? (
          <div className="empty-state">
            <FaLightbulb className="empty-icon" />
            <h3>{t('suggestions_empty_title')}</h3>
            <p>{t('suggestions_empty_desc')}</p>
          </div>
        ) : (
          <div className="suggestions-list">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="suggestion-card">
                <div className="suggestion-main">
                  <div className="suggestion-header-info">
                    <span className="category-badge">
                      {getCategoryIcon(suggestion.category)}
                      {categories[suggestion.category] || suggestion.category}
                    </span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(suggestion.status) }}
                    >
                      {statusLabels[suggestion.status]}
                    </span>
                  </div>
                  
                  <h3 className="suggestion-title">{suggestion.title}</h3>
                  
                  <p className="suggestion-description">
                    {suggestion.description.length > 100 
                      ? `${suggestion.description.substring(0, 100)}...`
                      : suggestion.description
                    }
                  </p>
                  
                  <div className="suggestion-meta">
                    <span className="suggestion-date">
                      <FaClock />
                      {formatDate(suggestion.createdAt)}
                    </span>
                    {suggestion.estimatedPoints && (
                      <span className="suggestion-points">
                        <FaCoins />
                        {suggestion.estimatedPoints} pts
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="suggestion-actions">
                  <button 
                    className="action-btn view-btn"
                    onClick={() => setSelectedSuggestion(suggestion)}
                    title={t('suggestion_view_details')}
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => deleteSuggestion(suggestion.id)}
                    title={t('suggestion_delete')}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {selectedSuggestion && (
        <div className="suggestion-detail-overlay" onClick={() => setSelectedSuggestion(null)}>
          <div className="suggestion-detail" onClick={(e) => e.stopPropagation()}>
            <div className="detail-header">
              <h3>{selectedSuggestion.title}</h3>
              <button onClick={() => setSelectedSuggestion(null)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="detail-content">
              <div className="detail-badges">
                <span className="category-badge">
                  {getCategoryIcon(selectedSuggestion.category)}
                  {categories[selectedSuggestion.category]}
                </span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(selectedSuggestion.status) }}
                >
                  {statusLabels[selectedSuggestion.status]}
                </span>
              </div>
              
              <div className="detail-field">
                <strong>{t('suggestion_description')}:</strong>
                <p>{selectedSuggestion.description}</p>
              </div>
              
              {selectedSuggestion.estimatedPoints && (
                <div className="detail-field">
                  <strong>{t('suggestion_estimated_points')}:</strong>
                  <p>{selectedSuggestion.estimatedPoints} puntos</p>
                </div>
              )}
              
              {selectedSuggestion.justification && (
                <div className="detail-field">
                  <strong>{t('suggestion_justification')}:</strong>
                  <p>{selectedSuggestion.justification}</p>
                </div>
              )}
              
              <div className="detail-field">
                <strong>{t('suggestion_created_at')}:</strong>
                <p>{formatDate(selectedSuggestion.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
