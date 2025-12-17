"use client";

import { useState, useEffect, useCallback } from 'react';
import { Reserva } from '@/app/types/producto';
import { extraerNumero, formatoPesosChilenos } from '@/app/utils/formatters';
import { toast } from '@/app/components/ui/Toast';

const ESTADO_INICIAL = {
  equipo: '',
  modelo: '',
  color: '',
  gb: '',
  condicion: '',
  precioAcordado: '',
  proveedor: '',
  fechaEstimadaLlegada: '',
  nombreCliente: '',
  correoCliente: '',
  telefonoCliente: '',
  montoSenaEfectivo: '',
  montoSenaTransferencia: '',
  montoSenaDebito: '',
  observaciones: '',
};

export function useReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [formulario, setFormulario] = useState(ESTADO_INICIAL);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // Cargar reservas
  const fetchReservas = useCallback(async () => {
    try {
      const response = await fetch('/api/reservas');
      if (response.ok) {
        const data = await response.json();
        setReservas(data);
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    }
  }, []);

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  // Actualizar campo del formulario
  const updateFormulario = useCallback((campo: string, valor: string) => {
    setFormulario(prev => ({ ...prev, [campo]: valor }));
  }, []);

  // Handler para campos de dinero
  const handleMoneyChange = useCallback((campo: string, valor: string) => {
    setFormulario(prev => ({ ...prev, [campo]: formatoPesosChilenos(valor) }));
  }, []);

  // Validar formulario
  const validarFormulario = (): boolean => {
    if (!formulario.equipo.trim()) {
      toast.warning('Ingrese el equipo');
      return false;
    }
    if (!formulario.modelo.trim()) {
      toast.warning('Ingrese el modelo');
      return false;
    }
    if (!formulario.nombreCliente.trim() || formulario.nombreCliente.length < 3) {
      toast.warning('El nombre del cliente debe tener al menos 3 caracteres');
      return false;
    }
    if (!formulario.telefonoCliente.trim()) {
      toast.warning('Ingrese el teléfono del cliente');
      return false;
    }
    if (!formulario.precioAcordado || extraerNumero(formulario.precioAcordado) <= 0) {
      toast.warning('Ingrese el precio acordado');
      return false;
    }
    return true;
  };

  // Crear reserva
  const crearReserva = async (): Promise<boolean> => {
    if (!validarFormulario()) return false;

    setLoading(true);
    try {
      const reserva = {
        equipo: formulario.equipo.toUpperCase(),
        modelo: formulario.modelo.toUpperCase(),
        color: formulario.color.toUpperCase(),
        gb: formulario.gb,
        condicion: formulario.condicion,
        precioAcordado: extraerNumero(formulario.precioAcordado),
        proveedor: formulario.proveedor.toUpperCase(),
        fechaEstimadaLlegada: formulario.fechaEstimadaLlegada,
        nombreCliente: formulario.nombreCliente,
        correoCliente: formulario.correoCliente,
        telefonoCliente: formulario.telefonoCliente,
        montoSenaEfectivo: extraerNumero(formulario.montoSenaEfectivo),
        montoSenaTransferencia: extraerNumero(formulario.montoSenaTransferencia),
        montoSenaDebito: extraerNumero(formulario.montoSenaDebito),
        observaciones: formulario.observaciones,
        estadoReserva: 'PENDIENTE',
      };

      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva),
      });

      if (response.ok) {
        toast.success('¡Reserva creada exitosamente!');
        resetFormulario();
        fetchReservas();
        return true;
      } else {
        toast.error('Error al crear la reserva');
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear la reserva');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar reserva
  const actualizarReserva = async (): Promise<boolean> => {
    if (!editandoId || !validarFormulario()) return false;

    setLoading(true);
    try {
      const reserva = {
        equipo: formulario.equipo.toUpperCase(),
        modelo: formulario.modelo.toUpperCase(),
        color: formulario.color.toUpperCase(),
        gb: formulario.gb,
        condicion: formulario.condicion,
        precioAcordado: extraerNumero(formulario.precioAcordado),
        proveedor: formulario.proveedor.toUpperCase(),
        fechaEstimadaLlegada: formulario.fechaEstimadaLlegada,
        nombreCliente: formulario.nombreCliente,
        correoCliente: formulario.correoCliente,
        telefonoCliente: formulario.telefonoCliente,
        montoSenaEfectivo: extraerNumero(formulario.montoSenaEfectivo),
        montoSenaTransferencia: extraerNumero(formulario.montoSenaTransferencia),
        montoSenaDebito: extraerNumero(formulario.montoSenaDebito),
        observaciones: formulario.observaciones,
      };

      const response = await fetch(`/api/reservas/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva),
      });

      if (response.ok) {
        toast.success('¡Reserva actualizada!');
        resetFormulario();
        fetchReservas();
        return true;
      } else {
        toast.error('Error al actualizar la reserva');
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar la reserva');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado de reserva
  const cambiarEstadoReserva = async (id: string, nuevoEstado: Reserva['estadoReserva']): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reservas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estadoReserva: nuevoEstado }),
      });

      if (response.ok) {
        toast.success(`Estado cambiado a ${nuevoEstado}`);
        fetchReservas();
        return true;
      } else {
        toast.error('Error al cambiar estado');
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cambiar estado');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar reserva
  const eliminarReserva = async (id: string): Promise<boolean> => {
    if (!confirm('¿Está seguro de eliminar esta reserva?')) return false;

    setLoading(true);
    try {
      const response = await fetch(`/api/reservas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Reserva eliminada');
        fetchReservas();
        return true;
      } else {
        toast.error('Error al eliminar la reserva');
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar la reserva');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cargar reserva para editar
  const editarReserva = (reserva: Reserva) => {
    setEditandoId(reserva._id);
    setFormulario({
      equipo: reserva.equipo,
      modelo: reserva.modelo,
      color: reserva.color,
      gb: reserva.gb,
      condicion: reserva.condicion,
      precioAcordado: formatoPesosChilenos(String(reserva.precioAcordado)),
      proveedor: reserva.proveedor,
      fechaEstimadaLlegada: reserva.fechaEstimadaLlegada,
      nombreCliente: reserva.nombreCliente,
      correoCliente: reserva.correoCliente,
      telefonoCliente: reserva.telefonoCliente,
      montoSenaEfectivo: formatoPesosChilenos(String(reserva.montoSenaEfectivo || 0)),
      montoSenaTransferencia: formatoPesosChilenos(String(reserva.montoSenaTransferencia || 0)),
      montoSenaDebito: formatoPesosChilenos(String(reserva.montoSenaDebito || 0)),
      observaciones: reserva.observaciones,
    });
  };

  // Reset formulario
  const resetFormulario = () => {
    setFormulario(ESTADO_INICIAL);
    setEditandoId(null);
  };

  // Contadores por estado
  const contadores = {
    pendientes: reservas.filter(r => r.estadoReserva === 'PENDIENTE').length,
    disponibles: reservas.filter(r => r.estadoReserva === 'PRODUCTO_DISPONIBLE').length,
    completadas: reservas.filter(r => r.estadoReserva === 'COMPLETADA').length,
    canceladas: reservas.filter(r => r.estadoReserva === 'CANCELADA').length,
  };

  return {
    // Estado
    reservas,
    loading,
    formulario,
    editandoId,
    contadores,
    // Acciones formulario
    updateFormulario,
    handleMoneyChange,
    resetFormulario,
    // CRUD
    crearReserva,
    actualizarReserva,
    editarReserva,
    eliminarReserva,
    cambiarEstadoReserva,
    fetchReservas,
  };
}
