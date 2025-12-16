"use client";

interface MontoInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md';
}

export default function MontoInput({
  label,
  value,
  onChange,
  placeholder = "0",
  size = 'sm',
}: MontoInputProps) {
  const paddingClass = size === 'sm' ? 'pl-5 pr-2 py-2' : 'pl-8 pr-4 py-3';
  const textClass = size === 'sm' ? 'text-sm' : 'text-base';
  const labelClass = size === 'sm' ? 'text-xs' : 'text-sm';
  const prefixClass = size === 'sm' ? 'text-xs left-2' : 'text-sm left-3';

  return (
    <div>
      <label className={`block ${labelClass} text-slate-400 mb-1`}>{label}</label>
      <div className="relative">
        <span className={`absolute ${prefixClass} top-1/2 -translate-y-1/2 text-slate-400`}>$</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${paddingClass} bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9] ${textClass}`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
