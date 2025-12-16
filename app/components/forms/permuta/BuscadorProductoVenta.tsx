"use client";

import { ProductoInventario } from '@/app/types/producto';
import { formatCLP } from '@/app/utils/formatters';
import { Search, X, Loader2 } from 'lucide-react';

interface BuscadorProductoVentaProps {
  skuBusqueda: string;
  setSkuBusqueda: (value: string) => void;
  productoVenta: ProductoInventario | null;
  setProductoVenta: (producto: ProductoInventario | null) => void;
  buscando: boolean;
  errorBusqueda: string;
  buscarProductoPorSku: () => void;
}

export default function BuscadorProductoVenta({
  skuBusqueda,
  setSkuBusqueda,
  productoVenta,
  setProductoVenta,
  buscando,
  errorBusqueda,
  buscarProductoPorSku,
}: BuscadorProductoVentaProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      buscarProductoPorSku();
    }
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">🔍 Producto a Vender (Sale)</h2>
      <p className="text-slate-400 text-sm mb-4">Busque el producto del inventario que el cliente desea comprar</p>
      
      {/* Buscador */}
      <div className="flex gap-2 mb-4 items-center">
        <div className="w-72 relative">
          <input
            type="text"
            value={skuBusqueda}
            onChange={(e) => setSkuBusqueda(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2.5 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9]"
            placeholder="Ingrese SKU del producto..."
          />
        </div>
        <button
          onClick={buscarProductoPorSku}
          disabled={buscando}
          className="px-4 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {buscando ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          Buscar
        </button>
      </div>

      {/* Error */}
      {errorBusqueda && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
          <p className="text-red-400 text-sm">{errorBusqueda}</p>
        </div>
      )}

      {/* Producto encontrado */}
      {productoVenta && (
        <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-white font-medium">{productoVenta.modelo2}</h3>
            <button
              onClick={() => {
                setProductoVenta(null);
                setSkuBusqueda('');
              }}
              className="text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400">SKU:</span>
                <span className="text-white ml-2 font-mono text-xs">{productoVenta.sku}</span>
              </div>
              <div>
                <span className="text-slate-400">Estado:</span>
                <span className="text-white ml-2">{productoVenta.estado}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400">Condición:</span>
                <span className="text-white ml-2">{productoVenta.condicion}</span>
              </div>
              <div>
                <span className="text-slate-400">Batería:</span>
                <span className="text-white ml-2">{productoVenta.condicionBateria}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400">Color:</span>
                <span className="text-white ml-2">{productoVenta.color}</span>
              </div>
              <div>
                <span className="text-slate-400">Almacenamiento:</span>
                <span className="text-white ml-2">{productoVenta.gb} GB</span>
              </div>
            </div>

            <div className="border-t border-[#334155] pt-2 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">Costo:</span>
                  <span className="text-white ml-2">{formatCLP(productoVenta.costo)}</span>
                </div>
                <div>
                  <span className="text-slate-400">Repuesto:</span>
                  <span className="text-white ml-2">{formatCLP(productoVenta.repuesto || 0)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#334155] pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">PVP Efectivo:</span>
                <span className="text-2xl font-bold text-green-400">{formatCLP(productoVenta.pvpEfectivo)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder */}
      {!productoVenta && !errorBusqueda && (
        <div className="bg-[#0f172a] border border-dashed border-[#334155] rounded-lg p-8 text-center">
          <Search className="mx-auto mb-2 text-slate-600" size={32} />
          <p className="text-slate-500 text-sm">Busque un producto por su SKU</p>
        </div>
      )}
    </div>
  );
}
