import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../utils/supabase";
import { FaTrash, FaClipboard, FaFilter } from "react-icons/fa";
import DeleteConfirm from "./DeleteConfirm";
import "../styles/RecycleHistory.css";
import "../styles/Dashboard.css";

const RecycleHistory = () => {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [toDelete, setToDelete] = useState(null);

  // Inicializar el filtro con la traducción
  useEffect(() => {
    setSelectedFilter(t('history_filter_all'));
  }, [t]);

  // Función para traducir tipos de acciones
  const translateAction = (action) => {
    if (!action) return action;
    
    const actionMap = {
      'Reciclaje': 'history_action_recycling',
      'Reporte de incidente': 'history_action_report',
      'Canje de recompensa': 'history_action_reward',
      'Registro de material': 'history_action_register',
      'Puntos ganados': 'history_action_points'
    };
    
    return actionMap[action] ? t(actionMap[action]) : action;
  };

  // Función para obtener la acción original desde la traducción
  const getOriginalAction = (translatedAction) => {
    const reverseMap = {
      [t('history_action_recycling')]: 'Reciclaje',
      [t('history_action_report')]: 'Reporte de incidente',
      [t('history_action_reward')]: 'Canje de recompensa',
      [t('history_action_register')]: 'Registro de material',
      [t('history_action_points')]: 'Puntos ganados'
    };
    
    return reverseMap[translatedAction] || translatedAction;
  };

  useEffect(() => {
    async function fetchRecords() {
      // Obtener el usuario actual (auth_id)
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return;

      // Filtra el historial solo para el usuario actual por auth_id
      const { data, error: histError } = await supabase
        .from("historial")
        .select("id, accion, descripcion, fecha, puntos")
        .eq("auth_id", user.id)
        .order("fecha", { ascending: false })
        .limit(10);

      if (!histError && data) {
        setRecords(data);
        setFilteredRecords(data);
      }
    }
    fetchRecords();
  }, []);

  // Efecto para filtrar registros cuando cambia el filtro seleccionado
  useEffect(() => {
    if (selectedFilter === t('history_filter_all')) {
      setFilteredRecords(records);
    } else {
      const originalAction = getOriginalAction(selectedFilter);
      const filtered = records.filter(record => 
        record.accion && record.accion.toLowerCase().includes(originalAction.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [records, selectedFilter, t]);

  // Obtener tipos únicos de eventos para los filtros
  const getEventTypes = () => {
    const types = [t('history_filter_all')];
    const uniqueTypes = [...new Set(records.map(record => record.accion))];
    const translatedTypes = uniqueTypes.filter(type => type).map(type => translateAction(type));
    return [...types, ...translatedTypes];
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("historial").delete().eq("id", id);
    if (!error) {
      const updatedRecords = records.filter((r) => r.id !== id);
      setRecords(updatedRecords);
      // Los filteredRecords se actualizarán automáticamente por el useEffect
    }
  };

  const totalPuntos = filteredRecords.reduce((acc, r) => acc + (r.puntos || 0), 0);

  const summary = [
    { value: `${totalPuntos} pts`, label: t('history_points_earned'), color: "summary-orange", desc: selectedFilter === t('history_filter_all') ? t('history_total_desc') : `${t('history_filtered_desc')} ${selectedFilter.toLowerCase()}` },
    { value: `${filteredRecords.length}`, label: t('history_total_records'), color: "summary-green", desc: selectedFilter === t('history_filter_all') ? t('history_month_desc') : t('history_filtered_desc') },
  ];

  return (
    <div className="dashboard-panel" style={{ maxWidth: '800px', margin: '20px auto 0' }}>
      <div className="panel-header">
        <span>{t('history_title')}</span>
        <div className="badge">{filteredRecords.length} {t('history_records')}</div>
      </div>
      
      {/* Filtros */}
      <div className="filter-section" style={{ width: '95%' }}>
        <div className="filter-header">
          <FaFilter className="filter-icon" />
          <span className="filter-title">{t('history_filter_title')}</span>
        </div>
        <div className="filter-options">
          {getEventTypes().map((type) => (
            <button
              key={type}
              className={`filter-btn ${selectedFilter === type ? 'active' : ''}`}
              onClick={() => setSelectedFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      <div className="summary-cards" style={{ width: '100%' }}>
        {summary.map((item, i) => (
          <div key={i} className={`summary-card ${item.color}`}>
            <div className="summary-value">{item.value}</div>
            <div className="summary-label">{item.label}</div>
            <div className="summary-desc">{item.desc}</div>
          </div>
        ))}
      </div>
      <div className="records-header" style={{ width: '95%' }}>
        <span className="records-title">
          {selectedFilter === t('history_filter_all') ? t('history_recent_records') : `${t('history_records_of')} ${selectedFilter}`}
        </span>
      </div>
      <div className="records-list" style={{ width: '95%' }}>
        {filteredRecords.length === 0 ? (
          <div className="no-records">
            <FaClipboard className="no-records-icon" />
            <p>{t('history_no_records')}</p>
            <small>{selectedFilter !== t('history_filter_all') ? `${t('history_no_filter_results')} "${selectedFilter}"` : t('history_no_activity')}</small>
          </div>
        ) : (
          filteredRecords.map((rec) => (
            <div className="record-item" key={rec.id} style={{ width: '100%' }}>
              <button
                className="delete-btn"
                onClick={() => setToDelete(rec)}
                aria-label={t('history_delete_label')}
              >
                <FaTrash />
              </button>
              <div className="record-icon">
                <FaClipboard />
              </div>
              <div className="record-info">
                <div className="record-date">
                  <b>{new Date(rec.fecha).toLocaleDateString()}</b>
                  <span className="record-time">
                    {new Date(rec.fecha).toLocaleTimeString()}
                  </span>
                </div>
                <div className="record-place">{translateAction(rec.accion)}</div>
                <div className="record-materials">{rec.descripcion}</div>
              </div>
              {rec.puntos && (
                <div className="record-points">{`+${rec.puntos} ${t('history_points')}`}</div>
              )}
            </div>
          ))
        )}
      </div>
      
      {toDelete && (
        <DeleteConfirm
          item={`${toDelete.accion}`}
          onCancel={() => setToDelete(null)}
          onConfirm={async () => {
            await handleDelete(toDelete.id);
            setToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default RecycleHistory;