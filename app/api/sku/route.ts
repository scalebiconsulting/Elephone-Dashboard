import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { SkuMapping, SkuLookupResult } from '@/lib/models/SkuMapping';

const DB_NAME = 'elephone';
const COLLECTION_NAME = 'sku_mapping';

// GET: Buscar SKU por modelo2
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelo2 = searchParams.get('modelo2');

    if (!modelo2) {
      return NextResponse.json(
        { error: 'Se requiere el parámetro modelo2' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<SkuMapping>(COLLECTION_NAME);

    // Buscar exacto (case-insensitive por si acaso)
    const result = await collection.findOne({
      modelo2: { $regex: new RegExp(`^${modelo2}$`, 'i') }
    });

    const response: SkuLookupResult = {
      found: !!result,
      sku: result?.sku || null,
      modelo2: modelo2
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error buscando SKU:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo SKU
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sku, modelo2 } = body;

    if (!sku || !modelo2) {
      return NextResponse.json(
        { error: 'Se requieren los campos sku y modelo2' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<SkuMapping>(COLLECTION_NAME);

    // Verificar si ya existe
    const existing = await collection.findOne({
      $or: [
        { sku: sku },
        { modelo2: { $regex: new RegExp(`^${modelo2}$`, 'i') } }
      ]
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe un registro con ese SKU o MODELO2' },
        { status: 409 }
      );
    }

    // Crear nuevo registro
    const newMapping: Omit<SkuMapping, '_id'> = {
      sku: sku.toUpperCase(),
      modelo2: modelo2.toUpperCase(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newMapping as SkuMapping);

    return NextResponse.json({
      success: true,
      _id: result.insertedId,
      ...newMapping
    }, { status: 201 });
  } catch (error) {
    console.error('Error creando SKU:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
