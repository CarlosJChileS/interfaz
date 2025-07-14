import React from "react";
import styles from "./RedeemModal.module.css";

export default function RedeemModal({ reward, onConfirm, onCancel }) {
  return (
    <div className={styles.bg}>
      <div className={styles.card} role="dialog" aria-modal="true">
        <h3 className={styles.title}>Canjear {reward.nombre}</h3>
        <p className={styles.message}>
          ¿Deseas canjear esta recompensa por {reward.costo} puntos?
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
