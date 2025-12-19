"use client";

import DateInput from '@/app/components/forms/shared/DateInput';

interface DetallesCompraProps {
  sku: string;
  buscandoSku: boolean;
  skuNoEncontrado: boolean;
  condicionBateria: string;
  costo: string;
  fechaCompra: string;
  setCondicionBateria: (value: string) => void;
  setCosto: (value: string) => void;
  setFechaCompra: (value: string) => void;
}

export default function DetallesCompra({
  sku, buscandoSku, skuNoEncontrado, condicionBateria, costo, fechaCompra,
  setCondicionBateria, setCosto, setFechaCompra
}: DetallesCompraProps) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">💰 Detalles de Compra</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            9. SKU (Basado en MODELO2)
          </label>
          <div className="relative">
            <input
              type="text"
              value={buscandoSku ? 'Buscando...' : sku}
              readOnly
              className={`w-full px-4 py-3 bg-[#0f172a] border rounded-lg font-semibold focus:outline-none ${
                buscandoSku 
                  ? 'border-yellow-500 text-yellow-400' 
                  : skuNoEncontrado 
                    ? 'border-red-500 text-red-400' 
                    : 'border-[#0ea5e9] text-white'
              }`}
            />
            {buscandoSku && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="animate-spin h-5 w-5 text-yellow-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            )}
          </div>
          {skuNoEncontrado && !buscandoSku && (
            <p className="text-red-400 text-sm mt-1">⚠️ SKU no encontrado para este MODELO2</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            10. CONDICIÓN BATERÍA (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={condicionBateria}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
                setCondicionBateria(value);
              }
            }}
            required
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            11. COSTO (CLP) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
              $
            </span>
            <input
              type="text"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
              required
              className="w-full px-4 py-3 pl-8 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            />
          </div>
        </div>

        <DateInput
          label="12. FECHA DE COMPRA"
          value={fechaCompra}
          onChange={setFechaCompra}
          required
        />
      </div>
    </div>
  );
}
