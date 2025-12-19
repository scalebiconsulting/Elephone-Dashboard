"use client";

import { useState, useEffect, useCallback } from 'react';
import { CreditCard, Search, RefreshCw, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { formatCLP } from '@/app/utils/formatters';
import { ProductoInventario } from '@/app/types/producto';
import ModalPagoCuota from '@/app/components/modals/ModalPagoCuota';

type FiltroPago = 'TODOS' | 'PENDIENTE' | 'PARCIAL';

interface CuotaConProducto {
  producto: ProductoInventario;
  cuota: {
    numero: number;
    monto: number;
    fechaVencimiento: string;
    montoEfectivo: number;
    montoTransferencia: number;
    referenciaTransferencia?: string;
    fechaPago?: string;
    estado: 'PENDIENTE' | 'PAGADO';
  };
  indiceCuota: number;
}

export default function CuentasPorPagarModule() {
  const [productos, setProductos] = useState<ProductoInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<FiltroPago>('TODOS');
  
  // Modal de pago
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cuotaSeleccionada, setCuotaSeleccionada] = useState<CuotaConProducto | null>(null);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/productos');
      const data = await response.json();
      
      if (data.success) {
        // Filtrar solo productos con pagos pendientes o parciales
        const conPagos = data.data.filter((p: ProductoInventario) => 
          p.pagoProveedor && 
          (p.pagoProveedor.estado === 'PENDIENTE' || p.pagoProveedor.estado === 'PARCIAL')
        );
        setProductos(conPagos);
      }
    } catch (error) {
      console.error('Error fetching productos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Obtener todas las cuotas pendientes de todos los productos (para prorrateados)
  const obtenerCuotasPendientes = (): CuotaConProducto[] => {
    const cuotas: CuotaConProducto[] = [];
    
    productos.forEach(producto => {
      if (producto.pagoProveedor?.esProrrateado) {
        producto.pagoProveedor.cuotas.forEach((cuota, index) => {
          if (cuota.estado === 'PENDIENTE') {
            cuotas.push({
              producto,
              cuota,
              indiceCuota: index
            });
          }
        });
      }
    });
    
    // Ordenar por fecha de vencimiento
    return cuotas.sort((a, b) => 
      new Date(a.cuota.fechaVencimiento).getTime() - new Date(b.cuota.fechaVencimiento).getTime()
    );
  };

  // Filtrar productos según búsqueda y filtro de estado
  const productosFiltrados = productos.filter(p => {
    const matchSearch = searchTerm === '' || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.modelo2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.proveedor?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEstado = filtroEstado === 'TODOS' || 
      p.pagoProveedor?.estado === filtroEstado;
    
    return matchSearch && matchEstado;
  });

  // Calcular totales
  const totalPendiente = productos.reduce((sum, p) => 
    sum + (p.pagoProveedor?.saldoPendiente || 0), 0
  );
  
  const productosProrrateados = productos.filter(p => p.pagoProveedor?.esProrrateado).length;

  // Cuotas próximas a vencer (en los próximos 7 días)
  const cuotasPendientes = obtenerCuotasPendientes();
  const hoy = new Date();
  const enUnaSemana = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
  const cuotasProximas = cuotasPendientes.filter(c => {
    const fechaVenc = new Date(c.cuota.fechaVencimiento);
    return fechaVenc <= enUnaSemana;
  });

  // Abrir modal para pagar cuota
  const handlePagarCuota = (cuotaConProducto: CuotaConProducto) => {
    setCuotaSeleccionada(cuotaConProducto);
    setModalAbierto(true);
  };

  // Cerrar modal
  const handleCerrarModal = () => {
    setModalAbierto(false);
    setCuotaSeleccionada(null);
  };

  // Formatear fecha
  const formatFecha = (fecha: string) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Verificar si una fecha está vencida
  const estaVencida = (fecha: string) => {
    return new Date(fecha) < hoy;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="text-[#f59e0b]" size={32} />
          <h1 className="text-3xl font-bold text-white">Cuentas por Pagar</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="text-red-400" size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Pendiente</p>
              <p className="text-2xl font-bold text-red-400">{formatCLP(totalPendiente)}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <CreditCard className="text-yellow-400" size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Productos con Deuda</p>
              <p className="text-2xl font-bold text-white">{productos.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Prorrateados</p>
              <p className="text-2xl font-bold text-white">{productosProrrateados}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-orange-400" size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Cuotas Próximas (7d)</p>
              <p className="text-2xl font-bold text-orange-400">{cuotasProximas.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cuotas Próximas a Vencer */}
      {cuotasProximas.length > 0 && (
        <div className="bg-[#1e293b] border border-orange-500/50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-orange-400" size={20} />
            <h2 className="text-lg font-bold text-white">Cuotas Próximas a Vencer</h2>
          </div>
          <div className="space-y-2">
            {cuotasProximas.map((item, idx) => (
              <div 
                key={`${item.producto._id}-${item.indiceCuota}-${idx}`}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  estaVencida(item.cuota.fechaVencimiento) 
                    ? 'bg-red-500/10 border border-red-500/50' 
                    : 'bg-[#0f172a]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium">{item.producto.sku}</span>
                  <span className="text-slate-400">{item.producto.proveedor?.nombre}</span>
                  <span className="text-slate-400">Cuota #{item.cuota.numero}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-medium ${
                    estaVencida(item.cuota.fechaVencimiento) ? 'text-red-400' : 'text-slate-300'
                  }`}>
                    {formatFecha(item.cuota.fechaVencimiento)}
                    {estaVencida(item.cuota.fechaVencimiento) && ' (VENCIDA)'}
                  </span>
                  <span className="text-white font-bold">{formatCLP(item.cuota.monto)}</span>
                  <button
                    onClick={() => handlePagarCuota(item)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Pagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar SKU, modelo, proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#0f172a] border border-[#334155] text-white rounded-lg focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
            />
          </div>

          {/* Filtro Estado */}
          <div>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as FiltroPago)}
              className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] text-white rounded-lg focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b]"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="PARCIAL">Parcial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Productos con Deudas */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f59e0b]"></div>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <CreditCard size={48} className="mb-4 opacity-50" />
            <p>No hay cuentas pendientes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f172a]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">SKU</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Modelo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Proveedor</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Costo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Pagado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Pendiente</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Estado</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-slate-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {productosFiltrados.map((producto) => (
                  <tr key={producto._id} className="hover:bg-[#334155]/50 transition-colors">
                    <td className="px-4 py-3 text-white font-mono">{producto.sku}</td>
                    <td className="px-4 py-3 text-slate-300">{producto.modelo2}</td>
                    <td className="px-4 py-3 text-slate-300">{producto.proveedor?.nombre || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        producto.pagoProveedor?.esProrrateado 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {producto.pagoProveedor?.esProrrateado ? 'Prorrateado' : 'Inmediato'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white">{formatCLP(producto.costo)}</td>
                    <td className="px-4 py-3 text-green-400">
                      {formatCLP(producto.pagoProveedor?.totalPagado || 0)}
                    </td>
                    <td className="px-4 py-3 text-red-400 font-bold">
                      {formatCLP(producto.pagoProveedor?.saldoPendiente || 0)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        producto.pagoProveedor?.estado === 'PARCIAL' 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {producto.pagoProveedor?.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {producto.pagoProveedor?.esProrrateado ? (
                        <span className="text-slate-400 text-sm">
                          Ver cuotas arriba
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePagarCuota({
                            producto,
                            cuota: {
                              numero: 1,
                              monto: producto.pagoProveedor?.saldoPendiente || 0,
                              fechaVencimiento: new Date().toISOString().split('T')[0],
                              montoEfectivo: 0,
                              montoTransferencia: 0,
                              estado: 'PENDIENTE'
                            },
                            indiceCuota: -1 // -1 indica pago inmediato
                          })}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Registrar Pago
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Pago */}
      {modalAbierto && cuotaSeleccionada && (
        <ModalPagoCuota
          isOpen={modalAbierto}
          onClose={handleCerrarModal}
          cuotaConProducto={cuotaSeleccionada}
          onPagoRegistrado={fetchProductos}
        />
      )}
    </div>
  );
}
