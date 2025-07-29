import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useTranslation } from 'react-i18next';
import '../styles/EditProfileForm.css';

export default function EditProfileForm({ onClose }) {
  const { t } = useTranslation();
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

      setMsg(t('edit_profile_success'));
      setTimeout(() => onClose(), 1500);

    } catch (error) {
      setMsg('❌ ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="editprofile-loading">{t('common_loading')}</div>;
  }

  return (
    <div className="editprofile-form-wrapper" id="editar">
      <h2>{t('edit_profile_title')}</h2>
      <form onSubmit={handleSubmit} className="editprofile-form">
        <div>
          <label>{t('edit_profile_name')} *</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder={t('edit_profile_name_placeholder')}
            required
          />
        </div>
        
        <div>
          <label>{t('edit_profile_lastname')} *</label>
          <input
            name="apellidos"
            value={form.apellidos}
            onChange={handleChange}
            placeholder={t('edit_profile_lastname_placeholder')}
            required
          />
        </div>
        
        <div>
          <label>{t('edit_profile_email')}</label>
          <input 
            value={form.email} 
            disabled 
            placeholder={t('edit_profile_email_disabled')}
          />
        </div>
        
        <div>
          <label>{t('edit_profile_phone')}</label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder={t('edit_profile_phone_placeholder')}
            type="tel"
          />
        </div>
        
        {msg && (
          <div className={msg.includes(t('edit_profile_success')) ? 'msg-success' : 'msg-error'}>
            {msg}
          </div>
        )}
        
        <div className="editprofile-actions">
          <button type="button" onClick={onClose} className="cancel-btn">
            {t('common_cancel')}
          </button>
          <button type="submit" disabled={saving}>
            {saving ? t('edit_profile_saving') : t('edit_profile_save_changes')}
          </button>
        </div>
      </form>
    </div>
  );
}