"use client";

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import IngresosModule from './components/modules/IngresosModule';
import InventarioModule from './components/modules/InventarioModule';
import PuntoVentaModule from './components/modules/PuntoVentaModule';
import PermutaModule from './components/modules/PermutaModule';
import ReservasModule from './components/modules/ReservasModule';
import TallerClinicelModule from './components/modules/TallerClinicelModule';
import StockBodegaModule from './components/modules/StockBodegaModule';
import TransitoTallerModule from './components/modules/TransitoTallerModule';
import { ProductoInventario } from './types/producto';

export default function Home() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoInventario | null>(null);

  const handleSelectForSale = (producto: ProductoInventario) => {
    setProductoSeleccionado(producto);
    setActiveModule('pos');
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Sidebar activeModule={activeModule} onChangeModule={setActiveModule} />
      
      <main className="ml-64 p-8">
        {activeModule === 'dashboard' && (
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="text-slate-400">Vista de Dashboard (próximamente)</p>
          </div>
        )}
        
        {activeModule === 'ingresos' && <IngresosModule />}
        
        {activeModule === 'pos' && (
          <PuntoVentaModule 
            productoInicial={productoSeleccionado}
            onVolver={() => {
              setProductoSeleccionado(null);
              setActiveModule('inventario');
            }}
          />
        )}
        
        {activeModule === 'inventario' && (
          <InventarioModule 
            onSelectForSale={handleSelectForSale}
            onChangeModule={setActiveModule}
          />
        )}
        
        {activeModule === 'permutas' && <PermutaModule />}
        
        {activeModule === 'reservas' && <ReservasModule />}
        
        {activeModule === 'taller' && <TallerClinicelModule />}
        
        {activeModule === 'bodega' && <StockBodegaModule />}
        
        {activeModule === 'transito' && <TransitoTallerModule />}
      </main>
    </div>
  );
}