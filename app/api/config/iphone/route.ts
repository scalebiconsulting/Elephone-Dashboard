import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('elephone');
    
    const config = await db.collection('config_iphone').findOne({ _id: 'config' as unknown as import('mongodb').ObjectId });
    
    if (!config) {
      return NextResponse.json({ error: 'Configuración no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({
      series: config.series,
      modelos_por_serie: config.modelos_por_serie,
      configuraciones: config.configuraciones
    });
    
  } catch (error) {
    console.error('Error obteniendo config_iphone:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
