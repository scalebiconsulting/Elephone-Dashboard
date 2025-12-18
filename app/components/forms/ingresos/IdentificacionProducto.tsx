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
