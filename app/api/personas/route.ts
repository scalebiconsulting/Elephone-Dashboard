import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Persona } from '@/lib/models/Persona';

const DB_NAME = 'elephone';
const COLLECTION_NAME = 'personas';

// GET - Listar todas las personas o buscar por nombre/teléfono
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const busqueda = searchParams.get('q');
    const rol = searchParams.get('rol');

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<Persona>(COLLECTION_NAME);

    let query: Record<string, unknown> = {};

    // Búsqueda por nombre o teléfono
    if (busqueda) {
      query = {
        $or: [
          { nombre: { $regex: busqueda, $options: 'i' } },
          { telefono: { $regex: busqueda, $options: 'i' } },
          { correo: { $regex: busqueda, $options: 'i' } },
        ],
      };
    }

    // Filtrar por rol
    if (rol) {
      query.roles = rol;
    }

    const personas = await collection
      .find(query)
      .sort({ nombre: 1 })
      .limit(50)
      .toArray();

    return NextResponse.json(personas);
  } catch (error) {
    console.error('Error al obtener personas:', error);
    return NextResponse.json(
      { error: 'Error al obtener personas' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva persona
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validaciones
    if (!body.nombre || body.nombre.trim().length < 2) {
      return NextResponse.json(
        { error: 'El nombre es requerido (mínimo 2 caracteres)' },
        { status: 400 }
      );
    }

    if (!body.telefono || body.telefono.trim().length < 8) {
      return NextResponse.json(
        { error: 'El teléfono es requerido (mínimo 8 dígitos)' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<Persona>(COLLECTION_NAME);

    // Verificar si ya existe por teléfono
    const existente = await collection.findOne({ telefono: body.telefono });
    if (existente) {
      // Si existe, actualizar roles si es necesario
      const nuevosRoles = [...new Set([...existente.roles, ...(body.roles || ['CLIENTE'])])];
      await collection.updateOne(
        { _id: existente._id },
        { 
          $set: { 
            roles: nuevosRoles,
            updatedAt: new Date(),
            // Actualizar otros campos si vienen
            ...(body.nombre && { nombre: body.nombre }),
            ...(body.correo && { correo: body.correo }),
            ...(body.direccion && { direccion: body.direccion }),
          }
        }
      );
      const actualizada = await collection.findOne({ _id: existente._id });
      return NextResponse.json({ 
        success: true, 
        data: actualizada,
        message: 'Persona actualizada'
      });
    }

    // Crear nueva persona
    const nuevaPersona: Omit<Persona, '_id'> = {
      nombre: body.nombre.toUpperCase(),
      correo: body.correo || '',
      telefono: body.telefono,
      direccion: body.direccion?.toUpperCase() || '',
      documentos: body.documentos || [],
      roles: body.roles || ['CLIENTE'],
      run: body.run || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(nuevaPersona as Persona);

    return NextResponse.json({
      success: true,
      data: { ...nuevaPersona, _id: result.insertedId },
      message: 'Persona creada exitosamente',
    });
  } catch (error) {
    console.error('Error al crear persona:', error);
    return NextResponse.json(
      { error: 'Error al crear persona' },
      { status: 500 }
    );
  }
}
