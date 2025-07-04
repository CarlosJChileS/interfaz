import React, { useState } from 'react';

export default function FeedbackPage() {
  const [msg, setMsg] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Gracias por tu retroalimentación');
    setMsg('');
  };
  return (
    <div style={{ padding: '20px' }}>
      <h2>Retroalimentación</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          style={{ width: '100%', height: '100px' }}
          placeholder="Escribe tus comentarios"
        />
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
