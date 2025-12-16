"use client";

import { formatCLP } from '@/app/utils/formatters';
import { ESTADOS_PERMUTA } from '@/app/constants/opciones';
import { FormasPagoGrid } from '@/app/components/forms/shared';

interface ResumenPermutaProps {
  precioVenta: number;
  valorPermuta: number;
  diferencia: number;
  tipoTransaccion: 'CLIENTE_PAGA' | 'NEGOCIO_DEVUELVE' | 'EMPATE';
  montoEfectivo: string;
  setMontoEfectivo: (value: string) => void;
  montoTransferencia: string;
  setMontoTransferencia: (value: string) => void;
  montoDebito: string;
  setMontoDebito: (value: string) => void;
  totalPagado: number;
  saldoPendiente: number;
  estadoPermuta: string;
  setEstadoPermuta: (value: string) => void;
  utilidad: number;
}

export default function ResumenPermuta({
  precioVenta,
  valorPermuta,
  diferencia,
  tipoTransaccion,
  montoEfectivo,
  setMontoEfectivo,
  montoTransferencia,
  setMontoTransferencia,
  montoDebito,
  setMontoDebito,
  totalPagado,
  saldoPendiente,
  estadoPermuta,
  setEstadoPermuta,
  utilidad,
}: ResumenPermutaProps) {
  const esClientePaga = tipoTransaccion === 'CLIENTE_PAGA';
  const esNegocioDevuelve = tipoTransaccion === 'NEGOCIO_DEVUELVE';
  const esEmpate = tipoTransaccion === 'EMPATE';

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">📊 Resumen de Permuta</h2>
      
      <div className="space-y-4">
        {/* Valores */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Precio Producto Venta:</span>
            <span className="text-lg font-medium text-white">{formatCLP(precioVenta)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Valor Permuta:</span>
            <span className="text-lg font-medium text-[#0ea5e9]">- {formatCLP(valorPermuta)}</span>
          </div>
          <div className="border-t border-[#334155] pt-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Diferencia:</span>
              <span className={`text-2xl font-bold ${esClientePaga ? 'text-green-400' : esNegocioDevuelve ? 'text-red-400' : 'text-white'}`}>
                {esNegocioDevuelve ? '-' : ''}{formatCLP(Math.abs(diferencia))}
              </span>
            </div>
          </div>
        </div>

        {/* Tipo de transacción */}
        <div className={`rounded-lg p-3 ${esClientePaga ? 'bg-green-500/10 border border-green-500/30' : esNegocioDevuelve ? 'bg-red-500/10 border border-red-500/30' : 'bg-slate-500/10 border border-slate-500/30'}`}>
          <p className={`text-sm font-medium ${esClientePaga ? 'text-green-400' : esNegocioDevuelve ? 'text-red-400' : 'text-slate-400'}`}>
            {esClientePaga && '💵 El cliente debe pagar la diferencia'}
            {esNegocioDevuelve && '🔄 El negocio debe devolver al cliente'}
            {esEmpate && '✅ No hay diferencia a pagar'}
          </p>
        </div>

        {/* Forma de Pago/Devolución - Solo si hay diferencia */}
        {!esEmpate && (
          <div className="border-t border-[#334155] pt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {esClientePaga ? 'Forma de Pago (Cliente)' : 'Forma de Devolución (Negocio)'}
            </label>
            <FormasPagoGrid
              montoEfectivo={montoEfectivo}
              setMontoEfectivo={setMontoEfectivo}
              montoTransferencia={montoTransferencia}
              setMontoTransferencia={setMontoTransferencia}
              montoDebito={montoDebito}
              setMontoDebito={setMontoDebito}
              showDebito={esClientePaga}
            />

            {/* Totales */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total {esClientePaga ? 'Pagado' : 'Devuelto'}:</span>
                <span className="text-white font-medium">{formatCLP(totalPagado)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Saldo Pendiente:</span>
                <span className={`font-bold ${saldoPendiente > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {formatCLP(saldoPendiente)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Estado */}
        <div className="border-t border-[#334155] pt-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Estado de Permuta
          </label>
          <select
            value={estadoPermuta}
            onChange={(e) => setEstadoPermuta(e.target.value)}
            className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9] text-sm"
          >
            {ESTADOS_PERMUTA.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        {/* Utilidad */}
        <div className="flex justify-between items-center pt-3 border-t border-[#334155]">
          <span className="text-slate-400">Utilidad:</span>
          <span className={`text-xl font-bold ${utilidad >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
            {formatCLP(utilidad)}
          </span>
        </div>
      </div>
    </div>
  );
}
