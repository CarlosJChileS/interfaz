import React from "react";
import LanguageToggle from "../components/LanguageToggle";

export default function AdminPage() {
  return (
    <div style={{ padding: "20px" }}>
      <LanguageToggle className="lang-toggle-bottom-left" />
      <h2>Panel de Administrador</h2>
      <p>Sección exclusiva para la administración.</p>
    </div>
  );
}
