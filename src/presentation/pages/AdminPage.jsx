import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../components/LanguageToggle";
import ExchangeManagement from "../components/ExchangeManagement";
import styles from "../styles/AdminPage.module.css";

export default function AdminPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("exchanges");

  const tabs = [
    { id: "exchanges", label: t('admin_exchanges_section'), icon: "🔄" },
    { id: "rewards", label: t('admin_rewards_section'), icon: "🎁" },
    { id: "users", label: "Gestión de Usuarios", icon: "👥" },
    { id: "reports", label: "Reportes", icon: "📊" }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "exchanges":
        return <ExchangeManagement />;
      case "rewards":
        return (
          <div className={styles.section}>
            <h3>{t('admin_rewards_section')}</h3>
            <p>Gestión de recompensas - Próximamente</p>
            <div className={styles.comingSoon}>
              <p>Esta sección permitirá:</p>
              <ul>
                <li>Agregar nuevas recompensas</li>
                <li>Editar recompensas existentes</li>
                <li>Gestionar stock y disponibilidad</li>
                <li>Configurar categorías y precios</li>
              </ul>
            </div>
          </div>
        );
      case "users":
        return (
          <div className={styles.section}>
            <h3>Gestión de Usuarios</h3>
            <p>Administración de usuarios - Próximamente</p>
          </div>
        );
      case "reports":
        return (
          <div className={styles.section}>
            <h3>Reportes y Estadísticas</h3>
            <p>Sistema de reportes - Próximamente</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.adminContainer}>
      <LanguageToggle className="lang-toggle-bottom-left" />
      
      <div className={styles.header}>
        <h1>{t('admin_title')}</h1>
        <p className={styles.subtitle}>{t('admin_subtitle')}</p>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
