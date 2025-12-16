"use client";

import { Eye, Edit, Trash2 } from 'lucide-react';
import { ProductoInventario } from '@/app/types/producto';
import { formatCLP } from '@/app/utils/formatters';

interface TablaInventarioProps {
  productos: ProductoInventario[];
  totalProductos: number;
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (producto: ProductoInventario) => void;
  onSelectForSale?: (producto: ProductoInventario) => void;
}

export default function TablaInventario({
  productos,
  totalProductos,
  loading,
  onDelete,
  onEdit,
  onSelectForSale
}: TablaInventarioProps) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0f172a]">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300">SKU</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300">MODELO2</th>
              <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">COSTO</th>
              <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">PVP EFECTIVO</th>
              <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">PVP CRÉDITO</th>
              <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">UTILIDAD</th>
              <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">UTILIDAD2</th>
              <th className="px-4 py-4 text-center text-sm font-semibold text-slate-300">CONDICIÓN</th>
              <th className="px-4 py-4 text-center text-sm font-semibold text-slate-300">ESTADO</th>
              <th className="px-4 py-4 text-center text-sm font-semibold text-slate-300">FECHA COMPRA</th>
              <th className="px-4 py-4 text-center text-sm font-semibold text-slate-300">BATERÍA %</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300">IMEI 1</th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300">N° SERIE</th>
              <th className="px-4 py-4 text-center text-sm font-semibold text-slate-300">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]">
            {loading ? (
              <tr>
                <td colSpan={14} className="px-4 py-8 text-center text-slate-400">
                  Cargando productos...
                </td>
              </tr>
            ) : productos.length === 0 ? (
              <tr>
                <td colSpan={14} className="px-4 py-8 text-center text-slate-400">
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              productos.map((producto) => (
                <tr 
                  key={producto._id} 
                  className={`hover:bg-[#0f172a]/50 transition-colors ${
                    producto.estado === 'STOCK OFICINA' && onSelectForSale 
                      ? 'cursor-pointer' 
                      : ''
                  }`}
                  onClick={() => {
                    if (producto.estado === 'STOCK OFICINA' && onSelectForSale) {
                      onSelectForSale(producto);
                    }
                  }}
                >
                  <td className="px-4 py-3 text-sm text-white font-mono">{producto.sku || '-'}</td>
                  <td className="px-4 py-3 text-sm text-white max-w-[200px] truncate" title={producto.modelo2}>
                    {producto.modelo2 || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-white text-right">{formatCLP(producto.costo)}</td>
                  <td className="px-4 py-3 text-sm text-white text-right">{formatCLP(producto.pvpEfectivo)}</td>
                  <td className="px-4 py-3 text-sm text-white text-right">{formatCLP(producto.pvpCredito)}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={producto.utilidad >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {formatCLP(producto.utilidad)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={producto.utilidad2 >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {formatCLP(producto.utilidad2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      producto.condicion === 'NUEVO' ? 'text-green-400' :
                      producto.condicion === 'SEMINUEVO' ? 'text-yellow-400' :
                      producto.condicion === 'OPENBOX' ? 'text-blue-400' :
                      'text-slate-400'
                    }`}>
                      {producto.condicion || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      producto.estado === 'STOCK OFICINA' ? 'text-[#0ea5e9]' :
                      producto.estado === 'VENDIDO' ? 'text-red-500' :
                      'text-slate-400'
                    }`}>
                      {producto.estado || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300 text-center">{producto.fechaCompra || '-'}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className={`font-medium ${
                      producto.condicionBateria >= 80 ? 'text-green-400' :
                      producto.condicionBateria >= 50 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {producto.condicionBateria ? `${producto.condicionBateria}%` : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300 font-mono text-xs max-w-[150px] truncate" title={producto.imei1}>
                    {producto.imei1 || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300 font-mono">{producto.numeroSerie || '-'}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => alert(`Ver detalles de ${producto.sku}`)}
                        className="p-2 text-slate-400 hover:text-[#0ea5e9] hover:bg-[#0ea5e9]/10 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(producto)}
                        className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(producto._id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con conteo */}
      <div className="px-4 py-3 bg-[#0f172a] border-t border-[#334155]">
        <p className="text-sm text-slate-400">
          Mostrando <span className="text-white font-medium">{productos.length}</span> de{' '}
          <span className="text-white font-medium">{totalProductos}</span> productos
        </p>
      </div>
    </div>
  );
}
