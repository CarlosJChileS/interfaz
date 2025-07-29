import React, { useEffect, useState } from "react";
import { FaCoffee, FaBook, FaLeaf, FaPercent, FaGift } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../../utils/supabase";
import RedeemModal from "../components/RedeemModal";
import "../styles/Recompensas.css";

// Iconos por categoría
const iconosCat = {
  "Cafetería": FaCoffee,
  "Papelería": FaBook,
  "Eco-Productos": FaLeaf,
  "Descuentos": FaPercent,
};

export default function Recompensas() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState(t('rewards_category_all'));
  const [puntos, setPuntos] = useState(0);
  const [rewardSel, setRewardSel] = useState(null);
  const [recompensas, setRecompensas] = useState([]);
  const [canjes, setCanjes] = useState([]);
  
  const categorias = [
    { key: "Todas", label: t('rewards_category_all') },
    { key: "Cafetería", label: t('rewards_category_cafeteria') },
    { key: "Papelería", label: t('rewards_category_stationery') },
    { key: "Eco-Productos", label: t('rewards_category_eco') },
    { key: "Descuentos", label: t('rewards_category_discounts') },
  ];

  useEffect(() => {
    setCategoria(t('rewards_category_all'));
  }, [t]);

  useEffect(() => {
    async function fetchData() {
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Puntos del usuario
      const { data: perfil } = await supabase
        .from("perfil")
        .select("puntos")
        .eq("auth_id", user.id)
        .single();
      if (perfil && typeof perfil.puntos === "number") setPuntos(perfil.puntos);

      // Recompensas disponibles
      const { data: recomp } = await supabase
        .from("recompensa")
        .select("id, nombre, descripcion, puntos_necesarios, stock, activo, categoria")
        .eq("activo", true)
        .gt("stock", 0)
        .order("puntos_necesarios", { ascending: true });

      // Añadir iconos y clases
      const recompensasFormateadas = (recomp || []).map(r => ({
        id: r.id,
        nombre: r.nombre,
        sub: r.categoria,
        desc: r.descripcion,
        costo: r.puntos_necesarios,
        categoria: r.categoria,
        icon: iconosCat[r.categoria] || FaGift,
        cls: r.categoria?.toLowerCase().replace(/[^a-z]/gi, "") || "default",
        stock: r.stock
      }));
      setRecompensas(recompensasFormateadas);

      // Canjes recientes
      const { data: canjeData } = await supabase
        .from("canje_recompensa")
        .select("id, fecha, estado, recompensa(nombre, categoria, puntos_necesarios), codigo")
        .eq("auth_id", user.id)
        .order("fecha", { ascending: false })
        .limit(5);

      setCanjes((canjeData || []).map(c => ({
        id: c.id,
        nombre: c.recompensa?.nombre,
        categoria: c.recompensa?.categoria,
        costo: c.recompensa?.puntos_necesarios,
        fecha: c.fecha,
        codigo: c.codigo || "",
        estado: c.estado,
      })));
    }
    fetchData();
  }, []);

  // Función para obtener la categoría original desde la traducción
  const getOriginalCategory = (translatedCategory) => {
    const categoryMap = {
      [t('rewards_category_all')]: "Todas",
      [t('rewards_category_cafeteria')]: "Cafetería",
      [t('rewards_category_stationery')]: "Papelería",
      [t('rewards_category_eco')]: "Eco-Productos",
      [t('rewards_category_discounts')]: "Descuentos"
    };
    return categoryMap[translatedCategory] || translatedCategory;
  };

  const lista =
    categoria === t('rewards_category_all')
      ? recompensas
      : recompensas.filter((r) => r.categoria === getOriginalCategory(categoria));

  const handleConfirm = async () => {
    // Registrar el canje en supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !rewardSel) return;

    if (puntos < rewardSel.costo) {
      alert(t('rewards_insufficient_points'));
      return;
    }
    if (rewardSel.stock <= 0) {
      alert(t('rewards_no_stock'));
      return;
    }

    // Inserta el canje con auth_id
    const { error: insertError } = await supabase
      .from("canje_recompensa")
      .insert({
        auth_id: user.id,
        recompensa_id: rewardSel.id,
        estado: "solicitado"
      });

    if (insertError) {
      alert(t('rewards_exchange_error'));
      return;
    }

    // Actualiza puntos del usuario
    const { error: puntosError } = await supabase
      .from("perfil")
      .update({ puntos: puntos - rewardSel.costo })
      .eq("auth_id", user.id);

    // Actualiza stock de la recompensa
    const { error: stockError } = await supabase
      .from("recompensa")
      .update({ stock: rewardSel.stock - 1 })
      .eq("id", rewardSel.id);

    // **NUEVO: Inserta registro en historial**
    await supabase
      .from("historial")
      .insert({
        auth_id: user.id,
        accion: "Canje de recompensa",
        descripcion: `Canjeaste ${rewardSel.nombre} (${rewardSel.categoria}) por ${rewardSel.costo} puntos.`,
        fecha: new Date().toISOString(),
        puntos: -rewardSel.costo
      });

    if (puntosError || stockError) {
      alert(t('rewards_update_error'));
      return;
    }

    setPuntos(p => p - rewardSel.costo);
    alert(`${t('rewards_success')} ${rewardSel.nombre}`);
    setRewardSel(null);
    // Opcional: recargar recompensas y canjes
  };

  return (
    <div className="recompensas-root">
      <div className="recompensas-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label={t('common_back')}>←</button>
        <span>{t('rewards_title')}</span>
        <div className="recompensas-puntos">
          <span>{puntos.toLocaleString()}</span> {t('rewards_available_points')}
        </div>
      </div>
      <div className="recompensas-content">
        <div className="recompensas-categorias">
          {categorias.map((c) => (
            <span
              key={c.key}
              className={`categoria ${categoria === c.key ? "selected" : ""}`}
              onClick={() => setCategoria(c.key)}
            >
              {c.label}
            </span>
          ))}
        </div>
        <div className="recompensas-mas-populares">
          <h3>{t('rewards_popular')}</h3>
          <div className="populares-grid">
            {lista.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.id} className={`pop-card ${r.cls}`}>
                  <Icon className="pop-icon" />
                  <h4>{r.nombre}</h4>
                  <p className="pop-sub">{r.sub}</p>
                  <p>{r.desc}</p>
                  <span className="puntos">{r.costo} {t('common_points')}</span>
                  <button className="pop-btn" onClick={() => setRewardSel(r)}>
                    {t('rewards_redeem')}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="recompensas-recientes">
          <h4>{t('rewards_recent_exchanges')}</h4>
          {canjes.length === 0 ? (
            <div className="canje-item">{t('rewards_no_recent')}</div>
          ) : (
            canjes.map((c) => (
              <div key={c.id} className="canje-item">
                <span className={`canje-tipo ${c.categoria?.toLowerCase()}`}>{c.nombre} - {c.categoria}</span>
                <span className="canje-pts neg">-{c.costo} pts</span>
                <span className="canje-detalle">
                  {t('rewards_exchanged_on')} {new Date(c.fecha).toLocaleDateString()} {c.codigo && `- ${t('rewards_code')} ${c.codigo}`}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      {rewardSel && (
        <RedeemModal
          reward={rewardSel}
          onCancel={() => setRewardSel(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}