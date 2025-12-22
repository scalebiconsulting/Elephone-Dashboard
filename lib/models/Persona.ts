import { ObjectId } from 'mongodb';

export interface Persona {
  _id?: string | ObjectId;
  nombre: string;
  run: string; // Rol Único Nacional (Chile)
  correo: string;
  telefono: string;
  direccion: string;
  documentos: string[]; // base64 strings
  roles: ('CLIENTE' | 'PROVEEDOR')[];
  createdAt?: Date;
  updatedAt?: Date;
}
