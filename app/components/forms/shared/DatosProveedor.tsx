"use client";

import { useRef, useState } from 'react';
import { Upload, X, FileText, User } from 'lucide-react';

export interface ProveedorData {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  documentos: string[]; // base64 strings
}

interface DatosProveedorProps {
  proveedor: ProveedorData;
  onProveedorChange: (field: keyof ProveedorData, value: string | string[]) => void;
  showDocumentos?: boolean;
}

export default function DatosProveedor({
  proveedor,
  onProveedorChange,
  showDocumentos = true,
}: DatosProveedorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // Convertir archivo a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Manejar selección de archivos
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    try {
      const newDocumentos: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Limitar tamaño a 5MB por archivo
        if (file.size > 5 * 1024 * 1024) {
          alert(`El archivo ${file.name} excede 5MB`);
          continue;
        }
        const base64 = await fileToBase64(file);
        newDocumentos.push(base64);
      }

      onProveedorChange('documentos', [...proveedor.documentos, ...newDocumentos]);
    } catch (error) {
      console.error('Error al cargar archivos:', error);
      alert('Error al cargar archivos');
    } finally {
      setUploadingFiles(false);
      // Limpiar input para permitir subir el mismo archivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Eliminar documento
  const handleRemoveDocumento = (index: number) => {
    const newDocs = proveedor.documentos.filter((_, i) => i !== index);
    onProveedorChange('documentos', newDocs);
  };

  // Obtener nombre del archivo desde base64
  const getFileInfo = (base64: string) => {
    const match = base64.match(/^data:([^;]+);/);
    const mimeType = match ? match[1] : 'unknown';
    
    const typeMap: Record<string, string> = {
      'application/pdf': 'PDF',
      'image/jpeg': 'JPG',
      'image/png': 'PNG',
      'image/gif': 'GIF',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    };
    
    return typeMap[mimeType] || 'Archivo';
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <User className="text-[#0ea5e9]" size={24} />
        Datos del Proveedor
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            NOMBRE <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={proveedor.nombre}
            onChange={(e) => onProveedorChange('nombre', e.target.value.toUpperCase())}
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            placeholder="Nombre del proveedor"
          />
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">CORREO</label>
          <input
            type="email"
            value={proveedor.correo}
            onChange={(e) => onProveedorChange('correo', e.target.value.toLowerCase())}
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            placeholder="correo@ejemplo.com"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">TELÉFONO</label>
          <input
            type="tel"
            value={proveedor.telefono}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              onProveedorChange('telefono', value);
            }}
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            placeholder="+56 9 1234 5678"
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">DIRECCIÓN</label>
          <input
            type="text"
            value={proveedor.direccion}
            onChange={(e) => onProveedorChange('direccion', e.target.value.toUpperCase())}
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            placeholder="Dirección del proveedor"
          />
        </div>
      </div>

      {/* Sección de Documentos */}
      {showDocumentos && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            DOCUMENTOS (Facturas, Boletas, etc.)
          </label>
          
          {/* Input oculto para archivos */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Botón de subir */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFiles}
              className="flex items-center gap-2 px-4 py-3 bg-[#0f172a] border border-dashed border-[#334155] rounded-lg text-slate-400 hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition-colors disabled:opacity-50"
            >
              <Upload size={18} />
              {uploadingFiles ? 'Cargando...' : 'Subir documento'}
            </button>

            {/* Lista de documentos subidos */}
            {proveedor.documentos.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg"
              >
                <FileText size={16} className="text-[#0ea5e9]" />
                <span className="text-white text-sm">
                  {getFileInfo(doc)} #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveDocumento(index)}
                  className="text-red-400 hover:text-red-300 ml-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-slate-500 mt-2">
            Formatos: PDF, JPG, PNG, DOC, DOCX. Máximo 5MB por archivo.
          </p>
        </div>
      )}
    </div>
  );
}
