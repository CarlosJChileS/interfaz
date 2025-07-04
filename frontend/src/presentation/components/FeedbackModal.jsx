import React, { useState } from "react";
import styles from "./FeedbackModal.module.css";

export default function FeedbackModal({ onClose }) {
  const [msg, setMsg] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Gracias por tu retroalimentación");
    setMsg("");
    onClose();
  };
  return (
    <div className={styles.bg}>
      <div className={styles.card}>
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        <h2>Retroalimentación</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Escribe tus comentarios"
            className={styles.textarea}
            required
          />
          <button type="submit" className={styles.sendBtn}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
