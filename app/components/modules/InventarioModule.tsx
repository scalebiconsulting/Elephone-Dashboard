"use client";

import { useState, useEffect } from 'react';
import { Package, Search, Eye, Edit, Trash2, ShoppingBag, RefreshCw } from 'lucide-react';

interface Producto {
  _id: string;
  sku: string;
  modelo2: string;
  equipo: string;
  costo: number;
  pvpEfectivo: number;
  pvpCredito: number;
  utilidad: number;
  utilidad2: number;
  condicion: string;
  estado: string;
  fechaCompra: string;
  condicionBateria: number;
  concatenacion: string;
  numeroSerie: string;
  imei1: string;
}

interface InventarioModuleProps {
  onSelectForSale?: (producto: Producto) => void;
  onChangeModule?: (module: string) => void;
}

export default function InventarioModule({ onSelectForSale, onChangeModule }: InventarioModuleProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEquipo, setFiltroEquipo] = useState('');
  const [filtroCondicion, setFiltroCondicion] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  // Cargar productos
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/productos');
      const data = await response.json();
      if (data.success) {
        setProductos(data.data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Formato pesos chilenos
  const formatCLP = (valor: number) => {
    return valor ? `$${valor.toLocaleString('es-CL')}` : '$0';
  };

  // Filtrar productos
  const productosFiltrados = productos.filter((producto) => {
    const matchSearch = 
      producto.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.modelo2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.imei1?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEquipo = !filtroEquipo || producto.equipo === filtroEquipo;
    const matchCondicion = !filtroCondicion || producto.condicion === filtroCondicion;
    const matchEstado = !filtroEstado || producto.estado === filtroEstado;

    return matchSearch && matchEquipo && matchCondicion && matchEstado;
  });

  // Productos en stock
  const productosEnStock = productosFiltrados.filter(p => p.estado === 'STOCK OFICINA');

  // Estadísticas
  const totalProductos = productosEnStock.length;
  const valorInventario = productosEnStock.reduce((sum, p) => sum + (p.costo || 0), 0);

  // Obtener valores únicos para filtros
  const equiposUnicos = [...new Set(productos.map(p => p.equipo).filter(Boolean))];
  const condicionesUnicas = [...new Set(productos.map(p => p.condicion).filter(Boolean))];
  const estadosUnicos = [...new Set(productos.map(p => p.estado).filter(Boolean))];

  // Eliminar producto
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProductos();
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  // Seleccionar para venta
  const handleSelectForSale = (producto: Producto) => {
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
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f172a]">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300">SKU</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300">MODELO2</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">COSTO</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">PVP EFECTIVO</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">PVP CRÉDITO</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">UTILIDAD</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-slate-300">UTILIDAD2</th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-300">CONDICIÓN</th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-300">ESTADO</th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-300">FECHA COMPRA</th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-300">BATERÍA %</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300">IMEI 1</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-300">N° SERIE</th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-slate-300">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {loading ? (
                <tr>
                  <td colSpan={14} className="px-4 py-8 text-center text-slate-400">
                    Cargando productos...
                  </td>
                </tr>
              ) : productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-8 text-center text-slate-400">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((producto) => (
                  <tr key={producto._id} className="hover:bg-[#0f172a]/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-white font-mono">{producto.sku || '-'}</td>
                    <td className="px-4 py-3 text-sm text-white max-w-[200px] truncate" title={producto.modelo2}>
                      {producto.modelo2 || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-white text-right">{formatCLP(producto.costo)}</td>
                    <td className="px-4 py-3 text-sm text-white text-right">{formatCLP(producto.pvpEfectivo)}</td>
                    <td className="px-4 py-3 text-sm text-white text-right">{formatCLP(producto.pvpCredito)}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={producto.utilidad >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {formatCLP(producto.utilidad)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={producto.utilidad2 >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {formatCLP(producto.utilidad2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        producto.condicion === 'NUEVO' ? ' text-green-400' :
                        producto.condicion === 'SEMINUEVO' ? ' text-yellow-400' :
                        producto.condicion === 'OPENBOX' ? ' text-blue-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {producto.condicion || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        producto.estado === 'STOCK OFICINA' ? ' text-[#0ea5e9]' :
                        producto.estado === 'VENDIDO' ? ' text-purple-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {producto.estado || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 text-center">{producto.fechaCompra || '-'}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`font-medium ${
                        producto.condicionBateria >= 80 ? 'text-green-400' :
                        producto.condicionBateria >= 50 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {producto.condicionBateria ? `${producto.condicionBateria}%` : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 font-mono text-xs max-w-[150px] truncate" title={producto.imei1}>
                      {producto.imei1 || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 font-mono">{producto.numeroSerie || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => alert(`Ver detalles de ${producto.sku}`)}
                          className="p-2 text-slate-400 hover:text-[#0ea5e9] hover:bg-[#0ea5e9]/10 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => alert(`Editar ${producto.sku}`)}
                          className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(producto._id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                        {producto.estado === 'STOCK OFICINA' && (
                          <button
                            onClick={() => handleSelectForSale(producto)}
                            className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                            title="Seleccionar para venta"
                          >
                            <ShoppingBag size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer con conteo */}
        <div className="px-4 py-3 bg-[#0f172a] border-t border-[#334155]">
          <p className="text-sm text-slate-400">
            Mostrando <span className="text-white font-medium">{productosFiltrados.length}</span> de{' '}
            <span className="text-white font-medium">{productos.length}</span> productos
          </p>
        </div>
      </div>
    </div>
  );
}
