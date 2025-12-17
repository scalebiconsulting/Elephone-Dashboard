import { ObjectId } from 'mongodb';

export interface Persona {
  _id?: ObjectId;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  documentos: string[]; // base64 strings
  roles: ('CLIENTE' | 'PROVEEDOR')[];
  createdAt?: Date;
  updatedAt?: Date;
}
