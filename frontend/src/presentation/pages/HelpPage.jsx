import React from 'react';
import NavBar from '../components/NavBar';

export default function HelpPage() {
  return (
    <div style={{ padding: '20px' }}>
      <NavBar />
      <h2>Ayuda / Help</h2>
      <p>Usa el menú para navegar por las secciones y registrar tu reciclaje.</p>
      <p>Para soporte adicional contáctanos en eco@univ.edu.</p>
    </div>
  );
}
