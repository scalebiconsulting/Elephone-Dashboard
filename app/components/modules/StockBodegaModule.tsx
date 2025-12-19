"use client";

import { Warehouse, Search, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { formatCLP } from '@/app/utils/formatters';
import { ProductoInventario } from '@/app/types/producto';

const ESTADO_FILTRO = 'STOCK BODEGA';

export default function StockBodegaModule() {
  const [productos, setProductos] = useState<ProductoInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/productos');
      const data = await response.json();
      if (data.success) {
        // Filtrar solo productos en STOCK BODEGA
        const filtrados = data.data.filter((p: ProductoInventario) => p.estado === ESTADO_FILTRO);
        setProductos(filtrados);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const productosFiltrados = useMemo(() => {
    if (!searchTerm) return productos;
    return productos.filter((producto) => 
      producto.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.modelo2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.imei1?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm]);

  const valorTotal = useMemo(() => {
    return productosFiltrados.reduce((acc, p) => acc + (p.costo || 0), 0);
  }, [productosFiltrados]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Warehouse className="text-purple-500" size={32} />
          <h1 className="text-3xl font-bold text-white">Stock Bodega</h1>
        </div>
        <button
          onClick={fetchProductos}
          className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-slate-300 hover:bg-[#334155] transition-colors"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Warehouse className="text-purple-500" size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Productos en Bodega</p>
              <p className="text-3xl font-bold text-white">{productosFiltrados.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#10b981]/20 rounded-lg flex items-center justify-center">
              <span className="text-[#10b981] text-xl font-bold">$</span>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Valor en Bodega</p>
              <p className="text-3xl font-bold text-white">{formatCLP(valorTotal)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar SKU, modelo, IMEI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Cargando productos...</div>
        ) : productosFiltrados.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No hay productos en bodega</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f172a]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Modelo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">IMEI</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Condición</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Costo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {productosFiltrados.map((producto) => (
                  <tr key={producto._id} className="hover:bg-[#334155]/50">
                    <td className="px-4 py-3 text-sm text-[#0ea5e9] font-mono">{producto.sku}</td>
                    <td className="px-4 py-3 text-sm text-white">{producto.modelo2}</td>
                    <td className="px-4 py-3 text-sm text-slate-400 font-mono">{producto.imei1}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{producto.condicion}</td>
                    <td className="px-4 py-3 text-sm text-white text-right">{formatCLP(producto.costo)}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{producto.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
