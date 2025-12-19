"use client";

import { Venta } from '@/app/types/producto';
import { formatCLP } from '@/app/utils/formatters';
import { Eye } from 'lucide-react';

interface HistorialVentasProps {
  ventas: Venta[];
}

export default function HistorialVentas({ ventas }: HistorialVentasProps) {
  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">📊 Historial de Ventas</h2>
      
      {ventas.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No hay ventas registradas</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f172a]">
              <tr className="text-left text-slate-300">
                <th className="px-4 py-3 text-sm font-semibold">SKU</th>
                <th className="px-4 py-3 text-sm font-semibold">Cliente</th>
                <th className="px-4 py-3 text-sm font-semibold">Estado</th>
                <th className="px-4 py-3 text-sm font-semibold">Método</th>
                <th className="px-4 py-3 text-sm font-semibold text-right">Precio</th>
                <th className="px-4 py-3 text-sm font-semibold">Fecha</th>
                <th className="px-4 py-3 text-sm font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {ventas.map((venta) => (
                <tr key={venta._id} className="hover:bg-[#0f172a]/50">
                  <td className="px-4 py-3 text-white text-sm font-mono">{venta.sku}</td>
                  <td className="px-4 py-3 text-white text-sm">{venta.nombreCliente}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      venta.estadoVenta === 'VENDIDO' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {venta.estadoVenta}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white text-sm">{venta.metodoPago}</td>
                  <td className="px-4 py-3 text-green-400 font-medium text-sm text-right">
                    {formatCLP(venta.precioVenta)}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-sm">
                    {formatFecha(venta.fechaVenta)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="p-2 text-slate-400 hover:text-[#0ea5e9] hover:bg-[#0ea5e9]/10 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
