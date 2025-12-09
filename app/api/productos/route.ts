import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Producto } from '@/lib/models/Producto';

// GET - Obtener todos los productos
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('elephone');
    const productos = await db
      .collection<Producto>('productos')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: productos });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('elephone');

    const nuevoProducto: Producto = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Producto>('productos').insertOne(nuevoProducto);

    return NextResponse.json({
      success: true,
      data: { ...nuevoProducto, _id: result.insertedId.toString() },
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}
