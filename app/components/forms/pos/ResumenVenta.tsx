"use client";

import { formatCLP } from '@/app/utils/formatters';

const ESTADOS_VENTA = ['PENDIENTE', 'PAGADO', 'ENTREGADO', 'ANULADO'];

interface ResumenVentaProps {
  precioVenta: number;
  utilidad: number;
  modalidadPago: 'CONTADO' | 'CREDITO';
  setModalidadPago: (value: 'CONTADO' | 'CREDITO') => void;
  montoEfectivo: string;
  setMontoEfectivo: (value: string) => void;
  montoTransferencia: string;
  setMontoTransferencia: (value: string) => void;
  montoDebito: string;
  setMontoDebito: (value: string) => void;
  totalPagado: number;
  saldoPendiente: number;
  estadoVenta: string;
  setEstadoVenta: (value: string) => void;
}

export default function ResumenVenta({ 
  precioVenta, 
  utilidad, 
  modalidadPago,
  setModalidadPago,
  montoEfectivo,
  setMontoEfectivo,
  montoTransferencia,
  setMontoTransferencia,
  montoDebito,
  setMontoDebito,
  totalPagado,
  saldoPendiente,
  estadoVenta,
  setEstadoVenta
}: ResumenVentaProps) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">💰 Resumen de Venta</h2>
      
      <div className="space-y-4">
        {/* Modalidad de Pago */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Modalidad de Pago
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="CONTADO"
                checked={modalidadPago === 'CONTADO'}
                onChange={(e) => setModalidadPago(e.target.value as 'CONTADO')}
                className="mr-2 accent-[#0ea5e9]"
              />
              <span className="text-white text-sm">Contado</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="CREDITO"
                checked={modalidadPago === 'CREDITO'}
                onChange={(e) => setModalidadPago(e.target.value as 'CREDITO')}
                className="mr-2 accent-[#0ea5e9]"
              />
              <span className="text-white text-sm">Crédito</span>
            </label>
          </div>
        </div>

        {/* Precio de Venta */}
        <div className="flex justify-between items-center pt-3 border-t border-[#334155]">
          <span className="text-slate-400">Precio de Venta:</span>
          <span className="text-2xl font-bold text-green-400">{formatCLP(precioVenta)}</span>
        </div>

        {/* Forma de Pago - Solo visible en CONTADO */}
        {modalidadPago === 'CONTADO' && (
          <div className="border-t border-[#334155] pt-3">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Forma de Pago
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Efectivo</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                  <input
                    type="text"
                    value={montoEfectivo}
                    onChange={(e) => setMontoEfectivo(e.target.value)}
                    className="w-full pl-5 pr-2 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9] text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Transferencia</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                  <input
                    type="text"
                    value={montoTransferencia}
                    onChange={(e) => setMontoTransferencia(e.target.value)}
                    className="w-full pl-5 pr-2 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9] text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Débito</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                  <input
                    type="text"
                    value={montoDebito}
                    onChange={(e) => setMontoDebito(e.target.value)}
                    className="w-full pl-5 pr-2 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9] text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje para CRÉDITO */}
        {modalidadPago === 'CREDITO' && (
          <div className="border-t border-[#334155] pt-3">
            <p className="text-sm text-slate-400 italic">Pago financiado a crédito</p>
          </div>
        )}

        {/* Totales - Solo mostrar en CONTADO */}
        {modalidadPago === 'CONTADO' && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Total Pagado:</span>
              <span className="text-lg font-medium text-white">{formatCLP(totalPagado)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Saldo Pendiente:</span>
              <span className={`text-lg font-bold ${saldoPendiente > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {formatCLP(saldoPendiente)}
              </span>
            </div>
          </>
        )}

        {/* Estado de Venta */}
        <div className="border-t border-[#334155] pt-3">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Estado de Venta
          </label>
          <select
            value={estadoVenta}
            onChange={(e) => setEstadoVenta(e.target.value)}
            className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9] text-sm"
          >
            {ESTADOS_VENTA.map((estado) => (
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
