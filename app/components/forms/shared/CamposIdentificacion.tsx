"use client";

import { CONDICIONES_PRODUCTO } from '@/app/constants/opciones';

interface CamposIdentificacionProps {
  values: {
    equipo: string;
    modelo: string;
    color: string;
    subModelo: string;
    serie: string;
    gb: string;
    condicion: string;
    modelo2?: string;
    sku?: string;
  };
  onChange: (campo: string, valor: string) => void;
  showNumbers?: boolean;
  showModelo2?: boolean;
  showSku?: boolean;
}

export default function CamposIdentificacion({
  values,
  onChange,
  showNumbers = false,
  showModelo2 = true,
  showSku = false,
}: CamposIdentificacionProps) {
  const label = (num: number, text: string, required = false) => (
    <label className="block text-sm font-medium text-slate-400 mb-2">
      {showNumbers ? `${num}. ` : ''}{text} {required && <span className="text-red-500">*</span>}
    </label>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        {label(1, 'EQUIPO', true)}
        <input
          type="text"
          value={values.equipo}
          onChange={(e) => onChange('equipo', e.target.value.toUpperCase())}
          className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
          placeholder="iPhone"
        />
      </div>

      <div>
        {label(2, 'MODELO', true)}
        <input
          type="text"
          value={values.modelo}
          onChange={(e) => {
            const value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
            onChange('modelo', value);
          }}
          className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
          placeholder="Pro Max"
        />
      </div>

      <div>
        {label(3, 'COLOR', true)}
        <input
          type="text"
          value={values.color}
          onChange={(e) => onChange('color', e.target.value.toUpperCase())}
          className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
          placeholder="Titanio Natural"
        />
      </div>

      <div>
        {label(4, 'SUB MODELO')}
        <input
          type="text"
          value={values.subModelo}
          onChange={(e) => onChange('subModelo', e.target.value.toUpperCase())}
          className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
          placeholder="pro"
        />
      </div>

      <div>
        {label(5, 'SERIE', true)}
        <input
          type="text"
          value={values.serie}
          onChange={(e) => onChange('serie', e.target.value.toUpperCase())}
          className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
          placeholder="15"
        />
      </div>

      <div>
        {label(6, 'GB', true)}
        <div className="relative">
          <input
            type="text"
            value={values.gb}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              onChange('gb', value);
            }}
            className="w-full px-4 py-3 pr-12 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
            placeholder="256"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none">
            GB
          </span>
        </div>
      </div>

      <div>
        {label(7, 'CONDICIÓN', true)}
        <select
          value={values.condicion}
          onChange={(e) => onChange('condicion', e.target.value)}
          className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
        >
          {CONDICIONES_PRODUCTO.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {showModelo2 && (
        <div>
          {label(8, 'MODELO2 (Auto)')}
          <input
            type="text"
            value={values.modelo2 || ''}
            readOnly
            className="w-full px-4 py-3 bg-[#0f172a]/50 border border-[#0ea5e9] rounded-lg text-white font-semibold cursor-not-allowed"
            placeholder="Generado automáticamente"
          />
        </div>
      )}

      {showSku && (
        <div className="lg:col-span-2">
          {label(9, 'SKU (Auto)')}
          <input
            type="text"
            value={values.sku || ''}
            readOnly
            className="w-full px-4 py-3 bg-[#0f172a]/50 border border-[#0ea5e9] rounded-lg text-white font-semibold cursor-not-allowed"
            placeholder="Generado automáticamente"
          />
        </div>
      )}
    </div>
  );
}
