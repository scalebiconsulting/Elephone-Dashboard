"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Building2, X, Check } from 'lucide-react';
import { Empresa } from '@/lib/models/Empresa';

interface SelectorEmpresaProps {
  empresa: Empresa | null;
  onEmpresaChange: (empresa: Empresa | null) => void;
  titulo?: string;
}

const EMPRESA_VACIA: Empresa = {
  razonSocial: '',
  rut: '',
  correo: '',
  telefono: '',
  tipoDocumento: 'FACTURA',
  numeroDocumento: '',
};

export default function SelectorEmpresa({
  empresa,
  onEmpresaChange,
  titulo = 'Datos de la Empresa',
}: SelectorEmpresaProps) {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<Empresa[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [modoCrear, setModoCrear] = useState(true);
  const [nuevaEmpresa, setNuevaEmpresa] = useState<Empresa>(EMPRESA_VACIA);
  const [guardando, setGuardando] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Buscar empresas
  const buscarEmpresas = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResultados([]);
      return;
    }

    setBuscando(true);
    try {
      const response = await fetch(`/api/empresas?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setResultados(data);
        setMostrarResultados(true);
      }
    } catch (error) {
      console.error('Error al buscar empresas:', error);
    } finally {
      setBuscando(false);
    }
  }, []);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (busqueda && !empresa) {
        buscarEmpresas(busqueda);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [busqueda, empresa, buscarEmpresas]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMostrarResultados(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Seleccionar empresa existente
  const seleccionarEmpresa = (e: Empresa) => {
    onEmpresaChange(e);
    setBusqueda('');
    setMostrarResultados(false);
    setModoCrear(false);
  };

  // Limpiar selección
  const limpiarSeleccion = () => {
    onEmpresaChange(null);
    setBusqueda('');
    setNuevaEmpresa(EMPRESA_VACIA);
  };

  // Crear nueva empresa
  const crearEmpresa = async () => {
    if (!nuevaEmpresa.razonSocial || nuevaEmpresa.razonSocial.length < 2) {
      return;
    }
    if (!nuevaEmpresa.rut || nuevaEmpresa.rut.length < 8) {
      return;
    }
    if (!nuevaEmpresa.telefono || nuevaEmpresa.telefono.length < 8) {
      return;
    }

    setGuardando(true);
    try {
      const response = await fetch('/api/empresas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaEmpresa),
      });

      if (response.ok) {
        const data = await response.json();
        onEmpresaChange(data.data);
        setModoCrear(false);
        setNuevaEmpresa(EMPRESA_VACIA);
      }
    } catch (error) {
      console.error('Error al crear empresa:', error);
    } finally {
      setGuardando(false);
    }
  };

  // Actualizar campo de nueva empresa
  const updateNuevaEmpresa = (campo: keyof Empresa, valor: string | string[]) => {
    setNuevaEmpresa(prev => ({ ...prev, [campo]: valor }));
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Building2 className="text-[#10b981]" size={24} />
        {titulo}
      </h2>

      {/* Empresa seleccionada */}
      {empresa && empresa._id ? (
        <div className="bg-[#0f172a] border border-[#10b981] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center">
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{empresa.razonSocial}</p>
                <p className="text-slate-400 text-sm">
                  RUT: {empresa.rut} • {empresa.telefono}
                </p>
                {empresa.correo && (
                  <p className="text-slate-500 text-xs">{empresa.correo}</p>
                )}
                {empresa.numeroDocumento && (
                  <p className="text-slate-500 text-xs">
                    {empresa.tipoDocumento === 'FACTURA' ? 'Factura' : 'Guía'} #{empresa.numeroDocumento}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={limpiarSeleccion}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : modoCrear ? (
        /* Formulario para crear nueva empresa */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                RAZÓN SOCIAL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nuevaEmpresa.razonSocial}
                onChange={(e) => updateNuevaEmpresa('razonSocial', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
                placeholder="RAZÓN SOCIAL DE LA EMPRESA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                RUT <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nuevaEmpresa.rut}
                onChange={(e) => updateNuevaEmpresa('rut', e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
                placeholder="12345678-9"
                maxLength={12}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                TELÉFONO <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={nuevaEmpresa.telefono}
                onChange={(e) => updateNuevaEmpresa('telefono', e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
                placeholder="+56 9 1234 5678"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-400 mb-2">EMAIL</label>
              <input
                type="email"
                value={nuevaEmpresa.correo}
                onChange={(e) => updateNuevaEmpresa('correo', e.target.value.toLowerCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
                placeholder="contacto@empresa.cl"
              />
            </div>
          </div>

          {/* Tipo y número de documento */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              DOCUMENTO DE COMPRA
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={nuevaEmpresa.tipoDocumento || 'FACTURA'}
                onChange={(e) => updateNuevaEmpresa('tipoDocumento', e.target.value as 'FACTURA' | 'GUIA')}
                className="px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
              >
                <option value="FACTURA">Factura</option>
                <option value="GUIA">Guía de Despacho</option>
              </select>
              <input
                type="text"
                value={nuevaEmpresa.numeroDocumento || ''}
                onChange={(e) => updateNuevaEmpresa('numeroDocumento', e.target.value)}
                className="px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
                placeholder="Número (ej: 12345)"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setModoCrear(false);
                setNuevaEmpresa(EMPRESA_VACIA);
              }}
              className="flex-1 px-4 py-3 bg-[#334155] hover:bg-[#475569] text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={crearEmpresa}
              disabled={guardando || !nuevaEmpresa.razonSocial || !nuevaEmpresa.rut || !nuevaEmpresa.telefono}
              className="flex-1 px-4 py-3 bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check size={18} />
              {guardando ? 'Guardando...' : 'Guardar Empresa'}
            </button>
          </div>
        </div>
      ) : (
        /* Buscador de empresas */
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onFocus={() => busqueda.length >= 2 && setMostrarResultados(true)}
              className="w-full pl-12 pr-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
              placeholder="Buscar por razón social, RUT o teléfono..."
            />
            {buscando && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Dropdown de resultados */}
          {mostrarResultados && (
            <div className="absolute z-10 w-full mt-2 bg-[#1e293b] border border-[#334155] rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {resultados.length > 0 ? (
                resultados.map((e) => (
                  <button
                    key={String(e._id)}
                    type="button"
                    onClick={() => seleccionarEmpresa(e)}
                    className="w-full px-4 py-3 text-left hover:bg-[#334155] transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-[#334155] rounded-full flex items-center justify-center">
                      <Building2 size={16} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm">{e.razonSocial}</p>
                      <p className="text-slate-500 text-xs">RUT: {e.rut}</p>
                    </div>
                  </button>
                ))
              ) : busqueda.length >= 2 ? (
                <div className="px-4 py-3 text-slate-400 text-sm">
                  No se encontraron resultados
                </div>
              ) : null}
            </div>
          )}

          {/* Botón para crear nueva empresa */}
          <button
            type="button"
            onClick={() => {
              setModoCrear(true);
              setMostrarResultados(false);
              // Pre-llenar con la búsqueda si existe
              if (busqueda) {
                setNuevaEmpresa(prev => ({ ...prev, razonSocial: busqueda.toUpperCase() }));
              }
            }}
            className="mt-3 w-full px-4 py-3 bg-[#334155] hover:bg-[#475569] text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Building2 size={18} />
            Crear Nueva Empresa
          </button>
        </div>
      )}
    </div>
  );
}
