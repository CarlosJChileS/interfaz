import React from "react";
import styles from "../styles/ConfirmModal.module.css";
import { useTranslation } from 'react-i18next';

export default function ConfirmModal({ points, details, total, onClose }) {
  const { t } = useTranslation();
  return (
    <div className={styles.modalBg}>
      <div className={styles.modalCard}>
        <div className={styles.checkCircle}>
          <svg width="50" height="50" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="24" fill="#e6fbe5" stroke="#4caf50" strokeWidth="2" />
            <path d="M16 26l7 7 11-13" stroke="#4caf50" strokeWidth="3" fill="none" />
          </svg>
        </div>
        <h2 className={styles.title}>{t('modal_success_title')}</h2>
        <p className={styles.subtitle}>{t('modal_success_subtitle')}</p>
        <div className={styles.pointsBig}>+{points} {t('modal_points')}</div>
        <div className={styles.pointsLabel}>{t('modal_points_earned')}</div>
        <div className={styles.totalLabel}>
          {t('modal_new_total')}: <b>{total.toLocaleString()} {t('modal_points')}</b>
        </div>
        <div className={styles.detailsList}>
          {details.map(([mat, qty], i) => (
            <div
              key={i}
              className={mat === "Metales" ? styles.lineBlue : styles.lineGreen}
            >
              <span>
                {mat === "Metales" ? "⚡" : "📄"} {mat} - {qty}
              </span>
              <span>+{mat === "Metales" ? "12" : "5"} pts</span>
            </div>
          ))}
        </div>
        <button className={styles.orangeBtn}>{t('modal_view_rewards')}</button>
        <button className={styles.continueBtn} onClick={onClose}>{t('modal_continue')} →</button>
      </div>
    </div>
  );
}
