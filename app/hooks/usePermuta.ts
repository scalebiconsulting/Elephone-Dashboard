"use client";

import { useState, useEffect, useCallback } from 'react';
import { ProductoInventario, Permuta } from '@/app/types/producto';
import { extraerNumero, formatoPesosChilenos } from '@/app/utils/formatters';
import { generarSKU, generarCorrelativo } from '@/app/utils/generators';

export function usePermuta() {
  // Estado del producto que entra (permuta del cliente)
  const [productoPermuta, setProductoPermuta] = useState({
    equipo: '',
    modelo: '',
    color: '',
    subModelo: '',
    serie: '',
    gb: '',
    condicion: '',
    modelo2: '',
    sku: '',
    correlativo: generarCorrelativo(),
    condicionBateria: '',
    costo: '',
    proveedor: '',
    fechaCompra: new Date().toISOString().split('T')[0],
    observacion: '',
    fallaMacOnline: '',
    garantiaCompra: '',
    block: 'NO',
    datosEquipos: 'NO DATOS',
    numeroSerie: '',
    imei1: '',
    imei2: '',
    concatenacion: '',
    estado: 'STOCK OFICINA',
    repuesto: '',
    pvpEfectivo: '',
    pvpCredito: '',
    valorPermuta: '',
  });

  // Estado del producto a vender (sale del inventario)
  const [skuBusqueda, setSkuBusqueda] = useState('');
  const [productoVenta, setProductoVenta] = useState<ProductoInventario | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  // Cliente
  const [nombreCliente, setNombreCliente] = useState('');
  const [correoCliente, setCorreoCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');

  // Pago/Devolución
  const [montoEfectivo, setMontoEfectivo] = useState('');
  const [montoTransferencia, setMontoTransferencia] = useState('');
  const [montoDebito, setMontoDebito] = useState('');
  const [estadoPermuta, setEstadoPermuta] = useState('PENDIENTE');

  // Historial
  const [permutas, setPermutas] = useState<Permuta[]>([]);
  const [loading, setLoading] = useState(false);

  // Variables para generar modelo2 y SKU
  const equipoVal = productoPermuta.equipo;
  const serieVal = productoPermuta.serie;
  const gbVal = productoPermuta.gb;
  const colorVal = productoPermuta.color;
  const condicionVal = productoPermuta.condicion;
  const subModeloVal = productoPermuta.subModelo;
  const correlativoVal = productoPermuta.correlativo;

  // Auto-generar modelo2
  useEffect(() => {
    const modelo2 = equipoVal && serieVal && gbVal && colorVal && condicionVal
      ? `${equipoVal} ${serieVal} ${gbVal} GB ${colorVal} ${condicionVal}`.toUpperCase()
      : '';
    setProductoPermuta(prev => prev.modelo2 !== modelo2 ? { ...prev, modelo2 } : prev);
  }, [equipoVal, serieVal, gbVal, colorVal, condicionVal]);

  // Auto-generar SKU
  useEffect(() => {
    if (equipoVal && serieVal && colorVal && gbVal && condicionVal && correlativoVal) {
      const sku = generarSKU(equipoVal, serieVal, subModeloVal || '', colorVal, gbVal, condicionVal, correlativoVal);
      setProductoPermuta(prev => prev.sku !== sku ? { ...prev, sku } : prev);
    }
  }, [equipoVal, serieVal, subModeloVal, colorVal, gbVal, condicionVal, correlativoVal]);

  // Variables para concatenación
  const imei1Val = productoPermuta.imei1;
  const imei2Val = productoPermuta.imei2;

  // Auto-generar concatenación
  useEffect(() => {
    const concatenacion = [imei1Val, imei2Val].filter(Boolean).join(';');
    setProductoPermuta(prev => prev.concatenacion !== concatenacion ? { ...prev, concatenacion } : prev);
  }, [imei1Val, imei2Val]);

  // Cargar permutas
  useEffect(() => {
    fetchPermutas();
  }, []);

  const fetchPermutas = async () => {
    try {
      const response = await fetch('/api/permutas');
      if (response.ok) {
        const data = await response.json();
        setPermutas(data);
      }
    } catch (error) {
      console.error('Error al cargar permutas:', error);
    }
  };

  // Buscar producto por SKU
  const buscarProductoPorSku = async () => {
    if (!skuBusqueda.trim()) {
      setErrorBusqueda('Ingrese un SKU');
      return;
    }

    setBuscando(true);
    setErrorBusqueda('');

    try {
      const response = await fetch('/api/productos');
      if (response.ok) {
        const data = await response.json();
        const producto = data.data.find(
          (p: ProductoInventario) => 
            p.sku?.toLowerCase() === skuBusqueda.toLowerCase() &&
            p.estado !== 'VENDIDO'
        );

        if (producto) {
          setProductoVenta(producto);
          setErrorBusqueda('');
        } else {
          setProductoVenta(null);
          setErrorBusqueda('Producto no encontrado o ya vendido');
        }
      }
    } catch (error) {
      console.error('Error al buscar producto:', error);
      setErrorBusqueda('Error al buscar producto');
    } finally {
      setBuscando(false);
    }
  };

  // Calcular diferencia
  const calcularDiferencia = useCallback(() => {
    if (!productoVenta) return 0;
    const precioVenta = productoVenta.pvpEfectivo;
    const valorPermuta = extraerNumero(productoPermuta.valorPermuta);
    return precioVenta - valorPermuta;
  }, [productoVenta, productoPermuta.valorPermuta]);

  // Tipo de transacción
  const getTipoTransaccion = useCallback((): 'CLIENTE_PAGA' | 'NEGOCIO_DEVUELVE' | 'EMPATE' => {
    const diferencia = calcularDiferencia();
    if (diferencia > 0) return 'CLIENTE_PAGA';
    if (diferencia < 0) return 'NEGOCIO_DEVUELVE';
    return 'EMPATE';
  }, [calcularDiferencia]);

  // Total pagado/devuelto
  const calcularTotalPagado = useCallback(() => {
    return extraerNumero(montoEfectivo) + extraerNumero(montoTransferencia) + extraerNumero(montoDebito);
  }, [montoEfectivo, montoTransferencia, montoDebito]);

  // Saldo pendiente
  const calcularSaldoPendiente = useCallback(() => {
    const diferencia = Math.abs(calcularDiferencia());
    const totalPagado = calcularTotalPagado();
    return diferencia - totalPagado;
  }, [calcularDiferencia, calcularTotalPagado]);

  // Utilidad
  const calcularUtilidad = useCallback(() => {
    if (!productoVenta) return 0;
    const precioVenta = productoVenta.pvpEfectivo;
    const costoProductoVenta = productoVenta.costo + (productoVenta.repuesto || 0);
    return precioVenta - costoProductoVenta;
  }, [productoVenta]);

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

  // Actualizar campo del producto permuta
  const updateProductoPermuta = useCallback((campo: string, valor: string) => {
    setProductoPermuta(prev => ({ ...prev, [campo]: valor }));
  }, []);

  // Registrar permuta
  const registrarPermuta = async () => {
    // Validaciones
    if (!productoVenta) {
      alert('Debe buscar y seleccionar un producto a vender');
      return false;
    }

    if (!productoPermuta.equipo || !productoPermuta.serie || !productoPermuta.condicion) {
      alert('Complete los campos obligatorios del producto en permuta');
      return false;
    }

    if (!productoPermuta.valorPermuta || extraerNumero(productoPermuta.valorPermuta) <= 0) {
      alert('Ingrese el valor de permuta');
      return false;
    }

    if (!nombreCliente.trim() || nombreCliente.length < 3) {
      alert('El nombre del cliente debe tener al menos 3 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoCliente.trim() || !emailRegex.test(correoCliente)) {
      alert('Ingrese un correo electrónico válido');
      return false;
    }

    const diferencia = calcularDiferencia();
    const tipoTransaccion = getTipoTransaccion();

    // Validar pago si hay diferencia
    if (tipoTransaccion !== 'EMPATE') {
      const saldoPendiente = calcularSaldoPendiente();
      if (saldoPendiente > 0) {
        alert(`Falta cubrir ${saldoPendiente.toLocaleString('es-CL')} de la ${tipoTransaccion === 'CLIENTE_PAGA' ? 'diferencia' : 'devolución'}`);
        return false;
      }
    }

    setLoading(true);

    try {
      // 1. Registrar producto del cliente en inventario
      const correlativo = generarCorrelativo();
      const modelo2 = `${productoPermuta.equipo} ${productoPermuta.serie} ${productoPermuta.gb} GB ${productoPermuta.color} ${productoPermuta.condicion}`.toUpperCase();
      const sku = generarSKU(
        productoPermuta.equipo,
        productoPermuta.serie,
        productoPermuta.subModelo || '',
        productoPermuta.color,
        productoPermuta.gb,
        productoPermuta.condicion,
        correlativo
      );

      const nuevoProducto = {
        equipo: productoPermuta.equipo.toUpperCase(),
        modelo: productoPermuta.modelo,
        color: productoPermuta.color.toUpperCase(),
        subModelo: productoPermuta.subModelo,
        serie: productoPermuta.serie,
        gb: parseInt(productoPermuta.gb) || 0,
        condicion: productoPermuta.condicion,
        modelo2,
        sku,
        condicionBateria: parseInt(productoPermuta.condicionBateria) || 0,
        costo: extraerNumero(productoPermuta.costo),
        proveedor: nombreCliente, // El cliente es el proveedor
        fechaCompra: productoPermuta.fechaCompra,
        observacion: productoPermuta.observacion,
        fallaMacOnline: productoPermuta.fallaMacOnline,
        garantiaCompra: productoPermuta.garantiaCompra,
        block: productoPermuta.block === 'SI',
        datosEquipos: productoPermuta.datosEquipos,
        numeroSerie: productoPermuta.numeroSerie,
        imei1: productoPermuta.imei1,
        imei2: productoPermuta.imei2,
        concatenacion: [productoPermuta.imei1, productoPermuta.imei2].filter(Boolean).join(';'),
        estado: productoPermuta.estado,
        fecha: new Date().toISOString(),
        metodoPago: ['PERMUTA'],
        repuesto: extraerNumero(productoPermuta.repuesto),
        pvpEfectivo: extraerNumero(productoPermuta.pvpEfectivo),
        pvpCredito: extraerNumero(productoPermuta.pvpCredito),
        utilidad: extraerNumero(productoPermuta.pvpEfectivo) - extraerNumero(productoPermuta.costo),
        utilidad2: extraerNumero(productoPermuta.pvpCredito) - extraerNumero(productoPermuta.costo),
        tresPorCiento: Math.round(extraerNumero(productoPermuta.pvpCredito) * 0.03),
      };

      const responseProducto = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),
      });

      if (!responseProducto.ok) {
        throw new Error('Error al registrar producto en permuta');
      }

      const dataProducto = await responseProducto.json();

      // 2. Marcar producto vendido como VENDIDO
      await fetch(`/api/productos/${productoVenta._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'VENDIDO' }),
      });

      // 3. Registrar la permuta
      const permuta = {
        productoVendidoId: productoVenta._id,
        productoVendidoSku: productoVenta.sku,
        productoVendidoModelo: productoVenta.modelo2,
        precioVenta: productoVenta.pvpEfectivo,
        productoPermutaId: dataProducto.id,
        productoPermutaSku: sku,
        productoPermutaModelo: modelo2,
        valorPermuta: extraerNumero(productoPermuta.valorPermuta),
        diferencia,
        tipoTransaccion,
        montoEfectivo: extraerNumero(montoEfectivo),
        montoTransferencia: extraerNumero(montoTransferencia),
        montoDebito: extraerNumero(montoDebito),
        nombreCliente,
        correoCliente,
        telefonoCliente,
        fechaPermuta: new Date().toISOString(),
        estadoPermuta,
        utilidad: calcularUtilidad(),
      };

      const responsePermuta = await fetch('/api/permutas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permuta),
      });

      if (responsePermuta.ok) {
        alert('¡Permuta registrada exitosamente!');
        resetFormulario();
        fetchPermutas();
        return true;
      } else {
        throw new Error('Error al registrar permuta');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrar la permuta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetFormulario = () => {
    setProductoPermuta({
      equipo: '',
      modelo: '',
      color: '',
      subModelo: '',
      serie: '',
      gb: '',
      condicion: '',
      modelo2: '',
      sku: '',
      correlativo: generarCorrelativo(),
      condicionBateria: '',
      costo: '',
      proveedor: '',
      fechaCompra: new Date().toISOString().split('T')[0],
      observacion: '',
      fallaMacOnline: '',
      garantiaCompra: '',
      block: 'NO',
      datosEquipos: 'NO DATOS',
      numeroSerie: '',
      imei1: '',
      imei2: '',
      concatenacion: '',
      estado: 'STOCK OFICINA',
      repuesto: '',
      pvpEfectivo: '',
      pvpCredito: '',
      valorPermuta: '',
    });
    setSkuBusqueda('');
    setProductoVenta(null);
    setErrorBusqueda('');
    setNombreCliente('');
    setCorreoCliente('');
    setTelefonoCliente('');
    setMontoEfectivo('');
    setMontoTransferencia('');
    setMontoDebito('');
    setEstadoPermuta('PENDIENTE');
  };

  return {
    // Producto permuta
    productoPermuta,
    updateProductoPermuta,
    // Búsqueda
    skuBusqueda,
    setSkuBusqueda,
    productoVenta,
    setProductoVenta,
    buscando,
    errorBusqueda,
    buscarProductoPorSku,
    // Cliente
    nombreCliente,
    setNombreCliente,
    correoCliente,
    setCorreoCliente,
    telefonoCliente,
    setTelefonoCliente,
    // Pago
    montoEfectivo,
    setMontoEfectivo: handleSetMontoEfectivo,
    montoTransferencia,
    setMontoTransferencia: handleSetMontoTransferencia,
    montoDebito,
    setMontoDebito: handleSetMontoDebito,
    estadoPermuta,
    setEstadoPermuta,
    // Cálculos
    calcularDiferencia,
    getTipoTransaccion,
    calcularTotalPagado,
    calcularSaldoPendiente,
    calcularUtilidad,
    // Acciones
    registrarPermuta,
    resetFormulario,
    // Estado
    permutas,
    loading,
  };
}
