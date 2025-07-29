import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../utils/supabase";
import styles from "../styles/ExchangeManagement.module.css";

export default function ExchangeManagement() {
  const { t } = useTranslation();
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("canje_recompensa")
        .select(`
          id,
          fecha,
          estado,
          perfil!inner(nombre, apellidos, email),
          recompensa!inner(nombre, categoria, puntos_necesarios)
        `)
        .order("fecha", { ascending: false });

      if (error) {
        console.error("Error fetching exchanges:", error);
        return;
      }

      setExchanges(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateExchangeStatus = async (exchangeId, newStatus) => {
    try {
      const { error } = await supabase
        .from("canje_recompensa")
        .update({ estado: newStatus })
        .eq("id", exchangeId);

      if (error) {
        alert(t('admin_exchange_error'));
        return;
      }

      // Actualizar la lista local
      setExchanges(prev => 
        prev.map(exchange => 
          exchange.id === exchangeId 
            ? { ...exchange, estado: newStatus }
            : exchange
        )
      );

      // Mensaje de éxito
      const messages = {
        'aprobado': t('admin_exchange_success_approve'),
        'rechazado': t('admin_exchange_success_reject'),
        'completado': t('admin_exchange_success_complete')
      };
      alert(messages[newStatus] || 'Status updated successfully');

    } catch (error) {
      console.error("Error updating exchange:", error);
      alert(t('admin_exchange_error'));
    }
  };

  const handleStatusUpdate = (exchangeId, newStatus) => {
    const confirmMessages = {
      'aprobado': t('admin_exchange_confirm_approve'),
      'rechazado': t('admin_exchange_confirm_reject'),
      'completado': t('admin_exchange_confirm_complete')
    };

    if (window.confirm(confirmMessages[newStatus])) {
      updateExchangeStatus(exchangeId, newStatus);
    }
  };

  const getFilteredExchanges = () => {
    if (filter === "all") return exchanges;
    if (filter === "pending") return exchanges.filter(ex => ex.estado === "solicitado");
    if (filter === "approved") return exchanges.filter(ex => ex.estado === "aprobado");
    if (filter === "completed") return exchanges.filter(ex => ex.estado === "completado");
    return exchanges.filter(ex => ex.estado === filter);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'solicitado': { label: t('admin_exchange_status_requested'), class: 'pending' },
      'aprobado': { label: t('admin_exchange_status_approved'), class: 'approved' },
      'rechazado': { label: t('admin_exchange_status_rejected'), class: 'rejected' },
      'completado': { label: t('admin_exchange_status_completed'), class: 'completed' }
    };

    const config = statusConfig[status] || { label: status, class: 'default' };
    return <span className={`${styles.statusBadge} ${styles[config.class]}`}>{config.label}</span>;
  };

  const ExchangeDetailsModal = ({ exchange, onClose }) => {
    if (!exchange) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h3>{t('admin_exchange_view')}</h3>
            <button onClick={onClose} className={styles.closeBtn}>×</button>
          </div>
          
          <div className={styles.modalContent}>
            <div className={styles.detailSection}>
              <h4>{t('admin_exchange_reward')}</h4>
              <p><strong>{exchange.recompensa.nombre}</strong></p>
              <p>{exchange.recompensa.categoria} - {exchange.recompensa.puntos_necesarios} {t('modal_points')}</p>
            </div>

            <div className={styles.detailSection}>
              <h4>{t('admin_exchange_user')}</h4>
              <p>{exchange.perfil.nombre} {exchange.perfil.apellidos}</p>
              <p>{exchange.perfil.email}</p>
            </div>

            <div className={styles.detailSection}>
              <h4>{t('common_details')}</h4>
              <p><strong>{t('admin_exchange_date')}:</strong> {new Date(exchange.fecha).toLocaleString()}</p>
              <p><strong>{t('dashboard_status')}:</strong> {getStatusBadge(exchange.estado)}</p>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button onClick={onClose} className={styles.closeButton}>
              {t('modal_close')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredExchanges = getFilteredExchanges();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{t('admin_exchanges_section')}</h2>
        
        <div className={styles.filters}>
          <button 
            className={filter === "all" ? styles.activeFilter : styles.filter}
            onClick={() => setFilter("all")}
          >
            Todos ({exchanges.length})
          </button>
          <button 
            className={filter === "pending" ? styles.activeFilter : styles.filter}
            onClick={() => setFilter("pending")}
          >
            {t('admin_exchanges_pending')} ({exchanges.filter(ex => ex.estado === "solicitado").length})
          </button>
          <button 
            className={filter === "approved" ? styles.activeFilter : styles.filter}
            onClick={() => setFilter("approved")}
          >
            {t('admin_exchange_status_approved')} ({exchanges.filter(ex => ex.estado === "aprobado").length})
          </button>
          <button 
            className={filter === "completed" ? styles.activeFilter : styles.filter}
            onClick={() => setFilter("completed")}
          >
            {t('admin_exchanges_completed')} ({exchanges.filter(ex => ex.estado === "completado").length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Cargando...</div>
      ) : (
        <div className={styles.exchangesList}>
          {filteredExchanges.length === 0 ? (
            <div className={styles.empty}>
              {t('admin_no_exchanges')}
            </div>
          ) : (
            filteredExchanges.map((exchange) => (
              <div key={exchange.id} className={styles.exchangeCard}>
                <div className={styles.exchangeHeader}>
                  <div className={styles.exchangeInfo}>
                    <h4>{exchange.recompensa.nombre}</h4>
                    <p>{exchange.perfil.nombre} {exchange.perfil.apellidos}</p>
                    <p className={styles.date}>
                      {new Date(exchange.fecha).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={styles.exchangeStatus}>
                    {getStatusBadge(exchange.estado)}
                    <div className={styles.points}>
                      {exchange.recompensa.puntos_necesarios} pts
                    </div>
                  </div>
                </div>

                <div className={styles.exchangeActions}>
                  <button
                    onClick={() => setSelectedExchange(exchange)}
                    className={styles.viewBtn}
                  >
                    {t('admin_exchange_view')}
                  </button>

                  {exchange.estado === "solicitado" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(exchange.id, "aprobado")}
                        className={styles.approveBtn}
                      >
                        {t('admin_exchange_approve')}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(exchange.id, "rechazado")}
                        className={styles.rejectBtn}
                      >
                        {t('admin_exchange_reject')}
                      </button>
                    </>
                  )}

                  {exchange.estado === "aprobado" && (
                    <button
                      onClick={() => handleStatusUpdate(exchange.id, "completado")}
                      className={styles.completeBtn}
                    >
                      {t('admin_exchange_complete')}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedExchange && (
        <ExchangeDetailsModal
          exchange={selectedExchange}
          onClose={() => setSelectedExchange(null)}
        />
      )}
    </div>
  );
}
