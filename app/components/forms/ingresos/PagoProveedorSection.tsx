"use client";

import { useState, useEffect, useCallback } from 'react';
import DateInput from '@/app/components/forms/shared/DateInput';
import type { PagoProveedor } from '@/app/types/producto';

interface CuotaFormulario {
  numero: number;
  monto: string;
  fechaVencimiento: string;
}

interface PagoProveedorSectionProps {
  costo: string;
  pagoProveedor: PagoProveedor;
  onChange: (pagoProveedor: PagoProveedor) => void;
  tipoProveedor?: 'PERSONA' | 'EMPRESA';
}

export default function PagoProveedorSection({
  costo,
  pagoProveedor,
  onChange,
  tipoProveedor = 'PERSONA'
}: PagoProveedorSectionProps) {
  // Limpiar el costo de cualquier formato y convertir a número
  const costoLimpio = costo.replace(/[^0-9]/g, '');
  const costoNumerico = parseInt(costoLimpio) || 0;
  
  // Estado local para el formulario
  const [esProrrateado, setEsProrrateado] = useState(pagoProveedor.esProrrateado);
  const [montoEfectivo, setMontoEfectivo] = useState(pagoProveedor.montoEfectivo.toString());
  const [montoTransferencia, setMontoTransferencia] = useState(pagoProveedor.montoTransferencia.toString());
  const [referenciaTransferencia, setReferenciaTransferencia] = useState(pagoProveedor.referenciaTransferencia || '');
  const [fechaPago, setFechaPago] = useState(pagoProveedor.fechaPago || '');
  
  // Para cuotas prorrateadas
  const [numeroCuotas, setNumeroCuotas] = useState(pagoProveedor.cuotas.length || 2);
  const [cuotasForm, setCuotasForm] = useState<CuotaFormulario[]>(() => {
    // Inicializar cuotas si ya viene prorrateado
    if (pagoProveedor.esProrrateado && pagoProveedor.cuotas.length > 0) {
      return pagoProveedor.cuotas.map(c => ({
        numero: c.numero,
        monto: c.monto.toString(),
        fechaVencimiento: c.fechaVencimiento
      }));
    }
    return [];
  });

  // Generar cuotas iniciales con montos distribuidos
  const generarCuotasIniciales = useCallback((cantidad: number): CuotaFormulario[] => {
    const montoPorCuota = Math.round(costoNumerico / cantidad);
    const nuevasCuotas: CuotaFormulario[] = [];
    const hoy = new Date();
    
    for (let i = 0; i < cantidad; i++) {
      const fechaVenc = new Date(hoy);
      fechaVenc.setDate(hoy.getDate() + (30 * (i + 1))); // Por defecto cada 30 días
      
      nuevasCuotas.push({
        numero: i + 1,
        monto: montoPorCuota.toString(),
        fechaVencimiento: fechaVenc.toISOString().split('T')[0]
      });
    }
    
    return nuevasCuotas;
  }, [costoNumerico]);

  // Handler para toggle de prorrateado
  const handleProrrateadoToggle = useCallback((checked: boolean) => {
    setEsProrrateado(checked);
    if (checked && cuotasForm.length === 0) {
      setCuotasForm(generarCuotasIniciales(numeroCuotas));
    }
  }, [cuotasForm.length, generarCuotasIniciales, numeroCuotas]);

  // Actualizar número de cuotas
  const handleNumeroCuotasChange = (valor: string) => {
    const cantidad = parseInt(valor) || 2;
    setNumeroCuotas(cantidad);
    setCuotasForm(generarCuotasIniciales(cantidad));
  };

  // Actualizar monto de una cuota
  const handleMontoCuotaChange = (index: number, monto: string) => {
    const nuevasCuotas = [...cuotasForm];
    nuevasCuotas[index].monto = monto;
    setCuotasForm(nuevasCuotas);
  };

  // Actualizar fecha de vencimiento de una cuota
  const handleFechaCuotaChange = (index: number, fecha: string) => {
    const nuevasCuotas = [...cuotasForm];
    nuevasCuotas[index].fechaVencimiento = fecha;
    setCuotasForm(nuevasCuotas);
  };

  // Calcular totales
  const calcularTotales = useCallback(() => {
    if (esProrrateado) {
      return {
        totalPagado: 0,
        saldoPendiente: Math.round(costoNumerico)
      };
    } else {
      const efectivo = Math.round(parseFloat(montoEfectivo) || 0);
      const transferencia = Math.round(parseFloat(montoTransferencia) || 0);
      const totalPagado = efectivo + transferencia;
      return {
        totalPagado,
        saldoPendiente: Math.round(costoNumerico - totalPagado)
      };
    }
  }, [esProrrateado, montoEfectivo, montoTransferencia, costoNumerico]);

  // Determinar estado del pago
  const determinarEstado = useCallback((): 'PAGADO' | 'PENDIENTE' | 'PARCIAL' => {
    const { totalPagado, saldoPendiente } = calcularTotales();
    
    if (esProrrateado) {
      return 'PENDIENTE'; // Siempre inicia pendiente
    }
    
    if (saldoPendiente <= 0) return 'PAGADO';
    if (totalPagado > 0) return 'PARCIAL';
    return 'PENDIENTE';
  }, [calcularTotales, esProrrateado]);

  // Propagar cambios al padre
  useEffect(() => {
    const { totalPagado, saldoPendiente } = calcularTotales();
    
    const nuevoPago: PagoProveedor = {
      estado: determinarEstado(),
      esProrrateado,
      montoEfectivo: esProrrateado ? 0 : Math.round(parseFloat(montoEfectivo) || 0),
      montoTransferencia: esProrrateado ? 0 : Math.round(parseFloat(montoTransferencia) || 0),
      referenciaTransferencia: esProrrateado ? undefined : (referenciaTransferencia || undefined),
      fechaPago: esProrrateado ? undefined : (fechaPago || undefined),
      cuotas: esProrrateado ? cuotasForm.map(c => ({
        numero: c.numero,
        monto: Math.round(parseFloat(c.monto) || 0),
        fechaVencimiento: c.fechaVencimiento,
        montoEfectivo: 0,
        montoTransferencia: 0,
        estado: 'PENDIENTE' as const
      })) : [],
      totalPagado,
      saldoPendiente
    };
    
    onChange(nuevoPago);
  }, [esProrrateado, montoEfectivo, montoTransferencia, referenciaTransferencia, fechaPago, cuotasForm, costoNumerico, calcularTotales, determinarEstado, onChange]);

  // Calcular diferencia si el monto pagado no coincide con el costo
  const { totalPagado, saldoPendiente } = calcularTotales();
  const estadoPago = determinarEstado();

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">💳 Pago a Proveedor</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          estadoPago === 'PAGADO' ? 'bg-green-500/20 text-green-400' :
          estadoPago === 'PARCIAL' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {estadoPago}
        </div>
      </div>

      {/* Toggle Prorrateado - Solo para Empresas */}
      {tipoProveedor === 'EMPRESA' && (
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <label className={`relative w-14 h-7 rounded-full transition-colors cursor-pointer ${
              esProrrateado ? 'bg-blue-600' : 'bg-slate-600'
            }`}>
              <input
                type="checkbox"
                checked={esProrrateado}
                onChange={(e) => handleProrrateadoToggle(e.target.checked)}
                className="sr-only"
              />
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                esProrrateado ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </label>
            <span className="text-white font-medium">
              Pago Prorrateado (Cuotas)
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1 ml-17">
            {esProrrateado 
              ? 'El pago se dividirá en cuotas con fechas de vencimiento' 
              : 'Pago inmediato (puede ser mixto: efectivo + transferencia)'}
          </p>
        </div>
      )}

      {!esProrrateado ? (
        /* Pago Inmediato */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Monto Efectivo */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                💵 Monto Efectivo
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  value={montoEfectivo ? parseInt(montoEfectivo).toLocaleString('es-CL') : ''}
                  onChange={(e) => {
                    const valor = e.target.value.replace(/\D/g, '');
                    setMontoEfectivo(valor);
                  }}
                  className="w-full px-4 py-3 pl-8 bg-[#0f172a] border border-[#334155] text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Monto Transferencia */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                🏦 Monto Transferencia
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  value={montoTransferencia ? parseInt(montoTransferencia).toLocaleString('es-CL') : ''}
                  onChange={(e) => {
                    const valor = e.target.value.replace(/\D/g, '');
                    setMontoTransferencia(valor);
                  }}
                  className="w-full px-4 py-3 pl-8 bg-[#0f172a] border border-[#334155] text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Referencia Transferencia */}
            {parseFloat(montoTransferencia) > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  📝 Ref. Transferencia
                </label>
                <input
                  type="text"
                  value={referenciaTransferencia}
                  onChange={(e) => setReferenciaTransferencia(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Número de comprobante"
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
          </div>

          {/* Resumen de Pago Inmediato */}
          <div className="mt-4 p-4 bg-[#0f172a] rounded-lg border border-[#334155]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-slate-400 text-sm">Costo Total</p>
                <p className="text-white font-bold text-lg">${costoNumerico.toLocaleString('es-CL')}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Pagado</p>
                <p className="text-green-400 font-bold text-lg">${Math.round(totalPagado).toLocaleString('es-CL')}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Saldo Pendiente</p>
                <p className={`font-bold text-lg ${saldoPendiente > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  ${Math.round(saldoPendiente).toLocaleString('es-CL')}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Estado</p>
                <p className={`font-bold text-lg ${
                  estadoPago === 'PAGADO' ? 'text-green-400' :
                  estadoPago === 'PARCIAL' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {estadoPago}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Pago Prorrateado */
        <div className="space-y-4">
          {/* Número de Cuotas */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-400">
              Número de Cuotas:
            </label>
            <input
              type="number"
              min="2"
              max="24"
              value={numeroCuotas}
              onChange={(e) => handleNumeroCuotasChange(e.target.value)}
              className="w-24 px-3 py-2 bg-[#0f172a] border border-[#334155] text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => generarCuotasIniciales(numeroCuotas)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Redistribuir
            </button>
          </div>

          {/* Lista de Cuotas */}
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-slate-400 px-2">
              <div className="col-span-2">Cuota</div>
              <div className="col-span-4">Monto</div>
              <div className="col-span-4">Fecha Vencimiento</div>
              <div className="col-span-2">Estado</div>
            </div>
            
            {cuotasForm.map((cuota, index) => (
              <div key={cuota.numero} className="grid grid-cols-12 gap-2 items-center bg-[#0f172a] p-3 rounded-lg border border-[#334155]">
                <div className="col-span-2">
                  <span className="text-white font-medium">#{cuota.numero}</span>
                </div>
                <div className="col-span-4">
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={cuota.monto}
                    onChange={(e) => handleMontoCuotaChange(index, e.target.value)}
                    className="w-full px-3 py-2 bg-[#1e293b] border border-[#475569] text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-4">
                  <DateInput
                    label=""
                    value={cuota.fechaVencimiento}
                    onChange={(fecha) => handleFechaCuotaChange(index, fecha)}
                    placeholder="Fecha vencimiento"
                  />
                </div>
                <div className="col-span-2">
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                    PENDIENTE
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen Prorrateado */}
          <div className="mt-4 p-4 bg-[#0f172a] rounded-lg border border-[#334155]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-slate-400 text-sm">Costo Total</p>
                <p className="text-white font-bold text-lg">${costoNumerico.toLocaleString('es-CL')}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Cuotas</p>
                <p className={`font-bold text-lg ${
                  cuotasForm.reduce((sum, c) => sum + (Math.round(parseFloat(c.monto) || 0)), 0) === Math.round(costoNumerico) ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  ${cuotasForm.reduce((sum, c) => sum + (Math.round(parseFloat(c.monto) || 0)), 0).toLocaleString('es-CL')}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Diferencia</p>
                <p className={`font-bold text-lg ${
                  cuotasForm.reduce((sum, c) => sum + (Math.round(parseFloat(c.monto) || 0)), 0) === Math.round(costoNumerico) ? 'text-green-400' : 'text-red-400'
                }`}>
                  ${(cuotasForm.reduce((sum, c) => sum + (Math.round(parseFloat(c.monto) || 0)), 0) - Math.round(costoNumerico)).toLocaleString('es-CL')}
                </p>
              </div>
            </div>
            {cuotasForm.reduce((sum, c) => sum + (Math.round(parseFloat(c.monto) || 0)), 0) !== Math.round(costoNumerico) && (
              <p className="text-yellow-400 text-sm text-center mt-2">
                ⚠️ La suma de las cuotas no coincide con el costo total
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
