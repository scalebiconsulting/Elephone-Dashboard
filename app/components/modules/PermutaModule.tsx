"use client";

import { usePermuta } from '@/app/hooks/usePermuta';
import { extraerNumero } from '@/app/utils/formatters';
import FormularioProductoPermuta from '@/app/components/forms/permuta/FormularioProductoPermuta';
import BuscadorProductoVenta from '@/app/components/forms/permuta/BuscadorProductoVenta';
import DatosCliente from '@/app/components/forms/pos/DatosCliente';
import ResumenPermuta from '@/app/components/forms/permuta/ResumenPermuta';
import HistorialPermutas from '@/app/components/forms/permuta/HistorialPermutas';
import { ArrowLeftRight } from 'lucide-react';

export default function PermutaModule() {
  const {
    // Producto permuta
    productoPermuta,
    updateProductoPermuta,
    // Búsqueda
    skuBusqueda,
    setSkuBusqueda,
    productoVenta,
    setProductoVenta,
    buscando,
    errorBusqueda,
    buscarProductoPorSku,
    // Cliente
    nombreCliente,
    setNombreCliente,
    correoCliente,
    setCorreoCliente,
    telefonoCliente,
    setTelefonoCliente,
    // Pago
    montoEfectivo,
    setMontoEfectivo,
    montoTransferencia,
    setMontoTransferencia,
    montoDebito,
    setMontoDebito,
    estadoPermuta,
    setEstadoPermuta,
    // Cálculos
    calcularDiferencia,
    getTipoTransaccion,
    calcularTotalPagado,
    calcularSaldoPendiente,
    calcularUtilidad,
    // Acciones
    registrarPermuta,
    resetFormulario,
    // Estado
    permutas,
    loading,
  } = usePermuta();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ArrowLeftRight className="text-[#0ea5e9]" size={32} />
        <h1 className="text-3xl font-bold text-white">Permutas</h1>
      </div>

      {/* Fila 1: Producto en Permuta (Entra) - Ancho completo */}
      <FormularioProductoPermuta
        productoPermuta={productoPermuta}
        updateProductoPermuta={updateProductoPermuta}
      />

      {/* Fila 2: Producto a Vender - Ancho completo */}
      <BuscadorProductoVenta
        skuBusqueda={skuBusqueda}
        setSkuBusqueda={setSkuBusqueda}
        productoVenta={productoVenta}
        setProductoVenta={setProductoVenta}
        buscando={buscando}
        errorBusqueda={errorBusqueda}
        buscarProductoPorSku={buscarProductoPorSku}
      />

      {/* Fila 3: Datos Cliente | Resumen Permuta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DatosCliente
          nombreCliente={nombreCliente}
          setNombreCliente={setNombreCliente}
          correoCliente={correoCliente}
          setCorreoCliente={setCorreoCliente}
          telefonoCliente={telefonoCliente}
          setTelefonoCliente={setTelefonoCliente}
        />
        <div className="space-y-6">
          <ResumenPermuta
            precioVenta={productoVenta?.pvpEfectivo || 0}
            valorPermuta={extraerNumero(productoPermuta.valorPermuta)}
            diferencia={calcularDiferencia()}
            tipoTransaccion={getTipoTransaccion()}
            montoEfectivo={montoEfectivo}
            setMontoEfectivo={setMontoEfectivo}
            montoTransferencia={montoTransferencia}
            setMontoTransferencia={setMontoTransferencia}
            montoDebito={montoDebito}
            setMontoDebito={setMontoDebito}
            totalPagado={calcularTotalPagado()}
            saldoPendiente={calcularSaldoPendiente()}
            estadoPermuta={estadoPermuta}
            setEstadoPermuta={setEstadoPermuta}
            utilidad={calcularUtilidad()}
          />

          {/* Botones */}
          <div className="flex gap-4">
            <button
              onClick={resetFormulario}
              className="flex-1 px-6 py-3 bg-[#334155] hover:bg-[#475569] text-white font-medium rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={registrarPermuta}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registrando...' : 'Registrar Permuta'}
            </button>
          </div>
        </div>
      </div>

      {/* Fila 4: Historial de Permutas - Ancho completo */}
      <HistorialPermutas permutas={permutas} />
    </div>
  );
}
