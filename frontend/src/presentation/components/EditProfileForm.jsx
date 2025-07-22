import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfileForm.css';

export default function EditProfileForm({ onClose }) {
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
  const [authId, setAuthId] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setLoading(false);
        return;
      }
      setAuthId(user.id);
      const meta = user.user_metadata || {};
      const { data: usuario } = await supabase
        .from("usuario")
        .select("telefono, facultad, programa")
        .eq("auth_id", user.id)
        .single();

      setForm({
        nombre: meta.nombre || '',
        apellidos: meta.apellidos || '',
        telefono: usuario?.telefono || meta.telefono || '',
        facultad: usuario?.facultad || meta.facultad || '',
        programa: usuario?.programa || meta.programa || '',
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
    // Actualiza user_metadata en Supabase Auth
    const { error } = await supabase.auth.updateUser({
      data: {
        nombre: form.nombre,
        apellidos: form.apellidos,
        telefono: form.telefono
      }
    });
    // Actualiza también los datos en la tabla perfil
    let errorPerfil = null;
    if (authId) {
      const { error: err2 } = await supabase
        .from("usuario")
        .update({
          telefono: form.telefono,
        })
        .eq("auth_id", authId);
      errorPerfil = err2;
    }
    if (error || errorPerfil) {
      setMsg((error?.message || errorPerfil?.message) || 'Error al actualizar');
    } else {
      setMsg('Perfil actualizado exitosamente');
      setTimeout(() => onClose(), 1200);
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
        {msg && (
          <div className={msg.includes('exitosamente') ? 'msg-success' : 'msg-error'}>{msg}</div>
        )}
        <div className="editprofile-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}