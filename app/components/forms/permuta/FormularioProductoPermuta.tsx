"use client";

import { Package } from 'lucide-react';
import { CONDICIONES_PRODUCTO, OPCIONES_BLOCK, OPCIONES_DATOS_EQUIPOS, ESTADOS_INVENTARIO } from '@/app/constants/opciones';
import { formatoPesosChilenos } from '@/app/utils/formatters';
import BasaleExport from '@/app/components/forms/ingresos/BasaleExport';

interface FormularioProductoPermutaProps {
  productoPermuta: {
    equipo: string;
    modelo: string;
    color: string;
    subModelo: string;
    serie: string;
    gb: string;
    condicion: string;
    modelo2: string;
    sku: string;
    condicionBateria: string;
    costo: string;
    proveedor: string;
    fechaCompra: string;
    observacion: string;
    fallaMacOnline: string;
    garantiaCompra: string;
    block: string;
    datosEquipos: string;
    numeroSerie: string;
    imei1: string;
    imei2: string;
    concatenacion: string;
    estado: string;
    repuesto: string;
    pvpEfectivo: string;
    pvpCredito: string;
    valorPermuta: string;
  };
  updateProductoPermuta: (campo: string, valor: string) => void;
}

export default function FormularioProductoPermuta({
  productoPermuta,
  updateProductoPermuta,
}: FormularioProductoPermutaProps) {
  const handleMoneyChange = (campo: string, value: string) => {
    updateProductoPermuta(campo, formatoPesosChilenos(value));
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Package size={24} className="text-[#0ea5e9]" />
        📦 Producto en Permuta (Entra)
      </h2>
      <p className="text-slate-400 text-sm mb-6">Complete los datos del producto que el cliente deja en parte de pago</p>

      {/* Sección 1 - Identificación del Producto */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#334155] pb-2">1. Identificación del Producto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                EQUIPO <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={productoPermuta.equipo}
                onChange={(e) => updateProductoPermuta('equipo', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="iPhone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                MODELO <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={productoPermuta.modelo}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
                  updateProductoPermuta('modelo', value);
                }}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="Pro Max"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                COLOR <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={productoPermuta.color}
                onChange={(e) => updateProductoPermuta('color', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="Titanio Natural"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">SUB MODELO</label>
              <input
                type="text"
                value={productoPermuta.subModelo}
                onChange={(e) => updateProductoPermuta('subModelo', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="pro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                SERIE <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={productoPermuta.serie}
                onChange={(e) => updateProductoPermuta('serie', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                GB <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={productoPermuta.gb}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    updateProductoPermuta('gb', value);
                  }}
                  className="w-full px-4 py-3 pr-12 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                  placeholder="256"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none">
                  GB
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                CONDICIÓN <span className="text-red-500">*</span>
              </label>
              <select
                value={productoPermuta.condicion}
                onChange={(e) => updateProductoPermuta('condicion', e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                {CONDICIONES_PRODUCTO.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">MODELO2 (Auto)</label>
              <input
                type="text"
                value={productoPermuta.modelo2}
                readOnly
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#0ea5e9] rounded-lg text-white font-semibold"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-2">SKU (Auto)</label>
              <input
                type="text"
                value={productoPermuta.sku}
                readOnly
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#0ea5e9] rounded-lg text-white font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Sección 2 - Detalles de Compra */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#334155] pb-2">2. Detalles de Compra</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">BATERÍA (%)</label>
              <input
                type="number"
                value={productoPermuta.condicionBateria}
                onChange={(e) => updateProductoPermuta('condicionBateria', e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="85"
                max={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">COSTO</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="text"
                  value={productoPermuta.costo}
                  onChange={(e) => handleMoneyChange('costo', e.target.value)}
                  className="w-full pl-7 pr-3 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">PROVEEDOR</label>
              <input
                type="text"
                value={productoPermuta.proveedor}
                onChange={(e) => updateProductoPermuta('proveedor', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="Nombre del cliente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">FECHA COMPRA</label>
              <input
                type="date"
                value={productoPermuta.fechaCompra}
                onChange={(e) => updateProductoPermuta('fechaCompra', e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              />
            </div>
          </div>
        </div>

        {/* Sección 3 - Observaciones */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#334155] pb-2">3. Observaciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">OBSERVACIÓN</label>
              <textarea
                value={productoPermuta.observacion}
                onChange={(e) => updateProductoPermuta('observacion', e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                rows={2}
                placeholder="Detalles adicionales..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">FALLA MAC ONLINE</label>
              <input
                type="text"
                value={productoPermuta.fallaMacOnline}
                onChange={(e) => updateProductoPermuta('fallaMacOnline', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="Descripción de falla"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">GARANTÍA COMPRA</label>
              <input
                type="text"
                value={productoPermuta.garantiaCompra}
                onChange={(e) => updateProductoPermuta('garantiaCompra', e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="30 días"
              />
            </div>
          </div>
        </div>

        {/* Sección 4 - Estado del Equipo */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#334155] pb-2">4. Estado del Equipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">BLOCK</label>
              <select
                value={productoPermuta.block}
                onChange={(e) => updateProductoPermuta('block', e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                {OPCIONES_BLOCK.map((op) => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">DATOS EQUIPO</label>
              <select
                value={productoPermuta.datosEquipos}
                onChange={(e) => updateProductoPermuta('datosEquipos', e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                {OPCIONES_DATOS_EQUIPOS.map((op) => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">NÚMERO DE SERIE</label>
              <input
                type="text"
                value={productoPermuta.numeroSerie}
                onChange={(e) => updateProductoPermuta('numeroSerie', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="Serial del equipo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">IMEI 1</label>
              <input
                type="text"
                value={productoPermuta.imei1}
                onChange={(e) => updateProductoPermuta('imei1', e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="15 dígitos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">IMEI 2</label>
              <input
                type="text"
                value={productoPermuta.imei2}
                onChange={(e) => updateProductoPermuta('imei2', e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="15 dígitos"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-2">CONCATENACIÓN (Auto)</label>
              <input
                type="text"
                value={productoPermuta.concatenacion}
                readOnly
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#0ea5e9] rounded-lg text-white font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Sección 5 - Inventario */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#334155] pb-2">5. Inventario</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">ESTADO</label>
              <select
                value={productoPermuta.estado}
                onChange={(e) => updateProductoPermuta('estado', e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                {ESTADOS_INVENTARIO.map((op) => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sección 6 - Precios y Utilidad */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#334155] pb-2">6. Precios y Utilidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">REPUESTO</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="text"
                  value={productoPermuta.repuesto}
                  onChange={(e) => handleMoneyChange('repuesto', e.target.value)}
                  className="w-full pl-7 pr-3 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">PVP EFECTIVO</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="text"
                  value={productoPermuta.pvpEfectivo}
                  onChange={(e) => handleMoneyChange('pvpEfectivo', e.target.value)}
                  className="w-full pl-7 pr-3 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">PVP CRÉDITO</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="text"
                  value={productoPermuta.pvpCredito}
                  onChange={(e) => handleMoneyChange('pvpCredito', e.target.value)}
                  className="w-full pl-7 pr-3 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Valor Permuta - Destacado */}
        <div className="bg-[#0f172a] border-2 rounded-lg p-6 max-w-lg">
          <label className="block text-lg font-bold text-[#0ea5e9] mb-2">💎 Valor de Permuta *</label>
          <p className="text-sm text-slate-400 mb-3">Monto que se le reconoce al cliente por este equipo</p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0ea5e9] text-lg">$</span>
            <input
              type="text"
              value={productoPermuta.valorPermuta}
              onChange={(e) => handleMoneyChange('valorPermuta', e.target.value)}
              className="w-full pl-10 pr-4 py-4 bg-[#1e293b] border-2 border-[#0ea5e9] rounded-lg text-white text-2xl font-bold focus:outline-none focus:border-[#38bdf8]"
              placeholder="0"
            />
          </div>
        </div>

        {/* Sección 7 - Exportar a Basale */}
        <BasaleExport
          sku={productoPermuta.sku}
          costo={productoPermuta.costo}
          concatenacion={productoPermuta.concatenacion}
        />
      </div>
    </div>
  );
}
