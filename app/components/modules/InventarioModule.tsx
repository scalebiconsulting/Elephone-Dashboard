"use client";

import { Package, Search, RefreshCw } from 'lucide-react';
import { useInventario } from '@/app/hooks/useInventario';
import { useEditarProducto } from '@/app/hooks/useEditarProducto';
import { formatCLP } from '@/app/utils/formatters';
import TablaInventario from '@/app/components/tables/TablaInventario';
import EditarProductoModal from '@/app/components/modals/EditarProductoModal';
import { ProductoInventario } from '@/app/types/producto';

interface InventarioModuleProps {
  onSelectForSale?: (producto: ProductoInventario) => void;
  onChangeModule?: (module: string) => void;
}

export default function InventarioModule({ onSelectForSale, onChangeModule }: InventarioModuleProps) {
  const {
    productos,
    loading,
    searchTerm,
    filtroEquipo,
    filtroCondicion,
    filtroEstado,
    productosFiltrados,
    totalProductos,
    valorInventario,
    equiposUnicos,
    condicionesUnicas,
    estadosUnicos,
    setSearchTerm,
    setFiltroEquipo,
    setFiltroCondicion,
    setFiltroEstado,
    fetchProductos,
    handleDelete,
  } = useInventario();

  // Hook para editar productos
  const editarProducto = useEditarProducto(fetchProductos);

  // Seleccionar para venta
  const handleSelectForSale = (producto: ProductoInventario) => {
    if (onSelectForSale) {
      onSelectForSale(producto);
    }
    if (onChangeModule) {
      onChangeModule('pos');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="text-[#0ea5e9]" size={32} />
          <h1 className="text-3xl font-bold text-white">Inventario</h1>
        </div>
        <button
          onClick={fetchProductos}
          className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-slate-300 hover:bg-[#334155] transition-colors"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#0ea5e9]/20 rounded-lg flex items-center justify-center">
              <Package className="text-[#0ea5e9]" size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Productos en Stock</p>
              <p className="text-3xl font-bold text-white">{totalProductos}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#10b981]/20 rounded-lg flex items-center justify-center">
              <span className="text-[#10b981] text-xl font-bold">$</span>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Valor Total Inventario</p>
              <p className="text-3xl font-bold text-white">{formatCLP(valorInventario)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar SKU, modelo, IMEI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9]"
            />
          </div>

          {/* Filtro Equipo */}
          <select
            value={filtroEquipo}
            onChange={(e) => setFiltroEquipo(e.target.value)}
            className="px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
          >
            <option value="">Todos los equipos</option>
            {equiposUnicos.map((equipo) => (
              <option key={equipo} value={equipo}>{equipo}</option>
            ))}
          </select>

          {/* Filtro Condición */}
          <select
            value={filtroCondicion}
            onChange={(e) => setFiltroCondicion(e.target.value)}
            className="px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
          >
            <option value="">Todas las condiciones</option>
            {condicionesUnicas.map((condicion) => (
              <option key={condicion} value={condicion}>{condicion}</option>
            ))}
          </select>

          {/* Filtro Estado */}
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
          >
            <option value="">Todos los estados</option>
            {estadosUnicos.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <TablaInventario
        productos={productosFiltrados}
        totalProductos={productos.length}
        loading={loading}
        onDelete={handleDelete}
        onEdit={editarProducto.openModal}
        onSelectForSale={(onSelectForSale || onChangeModule) ? handleSelectForSale : undefined}
      />

      {/* Modal de Edición */}
      <EditarProductoModal
        isOpen={editarProducto.isOpen}
        producto={editarProducto.producto}
        campos={editarProducto.campos}
        utilidad={editarProducto.utilidad}
        utilidad2={editarProducto.utilidad2}
        loading={editarProducto.loading}
        onClose={editarProducto.closeModal}
        onCampoChange={editarProducto.setCampo}
        onGuardar={editarProducto.guardarCambios}
      />
    </div>
  );
}
