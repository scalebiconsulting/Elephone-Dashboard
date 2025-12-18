'use client';

import { useState } from 'react';

export default function AdminSkusPage() {
  const [rawData, setRawData] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [stats, setStats] = useState<{ total: number; inserted: number; errors: number } | null>(null);

  const parseData = (data: string) => {
    const lines = data.trim().split('\n');
    const items: { sku: string; modelo2: string }[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Intentar separar por tab primero, luego por múltiples espacios
      let parts = trimmedLine.split('\t');
      if (parts.length !== 2) {
        parts = trimmedLine.split(/\s{2,}/);
      }

      if (parts.length >= 2) {
        const sku = parts[0].trim();
        const modelo2 = parts[1].trim();
        if (sku && modelo2) {
          items.push({ sku, modelo2 });
        }
      }
    }

    return items;
  };

  const handleClearAndLoad = async () => {
    if (!rawData.trim()) {
      setMessage({ type: 'error', text: 'Por favor, pega los datos de SKU' });
      return;
    }

    const items = parseData(rawData);
    if (items.length === 0) {
      setMessage({ type: 'error', text: 'No se pudieron parsear los datos. Verifica el formato (SKU[TAB]MODELO2)' });
      return;
    }

    const confirmMsg = `Se cargarán ${items.length} SKUs. Esto eliminará todos los SKUs existentes. ¿Continuar?`;
    if (!confirm(confirmMsg)) return;

    setLoading(true);
    setMessage(null);
    setStats(null);

    try {
      // Primero limpiar la colección
      const deleteRes = await fetch('/api/sku/bulk', { method: 'DELETE' });
      if (!deleteRes.ok) {
        throw new Error('Error al limpiar la colección');
      }

      // Luego cargar los nuevos datos
      const insertRes = await fetch('/api/sku/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const result = await insertRes.json();

      if (insertRes.ok) {
        setMessage({ type: 'success', text: result.message });
        setStats({
          total: items.length,
          inserted: result.inserted,
          errors: result.errors?.length || 0,
        });
        setRawData('');
      } else {
        throw new Error(result.error || 'Error al cargar los SKUs');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    const items = parseData(rawData);
    alert(`Se encontraron ${items.length} registros.\n\nPrimeros 5:\n${items.slice(0, 5).map(i => `${i.sku} -> ${i.modelo2}`).join('\n')}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Administración de SKUs</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cargar SKUs desde Excel</h2>
          <p className="text-gray-400 mb-4">
            Pega los datos copiados desde Excel. Formato esperado: SKU[TAB]MODELO2 (una línea por registro)
          </p>
          
          <textarea
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
            placeholder="IPH11-BA-MO64NU00001	IPHONE 11 64 GB MORADO NUEVO
IPH11-BA-AM64NU00002	IPHONE 11 64 GB AMARILLO NUEVO
..."
            className="w-full h-64 bg-gray-700 border border-gray-600 rounded-lg p-4 text-sm font-mono resize-y"
            disabled={loading}
          />
          
          <div className="flex gap-4 mt-4">
            <button
              onClick={handlePreview}
              disabled={loading || !rawData.trim()}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg disabled:opacity-50"
            >
              Vista Previa
            </button>
            <button
              onClick={handleClearAndLoad}
              disabled={loading || !rawData.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Cargando...
                </>
              ) : (
                'Limpiar y Cargar SKUs'
              )}
            </button>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-800' : 'bg-red-800'}`}>
            {message.text}
          </div>
        )}

        {stats && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Resultados de la carga</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
                <div className="text-gray-400">Total enviados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{stats.inserted}</div>
                <div className="text-gray-400">Insertados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{stats.errors}</div>
                <div className="text-gray-400">Errores</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
