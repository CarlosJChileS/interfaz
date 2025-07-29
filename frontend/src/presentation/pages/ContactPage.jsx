import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../components/LanguageToggle';
import '../styles/ContactPage.css';

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = t('contact_error_name');
    if (!form.email.trim()) newErrors.email = t('contact_error_email');
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = t('contact_error_email_invalid');
    if (!form.asunto.trim()) newErrors.asunto = t('contact_error_subject');
    if (!form.mensaje.trim()) newErrors.mensaje = t('contact_error_message');
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
      <LanguageToggle className="lang-toggle-bottom-left" />
      <h2>{t('contact_title')}</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <label htmlFor="nombre">{t('contact_name')}</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        {errors.nombre && <span className="error">{errors.nombre}</span>}

        <label htmlFor="email">{t('contact_email')}</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <label htmlFor="asunto">{t('contact_subject')}</label>
        <input
          id="asunto"
          name="asunto"
          type="text"
          value={form.asunto}
          onChange={handleChange}
          required
        />
        {errors.asunto && <span className="error">{errors.asunto}</span>}

        <label htmlFor="mensaje">{t('contact_message')}</label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={form.mensaje}
          onChange={handleChange}
          required
        />
        {errors.mensaje && <span className="error">{errors.mensaje}</span>}

        {success && <div className="success">{t('contact_success')}</div>}
        <button type="submit">{t('contact_send')}</button>
      </form>
    </div>
  );
}
