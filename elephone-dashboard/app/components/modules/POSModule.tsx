"use client";

import { useState } from 'react';
import { Search, ShoppingCart, X, Check, Smartphone, Battery } from 'lucide-react';
import { Producto, MetodoPago } from '@/lib/types';

interface POSModuleProps {
  productos: Producto[];
  onProcesarVenta: (productosVendidos: Producto[], metodoPago: MetodoPago) => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function POSModule({ productos, onProcesarVenta, onShowNotification }: POSModuleProps) {
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('TRANSFERENCIA');
  const [searchQuery, setSearchQuery] = useState('');

  const productosDisponibles = productos.filter(p => p.estado === 'DISPONIBLE');

  const agregarAlCarrito = (producto: Producto) => {
    if (producto.estado !== 'DISPONIBLE') {
      onShowNotification('Este producto no está disponible', 'error');
      return;
    }
    setCarrito([...carrito, producto]);
    onShowNotification(`${producto.modelo} agregado al carrito`, 'success');
  };

  const procesarVenta = () => {
    if (carrito.length === 0) return;
    
    onProcesarVenta(carrito, metodoPago);
    
    const total = carrito.reduce((sum, p) => sum + p.precioEfectivo, 0);
    onShowNotification(`✅ Venta procesada: $${(total / 1000).toFixed(0)}K`, 'success');
    setCarrito([]);
  };

  const total = carrito.reduce((sum, p) => sum + p.precioEfectivo, 0);

  const productosFiltrados = productosDisponibles.filter(p =>
    p.modelo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.imei.includes(searchQuery) ||
    p.color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8 h-[calc(100vh-12rem)] animate-fadeIn">
      {/* Productos */}
      <div className="overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-[28px] font-bold text-[#F1F5F9] mb-5">Productos Disponibles</h2>
          <div className="flex items-center gap-4 px-5 py-4 bg-[#1E293B] border border-[#334155] rounded-lg">
            <Search size={20} className="text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por modelo, IMEI..."
              className="flex-1 bg-transparent border-none text-[#E2E8F0] text-[16px] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {productosFiltrados.map(p => (
            <div
              key={p.id}
              onClick={() => agregarAlCarrito(p)}
              className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 cursor-pointer hover:border-[#0EA5E9] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(14,165,233,0.2)] transition-all min-h-[180px]"
            >
              <div className="flex justify-between items-start mb-5">
                <Smartphone size={36} className="text-[#0EA5E9]" />
                <span className={`px-3 py-1.5 rounded-lg text-[12px] font-bold uppercase ${
                  p.condicion === 'NUEVO' ? 'bg-[#10B98130] text-[#10B981]' :
                  p.condicion === 'OPENBOX' ? 'bg-[#0EA5E930] text-[#0EA5E9]' :
                  'bg-[#F59E0B30] text-[#F59E0B]'
                }`}>
                  {p.condicion}
                </span>
              </div>
              <h4 className="text-[17px] font-semibold text-[#F1F5F9] mb-2">{p.equipo} {p.modelo}</h4>
              <p className="text-[14px] text-[#64748B] mb-4">{p.color} • {p.gb}GB</p>
              <div className="flex items-center gap-2 mb-5">
                <Battery size={18} className={p.bateria >= 90 ? 'text-[#10B981]' : 'text-[#F59E0B]'} />
                <span className="text-[14px] text-[#94A3B8]">{p.bateria}%</span>
              </div>
              <div className="space-y-1">
                <div className="text-[22px] font-bold text-[#10B981]">${(p.precioEfectivo / 1000).toFixed(0)}K</div>
                <div className="text-[13px] text-[#64748B]">${(p.precioCredito / 1000).toFixed(0)}K crédito</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-7 flex flex-col h-full sticky top-0">
        <h3 className="text-[22px] font-bold text-[#F1F5F9] mb-7">Carrito de Venta</h3>

        {carrito.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingCart size={56} className="text-[#64748B] opacity-30 mb-5" />
            <p className="text-[#64748B] text-[17px] mb-2">Carrito vacío</p>
            <small className="text-[#64748B] text-[14px]">Selecciona productos para vender</small>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 mb-7">
              {carrito.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-5 bg-[#0F172A] rounded-lg border border-transparent hover:border-[#0EA5E9] transition-all">
                  <div className="flex-1">
                    <strong className="text-[#F1F5F9] text-[16px] block mb-1">{item.modelo}</strong>
                    <span className="text-[#64748B] text-[14px]">{item.color} • {item.gb}GB</span>
                  </div>
                  <div className="text-[18px] font-semibold text-[#10B981]">${(item.precioEfectivo / 1000).toFixed(0)}K</div>
                  <button
                    onClick={() => setCarrito(carrito.filter((_, i) => i !== idx))}
                    className="w-10 h-10 flex items-center justify-center bg-[#EF444420] border border-[#EF4444] rounded-lg text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[15px] font-semibold text-[#94A3B8] mb-3">Método de Pago</label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
                  className="w-full px-5 py-4 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[16px] focus:outline-none focus:border-[#0EA5E9]"
                >
                  <option value="TRANSFERENCIA">Transferencia</option>
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="CREDITO">Crédito</option>
                  <option value="PERMUTA">Permuta</option>
                </select>
              </div>

              <div className="flex justify-between items-center py-5 border-t-2 border-b-2 border-[#334155]">
                <span className="text-[16px] text-[#94A3B8]">Total</span>
                <strong className="text-[32px] font-bold text-[#10B981]">${(total / 1000).toFixed(0)}K</strong>
              </div>

              <button
                onClick={procesarVenta}
                className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] rounded-lg text-white font-semibold text-[17px] hover:shadow-[0_8px_24px_rgba(14,165,233,0.4)] hover:-translate-y-0.5 transition-all"
              >
                <Check size={22} />
                Procesar Venta
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
