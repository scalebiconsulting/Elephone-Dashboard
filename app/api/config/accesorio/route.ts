import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('elephone');
    
    const config = await db.collection('config_accesorio').findOne({ _id: 'config' as unknown as import('mongodb').ObjectId });
    
    if (!config) {
      return NextResponse.json({ error: 'Configuración no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({
      modelos: config.modelos,
      gamas_por_modelo: config.gamas_por_modelo,
      series_por_modelo_gama: config.series_por_modelo_gama,
      configuraciones: config.configuraciones
    });
    
  } catch (error) {
    console.error('Error obteniendo config_accesorio:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
