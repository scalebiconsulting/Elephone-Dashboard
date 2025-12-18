"use client";

import { useState, useEffect, useCallback } from 'react';
import { ProductoInventario, Permuta, Persona } from '@/app/types/producto';
import { extraerNumero, formatoPesosChilenos } from '@/app/utils/formatters';
import { generarCorrelativo, generarModelo2, generarConcatenacion } from '@/app/utils/generators';
import { toast } from '@/app/components/ui/Toast';

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

  // Persona unificada (cliente = proveedor en permutas)
  const [persona, setPersona] = useState<Persona | null>(null);

  // Pago/Devolución
  const [montoEfectivo, setMontoEfectivo] = useState('');
  const [montoTransferencia, setMontoTransferencia] = useState('');
  const [montoDebito, setMontoDebito] = useState('');
  const [estadoPermuta, setEstadoPermuta] = useState('PENDIENTE');

  // Historial
  const [permutas, setPermutas] = useState<Permuta[]>([]);
  const [loading, setLoading] = useState(false);

  // Estado para SKU no encontrado
  const [skuNoEncontrado, setSkuNoEncontrado] = useState(false);
  const [buscandoSkuPermuta, setBuscandoSkuPermuta] = useState(false);

  // Variables para generar modelo2 y SKU
  const equipoVal = productoPermuta.equipo;
  const serieVal = productoPermuta.serie;
  const gbVal = productoPermuta.gb;
  const colorVal = productoPermuta.color;
  const condicionVal = productoPermuta.condicion;
  const modelo2Val = productoPermuta.modelo2;

  // Auto-generar modelo2
  useEffect(() => {
    const modelo2 = generarModelo2(equipoVal, serieVal, productoPermuta.modelo, gbVal, colorVal, condicionVal);
    setProductoPermuta(prev => prev.modelo2 !== modelo2 ? { ...prev, modelo2 } : prev);
  }, [equipoVal, serieVal, productoPermuta.modelo, gbVal, colorVal, condicionVal]);

  // Buscar SKU en MongoDB cuando cambia MODELO2
  useEffect(() => {
    const buscarSku = async () => {
      // Solo buscar si modelo2 tiene contenido significativo
      if (!modelo2Val || modelo2Val.trim().length < 5) {
        setProductoPermuta(prev => prev.sku !== '' ? { ...prev, sku: '' } : prev);
        setSkuNoEncontrado(false);
        return;
      }

      setBuscandoSkuPermuta(true);
      try {
        const response = await fetch(`/api/sku?modelo2=${encodeURIComponent(modelo2Val)}`);
        const data = await response.json();
        
        if (data.found && data.sku) {
          setProductoPermuta(prev => prev.sku !== data.sku ? { ...prev, sku: data.sku } : prev);
          setSkuNoEncontrado(false);
        } else {
          setProductoPermuta(prev => prev.sku !== '' ? { ...prev, sku: '' } : prev);
          setSkuNoEncontrado(true);
        }
      } catch (error) {
        console.error('Error buscando SKU:', error);
        setProductoPermuta(prev => prev.sku !== '' ? { ...prev, sku: '' } : prev);
        setSkuNoEncontrado(true);
      } finally {
        setBuscandoSkuPermuta(false);
      }
    };

    // Debounce para evitar muchas llamadas
    const timeoutId = setTimeout(buscarSku, 300);
    return () => clearTimeout(timeoutId);
  }, [modelo2Val]);

  // Variables para concatenación
  const imei1Val = productoPermuta.imei1;
  const imei2Val = productoPermuta.imei2;

  // Auto-generar concatenación
  useEffect(() => {
    const concatenacion = generarConcatenacion(imei1Val, imei2Val);
    setProductoPermuta(prev => prev.concatenacion !== concatenacion ? { ...prev, concatenacion } : prev);
  }, [imei1Val, imei2Val]);

  // Auto-completar valorPermuta con costo (siempre sincroniza mientras no se edite manualmente)
  const costoVal = productoPermuta.costo;
  const [valorPermutaEditado, setValorPermutaEditado] = useState(false);
  
  useEffect(() => {
    if (costoVal && !valorPermutaEditado) {
      setProductoPermuta(prev => ({ ...prev, valorPermuta: costoVal }));
    }
  }, [costoVal, valorPermutaEditado]);

  // Función para actualizar valorPermuta manualmente
  const updateValorPermuta = useCallback((valor: string) => {
    setValorPermutaEditado(true);
    setProductoPermuta(prev => ({ ...prev, valorPermuta: valor }));
  }, []);

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
      toast.warning('Debe buscar y seleccionar un producto a vender');
      return false;
    }

    if (!productoPermuta.equipo || !productoPermuta.serie || !productoPermuta.condicion) {
      toast.warning('Complete los campos obligatorios del producto en permuta');
      return false;
    }

    if (!productoPermuta.valorPermuta || extraerNumero(productoPermuta.valorPermuta) <= 0) {
      toast.warning('Ingrese el valor de permuta');
      return false;
    }

    if (!persona || !persona._id) {
      toast.warning('Debe seleccionar o crear una persona para la permuta');
      return false;
    }

    if (!productoPermuta.valorPermuta || extraerNumero(productoPermuta.valorPermuta) <= 0) {
      toast.warning('Ingrese el valor de permuta');
      return false;
    }

    const diferencia = calcularDiferencia();
    const tipoTransaccion = getTipoTransaccion();

    // Validar pago si hay diferencia
    if (tipoTransaccion !== 'EMPATE') {
      const saldoPendiente = calcularSaldoPendiente();
      if (saldoPendiente > 0) {
        toast.warning(`Falta cubrir ${saldoPendiente.toLocaleString('es-CL')} de la ${tipoTransaccion === 'CLIENTE_PAGA' ? 'diferencia' : 'devolución'}`);
        return false;
      }
    }

    setLoading(true);

    try {
      // 1. Registrar producto del cliente en inventario
      const correlativo = generarCorrelativo();
      const modelo2 = `${productoPermuta.equipo} ${productoPermuta.serie} ${productoPermuta.gb} GB ${productoPermuta.color} ${productoPermuta.condicion}`.toUpperCase();
      // Usar el SKU del estado (ya fue buscado en la API)
      const sku = productoPermuta.sku;

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
        proveedor: persona?.nombre || '', // El cliente/persona es el proveedor
        personaId: persona?._id,
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
        personaId: persona?._id,
        nombreCliente: persona?.nombre || '',
        correoCliente: persona?.correo || '',
        telefonoCliente: persona?.telefono || '',
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
        toast.success('¡Permuta registrada exitosamente!');
        resetFormulario();
        fetchPermutas();
        return true;
      } else {
        throw new Error('Error al registrar permuta');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al registrar la permuta');
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
    setPersona(null);
    setMontoEfectivo('');
    setMontoTransferencia('');
    setMontoDebito('');
    setEstadoPermuta('PENDIENTE');
    setValorPermutaEditado(false);
    setSkuNoEncontrado(false);
    setBuscandoSkuPermuta(false);
  };

  return {
    // Producto permuta
    productoPermuta,
    updateProductoPermuta,
    updateValorPermuta,
    // Búsqueda
    skuBusqueda,
    setSkuBusqueda,
    productoVenta,
    setProductoVenta,
    buscando,
    errorBusqueda,
    buscarProductoPorSku,
    // Persona unificada
    persona,
    setPersona,
    // Pago
    montoEfectivo,
    setMontoEfectivo: handleSetMontoEfectivo,
    montoTransferencia,
    setMontoTransferencia: handleSetMontoTransferencia,
    montoDebito,
    setMontoDebito: handleSetMontoDebito,
    estadoPermuta,
    setEstadoPermuta,
    // SKU lookup
    skuNoEncontrado,
    buscandoSkuPermuta,
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
