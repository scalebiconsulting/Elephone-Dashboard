"use client";

import { useState } from 'react';
import { X, CreditCard, DollarSign, AlertCircle } from 'lucide-react';
import { formatCLP } from '@/app/utils/formatters';
import { ProductoInventario } from '@/app/types/producto';
import DateInput from '@/app/components/forms/shared/DateInput';

interface CuotaConProducto {
  producto: ProductoInventario;
  cuota: {
    numero: number;
    monto: number;
    fechaVencimiento: string;
    montoEfectivo: number;
    montoTransferencia: number;
    referenciaTransferencia?: string;
    fechaPago?: string;
    estado: 'PENDIENTE' | 'PAGADO';
  };
  indiceCuota: number; // -1 para pago inmediato
}

interface ModalPagoCuotaProps {
  isOpen: boolean;
  onClose: () => void;
  cuotaConProducto: CuotaConProducto;
  onPagoRegistrado: () => void;
}

export default function ModalPagoCuota({
  isOpen,
  onClose,
  cuotaConProducto,
  onPagoRegistrado
}: ModalPagoCuotaProps) {
  const { producto, cuota, indiceCuota } = cuotaConProducto;
  const esProrrateado = indiceCuota >= 0;
  
  const [montoEfectivo, setMontoEfectivo] = useState('');
  const [montoTransferencia, setMontoTransferencia] = useState('');
  const [referenciaTransferencia, setReferenciaTransferencia] = useState('');
  const [fechaPago, setFechaPago] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const montoEfectivoNum = parseFloat(montoEfectivo) || 0;
  const montoTransferenciaNum = parseFloat(montoTransferencia) || 0;
  const totalPagar = montoEfectivoNum + montoTransferenciaNum;
  const diferencia = cuota.monto - totalPagar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (totalPagar <= 0) {
      setError('Debe ingresar al menos un monto');
      return;
    }

    if (totalPagar > cuota.monto) {
      setError('El monto total no puede exceder el saldo pendiente');
      return;
    }

    if (montoTransferenciaNum > 0 && !referenciaTransferencia.trim()) {
      setError('Debe ingresar la referencia de la transferencia');
      return;
    }

    setLoading(true);

    try {
      // Construir el objeto de pago actualizado
      const pagoActualizado = { ...producto.pagoProveedor };
      
      if (!pagoActualizado) {
        setError('No se encontró información de pago');
        return;
      }

      if (esProrrateado) {
        // Actualizar cuota específica
        const cuotas = [...(pagoActualizado.cuotas || [])];
        cuotas[indiceCuota] = {
          ...cuotas[indiceCuota],
          montoEfectivo: montoEfectivoNum,
          montoTransferencia: montoTransferenciaNum,
          referenciaTransferencia: referenciaTransferencia || undefined,
          fechaPago,
          estado: totalPagar >= cuota.monto ? 'PAGADO' : 'PENDIENTE'
        };
        pagoActualizado.cuotas = cuotas;
        
        // Recalcular totales
        const totalPagado = cuotas.reduce((sum, c) => 
          sum + (c.estado === 'PAGADO' ? c.monto : 0), 0
        );
        const saldoPendiente = cuotas.reduce((sum, c) => 
          sum + (c.estado === 'PENDIENTE' ? c.monto : 0), 0
        );
        
        pagoActualizado.totalPagado = totalPagado;
        pagoActualizado.saldoPendiente = saldoPendiente;
        
        // Determinar estado general
        if (saldoPendiente === 0) {
          pagoActualizado.estado = 'PAGADO';
        } else if (totalPagado > 0) {
          pagoActualizado.estado = 'PARCIAL';
        }
      } else {
        // Pago inmediato
        pagoActualizado.montoEfectivo = (pagoActualizado.montoEfectivo || 0) + montoEfectivoNum;
        pagoActualizado.montoTransferencia = (pagoActualizado.montoTransferencia || 0) + montoTransferenciaNum;
        
        if (montoTransferenciaNum > 0) {
          pagoActualizado.referenciaTransferencia = referenciaTransferencia;
        }
        
        pagoActualizado.fechaPago = fechaPago;
        pagoActualizado.totalPagado = pagoActualizado.montoEfectivo + pagoActualizado.montoTransferencia;
        pagoActualizado.saldoPendiente = producto.costo - pagoActualizado.totalPagado;
        
        if (pagoActualizado.saldoPendiente <= 0) {
          pagoActualizado.estado = 'PAGADO';
          pagoActualizado.saldoPendiente = 0;
        } else {
          pagoActualizado.estado = 'PARCIAL';
        }
      }

      // Enviar actualización al servidor
      const response = await fetch(`/api/productos/${producto._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pagoProveedor: pagoActualizado
        })
      });

      const data = await response.json();

      if (data.success) {
        onPagoRegistrado();
        onClose();
      } else {
        setError(data.error || 'Error al registrar el pago');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#1e293b] border border-[#334155] rounded-xl w-full max-w-lg mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CreditCard className="text-green-400" size={24} />
            <h2 className="text-xl font-bold text-white">
              {esProrrateado ? `Pagar Cuota #${cuota.numero}` : 'Registrar Pago'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Info del producto */}
        <div className="bg-[#0f172a] rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">SKU</p>
              <p className="text-white font-mono">{producto.sku}</p>
            </div>
            <div>
              <p className="text-slate-400">Modelo</p>
              <p className="text-white">{producto.modelo2}</p>
            </div>
            <div>
              <p className="text-slate-400">Proveedor</p>
              <p className="text-white">{producto.proveedor?.nombre || '-'}</p>
            </div>
            <div>
              <p className="text-slate-400">Monto a Pagar</p>
              <p className="text-green-400 font-bold text-lg">{formatCLP(cuota.monto)}</p>
            </div>
          </div>
          {esProrrateado && (
            <div className="mt-3 pt-3 border-t border-[#334155]">
              <p className="text-slate-400 text-sm">
                Vencimiento: <span className="text-white">{new Date(cuota.fechaVencimiento).toLocaleDateString('es-CL')}</span>
              </p>
            </div>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <AlertCircle className="text-red-400" size={20} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Monto Efectivo */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                💵 Monto Efectivo
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={cuota.monto}
                value={montoEfectivo}
                onChange={(e) => setMontoEfectivo(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] text-white rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="0"
              />
            </div>

            {/* Monto Transferencia */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                🏦 Monto Transferencia
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={cuota.monto}
                value={montoTransferencia}
                onChange={(e) => setMontoTransferencia(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Referencia Transferencia */}
          {montoTransferenciaNum > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                📝 Referencia/Comprobante de Transferencia *
              </label>
              <input
                type="text"
                value={referenciaTransferencia}
                onChange={(e) => setReferenciaTransferencia(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Número de comprobante"
                required
              />
            </div>
          )}

          {/* Fecha de Pago */}
          <div>
            <DateInput
              label="📅 Fecha de Pago"
              value={fechaPago}
              onChange={setFechaPago}
              placeholder="Seleccionar fecha"
            />
          </div>

          {/* Resumen */}
          <div className="bg-[#0f172a] rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total a Pagar:</span>
              <span className="text-white font-bold text-xl">{formatCLP(totalPagar)}</span>
            </div>
            {diferencia !== 0 && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-slate-400">Diferencia:</span>
                <span className={`font-medium ${diferencia > 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                  {formatCLP(diferencia)}
                </span>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-[#334155] text-white rounded-lg hover:bg-[#475569] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || totalPagar <= 0}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <DollarSign size={20} />
              {loading ? 'Procesando...' : 'Confirmar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
