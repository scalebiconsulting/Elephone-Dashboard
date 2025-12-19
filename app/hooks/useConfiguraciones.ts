"use client";

import { useState, useEffect, useCallback } from 'react';

// Tipos para las configuraciones
export interface IphoneConfig {
  series: string[];
  modelos_por_serie: Record<string, string[]>;
  configuraciones: Record<string, { gb: string[]; colores: string[] }>;
}

export interface AppleWatchConfig {
  modelos: string[];
  gamas_por_modelo: Record<string, string[]>;
  capacidades_por_modelo_gama: Record<string, string[]>;
  configuraciones: Record<string, { colores: string[]; condiciones: string[] }>;
}

export interface AccesorioConfig {
  modelos: string[];
  gamas_por_modelo: Record<string, string[]>;
  series_por_modelo_gama: Record<string, string[]>;
  configuraciones: Record<string, string[]>;
}

export interface ConfiguracionesState {
  iphone: IphoneConfig | null;
  appleWatch: AppleWatchConfig | null;
  accesorio: AccesorioConfig | null;
  loading: boolean;
  error: string | null;
}

// Cache global para evitar múltiples llamadas
let cachedIphone: IphoneConfig | null = null;
let cachedAppleWatch: AppleWatchConfig | null = null;
let cachedAccesorio: AccesorioConfig | null = null;

export function useConfiguraciones() {
  const [state, setState] = useState<ConfiguracionesState>({
    iphone: cachedIphone,
    appleWatch: cachedAppleWatch,
    accesorio: cachedAccesorio,
    loading: !cachedIphone || !cachedAppleWatch || !cachedAccesorio,
    error: null
  });

  const fetchConfiguraciones = useCallback(async () => {
    // Si ya tenemos cache, no hacer nada
    if (cachedIphone && cachedAppleWatch && cachedAccesorio) {
      setState({
        iphone: cachedIphone,
        appleWatch: cachedAppleWatch,
        accesorio: cachedAccesorio,
        loading: false,
        error: null
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Cargar todas las configuraciones en paralelo
      const [iphoneRes, appleWatchRes, accesorioRes] = await Promise.all([
        fetch('/api/config/iphone'),
        fetch('/api/config/apple-watch'),
        fetch('/api/config/accesorio')
      ]);

      if (!iphoneRes.ok || !appleWatchRes.ok || !accesorioRes.ok) {
        throw new Error('Error cargando configuraciones');
      }

      const [iphoneData, appleWatchData, accesorioData] = await Promise.all([
        iphoneRes.json(),
        appleWatchRes.json(),
        accesorioRes.json()
      ]);

      // Guardar en cache
      cachedIphone = iphoneData;
      cachedAppleWatch = appleWatchData;
      cachedAccesorio = accesorioData;

      setState({
        iphone: iphoneData,
        appleWatch: appleWatchData,
        accesorio: accesorioData,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error cargando configuraciones:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
    }
  }, []);

  useEffect(() => {
    fetchConfiguraciones();
  }, [fetchConfiguraciones]);

  // Función para invalidar cache y recargar
  const refetch = useCallback(() => {
    cachedIphone = null;
    cachedAppleWatch = null;
    cachedAccesorio = null;
    fetchConfiguraciones();
  }, [fetchConfiguraciones]);

  // Funciones helper para obtener datos específicos
  const getIphoneConfigKey = (serie: string, modelo: string): string => {
    if (!serie) return '';
    if (!modelo) return serie;
    return `${serie}-${modelo}`;
  };

  const getAppleWatchCapacidadKey = (modelo: string, gama: string): string => {
    if (!modelo) return '';
    if (!gama) return modelo;
    return `${modelo}-${gama}`;
  };

  const getAppleWatchConfigKey = (modelo: string, gama: string, capacidad: string): string => {
    if (!modelo || !capacidad) return '';
    if (!gama) return `${modelo}-${capacidad}`;
    return `${modelo}-${gama}-${capacidad}`;
  };

  const getAccesorioSerieKey = (modelo: string, gama: string): string => {
    if (!modelo || !gama) return '';
    return `${modelo}-${gama}`;
  };

  const getAccesorioColorKey = (modelo: string, gama: string, serie: string): string => {
    if (!modelo || !gama || !serie) return '';
    return `${modelo}-${gama}-${serie}`;
  };

  // Función para verificar si un modelo de Apple Watch puede continuar sin gama
  const modeloPuedeSinGama = (modelo: string): boolean => {
    if (!state.appleWatch?.capacidades_por_modelo_gama) return false;
    return !!state.appleWatch.capacidades_por_modelo_gama[modelo];
  };

  return {
    ...state,
    refetch,
    // Funciones helper
    getIphoneConfigKey,
    getAppleWatchCapacidadKey,
    getAppleWatchConfigKey,
    getAccesorioSerieKey,
    getAccesorioColorKey,
    modeloPuedeSinGama
  };
}
