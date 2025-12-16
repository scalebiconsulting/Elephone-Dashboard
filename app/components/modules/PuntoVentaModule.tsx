"use client";

import { ProductoInventario } from '@/app/types/producto';
import { usePuntoVenta } from '@/app/hooks/usePuntoVenta';
import InfoProducto from '@/app/components/forms/pos/InfoProducto';
import DatosCliente from '@/app/components/forms/pos/DatosCliente';
import ResumenVenta from '@/app/components/forms/pos/ResumenVenta';
import HistorialVentas from '@/app/components/forms/pos/HistorialVentas';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

interface PuntoVentaModuleProps {
  productoInicial: ProductoInventario | null;
  onVolver?: () => void;
}

export default function PuntoVentaModule({ productoInicial, onVolver }: PuntoVentaModuleProps) {
  const {
    producto,
    nombreCliente,
    setNombreCliente,
    correoCliente,
    setCorreoCliente,
    telefonoCliente,
    setTelefonoCliente,
    modalidadPago,
    setModalidadPago,
    montoEfectivo,
    setMontoEfectivo,
    montoTransferencia,
    setMontoTransferencia,
    montoDebito,
    setMontoDebito,
    estadoVenta,
    setEstadoVenta,
    ventas,
    loading,
    calcularPrecioFinal,
    calcularTotalPagado,
    calcularSaldoPendiente,
    calcularUtilidad,
    registrarVenta,
    setProducto,
  } = usePuntoVenta(productoInicial);

  const handleRegistrarVenta = async () => {
    const success = await registrarVenta();
    if (success && onVolver) {
      onVolver();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="text-[#0ea5e9]" size={32} />
          <h1 className="text-3xl font-bold text-white">Punto de Venta</h1>
        </div>
        {onVolver && (
          <button
            onClick={onVolver}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-slate-300 hover:bg-[#334155] transition-colors"
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        )}
      </div>

      {producto ? (
        <div className="space-y-6">
          {/* Fila principal: Info Producto | Datos Cliente + Resumen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna Izquierda - Información del Producto */}
            <InfoProducto producto={producto} />

            {/* Columna Derecha - Datos Cliente + Resumen */}
            <div className="space-y-6">
              {/* Datos del Cliente */}
              <DatosCliente
                nombreCliente={nombreCliente}
                setNombreCliente={setNombreCliente}
                correoCliente={correoCliente}
                setCorreoCliente={setCorreoCliente}
                telefonoCliente={telefonoCliente}
                setTelefonoCliente={setTelefonoCliente}
              />

              {/* Resumen de Venta */}
              <ResumenVenta
                precioVenta={calcularPrecioFinal()}
                utilidad={calcularUtilidad()}
                modalidadPago={modalidadPago}
                setModalidadPago={setModalidadPago}
                montoEfectivo={montoEfectivo}
                setMontoEfectivo={setMontoEfectivo}
                montoTransferencia={montoTransferencia}
                setMontoTransferencia={setMontoTransferencia}
                montoDebito={montoDebito}
                setMontoDebito={setMontoDebito}
                totalPagado={calcularTotalPagado()}
                saldoPendiente={calcularSaldoPendiente()}
                estadoVenta={estadoVenta}
                setEstadoVenta={setEstadoVenta}
              />

              {/* Botones */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setProducto(null);
                    if (onVolver) onVolver();
                  }}
                  className="flex-1 px-6 py-3 bg-[#334155] hover:bg-[#475569] text-white font-medium rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRegistrarVenta}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Registrando...' : 'Registrar Venta'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-12 text-center">
          <ShoppingCart className="mx-auto mb-4 text-slate-600" size={64} />
          <p className="text-slate-400 text-lg mb-2">No hay producto seleccionado</p>
          <p className="text-slate-500 text-sm">Selecciona un producto desde el inventario para iniciar una venta</p>
        </div>
      )}

      {/* Historial de Ventas */}
      <HistorialVentas ventas={ventas} />
    </div>
  );
}
