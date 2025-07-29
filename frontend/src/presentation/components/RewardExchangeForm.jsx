import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProfileContext } from "../../ProfileContext";
import styles from "../styles/RewardExchangeForm.module.css";

export default function RewardExchangeForm({ reward, onCancel, onConfirm }) {
  const { t } = useTranslation();
  const { profile } = useProfileContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exchangeSuccess, setExchangeSuccess] = useState(false);
  const [exchangeCode, setExchangeCode] = useState("");
  
  // Formulario de datos de contacto
  const [contactData, setContactData] = useState({
    name: profile?.name || `${profile?.nombre || ""} ${profile?.apellidos || ""}`.trim(),
    email: profile?.email || "",
    phone: profile?.telefono || "",
    deliveryMethod: "pickup",
    deliveryNotes: ""
  });
  
  // Estado para aceptar términos
  const [acceptTerms, setAcceptTerms] = useState(false);

  const totalSteps = 3;
  const remainingPoints = (profile?.puntos || 0) - reward.costo;

  // Validaciones
  const isStep1Valid = () => {
    return remainingPoints >= 0;
  };

  const isStep2Valid = () => {
    const nameValid = contactData.name.trim().length >= 2;
    const emailValid = contactData.email.trim() && 
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email.trim());
    const phoneValid = contactData.phone.trim() && 
                      /^\+?[\d\s\-\(\)]{8,}$/.test(contactData.phone.trim());
    
    return nameValid && emailValid && phoneValid;
  };

  const isStep3Valid = () => {
    return acceptTerms && isStep1Valid() && isStep2Valid();
  };

  const getValidationErrors = () => {
    const errors = [];
    
    if (remainingPoints < 0) {
      errors.push(t('rewards_insufficient_points'));
    }
    
    if (!contactData.name.trim() || contactData.name.trim().length < 2) {
      errors.push(t('reward_form_error_name_required'));
    }
    
    if (!contactData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email.trim())) {
      errors.push(t('reward_form_error_email_invalid'));
    }
    
    if (!contactData.phone.trim() || !/^\+?[\d\s\-\(\)]{8,}$/.test(contactData.phone.trim())) {
      errors.push(t('reward_form_error_phone_invalid'));
    }
    
    if (!acceptTerms) {
      errors.push(t('reward_form_error_terms'));
    }
    
    return errors;
  };

  // Manejadores
  const handleContactChange = (field, value) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && !isStep1Valid()) {
      alert(t('rewards_insufficient_points'));
      return;
    }
    
    if (currentStep === 2 && !isStep2Valid()) {
      const errors = getValidationErrors();
      alert(errors.join('\n'));
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmExchange = async () => {
    // Validación final antes del canje
    const errors = getValidationErrors();
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    // Validación adicional de puntos en tiempo real
    if ((profile?.puntos || 0) < reward.costo) {
      alert(t('rewards_insufficient_points'));
      return;
    }

    setIsProcessing(true);
    
    try {
      // Generar código de canje único
      const code = `ECO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      // Llamar a la función de confirmación del padre con datos adicionales
      await onConfirm({
        contactData,
        deliveryMethod: contactData.deliveryMethod,
        deliveryNotes: contactData.deliveryNotes,
        exchangeCode: code
      });
      
      setExchangeCode(code);
      setExchangeSuccess(true);
    } catch (error) {
      console.error('Error en el canje:', error);
      alert(t('rewards_exchange_error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (exchangeSuccess) {
      // Recargar la página o actualizar la lista de recompensas
      window.location.reload();
    } else {
      onCancel();
    }
  };

  // Renderizado de éxito
  if (exchangeSuccess) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>{t('reward_form_success_title')}</h2>
            <p className={styles.successMessage}>{t('reward_form_success_message')}</p>
            
            <div className={styles.successDetails}>
              <div className={styles.successCode}>
                <strong>{t('reward_form_success_code')}:</strong>
                <span className={styles.codeValue}>{exchangeCode}</span>
              </div>
              <p className={styles.contactInfo}>{t('reward_form_success_contact')}</p>
            </div>
            
            <button 
              className={styles.closeButton}
              onClick={handleClose}
            >
              {t('reward_form_success_close')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{t('reward_form_title')}</h2>
          <button className={styles.closeBtn} onClick={onCancel}>×</button>
        </div>

        {/* Progress indicator */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <span className={styles.progressText}>
            {t('reward_form_step')} {currentStep} {t('reward_form_of')} {totalSteps}
          </span>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Step 1: Reward Selection */}
          {currentStep === 1 && (
            <div className={styles.step}>
              <h3 className={styles.stepTitle}>{t('reward_form_step1_title')}</h3>
              
              {remainingPoints < 0 && (
                <div className={styles.errorBanner}>
                  <span>⚠️</span>
                  <span>{t('rewards_insufficient_points')}</span>
                </div>
              )}
              
              <div className={styles.rewardCard}>
                <div className={styles.rewardInfo}>
                  <h4>{reward.nombre}</h4>
                  <p className={styles.rewardCategory}>{reward.sub}</p>
                  <p className={styles.rewardDescription}>{reward.desc}</p>
                </div>
                
                <div className={styles.pointsInfo}>
                  <div className={styles.pointsRow}>
                    <span>{t('reward_form_cost')}:</span>
                    <span className={styles.cost}>{reward.costo} {t('modal_points')}</span>
                  </div>
                  <div className={styles.pointsRow}>
                    <span>{t('reward_form_current_points')}:</span>
                    <span>{profile?.puntos || 0} {t('modal_points')}</span>
                  </div>
                  <div className={styles.pointsRow}>
                    <span>{t('reward_form_remaining_points')}:</span>
                    <span className={remainingPoints >= 0 ? styles.positive : styles.negative}>
                      {remainingPoints} {t('modal_points')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className={styles.step}>
              <h3 className={styles.stepTitle}>{t('reward_form_step2_title')}</h3>
              
              <div className={styles.form}>
                <div className={styles.formGroup}>
                  <label>
                    {t('reward_form_name')} <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) => handleContactChange('name', e.target.value)}
                    placeholder={t('reward_form_name')}
                    className={!contactData.name.trim() || contactData.name.trim().length < 2 ? styles.invalid : ''}
                  />
                  {(!contactData.name.trim() || contactData.name.trim().length < 2) && (
                    <span className={styles.fieldError}>{t('reward_form_error_name_required')}</span>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label>
                    {t('reward_form_email')} <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    placeholder={t('reward_form_email')}
                    className={!contactData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email.trim()) ? styles.invalid : ''}
                  />
                  {(!contactData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email.trim())) && (
                    <span className={styles.fieldError}>{t('reward_form_error_email_invalid')}</span>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label>
                    {t('reward_form_phone')} <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    placeholder={t('reward_form_phone')}
                    className={!contactData.phone.trim() || !/^\+?[\d\s\-\(\)]{8,}$/.test(contactData.phone.trim()) ? styles.invalid : ''}
                  />
                  {(!contactData.phone.trim() || !/^\+?[\d\s\-\(\)]{8,}$/.test(contactData.phone.trim())) && (
                    <span className={styles.fieldError}>{t('reward_form_error_phone_invalid')}</span>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label>{t('reward_form_delivery_method')}</label>
                  <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="pickup"
                        checked={contactData.deliveryMethod === 'pickup'}
                        onChange={(e) => handleContactChange('deliveryMethod', e.target.value)}
                      />
                      <span>{t('reward_form_pickup')}</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="delivery"
                        checked={contactData.deliveryMethod === 'delivery'}
                        onChange={(e) => handleContactChange('deliveryMethod', e.target.value)}
                      />
                      <span>{t('reward_form_campus_delivery')}</span>
                    </label>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>{t('reward_form_delivery_notes')}</label>
                  <textarea
                    value={contactData.deliveryNotes}
                    onChange={(e) => handleContactChange('deliveryNotes', e.target.value)}
                    placeholder={t('reward_form_delivery_notes_placeholder')}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review and Confirm */}
          {currentStep === 3 && (
            <div className={styles.step}>
              <h3 className={styles.stepTitle}>{t('reward_form_step3_title')}</h3>
              
              <div className={styles.summary}>
                <div className={styles.summarySection}>
                  <h4>{t('reward_form_selected_reward')}</h4>
                  <div className={styles.summaryItem}>
                    <span>{reward.nombre}</span>
                    <span>{reward.costo} {t('modal_points')}</span>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4>{t('reward_form_contact_confirmation')}</h4>
                  <div className={styles.summaryItem}>
                    <span>{t('reward_form_name')}:</span>
                    <span>{contactData.name}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>{t('reward_form_email')}:</span>
                    <span>{contactData.email}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>{t('reward_form_phone')}:</span>
                    <span>{contactData.phone}</span>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4>{t('reward_form_delivery_preference')}</h4>
                  <div className={styles.summaryItem}>
                    <span>
                      {contactData.deliveryMethod === 'pickup' 
                        ? t('reward_form_pickup') 
                        : t('reward_form_campus_delivery')}
                    </span>
                  </div>
                  {contactData.deliveryNotes && (
                    <div className={styles.summaryItem}>
                      <span>{t('reward_form_special_notes')}:</span>
                      <span>{contactData.deliveryNotes}</span>
                    </div>
                  )}
                  {!contactData.deliveryNotes && (
                    <div className={styles.summaryItem}>
                      <span>{t('reward_form_no_notes')}</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.termsSection}>
                  <h4>{t('reward_form_terms')}</h4>
                  <ul className={styles.termsList}>
                    <li>{t('reward_form_terms1')}</li>
                    <li>{t('reward_form_terms2')}</li>
                    <li>{t('reward_form_terms3')}</li>
                  </ul>
                  
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                    />
                    <span>{t('reward_form_accept_terms')}</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.buttons}>
            {currentStep > 1 && (
              <button 
                className={styles.secondaryButton}
                onClick={handlePrevious}
                disabled={isProcessing}
              >
                {t('reward_form_previous')}
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button 
                className={styles.primaryButton}
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !isStep1Valid()) ||
                  (currentStep === 2 && !isStep2Valid())
                }
              >
                {t('reward_form_next')}
              </button>
            ) : (
              <button 
                className={styles.primaryButton}
                onClick={handleConfirmExchange}
                disabled={!isStep3Valid() || isProcessing}
              >
                {isProcessing ? t('reward_form_processing') : t('reward_form_confirm_exchange')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
