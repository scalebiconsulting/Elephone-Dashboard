"use client";

import { Package } from 'lucide-react';
import { CONDICIONES_PRODUCTO } from '@/app/constants/opciones';

interface IdentificacionProductoProps {
  equipo: string;
  modelo: string;
  color: string;
  subModelo: string;
  serie: string;
  gb: string;
  condicion: string;
  modelo2: string;
  setEquipo: (value: string) => void;
  setModelo: (value: string) => void;
  setColor: (value: string) => void;
  setSubModelo: (value: string) => void;
  setSerie: (value: string) => void;
  setGb: (value: string) => void;
  setCondicion: (value: string) => void;
}

// Tipos de campo disponibles
type CampoTipo = 'SERIE' | 'MODELO' | 'SUB_MODELO' | 'GB' | 'COLOR' | 'CONDICION';

// Opciones de serie para iPhone
const SERIES_IPHONE = ['11', '12', '13', '14', '15', '16', '17', 'AIR', 'SE', 'XR'];

// Modelos disponibles por serie
const MODELOS_POR_SERIE: Record<string, string[]> = {
  '11': ['PRO', 'PRO MAX'],
  '17': ['PRO', 'PRO MAX'],
  '12': ['MINI', 'PRO', 'PRO MAX'],
  '13': ['MINI', 'PRO', 'PRO MAX'],
  '14': ['PLUS', 'PRO', 'PRO MAX'],
  '15': ['PLUS', 'PRO', 'PRO MAX'],
  '16': ['PLUS', 'PRO', 'PRO MAX'],
  'AIR': [],
  'SE': [],
  'XR': [],
};

