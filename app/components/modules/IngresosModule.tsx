"use client";

import { Save } from 'lucide-react';
import { useProductoForm } from '@/app/hooks/useProductoForm';
import {
  IdentificacionProducto,
  DetallesCompra,
  Observaciones,
  EstadoEquipo,
  Inventario,
  PreciosUtilidad,
  BasaleExport
} from '@/app/components/forms/ingresos';
import SelectorPersona from '@/app/components/forms/shared/SelectorPersona';

export default function IngresosModule() {
  const form = useProductoForm();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Registro de Compras / Ingresos</h1>
        <p className="text-slate-400">Registra productos que compras a proveedores</p>
      </div>

      <form 
        onSubmit={form.handleSubmit} 
        onKeyDown={(e) => { 
          if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
            e.preventDefault();
          }
        }} 
        className="space-y-8"
      >
        {/* Sección 1 - Identificación del Producto */}
        <IdentificacionProducto
          equipo={form.equipo}
          modelo={form.modelo}
          color={form.color}
          subModelo={form.subModelo}
          serie={form.serie}
          gb={form.gb}
          condicion={form.condicion}
          modelo2={form.modelo2}
          setEquipo={form.setEquipo}
          setModelo={form.setModelo}
          setColor={form.setColor}
          setSubModelo={form.setSubModelo}
          setSerie={form.setSerie}
          setGb={form.setGb}
          setCondicion={form.setCondicion}
        />

        {/* Sección 2 - Detalles de Compra */}
        <DetallesCompra
          sku={form.sku}
          buscandoSku={form.buscandoSku}
          skuNoEncontrado={form.skuNoEncontrado}
          condicionBateria={form.condicionBateria}
          costo={form.costo}
          fechaCompra={form.fechaCompra}
          setCondicionBateria={form.setCondicionBateria}
          setCosto={form.setCosto}
          setFechaCompra={form.setFechaCompra}
        />

        {/* Sección 2.1 - Datos del Proveedor */}
        <SelectorPersona
          persona={form.persona}
          onPersonaChange={form.setPersona}
          roles={['PROVEEDOR']}
          titulo="Datos del Proveedor"
        />

        {/* Sección 3 - Observaciones */}
        <Observaciones
          observacion={form.observacion}
          fallaMacOnline={form.fallaMacOnline}
          garantiaCompra={form.garantiaCompra}
          setObservacion={form.setObservacion}
          setFallaMacOnline={form.setFallaMacOnline}
          setGarantiaCompra={form.setGarantiaCompra}
        />

        {/* Sección 4 - Estado del Equipo */}
        <EstadoEquipo
          block={form.block}
          datosEquipos={form.datosEquipos}
          numeroSerie={form.numeroSerie}
          imei1={form.imei1}
          imei2={form.imei2}
          concatenacion={form.concatenacion}
          setBlock={form.setBlock}
          
          setNumeroSerie={form.setNumeroSerie}
          setImei1={form.setImei1}
          setImei2={form.setImei2}
        />

        {/* Sección 5 - Inventario */}
        <Inventario
          estado={form.estado}
          fecha={form.fecha}
          setEstado={form.setEstado}
          setFecha={form.setFecha}
        />

        {/* Sección 6 - Precios */}
        <PreciosUtilidad
          repuesto={form.repuesto}
          pvpEfectivo={form.pvpEfectivo}
          pvpCredito={form.pvpCredito}
          utilidad={form.utilidad}
          utilidad2={form.utilidad2}
          tresPorCiento={form.tresPorCiento}
          setRepuesto={form.setRepuesto}
          setPvpEfectivo={form.setPvpEfectivo}
          setPvpCredito={form.setPvpCredito}
          setTresPorCiento={form.setTresPorCiento}
        />

        {/* Sección 7 - Exportar a Basale */}
        <BasaleExport
          sku={form.sku}
          costo={form.costo}
          concatenacion={form.concatenacion}
        />

        {/* Botón Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={form.loading}
            className="px-8 py-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-lg transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {form.loading ? 'Guardando...' : 'Registrar Compra'}
          </button>
        </div>
      </form>
    </div>
  );
}
