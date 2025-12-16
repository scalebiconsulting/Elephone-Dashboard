"use client";

import { useState, useCallback, useEffect } from 'react';
import { ProductoInventario } from '@/app/types/producto';
import { formatoPesosChilenos, extraerNumero, calcularUtilidad } from '@/app/utils/formatters';
import { toast } from '@/app/components/ui/Toast';

export interface ProductoEditableFields {
  estado: string;
  pvpEfectivo: string;
  pvpCredito: string;
  repuesto: string;
  condicionBateria: string;
  observacion: string;
  fallaMacOnline: string;
  garantiaCompra: string;
}

export interface UseEditarProductoReturn {
  // Estado del modal
  isOpen: boolean;
  producto: ProductoInventario | null;
  loading: boolean;
  
  // Campos editables
  campos: ProductoEditableFields;
  utilidad: string;
  utilidad2: string;
  
  // Acciones
  openModal: (producto: ProductoInventario) => void;
  closeModal: () => void;
  setCampo: <K extends keyof ProductoEditableFields>(field: K, value: string) => void;
  guardarCambios: () => Promise<boolean>;
}

export function useEditarProducto(onProductoActualizado?: () => void): UseEditarProductoReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [producto, setProducto] = useState<ProductoInventario | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Campos editables con valores formateados
  const [campos, setCampos] = useState<ProductoEditableFields>({
    estado: '',
    pvpEfectivo: '',
    pvpCredito: '',
    repuesto: '',
    condicionBateria: '',
    observacion: '',
    fallaMacOnline: '',
    garantiaCompra: '',
  });

  // Utilidades calculadas
  const [utilidad, setUtilidad] = useState('');
  const [utilidad2, setUtilidad2] = useState('');

  // Calcular utilidades cuando cambian los precios
  useEffect(() => {
    if (producto) {
      const costoFormateado = producto.costo.toLocaleString('es-CL');
      setUtilidad(calcularUtilidad(campos.pvpEfectivo, costoFormateado, campos.repuesto));
      setUtilidad2(calcularUtilidad(campos.pvpCredito, costoFormateado, campos.repuesto));
    }
  }, [campos.pvpEfectivo, campos.pvpCredito, campos.repuesto, producto]);

  // Abrir modal con datos del producto
  const openModal = useCallback((prod: ProductoInventario) => {
    setProducto(prod);
    setCampos({
      estado: prod.estado || '',
      pvpEfectivo: prod.pvpEfectivo ? prod.pvpEfectivo.toLocaleString('es-CL') : '',
      pvpCredito: prod.pvpCredito ? prod.pvpCredito.toLocaleString('es-CL') : '',
      repuesto: prod.repuesto ? prod.repuesto.toLocaleString('es-CL') : '',
      condicionBateria: prod.condicionBateria ? prod.condicionBateria.toString() : '',
      observacion: prod.observacion || '',
      fallaMacOnline: prod.fallaMacOnline || '',
      garantiaCompra: prod.garantiaCompra || '',
    });
    setIsOpen(true);
  }, []);

  // Cerrar modal
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setProducto(null);
    setCampos({
      estado: '',
      pvpEfectivo: '',
      pvpCredito: '',
      repuesto: '',
      condicionBateria: '',
      observacion: '',
      fallaMacOnline: '',
      garantiaCompra: '',
    });
  }, []);

  // Actualizar un campo específico
  const setCampo = useCallback(<K extends keyof ProductoEditableFields>(field: K, value: string) => {
    setCampos(prev => {
      // Formatear campos de precio
      if (field === 'pvpEfectivo' || field === 'pvpCredito' || field === 'repuesto') {
        return { ...prev, [field]: formatoPesosChilenos(value) };
      }
      // Validar batería (0-100)
      if (field === 'condicionBateria') {
        const num = parseInt(value.replace(/\D/g, '')) || 0;
        return { ...prev, [field]: Math.min(100, Math.max(0, num)).toString() };
      }
      return { ...prev, [field]: value };
    });
  }, []);

  // Guardar cambios
  const guardarCambios = useCallback(async (): Promise<boolean> => {
    if (!producto) return false;
    
    setLoading(true);
    try {
      const datosActualizados = {
        estado: campos.estado,
        pvpEfectivo: extraerNumero(campos.pvpEfectivo),
        pvpCredito: extraerNumero(campos.pvpCredito),
        repuesto: extraerNumero(campos.repuesto),
        condicionBateria: parseInt(campos.condicionBateria) || 0,
        observacion: campos.observacion,
        fallaMacOnline: campos.fallaMacOnline,
        garantiaCompra: campos.garantiaCompra,
        // Recalcular utilidades
        utilidad: extraerNumero(utilidad),
        utilidad2: extraerNumero(utilidad2),
      };

      const response = await fetch(`/api/productos/${producto._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados),
      });

      const data = await response.json();

      if (data.success) {
        closeModal();
        if (onProductoActualizado) {
          onProductoActualizado();
        }
        return true;
      } else {
        toast.error('Error al actualizar: ' + data.error);
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
      return false;
    } finally {
      setLoading(false);
    }
  }, [producto, campos, utilidad, utilidad2, closeModal, onProductoActualizado]);

  return {
    isOpen,
    producto,
    loading,
    campos,
    utilidad,
    utilidad2,
    openModal,
    closeModal,
    setCampo,
    guardarCambios,
  };
}
