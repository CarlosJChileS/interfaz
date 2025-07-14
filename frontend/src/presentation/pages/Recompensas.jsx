import React, { useState } from "react";
import { FaCoffee, FaBook, FaLeaf, FaPercent } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RedeemModal from "../components/RedeemModal";
import "../styles/Recompensas.css";

export default function Recompensas() {
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState("Todas");
  const [puntos, setPuntos] = useState(1250);
  const [rewardSel, setRewardSel] = useState(null);

  const categorias = [
    { key: "Todas", label: "Todas (23)" },
    { key: "Cafetería", label: "Cafetería (8)" },
    { key: "Papelería", label: "Papelería (6)" },
    { key: "Eco-Productos", label: "Eco-Productos (5)" },
    { key: "Descuentos", label: "Descuentos (4)" },
  ];

  const recompensas = [
    {
      id: 1,
      nombre: "Café Gratis",
      sub: "Cafetería Central",
      desc:
        "Válido por un café americano o capuchino en la cafetería principal del campus",
      costo: 150,
      categoria: "Cafetería",
      icon: FaCoffee,
      cls: "cafe",
    },
    {
      id: 2,
      nombre: "Descuento 20% Libros",
      sub: "Librería Universitaria",
      desc:
        "20% de descuento en cualquier libro académico de literatura en la librería",
      costo: 300,
      categoria: "Papelería",
      icon: FaBook,
      cls: "libros",
    },
    {
      id: 3,
      nombre: "Botella Reutilizable",
      sub: "Producto Eco-Friendly",
      desc:
        "Botella de acero inoxidable de 500ml con diseño exclusivo de la universidad",
      costo: 500,
      categoria: "Eco-Productos",
      icon: FaLeaf,
      cls: "eco",
    },
    {
      id: 4,
      nombre: "Almuerzo Gratis",
      sub: "Restaurante Universitario",
      desc:
        "Almuerzo completo en el restaurante universitario, incluye entrada, plato fuerte y bebida",
      costo: 400,
      categoria: "Descuentos",
      icon: FaPercent,
      cls: "almuerzo",
    },
  ];

  const lista =
    categoria === "Todas"
      ? recompensas
      : recompensas.filter((r) => r.categoria === categoria);

  const handleConfirm = () => {
    setPuntos((p) => p - rewardSel.costo);
    alert(`Canjeaste: ${rewardSel.nombre}`);
    setRewardSel(null);
  };

  return (
    <div className="recompensas-root">
      <div className="recompensas-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Volver">←</button>
        <span>Recompensas</span>
        <div className="recompensas-puntos">
          <span>{puntos.toLocaleString()}</span> Puntos disponibles
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
          <h3>Recompensas Más Populares</h3>
          <div className="populares-grid">
            {lista.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.id} className={`pop-card ${r.cls}`}>
                  <Icon className="pop-icon" />
                  <h4>{r.nombre}</h4>
                  <p className="pop-sub">{r.sub}</p>
                  <p>{r.desc}</p>
                  <span className="puntos">{r.costo} puntos</span>
                  <button className="pop-btn" onClick={() => setRewardSel(r)}>
                    Canjear
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="recompensas-recientes">
          <h4>Mis Canjes Recientes</h4>
          <div className="canje-item">
            <span className="canje-tipo cafe">Café Gratis - Cafetería Central</span>
            <span className="canje-pts neg">-150 pts</span>
            <span className="canje-detalle">Canjeado hace 2 días - Código: C7204D01</span>
          </div>
          <div className="canje-item">
            <span className="canje-tipo libros">Descuento 20% - Librería Universitaria</span>
            <span className="canje-pts neg">-300 pts</span>
            <span className="canje-detalle">Canjeado hace 1 semana - Código: LB202415</span>
          </div>
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
