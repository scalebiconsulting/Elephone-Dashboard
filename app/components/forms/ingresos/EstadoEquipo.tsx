"use client";

import { OPCIONES_BLOCK, } from '@/app/constants/opciones';

interface EstadoEquipoProps {
  block: string;
  datosEquipos?: string;
  numeroSerie: string;
  imei1: string;
  imei2: string;
  concatenacion: string;
  setBlock: (value: string) => void;
  
  setNumeroSerie: (value: string) => void;
  setImei1: (value: string) => void;
  setImei2: (value: string) => void;
  showDatosEquipos?: boolean;
}

export default function EstadoEquipo({
  block, numeroSerie, imei1, imei2, concatenacion,
  setBlock, setNumeroSerie, setImei1, setImei2,
  
}: EstadoEquipoProps) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">📱 Estado del Equipo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">BLOCK</label>
          <select
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
          >
            {OPCIONES_BLOCK.map((opcion) => (
              <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">NÚMERO DE SERIE</label>
          <input
            type="text"
            value={numeroSerie}
            onChange={(e) => setNumeroSerie(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            placeholder="353084064746173"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">IMEI 1</label>
          <input
            type="text"
            value={imei1}
            onChange={(e) => setImei1(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            placeholder="353084064746173"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">IMEI 2</label>
          <input
            type="text"
            value={imei2}
            onChange={(e) => setImei2(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            placeholder="353084064746174"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">CONCATENACIÓN (Automático)</label>
          <input
            type="text"
            value={concatenacion}
            readOnly
            className="w-full px-4 py-3 bg-[#0f172a] placeholder-[gray] border border-[#0ea5e9] rounded-lg text-white font-semibold"
            placeholder="IMEI 1 ; IMEI 2"
          />
        </div>
      </div>
    </div>
  );
}
