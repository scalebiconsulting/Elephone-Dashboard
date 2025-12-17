import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Persona } from '@/lib/models/Persona';

const DB_NAME = 'elephone';
const COLLECTION_NAME = 'personas';

// GET - Obtener persona por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<Persona>(COLLECTION_NAME);

    const persona = await collection.findOne({ _id: new ObjectId(id) });

    if (!persona) {
      return NextResponse.json(
        { error: 'Persona no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(persona);
  } catch (error) {
    console.error('Error al obtener persona:', error);
    return NextResponse.json(
      { error: 'Error al obtener persona' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar persona
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<Persona>(COLLECTION_NAME);

    const updateData = {
      ...(body.nombre && { nombre: body.nombre.toUpperCase() }),
      ...(body.correo !== undefined && { correo: body.correo }),
      ...(body.telefono && { telefono: body.telefono }),
      ...(body.direccion !== undefined && { direccion: body.direccion.toUpperCase() }),
      ...(body.documentos && { documentos: body.documentos }),
      ...(body.roles && { roles: body.roles }),
      updatedAt: new Date(),
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Persona no encontrada' },
        { status: 404 }
      );
    }

    const personaActualizada = await collection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      data: personaActualizada,
    });
  } catch (error) {
    console.error('Error al actualizar persona:', error);
    return NextResponse.json(
      { error: 'Error al actualizar persona' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar persona
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<Persona>(COLLECTION_NAME);

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Persona no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Persona eliminada',
    });
  } catch (error) {
    console.error('Error al eliminar persona:', error);
    return NextResponse.json(
      { error: 'Error al eliminar persona' },
      { status: 500 }
    );
  }
}
