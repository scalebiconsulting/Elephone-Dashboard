"use client";

import { X, TrendingUp, Calendar, DollarSign, Package } from 'lucide-react';
import { Producto } from '@/lib/types';

interface ModalHistorialProps {
  producto: Producto;
  onClose: () => void;
}

export default function ModalHistorial({ producto, onClose }: ModalHistorialProps) {
  const diasEnStock = producto.fechaVenta && producto.fechaCompra
    ? Math.floor((new Date(producto.fechaVenta).getTime() - new Date(producto.fechaCompra).getTime()) / (1000 * 60 * 60 * 24))
    : Math.floor((new Date().getTime() - new Date(producto.fechaCompra).getTime()) / (1000 * 60 * 60 * 24));

  const roi = producto.costo > 0 ? ((producto.utilidad / producto.costo) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-[#1E293B] border-2 border-[#334155] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#334155]">
          <div>
            <h2 className="text-[22px] font-bold text-[#F1F5F9]">{producto.equipo} {producto.modelo}</h2>
            <p className="text-[14px] text-[#64748B] mt-1">{producto.color} • {producto.gb}GB • {producto.condicion}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-[#0F172A] border border-[#334155] rounded-lg text-[#64748B] hover:text-[#EF4444] hover:border-[#EF4444] transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Métricas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0F172A] border border-[#334155] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-[#0EA5E9]" />
                <span className="text-[12px] text-[#64748B]">Días</span>
              </div>
              <strong className="text-[20px] font-bold text-[#F1F5F9]">{diasEnStock}</strong>
            </div>

            <div className="bg-[#0F172A] border border-[#334155] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-[#10B981]" />
                <span className="text-[12px] text-[#64748B]">Utilidad</span>
              </div>
              <strong className="text-[20px] font-bold text-[#10B981]">${(producto.utilidad / 1000).toFixed(0)}K</strong>
            </div>

            <div className="bg-[#0F172A] border border-[#334155] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-[#F59E0B]" />
                <span className="text-[12px] text-[#64748B]">ROI</span>
              </div>
              <strong className="text-[20px] font-bold text-[#F59E0B]">{roi}%</strong>
            </div>

            <div className="bg-[#0F172A] border border-[#334155] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package size={18} className="text-[#64748B]" />
                <span className="text-[12px] text-[#64748B]">Estado</span>
              </div>
              <strong className={`text-[14px] font-bold uppercase ${
                producto.estado === 'DISPONIBLE' ? 'text-[#10B981]' :
                producto.estado === 'VENDIDO' ? 'text-[#0EA5E9]' :
                'text-[#F59E0B]'
              }`}>
                {producto.estado}
              </strong>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-[16px] font-semibold text-[#F1F5F9] mb-4">Línea de Tiempo</h3>
            <div className="space-y-4">
              {/* Compra */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#10B98130] border-2 border-[#10B981] rounded-full">
                    <Package size={18} className="text-[#10B981]" />
                  </div>
                  {(producto.estado === 'VENDIDO' || producto.estado === 'EN TALLER') && (
                    <div className="w-0.5 h-12 bg-[#334155]"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-start mb-1">
                    <strong className="text-[15px] text-[#F1F5F9]">Compra</strong>
                    <span className="text-[13px] text-[#64748B]">{new Date(producto.fechaCompra).toLocaleDateString('es-MX')}</span>
                  </div>
                  <p className="text-[13px] text-[#64748B]">Proveedor: {producto.proveedor}</p>
                  <p className="text-[13px] text-[#64748B]">Costo: ${(producto.costo / 1000).toFixed(0)}K</p>
                  <p className="text-[13px] text-[#64748B]">IMEI: {producto.imei}</p>
                </div>
              </div>

              {/* Stock */}
              {producto.estado === 'DISPONIBLE' && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#0EA5E930] border-2 border-[#0EA5E9] rounded-full">
                      <Calendar size={18} className="text-[#0EA5E9]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <strong className="text-[15px] text-[#F1F5F9]">En Stock</strong>
                    <p className="text-[13px] text-[#64748B] mt-1">Ubicación: {producto.ubicacion || 'N/A'}</p>
                    <p className="text-[13px] text-[#64748B]">Precio Efectivo: ${(producto.precioEfectivo / 1000).toFixed(0)}K</p>
                    <p className="text-[13px] text-[#64748B]">Precio Crédito: ${(producto.precioCredito / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              )}

              {/* Venta */}
              {producto.estado === 'VENDIDO' && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#0EA5E930] border-2 border-[#0EA5E9] rounded-full">
                      <DollarSign size={18} className="text-[#0EA5E9]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <strong className="text-[15px] text-[#F1F5F9]">Venta</strong>
                      <span className="text-[13px] text-[#64748B]">
                        {producto.fechaVenta ? new Date(producto.fechaVenta).toLocaleDateString('es-MX') : 'N/A'}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#64748B]">Método: {producto.metodoPago || 'N/A'}</p>
                    <p className="text-[13px] text-[#10B981]">Precio: ${(producto.precioEfectivo / 1000).toFixed(0)}K</p>
                    <p className="text-[13px] text-[#10B981]">Utilidad: ${(producto.utilidad / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detalles Técnicos */}
          <div>
            <h3 className="text-[16px] font-semibold text-[#F1F5F9] mb-4">Detalles Técnicos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[12px] text-[#64748B] mb-1">SKU</p>
                <strong className="text-[14px] text-[#F1F5F9]">{producto.sku}</strong>
              </div>
              <div>
                <p className="text-[12px] text-[#64748B] mb-1">Batería</p>
                <strong className="text-[14px] text-[#F1F5F9]">{producto.bateria}%</strong>
              </div>
              <div>
                <p className="text-[12px] text-[#64748B] mb-1">Almacenamiento</p>
                <strong className="text-[14px] text-[#F1F5F9]">{producto.gb}GB</strong>
              </div>
              <div>
                <p className="text-[12px] text-[#64748B] mb-1">Condición</p>
                <strong className="text-[14px] text-[#F1F5F9]">{producto.condicion}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#334155]">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] rounded-lg text-white font-semibold text-[15px] hover:shadow-[0_8px_24px_rgba(14,165,233,0.4)] hover:-translate-y-0.5 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
