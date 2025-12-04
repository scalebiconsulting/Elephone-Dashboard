"use client";

import { useState } from 'react';
import { Check } from 'lucide-react';
import { MatrizProducto, Proveedor, FormCompra } from '@/lib/types';

interface IngresosModuleProps {
  matriz: MatrizProducto[];
  proveedores: Proveedor[];
  onAgregarProducto: (formCompra: FormCompra) => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function IngresosModule({ matriz, proveedores, onAgregarProducto, onShowNotification }: IngresosModuleProps) {
  const [formCompra, setFormCompra] = useState<FormCompra>({
    skuBase: '',
    proveedor: 'TIENDA',
    imei: '',
    costo: '',
    precioEfectivo: '',
    precioCredito: '',
    bateria: 100,
    ubicacion: 'STOCK OFICINA'
  });

  const handleRegistrarCompra = () => {
    const productoBase = matriz.find(m => m.codigo === formCompra.skuBase);
    if (!productoBase) {
      onShowNotification('SKU no encontrado en la matriz', 'error');
      return;
    }

    if (!formCompra.imei || !formCompra.costo || !formCompra.precioEfectivo) {
      onShowNotification('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    onAgregarProducto(formCompra);
    setFormCompra({
      skuBase: '',
      proveedor: 'TIENDA',
      imei: '',
      costo: '',
      precioEfectivo: '',
      precioCredito: '',
      bateria: 100,
      ubicacion: 'STOCK OFICINA'
    });
    onShowNotification('✅ Producto ingresado correctamente', 'success');
  };

  const utilidad = formCompra.costo && formCompra.precioEfectivo 
    ? parseInt(formCompra.precioEfectivo) - parseInt(formCompra.costo)
    : 0;

  const margen = formCompra.precioEfectivo && utilidad > 0
    ? ((utilidad / parseInt(formCompra.precioEfectivo)) * 100).toFixed(1)
    : '0';

  return (
    <div className="max-w-5xl animate-fadeIn">
      <div className="mb-10">
        <h1 className="text-[36px] font-bold text-[#F1F5F9] mb-3">Registro de Compras / Ingresos</h1>
        <p className="text-[15px] text-[#64748B]">Registra productos que compras a proveedores</p>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-10">
        <h3 className="text-[22px] font-bold text-[#F1F5F9] mb-8">📦 Nuevo Producto</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Buscar en Matriz */}
          <div className="md:col-span-2">
            <label className="block text-[15px] font-semibold text-[#94A3B8] mb-3">Buscar en Matriz</label>
            <select
              value={formCompra.skuBase}
              onChange={(e) => setFormCompra({...formCompra, skuBase: e.target.value})}
              className="w-full px-5 py-4 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[16px] focus:outline-none focus:border-[#0EA5E9] focus:ring-[3px] focus:ring-[#0EA5E910] transition-all"
            >
              <option value="">Seleccionar producto...</option>
              {matriz.map(m => (
                <option key={m.codigo} value={m.codigo}>{m.nombre}</option>
              ))}
            </select>
            <small className="text-[13px] text-[#64748B] mt-2 block">El SKU se generará automáticamente</small>
          </div>

          {/* Proveedor */}
          <div>
            <label className="block text-[15px] font-semibold text-[#94A3B8] mb-3">Proveedor</label>
            <select
              value={formCompra.proveedor}
              onChange={(e) => setFormCompra({...formCompra, proveedor: e.target.value as typeof formCompra.proveedor})}
              className="w-full px-5 py-4 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[16px] focus:outline-none focus:border-[#0EA5E9] focus:ring-[3px] focus:ring-[#0EA5E910] transition-all"
            >
              {proveedores.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* IMEI */}
          <div>
            <label className="block text-[15px] font-semibold text-[#94A3B8] mb-3">IMEI</label>
            <input
              type="text"
              value={formCompra.imei}
              onChange={(e) => setFormCompra({...formCompra, imei: e.target.value})}
              placeholder="353084064746173"
              className="w-full px-5 py-4 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[16px] focus:outline-none focus:border-[#0EA5E9] focus:ring-[3px] focus:ring-[#0EA5E910] transition-all"
            />
          </div>

          {/* Costo */}
          <div>
            <label className="block text-[15px] font-semibold text-[#94A3B8] mb-3">Costo Compra</label>
            <input
              type="number"
              value={formCompra.costo}
              onChange={(e) => setFormCompra({...formCompra, costo: e.target.value})}
              placeholder="660000"
              className="w-full px-5 py-4 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[16px] focus:outline-none focus:border-[#0EA5E9] focus:ring-[3px] focus:ring-[#0EA5E910] transition-all"
            />
          </div>

          {/* Precio Efectivo */}
          <div>
            <label className="block text-[15px] font-semibold text-[#94A3B8] mb-3">Precio Efectivo</label>
            <input
              type="number"
              value={formCompra.precioEfectivo}
              onChange={(e) => setFormCompra({...formCompra, precioEfectivo: e.target.value})}
              placeholder="820000"
              className="w-full px-5 py-4 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[16px] focus:outline-none focus:border-[#0EA5E9] focus:ring-[3px] focus:ring-[#0EA5E910] transition-all"
            />
          </div>

          {/* Precio Crédito */}
          <div>
            <label className="block text-[15px] font-semibold text-[#94A3B8] mb-3">Precio Crédito</label>
            <input
              type="number"
              value={formCompra.precioCredito}
              onChange={(e) => setFormCompra({...formCompra, precioCredito: e.target.value})}
              placeholder="900000"
              className="w-full px-5 py-4 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[16px] focus:outline-none focus:border-[#0EA5E9] focus:ring-[3px] focus:ring-[#0EA5E910] transition-all"
            />
          </div>

          {/* Batería */}
          <div>
            <label className="block text-[15px] font-semibold text-[#94A3B8] mb-3">Batería %</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formCompra.bateria}
              onChange={(e) => setFormCompra({...formCompra, bateria: parseInt(e.target.value)})}
              className="w-full px-5 py-4 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[16px] focus:outline-none focus:border-[#0EA5E9] focus:ring-[3px] focus:ring-[#0EA5E910] transition-all"
            />
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-[15px] font-semibold text-[#94A3B8] mb-3">Ubicación</label>
            <select
              value={formCompra.ubicacion}
              onChange={(e) => setFormCompra({...formCompra, ubicacion: e.target.value})}
              className="w-full px-5 py-4 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[16px] focus:outline-none focus:border-[#0EA5E9] focus:ring-[3px] focus:ring-[#0EA5E910] transition-all"
            >
              <option value="STOCK OFICINA">Stock Oficina</option>
              <option value="STOCK BODEGA">Stock Bodega</option>
            </select>
          </div>
        </div>

        {/* Preview de utilidad */}
        {utilidad > 0 && (
          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[#10B98120] to-transparent border-l-4 border-[#10B981] rounded-lg mb-8">
            <span className="text-[16px] text-[#94A3B8]">Utilidad estimada:</span>
            <strong className="text-[24px] text-[#10B981]">${utilidad.toLocaleString('es-CL')}</strong>
            <span className="text-[15px] text-[#64748B]">({margen}%)</span>
          </div>
        )}

        <button
          onClick={handleRegistrarCompra}
          disabled={!formCompra.skuBase || !formCompra.imei || !formCompra.costo}
          className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] rounded-lg text-white font-semibold text-[17px] hover:shadow-[0_8px_24px_rgba(14,165,233,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          <Check size={22} />
          Registrar Compra
        </button>
      </div>
    </div>
  );
}
