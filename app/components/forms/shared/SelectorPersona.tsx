"use client";

import { useState, useEffect, useCallback } from 'react';
import { X, Check, User, Upload, FileText, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
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
  run: '',
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
  const [nuevaPersona, setNuevaPersona] = useState<Persona>({ ...PERSONA_VACIA, roles });
  const [guardando, setGuardando] = useState(false);
  const [buscandoRun, setBuscandoRun] = useState(false);
  const [runEncontrado, setRunEncontrado] = useState(false);

  // Buscar persona por RUN
  const buscarPorRun = useCallback(async (run: string) => {
    if (run.length < 8) {
      setRunEncontrado(false);
      return;
    }

    setBuscandoRun(true);
    try {
      const response = await fetch(`/api/personas?q=${encodeURIComponent(run)}`);
      if (response.ok) {
        const data = await response.json();
        const personaEncontrada = data.find((p: Persona) => 
          p.run?.replace(/[.-]/g, '') === run.replace(/[.-]/g, '')
        );
        
        if (personaEncontrada) {
          // Limpiar documentos de búsquedas anteriores
          setNuevaPersona({ ...personaEncontrada, documentos: [] });
          setRunEncontrado(true);
        } else {
          setRunEncontrado(false);
        }
      }
    } catch (error) {
      console.error('Error al buscar por RUN:', error);
      setRunEncontrado(false);
    } finally {
      setBuscandoRun(false);
    }
  }, []);

  // Debounce para búsqueda por RUN
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nuevaPersona.run && !persona) {
        buscarPorRun(nuevaPersona.run);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [nuevaPersona.run, persona, buscarPorRun]);

  // Limpiar selección
  const limpiarSeleccion = () => {
    onPersonaChange(null);
    setNuevaPersona({ ...PERSONA_VACIA, roles });
    setRunEncontrado(false);
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
        setNuevaPersona({ ...PERSONA_VACIA, roles });
        setRunEncontrado(false);
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
        <div className="bg-[#0f172a] border border-[#0ea5e9] rounded-lg p-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0ea5e9] rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{persona.nombre}</p>
                <p className="text-slate-400 text-sm">
                  RUN: {persona.run} • {persona.telefono}
                </p>
                {persona.correo && (
                  <p className="text-slate-500 text-xs">{persona.correo}</p>
                )}
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
      ) : (
        /* Formulario para crear/editar persona */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                RUN <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nuevaPersona.run}
                  onChange={(e) => updateNuevaPersona('run', e.target.value)}
                  className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                  placeholder="12.345.678-9"
                  maxLength={12}
                />
                {buscandoRun && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 size={18} className="text-[#0ea5e9] animate-spin" />
                  </div>
                )}
                {!buscandoRun && runEncontrado && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle2 size={18} className="text-green-400" />
                  </div>
                )}
              </div>
              {runEncontrado && (
                <p className="text-green-400 text-xs mt-1">✓ Persona encontrada en base de datos</p>
              )}
            </div>
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
              <label className="block text-sm font-medium text-slate-400 mb-2">CORREO <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={nuevaPersona.correo}
                onChange={(e) => updateNuevaPersona('correo', e.target.value.toLowerCase())}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-400 mb-2">DIRECCIÓN <span className="text-red-500">*</span></label>
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
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-3 py-2 bg-[#0f172a] border border-dashed border-[#334155] rounded-lg text-slate-400 hover:border-[#0ea5e9] hover:text-[#0ea5e9] cursor-pointer transition-colors text-sm">
                  <Upload size={16} />
                  <span>Subir documentos</span>
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
                        className="flex items-center gap-2 px-2 py-1 bg-[#0f172a] border border-[#334155] rounded-lg"
                      >
                        <FileText size={14} className="text-[#0ea5e9]" />
                        <span className="text-white text-xs">
                          Doc {index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeDocumento(index)}
                          className="p-0.5 text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

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
              onClick={crearPersona}
              disabled={guardando || !nuevaPersona.nombre || !nuevaPersona.run || !nuevaPersona.telefono}
              className="px-4 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              <Check size={16} />
              {guardando ? 'Guardando...' : 'Guardar Persona'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
