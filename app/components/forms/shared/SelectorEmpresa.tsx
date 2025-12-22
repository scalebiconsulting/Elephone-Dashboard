"use client";

import { useState, useEffect, useCallback } from 'react';
import { X, Check, Building2, Loader2, CheckCircle2 } from 'lucide-react';
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
  const [nuevaEmpresa, setNuevaEmpresa] = useState<Empresa>(EMPRESA_VACIA);
  const [guardando, setGuardando] = useState(false);
  const [buscandoRut, setBuscandoRut] = useState(false);
  const [rutEncontrado, setRutEncontrado] = useState(false);

  // Buscar empresa por RUT
  const buscarPorRut = useCallback(async (rut: string) => {
    if (rut.length < 8) {
      setRutEncontrado(false);
      return;
    }

    setBuscandoRut(true);
    try {
      const response = await fetch(`/api/empresas?q=${encodeURIComponent(rut)}`);
      if (response.ok) {
        const data = await response.json();
        const empresaEncontrada = data.find((e: Empresa) => 
          e.rut?.replace(/[.-]/g, '') === rut.replace(/[.-]/g, '')
        );
        
        if (empresaEncontrada) {
          // Limpiar documentos de búsquedas anteriores
          setNuevaEmpresa({ ...empresaEncontrada, documentos: [] });
          setRutEncontrado(true);
        } else {
          setRutEncontrado(false);
        }
      }
    } catch (error) {
      console.error('Error al buscar por RUT:', error);
      setRutEncontrado(false);
    } finally {
      setBuscandoRut(false);
    }
  }, []);

  // Debounce para búsqueda por RUT
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nuevaEmpresa.rut && !empresa) {
        buscarPorRut(nuevaEmpresa.rut);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [nuevaEmpresa.rut, empresa, buscarPorRut]);

  // Limpiar selección
  const limpiarSeleccion = () => {
    onEmpresaChange(null);
    setNuevaEmpresa(EMPRESA_VACIA);
    setRutEncontrado(false);
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
        setNuevaEmpresa(EMPRESA_VACIA);
        setRutEncontrado(false);
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
        <div className="bg-[#0f172a] border border-[#10b981] rounded-lg p-4 max-w-2xl">
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
      ) : (
        /* Formulario para crear/editar empresa */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                RUT <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nuevaEmpresa.rut}
                  onChange={(e) => updateNuevaEmpresa('rut', e.target.value)}
                  className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
                  placeholder="12345678-9"
                  maxLength={12}
                />
                {buscandoRut && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 size={18} className="text-[#10b981] animate-spin" />
                  </div>
                )}
                {!buscandoRut && rutEncontrado && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle2 size={18} className="text-green-400" />
                  </div>
                )}
              </div>
              {rutEncontrado && (
                <p className="text-green-400 text-xs mt-1">✓ Empresa encontrada en base de datos</p>
              )}
            </div>
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

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                limpiarSeleccion();
              }}
              className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white rounded-lg transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={crearEmpresa}
              disabled={guardando || !nuevaEmpresa.razonSocial || !nuevaEmpresa.rut || !nuevaEmpresa.telefono}
              className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              <Check size={16} />
              {guardando ? 'Guardando...' : 'Guardar Empresa'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
