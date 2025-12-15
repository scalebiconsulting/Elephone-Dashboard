"use client";

import { X, Save, Edit } from 'lucide-react';
import { ProductoInventario } from '@/app/types/producto';
import { ProductoEditableFields } from '@/app/hooks/useEditarProducto';
import { ESTADOS_INVENTARIO } from '@/app/constants/opciones';
import { formatCLP } from '@/app/utils/formatters';

interface EditarProductoModalProps {
  isOpen: boolean;
  producto: ProductoInventario | null;
  campos: ProductoEditableFields;
  utilidad: string;
  utilidad2: string;
  loading: boolean;
  onClose: () => void;
  onCampoChange: <K extends keyof ProductoEditableFields>(field: K, value: string) => void;
  onGuardar: () => void;
}

export default function EditarProductoModal({
  isOpen,
  producto,
  campos,
  utilidad,
  utilidad2,
  loading,
  onClose,
  onCampoChange,
  onGuardar,
}: EditarProductoModalProps) {
  if (!isOpen || !producto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#1e293b] border border-[#334155] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 shadow-2xl scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#1e293b] border-b border-[#334155] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Edit className="text-yellow-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Editar Producto</h2>
              <p className="text-sm text-slate-400 font-mono">{producto.sku}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-[#334155] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Información del producto (solo lectura) */}
        <div className="px-6 py-4 bg-[#0f172a]/50 border-b border-[#334155]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Modelo:</span>
              <p className="text-white font-medium">{producto.modelo2 || '-'}</p>
            </div>
            <div>
              <span className="text-slate-400">Costo:</span>
              <p className="text-white font-medium">{formatCLP(producto.costo)}</p>
            </div>
            <div>
              <span className="text-slate-400">Condición:</span>
              <p className="text-white font-medium">{producto.condicion || '-'}</p>
            </div>
            <div>
              <span className="text-slate-400">Fecha Compra:</span>
              <p className="text-white font-medium">{producto.fechaCompra || '-'}</p>
            </div>
          </div>
        </div>

        {/* Formulario de edición */}
        <div className="px-6 py-6 space-y-6">
          {/* Fila 1: Estado y Batería */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Estado
              </label>
              <select
                value={campos.estado}
                onChange={(e) => onCampoChange('estado', e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                {ESTADOS_INVENTARIO.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Batería %
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={campos.condicionBateria}
                onChange={(e) => onCampoChange('condicionBateria', e.target.value)}
                placeholder="Ej: 95"
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Fila 2: PVP Efectivo y PVP Crédito */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                PVP Efectivo
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="text"
                  value={campos.pvpEfectivo}
                  onChange={(e) => onCampoChange('pvpEfectivo', e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                PVP Crédito
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="text"
                  value={campos.pvpCredito}
                  onChange={(e) => onCampoChange('pvpCredito', e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>
            </div>
          </div>

          {/* Fila 3: Repuesto y Utilidades (calculadas) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Repuesto
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="text"
                  value={campos.repuesto}
                  onChange={(e) => onCampoChange('repuesto', e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Utilidad (Efectivo)
              </label>
              <div className="px-4 py-3 bg-[#0f172a]/50 border border-[#334155] rounded-lg">
                <span className={`font-medium ${
                  utilidad.startsWith('-') ? 'text-red-400' : 'text-green-400'
                }`}>
                  ${utilidad || '0'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Utilidad (Crédito)
              </label>
              <div className="px-4 py-3 bg-[#0f172a]/50 border border-[#334155] rounded-lg">
                <span className={`font-medium ${
                  utilidad2.startsWith('-') ? 'text-red-400' : 'text-green-400'
                }`}>
                  ${utilidad2 || '0'}
                </span>
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-[#334155]" />

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Observación
            </label>
            <textarea
              value={campos.observacion}
              onChange={(e) => onCampoChange('observacion', e.target.value)}
              rows={2}
              placeholder="Observaciones generales del equipo..."
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Falla MAC Online
            </label>
            <textarea
              value={campos.fallaMacOnline}
              onChange={(e) => onCampoChange('fallaMacOnline', e.target.value)}
              rows={2}
              placeholder="Descripción de fallas detectadas..."
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Garantía Compra
            </label>
            <textarea
              value={campos.garantiaCompra}
              onChange={(e) => onCampoChange('garantiaCompra', e.target.value)}
              rows={2}
              placeholder="Detalles de garantía..."
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9] resize-none"
            />
          </div>
        </div>

        {/* Footer con botones */}
        <div className="sticky bottom-0 z-10 bg-[#1e293b] border-t border-[#334155] px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 bg-[#334155] hover:bg-[#475569] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onGuardar}
            disabled={loading}
            className="px-6 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
