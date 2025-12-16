import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('elephone');
    const permutas = await db
      .collection('permutas')
      .find({})
      .sort({ fechaPermuta: -1 })
      .toArray();
    
    return NextResponse.json(permutas);
  } catch (error) {
    console.error('Error al obtener permutas:', error);
    return NextResponse.json(
      { error: 'Error al obtener permutas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('elephone');
    const body = await request.json();

    // Registrar la permuta
    const result = await db.collection('permutas').insertOne({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    });
  } catch (error) {
    console.error('Error al registrar permuta:', error);
    return NextResponse.json(
      { error: 'Error al registrar permuta' },
      { status: 500 }
    );
  }
}
