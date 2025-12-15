"use client";

interface PreciosUtilidadProps {
  repuesto: string;
  pvpEfectivo: string;
  pvpCredito: string;
  utilidad: string;
  utilidad2: string;
  tresPorCiento: string;
  setRepuesto: (value: string) => void;
  setPvpEfectivo: (value: string) => void;
  setPvpCredito: (value: string) => void;
  setTresPorCiento: (value: string) => void;
}

export default function PreciosUtilidad({
  repuesto, pvpEfectivo, pvpCredito, utilidad, utilidad2, tresPorCiento,
  setRepuesto, setPvpEfectivo, setPvpCredito, setTresPorCiento
}: PreciosUtilidadProps) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">💵 Precios y Utilidad</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">26. REPUESTO (CLP)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
              $
            </span>
            <input
              type="text"
              value={repuesto}
              onChange={(e) => setRepuesto(e.target.value)}
              className="w-full px-4 py-3 pl-8 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">27. PVP EFECTIVO (CLP)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
              $
            </span>
            <input
              type="text"
              value={pvpEfectivo}
              onChange={(e) => setPvpEfectivo(e.target.value)}
              className="w-full px-4 py-3 pl-8 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">28. PVP CRÉDITO (CLP)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
              $
            </span>
            <input
              type="text"
              value={pvpCredito}
              onChange={(e) => setPvpCredito(e.target.value)}
              className="w-full px-4 py-3 pl-8 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            29. UTILIDAD (CLP) <span className="text-xs text-blue-400">(Auto)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
              $
            </span>
            <input
              type="text"
              value={utilidad}
              readOnly
              className="w-full px-4 py-3 pl-8 bg-[#0f172a] border-2 border-[#0ea5e9] rounded-lg text-white cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            30. UTILIDAD2 (CLP) <span className="text-xs text-blue-400">(Auto)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
              $
            </span>
            <input
              type="text"
              value={utilidad2}
              readOnly
              className="w-full px-4 py-3 pl-8 bg-[#0f172a] border-2 border-[#0ea5e9] rounded-lg text-white cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">31. 3,2% (CLP)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
              $
            </span>
            <input
              type="text"
              value={tresPorCiento}
              onChange={(e) => setTresPorCiento(e.target.value)}
              className="w-full px-4 py-3 pl-8 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
