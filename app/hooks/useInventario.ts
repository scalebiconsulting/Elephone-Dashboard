"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ProductoInventario } from '@/app/types/producto';

export interface UseInventarioReturn {
  // Estado
  productos: ProductoInventario[];
  loading: boolean;
  searchTerm: string;
  filtroEquipo: string;
  filtroCondicion: string;
  filtroEstado: string;
  
  // Datos calculados
  productosFiltrados: ProductoInventario[];
  productosEnStock: ProductoInventario[];
  totalProductos: number;
  valorInventario: number;
  equiposUnicos: string[];
  condicionesUnicas: string[];
  estadosUnicos: string[];
  
  // Acciones
  setSearchTerm: (value: string) => void;
  setFiltroEquipo: (value: string) => void;
  setFiltroCondicion: (value: string) => void;
  setFiltroEstado: (value: string) => void;
  fetchProductos: () => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}

export function useInventario(): UseInventarioReturn {
  const [productos, setProductos] = useState<ProductoInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEquipo, setFiltroEquipo] = useState('');
  const [filtroCondicion, setFiltroCondicion] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  // Cargar productos
  const fetchProductos = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // Filtrar productos
  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const matchSearch = 
        producto.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.modelo2?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.imei1?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchEquipo = !filtroEquipo || producto.equipo === filtroEquipo;
      const matchCondicion = !filtroCondicion || producto.condicion === filtroCondicion;
      const matchEstado = !filtroEstado || producto.estado === filtroEstado;

      return matchSearch && matchEquipo && matchCondicion && matchEstado;
    });
  }, [productos, searchTerm, filtroEquipo, filtroCondicion, filtroEstado]);

  // Productos en stock
  const productosEnStock = useMemo(() => {
    return productosFiltrados.filter(p => p.estado === 'STOCK OFICINA');
  }, [productosFiltrados]);

  // Estadísticas
  const totalProductos = productosEnStock.length;
  const valorInventario = useMemo(() => {
    return productosEnStock.reduce((sum, p) => sum + (p.costo || 0), 0);
  }, [productosEnStock]);

  // Valores únicos para filtros
  const equiposUnicos = useMemo(() => {
    return [...new Set(productos.map(p => p.equipo).filter(Boolean))];
  }, [productos]);

  const condicionesUnicas = useMemo(() => {
    return [...new Set(productos.map(p => p.condicion).filter(Boolean))];
  }, [productos]);

  const estadosUnicos = useMemo(() => {
    return [...new Set(productos.map(p => p.estado).filter(Boolean))];
  }, [productos]);

  // Eliminar producto
  const handleDelete = useCallback(async (id: string) => {
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
  }, [fetchProductos]);

  return {
    // Estado
    productos,
    loading,
    searchTerm,
    filtroEquipo,
    filtroCondicion,
    filtroEstado,
    
    // Datos calculados
    productosFiltrados,
    productosEnStock,
    totalProductos,
    valorInventario,
    equiposUnicos,
    condicionesUnicas,
    estadosUnicos,
    
    // Acciones
    setSearchTerm,
    setFiltroEquipo,
    setFiltroCondicion,
    setFiltroEstado,
    fetchProductos,
    handleDelete,
  };
}
