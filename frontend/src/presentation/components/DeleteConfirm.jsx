import React, { useState } from "react";
import styles from "../styles/DeleteConfirm.module.css";
import { useTranslation } from 'react-i18next';

export default function DeleteConfirm({ item, onCancel, onConfirm }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.bg}>
      <div className={styles.card} role="dialog" aria-modal="true">
        <h3 className={styles.title}>{t('modal_delete_title')}</h3>
        <p className={styles.message}>
          {t('modal_delete_question')} <b>{item}</b>?
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={loading}
          >
            {t('common_cancel')}
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? t('modal_deleting') : t('common_delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
