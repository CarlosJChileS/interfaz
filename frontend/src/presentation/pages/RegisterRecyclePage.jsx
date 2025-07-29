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
      alert(t('register_recycle_error_selection'));
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
      alert(t('register_recycle_error_save'));
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
          {userPoints.toLocaleString()} <span className={styles.pointsSmall}>{t('register_recycle_current_points')}</span>
        </div>
      </header>

      <div className={styles.formWrap}>
        <section>
          <h3 className={styles.sectionTitle}>{t('register_recycle_step1')}</h3>
          <div className={styles.filterBtns}>
            {[
              { key: "Papel y Cartón", label: t('register_recycle_material_paper') },
              { key: "Plásticos PET", label: t('register_recycle_material_plastic') },
              { key: "Vidrio", label: t('register_recycle_material_glass') },
              { key: "Metales", label: t('register_recycle_material_metal') }
            ].map(cat => (
              <div
                key={cat.key}
                className={`${styles.filterBtn} ${selectedCategory === cat.key ? styles.filterBtnActive : ""}`}
                onClick={() => setSelectedCategory(cat.key)}
                role="button"
                tabIndex="0"
                onKeyDown={e => e.key === "Enter" && setSelectedCategory(cat.key)}
              >
                {cat.label}
              </div>
            ))}
            {selectedCategory && (
              <button type="button" className={styles.clearFilter} onClick={() => setSelectedCategory("")}>{t('register_recycle_filter_all')}</button>
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
                  {t('register_recycle_view_map')}
                </button>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h3 className={styles.sectionTitle}>{t('register_recycle_step2')}</h3>
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
                <b>{t('register_recycle_material_paper')}</b>
                <span className={styles.pointsBadge}>5 {t('register_recycle_points_per_kg')}</span>
              </div>
              <div className={styles.matQty}>
                <div>{t('register_recycle_quantity')}</div>
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
                <b>{t('register_recycle_material_plastic')}</b>
                <span className={styles.pointsBadge}>8 {t('register_recycle_points_per_kg')}</span>
              </div>
              <div className={styles.matQty}>
                <div>{t('register_recycle_quantity')}</div>
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
                <b>{t('register_recycle_material_metal')}</b>
                <span className={styles.pointsBadgeBlue}>12 {t('register_recycle_points_per_kg')}</span>
              </div>
              <div className={styles.matQty}>
                <div>{t('register_recycle_quantity')}</div>
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
                <b>{t('register_recycle_material_glass')}</b>
                <span className={styles.pointsBadgeGray}>6 {t('register_recycle_points_per_kg')}</span>
              </div>
              <div className={styles.matQty}>
                <div>{t('register_recycle_quantity')}</div>
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
          <h3 className={styles.sectionTitle}>{t('register_recycle_step3')}</h3>
          <div className={styles.summaryBox}>
            <div className={styles.summaryHeader}>
              <span className={styles.pointIcon}>📍</span>
              <div>
                <b>
                  {selectedPointData
                    ? `${selectedPointData.nombre} - ${selectedPointData.material}`
                    : t('register_recycle_no_point')}
                </b>
              </div>
              <div className={styles.summaryTime}>
                <span>{t('register_recycle_today')}</span>
              </div>
            </div>
            <div>
              {selectedMaterials["Papel y Cartón"] && (
                <div className={styles.sumLineGreen}>
                  <span>📄 {t('register_recycle_material_paper')} - {selectedMaterials["Papel y Cartón"]}</span>
                  <span>+5 puntos</span>
                </div>
              )}
              {selectedMaterials["Plásticos PET"] && (
                <div className={styles.sumLineGreen}>
                  <span>♻️ {t('register_recycle_material_plastic')} - {selectedMaterials["Plásticos PET"]}</span>
                  <span>+8 puntos</span>
                </div>
              )}
              {selectedMaterials["Metales"] && (
                <div className={styles.sumLineBlue}>
                  <span>⚡ {t('register_recycle_material_metal')} - {selectedMaterials["Metales"]}</span>
                  <span>+12 puntos</span>
                </div>
              )}
              {selectedMaterials["Vidrio"] && (
                <div className={styles.sumLineGray}>
                  <span>🍶 {t('register_recycle_material_glass')} - {selectedMaterials["Vidrio"]}</span>
                  <span>+6 puntos</span>
                </div>
              )}
            </div>
            <div className={styles.sumTotal}>
              <span>
                <span className={styles.starIcon}>⭐</span> {t('register_recycle_total_points')}
              </span>
              <span className={styles.sumTotalNum}>+{totalPoints} puntos</span>
            </div>
          </div>
        </section>

        <div className={styles.obsBox}>
          <label htmlFor="obs" className={styles.obsLabel}>
            {t('register_recycle_observations')}
          </label>
          <textarea
            id="obs"
            className={styles.obsInput}
            placeholder={t('register_recycle_observations_placeholder')}
            value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.actionBtns}>
          <button className={styles.cancelBtn} type="button" onClick={() => navigate(-1)}>
            {t('register_recycle_cancel')}
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm} type="button">
            {t('register_recycle_confirm')}
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