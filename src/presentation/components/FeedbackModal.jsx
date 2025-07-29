import React, { useState } from "react";
import styles from "./FeedbackModal.module.css";
import { useTranslation } from 'react-i18next';

export default function FeedbackModal({ onClose }) {
  const { t } = useTranslation();
  const [msg, setMsg] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t('modal_feedback_thanks'));
    setMsg("");
    onClose();
  };
  return (
    <div className={styles.bg}>
      <div className={styles.card}>
        <button className={styles.close} onClick={onClose} aria-label={t('modal_close')}>
          ×
        </button>
                <h2>{t('modal_feedback_title')}</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder={t('modal_feedback_placeholder')}
            className={styles.textarea}
            required
          />
          <button type="submit" className={styles.sendBtn}>
            {t('modal_send')}
          </button>
        </form>
      </div>
    </div>
  );
}