// Configuración completa de iPhone: GB y COLORES por SERIE o SERIE-MODELO
const IPHONE_CONFIG: Record<string, { gb: string[]; colores: string[] }> = {
  // Serie 11
  '11': { gb: ['64', '128', '256'], colores: ['AMARILLO', 'BLANCO', 'MORADO', 'NEGRO', 'ROJO', 'VERDE'] },
  '11-PRO': { gb: ['64', '256', '512'], colores: ['GRIS', 'ORO', 'PLATA', 'VERDE'] },
  '11-PRO MAX': { gb: ['64', '128', '256', '512'], colores: ['GRIS', 'ORO', 'PLATA', 'VERDE'] },
  // Serie 12
  '12': { gb: ['64', '128', '256'], colores: ['AZUL', 'BLANCO', 'MORADO', 'NEGRO', 'ROJO', 'VERDE'] },
  '12-MINI': { gb: ['64', '128', '256'], colores: ['AZUL', 'BLANCO', 'MORADO', 'NEGRO', 'ROJO', 'VERDE'] },
  '12-PRO': { gb: ['128', '256', '512'], colores: ['AZUL PACIFICO', 'GRAFITO', 'ORO', 'PLATA'] },
  '12-PRO MAX': { gb: ['128', '256', '512'], colores: ['AZUL PACIFICO', 'GRAFITO', 'ORO', 'PLATA'] },
  // Serie 13
  '13': { gb: ['128', '256', '512'], colores: ['AZUL', 'BLANCO', 'MEDIANOCHE', 'ROJO', 'ROSA', 'VERDE'] },
  '13-MINI': { gb: ['128', '256', '512'], colores: ['AZUL', 'BLANCO', 'MEDIANOCHE', 'ROJO', 'ROSA', 'VERDE'] },
  '13-PRO': { gb: ['128', '256', '512', '1024'], colores: ['AZUL', 'GRAFITO', 'ORO', 'PLATA', 'VERDE'] },
  '13-PRO MAX': { gb: ['128', '256', '512', '1024'], colores: ['AZUL', 'GRAFITO', 'ORO', 'PLATA', 'VERDE'] },
  // Serie 14
  '14': { gb: ['128', '256', '512'], colores: ['AMARILLO', 'AZUL', 'BLANCO', 'MEDIANOCHE', 'PURPURA', 'ROJO'] },
  '14-PLUS': { gb: ['128', '256', '512'], colores: ['AMARILLO', 'AZUL', 'BLANCO', 'MEDIANOCHE', 'PURPURA', 'ROJO'] },
  '14-PRO': { gb: ['128', '256', '512', '1024'], colores: ['MORADO', 'NEGRO', 'ORO', 'PLATA'] },
  '14-PRO MAX': { gb: ['128', '256', '512', '1024'], colores: ['MORADO', 'NEGRO', 'ORO', 'PLATA'] },
  // Serie 15
  '15': { gb: ['128', '256', '512'], colores: ['AMARILLO', 'AZUL', 'NEGRO', 'ROSA', 'VERDE'] },
  '15-PLUS': { gb: ['128', '256', '512'], colores: ['AMARILLO', 'AZUL', 'NEGRO', 'ROSA', 'VERDE'] },
  '15-PRO': { gb: ['128', '256', '512', '1024'], colores: ['AZUL TITANIO', 'BLANCO TITANIO', 'NATURAL TITANIO', 'NEGRO TITANIO'] },
  '15-PRO MAX': { gb: ['256', '512', '1024'], colores: ['AZUL TITANIO', 'BLANCO TITANIO', 'NATURAL TITANIO', 'NEGRO TITANIO'] },
  // Serie 16
  '16': { gb: ['128', '256', '512'], colores: ['BLANCO', 'NEGRO', 'ROSADO', 'ULTRAMARINO', 'VERDE AZULADO'] },
  '16-PLUS': { gb: ['128', '256', '512'], colores: ['BLANCO', 'NEGRO', 'ROSADO', 'ULTRAMARINO', 'VERDE AZULADO'] },
  '16-PRO': { gb: ['128', '256', '512', '1024'], colores: ['BLANCO TITANIO', 'DESIERTO TITANIO', 'NATURAL TITANIO', 'NEGRO TITANIO'] },
  '16-PRO MAX': { gb: ['128', '256', '512', '1024'], colores: ['BLANCO TITANIO', 'DESIERTO TITANIO', 'NATURAL TITANIO', 'NEGRO TITANIO'] },
  // Serie 17
  '17': { gb: ['256', '512'], colores: ['AZUL', 'BLANCO', 'NEGRO', 'PURPURA', 'VERDE'] },
  '17-PRO': { gb: ['256', '512', '1024', '2024'], colores: ['AZUL', 'NARANJA', 'PLATA'] },
  '17-PRO MAX': { gb: ['256', '512', '1024', '2024'], colores: ['AZUL', 'NARANJA', 'PLATA'] },
  // AIR, SE, XR (solo modelo base)
  'AIR': { gb: ['256', '512', '1024'], colores: ['AZUL', 'BLANCO', 'NEGRO', 'ORO'] },
  'SE': { gb: ['64', '128', '256'], colores: ['BLANCO', 'NEGRO', 'ROJO'] },
  'XR': { gb: ['64', '128', '256'], colores: ['AMARILLO', 'AZUL', 'BLANCO', 'CORAL', 'NEGRO', 'ROJO'] },
};

// Función para obtener la clave de configuración de iPhone
const getIphoneConfigKey = (serie: string, modelo: string): string => {
  if (!serie) return '';
  if (!modelo) return serie;
  return `${serie}-${modelo}`;
};

// Opciones de modelo para Apple Watch
const MODELOS_APPLE_WATCH = ['1 GENERACION', '2022', '2023'];

// Gamas disponibles por modelo de Apple Watch
const GAMAS_POR_MODELO: Record<string, string[]> = {
  '1 GENERACION': ['BASICO', 'EDITION', 'SPORT'],
  '2022': ['ULTRA'],
  '2023': ['ULTRA'],
};

// Capacidades disponibles por modelo+gama de Apple Watch
// Para 2023 sin gama, la clave es solo '2023'
const CAPACIDADES_POR_MODELO_GAMA: Record<string, string[]> = {
  '1 GENERACION-BASICO': ['40', '44'],
  '1 GENERACION-EDITION': ['40', '44'],
  '1 GENERACION-SPORT': ['40', '44'],
  '2022-ULTRA': ['49'],
  '2023': ['40', '41', '45'],
  '2023-ULTRA': ['49'],
};

