import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../ThemeContext';
import '../styles/ThemeToggle.css';

const ThemeToggle = ({ className = '' }) => {
  const { dark, toggleDark } = useTheme();
  return (
    <button
      onClick={toggleDark}
      className={`theme-toggle ${className}`}
      aria-label="Modo oscuro"
    >
      {dark ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default ThemeToggle;
