"use client";

import MontoInput from './MontoInput';

interface FormasPagoGridProps {
  montoEfectivo: string;
  setMontoEfectivo: (value: string) => void;
  montoTransferencia: string;
  setMontoTransferencia: (value: string) => void;
  montoDebito: string;
  setMontoDebito: (value: string) => void;
  size?: 'sm' | 'md';
  showDebito?: boolean;
}

export default function FormasPagoGrid({
  montoEfectivo,
  setMontoEfectivo,
  montoTransferencia,
  setMontoTransferencia,
  montoDebito,
  setMontoDebito,
  size = 'sm',
  showDebito = true,
}: FormasPagoGridProps) {
  return (
    <div className={`grid ${showDebito ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
      <MontoInput
        label="Efectivo"
        value={montoEfectivo}
        onChange={setMontoEfectivo}
        size={size}
      />
      <MontoInput
        label="Transferencia"
        value={montoTransferencia}
        onChange={setMontoTransferencia}
        size={size}
      />
      {showDebito && (
        <MontoInput
          label="Débito"
          value={montoDebito}
          onChange={setMontoDebito}
          size={size}
        />
      )}
    </div>
  );
}
