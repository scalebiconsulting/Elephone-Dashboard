"use client";

import { Permuta } from '@/app/types/producto';
import { formatCLP } from '@/app/utils/formatters';

interface HistorialPermutasProps {
  permutas: Permuta[];
}

export default function HistorialPermutas({ permutas }: HistorialPermutasProps) {
  if (permutas.length === 0) {
    return (
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">📋 Historial de Permutas</h2>
        <p className="text-slate-400 text-center py-8">No hay permutas registradas</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">📋 Historial de Permutas</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#334155]">
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Producto Vendido</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Producto Permuta</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Cliente</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Estado</th>
              <th className="text-left py-3 px-2 text-slate-400 font-medium">Tipo</th>
              <th className="text-right py-3 px-2 text-slate-400 font-medium">Diferencia</th>
              <th className="text-right py-3 px-2 text-slate-400 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {permutas.map((permuta) => (
              <tr key={permuta._id} className="border-b border-[#334155]/50 hover:bg-[#334155]/20">
                <td className="py-3 px-2">
                  <div>
                    <p className="text-white font-medium text-xs">{permuta.productoVendidoModelo}</p>
                    <p className="text-slate-500 font-mono text-xs">{permuta.productoVendidoSku}</p>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div>
                    <p className="text-white font-medium text-xs">{permuta.productoPermutaModelo}</p>
                    <p className="text-slate-500 font-mono text-xs">{permuta.productoPermutaSku}</p>
                  </div>
                </td>
                <td className="py-3 px-2 text-white">{permuta.nombreCliente}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    permuta.estadoPermuta === 'COMPLETADA' ? 'bg-green-500/20 text-green-400' :
                    permuta.estadoPermuta === 'PENDIENTE' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {permuta.estadoPermuta}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span className={`text-xs ${
                    permuta.tipoTransaccion === 'CLIENTE_PAGA' ? 'text-green-400' :
                    permuta.tipoTransaccion === 'NEGOCIO_DEVUELVE' ? 'text-red-400' :
                    'text-slate-400'
                  }`}>
                    {permuta.tipoTransaccion === 'CLIENTE_PAGA' ? 'Cliente Paga' :
                     permuta.tipoTransaccion === 'NEGOCIO_DEVUELVE' ? 'Devolución' : 'Empate'}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className={`font-bold ${
                    permuta.diferencia > 0 ? 'text-green-400' :
                    permuta.diferencia < 0 ? 'text-red-400' : 'text-white'
                  }`}>
                    {permuta.diferencia < 0 ? '-' : ''}{formatCLP(Math.abs(permuta.diferencia))}
                  </span>
                </td>
                <td className="py-3 px-2 text-right text-slate-400">
                  {new Date(permuta.fechaPermuta).toLocaleDateString('es-CL')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
