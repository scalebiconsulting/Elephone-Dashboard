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

// Opciones de modelo para Apple Watch
const MODELOS_APPLE_WATCH = ['1 GENERACION', '2022', '2023'];

// Gamas disponibles por modelo de Apple Watch
const GAMAS_POR_MODELO: Record<string, string[]> = {
  '1 GENERACION': ['BASICO', 'EDITION', 'SPORT'],
  '2022': ['ULTRA'],
  '2023': ['ULTRA'],
};

// Opciones de modelo para Accesorio
const MODELOS_ACCESORIO = [
  'FASHION', 'FASHIONCASE', 'IPEFET', 'MAGNETIC',
  'PHONECASE', 'SPACE', 'MAGSAFE', 'SILICONE CASE', 'MOTOMO'
];

// Gamas disponibles por modelo de Accesorio
const GAMAS_POR_MODELO_ACCESORIO: Record<string, string[]> = {
  'FASHION': ['PRO', 'PRO MAX'],
  'FASHIONCASE': ['BASICO'],
  'IPEFET': ['BASICO', 'PRO'],
  'MAGNETIC': ['BASICO', 'PLUS', 'PRO', 'PRO MAX'],
  'PHONECASE': ['BASICO', 'PLUS', 'PRO', 'PRO MAX'],
  'SPACE': ['BASICO', 'PLUS', 'PRO', 'PRO MAX'],
  'MAGSAFE': ['BASICO', 'BASICO / PRO', 'PLUS', 'PRO', 'PRO MAX'],
  'SILICONE CASE': ['BASICO', 'BASICO / PRO', 'PLUS', 'PRO', 'PRO MAX'],
  'MOTOMO': ['PRO'],
};

// Series disponibles por modelo de Accesorio
const SERIES_POR_MODELO_ACCESORIO: Record<string, string[]> = {
  'FASHION': ['11', '13', '15'],
  'FASHIONCASE': ['11', '12', '13', '14'],
  'IPEFET': ['12', '14', '15'],
  'MAGNETIC': ['12', '13', '14', '15'],
  'PHONECASE': ['12', '13', '14', '15'],
  'SPACE': ['12', '13', '14', '15'],
  'MAGSAFE': ['11', '12', '13', '14', '15', 'XR'],
  'SILICONE CASE': ['11', '12', '13', '14', '15', 'XR'],
  'MOTOMO': ['13', '14'],
};

// Colores disponibles por modelo de Accesorio
const COLORES_POR_MODELO_ACCESORIO: Record<string, string[]> = {
  'FASHION': ['TRASPARENTE'],
  'FASHIONCASE': ['AZUL', 'DORADO', 'MORADO', 'PLATEADO', 'ROSA'],
  'IPEFET': ['AZUL OSCURO', 'NEGRO'],
  'MAGNETIC': ['AZUL', 'MORADO', 'MORADO CLARO', 'MORADO OSCURO', 'NEGRO', 'PIEL', 'ROSA', 'TRASPARENTE', 'VERDE', 'VERDE OSCURO'],
  'PHONECASE': ['AZUL', 'MORADO', 'MORADO CLARO', 'MORADO OSCURO', 'NEGRO', 'PIEL', 'ROSA', 'TRASPARENTE', 'VERDE', 'VERDE OSCURO'],
  'SPACE': ['AZUL', 'MORADO', 'MORADO CLARO', 'MORADO OSCURO', 'NEGRO', 'PIEL', 'ROSA', 'TRASPARENTE', 'VERDE', 'VERDE OSCURO'],
  'MAGSAFE': ['AZUL', 'AZUL CLARO', 'AZUL MARINO', 'AZUL OSCURO', 'AZUL REY', 'BLANCO', 'CALIPSO', 'CORAL', 'FUCSIA', 'GRIS', 'MARRON', 'MORADO', 'MORADO CLARO', 'MORADO OSCURO', 'MULTICOLOR', 'NARANJA', 'NEGRO', 'PIEL', 'ROJO', 'ROSA', 'TRASPARENTE', 'VERDE', 'VERDE CLARO', 'VERDE OSCURO', 'VINOTINTO'],
  'SILICONE CASE': ['AZUL', 'AZUL CLARO', 'AZUL MARINO', 'AZUL OSCURO', 'AZUL REY', 'BLANCO', 'CALIPSO', 'CORAL', 'FUCSIA', 'GRIS', 'MARRON', 'MORADO', 'MORADO CLARO', 'MORADO OSCURO', 'MULTICOLOR', 'NARANJA', 'NEGRO', 'PIEL', 'ROJO', 'ROSA', 'TRASPARENTE', 'VERDE', 'VERDE CLARO', 'VERDE OSCURO', 'VINOTINTO'],
  'MOTOMO': ['AZUL', 'AZUL OSCURO', 'ROJO', 'ROSA', 'VERDE FLORECENTE', 'VINOTINTO'],
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
        // Para Accesorio: select con series según modelo
        if (equipo === 'ACCESORIO') {
          const seriesAccesorio = SERIES_POR_MODELO_ACCESORIO[modelo] || [];
          return (
            <div key="serie">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                SERIE
              </label>
              <select
                value={serie}
                onChange={(e) => setSerie(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                disabled={!modelo}
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
        const esIphone = equipo === 'IPHONE';
        return (
          <div key="gb">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              {esIphone ? 'GB' : 'CAPACIDAD'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={gb}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setGb(value);
                }}
                className={`w-full px-4 py-3 ${esIphone ? 'pr-12' : ''} bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]`}
              />
              {esIphone && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none">
                  GB
                </span>
              )}
            </div>
          </div>
        );
      
      case 'COLOR':
        // Para Accesorio: select con colores según modelo
        if (equipo === 'ACCESORIO') {
          const coloresAccesorio = COLORES_POR_MODELO_ACCESORIO[modelo] || [];
          return (
            <div key="color">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                COLOR
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                disabled={!modelo}
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
