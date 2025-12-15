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

export default function IdentificacionProducto({
  equipo, modelo, color, subModelo, serie, gb, condicion, modelo2,
  setEquipo, setModelo, setColor, setSubModelo, setSerie, setGb, setCondicion
}: IdentificacionProductoProps) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Package size={24} className="text-[#0ea5e9]" />
        📦 Nuevo Producto
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            1. EQUIPO <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={equipo}
            onChange={(e) => setEquipo(e.target.value.toUpperCase())}
            required
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            placeholder="iPhone"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            2. MODELO <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={modelo}
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
              setModelo(value);
            }}
            required
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            placeholder="Pro Max"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            3. COLOR <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value.toUpperCase())}
            required
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            placeholder="Titanio Natural"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">4. SUB MODELO</label>
          <input
            type="text"
            value={subModelo}
            onChange={(e) => setSubModelo(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            placeholder="pro"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            5. SERIE <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={serie}
            onChange={(e) => setSerie(e.target.value.toUpperCase())}
            required
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            placeholder="15"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            6. GB <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={gb}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setGb(value);
              }}
              required
              className="w-full px-4 py-3 pr-12 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              placeholder="256"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none">
              GB
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            7. CONDICIÓN <span className="text-red-500">*</span>
          </label>
          <select
            value={condicion}
            onChange={(e) => setCondicion(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
          >
            {CONDICIONES_PRODUCTO.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-400 mb-2">8. MODELO2 (Generado automáticamente)</label>
          <input
            type="text"
            value={modelo2}
            readOnly
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#0ea5e9] rounded-lg text-[#ffffff] font-semibold"
          />
        </div>
      </div>
    </div>
  );
}
