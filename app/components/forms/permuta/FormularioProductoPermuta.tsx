"use client";

// import { Package } from 'lucide-react';
import { formatoPesosChilenos } from '@/app/utils/formatters';
import IdentificacionProducto from '@/app/components/forms/ingresos/IdentificacionProducto';
import DetallesCompra from '@/app/components/forms/ingresos/DetallesCompra';
import Observaciones from '@/app/components/forms/ingresos/Observaciones';
import EstadoEquipo from '@/app/components/forms/ingresos/EstadoEquipo';
import Inventario from '@/app/components/forms/ingresos/Inventario';
import PreciosUtilidad from '@/app/components/forms/ingresos/PreciosUtilidad';
import BasaleExport from '@/app/components/forms/ingresos/BasaleExport';

interface FormularioProductoPermutaProps {
  productoPermuta: {
    equipo: string;
    modelo: string;
    color: string;
    subModelo: string;
    serie: string;
    gb: string;
    condicion: string;
    modelo2: string;
    sku: string;
    condicionBateria: string;
    costo: string;
    fechaCompra: string;
    observacion: string;
    fallaMacOnline: string;
    garantiaCompra: string;
    block: string;
    datosEquipos: string;
    numeroSerie: string;
    imei1: string;
    imei2: string;
    concatenacion: string;
    estado: string;
    repuesto: string;
    pvpEfectivo: string;
    pvpCredito: string;
    valorPermuta: string;
  };
  updateProductoPermuta: (campo: string, valor: string) => void;
  updateValorPermuta: (valor: string) => void;
}

export default function FormularioProductoPermuta({
  productoPermuta,
  updateProductoPermuta,
  updateValorPermuta,
}: FormularioProductoPermutaProps) {
  const handleMoneyChange = (campo: string, value: string) => {
    updateProductoPermuta(campo, formatoPesosChilenos(value));
  };

  const handleValorPermutaChange = (value: string) => {
    updateValorPermuta(formatoPesosChilenos(value));
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      {/* <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Package size={24} className="text-[#0ea5e9]" />
          📦 Producto en Permuta (Entra)
        </h2>
        <p className="text-slate-400 text-sm">Complete los datos del producto que el cliente deja en parte de pago</p>
      </div> */}

      {/* Sección 1 - Identificación del Producto */}
      <IdentificacionProducto
        equipo={productoPermuta.equipo}
        modelo={productoPermuta.modelo}
        color={productoPermuta.color}
        subModelo={productoPermuta.subModelo}
        serie={productoPermuta.serie}
        gb={productoPermuta.gb}
        condicion={productoPermuta.condicion}
        modelo2={productoPermuta.modelo2}
        setEquipo={(v) => updateProductoPermuta('equipo', v)}
        setModelo={(v) => updateProductoPermuta('modelo', v)}
        setColor={(v) => updateProductoPermuta('color', v)}
        setSubModelo={(v) => updateProductoPermuta('subModelo', v)}
        setSerie={(v) => updateProductoPermuta('serie', v)}
        setGb={(v) => updateProductoPermuta('gb', v)}
        setCondicion={(v) => updateProductoPermuta('condicion', v)}
      />

      {/* Sección 2 - Detalles de Compra */}
      <DetallesCompra
        sku={productoPermuta.sku}
        condicionBateria={productoPermuta.condicionBateria}
        costo={productoPermuta.costo}
        fechaCompra={productoPermuta.fechaCompra}
        setCondicionBateria={(v) => updateProductoPermuta('condicionBateria', v)}
        setCosto={(v) => handleMoneyChange('costo', v)}
        setFechaCompra={(v) => updateProductoPermuta('fechaCompra', v)}
        buscandoSku={false}
        skuNoEncontrado={false}
      />

      {/* Sección 3 - Observaciones (modo simple = solo observación) */}
      <Observaciones
        observacion={productoPermuta.observacion}
        setObservacion={(v) => updateProductoPermuta('observacion', v)}
        simple={true}
      />

      {/* Sección 4 - Estado del Equipo (sin datosEquipos) */}
      <EstadoEquipo
        block={productoPermuta.block}
        numeroSerie={productoPermuta.numeroSerie}
        imei1={productoPermuta.imei1}
        imei2={productoPermuta.imei2}
        concatenacion={productoPermuta.concatenacion}
        setBlock={(v) => updateProductoPermuta('block', v)}
        setNumeroSerie={(v) => updateProductoPermuta('numeroSerie', v)}
        setImei1={(v) => updateProductoPermuta('imei1', v)}
        setImei2={(v) => updateProductoPermuta('imei2', v)}
        showDatosEquipos={false}
      />

      {/* Sección 5 - Inventario */}
      <Inventario
        estado={productoPermuta.estado}
        fecha={productoPermuta.fechaCompra}
        setEstado={(v) => updateProductoPermuta('estado', v)}
        setFecha={(v) => updateProductoPermuta('fechaCompra', v)}
      />

      {/* Sección 6 - Precios (con valor de permuta, sin utilidades) */}
      <PreciosUtilidad
       
        pvpEfectivo={productoPermuta.pvpEfectivo}
        pvpCredito={productoPermuta.pvpCredito}
        valorPermuta={productoPermuta.valorPermuta}
        
        setPvpEfectivo={(v) => handleMoneyChange('pvpEfectivo', v)}
        setPvpCredito={(v) => handleMoneyChange('pvpCredito', v)}
        setValorPermuta={handleValorPermutaChange}
        
        showUtilidades={false}
        showValorPermuta={true}
      />

      {/* Sección 7 - Exportar a Basale */}
      <BasaleExport
        sku={productoPermuta.sku}
        costo={productoPermuta.costo}
        concatenacion={productoPermuta.concatenacion}
      />
    </div>
  );
}
