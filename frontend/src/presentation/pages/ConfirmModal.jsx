import React from "react";
import styles from "./ConfirmModal.module.css";

export default function ConfirmModal({ points, details, total, onClose }) {
  return (
    <div className={styles.modalBg}>
      <div className={styles.modalCard}>
        <div className={styles.checkCircle}>
          <svg width="50" height="50" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="24" fill="#e6fbe5" stroke="#4caf50" strokeWidth="2" />
            <path d="M16 26l7 7 11-13" stroke="#4caf50" strokeWidth="3" fill="none" />
          </svg>
        </div>
        <h2 className={styles.title}>¡Registro Exitoso!</h2>
        <p className={styles.subtitle}>Tu reciclaje ha sido registrado correctamente</p>
        <div className={styles.pointsBig}>+{points} puntos</div>
        <div className={styles.pointsLabel}>ganados</div>
        <div className={styles.totalLabel}>
          Nuevo total: <b>{total.toLocaleString()} puntos</b>
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
        <button className={styles.orangeBtn}>Ver Recompensas</button>
        <button className={styles.continueBtn} onClick={onClose}>Continuar →</button>
      </div>
    </div>
  );
}
