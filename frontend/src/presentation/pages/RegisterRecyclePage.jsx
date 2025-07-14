import React, { useState } from "react";
import styles from "../styles/RegisterRecyclePage.module.css";
import ConfirmModal from "./ConfirmModal";

const pointsPerMaterial = {
  "Papel y Cartón": 5,
  "Plásticos PET": 8,
  Metales: 12,
  Vidrio: 6,
};

export default function RegisterRecyclePage() {
  const [selectedPoint, setSelectedPoint] = useState(true);
  const [selectedMaterials, setSelectedMaterials] = useState({
    "Papel y Cartón": null,
    "Plásticos PET": null,
    Metales: "1 kg",
    Vidrio: null,
  });
  const [showModal, setShowModal] = useState(false);

  const materialOptions = ["0.5 kg", "1 kg", "2+ kg"];

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

  function handleMaterialSelect(mat, qty) {
    setSelectedMaterials(prev => ({ ...prev, [mat]: qty }));
  }

  function handleConfirm() {
    setShowModal(true);
  }

  return (
    <div className={styles.pageBg}>
      <header className={styles.headerBar}>
        <span>Inicio</span>
        <span className={styles.chevron}>›</span>
        <span className={styles.linkGreen}>Registrar Reciclaje</span>
        <span className={styles.pageTitle}>Registrar Material Reciclado</span>
        <div className={styles.pointsBox}>
          <span className={styles.starIcon}>⭐</span>
          1,250 <span className={styles.pointsSmall}>Puntos actuales</span>
        </div>
      </header>

      <div className={styles.formWrap}>
        <section>
          <h3 className={styles.sectionTitle}>1. Selecciona el Punto Limpio</h3>
          <div
            className={styles.pointBox + " " + (selectedPoint && styles.pointBoxActive)}
            onClick={() => setSelectedPoint(true)}
          >
            <div>
              <div className={styles.pointTitle}>
                <span className={styles.pointIcon}>📍</span>
                Biblioteca Central
              </div>
              <div className={styles.pointDesc}>Primer piso, junto a la entrada principal</div>
              <div className={styles.pointDistance}>120m de tu ubicación</div>
            </div>
            <div>
              <button className={styles.mapBtn}>Ver Mapa</button>
            </div>
          </div>
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
                <b>Biblioteca Central - Primer piso</b>
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
              {selectedMaterials["Metales"] && (
                <div className={styles.sumLineBlue}>
                  <span>⚡ Metales - {selectedMaterials["Metales"]}</span>
                  <span>+12 puntos</span>
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
          ></textarea>
        </div>
        <div className={styles.actionBtns}>
          <button className={styles.cancelBtn}>Cancelar</button>
          <button className={styles.confirmBtn} onClick={handleConfirm} type="button">
            Confirmar Registro
          </button>
        </div>
      </div>

      {showModal && (
        <ConfirmModal
          points={totalPoints}
          details={selectedEntries}
          total={1250 + totalPoints}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