// Configuración completa de Apple Watch: COLORES y CONDICIONES por modelo+gama+capacidad
// Para 2023 sin gama, la clave es 'modelo-capacidad'
const APPLE_WATCH_CONFIG: Record<string, { colores: string[]; condiciones: string[] }> = {
  // 1 GENERACION
  '1 GENERACION-BASICO-40': { colores: ['ORO', 'PLATA', 'SPACE GRAY'], condiciones: ['REACONDICIONADO', 'SEMINUEVO'] },
  '1 GENERACION-BASICO-44': { colores: ['ORO', 'PLATA', 'SPACE GRAY'], condiciones: ['REACONDICIONADO', 'SEMINUEVO'] },
  '1 GENERACION-EDITION-40': { colores: ['ORO', 'PLATA', 'SPACE GRAY'], condiciones: ['REACONDICIONADO', 'SEMINUEVO'] },
  '1 GENERACION-EDITION-44': { colores: ['ORO', 'PLATA', 'SPACE GRAY'], condiciones: ['REACONDICIONADO', 'SEMINUEVO'] },
  '1 GENERACION-SPORT-40': { colores: ['ORO', 'PLATA', 'SPACE GRAY'], condiciones: ['REACONDICIONADO', 'SEMINUEVO'] },
  '1 GENERACION-SPORT-44': { colores: ['ORO', 'PLATA', 'SPACE GRAY'], condiciones: ['REACONDICIONADO', 'SEMINUEVO'] },
  // 2022
  '2022-ULTRA-49': { colores: ['PLATEADO', 'AZUL'], condiciones: ['NUEVO'] },
  // 2023 sin gama
  '2023-40': { colores: ['AZUL', 'BLANCO'], condiciones: ['NUEVO'] },
  '2023-41': { colores: ['BLANCO', 'ROSADO', 'BEIGE'], condiciones: ['NUEVO', 'SEMINUEVO'] },
  '2023-45': { colores: ['AZUL'], condiciones: ['NUEVO'] },
  // 2023 con gama ULTRA
  '2023-ULTRA-49': { colores: ['PLATEADO'], condiciones: ['NUEVO'] },
};

// Función para obtener clave de capacidad de Apple Watch
const getAppleWatchCapacidadKey = (modelo: string, gama: string): string => {
  if (!modelo) return '';
  if (!gama) return modelo;
  return `${modelo}-${gama}`;
};

// Función para obtener clave de configuración de Apple Watch
const getAppleWatchConfigKey = (modelo: string, gama: string, capacidad: string): string => {
  if (!modelo || !capacidad) return '';
  if (!gama) return `${modelo}-${capacidad}`;
  return `${modelo}-${gama}-${capacidad}`;
};

// Función para verificar si un modelo de Apple Watch puede continuar sin gama
const modeloPuedeSinGama = (modelo: string): boolean => {
  // Si existe una clave directa del modelo en CAPACIDADES_POR_MODELO_GAMA, puede continuar sin gama
  return !!CAPACIDADES_POR_MODELO_GAMA[modelo];
};

// Opciones de modelo para Accesorio
const MODELOS_ACCESORIO = [
  'FASHION', 'FASHIONCASE', 'IPEFET', 'MAGNETIC',
  'MAGSAFE', 'MOTOMO', 'PHONECASE', 'SILICONE CASE', 'SPACE'
];

// Gamas disponibles por modelo de Accesorio
const GAMAS_POR_MODELO_ACCESORIO: Record<string, string[]> = {
  'FASHION': ['PRO', 'PRO MAX'],
  'FASHIONCASE': ['BASICO'],
  'IPEFET': ['BASICO', 'PRO'],
  'MAGNETIC': ['BASICO', 'PLUS', 'PRO', 'PRO MAX'],
  'MAGSAFE': ['BASICO', 'BASICO / PRO', 'PLUS', 'PRO', 'PRO MAX'],
  'MOTOMO': ['PRO'],
  'PHONECASE': ['BASICO', 'PLUS', 'PRO', 'PRO MAX'],
  'SILICONE CASE': ['BASICO', 'BASICO / PRO', 'PLUS', 'PRO', 'PRO MAX'],
  'SPACE': ['BASICO', 'PLUS', 'PRO', 'PRO MAX'],
};

