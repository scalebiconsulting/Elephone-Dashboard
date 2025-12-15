"use client";

import { useState } from 'react';
import { Copy, Check, FileSpreadsheet } from 'lucide-react';
import { extraerNumero } from '@/app/utils/formatters';

interface BasaleExportProps {
  sku: string;
  costo: string;
  concatenacion: string;
}

export default function BasaleExport({ sku, costo, concatenacion }: BasaleExportProps) {
  const [copied, setCopied] = useState(false);

  // Obtener costo sin formato (número puro)
  const costoSinFormato = extraerNumero(costo);
  
  // Stock siempre es 1
  const stock = 1;

  // Encabezados para Basale
  const encabezados = `SKU\tStock\tCosto Neto\tSerie`;
  
  // Generar texto para copiar (separado por tabs) - incluye encabezados
  const textoParaCopiar = `${encabezados}\n${sku}\t${stock}\t${costoSinFormato}\t${concatenacion}`;

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(textoParaCopiar);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = textoParaCopiar;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Verificar si hay datos suficientes para mostrar
  const tieneData = sku || costoSinFormato > 0 || concatenacion;

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <FileSpreadsheet className="text-emerald-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Exportar a Basale</h3>
            <p className="text-sm text-slate-400">Copia estos datos para pegar en tu planilla</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopiar}
          disabled={!tieneData}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 ${
            copied 
              ? 'bg-emerald-500 text-white' 
              : tieneData
                ? 'bg-[#334155] hover:bg-[#475569] text-white'
                : 'bg-[#334155]/50 text-slate-500 cursor-not-allowed'
          }`}
        >
          {copied ? (
            <>
              <Check size={16} />
              ¡Copiado!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copiar Todo
            </>
          )}
        </button>
      </div>

      {/* Tabla estilo Excel */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-[#334155] text-slate-300 text-xs font-semibold uppercase tracking-wider px-4 py-2 border border-[#475569] text-left">
                SKU
              </th>
              <th className="bg-[#334155] text-slate-300 text-xs font-semibold uppercase tracking-wider px-4 py-2 border border-[#475569] text-center w-20">
                Stock
              </th>
              <th className="bg-[#334155] text-slate-300 text-xs font-semibold uppercase tracking-wider px-4 py-2 border border-[#475569] text-right w-32">
                Costo Neto
              </th>
              <th className="bg-[#334155] text-slate-300 text-xs font-semibold uppercase tracking-wider px-4 py-2 border border-[#475569] text-left">
                Serie
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="bg-[#0f172a] text-white font-mono text-sm px-4 py-3 border border-[#475569]">
                {sku || <span className="text-slate-500 italic">—</span>}
              </td>
              <td className="bg-[#0f172a] text-white font-mono text-sm px-4 py-3 border border-[#475569] text-center">
                {stock}
              </td>
              <td className="bg-[#0f172a] text-white font-mono text-sm px-4 py-3 border border-[#475569] text-right">
                {costoSinFormato > 0 ? costoSinFormato : <span className="text-slate-500 italic">—</span>}
              </td>
              <td className="bg-[#0f172a] text-white font-mono text-sm px-4 py-3 border border-[#475569]">
                {concatenacion || <span className="text-slate-500 italic">—</span>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Preview del texto que se copiará */}
      {tieneData && (
        <div className="mt-4 p-3 bg-[#0f172a] rounded-lg border border-dashed border-[#475569]">
          <p className="text-xs text-slate-400 mb-1">Vista previa (separado por tabs):</p>
          <code className="text-xs text-emerald-400 font-mono break-all">
            {textoParaCopiar}
          </code>
        </div>
      )}
    </div>
  );
}
