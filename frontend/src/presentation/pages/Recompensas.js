import React from "react";
import { FaCoffee, FaBook, FaLeaf, FaPercent } from "react-icons/fa";
import "../styles/Recompensas.css";

export default function Recompensas() {
  return (
    <div className="recompensas-root">
      <div className="recompensas-header">
        <span>Página Recompensas</span>
        <div className="recompensas-puntos">
          <span>1,250</span> Puntos disponibles
        </div>
      </div>
      <div className="recompensas-content">
        <div className="recompensas-categorias">
          <span className="categoria selected">Todas (23)</span>
          <span className="categoria">Cafetería (8)</span>
          <span className="categoria">Papelería (6)</span>
          <span className="categoria">Eco-Productos (5)</span>
          <span className="categoria">Descuentos (4)</span>
        </div>
        <div className="recompensas-mas-populares">
          <h3>Recompensas Más Populares</h3>
          <div className="populares-grid">
            <div className="pop-card cafe">
              <FaCoffee className="pop-icon" />
              <h4>Café Gratis</h4>
              <p className="pop-sub">Cafetería Central</p>
              <p>Válido por un café americano o capuchino en la cafetería principal del campus</p>
              <span className="puntos">150 puntos</span>
              <button className="pop-btn">Canjear</button>
            </div>
            <div className="pop-card libros">
              <FaBook className="pop-icon" />
              <h4>Descuento 20% Libros</h4>
              <p className="pop-sub">Librería Universitaria</p>
              <p>20% de descuento en cualquier libro académico de literatura en la librería</p>
              <span className="puntos">300 puntos</span>
              <button className="pop-btn">Canjear</button>
            </div>
            <div className="pop-card eco">
              <FaLeaf className="pop-icon" />
              <h4>Botella Reutilizable</h4>
              <p className="pop-sub">Producto Eco-Friendly</p>
              <p>Botella de acero inoxidable de 500ml con diseño exclusivo de la universidad</p>
              <span className="puntos">500 puntos</span>
              <button className="pop-btn">Canjear</button>
            </div>
            <div className="pop-card almuerzo">
              <FaPercent className="pop-icon" />
              <h4>Almuerzo Gratis</h4>
              <p className="pop-sub">Restaurante Universitario</p>
              <p>Almuerzo completo en el restaurante universitario, incluye entrada, plato fuerte y bebida</p>
              <span className="puntos">400 puntos</span>
              <button className="pop-btn">Canjear</button>
            </div>
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
    </div>
  );
}
