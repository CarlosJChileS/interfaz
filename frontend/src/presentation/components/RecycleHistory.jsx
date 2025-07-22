import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { FaTrash, FaClipboard } from "react-icons/fa";
import DeleteConfirm from "./DeleteConfirm";
import "../styles/RecycleHistory.css";

const RecycleHistory = () => {
  const [records, setRecords] = useState([]);
  const [toDelete, setToDelete] = useState(null);
  const [authId, setAuthId] = useState(null);

  useEffect(() => {
    async function fetchRecords() {
      // Obtener el usuario actual (auth_id)
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return;
      setAuthId(user.id);

      // Filtra el historial solo para el usuario actual por auth_id
      const { data, error: histError } = await supabase
        .from("historial")
        .select("id, accion, descripcion, fecha, puntos")
        .eq("auth_id", user.id)
        .order("fecha", { ascending: false })
        .limit(10);

      if (!histError && data) {
        setRecords(data);
      }
    }
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    const { error } = await supabase.from("historial").delete().eq("id", id);
    if (!error) {
      setRecords((recs) => recs.filter((r) => r.id !== id));
    }
  };

  const totalPuntos = records.reduce((acc, r) => acc + (r.puntos || 0), 0);

  const summary = [
    { value: `${totalPuntos} pts`, label: "Puntos ganados", color: "summary-orange", desc: "totales" },
    { value: `${records.length}`, label: "Registros", color: "summary-green", desc: "este mes" },
  ];

  return (
    <div className="recycle-bg">
      <div className="recycle-container">
        <div className="recycle-title">Mi Historial</div>
        <div className="summary-cards">
          {summary.map((item, i) => (
            <div key={i} className={`summary-card ${item.color}`}>
              <div className="summary-value">{item.value}</div>
              <div className="summary-label">{item.label}</div>
              <div className="summary-desc">{item.desc}</div>
            </div>
          ))}
        </div>
        <div className="records-header">
          <span className="records-title">Registros Recientes</span>
        </div>
        <div className="records-list">
          {records.map((rec) => (
            <div className="record-item" key={rec.id}>
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
          ))}
        </div>
      </div>
      <div className="recycle-footer">
        <span className="footer-title">Mi Historial de Reciclaje</span>
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