"use client";

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Notification from './components/Notification';
import DashboardModule from './components/modules/DashboardModule';
import IngresosModule from './components/modules/IngresosModule';
import InventarioModule from './components/modules/InventarioModule';
import POSModule from './components/modules/POSModule';
import PermutasModule from './components/modules/PermutasModule';
import ModalHistorial from './components/modals/ModalHistorial';
import { Producto, Notification as NotificationType, MetodoPago, FormCompra } from '@/lib/types';
import { STOCK_PRODUCTOS_INICIAL, MATRIZ_PRODUCTOS, PRECIOS_PERMUTAS, PROVEEDORES } from '@/lib/data';

export default function Home() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [productos, setProductos] = useState<Producto[]>(STOCK_PRODUCTOS_INICIAL);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [showHistorial, setShowHistorial] = useState(false);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        setActiveModule('ingresos');
      }
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        setActiveModule('pos');
      }
      if (e.key === 'F2') {
        e.preventDefault();
        setActiveModule('inventario');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
  };

  const agregarProducto = (formCompra: FormCompra) => {
    const matrizItem = MATRIZ_PRODUCTOS.find(m => m.codigo === formCompra.skuBase);
    if (!matrizItem) return;

    const nuevoId = Math.max(...productos.map(p => p.id)) + 1;
    const timestamp = Date.now().toString().slice(-5);
    const condicionAbrev = matrizItem.condicion === 'NUEVO' ? 'NU' :
                          matrizItem.condicion === 'OPENBOX' ? 'OP' : 'SE';
    
    const nuevoProducto: Producto = {
      id: nuevoId,
      sku: `${formCompra.skuBase}${condicionAbrev}${timestamp}`,
      equipo: matrizItem.categoria,
      modelo: matrizItem.modelo,
      color: matrizItem.color,
      gb: matrizItem.gb,
      condicion: matrizItem.condicion,
      bateria: formCompra.bateria,
      costo: parseFloat(formCompra.costo),
      precioEfectivo: parseFloat(formCompra.precioEfectivo),
      precioCredito: parseFloat(formCompra.precioCredito),
      utilidad: parseFloat(formCompra.precioEfectivo) - parseFloat(formCompra.costo),
      estado: 'DISPONIBLE',
      ubicacion: formCompra.ubicacion,
      imei: formCompra.imei,
      proveedor: formCompra.proveedor,
      fechaCompra: new Date().toISOString().split('T')[0]
    };

    setProductos([...productos, nuevoProducto]);
    showNotification(`✅ Producto agregado: ${nuevoProducto.modelo}`, 'success');
  };

  const venderProducto = (productosVendidos: Producto[], metodoPago: MetodoPago) => {
    const productosActualizados = productos.map(p => {
      const vendido = productosVendidos.find(pv => pv.id === p.id);
      if (vendido) {
        return {
          ...p,
          estado: 'VENDIDO' as const,
          ubicacion: null,
          fechaVenta: new Date().toISOString().split('T')[0],
          metodoPago
        };
      }
      return p;
    });

    setProductos(productosActualizados);
  };

  const verHistorial = (producto: Producto) => {
    setSelectedProduct(producto);
    setShowHistorial(true);
  };

  return (
    <div className="flex h-screen bg-[#0F172A] text-[#E2E8F0]">
      {/* Sidebar */}
      <Sidebar activeModule={activeModule} onChangeModule={setActiveModule} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col min-w-0 ml-[280px]">
        {/* Header */}
        <header className="h-20 bg-[#1E293B] border-b border-[#334155] px-8 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#F1F5F9]">
              {activeModule === 'dashboard' && 'Dashboard'}
              {activeModule === 'ingresos' && 'Registro de Ingresos'}
              {activeModule === 'pos' && 'Punto de Venta'}
              {activeModule === 'inventario' && 'Gestión de Inventario'}
              {activeModule === 'permutas' && 'Calculadora de Permutas'}
            </h1>
            <p className="text-[14px] text-[#64748B] mt-0.5">
              {productos.filter(p => p.estado === 'DISPONIBLE').length} productos disponibles
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[12px] text-[#64748B]">Stock Valorizado</p>
              <strong className="text-[18px] font-bold text-[#10B981]">
                ${(productos.filter(p => p.estado === 'DISPONIBLE').reduce((sum, p) => sum + p.costo, 0) / 1000000).toFixed(1)}M
              </strong>
            </div>
          </div>
        </header>

        {/* Module Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeModule === 'dashboard' && (
            <DashboardModule productos={productos} />
          )}
          {activeModule === 'ingresos' && (
            <IngresosModule
              matriz={MATRIZ_PRODUCTOS}
              proveedores={PROVEEDORES}
              onAgregarProducto={agregarProducto}
              onShowNotification={showNotification}
            />
          )}
          {activeModule === 'pos' && (
            <POSModule
              productos={productos}
              onProcesarVenta={venderProducto}
              onShowNotification={showNotification}
            />
          )}
          {activeModule === 'inventario' && (
            <InventarioModule
              productos={productos}
              onVerHistorial={verHistorial}
              onVenderProducto={(producto) => venderProducto([producto], 'TRANSFERENCIA')}
              onShowNotification={showNotification}
            />
          )}
          {activeModule === 'permutas' && (
            <PermutasModule
              matriz={MATRIZ_PRODUCTOS}
              preciosPermutas={PRECIOS_PERMUTAS}
              onShowNotification={showNotification}
            />
          )}
        </main>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Modal Historial */}
      {showHistorial && selectedProduct && (
        <ModalHistorial
          producto={selectedProduct}
          onClose={() => setShowHistorial(false)}
        />
      )}
    </div>
  );
}
