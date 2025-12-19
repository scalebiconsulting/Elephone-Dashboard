import { ObjectId } from 'mongodb';

// Interface para datos del proveedor
export interface ProveedorData {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  documentos: string[]; // base64 strings
}

// Interface para cuotas de pago prorrateado
export interface CuotaPagoSchema {
  numero: number;
  monto: number;
  fechaVencimiento: string;
  montoEfectivo: number;
  montoTransferencia: number;
  referenciaTransferencia?: string;
  fechaPago?: string;
  estado: 'PENDIENTE' | 'PAGADO';
}

// Interface para gestionar el pago al proveedor
export interface PagoProveedorSchema {
  estado: 'PAGADO' | 'PENDIENTE' | 'PARCIAL';
  esProrrateado: boolean;
  // Para pago inmediato
  montoEfectivo: number;
  montoTransferencia: number;
  referenciaTransferencia?: string;
  fechaPago?: string;
  // Para pago prorrateado
  cuotas: CuotaPagoSchema[];
  // Totales
  totalPagado: number;
  saldoPendiente: number;
}

export interface Producto {
  _id?: ObjectId;
  // Sección 1 - Identificación
  equipo: string;
  modelo: string;
  color: string;
  subModelo: string;
  serie: string;
  gb: number;
  condicion: string;
  modelo2: string; // Generado dinámicamente
  // Sección 2 - Detalles de Compra
  sku: string;
  condicionBateria: number;
  costo: number;
  proveedor: ProveedorData;
  fechaCompra: string;
  // Sección 3 - Observaciones
  observacion?: string;
  fallaMacOnline?: string;
  garantiaCompra?: string;
  // Sección 4 - Estado del Equipo
  block: boolean;
  datosEquipos: string;
  numeroSerie: string;
  imei1: string;
  imei2: string;
  concatenacion: string; // IMEI1;IMEI2
  // Sección 5 - Inventario
  estado: string;
  fecha: string;
  metodoPago: string[];
  // Sección 5.1 - Pago a Proveedor
  pagoProveedor?: PagoProveedorSchema;
  // Sección 6 - Precios
  repuesto: number;
  pvpEfectivo: number;
  pvpCredito: number;
  utilidad: number;
  utilidad2: number;
  tresPorCiento: number;
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaces FormCompra y MatrizProducto eliminadas - no se usaban
