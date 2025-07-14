import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

export default function NavBar() {
  return (
    <nav className="main-navbar">
      <div className="nav-logo">
        <Link to="/">EcoGestor</Link>
      </div>
      <ul>
        <li><Link to="/login">Ingresar</Link></li>
        <li><Link to="/register">Registrarse</Link></li>
      </ul>
    </nav>
  );
}
