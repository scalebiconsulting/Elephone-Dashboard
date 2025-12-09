"use client";

import { useState, useEffect } from 'react';
import { Package, Save } from 'lucide-react';

export default function IngresosModule() {
  // Sección 1 - Identificación del Producto
  const [equipo, setEquipo] = useState('');
  const [modelo, setModelo] = useState('');
  const [color, setColor] = useState('');
  const [subModelo, setSubModelo] = useState('');
  const [serie, setSerie] = useState('');
  const [gb, setGb] = useState('');
  const [condicion, setCondicion] = useState('');
  const [modelo2, setModelo2] = useState(''); // Generado dinámicamente

  // Sección 2 - Detalles de Compra
  const [sku, setSku] = useState('');
  const [condicionBateria, setCondicionBateria] = useState('');
  const [costo, setCosto] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');

  // Sección 3 - Observaciones
  const [observacion, setObservacion] = useState('');
  const [fallaMacOnline, setFallaMacOnline] = useState('');
  const [garantiaCompra, setGarantiaCompra] = useState('');

  // Sección 4 - Estado del Equipo
  const [block, setBlock] = useState('NO');
  const [datosEquipos, setDatosEquipos] = useState('NO DATOS');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [imei1, setImei1] = useState('');
  const [imei2, setImei2] = useState('');
  const [concatenacion, setConcatenacion] = useState(''); // Generado dinámicamente

  // Sección 5 - Inventario
  const [estado, setEstado] = useState('STOCK OFICINA');
  const [fecha, setFecha] = useState('');
  const [metodoPago, setMetodoPago] = useState<string[]>([]);

  // Sección 6 - Precios
  const [repuesto, setRepuesto] = useState('');
  const [pvpEfectivo, setPvpEfectivo] = useState('');
  const [utilidad, setUtilidad] = useState('');
  const [utilidad2, setUtilidad2] = useState('');
  const [tresPorCiento, setTresPorCiento] = useState('');

  const [loading, setLoading] = useState(false);

  const handleMetodoPagoToggle = (metodo: string) => {
    if (metodoPago.includes(metodo)) {
      setMetodoPago(metodoPago.filter(m => m !== metodo));
    } else {
      setMetodoPago([...metodoPago, metodo]);
    }
  };

  // Generar MODELO2 dinámicamente (EQUIPO, SERIE, MODELO, GB, COLOR, CONDICION)
  useEffect(() => {
    const modelo2Generated = [equipo, serie, modelo, gb, color, condicion]
      .filter(val => val.trim() !== '')
      .join(' ');
    setModelo2(modelo2Generated);
  }, [equipo, serie, modelo, gb, color, condicion]);

  // Generar CONCATENACIÓN dinámicamente (IMEI1;IMEI2)
  useEffect(() => {
    if (imei1 || imei2) {
      setConcatenacion(`${imei1};${imei2}`);
    } else {
      setConcatenacion('');
    }
  }, [imei1, imei2]);



  const formatoPesosChilenos = (valor: string) => {
    const numero = valor.replace(/\D/g, '');
    return numero ? parseInt(numero).toLocaleString('es-CL') : '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    try {
      const productoData = {
        equipo,
        modelo,
        color,
        subModelo,
        serie,
        gb: parseInt(gb) || 0,
        condicion,
        modelo2,
        sku,
        condicionBateria: parseInt(condicionBateria) || 0,
        costo: parseInt(costo.replace(/\D/g, '')) || 0,
        proveedor,
        fechaCompra,
        observacion,
        fallaMacOnline,
        garantiaCompra,
        block: block === 'SI',
        datosEquipos,
        numeroSerie,
        imei1,
        imei2,
        concatenacion,
        estado,
        fecha,
        metodoPago: metodoPago,
        repuesto: parseInt(repuesto.replace(/\D/g, '')) || 0,
        pvpEfectivo: parseInt(pvpEfectivo.replace(/\D/g, '')) || 0,
        utilidad: parseInt(utilidad.replace(/\D/g, '')) || 0,
        utilidad2: parseInt(utilidad2.replace(/\D/g, '')) || 0,
        tresPorCiento: parseInt(tresPorCiento.replace(/\D/g, '')) || 0,
      };

      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData),
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Producto registrado exitosamente');
        // Limpiar formulario
        setEquipo(''); setModelo(''); setColor(''); setSubModelo(''); setSerie('');
        setGb(''); setCondicion(''); setSku(''); setCondicionBateria('');
        setCosto(''); setProveedor(''); setFechaCompra(''); setObservacion('');
        setFallaMacOnline(''); setGarantiaCompra(''); setBlock('NO');
        setDatosEquipos('NO DATOS'); setNumeroSerie(''); setImei1(''); setImei2('');
        setEstado('STOCK OFICINA'); setFecha(''); setMetodoPago([]);
        setRepuesto(''); setPvpEfectivo(''); setUtilidad(''); setUtilidad2('');
        setTresPorCiento('');
      } else {
        alert('❌ Error al registrar producto: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Registro de Compras / Ingresos</h1>
        <p className="text-slate-400">Registra productos que compras a proveedores</p>
      </div>

      <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') e.preventDefault(); }} className="space-y-8">
        {/* Sección 1 - Identificación del Producto */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Package size={24} className="text-[#0ea5e9]" />
            📦 Nuevo Producto
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                1. EQUIPO <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={equipo}
                onChange={(e) => setEquipo(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="iPhone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                2. MODELO <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={modelo}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setModelo(value);
                }}
                required
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="Pro Max"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                3. COLOR <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="Titanio Natural"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">4. SUB MODELO</label>
              <input
                type="text"
                value={subModelo}
                onChange={(e) => setSubModelo(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="pro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                5. SERIE <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={serie}
                onChange={(e) => setSerie(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                6. GB <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={gb}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setGb(value);
                  }}
                  required
                  className="w-full px-4 py-3 pr-12 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                  placeholder="256"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none">
                  GB
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                7. CONDICIÓN <span className="text-red-500">*</span>
              </label>
              <select
                value={condicion}
                onChange={(e) => setCondicion(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                <option value="">Seleccionar...</option>
                <option value="NUEVO">NUEVO</option>
                <option value="SEMINUEVO">SEMINUEVO</option>
                <option value="OPENBOX">OPENBOX</option>
                <option value="REACONDICIONADO">REACONDICIONADO</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-2">8. MODELO2 (Generado automáticamente)</label>
              <input
                type="text"
                value={modelo2}
                readOnly
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#0ea5e9] rounded-lg text-[#ffffff] font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Sección 2 - Detalles de Compra */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">💰 Detalles de Compra</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                9. SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="IPH15-MA-DE256OP01788"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                10. CONDICIÓN BATERÍA (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={condicionBateria}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
                    setCondicionBateria(value);
                  }
                }}
                required
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                11. COSTO (CLP) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  value={costo}
                  onChange={(e) => setCosto(formatoPesosChilenos(e.target.value))}
                  required
                  className="w-full px-4 py-3 pl-8 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                  
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                12. PROVEEDOR <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="Nombre del Proveedor"
              />
            </div>

            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                13. FECHA DE COMPRA <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={fechaCompra}
                onChange={(e) => setFechaCompra(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9] [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Sección 3 - Observaciones */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">📝 Observaciones</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">14. OBSERVACIÓN</label>
              <textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">15. FALLA CON LA QUE VINO DE MAC ONLINE</label>
              <textarea
                value={fallaMacOnline}
                onChange={(e) => setFallaMacOnline(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">16. GARANTÍA COMPRA</label>
              <textarea
                value={garantiaCompra}
                onChange={(e) => setGarantiaCompra(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              />
            </div>
          </div>
        </div>

        {/* Sección 4 - Estado del Equipo */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">📱 Estado del Equipo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">17. BLOCK</label>
              <select
               value={condicion}
                onChange={(e) => setCondicion(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                <option value="">Seleccionar...</option>
                <option value="NO">NO</option>
                <option value="SI">SI</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">18. DATOS EQUIPOS</label>
              <select
                value={condicion}
                onChange={(e) => setCondicion(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                <option value="">Seleccionar...</option>
                <option value="NO DATOS">NO DATOS</option>
                <option value="SI DATOS">SI DATOS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">19. NÚMERO DE SERIE</label>
              <input
                type="text"
                value={numeroSerie}
                onChange={(e) => setNumeroSerie(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="353084064746173"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">20. IMEI 1</label>
              <input
                type="text"
                value={imei1}
                onChange={(e) => setImei1(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="353084064746173"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">21. IMEI 2</label>
              <input
                type="text"
                value={imei2}
                onChange={(e) => setImei2(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                placeholder="353084064746174"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">30. CONCATENACIÓN (Automático)</label>
              <input
                type="text"
                value={concatenacion}
                readOnly
                className="w-full px-4 py-3 bg-[#0f172a] placeholder-[gray] border border-[#0ea5e9] rounded-lg text-[#0ea5e9] font-semibold"
                placeholder="IMEI 1 ; IMEI 2"
              />
            </div>
          </div>
        </div>

        {/* Sección 5 - Inventario */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">📦 Inventario</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-slate-400 mb-2">22. ESTADO</label>
              <select
                value={condicion}
                onChange={(e) => setCondicion(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
              >
                <option value="">Seleccionar...</option>
                <option value="STOCK OFICINA">STOCK OFICINA</option>
                <option value="EN TALLER CLINICEL">EN TALLER CLINICEL</option>
                <option value="VENDIDO">VENDIDO</option>
                <option value="REPUESTO">REPUESTO</option>
              </select>
            </div>

            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-slate-400 mb-2">23. FECHA</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9] [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">24. MÉTODO DE PAGO</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {['TRANSFERENCIA', 'CREDITO', 'EFECTIVO', 'PERMUTA', 'EQUIPO BLOCK'].map((metodo) => (
                <label key={metodo} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={metodoPago.includes(metodo)}
                    onChange={() => handleMetodoPagoToggle(metodo)}
                    className="w-5 h-5 rounded bg-[#0f172a] border border-[#334155] checked:bg-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]"
                  />
                  <span className="text-sm text-slate-300">{metodo}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sección 6 - Precios */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">💵 Precios y Utilidad</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">25. REPUESTO (CLP)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  value={repuesto}
                  onChange={(e) => setRepuesto(formatoPesosChilenos(e.target.value))}
                  className="w-full px-4 py-3 pl-8 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">26. PVP EFECTIVO (CLP)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  value={pvpEfectivo}
                  onChange={(e) => setPvpEfectivo(formatoPesosChilenos(e.target.value))}
                  className="w-full px-4 py-3 pl-8 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">27. UTILIDAD (CLP)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  value={utilidad}
                  onChange={(e) => setUtilidad(formatoPesosChilenos(e.target.value))}
                  className="w-full px-4 py-3 pl-8 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">28. UTILIDAD2 (CLP)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  value={utilidad2}
                  onChange={(e) => setUtilidad2(formatoPesosChilenos(e.target.value))}
                  className="w-full px-4 py-3 pl-8 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">29. 3,2% (CLP)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium pointer-events-none">
                  $
                </span>
                <input
                  type="text"
                  value={tresPorCiento}
                  onChange={(e) => setTresPorCiento(formatoPesosChilenos(e.target.value))}
                  className="w-full px-4 py-3 pl-8 bg-[#0f172a] border border-[#334155] rounded-lg text-white focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botón Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-lg transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {loading ? 'Guardando...' : 'Registrar Compra'}
          </button>
        </div>
      </form>
    </div>
  );
}
