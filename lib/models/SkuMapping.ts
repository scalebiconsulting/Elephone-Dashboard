import { ObjectId } from 'mongodb';

// Interface para el mapeo SKU-MODELO2
export interface SkuMapping {
  _id?: ObjectId;
  sku: string;           // Código único (ej: "IPH11-BA-MO64NU00001")
  modelo2: string;       // Nombre completo (ej: "IPHONE 11 64 GB MORADO NUEVO")
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para respuesta de búsqueda
export interface SkuLookupResult {
  found: boolean;
  sku: string | null;
  modelo2: string;
}

// Interface para carga masiva
export interface SkuBulkItem {
  sku: string;
  modelo2: string;
}
