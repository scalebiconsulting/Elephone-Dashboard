"use client";

import { useState } from 'react';
import { Search, X, Battery, Smartphone, User, History, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { Producto, Filtros } from '@/lib/types';
import { PROVEEDORES } from '@/lib/data';

interface InventarioModuleProps {
  productos: Producto[];
  onVerHistorial: (producto: Producto) => void;
  onVenderProducto: (producto: Producto) => void;
  onShowNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function InventarioModule({ productos, onVerHistorial, onVenderProducto }: InventarioModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtros, setFiltros] = useState<Filtros>({
    estado: 'TODOS',
    condicion: 'TODOS',
    ubicacion: 'TODOS',
    proveedor: 'TODOS'
  });

  const productosDisponibles = productos.filter(p => p.estado === 'DISPONIBLE');
  const stockValorizado = productosDisponibles.reduce((sum, p) => sum + p.costo, 0);
  const potencialVenta = productosDisponibles.reduce((sum, p) => sum + p.precioEfectivo, 0);

  const productosFiltrados = productos.filter(p => {
    if (filtros.estado !== 'TODOS' && p.estado !== filtros.estado) return false;
    if (filtros.condicion !== 'TODOS' && p.condicion !== filtros.condicion) return false;
    if (filtros.ubicacion !== 'TODOS' && p.ubicacion !== filtros.ubicacion) return false;
    if (filtros.proveedor !== 'TODOS' && p.proveedor !== filtros.proveedor) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        p.modelo.toLowerCase().includes(query) ||
        p.imei.includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.color.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const hasActiveFilters = filtros.estado !== 'TODOS' || filtros.condicion !== 'TODOS' || filtros.ubicacion !== 'TODOS' || filtros.proveedor !== 'TODOS';

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-[36px] font-bold text-[#F1F5F9] mb-3">Gestión de Inventario</h1>
          <p className="text-[15px] text-[#64748B]">
            {productos.length} productos totales • {productosDisponibles.length} disponibles • {productos.filter(p => p.estado === 'VENDIDO').length} vendidos
          </p>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-[#64748B] mb-1">Total Productos</p>
          <strong className="text-[22px] font-bold text-[#0EA5E9]">{productos.length}</strong>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-7 flex gap-6 hover:-translate-y-1 hover:border-[#0EA5E9] transition-all min-h-[140px]">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <div>
            <p className="text-[#94A3B8] text-[15px] mb-2">Stock Valorizado</p>
            <h3 className="text-[32px] font-bold text-[#F1F5F9] mb-1">${(stockValorizado / 1000000).toFixed(1)}M</h3>
            <span className="text-[14px] text-[#64748B]">Inversión actual</span>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-7 flex gap-6 hover:-translate-y-1 hover:border-[#0EA5E9] transition-all min-h-[140px]">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-[#94A3B8] text-[15px] mb-2">Potencial de Venta</p>
            <h3 className="text-[32px] font-bold text-[#F1F5F9] mb-1">${(potencialVenta / 1000000).toFixed(1)}M</h3>
            <span className="text-[14px] text-[#64748B]">Si vendes todo</span>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-7 flex gap-6 hover:-translate-y-1 hover:border-[#0EA5E9] transition-all min-h-[140px]">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <div>
            <p className="text-[#94A3B8] text-[15px] mb-2">Utilidad Potencial</p>
            <h3 className="text-[32px] font-bold text-[#F1F5F9] mb-1">${((potencialVenta - stockValorizado) / 1000000).toFixed(1)}M</h3>
            <span className="text-[14px] text-[#64748B]">{(((potencialVenta - stockValorizado) / potencialVenta) * 100).toFixed(1)}% margen</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 flex items-center gap-4 px-5 py-4 bg-[#0F172A] border border-[#334155] rounded-lg">
            <Search size={22} className="text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por modelo, IMEI, SKU, color..."
              className="flex-1 bg-transparent border-none text-[#E2E8F0] text-[16px] outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[#64748B] hover:text-[#E2E8F0]">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <select
            value={filtros.estado}
            onChange={(e) => setFiltros({...filtros, estado: e.target.value as Filtros['estado']})}
            className="px-5 py-3.5 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[15px] focus:outline-none focus:border-[#0EA5E9]"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="DISPONIBLE">Disponible</option>
            <option value="VENDIDO">Vendido</option>
          </select>

          <select
            value={filtros.condicion}
            onChange={(e) => setFiltros({...filtros, condicion: e.target.value as Filtros['condicion']})}
            className="px-5 py-3.5 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[15px] focus:outline-none focus:border-[#0EA5E9]"
          >
            <option value="TODOS">Todas las condiciones</option>
            <option value="NUEVO">Nuevo</option>
            <option value="OPENBOX">OpenBox</option>
            <option value="SEMINUEVO">Semi Nuevo</option>
          </select>

          <select
            value={filtros.ubicacion}
            onChange={(e) => setFiltros({...filtros, ubicacion: e.target.value})}
            className="px-5 py-3.5 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[15px] focus:outline-none focus:border-[#0EA5E9]"
          >
            <option value="TODOS">Todas las ubicaciones</option>
            <option value="STOCK OFICINA">Stock Oficina</option>
            <option value="STOCK BODEGA">Stock Bodega</option>
          </select>

          <select
            value={filtros.proveedor}
            onChange={(e) => setFiltros({...filtros, proveedor: e.target.value as Filtros['proveedor']})}
            className="px-5 py-3.5 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[15px] focus:outline-none focus:border-[#0EA5E9]"
          >
            <option value="TODOS">Todos los proveedores</option>
            {PROVEEDORES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {(hasActiveFilters || searchQuery) && (
            <button
              onClick={() => {
                setFiltros({ estado: 'TODOS', condicion: 'TODOS', ubicacion: 'TODOS', proveedor: 'TODOS' });
                setSearchQuery('');
              }}
              className="flex items-center gap-2 px-5 py-3.5 bg-[#EF444420] border border-[#EF4444] rounded-lg text-[#EF4444] font-semibold text-[15px] hover:bg-[#EF4444] hover:text-white transition-all"
            >
              <X size={18} />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0F172A]">
              <tr>
                <th className="px-6 py-5 text-left text-[14px] font-semibold text-[#94A3B8] uppercase tracking-wider">Producto</th>
                <th className="px-6 py-5 text-left text-[14px] font-semibold text-[#94A3B8] uppercase tracking-wider">IMEI</th>
                <th className="px-6 py-5 text-left text-[14px] font-semibold text-[#94A3B8] uppercase tracking-wider">Condición</th>
                <th className="px-6 py-5 text-left text-[14px] font-semibold text-[#94A3B8] uppercase tracking-wider">Batería</th>
                <th className="px-6 py-5 text-left text-[14px] font-semibold text-[#94A3B8] uppercase tracking-wider">Precio</th>
                <th className="px-6 py-5 text-left text-[14px] font-semibold text-[#94A3B8] uppercase tracking-wider">Estado</th>
                <th className="px-6 py-5 text-left text-[14px] font-semibold text-[#94A3B8] uppercase tracking-wider">Proveedor</th>
                <th className="px-6 py-5 text-left text-[14px] font-semibold text-[#94A3B8] uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map(p => (
                <tr key={p.id} className={`border-b border-[#334155] hover:bg-[#0F172A] transition-colors ${p.estado === 'VENDIDO' ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <Smartphone size={20} className="text-[#0EA5E9]" />
                      <div>
                        <strong className="text-[#F1F5F9] text-[15px] block">{p.equipo} {p.modelo}</strong>
                        <span className="text-[#64748B] text-[13px]">{p.color} • {p.gb}GB</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-mono text-[#94A3B8] text-[14px]">{p.imei}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-wider ${
                      p.condicion === 'NUEVO' ? 'bg-[#10B98130] text-[#10B981]' :
                      p.condicion === 'OPENBOX' ? 'bg-[#0EA5E930] text-[#0EA5E9]' :
                      'bg-[#F59E0B30] text-[#F59E0B]'
                    }`}>
                      {p.condicion}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Battery size={18} className={p.bateria >= 90 ? 'text-[#10B981]' : 'text-[#F59E0B]'} />
                      <span className="text-[#94A3B8] text-[15px]">{p.bateria}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-semibold text-[#10B981] text-[17px]">${(p.precioEfectivo / 1000).toFixed(0)}K</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold ${
                      p.estado === 'DISPONIBLE' ? 'bg-[#10B98120] text-[#10B981]' : 'bg-[#64748B20] text-[#64748B]'
                    }`}>
                      {p.estado === 'DISPONIBLE' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-[#64748B]" />
                      <span className="text-[#94A3B8] text-[14px]">{p.proveedor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-3">
                      <button
                        onClick={() => onVerHistorial(p)}
                        title="Ver historial"
                        className="w-10 h-10 flex items-center justify-center bg-[#0F172A] border border-[#334155] rounded-lg text-[#94A3B8] hover:bg-[#334155] hover:text-[#0EA5E9] hover:border-[#0EA5E9] transition-all"
                      >
                        <History size={18} />
                      </button>
                      {p.estado === 'DISPONIBLE' && (
                        <button
                          onClick={() => onVenderProducto(p)}
                          title="Vender"
                          className="w-10 h-10 flex items-center justify-center bg-[#10B98120] border border-[#10B981] rounded-lg text-[#10B981] hover:bg-[#10B981] hover:text-white transition-all"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {productosFiltrados.length === 0 && (
            <div className="py-20 text-center">
              <svg className="w-12 h-12 text-[#64748B] opacity-30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[#64748B] text-[16px] mb-4">No se encontraron productos con los filtros aplicados</p>
              <button
                onClick={() => {
                  setFiltros({ estado: 'TODOS', condicion: 'TODOS', ubicacion: 'TODOS', proveedor: 'TODOS' });
                  setSearchQuery('');
                }}
                className="text-[#0EA5E9] font-semibold hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
