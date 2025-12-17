import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET - Obtener todas las reservas
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('elephone');
    
    const reservas = await db
      .collection('reservas')
      .find({})
      .sort({ fechaCreacion: -1 })
      .toArray();

    return NextResponse.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    return NextResponse.json(
      { error: 'Error al obtener reservas' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva reserva
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('elephone');

    const nuevaReserva = {
      ...body,
      estadoReserva: body.estadoReserva || 'PENDIENTE',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      createdAt: new Date(),
    };

    const result = await db.collection('reservas').insertOne(nuevaReserva);

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      reserva: { ...nuevaReserva, _id: result.insertedId },
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    return NextResponse.json(
      { error: 'Error al crear reserva' },
      { status: 500 }
    );
  }
}
