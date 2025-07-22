import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import styles from "../styles/NotificationModal.module.css";

export default function NotificationModal({ onClose }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function fetchAlerts() {
      const {
        data,
      } = await supabase
        .from("alertas")
        .select("id,mensaje,created_at,leido")
        .order("created_at", { ascending: false });
      if (data) {
        setAlerts(data);
      }
    }
    fetchAlerts();
  }, []);

  const markAsRead = async (id) => {
    await supabase.from("alertas").update({ leido: true }).eq("id", id);
    setAlerts((al) => al.map((a) => (a.id === id ? { ...a, leido: true } : a)));
  };

  return (
    <div className={styles.bg} role="dialog" aria-modal="true">
      <div className={styles.card}>
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        <h3 className={styles.title}>Notificaciones</h3>
        <div className={styles.list}>
          {alerts.length === 0 && (
            <div className={styles.empty}>No hay notificaciones</div>
          )}
          {alerts.map((a) => (
            <div key={a.id} className={styles.item}>
              <div>
                <div className={styles.msg}>{a.mensaje}</div>
                {a.created_at && (
                  <div className={styles.date}>
                    {new Date(a.created_at).toLocaleString()}
                  </div>
                )}
              </div>
              {!a.leido && (
                <button
                  className={styles.readBtn}
                  onClick={() => markAsRead(a.id)}
                >
                  Marcar leído
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
