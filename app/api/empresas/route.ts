import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Empresa } from '@/lib/models/Empresa';

// GET - Obtener todas las empresas o buscar
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('elephone');
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    let filter = {};
    
    if (query) {
      filter = {
        $or: [
          { razonSocial: { $regex: query, $options: 'i' } },
          { rut: { $regex: query, $options: 'i' } },
          { telefono: { $regex: query, $options: 'i' } },
        ],
      };
    }

    const empresas = await db
      .collection<Empresa>('empresas')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(empresas);
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    return NextResponse.json(
      { error: 'Error al obtener empresas' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva empresa
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('elephone');
    const body = await request.json();

    // Validaciones
    if (!body.razonSocial || !body.rut || !body.telefono) {
      return NextResponse.json(
        { error: 'Razón social, RUT y teléfono son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si ya existe una empresa con el mismo RUT
    const existente = await db
      .collection<Empresa>('empresas')
      .findOne({ rut: body.rut });

    if (existente) {
      return NextResponse.json(
        { error: 'Ya existe una empresa con este RUT' },
        { status: 409 }
      );
    }

    const nuevaEmpresa: Empresa = {
      razonSocial: body.razonSocial,
      rut: body.rut,
      correo: body.correo || '',
      telefono: body.telefono,
      tipoDocumento: body.tipoDocumento || 'FACTURA',
      numeroDocumento: body.numeroDocumento || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection<Empresa>('empresas').insertOne(nuevaEmpresa);

    return NextResponse.json({
      success: true,
      data: { ...nuevaEmpresa, _id: result.insertedId },
    });
  } catch (error) {
    console.error('Error al crear empresa:', error);
    return NextResponse.json(
      { error: 'Error al crear empresa' },
      { status: 500 }
    );
  }
}
