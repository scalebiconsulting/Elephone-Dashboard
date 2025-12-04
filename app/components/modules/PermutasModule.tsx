"use client";

import { useState } from 'react';
import { ArrowRight, Battery, Smartphone, Calculator } from 'lucide-react';
import { MatrizProducto, PrecioPermuta, TipoBateria } from '@/lib/types';

interface PermutasModuleProps {
  matriz: MatrizProducto[];
  preciosPermutas: PrecioPermuta[];
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function PermutasModule({ matriz, preciosPermutas, onShowNotification }: PermutasModuleProps) {
  const [productoNuevo, setProductoNuevo] = useState<MatrizProducto | null>(null);
  const [productoUsado, setProductoUsado] = useState<PrecioPermuta | null>(null);
  const [tipoBateria, setTipoBateria] = useState<TipoBateria>('CON_BATERIA');

  // Precios simulados para productos nuevos (basados en promedio del stock)
  const getPrecioNuevo = (modelo: string): number => {
    if (modelo.includes('16 PRO')) return 1050000;
    if (modelo.includes('15 PRO MAX')) return 820000;
    if (modelo.includes('14 PRO')) return 700000;
    if (modelo.includes('14')) return 600000;
    if (modelo.includes('13')) return 370000;
    return 500000;
  };

  const calcularDiferencia = () => {
    if (!productoNuevo || !productoUsado) return 0;
    const valorUsado = tipoBateria === 'CON_BATERIA' ? productoUsado.precioBateria : productoUsado.precioMagia;
    const precioNuevo = getPrecioNuevo(productoNuevo.modelo);
    return precioNuevo - valorUsado;
  };

  const procesarPermuta = () => {
    if (!productoNuevo || !productoUsado) {
      onShowNotification('Selecciona ambos productos', 'error');
      return;
    }

    onShowNotification(
      `✅ Permuta registrada: ${productoUsado.modelo} por ${productoNuevo.modelo}`,
      'success'
    );
    
    setProductoNuevo(null);
    setProductoUsado(null);
    setTipoBateria('CON_BATERIA');
  };

  const diferencia = calcularDiferencia();

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn">
      <h2 className="text-[32px] font-bold text-[#F1F5F9] mb-8">Calculadora de Permutas</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_100px_1fr] gap-8 mb-8">
        {/* Producto Nuevo */}
        <div>
          <h3 className="text-[22px] font-semibold text-[#F1F5F9] mb-5">Producto Nuevo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matriz.map((m, idx) => (
              <div
                key={idx}
                onClick={() => setProductoNuevo(m)}
                className={`p-6 rounded-xl cursor-pointer border-2 transition-all min-h-[120px] ${
                  productoNuevo?.codigo === m.codigo
                    ? 'bg-[#0EA5E920] border-[#0EA5E9] shadow-[0_4px_16px_rgba(14,165,233,0.3)]'
                    : 'bg-[#1E293B] border-[#334155] hover:border-[#0EA5E9]'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <Smartphone size={28} className="text-[#0EA5E9]" />
                  <div>
                    <h4 className="text-[17px] font-semibold text-[#F1F5F9]">{m.modelo}</h4>
                    <p className="text-[14px] text-[#64748B]">{m.color} • {m.gb}GB</p>
                  </div>
                </div>
                <div className="text-[22px] font-bold text-[#10B981]">${(getPrecioNuevo(m.modelo) / 1000).toFixed(0)}K</div>
              </div>
            ))}
          </div>
        </div>

        {/* Separador */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="w-16 h-16 flex items-center justify-center bg-[#0EA5E9] rounded-full">
            <ArrowRight size={28} className="text-white" />
          </div>
        </div>

        {/* Producto Usado */}
        <div>
          <h3 className="text-[22px] font-semibold text-[#F1F5F9] mb-5">Producto Usado</h3>
          
          <div className="mb-6">
            <label className="block text-[16px] font-semibold text-[#94A3B8] mb-3">Estado de Batería</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTipoBateria('CON_BATERIA')}
                className={`flex items-center justify-center gap-2 px-5 py-4 rounded-lg font-semibold text-[16px] transition-all ${
                  tipoBateria === 'CON_BATERIA'
                    ? 'bg-[#10B981] text-white shadow-[0_4px_16px_rgba(16,185,129,0.3)]'
                    : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:border-[#10B981]'
                }`}
              >
                <Battery size={18} />
                Con Batería
              </button>
              <button
                onClick={() => setTipoBateria('CON_MAGIA')}
                className={`flex items-center justify-center gap-2 px-5 py-4 rounded-lg font-semibold text-[16px] transition-all ${
                  tipoBateria === 'CON_MAGIA'
                    ? 'bg-[#F59E0B] text-white shadow-[0_4px_16px_rgba(245,158,11,0.3)]'
                    : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:border-[#F59E0B]'
                }`}
              >
                <Battery size={18} />
                Con Magia
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {preciosPermutas.map((p, idx) => (
              <div
                key={idx}
                onClick={() => setProductoUsado(p)}
                className={`p-6 rounded-xl cursor-pointer border-2 transition-all min-h-[120px] ${
                  productoUsado?.modelo === p.modelo
                    ? 'bg-[#0EA5E920] border-[#0EA5E9] shadow-[0_4px_16px_rgba(14,165,233,0.3)]'
                    : 'bg-[#1E293B] border-[#334155] hover:border-[#0EA5E9]'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <Smartphone size={24} className="text-[#64748B]" />
                  <h4 className="text-[16px] font-semibold text-[#F1F5F9]">{p.modelo}</h4>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-[#64748B]">Valor:</span>
                  <span className="text-[20px] font-bold text-[#F59E0B]">
                    ${((tipoBateria === 'CON_BATERIA' ? p.precioBateria : p.precioMagia) / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen */}
      {productoNuevo && productoUsado && (
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-2 border-[#0EA5E9] rounded-2xl p-10 animate-slideUp">
          <div className="flex items-center gap-4 mb-8">
            <Calculator size={32} className="text-[#0EA5E9]" />
            <h3 className="text-[24px] font-bold text-[#F1F5F9]">Resumen de Permuta</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center p-6 bg-[#0F172A] rounded-xl">
              <p className="text-[16px] text-[#64748B] mb-3">Valor Producto Nuevo</p>
              <strong className="text-[28px] font-bold text-[#10B981]">
                ${(getPrecioNuevo(productoNuevo.modelo) / 1000).toFixed(0)}K
              </strong>
            </div>
            <div className="text-center p-6 bg-[#0F172A] rounded-xl">
              <p className="text-[16px] text-[#64748B] mb-3">Valor Producto Usado</p>
              <strong className="text-[28px] font-bold text-[#F59E0B]">
                ${((tipoBateria === 'CON_BATERIA' ? productoUsado.precioBateria : productoUsado.precioMagia) / 1000).toFixed(0)}K
              </strong>
            </div>
            <div className="text-center p-6 bg-[#0F172A] rounded-xl">
              <p className="text-[16px] text-[#64748B] mb-3">Diferencia a Pagar</p>
              <strong className="text-[32px] font-bold text-[#0EA5E9]">
                ${(diferencia / 1000).toFixed(0)}K
              </strong>
            </div>
          </div>

          <button
            onClick={procesarPermuta}
            className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] rounded-lg text-white font-semibold text-[18px] hover:shadow-[0_8px_24px_rgba(14,165,233,0.4)] hover:-translate-y-0.5 transition-all"
          >
            <ArrowRight size={22} />
            Confirmar Permuta
          </button>
        </div>
      )}
    </div>
  );
}
