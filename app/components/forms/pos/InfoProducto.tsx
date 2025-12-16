"use client";

import { ProductoInventario } from '@/app/types/producto';
import { formatCLP } from '@/app/utils/formatters';

interface InfoProductoProps {
  producto: ProductoInventario;
}

export default function InfoProducto({ producto }: InfoProductoProps) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 h-full">
      <h2 className="text-xl font-semibold text-white mb-4">📦 Información del Producto</h2>
      
      <div className="space-y-3 text-sm">
        <div>
          <label className="text-slate-400 block mb-1">Equipo</label>
          <p className="text-white font-medium">{producto.equipo}</p>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Serie</label>
          <p className="text-white font-medium">{producto.serie}</p>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Modelo</label>
          <p className="text-white font-medium">{producto.modelo2}</p>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">SKU</label>
          <p className="text-white font-mono text-xs">{producto.sku}</p>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Condición</label>
          <p className="text-white font-medium">{producto.condicion}</p>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Batería</label>
          <p className="text-white font-medium">{producto.condicionBateria}%</p>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Color</label>
          <p className="text-white font-medium">{producto.color}</p>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Almacenamiento</label>
          <p className="text-white font-medium">{producto.gb} GB</p>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Costo</label>
          <p className="text-white font-medium">{formatCLP(producto.costo)}</p>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Repuesto</label>
          <p className="text-white font-medium">{formatCLP(producto.repuesto || 0)}</p>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">PVP Efectivo</label>
          <p className="text-green-400 font-bold">{formatCLP(producto.pvpEfectivo)}</p>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">PVP Crédito</label>
          <p className="text-blue-400 font-bold">{formatCLP(producto.pvpCredito)}</p>
        </div>

        {producto.numeroSerie && (
          <div>
            <label className="text-slate-400 block mb-1">Número de Serie</label>
            <p className="text-white font-mono text-xs">{producto.numeroSerie}</p>
          </div>
        )}

        {producto.concatenacion && (
          <div>
            <label className="text-slate-400 block mb-1">IMEI</label>
            <p className="text-white font-mono text-xs">{producto.concatenacion}</p>
          </div>
        )}
      </div>
    </div>
  );
}
