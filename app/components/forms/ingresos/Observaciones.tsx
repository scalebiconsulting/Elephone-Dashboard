"use client";

interface ObservacionesProps {
  observacion: string;
  setObservacion: (value: string) => void;
  simple?: boolean; // Solo muestra el campo observación
}

export default function Observaciones({
  observacion, 
  setObservacion,
}: ObservacionesProps) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">📝 Observaciones</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">OBSERVACIÓN</label>
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value.toUpperCase())}
            rows={3}
            className="w-2/3 px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
          />
        </div>
      </div>
    </div>
  );
}
