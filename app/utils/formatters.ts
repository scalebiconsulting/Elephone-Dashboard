// Funciones de formateo

/**
 * Formatea un valor a pesos chilenos (CLP)
 * @param valor - String con el valor a formatear
 * @returns String formateado con separadores de miles
 */
export const formatoPesosChilenos = (valor: string): string => {
  const numero = valor.replace(/\D/g, '');
  return numero ? parseInt(numero).toLocaleString('es-CL') : '';
};

/**
 * Extrae el valor numérico de un string formateado
 * @param valor - String formateado (ej: "1.234.567")
 * @returns Número sin formato
 */
export const extraerNumero = (valor: string): number => {
  return parseInt(valor.replace(/\D/g, '')) || 0;
};

/**
 * Formatea un número como moneda CLP
 * @param valor - Número a formatear
 * @returns String con formato de moneda chilena
 */
export const formatCLP = (valor: number): string => {
  return valor ? `$${valor.toLocaleString('es-CL')}` : '$0';
};

/**
 * Calcula la utilidad (ingresos - gastos)
 * @param pvp - Precio de venta
 * @param costo - Costo del producto
 * @param repuesto - Costo de repuestos
 * @returns String formateado con la utilidad
 */
export const calcularUtilidad = (pvp: string, costo: string, repuesto: string): string => {
  const pvpNum = extraerNumero(pvp);
  const costoNum = extraerNumero(costo);
  const repuestoNum = extraerNumero(repuesto);
  
  const utilidad = pvpNum - repuestoNum - costoNum;
  
  if (pvpNum > 0 || repuestoNum > 0 || costoNum > 0) {
    return utilidad >= 0 
      ? utilidad.toLocaleString('es-CL') 
      : `-${Math.abs(utilidad).toLocaleString('es-CL')}`;
  }
  return '';
};
