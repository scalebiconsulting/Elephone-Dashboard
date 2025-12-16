// Constantes para opciones de formularios

export const CONDICIONES_PRODUCTO = [
  { value: '', label: 'Seleccionar...' },
  { value: 'NUEVO', label: 'NUEVO' },
  { value: 'SEMINUEVO', label: 'SEMINUEVO' },
  { value: 'OPENBOX', label: 'OPENBOX' },
  { value: 'REACONDICIONADO', label: 'REACONDICIONADO' },
] as const;

export const ESTADOS_INVENTARIO = [
  { value: '', label: 'Seleccionar...' },
  { value: 'STOCK OFICINA', label: 'STOCK OFICINA' },
  { value: 'EN TALLER CLINICEL', label: 'EN TALLER CLINICEL' },
  { value: 'VENDIDO', label: 'VENDIDO' },
  { value: 'REPUESTO', label: 'REPUESTO' },
] as const;

export const OPCIONES_BLOCK = [
  { value: '', label: 'Seleccionar...' },
  { value: 'NO', label: 'NO' },
  { value: 'SI', label: 'SI' },
] as const;

export const OPCIONES_DATOS_EQUIPOS = [
  { value: '', label: 'Seleccionar...' },
  { value: 'NO DATOS', label: 'NO DATOS' },
  { value: 'SI DATOS', label: 'SI DATOS' },
] as const;

export const METODOS_PAGO = [
  'TRANSFERENCIA',
  'CREDITO',
  'EFECTIVO',
  'PERMUTA',
  'EQUIPO BLOCK',
] as const;

export const ESTADOS_VENTA = [
  'PENDIENTE',
  'PAGADO',
  'ENTREGADO',
  'ANULADO',
] as const;

export const ESTADOS_PERMUTA = [
  'PENDIENTE',
  'COMPLETADA',
  'ANULADA',
] as const;

// Valores por defecto del formulario
export const VALORES_INICIALES = {
  estado: '',
  block: 'NO',
  datosEquipos: 'NO DATOS',
} as const;
