import React from "react";
import styles from "../styles/RedeemModal.module.css";
import { useTranslation } from 'react-i18next';

export default function RedeemModal({ reward, onConfirm, onCancel }) {
  const { t } = useTranslation();
  return (
    <div className={styles.bg}>
      <div className={styles.card} role="dialog" aria-modal="true">
        <h3 className={styles.title}>{t('modal_redeem_title')} {reward.nombre}</h3>
        <p className={styles.message}>
          {t('modal_redeem_question')} {reward.costo} {t('modal_points')}?
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            {t('common_cancel')}
          </button>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            {t('common_confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
