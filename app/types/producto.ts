// Tipos para el formulario de productos

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
  proveedor: string;
  observacion?: string;
  fallaMacOnline?: string;
  garantiaCompra?: string;
  block: boolean;
  datosEquipos: string;
  fecha: string;
  metodoPago: string[];
  repuesto: number;
  tresPorCiento: number;
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
  proveedor: string;
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
  setProveedor: (value: string) => void;
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
}
