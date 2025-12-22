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
import SelectorEmpresa from '@/app/components/forms/shared/SelectorEmpresa';
import PagoProveedorSection from '@/app/components/forms/ingresos/PagoProveedorSection';

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

        {/* Sección 2.1 - Selector de Tipo de Proveedor - Solo si no hay proveedor seleccionado */}
        {!form.persona?._id && !form.empresa?._id && (
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Tipo de Proveedor</h2>
            <select
              value={form.tipoProveedor}
              onChange={(e) => form.setTipoProveedor(e.target.value as 'PERSONA' | 'EMPRESA')}
              className="w-64 px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9] text-lg"
            >
              <option value="PERSONA">👤 Persona Natural</option>
              <option value="EMPRESA">🏢 Empresa</option>
            </select>
          </div>
        )}

        {/* Sección 2.2 - Datos del Proveedor (Persona o Empresa) */}
        {form.tipoProveedor === 'PERSONA' ? (
          <SelectorPersona
            persona={form.persona}
            onPersonaChange={form.setPersona}
            roles={['PROVEEDOR']}
            titulo="Datos del Proveedor (Persona)"
          />
        ) : (
          <SelectorEmpresa
            empresa={form.empresa}
            onEmpresaChange={form.setEmpresa}
            titulo="Datos del Proveedor (Empresa)"
          />
        )}

        {/* Sección 2.3 - Pago a Proveedor */}
        <PagoProveedorSection
          costo={form.costo}
          pagoProveedor={form.pagoProveedor}
          onChange={form.setPagoProveedor}
          tipoProveedor={form.tipoProveedor}
        />

        {/* Sección 3 - Observaciones */}
        <Observaciones
          observacion={form.observacion}
          setObservacion={form.setObservacion}
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
          
          pvpEfectivo={form.pvpEfectivo}
          pvpCredito={form.pvpCredito}
          utilidad={form.utilidad}
          utilidad2={form.utilidad2}
          setPvpEfectivo={form.setPvpEfectivo}
          setPvpCredito={form.setPvpCredito}
         
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
