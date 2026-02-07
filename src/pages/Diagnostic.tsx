import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';

const DiagnosticPage = () => {
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runDiagnostics = async () => {
      try {
        const results: any = {};

        // 1. Test Supabase connection
        try {
          const { data, error } = await supabase.from('cars').select('count(*)');
          results.supabaseConnection = error ? `ERROR: ${error.message}` : 'OK - Connected';
        } catch (e: any) {
          results.supabaseConnection = `EXCEPTION: ${e.message}`;
        }

        // 2. Fetch all cars
        try {
          const { data, error } = await supabase.from('cars').select('*');
          results.totalCars = data?.length || 0;
          results.carsError = error ? error.message : null;
          if (data && data.length > 0) {
            results.sampleCar = {
              brand: data[0].brand,
              model: data[0].model,
              imageURL: data[0].images?.[0] || 'No image',
              imageType: typeof data[0].images,
            };
          }
        } catch (e: any) {
          results.carsError = e.message;
        }

        // 3. Check RLS status
        try {
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/?select=schema_version`, {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
          });
          results.restApiConnection = response.ok ? 'OK' : 'FAILED';
        } catch (e: any) {
          results.restApiConnection = `ERROR: ${e.message}`;
        }

        // 4. Auth check
        try {
          const { data: { user } } = await supabase.auth.getUser();
          results.userLoggedIn = user ? 'YES' : 'NO (Anonymous)';
        } catch (e: any) {
          results.authError = e.message;
        }

        setDiagnostics(results);
      } finally {
        setLoading(false);
      }
    };

    runDiagnostics();
  }, []);

  if (loading) return <div className="p-8">Running diagnostics...</div>;

  return (
    <Layout>
      <div className="p-8 bg-white">
        <h1 className="text-3xl font-bold mb-6">System Diagnostics</h1>
        
        <div className="space-y-4 bg-gray-100 p-6 rounded">
          {Object.entries(diagnostics).map(([key, value]: any) => (
            <div key={key} className="border-b pb-3">
              <strong className="text-lg">{key}:</strong>
              <pre className="mt-2 text-sm bg-white p-3 rounded overflow-auto">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DiagnosticPage;
