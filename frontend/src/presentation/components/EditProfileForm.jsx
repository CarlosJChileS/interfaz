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

    try {
      // Actualiza user_metadata en Supabase Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          nombre: form.nombre,
          apellidos: form.apellidos,
          telefono: form.telefono,
        }
      });

      // Actualiza también los datos en la tabla usuario
      let dbError = null;
      if (authId) {
        const { error } = await supabase
          .from("usuario")
          .upsert({
            auth_id: authId,
            telefono: form.telefono,
          }, {
            onConflict: 'auth_id'
          });
        dbError = error;
      }

      if (authError || dbError) {
        throw new Error(authError?.message || dbError?.message || 'Error al actualizar');
      }

      setMsg('✅ Perfil actualizado exitosamente');
      setTimeout(() => onClose(), 1500);

    } catch (error) {
      setMsg('❌ ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="editprofile-loading">Cargando...</div>;
  }

  return (
    <div className="editprofile-form-wrapper" id="editar">
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="editprofile-form">
        <div>
          <label>Nombre *</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
            required
          />
        </div>
        
        <div>
          <label>Apellidos *</label>
          <input
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            placeholder="Ingresa tus apellidos"
            required
          />
        </div>
        
        <div>
          <label>Correo Electrónico</label>
          <input 
            value={form.email} 
            disabled 
            placeholder="No se puede modificar"
          />
        </div>
        
        <div>
          <label>Teléfono</label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Ej: +57 300 123 4567"
            type="tel"
          />
        </div>
        
        {msg && (
          <div className={msg.includes('exitosamente') ? 'msg-success' : 'msg-error'}>
            {msg}
          </div>
        )}
        
        <div className="editprofile-actions">
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancelar
          </button>
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}