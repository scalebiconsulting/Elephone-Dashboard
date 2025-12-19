"use client";

import { Package, Loader2 } from 'lucide-react';
import { CONDICIONES_PRODUCTO } from '@/app/constants/opciones';
import { useConfiguraciones } from '@/app/hooks/useConfiguraciones';

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
  
  // Cargar configuraciones desde MongoDB
  const {
    iphone,
    appleWatch,
    accesorio,
    loading,
    error,
    getIphoneConfigKey,
    getAppleWatchCapacidadKey,
    getAppleWatchConfigKey,
    getAccesorioSerieKey,
    getAccesorioColorKey,
    modeloPuedeSinGama
  } = useConfiguraciones();

  // Obtener campos a mostrar según el tipo seleccionado
  const camposAMostrar = equipo ? CAMPOS_POR_TIPO[equipo] || [] : [];
  const tieneEquipoSeleccionado = equipo !== '';

  // Si está cargando las configuraciones
  if (loading) {
    return (
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Package size={24} className="text-[#0ea5e9]" />
          📦 Nuevo Producto
        </h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-[#0ea5e9]" size={32} />
          <span className="ml-2 text-slate-400">Cargando configuraciones...</span>
        </div>
      </div>
    );
  }

  // Si hay error
  if (error) {
    return (
      <div className="bg-[#1e293b] border border-red-500 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Package size={24} className="text-red-500" />
          📦 Nuevo Producto
        </h2>
        <div className="text-red-400 text-center py-4">
          Error cargando configuraciones: {error}
        </div>
      </div>
    );
  }

  // Función para renderizar cada campo
  const renderCampo = (campo: CampoTipo) => {
    switch (campo) {
      case 'SERIE':
        // Para iPhone: select con opciones
        if (equipo === 'IPHONE' && iphone) {
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
                {iphone.series.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          );
        }
        // Para Accesorio: select con series según modelo+gama
        if (equipo === 'ACCESORIO' && accesorio) {
          const accesorioSerieKey = getAccesorioSerieKey(modelo, subModelo);
          const seriesAccesorio = accesorio.series_por_modelo_gama[accesorioSerieKey] || [];
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
        if (equipo === 'IPHONE' && iphone) {
          const modelosDisponibles = iphone.modelos_por_serie[serie] || [];
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
        if (equipo === 'APPLE WATCH' && appleWatch) {
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
                {appleWatch.modelos.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          );
        }
        // Para Accesorio, mostrar select con modelos disponibles
        if (equipo === 'ACCESORIO' && accesorio) {
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
                {accesorio.modelos.map((m) => (
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
        if (equipo === 'APPLE WATCH' && appleWatch) {
          const gamasDisponibles = appleWatch.gamas_por_modelo[modelo] || [];
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
        if (equipo === 'ACCESORIO' && accesorio) {
          const gamasAccesorio = accesorio.gamas_por_modelo[modelo] || [];
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
        if (equipo === 'IPHONE' && iphone) {
          const iphoneKey = getIphoneConfigKey(serie, modelo);
          const iphoneConfig = iphone.configuraciones[iphoneKey];
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
        if (equipo === 'APPLE WATCH' && appleWatch) {
          const awCapacidadKey = getAppleWatchCapacidadKey(modelo, subModelo);
          const capacidadOptions = appleWatch.capacidades_por_modelo_gama[awCapacidadKey] || [];
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
        if (equipo === 'IPHONE' && iphone) {
          const iphoneKeyColor = getIphoneConfigKey(serie, modelo);
          const iphoneConfigColor = iphone.configuraciones[iphoneKeyColor];
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
        if (equipo === 'APPLE WATCH' && appleWatch) {
          const awColorKey = getAppleWatchConfigKey(modelo, subModelo, gb);
          const awConfig = appleWatch.configuraciones[awColorKey];
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
        if (equipo === 'ACCESORIO' && accesorio) {
          const accesorioColorKey = getAccesorioColorKey(modelo, subModelo, serie);
          const coloresAccesorio = accesorio.configuraciones[accesorioColorKey] || [];
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
        if (equipo === 'APPLE WATCH' && appleWatch) {
          const awCondicionKey = getAppleWatchConfigKey(modelo, subModelo, gb);
          const awConfigCondicion = appleWatch.configuraciones[awCondicionKey];
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
