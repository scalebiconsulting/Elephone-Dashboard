// Tipos para el formulario de productos
import type { ProveedorData } from '@/lib/models/Producto';
import type { Persona } from '@/lib/models/Persona';

// Re-exportar Persona desde el modelo central (evita duplicación)
export type { Persona };

// Interface para cuotas de pago prorrateado
export interface CuotaPago {
  numero: number;
  monto: number;
  fechaVencimiento: string;
  // Pago de la cuota (puede ser mixto efectivo + transferencia)
  montoEfectivo: number;
  montoTransferencia: number;
  referenciaTransferencia?: string;
  fechaPago?: string;
  estado: 'PENDIENTE' | 'PAGADO';
}

// Interface para gestionar el pago al proveedor
export interface PagoProveedor {
  estado: 'PAGADO' | 'PENDIENTE' | 'PARCIAL';
  esProrrateado: boolean;
  
  // Para pago inmediato (no prorrateado)
  montoEfectivo: number;
  montoTransferencia: number;
  referenciaTransferencia?: string;
  fechaPago?: string;
  
  // Para pago prorrateado
  cuotas: CuotaPago[];
  
  // Totales calculados
  totalPagado: number;
  saldoPendiente: number;
}

// Interface para producto del inventario (desde BD)
export interface ProductoInventario {
  _id: string;
  sku: string;
  modelo2: string;
  equipo: string;
  modelo: string;
  color: string;
  subModelo: string;
  serie: string;
  gb: number;
  condicion: string;
  costo: number;
  pvpEfectivo: number;
  pvpCredito: number;
  utilidad: number;
  utilidad2: number;
  estado: string;
  fechaCompra: string;
  condicionBateria: number;
  concatenacion: string;
  numeroSerie: string;
  imei1: string;
  imei2: string;
  proveedor: ProveedorData;
  observacion?: string;
  fallaMacOnline?: string;
  garantiaCompra?: string;
  block: boolean;
  datosEquipos: string;
  fecha: string;
  metodoPago: string[];
  repuesto: number;
  tresPorCiento: number;
  pagoProveedor?: PagoProveedor;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductoFormState {
  // Sección 1 - Identificación del Producto
  equipo: string;
  modelo: string;
  color: string;
  subModelo: string;
  serie: string;
  gb: string;
  condicion: string;
  modelo2: string;

  // Sección 2 - Detalles de Compra
  correlativo: string;
  sku: string;
  condicionBateria: string;
  costo: string;
  persona: Persona | null;
  fechaCompra: string;

  // Sección 3 - Observaciones
  observacion: string;
  fallaMacOnline: string;
  garantiaCompra: string;

  // Sección 4 - Estado del Equipo
  block: string;
  datosEquipos: string;
  numeroSerie: string;
  imei1: string;
  imei2: string;
  concatenacion: string;

  // Sección 5 - Inventario
  estado: string;
  fecha: string;
  metodoPago: string[];

  // Sección 6 - Precios
  repuesto: string;
  pvpEfectivo: string;
  pvpCredito: string;
  utilidad: string;
  utilidad2: string;
  tresPorCiento: string;

  // Estado de carga
  loading: boolean;
  
  // Estado de SKU lookup
  skuNoEncontrado: boolean;
  buscandoSku: boolean;
}

export interface ProductoFormActions {
  setEquipo: (value: string) => void;
  setModelo: (value: string) => void;
  setColor: (value: string) => void;
  setSubModelo: (value: string) => void;
  setSerie: (value: string) => void;
  setGb: (value: string) => void;
  setCondicion: (value: string) => void;
  setCondicionBateria: (value: string) => void;
  setCosto: (value: string) => void;
  setPersona: (persona: Persona | null) => void;
  setFechaCompra: (value: string) => void;
  setObservacion: (value: string) => void;
  setFallaMacOnline: (value: string) => void;
  setGarantiaCompra: (value: string) => void;
  setBlock: (value: string) => void;
  setDatosEquipos: (value: string) => void;
  setNumeroSerie: (value: string) => void;
  setImei1: (value: string) => void;
  setImei2: (value: string) => void;
  setEstado: (value: string) => void;
  setFecha: (value: string) => void;
  setRepuesto: (value: string) => void;
  setPvpEfectivo: (value: string) => void;
  setPvpCredito: (value: string) => void;
  setTresPorCiento: (value: string) => void;
  handleMetodoPagoToggle: (metodo: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export interface ProductoData {
  equipo: string;
  modelo: string;
  color: string;
  subModelo: string;
  serie: string;
  gb: number;
  condicion: string;
  modelo2: string;
  sku: string;
  condicionBateria: number;
  costo: number;
  proveedor: string;
  personaId?: string;
  fechaCompra: string;
  observacion: string;
  fallaMacOnline: string;
  garantiaCompra: string;
  block: boolean;
  datosEquipos: string;
  numeroSerie: string;
  imei1: string;
  imei2: string;
  concatenacion: string;
  estado: string;
  fecha: string;
  metodoPago: string[];
  repuesto: number;
  pvpEfectivo: number;
  pvpCredito: number;
  utilidad: number;
  utilidad2: number;
  tresPorCiento: number;
  pagoProveedor?: PagoProveedor;
}

// Interface para ventas
export interface Venta {
  _id?: string;
  productoId: string;
  sku: string;
  modelo2: string;
  nombreCliente: string;
  correoCliente: string;
  telefonoCliente: string;
  metodoPago: 'EFECTIVO' | 'CREDITO';
  precioVenta: number;
  utilidad: number;
  fechaVenta: string;
  estadoVenta: string;
  producto: ProductoInventario;
  createdAt?: Date;
}

// Interface para permutas
export interface Permuta {
  _id?: string;
  // Producto que sale (se vende)
  productoVendidoId: string;
  productoVendidoSku: string;
  productoVendidoModelo: string;
  precioVenta: number;
  // Producto que entra (permuta del cliente)
  productoPermutaId?: string;
  productoPermutaSku: string;
  productoPermutaModelo: string;
  valorPermuta: number;
  // Cálculos
  diferencia: number; // positivo = cliente paga, negativo = negocio devuelve
  tipoTransaccion: 'CLIENTE_PAGA' | 'NEGOCIO_DEVUELVE' | 'EMPATE';
  // Pago/Devolución
  montoEfectivo: number;
  montoTransferencia: number;
  montoDebito: number;
  // Cliente
  nombreCliente: string;
  correoCliente: string;
  telefonoCliente: string;
  // Metadata
  fechaPermuta: string;
  estadoPermuta: string;
  utilidad: number;
  createdAt?: Date;
}

// Interface para Reserva de producto
export interface Reserva {
  _id: string;
  // Producto esperado
  equipo: string;
  modelo: string;
  color: string;
  gb: string;
  condicion: string;
  precioAcordado: number;
  // Origen
  proveedor: ProveedorData;
  fechaEstimadaLlegada: string;
  // Cliente
  nombreCliente: string;
  correoCliente: string;
  telefonoCliente: string;
  // Abono/Seña
  montoSenaEfectivo: number;
  montoSenaTransferencia: number;
  montoSenaDebito: number;
  // Estado
  estadoReserva: 'PENDIENTE' | 'PRODUCTO_DISPONIBLE' | 'COMPLETADA' | 'CANCELADA';
  productoId?: string;
  // Metadata
  observaciones: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  createdAt?: Date;
  updatedAt?: Date;
}
