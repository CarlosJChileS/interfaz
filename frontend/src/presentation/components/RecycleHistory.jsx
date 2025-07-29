import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { FaTrash, FaClipboard, FaFilter } from "react-icons/fa";
import DeleteConfirm from "./DeleteConfirm";
import "../styles/RecycleHistory.css";
import "../styles/Dashboard.css";

const RecycleHistory = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [toDelete, setToDelete] = useState(null);

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
    if (selectedFilter === "Todos") {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter(record => 
        record.accion && record.accion.toLowerCase().includes(selectedFilter.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [records, selectedFilter]);

  // Obtener tipos únicos de eventos para los filtros
  const getEventTypes = () => {
    const types = ["Todos"];
    const uniqueTypes = [...new Set(records.map(record => record.accion))];
    return [...types, ...uniqueTypes.filter(type => type)];
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
    { value: `${totalPuntos} pts`, label: "Puntos ganados", color: "summary-orange", desc: selectedFilter === "Todos" ? "totales" : `en ${selectedFilter.toLowerCase()}` },
    { value: `${filteredRecords.length}`, label: "Registros", color: "summary-green", desc: selectedFilter === "Todos" ? "este mes" : "filtrados" },
  ];

  return (
    <div className="dashboard-panel" style={{ maxWidth: '800px', margin: '20px auto 0' }}>
      <div className="panel-header">
        <span>Mi Historial</span>
        <div className="badge">{filteredRecords.length} registros</div>
      </div>
      
      {/* Filtros */}
      <div className="filter-section" style={{ width: '95%' }}>
        <div className="filter-header">
          <FaFilter className="filter-icon" />
          <span className="filter-title">Filtrar por tipo de evento</span>
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
          {selectedFilter === "Todos" ? "Registros Recientes" : `Registros de ${selectedFilter}`}
        </span>
      </div>
      <div className="records-list" style={{ width: '95%' }}>
        {filteredRecords.length === 0 ? (
          <div className="no-records">
            <FaClipboard className="no-records-icon" />
            <p>No hay registros para mostrar</p>
            <small>{selectedFilter !== "Todos" ? `No se encontraron registros de "${selectedFilter}"` : "Aún no tienes actividad registrada"}</small>
          </div>
        ) : (
          filteredRecords.map((rec) => (
            <div className="record-item" key={rec.id} style={{ width: '100%' }}>
              <button
                className="delete-btn"
                onClick={() => setToDelete(rec)}
                aria-label="Eliminar registro"
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
                <div className="record-place">{rec.accion}</div>
                <div className="record-materials">{rec.descripcion}</div>
              </div>
              {rec.puntos && (
                <div className="record-points">{`+${rec.puntos} puntos`}</div>
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