// Series disponibles por modelo+gama de Accesorio
const SERIES_POR_MODELO_GAMA_ACCESORIO: Record<string, string[]> = {
  // FASHION
  'FASHION-PRO': ['13', '15'],
  'FASHION-PRO MAX': ['11'],
  // FASHIONCASE
  'FASHIONCASE-BASICO': ['11', '12', '13', '14'],
  // IPEFET
  'IPEFET-BASICO': ['12', '14'],
  'IPEFET-PRO': ['15'],
  // MAGNETIC
  'MAGNETIC-BASICO': ['15'],
  'MAGNETIC-PLUS': ['14', '15'],
  'MAGNETIC-PRO': ['15'],
  'MAGNETIC-PRO MAX': ['14', '15'],
  // MAGSAFE
  'MAGSAFE-BASICO': ['13', '15'],
  'MAGSAFE-BASICO / PRO': ['12'],
  'MAGSAFE-PLUS': ['14', '15'],
  'MAGSAFE-PRO': ['13', '15'],
  'MAGSAFE-PRO MAX': ['15'],
  // MOTOMO
  'MOTOMO-PRO': ['13', '14'],
  // PHONECASE
  'PHONECASE-BASICO': ['12', '13', '14', '15'],
  'PHONECASE-PLUS': ['15'],
  'PHONECASE-PRO': ['12', '14', '15'],
  'PHONECASE-PRO MAX': ['12', '14', '15'],
  // SILICONE CASE
  'SILICONE CASE-BASICO': ['11', '13', '14', 'XR'],
  'SILICONE CASE-BASICO / PRO': ['12'],
  'SILICONE CASE-PLUS': ['14', '15'],
  'SILICONE CASE-PRO': ['13', '14', '15'],
  'SILICONE CASE-PRO MAX': ['11', '12', '13', '14', '15'],
  // SPACE
  'SPACE-BASICO': ['12', '14'],
  'SPACE-PLUS': ['14'],
  'SPACE-PRO': ['12'],
  'SPACE-PRO MAX': ['12', '13'],
};

