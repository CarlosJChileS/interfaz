import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../utils/supabase';
import LanguageToggle from '../components/LanguageToggle';
import styles from '../styles/RegisterPage.module.css';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Registro en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nombre: form.nombre,
          apellidos: form.apellidos,
          telefono: form.telefono
        }
      }
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    // Si el registro en Auth fue exitoso, crea el usuario en tu tabla propia
    // data.user contiene el objeto de usuario, su id es el UUID que necesitas
    const auth_id = data?.user?.id;
    if (auth_id) {
      // Crea el registro en tu tabla usuario
      const { error: dbError } = await supabase
        .from('usuario')
        .insert([{
          auth_id,
          nombre: form.nombre,
          email: form.email,
          password: form.password, // OJO: Normalmente NO guardes la password en tu tabla, solo en Auth
          rol: 'estudiante', // O asigna el rol que corresponda
          telefono: form.telefono
        }]);

      // Crea el registro en perfil
      await supabase
        .from('perfil')
        .insert([{
          auth_id,
          puntos: 0
        }]);

      if (dbError) {
        setLoading(false);
        setError('Error creando usuario en la base de datos interna');
        return;
      }
    }

    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2500);
  };
  return (
    <div className={styles.container}>
      <LanguageToggle className="lang-toggle-bottom-left" />
      <div className={styles.leftPanel}>
        <div className={styles.logoCircle}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 3v2M12 19v2M5.64 7.64l-1.41-1.41M18.36 16.36l1.41 1.41M3 12H5M19 12h2M5.64 16.36l-1.41 1.41M18.36 7.64l1.41-1.41" stroke="#2196f3" strokeWidth="2"/>
            <circle cx="12" cy="12" r="7" stroke="#2196f3" strokeWidth="2"/>
          </svg>
        </div>
        <h2 className={styles.title}>{t('register_join_title')}</h2>
        <p className={styles.desc}>
          {t('register_join_desc')}
        </p>
        <ul className={styles.benefits}>
          <li><span>✔</span> {t('register_benefit_1')}</li>
          <li><span>✔</span> {t('register_benefit_2')}</li>
          <li><span>✔</span> {t('register_benefit_3')}</li>
          <li><span>✔</span> {t('register_benefit_4')}</li>
        </ul>
      </div>
      <div className={styles.rightPanel}>
        <h2 className={styles.registerTitle}>{t('register_title')}</h2>
        <p className={styles.registerDesc}>{t('register_desc')}</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.doubleInput}>
            <div>
              <label className={styles.label}>{t('register_name')} *</label>
              <input
                className={styles.input}
                placeholder="Ana María"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                autoFocus
                aria-label={t('register_name')}
              />
            </div>
            <div>
              <label className={styles.label}>{t('register_lastname')} *</label>
              <input
                className={styles.input}
                placeholder="González Pérez"
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                required
                aria-label={t('register_lastname')}
              />
            </div>
          </div>
          <label className={styles.label}>{t('register_email')} *</label>
          <input
            className={styles.input}
            type="email"
            placeholder="ana.gonzalez@email.com"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            aria-label={t('register_email')}
          />
          <div className={styles.doubleInput}>
            <div>
              <label className={styles.label}>{t('register_phone')} *</label>
              <div className={styles.inputIcon}>
                <span className={styles.icon}>
                  <svg width="17" height="17" fill="none"><rect x="2" y="2" width="13" height="13" rx="3" stroke="#888" strokeWidth="1.3"/><circle cx="8.5" cy="12" r="1.2" fill="#888"/></svg>
                </span>
                <input
                  className={styles.input}
                  placeholder="+57 300 123 4567"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                  aria-label={t('register_phone')}
                />
              </div>
            </div>
          </div>
          <label className={styles.label}>{t('register_password')} *</label>
          <div className={styles.inputIcon}>
            <span className={styles.icon}>
              <svg width="18" height="18" fill="none"><circle cx="9" cy="9" r="7" stroke="#888" strokeWidth="1.5"/><circle cx="9" cy="9" r="2" fill="#888"/></svg>
            </span>
            <input
              className={styles.input}
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              minLength={8}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              aria-label={t('register_password')}
            />
            <span
              className={styles.iconEye}
              onClick={() => setShowPassword(s => !s)}
              style={{ cursor: 'pointer' }}
              title={t('register_show_password')}
            >
              {showPassword ? (
                <svg width="18" height="18" fill="none"><path d="M1 9c2-4 7-7 8-7s6 3 8 7c-2 4-7 7-8 7s-6-3-8-7z" stroke="#888" strokeWidth="1.5"/><circle cx="9" cy="9" r="2" fill="#888"/></svg>
              ) : (
                <svg width="18" height="18" fill="none"><path d="M1 9c2-4 7-7 8-7s6 3 8 7c-2 4-7 7-8 7s-6-3-8-7z" stroke="#888" strokeWidth="1.5"/><path d="M3 3l12 12" stroke="#888" strokeWidth="1.5"/></svg>
              )}
            </span>
          </div>
          <small className={styles.note}>{t('register_note')}</small>
          {error && (
            <div className={styles.errorMsg} aria-live="assertive">
              {error}
            </div>
          )}
          {success && (
            <div className={styles.successMsg} aria-live="polite">
              {t('register_success')}
            </div>
          )}
          <button type="submit" className={styles.registerBtn} disabled={loading}>
            {loading ? t('register_loading') : t('register_submit')}
          </button>
        </form>
      </div>
    </div>
  );
}