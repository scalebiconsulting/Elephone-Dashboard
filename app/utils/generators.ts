// Funciones generadoras

/**
 * Genera un correlativo UUID corto de 6 caracteres alfanuméricos
 * @returns String de 6 caracteres (A-Z, 0-9)
 */
export const generarCorrelativo = (): string => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let resultado = '';
  for (let i = 0; i < 6; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
};

/**
 * Genera el SKU del producto
 * @param equipo - Nombre del equipo
 * @param serie - Serie del equipo
 * @param subModelo - Sub modelo
 * @param color - Color
 * @param gb - Capacidad en GB
 * @param condicion - Condición del producto
 * @param correlativo - Correlativo UUID
 * @returns SKU generado
 */
export const generarSKU = (
  equipo: string,
  serie: string,
  subModelo: string,
  color: string,
  gb: string,
  condicion: string,
  correlativo: string
): string => {
  const equipoPart = equipo.slice(0, 3);
  const seriePart = serie;
  const subModeloPart = subModelo.slice(0, 2);
  const colorPart = color.slice(0, 2);
  const gbPart = gb;
  const condicionPart = condicion.slice(0, 2);
  
  if (equipoPart || seriePart || subModeloPart || colorPart || gbPart || condicionPart) {
    return `${equipoPart}${seriePart}-${subModeloPart}-${colorPart}${gbPart}${condicionPart}-${correlativo}`;
  }
  return '';
};

/**
 * Genera el MODELO2 concatenando los valores del producto
 * @param equipo - Nombre del equipo
 * @param serie - Serie
 * @param modelo - Modelo
 * @param gb - Capacidad en GB
 * @param color - Color
 * @param condicion - Condición
 * @returns MODELO2 generado
 */
export const generarModelo2 = (
  equipo: string,
  serie: string,
  modelo: string,
  gb: string,
  color: string,
  condicion: string
): string => {
  const gbConSufijo = gb ? `${gb} GB` : '';
  return [equipo, serie, modelo, gbConSufijo, color, condicion]
    .filter(val => val.trim() !== '')
    .join(' ');
};

/**
 * Genera la concatenación de IMEIs
 * @param imei1 - IMEI 1
 * @param imei2 - IMEI 2
 * @returns Concatenación en formato "IMEI1;IMEI2"
 */
export const generarConcatenacion = (imei1: string, imei2: string): string => {
  if (imei1 || imei2) {
    return `${imei1};${imei2}`;
  }
  return '';
};
