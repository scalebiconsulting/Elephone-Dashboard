import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { SkuMapping, SkuBulkItem } from '@/lib/models/SkuMapping';

const DB_NAME = 'elephone';
const COLLECTION_NAME = 'sku_mapping';

// POST: Carga masiva de SKUs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body as { items: SkuBulkItem[] };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de items con sku y modelo2' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<SkuMapping>(COLLECTION_NAME);

    // Crear índice único en modelo2 si no existe
    await collection.createIndex({ modelo2: 1 }, { unique: true });
    await collection.createIndex({ sku: 1 }, { unique: true });

    // Preparar documentos para inserción
    const now = new Date();
    const documents: Omit<SkuMapping, '_id'>[] = items.map(item => ({
      sku: item.sku.trim().toUpperCase(),
      modelo2: item.modelo2.trim().toUpperCase(),
      createdAt: now,
      updatedAt: now
    }));

    // Insertar en lotes de 500 para evitar timeout
    const batchSize = 500;
    let inserted = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      
      try {
        // Usar insertMany con ordered: false para continuar si hay duplicados
        const result = await collection.insertMany(batch as SkuMapping[], { 
          ordered: false 
        });
        inserted += result.insertedCount;
      } catch (bulkError: unknown) {
        // Si hay errores de duplicados, contar los insertados y los saltados
        if (bulkError && typeof bulkError === 'object' && 'insertedCount' in bulkError) {
          const typedError = bulkError as { insertedCount: number; writeErrors?: Array<{ errmsg: string }> };
          inserted += typedError.insertedCount;
          skipped += batch.length - typedError.insertedCount;
          
          // Registrar errores que no sean duplicados
          if (typedError.writeErrors) {
            typedError.writeErrors.forEach((err) => {
              if (!err.errmsg?.includes('duplicate key')) {
                errors.push(err.errmsg);
              }
            });
          }
        } else {
          throw bulkError;
        }
      }
    }

    return NextResponse.json({
      success: true,
      total: documents.length,
      inserted,
      skipped,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error en carga masiva de SKUs:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE: Limpiar toda la colección (solo para desarrollo)
export async function DELETE() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<SkuMapping>(COLLECTION_NAME);

    const result = await collection.deleteMany({});

    return NextResponse.json({
      success: true,
      deleted: result.deletedCount
    });
  } catch (error) {
    console.error('Error limpiando SKUs:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
