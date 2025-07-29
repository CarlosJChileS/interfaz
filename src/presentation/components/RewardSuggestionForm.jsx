import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLightbulb, FaTimes, FaPlus, FaTag, FaCoins, FaCheckCircle } from 'react-icons/fa';
import '../styles/RewardSuggestionForm.css';

export default function RewardSuggestionForm({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    estimatedPoints: '',
    justification: ''
  });

  const categories = [
    { value: 'food', label: t('suggestion_category_food') },
    { value: 'books', label: t('suggestion_category_books') },
    { value: 'discounts', label: t('suggestion_category_discounts') },
    { value: 'technology', label: t('suggestion_category_technology') },
    { value: 'transport', label: t('suggestion_category_transport') },
    { value: 'eco_products', label: t('suggestion_category_eco_products') },
    { value: 'events', label: t('suggestion_category_events') },
    { value: 'other', label: t('suggestion_category_other') }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      alert(t('suggestion_fill_required'));
      return;
    }

    // Obtener sugerencias existentes del localStorage
    const existingSuggestions = JSON.parse(localStorage.getItem('rewardSuggestions') || '[]');
    
    // Crear nueva sugerencia
    const newSuggestion = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    // Guardar en localStorage
    const updatedSuggestions = [...existingSuggestions, newSuggestion];
    localStorage.setItem('rewardSuggestions', JSON.stringify(updatedSuggestions));

    // Limpiar formulario
    setFormData({
      title: '',
      description: '',
      category: '',
      estimatedPoints: '',
      justification: ''
    });

    // Mostrar mensaje de éxito
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="suggestion-modal-overlay">
      <div className="suggestion-modal">
        <div className="suggestion-header">
          <h2>
            <FaLightbulb className="suggestion-icon" />
            {t('suggestion_title')}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="suggestion-form">
          <div className="form-group">
            <label htmlFor="title">
              {t('suggestion_reward_title')} *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={t('suggestion_title_placeholder')}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">
              <FaTag className="input-icon" />
              {t('suggestion_category')} *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">{t('suggestion_select_category')}</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              {t('suggestion_description')} *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t('suggestion_description_placeholder')}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="estimatedPoints">
              <FaCoins className="input-icon" />
              {t('suggestion_estimated_points')}
            </label>
            <input
              type="number"
              id="estimatedPoints"
              name="estimatedPoints"
              value={formData.estimatedPoints}
              onChange={handleChange}
              placeholder={t('suggestion_points_placeholder')}
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="justification">
              {t('suggestion_justification')}
            </label>
            <textarea
              id="justification"
              name="justification"
              value={formData.justification}
              onChange={handleChange}
              placeholder={t('suggestion_justification_placeholder')}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              {t('suggestion_cancel')}
            </button>
            <button type="submit" className="submit-btn">
              <FaPlus className="btn-icon" />
              {t('suggestion_submit')}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de éxito */}
      {showSuccess && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-content">
              <FaCheckCircle className="success-icon" />
              <h3>{t('suggestion_success_title')}</h3>
              <p>{t('suggestion_success')}</p>
              <button 
                className="success-btn"
                onClick={handleCloseSuccess}
              >
                {t('suggestion_continue')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
