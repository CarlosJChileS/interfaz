import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfileForm.css';

export default function EditProfileForm() {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    facultad: '',
    programa: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setLoading(false);
        return;
      }
      const meta = user.user_metadata || {};
      setForm({
        nombre: meta.nombre || '',
        apellidos: meta.apellidos || '',
        telefono: meta.telefono || '',
        facultad: meta.facultad || '',
        programa: meta.programa || '',
        email: user.email || ''
      });
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    const { error } = await supabase.auth.updateUser({
      data: {
        nombre: form.nombre,
        apellidos: form.apellidos,
        telefono: form.telefono,
        facultad: form.facultad,
        programa: form.programa,
      }
    });
    if (error) {
      setMsg(error.message || 'Error al actualizar');
    } else {
      setMsg('Perfil actualizado exitosamente');
      setTimeout(() => navigate('/perfil'), 1500);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="editprofile-loading">Cargando...</div>;
  }

  return (
    <div className="editprofile-form-wrapper" id="editar">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="editprofile-form">
        <label>Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <label>Apellidos</label>
        <input
          name="apellidos"
          value={form.apellidos}
          onChange={handleChange}
          required
        />
        <label>Correo</label>
        <input value={form.email} disabled />
        <label>Teléfono</label>
        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
        />
        <label>Facultad</label>
        <input
          name="facultad"
          value={form.facultad}
          onChange={handleChange}
        />
        <label>Programa</label>
        <input
          name="programa"
          value={form.programa}
          onChange={handleChange}
        />
        {msg && (
          <div className={msg.includes('exitosamente') ? 'msg-success' : 'msg-error'}>{msg}</div>
        )}
        <div className="editprofile-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={() => navigate('/perfil')} className="cancel-btn">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
