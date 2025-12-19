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
  { value: 'TALLER CLINICEL', label: 'TALLER CLINICEL' },
  { value: 'STOCK BODEGA', label: 'STOCK BODEGA' },
  { value: 'TRANSITO A TALLER', label: 'TRANSITO A TALLER' },
] as const;

export const OPCIONES_BLOCK = [
  { value: '', label: 'Seleccionar...' },
  { value: 'NO', label: 'NO' },
  { value: 'SI', label: 'SI' },
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

export const ESTADOS_RESERVA = [
  { value: 'PENDIENTE', label: 'Pendiente', color: 'bg-yellow-500' },
  { value: 'PRODUCTO_DISPONIBLE', label: 'Producto Disponible', color: 'bg-green-500' },
  { value: 'COMPLETADA', label: 'Completada', color: 'bg-blue-500' },
  { value: 'CANCELADA', label: 'Cancelada', color: 'bg-red-500' },
] as const;

// Estados de pago al proveedor
export const ESTADOS_PAGO_PROVEEDOR = [
  { value: 'PAGADO', label: 'Pagado', color: 'bg-green-500' },
  { value: 'PENDIENTE', label: 'Pendiente', color: 'bg-yellow-500' },
  { value: 'PARCIAL', label: 'Pago Parcial', color: 'bg-orange-500' },
] as const;

// Métodos de pago al proveedor (solo efectivo y transferencia)
export const METODOS_PAGO_PROVEEDOR = ['EFECTIVO', 'TRANSFERENCIA'] as const;

// Valores por defecto del formulario
export const VALORES_INICIALES = {
  estado: '',
  block: 'NO',
} as const;
