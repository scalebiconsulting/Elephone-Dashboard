"use client";

import { useReservas } from '@/app/hooks/useReservas';
import { CalendarClock, Plus, Package, DollarSign } from 'lucide-react';
import { CONDICIONES_PRODUCTO, ESTADOS_RESERVA } from '@/app/constants/opciones';
import { formatCLP } from '@/app/utils/formatters';
import DateInput from '@/app/components/forms/shared/DateInput';
import SelectorPersona from '@/app/components/forms/shared/SelectorPersona';

export default function ReservasModule() {
  const {
    reservas,
    loading,
    formulario,
    proveedor,
    cliente,
    editandoId,
    contadores,
    updateFormulario,
    handleMoneyChange,
    setProveedor,
    setCliente,
    resetFormulario,
    crearReserva,
    actualizarReserva,
    editarReserva,
    eliminarReserva,
    cambiarEstadoReserva,
  } = useReservas();

  const handleSubmit = () => {
    if (editandoId) {
      actualizarReserva();
    } else {
      crearReserva();
    }
  };

  const getEstadoInfo = (estado: string) => {
    return ESTADOS_RESERVA.find(e => e.value === estado) || ESTADOS_RESERVA[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarClock className="text-[#0ea5e9]" size={32} />
          <h1 className="text-3xl font-bold text-white">Reserva de Productos</h1>
        </div>
        
        {/* Contadores */}
        <div className="flex gap-4">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2">
            <span className="text-yellow-400 font-bold">{contadores.pendientes}</span>
            <span className="text-yellow-400/70 text-sm ml-2">Pendientes</span>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
            <span className="text-green-400 font-bold">{contadores.disponibles}</span>
            <span className="text-green-400/70 text-sm ml-2">Disponibles</span>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-12">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Plus size={24} className="text-[#0ea5e9]" />
          {editandoId ? 'Editar Reserva' : 'Nueva Reserva'}
        </h2>

        {/* Sección Producto */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#334155] pb-2 flex items-center gap-2">
            <Package size={18} className="text-slate-400" />
            Producto Esperado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                EQUIPO <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formulario.equipo}
                onChange={(e) => updateFormulario('equipo', e.target.value.toUpperCase())}
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
                value={formulario.modelo}
                onChange={(e) => updateFormulario('modelo', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="15 Pro Max"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">COLOR</label>
              <input
                type="text"
                value={formulario.color}
                onChange={(e) => updateFormulario('color', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="Titanio Natural"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">GB</label>
              <input
                type="text"
                value={formulario.gb}
                onChange={(e) => updateFormulario('gb', e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="256"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">CONDICIÓN</label>
              <select
                value={formulario.condicion}
                onChange={(e) => updateFormulario('condicion', e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                {CONDICIONES_PRODUCTO.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sección Proveedor */}
        <div className="mb-6">
          <SelectorPersona
            persona={proveedor}
            onPersonaChange={setProveedor}
            roles={['PROVEEDOR']}
            titulo="Datos del Proveedor (Origen del Producto)"
            showDocumentos={false}
          />
        </div>

        {/* Sección Cliente */}
        <div className="mb-6">
          <SelectorPersona
            persona={cliente}
            onPersonaChange={setCliente}
            roles={['CLIENTE']}
            titulo="Datos del Cliente (Quien Reserva)"
            showDocumentos={false}
          />
        </div>

        {/* Sección Precio y Fecha */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-[#334155] pb-2 flex items-center gap-2">
            <DollarSign size={18} className="text-slate-400" />
            Precio y Fecha Estimada
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DateInput
              label="FECHA ESTIMADA LLEGADA"
              value={formulario.fechaEstimadaLlegada}
              onChange={(value) => updateFormulario('fechaEstimadaLlegada', value)}
            />
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                PRECIO ACORDADO <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formulario.precioAcordado}
                onChange={(e) => handleMoneyChange('precioAcordado', e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="$0"
              />
            </div>
          </div>

          {/* Seña/Abono con métodos de pago */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-400 mb-2">ABONO (Métodos de pago)</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Efectivo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="text"
                    value={formulario.montoSenaEfectivo}
                    onChange={(e) => handleMoneyChange('montoSenaEfectivo', e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Transferencia</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="text"
                    value={formulario.montoSenaTransferencia}
                    onChange={(e) => handleMoneyChange('montoSenaTransferencia', e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Débito</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input
                    type="text"
                    value={formulario.montoSenaDebito}
                    onChange={(e) => handleMoneyChange('montoSenaDebito', e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">OBSERVACIONES</label>
          <textarea
            value={formulario.observaciones}
            onChange={(e) => updateFormulario('observaciones', e.target.value)}
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9] resize-none"
            rows={2}
            placeholder="Notas adicionales..."
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            onClick={resetFormulario}
            className="flex-1 px-6 py-3 bg-[#334155] hover:bg-[#475569] text-white font-medium rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : editandoId ? 'Actualizar Reserva' : 'Crear Reserva'}
          </button>
        </div>
      </div>

      {/* Tabla de Reservas */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <CalendarClock size={24} className="text-[#0ea5e9]" />
          Reservas Activas
        </h2>

        {reservas.length === 0 ? (
          <div className="text-center py-12">
            <CalendarClock size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400">No hay reservas registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#334155]">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Estado</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Producto</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">Cliente</th>
                  <th className="text-right px-4 py-3 text-slate-400 font-medium text-sm">Precio</th>
                  <th className="text-right px-4 py-3 text-slate-400 font-medium text-sm">Seña</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium text-sm">F. Llegada</th>
                  <th className="text-center px-4 py-3 text-slate-400 font-medium text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => {
                  const estadoInfo = getEstadoInfo(reserva.estadoReserva);
                  return (
                    <tr key={reserva._id} className="border-b border-[#334155]/50 hover:bg-[#334155]/20">
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${estadoInfo.color}`}>
                          {estadoInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white font-medium">{reserva.equipo} {reserva.modelo}</div>
                        <div className="text-slate-400 text-sm">
                          {reserva.color} {reserva.gb && `${reserva.gb}GB`} {reserva.condicion}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-white">{reserva.nombreCliente}</div>
                        <div className="text-slate-400 text-sm">{reserva.telefonoCliente}</div>
                      </td>
                      <td className="px-4 py-3 text-right text-green-400 font-medium">
                        {formatCLP(reserva.precioAcordado)}
                      </td>
                      <td className="px-4 py-3 text-right text-yellow-400">
                        {(() => {
                          const totalSena = (reserva.montoSenaEfectivo || 0) + (reserva.montoSenaTransferencia || 0) + (reserva.montoSenaDebito || 0);
                          return totalSena > 0 ? formatCLP(totalSena) : '-';
                        })()}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-300 text-sm">
                        {reserva.fechaEstimadaLlegada 
                          ? new Date(reserva.fechaEstimadaLlegada).toLocaleDateString('es-CL')
                          : '-'
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {/* Cambiar estado */}
                          {reserva.estadoReserva === 'PENDIENTE' && (
                            <button
                              onClick={() => cambiarEstadoReserva(reserva._id, 'PRODUCTO_DISPONIBLE')}
                              className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                              title="Marcar como disponible"
                            >
                              ✓
                            </button>
                          )}
                          {reserva.estadoReserva === 'PRODUCTO_DISPONIBLE' && (
                            <button
                              onClick={() => cambiarEstadoReserva(reserva._id, 'COMPLETADA')}
                              className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                              title="Completar entrega"
                            >
                              📦
                            </button>
                          )}
                          {/* Editar */}
                          <button
                            onClick={() => editarReserva(reserva)}
                            className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            ✎
                          </button>
                          {/* Cancelar */}
                          {reserva.estadoReserva !== 'COMPLETADA' && reserva.estadoReserva !== 'CANCELADA' && (
                            <button
                              onClick={() => cambiarEstadoReserva(reserva._id, 'CANCELADA')}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="Cancelar reserva"
                            >
                              ✕
                            </button>
                          )}
                          {/* Eliminar */}
                          <button
                            onClick={() => eliminarReserva(reserva._id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
