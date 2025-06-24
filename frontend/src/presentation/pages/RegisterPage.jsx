import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import styles from './RegisterPage.module.css';

// Configura tu Supabase aquí
const supabaseUrl =process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    facultad: '',
    programa: '',
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

    // Validación básica de correo institucional
    // if (!form.email.endsWith('@unal.edu.co')) {
    //   setLoading(false);
    //   setError('El correo debe ser institucional (@unal.edu.co)');
    //   return;
    // }

    // Registro en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nombre: form.nombre,
          apellidos: form.apellidos,
          telefono: form.telefono,
          facultad: form.facultad,
          programa: form.programa
        }
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      // Opcional: Redirige tras unos segundos o informa al usuario que revise el email
      setTimeout(() => navigate('/dashboard'), 1500);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logoCircle}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 3v2M12 19v2M5.64 7.64l-1.41-1.41M18.36 16.36l1.41 1.41M3 12H5M19 12h2M5.64 16.36l-1.41 1.41M18.36 7.64l1.41-1.41" stroke="#2196f3" strokeWidth="2"/>
            <circle cx="12" cy="12" r="7" stroke="#2196f3" strokeWidth="2"/>
          </svg>
        </div>
        <h2 className={styles.title}>Únete a EcoGestor</h2>
        <p className={styles.desc}>
          Forma parte de la comunidad universitaria más comprometida con el medio ambiente
        </p>
        <ul className={styles.benefits}>
          <li><span>✔</span> Encuentra puntos limpios cercanos</li>
          <li><span>✔</span> Gana puntos por reciclar</li>
          <li><span>✔</span> Canjea recompensas exclusivas</li>
          <li><span>✔</span> Contribuye al impacto ambiental</li>
        </ul>
      </div>
      <div className={styles.rightPanel}>
        <h2 className={styles.registerTitle}>Crear Cuenta</h2>
        <p className={styles.registerDesc}>Completa tus datos para comenzar</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.doubleInput}>
            <div>
              <label className={styles.label}>Nombre *</label>
              <input
                className={styles.input}
                placeholder="Ana María"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className={styles.label}>Apellidos *</label>
              <input
                className={styles.input}
                placeholder="González Pérez"
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <label className={styles.label}>Correo Institucional *</label>
          <input
            className={styles.input}
            type="email"
            placeholder="ana.gonzalez@unal.edu.co"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <small className={styles.note}>Debe ser tu correo institucional (@unal.edu.co)</small>
          <div className={styles.doubleInput}>
            <div>
              <label className={styles.label}>Teléfono *</label>
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
                />
              </div>
            </div>
            <div>
              <label className={styles.label}>Facultad *</label>
              <select
                className={styles.input}
                name="facultad"
                value={form.facultad}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar</option>
                <option>Ingeniería</option>
                <option>Medicina</option>
                <option>Ciencias</option>
              </select>
            </div>
          </div>
          <label className={styles.label}>Programa Académico *</label>
          <select
            className={styles.input}
            name="programa"
            value={form.programa}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar</option>
            <option>Ingeniería Ambiental</option>
            <option>Ingeniería Civil</option>
            <option>Biología</option>
          </select>
          <label className={styles.label}>Contraseña *</label>
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
            />
            <span
              className={styles.iconEye}
              onClick={() => setShowPassword(s => !s)}
              style={{ cursor: 'pointer' }}
              title="Mostrar/Ocultar"
            >
              {showPassword ? (
                <svg width="18" height="18" fill="none"><path d="M1 9c2-4 7-7 8-7s6 3 8 7c-2 4-7 7-8 7s-6-3-8-7z" stroke="#888" strokeWidth="1.5"/><circle cx="9" cy="9" r="2" fill="#888"/></svg>
              ) : (
                <svg width="18" height="18" fill="none"><path d="M1 9c2-4 7-7 8-7s6 3 8 7c-2 4-7 7-8 7s-6-3-8-7z" stroke="#888" strokeWidth="1.5"/><path d="M3 3l12 12" stroke="#888" strokeWidth="1.5"/></svg>
              )}
            </span>
          </div>
          <small className={styles.note}>Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números</small>
          {error && <div className={styles.errorMsg}>{error}</div>}
          {success && <div className={styles.successMsg}>¡Registro exitoso! Revisa tu correo para confirmar la cuenta.</div>}
          <button type="submit" className={styles.registerBtn} disabled={loading}>
            {loading ? 'Creando...' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}