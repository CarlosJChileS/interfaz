import React from 'react';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import styles from '../styles/LogoutConfirmModal.module.css';

export default function LogoutConfirmModal({ isOpen, onConfirm, onCancel }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <FaSignOutAlt className={styles.icon} />
          <h3 className={styles.title}>{t('logout_confirm_title')}</h3>
          <button 
            className={styles.closeButton}
            onClick={onCancel}
            aria-label={t('close')}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className={styles.content}>
          <p className={styles.message}>
            {t('logout_confirm_message')}
          </p>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.cancelButton}
            onClick={onCancel}
          >
            {t('cancel')}
          </button>
          <button 
            className={styles.confirmButton}
            onClick={onConfirm}
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );
}
