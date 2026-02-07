import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';

const DiagnosticsPage = () => {
  const [diagnostics, setDiagnostics] = useState<any>({
    supabaseUrl: '',
    keyExists: false,
    carCount: 0,
    firstCar: null,
    error: null,
    connected: false,
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    try {
      console.log('[Diagnostics] Starting...');

      // Check environment
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const keyExists = !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      console.log('[Diagnostics] Supabase URL:', supabaseUrl);
      console.log('[Diagnostics] Key exists:', keyExists);

      // Try to fetch cars
      const { data, error, status } = await supabase
        .from('cars')
        .select('*')
        .limit(1);

      console.log('[Diagnostics] Query status:', status);
      console.log('[Diagnostics] Query error:', error);
      console.log('[Diagnostics] Query data:', data);

      // Get count
      const { count, error: countError } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true });

      console.log('[Diagnostics] Count:', count);
      console.log('[Diagnostics] Count error:', countError);

      setDiagnostics({
        supabaseUrl,
        keyExists,
        carCount: count || 0,
        firstCar: data?.[0] || null,
        error: error?.message || countError?.message || null,
        connected: !error && !countError,
      });
    } catch (err: any) {
      console.error('[Diagnostics] Exception:', err);
      setDiagnostics((prev: any) => ({
        ...prev,
        error: err.message,
      }));
    }
  };

  return (
    <Layout>
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">🔍 Diagnostics</h1>

          <div className="space-y-6">
            {/* Status */}
            <div className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200">
              <h2 className="text-xl font-bold mb-4">Connection Status</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Connected:</span>{' '}
                  <span className={diagnostics.connected ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {diagnostics.connected ? '✅ YES' : '❌ NO'}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Supabase URL:</span> <code>{diagnostics.supabaseUrl}</code>
                </p>
                <p>
                  <span className="font-semibold">API Key Available:</span>{' '}
                  <span className={diagnostics.keyExists ? 'text-green-600' : 'text-red-600'}>
                    {diagnostics.keyExists ? '✅ YES' : '❌ NO'}
                  </span>
                </p>
              </div>
            </div>

            {/* Database Stats */}
            <div className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200">
              <h2 className="text-xl font-bold mb-4">Database Status</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Total Cars:</span>{' '}
                  <span className="text-2xl font-bold">{diagnostics.carCount}</span>
                </p>
                {diagnostics.carCount === 0 && (
                  <p className="text-orange-600">⚠️ Database is empty! Need to seed data.</p>
                )}
              </div>
            </div>

            {/* First Car Sample */}
            {diagnostics.firstCar && (
              <div className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200">
                <h2 className="text-xl font-bold mb-4">Sample Car Data</h2>
                <pre className="bg-white p-4 rounded text-sm overflow-auto max-h-96">
                  {JSON.stringify(diagnostics.firstCar, null, 2)}
                </pre>
              </div>
            )}

            {/* Error */}
            {diagnostics.error && (
              <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
                <h2 className="text-xl font-bold text-red-700 mb-2">❌ Error</h2>
                <p className="text-red-600">{diagnostics.error}</p>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <h2 className="text-xl font-bold mb-4">📋 Next Steps</h2>
              {diagnostics.carCount === 0 && (
                <ol className="list-decimal list-inside space-y-2 text-blue-900">
                  <li>Go to Supabase Dashboard → SQL Editor</li>
                  <li>Create a new query</li>
                  <li>Paste the reseed script from SHOP_EMPTY_DEBUGGING.md</li>
                  <li>Run the query</li>
                  <li>Refresh this page and /shop</li>
                </ol>
              )}
              {!diagnostics.connected && (
                <ol className="list-decimal list-inside space-y-2 text-blue-900">
                  <li>Check your internet connection</li>
                  <li>Verify VITE_SUPABASE_URL in .env is correct</li>
                  <li>Check Supabase RLS policies allow public SELECT</li>
                  <li>Restart development server</li>
                </ol>
              )}
              {diagnostics.connected && diagnostics.carCount > 0 && (
                <p className="text-green-700 font-bold">✅ Everything looks good! Go to /shop</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiagnosticsPage;
