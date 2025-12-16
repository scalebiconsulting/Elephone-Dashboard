"use client";

interface DatosClientePermutaProps {
  nombreCliente: string;
  setNombreCliente: (value: string) => void;
  correoCliente: string;
  setCorreoCliente: (value: string) => void;
  telefonoCliente: string;
  setTelefonoCliente: (value: string) => void;
}

export default function DatosClientePermuta({
  nombreCliente,
  setNombreCliente,
  correoCliente,
  setCorreoCliente,
  telefonoCliente,
  setTelefonoCliente,
}: DatosClientePermutaProps) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">👤 Datos del Cliente</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Nombre Completo *
          </label>
          <input
            type="text"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9]"
            placeholder="Ej: Juan Pérez González"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Correo Electrónico *
          </label>
          <input
            type="email"
            value={correoCliente}
            onChange={(e) => setCorreoCliente(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9]"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            value={telefonoCliente}
            onChange={(e) => setTelefonoCliente(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#0ea5e9]"
            placeholder="+56 9 1234 5678"
          />
        </div>
      </div>
    </div>
  );
}
