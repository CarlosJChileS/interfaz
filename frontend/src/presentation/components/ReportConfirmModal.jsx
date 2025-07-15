import React from "react";
import styles from "./ReportConfirmModal.module.css";

export default function ReportConfirmModal({ data, onCancel, onConfirm }) {
  return (
    <div className={styles.bg} role="dialog" aria-modal="true">
      <div className={styles.card}>
        <h3 className={styles.title}>Confirmar Envío</h3>
        <p className={styles.message}>¿Deseas enviar este reporte?</p>
        <div className={styles.summary}>
          <div>
            <b>Tipo:</b> {data.type}
          </div>
          <div>
            <b>Ubicación:</b> {data.location}
          </div>
          <div>
            <b>Severidad:</b> {data.urgency}
          </div>
          <div>
            <b>Descripción:</b> {data.description || "(No ingresada)"}
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
