import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

export default function EditProfilePage() {
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
        programa: form.programa
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
    return <div style={{ padding: '20px' }}>Cargando...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <label>Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
          required
        />
        <label>Apellidos</label>
        <input
          name="apellidos"
          value={form.apellidos}
          onChange={handleChange}
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
          required
        />
        <label>Correo</label>
        <input
          value={form.email}
          disabled
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />
        <label>Teléfono</label>
        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />
        <label>Facultad</label>
        <input
          name="facultad"
          value={form.facultad}
          onChange={handleChange}
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />
        <label>Programa</label>
        <input
          name="programa"
          value={form.programa}
          onChange={handleChange}
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />
        {msg && (
          <div style={{ margin: '8px 0', color: msg.includes('exitosamente') ? 'green' : 'red' }}>{msg}</div>
        )}
        <button type="submit" disabled={saving} style={{ padding: '8px 16px' }}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" onClick={() => navigate('/perfil')} style={{ marginLeft: 8, padding: '8px 16px' }}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
