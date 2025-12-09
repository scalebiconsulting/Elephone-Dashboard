import { ObjectId } from 'mongodb';

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
  proveedor: string;
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
  // Sección 6 - Precios
  repuesto: number;
  pvpEfectivo: number;
  utilidad: number;
  utilidad2: number;
  tresPorCiento: number;
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FormCompra {
  skuBase: string;
  bateria: string;
  costo: string;
  precioEfectivo: string;
  precioCredito: string;
  ubicacion: string;
  imei: string;
  proveedor: string;
}

export interface MatrizProducto {
  codigo: string;
  categoria: string;
  modelo: string;
  color: string;
  gb: string;
  condicion: 'NUEVO' | 'OPENBOX' | 'SEMINUEVO';
}
