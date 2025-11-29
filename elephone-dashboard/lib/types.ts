// ==================== TIPOS TYPESCRIPT ====================

export type EstadoProducto = 'DISPONIBLE' | 'VENDIDO' | 'EN TALLER';
export type CondicionProducto = 'NUEVO' | 'OPENBOX' | 'SEMINUEVO';
export type MetodoPago = 'TRANSFERENCIA' | 'EFECTIVO' | 'CREDITO' | 'PERMUTA';
export type TipoBateria = 'CON_BATERIA' | 'CON_MAGIA';
export type Proveedor = 'FELIX' | 'TIENDA' | 'COLOMBIANO' | 'WLADIMIR' | 'MACARENA' | 'CHUCHO' | 'PERMUTA';

export interface Producto {
  id: number;
  sku: string;
  equipo: string;
  modelo: string;
  color: string;
  gb: string;
  condicion: CondicionProducto;
  bateria: number;
  costo: number;
  precioEfectivo: number;
  precioCredito: number;
  utilidad: number;
  estado: EstadoProducto;
  ubicacion: string | null;
  imei: string;
  proveedor: Proveedor;
  fechaCompra: string;
  fechaVenta?: string;
  metodoPago?: MetodoPago;
}

export interface MatrizProducto {
  codigo: string;
  nombre: string;
  categoria: string;
  modelo: string;
  color: string;
  gb: string;
  condicion: CondicionProducto;
}

export interface PrecioPermuta {
  modelo: string;
  costoBateria: number;
  precioBateria: number;
  costoMagia: number;
  precioMagia: number;
}

export interface Filtros {
  estado: EstadoProducto | 'TODOS';
  condicion: CondicionProducto | 'TODOS';
  ubicacion: string | 'TODOS';
  proveedor: Proveedor | 'TODOS';
}

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface FormCompra {
  skuBase: string;
  proveedor: Proveedor;
  imei: string;
  costo: string;
  precioEfectivo: string;
  precioCredito: string;
  bateria: number;
  ubicacion: string;
}

export interface Permuta {
  productoNuevo: Producto | null;
  modeloUsado: string;
  tipoBateria: TipoBateria;
  valorUsado: number;
  costoUsado: number;
  diferencia: number;
  metodoPago: MetodoPago;
}
