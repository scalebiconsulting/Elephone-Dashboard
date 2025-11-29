"use client";

import { useState } from 'react';
import { 
  Calendar, DollarSign, TrendingUp, TrendingDown, ShoppingBag, Target, Package, 
  Percent, CheckCircle, Smartphone
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Producto } from '@/lib/types';

interface DashboardModuleProps {
  productos: Producto[];
}

export default function DashboardModule({ productos }: DashboardModuleProps) {
  const [rangoFecha, setRangoFecha] = useState('HOY');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const productosDisponibles = productos.filter(p => p.estado === 'DISPONIBLE');
  const productosVendidos = productos.filter(p => p.estado === 'VENDIDO');

  // Función para obtener rango de fechas (DINÁMICO)
  const obtenerRangoFechas = () => {
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);
    
    const formatearFecha = (fecha: Date) => fecha.toISOString().split('T')[0];
    
    let inicio, fin;

    switch(rangoFecha) {
      case 'HOY':
        inicio = fin = formatearFecha(hoy);
        break;
      case 'AYER':
        inicio = fin = formatearFecha(ayer);
        break;
      case 'SEMANA':
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - 6);
        inicio = formatearFecha(inicioSemana);
        fin = formatearFecha(hoy);
        break;
      case 'MES':
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        inicio = formatearFecha(inicioMes);
        fin = formatearFecha(hoy);
        break;
      case 'PERSONALIZADO':
        inicio = fechaInicio || formatearFecha(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
        fin = fechaFin || formatearFecha(hoy);
        break;
      default:
        inicio = fin = formatearFecha(hoy);
    }

    return { inicio, fin };
  };

  const { inicio, fin } = obtenerRangoFechas();

  // Filtrar ventas por rango
  const ventasRango = productosVendidos.filter(p => {
    if (!p.fechaVenta) return false;
    return p.fechaVenta >= inicio && p.fechaVenta <= fin;
  });

  // Calcular período anterior para comparación
  const calcularPeriodoAnterior = () => {
    const dias = Math.floor((new Date(fin).getTime() - new Date(inicio).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const fechaInicioAnterior = new Date(new Date(inicio).getTime() - dias * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const fechaFinAnterior = new Date(new Date(inicio).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return productosVendidos.filter(p => {
      if (!p.fechaVenta) return false;
      return p.fechaVenta >= fechaInicioAnterior && p.fechaVenta <= fechaFinAnterior;
    });
  };

  const ventasPeriodoAnterior = calcularPeriodoAnterior();

  // Métricas del período
  const montoVentas = ventasRango.reduce((sum, p) => sum + p.precioEfectivo, 0);
  const costoTotal = ventasRango.reduce((sum, p) => sum + p.costo, 0);
  const utilidadTotal = ventasRango.reduce((sum, p) => sum + p.utilidad, 0);
  const unidadesVendidas = ventasRango.length;
  const ticketPromedio = unidadesVendidas > 0 ? montoVentas / unidadesVendidas : 0;

  // Métricas período anterior
  const montoVentasAnterior = ventasPeriodoAnterior.reduce((sum, p) => sum + p.precioEfectivo, 0);
  const unidadesVendidasAnterior = ventasPeriodoAnterior.length;

  // Calcular cambios
  const cambioVentas = montoVentasAnterior > 0 ? ((montoVentas - montoVentasAnterior) / montoVentasAnterior) * 100 : 0;
  const cambioUnidades = unidadesVendidasAnterior > 0 ? ((unidadesVendidas - unidadesVendidasAnterior) / unidadesVendidasAnterior) * 100 : 0;

  // Datos para gráfico de evolución diaria
  const obtenerVentasPorDia = () => {
    const ventasPorDia: Record<string, { fecha: string; monto: number; unidades: number }> = {};
    const fechaActual = new Date(inicio);
    const fechaFinal = new Date(fin);

    while (fechaActual <= fechaFinal) {
      const fechaStr = fechaActual.toISOString().split('T')[0];
      ventasPorDia[fechaStr] = { fecha: fechaStr, monto: 0, unidades: 0 };
      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    ventasRango.forEach(v => {
      if (v.fechaVenta && ventasPorDia[v.fechaVenta]) {
        ventasPorDia[v.fechaVenta].monto += v.precioEfectivo;
        ventasPorDia[v.fechaVenta].unidades += 1;
      }
    });

    return Object.values(ventasPorDia).map(d => ({
      fecha: new Date(d.fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }),
      monto: d.monto / 1000,
      unidades: d.unidades
    }));
  };

  const datosGrafico = obtenerVentasPorDia();

  // Top productos vendidos
  const obtenerTopProductos = () => {
    const productosCount: Record<string, { modelo: string; cantidad: number; monto: number }> = {};
    ventasRango.forEach(v => {
      const key = v.modelo;
      if (!productosCount[key]) {
        productosCount[key] = { modelo: v.modelo, cantidad: 0, monto: 0 };
      }
      productosCount[key].cantidad += 1;
      productosCount[key].monto += v.precioEfectivo;
    });

    return Object.values(productosCount)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)
      .map(p => ({
        modelo: p.modelo,
        cantidad: p.cantidad,
        monto: p.monto / 1000
      }));
  };

  const topProductos = obtenerTopProductos();

  // Distribución por método de pago
  const obtenerDistribucionPagos = () => {
    const pagos: Record<string, number> = {};
    ventasRango.forEach(v => {
      const metodo = v.metodoPago || 'NO ESPECIFICADO';
      if (!pagos[metodo]) {
        pagos[metodo] = 0;
      }
      pagos[metodo] += v.precioEfectivo;
    });

    return Object.entries(pagos).map(([metodo, monto]) => ({
      name: metodo,
      value: monto,
      porcentaje: ((monto / montoVentas) * 100).toFixed(1)
    }));
  };

  const distribucionPagos = obtenerDistribucionPagos();

  const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-[#F1F5F9] mb-2">Dashboard de Gestión</h1>
          <p className="text-[14px] text-[#64748B]">
            {rangoFecha === 'HOY' ? 'Reporte del día • ' : rangoFecha === 'PERSONALIZADO' ? `${inicio} al ${fin} • ` : `Reporte ${rangoFecha.toLowerCase()} • `}
            {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="text-right">
            <p className="text-[12px] text-[#64748B]">Total Stock</p>
            <strong className="text-[18px] font-bold text-[#0EA5E9]">{productosDisponibles.length} unidades</strong>
          </div>
        </div>
      </div>

      {/* Selector de rango de fechas */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 mb-8">
        <div className="flex gap-2 mb-4 flex-wrap">
          {['HOY', 'AYER', 'SEMANA', 'MES', 'PERSONALIZADO'].map(rango => (
            <button
              key={rango}
              onClick={() => setRangoFecha(rango)}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-lg font-semibold text-[14px] transition-all
                ${rangoFecha === rango 
                  ? 'bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white shadow-[0_4px_12px_rgba(14,165,233,0.3)]' 
                  : 'bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:bg-[#334155] hover:text-[#E2E8F0]'
                }
              `}
            >
              {rango === 'HOY' && <Calendar size={16} />}
              {rango}
            </button>
          ))}
        </div>

        {rangoFecha === 'PERSONALIZADO' && (
          <div className="flex flex-col sm:flex-row gap-4 pt-5 mt-5 border-t border-[#334155] animate-slideDown">
            <div className="flex-1 flex items-center gap-3">
              <label className="text-[#94A3B8] font-semibold text-[15px] whitespace-nowrap">Desde:</label>
              <input 
                type="date" 
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[14px] focus:outline-none focus:border-[#0EA5E9] focus:ring-[3px] focus:ring-[#0EA5E910] transition-all"
              />
            </div>
            <div className="flex-1 flex items-center gap-3">
              <label className="text-[#94A3B8] font-semibold text-[14px] whitespace-nowrap">Hasta:</label>
              <input 
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-[#0F172A] border border-[#334155] rounded-lg text-[#E2E8F0] text-[14px] focus:outline-none focus:border-[#0EA5E9] focus:ring-[3px] focus:ring-[#0EA5E910] transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Estado vacío cuando no hay productos */}
      {productos.length === 0 ? (
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-2 border-dashed border-[#334155] rounded-2xl p-10 mb-10 text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#0EA5E920] flex items-center justify-center">
            <Package size={40} className="text-[#0EA5E9]" />
          </div>
          <h3 className="text-[24px] font-bold text-[#F1F5F9] mb-3">No hay datos disponibles</h3>
          <p className="text-[16px] text-[#64748B] mb-6">Comienza registrando productos y ventas para ver el análisis del dashboard</p>
          <div className="flex gap-3 justify-center">
            <span className="px-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-[#94A3B8] text-[14px]">💡 Tip: Ve a &quot;Ingresos&quot; para agregar productos</span>
          </div>
        </div>
      ) : (
        <>
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Ventas Totales */}
        <div className="bg-gradient-to-br from-[#0EA5E933] to-[#1E293B] border border-[#0EA5E9] rounded-2xl p-7 flex gap-5 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,165,233,0.2)] transition-all min-h-[160px]">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center flex-shrink-0">
            <DollarSign size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[#94A3B8] text-[15px] mb-2 font-medium">Ventas Totales</p>
            <h2 className="text-[36px] font-bold text-[#F1F5F9] mb-2 leading-none">${(montoVentas / 1000000).toFixed(2)}M</h2>
            <span className={`inline-flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 rounded-lg ${cambioVentas >= 0 ? 'text-[#10B981] bg-[#10B98120]' : 'text-[#EF4444] bg-[#EF444420]'}`}>
              {cambioVentas >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(cambioVentas).toFixed(1)}% vs período anterior
            </span>
          </div>
        </div>

        {/* Utilidad Neta */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#334155] rounded-2xl p-7 flex gap-5 hover:-translate-y-1 hover:border-[#0EA5E9] hover:shadow-[0_12px_32px_rgba(14,165,233,0.2)] transition-all min-h-[160px]">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center flex-shrink-0">
            <TrendingUp size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[#94A3B8] text-[15px] mb-2 font-medium">Utilidad Neta</p>
            <h2 className="text-[36px] font-bold text-[#F1F5F9] mb-2 leading-none">${(utilidadTotal / 1000).toFixed(0)}K</h2>
            <span className="text-[14px] text-[#10B981] font-semibold">
              Margen {((utilidadTotal/montoVentas)*100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Unidades Vendidas */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#334155] rounded-2xl p-7 flex gap-5 hover:-translate-y-1 hover:border-[#0EA5E9] hover:shadow-[0_12px_32px_rgba(14,165,233,0.2)] transition-all min-h-[160px]">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center flex-shrink-0">
            <ShoppingBag size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[#94A3B8] text-[15px] mb-2 font-medium">Unidades Vendidas</p>
            <h2 className="text-[36px] font-bold text-[#F1F5F9] mb-2 leading-none">{unidadesVendidas}</h2>
            <span className={`inline-flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 rounded-lg ${cambioUnidades >= 0 ? 'text-[#10B981] bg-[#10B98120]' : 'text-[#EF4444] bg-[#EF444420]'}`}>
              {cambioUnidades >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(cambioUnidades).toFixed(1)}% vs anterior
            </span>
          </div>
        </div>

        {/* Ticket Promedio */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#334155] rounded-2xl p-7 flex gap-5 hover:-translate-y-1 hover:border-[#0EA5E9] hover:shadow-[0_12px_32px_rgba(14,165,233,0.2)] transition-all min-h-[160px]">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center flex-shrink-0">
            <Target size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[#94A3B8] text-[15px] mb-2 font-medium">Ticket Promedio</p>
            <h2 className="text-[36px] font-bold text-[#F1F5F9] mb-2 leading-none">${(ticketPromedio / 1000).toFixed(0)}K</h2>
            <span className="text-[14px] text-[#64748B]">por transacción</span>
          </div>
        </div>

        {/* Stock Disponible */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#334155] rounded-2xl p-7 flex gap-5 hover:-translate-y-1 hover:border-[#0EA5E9] hover:shadow-[0_12px_32px_rgba(14,165,233,0.2)] transition-all min-h-[160px]">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#0891B2] flex items-center justify-center flex-shrink-0">
            <Package size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[#94A3B8] text-[15px] mb-2 font-medium">Stock Disponible</p>
            <h2 className="text-[36px] font-bold text-[#F1F5F9] mb-2 leading-none">{productosDisponibles.length}</h2>
            <span className="text-[14px] text-[#64748B]">unidades en inventario</span>
          </div>
        </div>

        {/* ROI Período */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#334155] rounded-2xl p-7 flex gap-5 hover:-translate-y-1 hover:border-[#0EA5E9] hover:shadow-[0_12px_32px_rgba(14,165,233,0.2)] transition-all min-h-[160px]">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center flex-shrink-0">
            <Percent size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[#94A3B8] text-[15px] mb-2 font-medium">ROI Período</p>
            <h2 className="text-[36px] font-bold text-[#F1F5F9] mb-2 leading-none">{((utilidadTotal / costoTotal) * 100).toFixed(1)}%</h2>
            <span className="text-[14px] text-[#10B981]">retorno inversión</span>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Gráfico de evolución de ventas */}
        <div className="lg:col-span-2 bg-[#1E293B] border border-[#334155] rounded-2xl p-6 hover:border-[#0EA5E9] hover:shadow-[0_8px_24px_rgba(14,165,233,0.1)] transition-all">
          <div className="mb-7">
            <h3 className="text-[20px] font-bold text-[#F1F5F9] mb-2">📈 Evolución de Ventas</h3>
            <p className="text-[14px] text-[#64748B]">Ventas diarias en el período seleccionado</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={datosGrafico}>
              <defs>
                <linearGradient id="colorMonto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="fecha" stroke="#94A3B8" style={{fontSize: '12px'}} />
              <YAxis stroke="#94A3B8" style={{fontSize: '12px'}} />
              <Tooltip 
                contentStyle={{
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#E2E8F0'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'monto') return [`$${value.toFixed(0)}K`, 'Ventas'];
                  return [value, 'Unidades'];
                }}
              />
              <Area 
                type="monotone" 
                dataKey="monto" 
                stroke="#0EA5E9" 
                strokeWidth={3}
                fill="url(#colorMonto)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top productos vendidos */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 hover:border-[#0EA5E9] hover:shadow-[0_8px_24px_rgba(14,165,233,0.1)] transition-all">
          <div className="mb-7">
            <h3 className="text-[20px] font-bold text-[#F1F5F9] mb-2">🏆 Top Productos</h3>
            <p className="text-[14px] text-[#64748B]">Más vendidos del período</p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topProductos} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94A3B8" style={{fontSize: '12px'}} />
              <YAxis dataKey="modelo" type="category" stroke="#94A3B8" style={{fontSize: '11px'}} width={80} />
              <Tooltip 
                contentStyle={{
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#E2E8F0'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'cantidad') return [value, 'Unidades'];
                  return [`$${value.toFixed(0)}K`, 'Ventas'];
                }}
              />
              <Bar dataKey="cantidad" fill="#10B981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por método de pago */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 hover:border-[#0EA5E9] hover:shadow-[0_8px_24px_rgba(14,165,233,0.1)] transition-all">
          <div className="mb-7">
            <h3 className="text-[20px] font-bold text-[#F1F5F9] mb-2">💳 Métodos de Pago</h3>
            <p className="text-[14px] text-[#64748B]">Distribución de pagos</p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={distribucionPagos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distribucionPagos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#E2E8F0'
                }}
                formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, 'Monto']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Últimas ventas y productos recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas ventas */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[20px] font-bold text-[#F1F5F9] mb-1">🕐 Últimas Ventas</h3>
              <p className="text-[14px] text-[#64748B]">{ventasRango.slice(0, 5).length} transacciones recientes</p>
            </div>
          </div>
          <div className="space-y-4">
            {ventasRango.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle size={56} className="text-[#334155] mx-auto mb-4" />
                <p className="text-[17px] text-[#64748B] mb-2">No hay ventas en este período</p>
                <p className="text-[14px] text-[#475569]">Las ventas recientes aparecerán aquí</p>
              </div>
            ) : (
              ventasRango.slice(0, 5).reverse().map(v => (
              <div key={v.id} className="flex items-center gap-5 p-5 bg-[#0F172A] rounded-xl hover:bg-[#1E293B] hover:translate-x-1 transition-all border border-transparent hover:border-[#10B981]">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <strong className="text-[#F1F5F9] text-[16px] block mb-1">{v.equipo} {v.modelo}</strong>
                  <span className="text-[#64748B] text-[14px]">{v.color} • {v.gb}GB • {v.fechaVenta}</span>
                </div>
                <div>
                  <span className="px-3 py-1.5 bg-[#0EA5E920] border border-[#0EA5E9] rounded-lg text-[#0EA5E9] text-[12px] font-bold uppercase tracking-wider">
                    {v.metodoPago || 'N/A'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-[20px] font-bold text-[#F1F5F9]">${(v.precioEfectivo / 1000).toFixed(0)}K</div>
                  <div className="text-[14px] text-[#10B981] font-semibold">+${(v.utilidad / 1000).toFixed(0)}K</div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>

        {/* Productos recién ingresados */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[20px] font-bold text-[#F1F5F9] mb-1">⚡ Productos Recién Ingresados</h3>
              <p className="text-[14px] text-[#64748B]">{productosDisponibles.slice(0, 5).length} productos disponibles</p>
            </div>
          </div>
          <div className="space-y-4">
            {productosDisponibles.length === 0 ? (
              <div className="py-12 text-center">
                <Smartphone size={56} className="text-[#334155] mx-auto mb-4" />
                <p className="text-[17px] text-[#64748B] mb-2">No hay productos en inventario</p>
                <p className="text-[14px] text-[#475569]">Registra productos en la sección &quot;Ingresos&quot;</p>
              </div>
            ) : (
              productosDisponibles.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-5 p-5 bg-[#0F172A] rounded-xl hover:bg-[#1E293B] hover:translate-x-1 transition-all border border-transparent hover:border-[#0EA5E9]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center flex-shrink-0">
                  <Smartphone size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <strong className="text-[#F1F5F9] text-[16px] block mb-1">{p.equipo} {p.modelo}</strong>
                  <span className="text-[#64748B] text-[14px]">{p.color} • {p.gb}GB • {p.condicion}</span>
                </div>
                <div className="text-right">
                  <div className="text-[20px] font-bold text-[#10B981]">${(p.precioEfectivo / 1000).toFixed(0)}K</div>
                  <div className="text-[13px] text-[#64748B]">{p.ubicacion}</div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
