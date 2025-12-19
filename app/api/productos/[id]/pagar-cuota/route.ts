import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Producto, CuotaPagoSchema } from '@/lib/models/Producto';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const client = await clientPromise;
    const db = client.db('elephone');
    const body = await request.json();
    const { id } = await params;

    const producto = await db
      .collection<Producto>('productos')
      .findOne({ _id: new ObjectId(id) });
    
    if (!producto) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    if (!producto.pagoProveedor) {
      return NextResponse.json({ error: 'Producto no tiene configuración de pago' }, { status: 400 });
    }

    const { indiceCuota, montoEfectivo, montoTransferencia, referenciaTransferencia } = body;

    // Si indiceCuota no está presente o es -1, es un pago inmediato (no prorrateado)
    if (indiceCuota === undefined || indiceCuota === -1) {
      // Pago inmediato
      producto.pagoProveedor.montoEfectivo += montoEfectivo || 0;
      producto.pagoProveedor.montoTransferencia += montoTransferencia || 0;
      if (referenciaTransferencia) {
        producto.pagoProveedor.referenciaTransferencia = referenciaTransferencia;
      }
      producto.pagoProveedor.fechaPago = new Date().toISOString();
      producto.pagoProveedor.totalPagado += (montoEfectivo || 0) + (montoTransferencia || 0);
      producto.pagoProveedor.saldoPendiente = producto.costo - producto.pagoProveedor.totalPagado;

      // Actualizar estado
      if (producto.pagoProveedor.saldoPendiente <= 0) {
        producto.pagoProveedor.estado = 'PAGADO';
      } else {
        producto.pagoProveedor.estado = 'PARCIAL';
      }
    } else {
      // Pago de cuota prorrateada
      if (!producto.pagoProveedor.cuotas || indiceCuota >= producto.pagoProveedor.cuotas.length) {
        return NextResponse.json({ error: 'Cuota no encontrada' }, { status: 404 });
      }

      const cuota = producto.pagoProveedor.cuotas[indiceCuota];
      
      if (cuota.estado === 'PAGADO') {
        return NextResponse.json({ error: 'Esta cuota ya fue pagada' }, { status: 400 });
      }

      // Actualizar cuota
      cuota.montoEfectivo += montoEfectivo || 0;
      cuota.montoTransferencia += montoTransferencia || 0;
      if (referenciaTransferencia) {
        cuota.referenciaTransferencia = referenciaTransferencia;
      }
      cuota.fechaPago = new Date().toISOString();

      const totalPagadoCuota = cuota.montoEfectivo + cuota.montoTransferencia;
      
      if (totalPagadoCuota >= cuota.monto) {
        cuota.estado = 'PAGADO';
      }

      // Recalcular totales
      const totalPagadoTodasCuotas = producto.pagoProveedor.cuotas.reduce(
        (sum: number, c: CuotaPagoSchema) => sum + c.montoEfectivo + c.montoTransferencia,
        0
      );
      
      producto.pagoProveedor.totalPagado = totalPagadoTodasCuotas;
      producto.pagoProveedor.saldoPendiente = producto.costo - totalPagadoTodasCuotas;

      // Actualizar estado general
      const todasPagadas = producto.pagoProveedor.cuotas.every((c: CuotaPagoSchema) => c.estado === 'PAGADO');
      if (todasPagadas) {
        producto.pagoProveedor.estado = 'PAGADO';
      } else {
        producto.pagoProveedor.estado = 'PARCIAL';
      }
    }

    // Actualizar el producto en la base de datos
    await db
      .collection<Producto>('productos')
      .updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            pagoProveedor: producto.pagoProveedor,
            updatedAt: new Date()
          } 
        }
      );

    return NextResponse.json({
      success: true,
      message: 'Pago registrado exitosamente',
      data: producto,
    });
  } catch (error) {
    console.error('Error al registrar pago:', error);
    return NextResponse.json(
      { error: 'Error al registrar el pago' },
      { status: 500 }
    );
  }
}
