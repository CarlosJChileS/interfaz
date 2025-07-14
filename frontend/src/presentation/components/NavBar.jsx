import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/NavBar.css';

export default function NavBar() {
  const location = useLocation();
  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/puntos', label: 'Puntos' },
    { to: '/recompensas', label: 'Recompensas' },
    { to: '/ayuda', label: 'Ayuda' }
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <ul>
        {links.map(link => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                (isActive || location.pathname === link.to) ? 'active' : undefined
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
