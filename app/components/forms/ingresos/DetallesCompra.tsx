"use client";

import DateInput from '@/app/components/forms/shared/DateInput';

interface DetallesCompraProps {
  sku: string;
  condicionBateria: string;
  costo: string;
  fechaCompra: string;
  setCondicionBateria: (value: string) => void;
  setCosto: (value: string) => void;
  setFechaCompra: (value: string) => void;
}

export default function DetallesCompra({
  sku, condicionBateria, costo, fechaCompra,
  setCondicionBateria, setCosto, setFechaCompra
}: DetallesCompraProps) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">💰 Detalles de Compra</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            9. SKU (Generado automáticamente)
          </label>
          <input
            type="text"
            value={sku}
            readOnly
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#0ea5e9] rounded-lg text-white font-semibold focus:outline-none"
            placeholder="IPH12-BA-BL64SE"
          />
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
            placeholder="100"
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
