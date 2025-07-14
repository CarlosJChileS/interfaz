import React, { useState } from "react";
import styles from "./DeleteConfirm.module.css";

export default function DeleteConfirm({ item, onCancel, onConfirm }) {
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
        <h3 className={styles.title}>Confirmar Eliminación</h3>
        <p className={styles.message}>
          ¿Estás seguro de eliminar <b>{item}</b>?
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
