"use client";

import { useState, useCallback } from 'react';
import { formatoPesosChilenos } from '@/app/utils/formatters';

/**
 * Hook reutilizable para manejar inputs de dinero con formato CLP
 * @param initialValue - Valor inicial (string formateado o vacío)
 * @returns [value, handleChange, setValue, reset] - Valor actual, handler formateado, setter directo, reset
 */
export function useMoneyInput(initialValue: string = '') {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((input: string) => {
    setValue(formatoPesosChilenos(input));
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return [value, handleChange, setValue, reset] as const;
}
