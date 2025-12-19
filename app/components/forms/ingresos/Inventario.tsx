"use client";

import { ESTADOS_INVENTARIO } from '@/app/constants/opciones';
import DateInput from '@/app/components/forms/shared/DateInput';

interface InventarioProps {
  estado: string;
  fecha: string;
  setEstado: (value: string) => void;
  setFecha: (value: string) => void;
}

export default function Inventario({
  estado, fecha,
  setEstado, setFecha,
}: InventarioProps) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">📦 Inventario</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">ESTADO</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
          >
            {ESTADOS_INVENTARIO.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
            ))}
          </select>
        </div>

        <div>
          <DateInput
            label="FECHA"
            value={fecha}
            onChange={setFecha}
          />
        </div>
      </div>
    </div>
  );
}
