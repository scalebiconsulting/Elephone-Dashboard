"use client";

import { ESTADOS_INVENTARIO, METODOS_PAGO } from '@/app/constants/opciones';
import DateInput from '@/app/components/forms/shared/DateInput';

interface InventarioProps {
  estado: string;
  fecha: string;
  metodoPago: string[];
  setEstado: (value: string) => void;
  setFecha: (value: string) => void;
  handleMetodoPagoToggle: (metodo: string) => void;
}

export default function Inventario({
  estado, fecha, metodoPago,
  setEstado, setFecha, handleMetodoPagoToggle
}: InventarioProps) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">📦 Inventario</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-slate-400 mb-2">23. ESTADO</label>
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

        <div className="lg:col-span-1">
          <DateInput
            label="24. FECHA"
            value={fecha}
            onChange={setFecha}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-3">25. MÉTODO DE PAGO</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {METODOS_PAGO.map((metodo) => (
            <label key={metodo} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={metodoPago.includes(metodo)}
                onChange={() => handleMetodoPagoToggle(metodo)}
                className="w-5 h-5 rounded bg-[#0f172a] border border-[#334155] checked:bg-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]"
              />
              <span className="text-sm text-slate-300">{metodo}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
