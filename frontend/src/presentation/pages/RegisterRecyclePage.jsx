import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../styles/RegisterRecyclePage.module.css";
import ConfirmModal from "../components/ConfirmModal";
import { supabase } from "../../utils/supabase";
import { usePuntos } from "../../PuntosContext";

const pointsPerMaterial = {
  "Papel y Cartón": 5,
  "Plásticos PET": 8,
  Metales: 12,
  Vidrio: 6,
};

export default function RegisterRecyclePage() {
  const { t } = useTranslation();
  const { puntos, refreshPuntos } = usePuntos();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState({
    "Papel y Cartón": null,
    "Plásticos PET": null,
    Metales: null,
    Vidrio: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [observaciones, setObservaciones] = useState("");
  const [authId, setAuthId] = useState(null);
  const navigate = useNavigate();

  const materialOptions = ["0.5 kg", "1 kg", "2+ kg"];
  const selectedPointData = selectedPoint ? puntos.find(p => p.id === selectedPoint) : null;
  const selectedEntries = Object.entries(selectedMaterials).filter(([, qty]) => qty);

  const totalPoints = selectedEntries.reduce(
    (acc, [material, qty]) =>
      acc +
      (qty === "1 kg"
        ? pointsPerMaterial[material]
        : qty === "0.5 kg"
        ? Math.round(pointsPerMaterial[material] / 2)
        : pointsPerMaterial[material] * 2),
    0
  );

  useEffect(() => {
    async function getUserInfo() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAuthId(user.id);
        const { data: perfil } = await supabase
          .from("perfil")
          .select("puntos")
          .eq("auth_id", user.id)
          .single();
        if (perfil && typeof perfil.puntos === "number") {
          setUserPoints(perfil.puntos);
        }
      }
    }
    getUserInfo();
  }, []);

  function handleMaterialSelect(mat, qty) {
    setSelectedMaterials(prev => ({ ...prev, [mat]: qty }));
  }

  async function handleConfirm() {
    if (!selectedPointData || selectedEntries.length === 0 || !authId) {
      alert("Selecciona un punto limpio y al menos un material reciclado.");
      return;
    }
    let success = true;
    const nowISOString = new Date().toISOString();

    // Registra reciclaje y historial en supabase
    for (const [material, cantidad] of selectedEntries) {
      // Insertar en solicitud_recoleccion
      const { error } = await supabase
        .from("solicitud_recoleccion")
        .insert({
          auth_id: authId,
          direccion: selectedPointData.nombre,
          fecha: nowISOString.slice(0, 10),
          tipo_residuo: material,
          estado: "completado",
          fecha_creacion: nowISOString,
          cantidad: cantidad,
          observaciones,
        });
      if (error) success = false;

      // Insertar en historial 
      const puntosMaterial = (cantidad === "1 kg"
        ? pointsPerMaterial[material]
        : cantidad === "0.5 kg"
        ? Math.round(pointsPerMaterial[material] / 2)
        : pointsPerMaterial[material] * 2);

      await supabase
        .from("historial")
        .insert({
          auth_id: authId,
          accion: "Registro de reciclaje",
          descripcion: `Registraste ${cantidad} de ${material} en ${selectedPointData.nombre}.`,
          fecha: nowISOString,
          puntos: puntosMaterial
        });
    }
    // Actualiza puntos del usuario
    if (success) {
      await supabase
        .from("perfil")
        .update({ puntos: userPoints + totalPoints })
        .eq("auth_id", authId);
      if (refreshPuntos) refreshPuntos();
      setShowModal(true);
    } else {
      alert("Hubo un error al registrar el reciclaje.");
    }
  }

  return (
    <div className={styles.pageBg}>
      <header className={styles.headerBar}>
        <button type="button" className={styles.backBtn} onClick={() => navigate(-1)} aria-label={t('common_back')}>←</button>
        <span className={styles.linkGreen}>{t('register_recycle_title')}</span>
        <span className={styles.pageTitle}>{t('register_recycle_title')}</span>
        <div className={styles.pointsBox}>
          <span className={styles.starIcon}>⭐</span>
          {userPoints.toLocaleString()} <span className={styles.pointsSmall}>Puntos actuales</span>
        </div>
      </header>

      <div className={styles.formWrap}>
        <section>
          <h3 className={styles.sectionTitle}>1. Selecciona el Punto Limpio</h3>
          <div className={styles.filterBtns}>
            {["Papel y Cartón", "Plásticos PET", "Vidrio", "Metales"].map(cat => (
              <div
                key={cat}
                className={`${styles.filterBtn} ${selectedCategory === cat ? styles.filterBtnActive : ""}`}
                onClick={() => setSelectedCategory(cat)}
                role="button"
                tabIndex="0"
                onKeyDown={e => e.key === "Enter" && setSelectedCategory(cat)}
              >
                {cat}
              </div>
            ))}
            {selectedCategory && (
              <button type="button" className={styles.clearFilter} onClick={() => setSelectedCategory("")}>Todos</button>
            )}
          </div>
          {(selectedCategory ? puntos.filter(p => p.material === selectedCategory) : puntos).map(p => (
            <div
              key={p.id}
              className={`${styles.pointBox} ${selectedPoint === p.id ? styles.pointBoxActive : ""}`}
              onClick={() => setSelectedPoint(p.id)}
            >
              <div>
                <div className={styles.pointTitle}>
                  <span className={styles.pointIcon}>📍</span>
                  {p.nombre}
                </div>
                <div className={styles.pointDesc}>{p.material}</div>
                <div className={styles.pointDistance}>{p.estado}</div>
              </div>
              <div>
                <button
                  className={styles.mapBtn}
                  onClick={e => {
                    e.stopPropagation();
                    navigate(`/puntos?lat=${p.posicion[0]}&lng=${p.posicion[1]}`);
                  }}
                >
                  Ver Mapa
                </button>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h3 className={styles.sectionTitle}>2. Selecciona los Materiales Reciclados</h3>
          <div className={styles.materialsGrid}>
            <div
              className={
                styles.materialCard +
                " " +
                (selectedMaterials["Papel y Cartón"] && styles.selectedGreen)
              }
              onClick={() => handleMaterialSelect("Papel y Cartón", "1 kg")}
            >
              <div className={styles.matHeader}>
                <span className={styles.matIcon}>📄</span>
                <b>Papel y Cartón</b>
                <span className={styles.pointsBadge}>5 puntos por kg</span>
              </div>
              <div className={styles.matQty}>
                <div>Cantidad aproximada:</div>
                <div className={styles.matQtyBtns}>
                  {materialOptions.map(opt => (
                    <button
                      type="button"
                      className={
                        styles.qtyBtn +
                        " " +
                        (selectedMaterials["Papel y Cartón"] === opt
                          ? styles.qtyBtnActiveGreen
                          : "")
                      }
                      key={opt}
                      onClick={e => {
                        e.stopPropagation();
                        handleMaterialSelect("Papel y Cartón", opt);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {selectedMaterials["Papel y Cartón"] && <div className={styles.ptsSum}>+5 puntos</div>}
            </div>

            <div
              className={
                styles.materialCard +
                " " +
                (selectedMaterials["Plásticos PET"] && styles.selectedGray)
              }
              onClick={() => handleMaterialSelect("Plásticos PET", "1 kg")}
            >
              <div className={styles.matHeader}>
                <span className={styles.matIcon}>🧴</span>
                <b>Plásticos PET</b>
                <span className={styles.pointsBadge}>8 puntos por kg</span>
              </div>
              <div className={styles.matQty}>
                <div>Cantidad aproximada:</div>
                <div className={styles.matQtyBtns}>
                  {materialOptions.map(opt => (
                    <button
                      type="button"
                      className={
                        styles.qtyBtn +
                        " " +
                        (selectedMaterials["Plásticos PET"] === opt
                          ? styles.qtyBtnActiveGray
                          : "")
                      }
                      key={opt}
                      onClick={e => {
                        e.stopPropagation();
                        handleMaterialSelect("Plásticos PET", opt);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div
              className={
                styles.materialCard +
                " " +
                (selectedMaterials["Metales"] && styles.selectedBlue)
              }
              onClick={() => handleMaterialSelect("Metales", "1 kg")}
            >
              <div className={styles.matHeader}>
                <span className={styles.matIcon}>⚡</span>
                <b>Metales</b>
                <span className={styles.pointsBadgeBlue}>12 puntos por kg</span>
              </div>
              <div className={styles.matQty}>
                <div>Cantidad aproximada:</div>
                <div className={styles.matQtyBtns}>
                  {materialOptions.map(opt => (
                    <button
                      type="button"
                      className={
                        styles.qtyBtn +
                        " " +
                        (selectedMaterials["Metales"] === opt
                          ? styles.qtyBtnActiveBlue
                          : "")
                      }
                      key={opt}
                      onClick={e => {
                        e.stopPropagation();
                        handleMaterialSelect("Metales", opt);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {selectedMaterials["Metales"] && <div className={styles.ptsSumBlue}>+12 puntos</div>}
            </div>

            <div
              className={
                styles.materialCard +
                " " +
                (selectedMaterials["Vidrio"] && styles.selectedGray)
              }
              onClick={() => handleMaterialSelect("Vidrio", "1 kg")}
            >
              <div className={styles.matHeader}>
                <span className={styles.matIcon}>🍶</span>
                <b>Vidrio</b>
                <span className={styles.pointsBadgeGray}>6 puntos por kg</span>
              </div>
              <div className={styles.matQty}>
                <div>Cantidad aproximada:</div>
                <div className={styles.matQtyBtns}>
                  {materialOptions.map(opt => (
                    <button
                      type="button"
                      className={
                        styles.qtyBtn +
                        " " +
                        (selectedMaterials["Vidrio"] === opt
                          ? styles.qtyBtnActiveGray
                          : "")
                      }
                      key={opt}
                      onClick={e => {
                        e.stopPropagation();
                        handleMaterialSelect("Vidrio", opt);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className={styles.sectionTitle}>3. Confirma tu Registro</h3>
          <div className={styles.summaryBox}>
            <div className={styles.summaryHeader}>
              <span className={styles.pointIcon}>📍</span>
              <div>
                <b>
                  {selectedPointData
                    ? `${selectedPointData.nombre} - ${selectedPointData.material}`
                    : "Sin punto seleccionado"}
                </b>
              </div>
              <div className={styles.summaryTime}>
                <span>Hoy, 14:30</span>
              </div>
            </div>
            <div>
              {selectedMaterials["Papel y Cartón"] && (
                <div className={styles.sumLineGreen}>
                  <span>📄 Papel y Cartón - {selectedMaterials["Papel y Cartón"]}</span>
                  <span>+5 puntos</span>
                </div>
              )}
              {selectedMaterials["Plásticos PET"] && (
                <div className={styles.sumLineGreen}>
                  <span>♻️ Plásticos PET - {selectedMaterials["Plásticos PET"]}</span>
                  <span>+8 puntos</span>
                </div>
              )}
              {selectedMaterials["Metales"] && (
                <div className={styles.sumLineBlue}>
                  <span>⚡ Metales - {selectedMaterials["Metales"]}</span>
                  <span>+12 puntos</span>
                </div>
              )}
              {selectedMaterials["Vidrio"] && (
                <div className={styles.sumLineGray}>
                  <span>🍶 Vidrio - {selectedMaterials["Vidrio"]}</span>
                  <span>+6 puntos</span>
                </div>
              )}
            </div>
            <div className={styles.sumTotal}>
              <span>
                <span className={styles.starIcon}>⭐</span> Total de Puntos a Ganar:
              </span>
              <span className={styles.sumTotalNum}>+{totalPoints} puntos</span>
            </div>
          </div>
        </section>

        <div className={styles.obsBox}>
          <label htmlFor="obs" className={styles.obsLabel}>
            Observaciones Adicionales (Opcional)
          </label>
          <textarea
            id="obs"
            className={styles.obsInput}
            placeholder="Agrega cualquier comentario sobre el material reciclado..."
            value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.actionBtns}>
          <button className={styles.cancelBtn} type="button" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm} type="button">
            Confirmar Registro
          </button>
        </div>
      </div>

      {showModal && (
        <ConfirmModal
          points={totalPoints}
          details={selectedEntries}
          total={userPoints + totalPoints}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}