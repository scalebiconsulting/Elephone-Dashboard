"use client";

import { useState, useEffect, useCallback } from 'react';
import { ProductoFormState, ProductoFormActions, ProductoData, Persona } from '@/app/types/producto';
import { formatoPesosChilenos, extraerNumero, calcularUtilidad } from '@/app/utils/formatters';
import { generarCorrelativo, generarModelo2, generarConcatenacion } from '@/app/utils/generators';
import { VALORES_INICIALES } from '@/app/constants/opciones';

export interface UseProductoFormReturn extends ProductoFormState, ProductoFormActions {}

export function useProductoForm(): UseProductoFormReturn {
  // Sección 1 - Identificación del Producto
  const [equipo, setEquipo] = useState('');
  const [modelo, setModelo] = useState('');
  const [color, setColor] = useState('');
  const [subModelo, setSubModelo] = useState('');
  const [serie, setSerie] = useState('');
  const [gb, setGb] = useState('');
  const [condicion, setCondicion] = useState('');
  const [modelo2, setModelo2] = useState('');

  // Sección 2 - Detalles de Compra
  const [correlativo, setCorrelativo] = useState(() => generarCorrelativo());
  const [sku, setSku] = useState('');
  const [condicionBateria, setCondicionBateria] = useState('');
  const [costo, setCosto] = useState('');
  const [persona, setPersona] = useState<Persona | null>(null);
  const [fechaCompra, setFechaCompra] = useState('');

  // Sección 3 - Observaciones
  const [observacion, setObservacion] = useState('');
  const [fallaMacOnline, setFallaMacOnline] = useState('');
  const [garantiaCompra, setGarantiaCompra] = useState('');

  // Sección 4 - Estado del Equipo
  const [block, setBlock] = useState('');
  const [datosEquipos, setDatosEquipos] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [imei1, setImei1] = useState('');
  const [imei2, setImei2] = useState('');
  const [concatenacion, setConcatenacion] = useState('');

  // Sección 5 - Inventario
  const [estado, setEstado] = useState<string>(VALORES_INICIALES.estado);
  const [fecha, setFecha] = useState('');
  const [metodoPago, setMetodoPago] = useState<string[]>([]);

  // Sección 6 - Precios
  const [repuesto, setRepuesto] = useState('');
  const [pvpEfectivo, setPvpEfectivo] = useState('');
  const [pvpCredito, setPvpCredito] = useState('');
  const [utilidad, setUtilidad] = useState('');
  const [utilidad2, setUtilidad2] = useState('');
  const [tresPorCiento, setTresPorCiento] = useState('');

  const [loading, setLoading] = useState(false);
  const [skuNoEncontrado, setSkuNoEncontrado] = useState(false);
  const [buscandoSku, setBuscandoSku] = useState(false);

  // Limpiar campos de identificación cuando cambia el tipo de equipo
  useEffect(() => {
    if (equipo) {
      setModelo('');
      setColor('');
      setSubModelo('');
      setSerie('');
      setGb('');
      setCondicion('');
      setSku('');
      setSkuNoEncontrado(false);
    }
  }, [equipo]);

  // Limpiar modelo, GB y COLOR cuando cambia la serie (para iPhone)
  useEffect(() => {
    if (equipo === 'IPHONE' && serie) {
      setModelo('');
      setGb('');
      setColor('');
    }
  }, [serie, equipo]);

  // Limpiar GB y COLOR cuando cambia el modelo (para iPhone)
  useEffect(() => {
    if (equipo === 'IPHONE' && modelo !== undefined) {
      setGb('');
      setColor('');
    }
  }, [modelo, equipo]);

  // Limpiar gama (subModelo) cuando cambia el modelo (para Apple Watch y Accesorio)
  // Para Accesorio también limpiar serie y color ya que dependen del modelo
  useEffect(() => {
    if (equipo === 'APPLE WATCH' && modelo) {
      setSubModelo('');
      setGb('');
      setColor('');
      setCondicion('');
    }
    if (equipo === 'ACCESORIO' && modelo) {
      setSubModelo('');
      setSerie('');
      setColor('');
    }
  }, [modelo, equipo]);

  // Limpiar capacidad, color y condición cuando cambia la gama (para Apple Watch)
  useEffect(() => {
    if (equipo === 'APPLE WATCH' && subModelo) {
      setGb('');
      setColor('');
      setCondicion('');
    }
  }, [subModelo, equipo]);

  // Limpiar serie y color cuando cambia la gama (para Accesorio)
  useEffect(() => {
    if (equipo === 'ACCESORIO' && subModelo) {
      setSerie('');
      setColor('');
    }
  }, [subModelo, equipo]);

  // Limpiar color cuando cambia la serie (para Accesorio)
  useEffect(() => {
    if (equipo === 'ACCESORIO' && serie) {
      setColor('');
    }
  }, [serie, equipo]);

  // Limpiar color y condición cuando cambia la capacidad (para Apple Watch)
  useEffect(() => {
    if (equipo === 'APPLE WATCH' && gb) {
      setColor('');
      setCondicion('');
    }
  }, [gb, equipo]);

  // Generar MODELO2 dinámicamente según tipo de equipo
  useEffect(() => {
    setModelo2(generarModelo2(equipo, serie, modelo, subModelo, gb, color, condicion));
  }, [equipo, serie, modelo, subModelo, gb, color, condicion]);

  // Generar CONCATENACIÓN dinámicamente
  useEffect(() => {
    setConcatenacion(generarConcatenacion(imei1, imei2));
  }, [imei1, imei2]);

  // Buscar SKU en MongoDB cuando cambia MODELO2
  useEffect(() => {
    const buscarSku = async () => {
      // Solo buscar si modelo2 tiene contenido significativo
      if (!modelo2 || modelo2.trim().length < 5) {
        setSku('');
        setSkuNoEncontrado(false);
        return;
      }

      setBuscandoSku(true);
      try {
        const response = await fetch(`/api/sku?modelo2=${encodeURIComponent(modelo2)}`);
        const data = await response.json();
        
        if (data.found && data.sku) {
          setSku(data.sku);
          setSkuNoEncontrado(false);
        } else {
          setSku('');
          setSkuNoEncontrado(true);
        }
      } catch (error) {
        console.error('Error buscando SKU:', error);
        setSku('');
        setSkuNoEncontrado(true);
      } finally {
        setBuscandoSku(false);
      }
    };

    // Debounce para evitar muchas llamadas
    const timeoutId = setTimeout(buscarSku, 300);
    return () => clearTimeout(timeoutId);
  }, [modelo2]);

  // Calcular UTILIDAD dinámicamente
  useEffect(() => {
    setUtilidad(calcularUtilidad(pvpEfectivo, costo, repuesto));
  }, [pvpEfectivo, repuesto, costo]);

  // Calcular UTILIDAD2 dinámicamente
  useEffect(() => {
    setUtilidad2(calcularUtilidad(pvpCredito, costo, repuesto));
  }, [pvpCredito, costo, repuesto]);

  // Toggle método de pago
  const handleMetodoPagoToggle = useCallback((metodo: string) => {
    setMetodoPago(prev => 
      prev.includes(metodo) 
        ? prev.filter(m => m !== metodo) 
        : [...prev, metodo]
    );
  }, []);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setEquipo(''); setModelo(''); setColor(''); setSubModelo(''); setSerie('');
    setGb(''); setCondicion(''); setSku(''); setCondicionBateria('');
    setCosto(''); setPersona(null); 
    setFechaCompra(''); setObservacion('');
    setFallaMacOnline(''); setGarantiaCompra(''); setBlock(VALORES_INICIALES.block);
    setDatosEquipos(VALORES_INICIALES.datosEquipos); setNumeroSerie(''); 
    setImei1(''); setImei2('');
    setEstado(VALORES_INICIALES.estado); setFecha(''); setMetodoPago([]);
    setRepuesto(''); setPvpEfectivo(''); setPvpCredito(''); 
    setUtilidad(''); setUtilidad2(''); setTresPorCiento('');
    setCorrelativo(generarCorrelativo());
    setSkuNoEncontrado(false);
    setBuscandoSku(false);
  }, []);

  // Enviar formulario
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    try {
      const productoData: ProductoData = {
        equipo,
        modelo,
        color,
        subModelo,
        serie,
        gb: parseInt(gb) || 0,
        condicion,
        modelo2,
        sku,
        condicionBateria: parseInt(condicionBateria) || 0,
        costo: extraerNumero(costo),
        proveedor: persona?.nombre || '',
        personaId: persona?._id,
        fechaCompra,
        observacion,
        fallaMacOnline,
        garantiaCompra,
        block: block === 'SI',
        datosEquipos,
        numeroSerie,
        imei1,
        imei2,
        concatenacion,
        estado,
        fecha,
        metodoPago,
        repuesto: extraerNumero(repuesto),
        pvpEfectivo: extraerNumero(pvpEfectivo),
        pvpCredito: extraerNumero(pvpCredito),
        utilidad: extraerNumero(utilidad),
        utilidad2: extraerNumero(utilidad2),
        tresPorCiento: extraerNumero(tresPorCiento),
      };

      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData),
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Producto registrado exitosamente');
        resetForm();
      } else {
        alert('❌ Error al registrar producto: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  }, [
    equipo, modelo, color, subModelo, serie, gb, condicion, modelo2, sku,
    condicionBateria, costo, persona, fechaCompra, observacion, fallaMacOnline,
    garantiaCompra, block, datosEquipos, numeroSerie, imei1, imei2, concatenacion,
    estado, fecha, metodoPago, repuesto, pvpEfectivo, pvpCredito, utilidad,
    utilidad2, tresPorCiento, resetForm
  ]);

  // Wrappers con formateo para setters de precios
  const handleSetCosto = useCallback((value: string) => {
    setCosto(formatoPesosChilenos(value));
  }, []);

  const handleSetRepuesto = useCallback((value: string) => {
    setRepuesto(formatoPesosChilenos(value));
  }, []);

  const handleSetPvpEfectivo = useCallback((value: string) => {
    setPvpEfectivo(formatoPesosChilenos(value));
  }, []);

  const handleSetPvpCredito = useCallback((value: string) => {
    setPvpCredito(formatoPesosChilenos(value));
  }, []);

  const handleSetTresPorCiento = useCallback((value: string) => {
    setTresPorCiento(formatoPesosChilenos(value));
  }, []);

  return {
    // State
    equipo, modelo, color, subModelo, serie, gb, condicion, modelo2,
    correlativo, sku, condicionBateria, costo, persona, fechaCompra,
    observacion, fallaMacOnline, garantiaCompra, block, datosEquipos,
    numeroSerie, imei1, imei2, concatenacion, estado, fecha, metodoPago,
    repuesto, pvpEfectivo, pvpCredito, utilidad, utilidad2, tresPorCiento,
    loading, skuNoEncontrado, buscandoSku,

    // Actions
    setEquipo, setModelo, setColor, setSubModelo, setSerie, setGb, setCondicion,
    setCondicionBateria, 
    setCosto: handleSetCosto,
    setPersona, setFechaCompra,
    setObservacion, setFallaMacOnline, setGarantiaCompra, setBlock, setDatosEquipos,
    setNumeroSerie, setImei1, setImei2, setEstado, setFecha,
    setRepuesto: handleSetRepuesto,
    setPvpEfectivo: handleSetPvpEfectivo,
    setPvpCredito: handleSetPvpCredito,
    setTresPorCiento: handleSetTresPorCiento,
    handleMetodoPagoToggle, handleSubmit,
  };
}
