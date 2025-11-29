"use client";

import { LayoutDashboard, ShoppingCart, Package, RefreshCw, PackagePlus, Store } from 'lucide-react';

interface MenuItem {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

interface SidebarProps {
  activeModule: string;
  onChangeModule: (module: string) => void;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'ingresos', icon: PackagePlus, label: 'Ingresos/Compras' },
  { id: 'pos', icon: ShoppingCart, label: 'Punto de Venta' },
  { id: 'inventario', icon: Package, label: 'Inventario' },
  { id: 'permutas', icon: RefreshCw, label: 'Permutas' },
];

export default function Sidebar({ activeModule, onChangeModule }: SidebarProps) {
  return (
    <aside className="w-[280px] bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-r border-[#1E293B] h-screen overflow-y-auto flex flex-col fixed left-0 top-0">
      
      {/* Header */}
      <div className="px-8 pt-8 pb-8 flex items-center gap-4 border-b border-[#1E293B]">
        <Store size={32} className="text-[#0EA5E9] flex-shrink-0" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] bg-clip-text text-transparent tracking-[2px]">
          ELEPHONE
        </h2>
      </div>

      {/* Spacer para separar el título del Dashboard */}
      <div className="h-20" aria-hidden="true" />

      {/* Navigation */}
      <nav className="flex-1 px-6 pt-16 pb-10 flex flex-col gap-10">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeModule(item.id)}
              className={`
                flex items-center gap-4 px-4 py-3.5 rounded-xl
                transition-all duration-200 font-medium text-[15px] text-left
                ${isActive 
                  ? 'bg-gradient-to-r from-[#0EA5E933] to-transparent text-[#0EA5E9] border-l-[3px] border-[#0EA5E9]' 
                  : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#0EA5E9] hover:translate-x-1'
                }
              `}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className="p-5 m-4 bg-[#0EA5E910] border border-[#0EA5E933] rounded-xl">
        <h4 className="text-sm mb-3 text-[#0EA5E9] font-semibold">⚡ Atajos</h4>
        <div className="space-y-2 text-[13px] text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-0.5 bg-[#1E293B] border border-[#334155] rounded text-[11px] font-mono">
              Ctrl+N
            </kbd>
            <span>Nueva Compra</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-0.5 bg-[#1E293B] border border-[#334155] rounded text-[11px] font-mono">
              Ctrl+V
            </kbd>
            <span>Nueva Venta</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-0.5 bg-[#1E293B] border border-[#334155] rounded text-[11px] font-mono">
              F2
            </kbd>
            <span>Buscar</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
