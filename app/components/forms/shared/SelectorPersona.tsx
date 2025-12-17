"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, UserPlus, X, Check, User, Upload, FileText, Trash2 } from 'lucide-react';
import { Persona } from '@/app/types/producto';

interface SelectorPersonaProps {
  persona: Persona | null;
  onPersonaChange: (persona: Persona | null) => void;
  roles?: ('CLIENTE' | 'PROVEEDOR')[];
  titulo?: string;
  showDocumentos?: boolean;
}

const PERSONA_VACIA: Persona = {
  nombre: '',
  correo: '',
  telefono: '',
  direccion: '',
  documentos: [],
  roles: ['CLIENTE'],
};

export default function SelectorPersona({
  persona,
  onPersonaChange,
  roles = ['CLIENTE'],
  titulo = 'Datos de la Persona',
  showDocumentos = true,
}: SelectorPersonaProps) {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<Persona[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [modoCrear, setModoCrear] = useState(false);
  const [nuevaPersona, setNuevaPersona] = useState<Persona>({ ...PERSONA_VACIA, roles });
  const [guardando, setGuardando] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Buscar personas
  const buscarPersonas = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResultados([]);
      return;
    }

    setBuscando(true);
    try {
      const response = await fetch(`/api/personas?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setResultados(data);
        setMostrarResultados(true);
      }
    } catch (error) {
      console.error('Error al buscar personas:', error);
    } finally {
      setBuscando(false);
    }
  }, []);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (busqueda && !persona) {
        buscarPersonas(busqueda);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [busqueda, persona, buscarPersonas]);

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

  // Seleccionar persona existente
  const seleccionarPersona = (p: Persona) => {
    onPersonaChange(p);
    setBusqueda('');
    setMostrarResultados(false);
    setModoCrear(false);
  };

  // Limpiar selección
  const limpiarSeleccion = () => {
    onPersonaChange(null);
    setBusqueda('');
    setNuevaPersona({ ...PERSONA_VACIA, roles });
  };

  // Crear nueva persona
  const crearPersona = async () => {
    if (!nuevaPersona.nombre || nuevaPersona.nombre.length < 2) {
      return;
    }
    if (!nuevaPersona.telefono || nuevaPersona.telefono.length < 8) {
      return;
    }

    setGuardando(true);
    try {
      const response = await fetch('/api/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevaPersona, roles }),
      });

      if (response.ok) {
        const data = await response.json();
        onPersonaChange(data.data);
        setModoCrear(false);
        setNuevaPersona({ ...PERSONA_VACIA, roles });
      }
    } catch (error) {
      console.error('Error al crear persona:', error);
    } finally {
      setGuardando(false);
    }
  };

  // Actualizar campo de nueva persona
  const updateNuevaPersona = (campo: keyof Persona, valor: string | string[]) => {
    setNuevaPersona(prev => ({ ...prev, [campo]: valor }));
  };

  // Manejar subida de documentos
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    const newDocs: string[] = [...nuevaPersona.documentos];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSize) {
        continue; // Saltar archivos mayores a 5MB
      }

      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      newDocs.push(base64);
    }

    updateNuevaPersona('documentos', newDocs);
    e.target.value = ''; // Reset input
  };

  // Eliminar documento
  const removeDocumento = (index: number) => {
    const newDocs = nuevaPersona.documentos.filter((_, i) => i !== index);
    updateNuevaPersona('documentos', newDocs);
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <User className="text-[#0ea5e9]" size={24} />
        {titulo}
      </h2>

      {/* Persona seleccionada */}
      {persona && persona._id ? (
        <div className="bg-[#0f172a] border border-[#0ea5e9] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0ea5e9] rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{persona.nombre}</p>
                <p className="text-slate-400 text-sm">
                  {persona.telefono} {persona.correo && `• ${persona.correo}`}
                </p>
                {persona.direccion && (
                  <p className="text-slate-500 text-xs">{persona.direccion}</p>
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
        /* Formulario para crear nueva persona */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                NOMBRE <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nuevaPersona.nombre}
                onChange={(e) => updateNuevaPersona('nombre', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                TELÉFONO <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={nuevaPersona.telefono}
                onChange={(e) => updateNuevaPersona('telefono', e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="+56 9 1234 5678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">CORREO</label>
              <input
                type="email"
                value={nuevaPersona.correo}
                onChange={(e) => updateNuevaPersona('correo', e.target.value.toLowerCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">DIRECCIÓN</label>
              <input
                type="text"
                value={nuevaPersona.direccion}
                onChange={(e) => updateNuevaPersona('direccion', e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="Dirección"
              />
            </div>
          </div>

          {/* Input para documentos */}
          {showDocumentos && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                DOCUMENTOS
              </label>
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0f172a] border border-dashed border-[#334155] rounded-lg text-slate-400 hover:border-[#0ea5e9] hover:text-[#0ea5e9] cursor-pointer transition-colors">
                  <Upload size={18} />
                  <span>Subir documentos (máx. 5MB c/u)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Lista de documentos subidos */}
                {nuevaPersona.documentos.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {nuevaPersona.documentos.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg"
                      >
                        <FileText size={16} className="text-[#0ea5e9]" />
                        <span className="text-white text-sm">
                          Documento {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeDocumento(index)}
                          className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setModoCrear(false);
                setNuevaPersona({ ...PERSONA_VACIA, roles });
              }}
              className="flex-1 px-4 py-3 bg-[#334155] hover:bg-[#475569] text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={crearPersona}
              disabled={guardando || !nuevaPersona.nombre || !nuevaPersona.telefono}
              className="flex-1 px-4 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check size={18} />
              {guardando ? 'Guardando...' : 'Guardar Persona'}
            </button>
          </div>
        </div>
      ) : (
        /* Buscador de personas */
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onFocus={() => busqueda.length >= 2 && setMostrarResultados(true)}
              className="w-full pl-12 pr-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              placeholder="Buscar por nombre, teléfono o correo..."
            />
            {buscando && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-[#0ea5e9] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Dropdown de resultados */}
          {mostrarResultados && (
            <div className="absolute z-10 w-full mt-2 bg-[#1e293b] border border-[#334155] rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {resultados.length > 0 ? (
                resultados.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => seleccionarPersona(p)}
                    className="w-full px-4 py-3 text-left hover:bg-[#334155] transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-[#334155] rounded-full flex items-center justify-center">
                      <User size={16} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm">{p.nombre}</p>
                      <p className="text-slate-500 text-xs">{p.telefono}</p>
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

          {/* Botón para crear nueva persona */}
          <button
            type="button"
            onClick={() => {
              setModoCrear(true);
              setMostrarResultados(false);
              // Pre-llenar con la búsqueda si parece un nombre
              if (busqueda && !/^\d+$/.test(busqueda)) {
                setNuevaPersona(prev => ({ ...prev, nombre: busqueda.toUpperCase() }));
              }
            }}
            className="mt-3 w-full px-4 py-3 bg-[#334155] hover:bg-[#475569] text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            Crear Nueva Persona
          </button>
        </div>
      )}
    </div>
  );
}