// Configuración completa de Accesorio: COLORES por modelo+gama+serie
const ACCESORIO_CONFIG: Record<string, string[]> = {
  // FASHION
  'FASHION-PRO-13': ['TRASPARENTE'],
  'FASHION-PRO-15': ['TRASPARENTE'],
  'FASHION-PRO MAX-11': ['TRASPARENTE'],
  // FASHIONCASE
  'FASHIONCASE-BASICO-11': ['DORADO', 'MORADO', 'PLATEADO'],
  'FASHIONCASE-BASICO-12': ['AZUL', 'ROSA', 'DORADO'],
  'FASHIONCASE-BASICO-13': ['MORADO', 'PLATEADO'],
  'FASHIONCASE-BASICO-14': ['PLATEADO', 'ROSA'],
  // IPEFET
  'IPEFET-BASICO-12': ['AZUL OSCURO'],
  'IPEFET-BASICO-14': ['AZUL OSCURO'],
  'IPEFET-PRO-15': ['AZUL OSCURO', 'NEGRO'],
  // MAGNETIC
  'MAGNETIC-BASICO-15': ['TRASPARENTE', 'ROSA', 'NEGRO'],
  'MAGNETIC-PLUS-14': ['TRASPARENTE'],
  'MAGNETIC-PLUS-15': ['AZUL'],
  'MAGNETIC-PRO-15': ['NEGRO', 'ROSA'],
  'MAGNETIC-PRO MAX-14': ['NEGRO'],
  'MAGNETIC-PRO MAX-15': ['TRASPARENTE', 'MORADO', 'ROSA'],
  // MAGSAFE
  'MAGSAFE-BASICO-13': ['ROSA', 'VERDE'],
  'MAGSAFE-BASICO-15': ['TRASPARENTE'],
  'MAGSAFE-BASICO / PRO-12': ['TRASPARENTE'],
  'MAGSAFE-PLUS-14': ['TRASPARENTE'],
  'MAGSAFE-PLUS-15': ['TRASPARENTE'],
  'MAGSAFE-PRO-13': ['AZUL', 'MORADO', 'NEGRO', 'ROJO', 'VERDE'],
  'MAGSAFE-PRO-15': ['TRASPARENTE'],
  'MAGSAFE-PRO MAX-15': ['TRASPARENTE'],
  // MOTOMO
  'MOTOMO-PRO-13': ['AZUL', 'ROJO', 'ROSA'],
  'MOTOMO-PRO-14': ['VINOTINTO', 'AZUL OSCURO', 'VERDE FLORECENTE'],
  // PHONECASE
  'PHONECASE-BASICO-12': ['MORADO CLARO', 'NEGRO'],
  'PHONECASE-BASICO-13': ['VERDE OSCURO'],
  'PHONECASE-BASICO-14': ['VERDE OSCURO', 'NEGRO'],
  'PHONECASE-BASICO-15': ['VERDE OSCURO', 'PIEL'],
  'PHONECASE-PLUS-15': ['NEGRO'],
  'PHONECASE-PRO-12': ['VERDE', 'PIEL', 'MORADO CLARO'],
  'PHONECASE-PRO-14': ['MORADO OSCURO'],
  'PHONECASE-PRO-15': ['PIEL', 'MORADO CLARO'],
  'PHONECASE-PRO MAX-12': ['MORADO OSCURO', 'PIEL', 'AZUL'],
  'PHONECASE-PRO MAX-14': ['AZUL', 'MORADO CLARO'],
  'PHONECASE-PRO MAX-15': ['NEGRO', 'VERDE OSCURO', 'AZUL'],
  // SILICONE CASE
  'SILICONE CASE-BASICO-11': ['AZUL MARINO', 'CORAL'],
  'SILICONE CASE-BASICO-13': ['GRIS', 'ROSA', 'VINOTINTO', 'CORAL'],
  'SILICONE CASE-BASICO-14': ['VERDE CLARO', 'CORAL', 'ROJO', 'MORADO OSCURO', 'MARRON'],
  'SILICONE CASE-BASICO-XR': ['AZUL CLARO', 'MARRON', 'VERDE CLARO', 'MORADO'],
  'SILICONE CASE-BASICO / PRO-12': ['MARRON', 'GRIS', 'VINOTINTO', 'ROSA', 'MULTICOLOR'],
  'SILICONE CASE-PLUS-14': ['VINOTINTO', 'GRIS', 'CORAL', 'MORADO OSCURO'],
  'SILICONE CASE-PLUS-15': ['VINOTINTO', 'AZUL CLARO', 'AZUL OSCURO', 'AZUL REY', 'NEGRO', 'MORADO CLARO', 'BLANCO', 'MARRON', 'PIEL', 'VERDE OSCURO', 'GRIS', 'ROJO', 'FUCSIA'],
  'SILICONE CASE-PRO-13': ['MULTICOLOR', 'VERDE OSCURO', 'VINOTINTO', 'AZUL CLARO', 'GRIS', 'NEGRO', 'CORAL', 'PIEL', 'AZUL OSCURO', 'ROSA', 'NARANJA', 'FUCSIA', 'MORADO CLARO', 'CALIPSO'],
  'SILICONE CASE-PRO-14': ['AZUL CLARO', 'CORAL', 'FUCSIA', 'MORADO CLARO', 'MORADO OSCURO', 'VERDE CLARO'],
  'SILICONE CASE-PRO-15': ['AZUL CLARO', 'PIEL', 'GRIS', 'VERDE CLARO', 'BLANCO', 'CORAL', 'MORADO OSCURO'],
  'SILICONE CASE-PRO MAX-11': ['ROSA', 'MORADO', 'CORAL', 'AZUL CLARO', 'VERDE OSCURO'],
  'SILICONE CASE-PRO MAX-12': ['MORADO CLARO', 'VERDE OSCURO', 'MORADO OSCURO', 'CORAL', 'GRIS', 'ROJO', 'AZUL CLARO'],
  'SILICONE CASE-PRO MAX-13': ['GRIS', 'CORAL', 'MORADO CLARO', 'MARRON', 'ROJO', 'MORADO OSCURO', 'ROSA', 'NEGRO', 'AZUL OSCURO', 'AZUL CLARO', 'VINOTINTO', 'VERDE OSCURO', 'VERDE CLARO'],
  'SILICONE CASE-PRO MAX-14': ['ROSA', 'PIEL', 'CORAL', 'GRIS'],
  'SILICONE CASE-PRO MAX-15': ['PIEL', 'ROJO', 'VERDE CLARO', 'ROSA'],
  // SPACE
  'SPACE-BASICO-12': ['TRASPARENTE'],
  'SPACE-BASICO-14': ['TRASPARENTE'],
  'SPACE-PLUS-14': ['TRASPARENTE'],
  'SPACE-PRO-12': ['TRASPARENTE'],
  'SPACE-PRO MAX-12': ['TRASPARENTE'],
  'SPACE-PRO MAX-13': ['TRASPARENTE'],
};

