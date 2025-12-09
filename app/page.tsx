"use client";

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import IngresosModule from './components/modules/IngresosModule';

export default function Home() {
  const [activeModule, setActiveModule] = useState('dashboard');

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
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">Punto de Venta</h1>
            <p className="text-slate-400">Módulo en construcción</p>
          </div>
        )}
        
        {activeModule === 'inventario' && (
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">Inventario</h1>
            <p className="text-slate-400">Módulo en construcción</p>
          </div>
        )}
        
        {activeModule === 'permutas' && (
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-4">Permutas</h1>
            <p className="text-slate-400">Módulo en construcción</p>
          </div>
        )}
      </main>
    </div>
  );
}
