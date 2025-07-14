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
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} />
        {errors.nombre && <span className="error">{errors.nombre}</span>}

        <label>Correo Electrónico</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}

        <label>Asunto</label>
        <input name="asunto" value={form.asunto} onChange={handleChange} />
        {errors.asunto && <span className="error">{errors.asunto}</span>}

        <label>Mensaje</label>
        <textarea name="mensaje" value={form.mensaje} onChange={handleChange} />
        {errors.mensaje && <span className="error">{errors.mensaje}</span>}

        {success && <div className="success">¡Mensaje enviado con éxito!</div>}
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
