import { ObjectId } from 'mongodb';

export interface Empresa {
  _id?: string | ObjectId;
  razonSocial: string; // Razón Social de la empresa
  rut: string; // Rol Único Tributario (Chile)
  correo: string;
  telefono: string;
  tipoDocumento?: 'FACTURA' | 'GUIA'; // Tipo de documento de la compra
  numeroDocumento?: string; // Número de factura o guía
  createdAt?: Date;
  updatedAt?: Date;
}
