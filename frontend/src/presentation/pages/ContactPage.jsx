import React, { useState } from 'react';
import '../styles/ContactPage.css';

export default function ContactPage() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.email.trim()) newErrors.email = 'El correo es obligatorio';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Correo inválido';
    if (!form.asunto.trim()) newErrors.asunto = 'El asunto es obligatorio';
    if (!form.mensaje.trim()) newErrors.mensaje = 'El mensaje es obligatorio';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      setSuccess(false);
    } else {
      setErrors({});
      setSuccess(true);
      setForm({ nombre: '', email: '', asunto: '', mensaje: '' });
    }
  };

  return (
    <div className="contact-container">
      <h2>Contáctanos</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        {errors.nombre && <span className="error">{errors.nombre}</span>}

        <label htmlFor="email">Correo Electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <label htmlFor="asunto">Asunto</label>
        <input
          id="asunto"
          name="asunto"
          type="text"
          value={form.asunto}
          onChange={handleChange}
          required
        />
        {errors.asunto && <span className="error">{errors.asunto}</span>}

        <label htmlFor="mensaje">Mensaje</label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={form.mensaje}
          onChange={handleChange}
          required
        />
        {errors.mensaje && <span className="error">{errors.mensaje}</span>}

        {success && <div className="success">¡Mensaje enviado con éxito!</div>}
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
