"use client";

import { LayoutDashboard, ShoppingCart, ShoppingBag, Package, RefreshCw, CalendarClock } from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onChangeModule: (module: string) => void;
}

export default function Sidebar({ activeModule, onChangeModule }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ingresos', label: 'Ingresos/Compras', icon: ShoppingCart },
    { id: 'pos', label: 'Punto de Venta', icon: ShoppingBag },
    { id: 'inventario', label: 'Inventario', icon: Package },
    { id: 'permutas', label: 'Permutas', icon: RefreshCw },
    { id: 'reservas', label: 'Reservas', icon: CalendarClock },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1e293b] border-r border-[#334155] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#334155]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0ea5e9] rounded-lg flex items-center justify-center">
            <Package className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold text-[#0ea5e9]">ELEPHONE</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onChangeModule(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 text-left
                    ${isActive 
                      ? 'bg-[#0ea5e9]/10 text-[#0ea5e9] border-l-4 border-[#0ea5e9]' 
                      : 'text-[#94a3b8] hover:bg-[#334155] hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
