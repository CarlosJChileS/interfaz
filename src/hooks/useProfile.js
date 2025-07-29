import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

const PROFILE_CACHE_KEY = 'user_profile_cache';
const CACHE_EXPIRY_HOURS = 24; // Caché válido por 24 horas

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener el perfil del caché
  const getCachedProfile = () => {
    try {
      const cached = localStorage.getItem(PROFILE_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        const hoursElapsed = (now - timestamp) / (1000 * 60 * 60);
        
        // Si el caché no ha expirado, retornarlo
        if (hoursElapsed < CACHE_EXPIRY_HOURS) {
          return data;
        }
      }
    } catch (error) {
      console.error('Error reading profile cache:', error);
    }
    return null;
  };

  // Función para guardar el perfil en caché
  const setCachedProfile = (profileData) => {
    try {
      const cacheData = {
        data: profileData,
        timestamp: Date.now()
      };
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving profile cache:', error);
    }
  };

  // Función para limpiar el caché
  const clearProfileCache = () => {
    try {
      localStorage.removeItem(PROFILE_CACHE_KEY);
    } catch (error) {
      console.error('Error clearing profile cache:', error);
    }
  };

  // Función para cargar el perfil desde Supabase
  const fetchProfileFromDB = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setLoading(false);
        return null;
      }

      const meta = user.user_metadata || {};
      
      // Obtener datos del perfil
      const { data: perfilData } = await supabase
        .from("perfil")
        .select("foto_url, puntos, preferencias, datos_extra")
        .eq("auth_id", user.id)
        .single();

      // Obtener datos adicionales del usuario si es necesario
      const { data: usuarioData } = await supabase
        .from("usuario")
        .select("telefono, facultad, programa")
        .eq("auth_id", user.id)
        .single();

      const profileData = {
        id: user.id,
        name: `${meta.nombre || ""} ${meta.apellidos || ""}`.trim(),
        nombre: meta.nombre || "",
        apellidos: meta.apellidos || "",
        email: user.email,
        telefono: usuarioData?.telefono || meta.telefono,
        facultad: usuarioData?.facultad,
        programa: usuarioData?.programa,
        foto_url: perfilData?.foto_url,
        puntos: perfilData?.puntos ?? 0,
        preferencias: perfilData?.preferencias,
        datos_extra: perfilData?.datos_extra,
        lastUpdated: Date.now()
      };

      setProfile(profileData);
      setCachedProfile(profileData);
      return profileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para refrescar el perfil
  const refreshProfile = async () => {
    setLoading(true);
    clearProfileCache();
    return await fetchProfileFromDB();
  };

  // Función para actualizar el perfil local y en caché
  const updateProfileCache = (updates) => {
    if (profile) {
      const updatedProfile = { 
        ...profile, 
        ...updates, 
        lastUpdated: Date.now() 
      };
      setProfile(updatedProfile);
      setCachedProfile(updatedProfile);
    }
  };

  useEffect(() => {
    const initializeProfile = async () => {
      // Verificar primero si hay un usuario autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Intentar cargar desde caché
      const cachedProfile = getCachedProfile();
      if (cachedProfile && cachedProfile.id === user.id) {
        setProfile(cachedProfile);
        setLoading(false);
        
        // Cargar datos frescos en background si el caché tiene más de 1 hora
        const hoursElapsed = (Date.now() - cachedProfile.lastUpdated) / (1000 * 60 * 60);
        if (hoursElapsed > 1) {
          fetchProfileFromDB();
        }
      } else {
        // Si no hay caché válido, cargar desde DB
        await fetchProfileFromDB();
      }
    };

    initializeProfile();
  }, [fetchProfileFromDB]);

  return {
    profile,
    loading,
    refreshProfile,
    updateProfileCache,
    clearProfileCache
  };
}
