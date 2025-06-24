import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import styles from '../styles/LoginPage.module.css';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Login attempt:', { email, password });
    const response = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    console.log('Login response:', response);
    if (response.error) {
      setError(response.error.message);
    } else if (response.data?.session) {
      navigate('/dashboard');
    } else {
      setError('No session returned. ¿Confirmaste tu correo?');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.logoCircle}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 3v2M12 19v2M5.64 7.64l-1.41-1.41M18.36 16.36l1.41 1.41M3 12H5M19 12h2M5.64 16.36l-1.41 1.41M18.36 7.64l1.41-1.41" stroke="#4caf50" strokeWidth="2"/>
            <circle cx="12" cy="12" r="7" stroke="#4caf50" strokeWidth="2"/>
          </svg>
        </div>
        <h2 className={styles.welcome}>¡Bienvenido de vuelta!</h2>
        <p className={styles.desc}>
          Continúa tu impacto ambiental en el campus universitario
        </p>
        <div className={styles.statsRow}>
          <div>
            <span className={styles.statsNumber}>2,847</span>
            <span className={styles.statsLabel}>Estudiantes</span>
          </div>
          <div>
            <span className={styles.statsNumber}>15.2 Ton</span>
            <span className={styles.statsLabel}>Recicladas</span>
          </div>
          <div>
            <span className={styles.statsNumber}>45</span>
            <span className={styles.statsLabel}>Puntos Limpios</span>
          </div>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <h2 className={styles.loginTitle}>Iniciar Sesión</h2>
        <p className={styles.loginDesc}>Ingresa tus credenciales para acceder</p>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>Correo Electrónico *</label>
          <div className={styles.inputIcon}>
            <span className={styles.icon}>
              <svg width="18" height="18" fill="none"><path d="M2 4h14v10H2z" stroke="#888" strokeWidth="1.5"/><path d="M2 4l7 6 7-6" stroke="#888" strokeWidth="1.5"/></svg>
            </span>
            <input
              className={styles.input}
              type="email"
              placeholder="tu.correo@unal.edu.co"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <label className={styles.label}>Contraseña *</label>
          <div className={styles.inputIcon}>
            <span className={styles.icon}>
              <svg width="18" height="18" fill="none"><circle cx="9" cy="9" r="7" stroke="#888" strokeWidth="1.5"/><circle cx="9" cy="9" r="2" fill="#888"/></svg>
            </span>
            <input
              className={styles.input}
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
          <div className={styles.optionsRow}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" /> Recordarme
            </label>
            <a href="#" className={styles.forgot}>¿Olvidaste tu contraseña?</a>
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div className={styles.registerRow}>
          <span>¿No tienes cuenta?</span>
          <a href="/register" className={styles.registerLink}>Regístrate aquí</a>
        </div>
        <p className={styles.terms}>
          Al iniciar sesión aceptas nuestros Términos y Condiciones
        </p>
      </div>
    </div>
  );
}