// Función para obtener clave de serie de Accesorio
const getAccesorioSerieKey = (modelo: string, gama: string): string => {
  if (!modelo || !gama) return '';
  return `${modelo}-${gama}`;
};

// Función para obtener clave de color de Accesorio
const getAccesorioColorKey = (modelo: string, gama: string, serie: string): string => {
  if (!modelo || !gama || !serie) return '';
  return `${modelo}-${gama}-${serie}`;
};

// Configuración de campos por tipo de producto (en orden)
const CAMPOS_POR_TIPO: Record<string, CampoTipo[]> = {
  'IPHONE': ['SERIE', 'MODELO', 'GB', 'COLOR', 'CONDICION'],
  'APPLE WATCH': ['MODELO', 'SUB_MODELO', 'GB', 'COLOR', 'CONDICION'],
  'ACCESORIO': ['MODELO', 'SUB_MODELO', 'SERIE', 'COLOR'],
};

export default function IdentificacionProducto({
  equipo, modelo, color, subModelo, serie, gb, condicion, modelo2,
  setEquipo, setModelo, setColor, setSubModelo, setSerie, setGb, setCondicion
}: IdentificacionProductoProps) {
  
  // Obtener campos a mostrar según el tipo seleccionado
  const camposAMostrar = equipo ? CAMPOS_POR_TIPO[equipo] || [] : [];
  const tieneEquipoSeleccionado = equipo !== '';

  // Función para renderizar cada campo
  const renderCampo = (campo: CampoTipo) => {
    switch (campo) {
      case 'SERIE':
        // Para iPhone: select con opciones, para otros: input libre
        if (equipo === 'IPHONE') {
          return (
            <div key="serie">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                SERIE
              </label>
              <select
                value={serie}
                onChange={(e) => setSerie(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                <option value="">Seleccionar...</option>
                {SERIES_IPHONE.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          );
        }
        // Para Accesorio: select con series según modelo+gama
        if (equipo === 'ACCESORIO') {
          const accesorioSerieKey = getAccesorioSerieKey(modelo, subModelo);
          const seriesAccesorio = SERIES_POR_MODELO_GAMA_ACCESORIO[accesorioSerieKey] || [];
          return (
            <div key="serie">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                SERIE
              </label>
              <select
                value={serie}
                onChange={(e) => setSerie(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                disabled={!modelo || !subModelo}
              >
                <option value="">Seleccionar</option>
                {seriesAccesorio.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          );
        }
        return (
          <div key="serie">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              SERIE
            </label>
            <input
              type="text"
              value={serie}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
                setSerie(value);
              }}
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            />
          </div>
        );
      
      case 'MODELO':
        // Para iPhone, mostrar select basado en la serie seleccionada
        if (equipo === 'IPHONE') {
          const modelosDisponibles = MODELOS_POR_SERIE[serie] || [];
          // Si la serie no tiene modelos (AIR, SE, XR), no mostrar el campo
          if (modelosDisponibles.length === 0) {
            return null;
          }
          return (
            <div key="modelo">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                MODELO
              </label>
              <select
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                <option value="">Seleccionar</option>
                {modelosDisponibles.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          );
        }
        // Para Apple Watch, mostrar select con modelos disponibles
        if (equipo === 'APPLE WATCH') {
          return (
            <div key="modelo">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                MODELO
              </label>
              <select
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                <option value="">Seleccionar</option>
                {MODELOS_APPLE_WATCH.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          );
        }
        // Para Accesorio, mostrar select con modelos disponibles
        if (equipo === 'ACCESORIO') {
          return (
            <div key="modelo">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                MODELO
              </label>
              <select
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                <option value="">Seleccionar</option>
                {MODELOS_ACCESORIO.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          );
        }
        // Para otros equipos, input de texto
        return (
          <div key="modelo">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              MODELO
            </label>
            <input
              type="text"
              value={modelo}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
                setModelo(value);
              }}
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            />
          </div>
        );
      
      case 'SUB_MODELO':
        // Para Apple Watch, mostrar select con gamas según modelo seleccionado
        if (equipo === 'APPLE WATCH') {
          const gamasDisponibles = GAMAS_POR_MODELO[modelo] || [];
          return (
            <div key="subModelo">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                GAMA
              </label>
              <select
                value={subModelo}
                onChange={(e) => setSubModelo(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                disabled={!modelo}
              >
                <option value="">Seleccionar</option>
                {gamasDisponibles.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          );
        }
        // Para Accesorio, mostrar select con gamas según modelo seleccionado
        if (equipo === 'ACCESORIO') {
          const gamasAccesorio = GAMAS_POR_MODELO_ACCESORIO[modelo] || [];
          return (
            <div key="subModelo">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                GAMA
              </label>
              <select
                value={subModelo}
                onChange={(e) => setSubModelo(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                disabled={!modelo}
              >
                <option value="">Seleccionar</option>
                {gamasAccesorio.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          );
        }
        // Para otros equipos, input de texto
        return (
          <div key="subModelo">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              GAMA
            </label>
            <input
              type="text"
              value={subModelo}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
                setSubModelo(value);
              }}
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            />
          </div>
        );
      
      case 'GB':
        // Para iPhone: select con opciones según serie+modelo
        if (equipo === 'IPHONE') {
          const iphoneKey = getIphoneConfigKey(serie, modelo);
          const iphoneConfig = IPHONE_CONFIG[iphoneKey];
          const gbOptions = iphoneConfig?.gb || [];
          return (
            <div key="gb">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                GB
              </label>
              <select
                value={gb}
                onChange={(e) => setGb(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                disabled={!serie}
              >
                <option value="">Seleccionar</option>
                {gbOptions.map((g) => (
                  <option key={g} value={g}>{g} GB</option>
                ))}
              </select>
            </div>
          );
        }
        // Para Apple Watch: select con capacidades según modelo+gama
        if (equipo === 'APPLE WATCH') {
          const awCapacidadKey = getAppleWatchCapacidadKey(modelo, subModelo);
          const capacidadOptions = CAPACIDADES_POR_MODELO_GAMA[awCapacidadKey] || [];
          // Permitir continuar si: tiene gama seleccionada O el modelo puede funcionar sin gama
          const puedeSeleccionarCapacidad = modelo && (subModelo || modeloPuedeSinGama(modelo));
          return (
            <div key="gb">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                CAPACIDAD
              </label>
              <select
                value={gb}
                onChange={(e) => setGb(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                disabled={!puedeSeleccionarCapacidad}
              >
                <option value="">Seleccionar</option>
                {capacidadOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          );
        }
        // Para otros equipos: input de texto
        return (
          <div key="gb">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              CAPACIDAD
            </label>
            <input
              type="text"
              value={gb}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setGb(value);
              }}
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            />
          </div>
        );
      
      case 'COLOR':
        // Para iPhone: select con colores según serie+modelo
        if (equipo === 'IPHONE') {
          const iphoneKeyColor = getIphoneConfigKey(serie, modelo);
          const iphoneConfigColor = IPHONE_CONFIG[iphoneKeyColor];
          const colorOptions = iphoneConfigColor?.colores || [];
          return (
            <div key="color">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                COLOR
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                disabled={!serie}
              >
                <option value="">Seleccionar</option>
                {colorOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          );
        }
        // Para Apple Watch: select con colores según modelo+gama+capacidad
        if (equipo === 'APPLE WATCH') {
          const awColorKey = getAppleWatchConfigKey(modelo, subModelo, gb);
          const awConfig = APPLE_WATCH_CONFIG[awColorKey];
          const colorOptionsAW = awConfig?.colores || [];
          return (
            <div key="color">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                COLOR
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                disabled={!modelo || !gb}
              >
                <option value="">Seleccionar</option>
                {colorOptionsAW.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          );
        }
        // Para Accesorio: select con colores según modelo+gama+serie
        if (equipo === 'ACCESORIO') {
          const accesorioColorKey = getAccesorioColorKey(modelo, subModelo, serie);
          const coloresAccesorio = ACCESORIO_CONFIG[accesorioColorKey] || [];
          return (
            <div key="color">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                COLOR
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                disabled={!modelo || !subModelo || !serie}
              >
                <option value="">Seleccionar</option>
                {coloresAccesorio.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          );
        }
        // Para otros equipos: input de texto
        return (
          <div key="color">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              COLOR
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '').toUpperCase();
                setColor(value);
              }}
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            />
          </div>
        );
      
      case 'CONDICION':
        // Para Apple Watch: select con condiciones según modelo+gama+capacidad
        if (equipo === 'APPLE WATCH') {
          const awCondicionKey = getAppleWatchConfigKey(modelo, subModelo, gb);
          const awConfigCondicion = APPLE_WATCH_CONFIG[awCondicionKey];
          const condicionOptionsAW = awConfigCondicion?.condiciones || [];
          return (
            <div key="condicion">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                CONDICIÓN
              </label>
              <select
                value={condicion}
                onChange={(e) => setCondicion(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                disabled={!modelo || !gb}
              >
                <option value="">Seleccionar</option>
                {condicionOptionsAW.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          );
        }
        // Para otros equipos: select con todas las condiciones
        return (
          <div key="condicion">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              CONDICIÓN
            </label>
            <select
              value={condicion}
              onChange={(e) => setCondicion(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            >
              <option value="">Seleccionar</option>
              {CONDICIONES_PRODUCTO.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
              ))}
            </select>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Package size={24} className="text-[#0ea5e9]" />
        📦 Nuevo Producto
        {tieneEquipoSeleccionado && (
          <span className="ml-2 px-2 py-1 text-xs rounded bg-[#0ea5e9]/20 text-[#0ea5e9]">
            {equipo === 'IPHONE' ? 'iPhone' : equipo === 'APPLE WATCH' ? 'Apple Watch' : 'Accesorio'}
          </span>
        )}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* EQUIPO - Siempre visible */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            EQUIPO <span className="text-red-500">*</span>
          </label>
          <select
            value={equipo}
            onChange={(e) => setEquipo(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
          >
            <option value="">Seleccionar...</option>
            <option value="IPHONE">IPHONE</option>
            <option value="APPLE WATCH">APPLE WATCH</option>
            <option value="ACCESORIO">ACCESORIO</option>
          </select>
        </div>

        {/* Campos dinámicos según tipo de producto */}
        {camposAMostrar.map(campo => renderCampo(campo))}

        {/* MODELO2 - Solo visible cuando hay equipo seleccionado */}
        {tieneEquipoSeleccionado && (
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              MODELO2 (Generado automáticamente)
            </label>
            <input
              type="text"
              value={modelo2}
              readOnly
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#0ea5e9] rounded-lg text-[#ffffff] font-semibold"
            />
          </div>
        )}
      </div>
    </div>
  );
}
