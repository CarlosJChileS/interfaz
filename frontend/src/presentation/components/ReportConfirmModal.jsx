import React from "react";
import styles from "../styles/DeleteConfirm.module.css";
import { useTranslation } from 'react-i18next';

export default function ReportConfirmModal({ data, onCancel, onConfirm }) {
  const { t } = useTranslation();
  return (
    <div className={styles.bg} role="dialog" aria-modal="true">
      <div className={styles.card}>
        <h3 className={styles.title}>{t('report_confirm_title')}</h3>
        <p className={styles.message}>{t('report_confirm_question')}</p>
        <div className={styles.summary}>
          <div>
            <b>{t('report_confirm_type')}:</b> {data.type}
          </div>
          <div>
            <b>{t('report_confirm_location')}:</b> {data.location}
          </div>
          <div>
            <b>{t('report_confirm_urgency')}:</b> {data.urgency}
          </div>
          <div>
            <b>{t('report_confirm_description')}:</b> {data.description || t('report_confirm_no_description')}
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            {t('common_cancel')}
          </button>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            {t('report_confirm_send')}
          </button>
        </div>
      </div>
    </div>
  );
}
