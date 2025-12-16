"use client";

import { useState, useEffect, useCallback } from 'react';
import { ProductoInventario, Venta } from '@/app/types/producto';
import { extraerNumero, formatoPesosChilenos } from '@/app/utils/formatters';

export function usePuntoVenta(productoInicial: ProductoInventario | null) {
  const [producto, setProducto] = useState<ProductoInventario | null>(productoInicial);
  const [nombreCliente, setNombreCliente] = useState('');
  const [correoCliente, setCorreoCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [modalidadPago, setModalidadPago] = useState<'CONTADO' | 'CREDITO'>('CONTADO');
  const [montoEfectivo, setMontoEfectivo] = useState('');
  const [montoTransferencia, setMontoTransferencia] = useState('');
  const [montoDebito, setMontoDebito] = useState('');
  const [estadoVenta, setEstadoVenta] = useState('PENDIENTE');
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar ventas al montar
  useEffect(() => {
    fetchVentas();
  }, []);

  // Actualizar producto cuando cambia el inicial
  useEffect(() => {
    if (productoInicial) {
      setProducto(productoInicial);
      resetFormulario();
    }
  }, [productoInicial]);

  const fetchVentas = async () => {
    try {
      const response = await fetch('/api/ventas');
      if (response.ok) {
        const data = await response.json();
        setVentas(data);
      }
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    }
  };

  const calcularPrecioFinal = useCallback(() => {
    if (!producto) return 0;
    return modalidadPago === 'CONTADO' ? producto.pvpEfectivo : producto.pvpCredito;
  }, [producto, modalidadPago]);

  const calcularTotalPagado = useCallback(() => {
    // En modalidad CRÉDITO, el pago es el total (a crédito)
    if (modalidadPago === 'CREDITO') {
      return calcularPrecioFinal();
    }
    // En CONTADO, suma los 3 métodos de pago
    return extraerNumero(montoEfectivo) + extraerNumero(montoTransferencia) + extraerNumero(montoDebito);
  }, [montoEfectivo, montoTransferencia, montoDebito, modalidadPago, calcularPrecioFinal]);

  const calcularSaldoPendiente = useCallback(() => {
    // En CRÉDITO no hay saldo pendiente (se financia todo)
    if (modalidadPago === 'CREDITO') return 0;
    const precioFinal = calcularPrecioFinal();
    const totalPagado = calcularTotalPagado();
    return precioFinal - totalPagado;
  }, [calcularPrecioFinal, calcularTotalPagado, modalidadPago]);

  const calcularUtilidad = useCallback(() => {
    if (!producto) return 0;
    const precio = calcularPrecioFinal();
    return precio - producto.costo - (producto.repuesto || 0);
  }, [producto, calcularPrecioFinal]);

  // Handlers con formato
  const handleSetMontoEfectivo = useCallback((value: string) => {
    setMontoEfectivo(formatoPesosChilenos(value));
  }, []);

  const handleSetMontoTransferencia = useCallback((value: string) => {
    setMontoTransferencia(formatoPesosChilenos(value));
  }, []);

  const handleSetMontoDebito = useCallback((value: string) => {
    setMontoDebito(formatoPesosChilenos(value));
  }, []);

  const registrarVenta = async () => {
    if (!producto) return false;

    // Validaciones
    if (!nombreCliente.trim() || nombreCliente.length < 3) {
      alert('El nombre del cliente debe tener al menos 3 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoCliente.trim() || !emailRegex.test(correoCliente)) {
      alert('Ingrese un correo electrónico válido');
      return false;
    }

    const telefonoRegex = /^(\+?56)?[9]\d{8}$/;
    if (!telefonoCliente.trim() || !telefonoRegex.test(telefonoCliente.replace(/\s/g, ''))) {
      alert('Ingrese un teléfono válido (formato chileno: +56 9...)');
      return false;
    }

    // Validar que el pago cubra el total (solo en CONTADO)
    if (modalidadPago === 'CONTADO') {
      const saldoPendiente = calcularSaldoPendiente();
      if (saldoPendiente > 0) {
        alert(`Falta cubrir ${saldoPendiente.toLocaleString('es-CL')} del total`);
        return false;
      }
    }

    setLoading(true);

    try {
      // Determinar método de pago
      let metodoPagoFinal: string;
      const efectivo = extraerNumero(montoEfectivo);
      const transferencia = extraerNumero(montoTransferencia);
      const debito = extraerNumero(montoDebito);

      if (modalidadPago === 'CREDITO') {
        metodoPagoFinal = 'CRÉDITO';
      } else {
        const metodosPago: string[] = [];
        if (efectivo > 0) metodosPago.push('EFECTIVO');
        if (transferencia > 0) metodosPago.push('TRANSFERENCIA');
        if (debito > 0) metodosPago.push('DÉBITO');
        metodoPagoFinal = metodosPago.join(' + ');
      }

      const venta = {
        productoId: producto._id,
        sku: producto.sku,
        modelo2: producto.modelo2,
        nombreCliente,
        correoCliente,
        telefonoCliente,
        metodoPago: metodoPagoFinal,
        montoEfectivo: efectivo,
        montoTransferencia: transferencia,
        montoDebito: debito,
        modalidadPago,
        precioVenta: calcularPrecioFinal(),
        utilidad: calcularUtilidad(),
        fechaVenta: new Date().toISOString(),
        estadoVenta,
        producto,
      };

      const response = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venta),
      });

      if (response.ok) {
        // Marcar producto como VENDIDO en inventario
        await fetch(`/api/productos/${producto._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'VENDIDO' }),
        });

        alert('¡Venta registrada exitosamente!');
        setProducto(null);
        resetFormulario();
        fetchVentas();
        return true;
      } else {
        alert('Error al registrar la venta');
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar la venta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetFormulario = () => {
    setNombreCliente('');
    setCorreoCliente('');
    setTelefonoCliente('');
    setModalidadPago('CONTADO');
    setMontoEfectivo('');
    setMontoTransferencia('');
    setMontoDebito('');
    setEstadoVenta('PENDIENTE');
  };

  return {
    producto,
    nombreCliente,
    setNombreCliente,
    correoCliente,
    setCorreoCliente,
    telefonoCliente,
    setTelefonoCliente,
    modalidadPago,
    setModalidadPago,
    montoEfectivo,
    setMontoEfectivo: handleSetMontoEfectivo,
    montoTransferencia,
    setMontoTransferencia: handleSetMontoTransferencia,
    montoDebito,
    setMontoDebito: handleSetMontoDebito,
    estadoVenta,
    setEstadoVenta,
    ventas,
    loading,
    calcularPrecioFinal,
    calcularTotalPagado,
    calcularSaldoPendiente,
    calcularUtilidad,
    registrarVenta,
    setProducto,
  };
}
