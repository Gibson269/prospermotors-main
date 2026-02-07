import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const RawDataDebug = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRaw = async () => {
      try {
        // Use RPC or direct query
        const { data: cars, error: queryError } = await supabase
          .from('cars')
          .select('*')
          .limit(1);
        
        if (queryError) {
          console.error('Query error:', queryError);
          setError(JSON.stringify(queryError));
        } else {
          console.log('Raw car data:', cars?.[0]);
          setData(cars?.[0]);
        }
      } catch (err: any) {
        console.error('Exception:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRaw();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Raw Database Data</h1>
      
      <div className="mb-8 p-4 bg-white border-2 border-gray-300 rounded">
        <h2 className="text-xl font-bold mb-4">First Car Object:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      {data && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white border rounded">
            <p className="font-bold">Brand:</p>
            <p>{data.brand}</p>
          </div>
          <div className="p-4 bg-white border rounded">
            <p className="font-bold">Model:</p>
            <p>{data.model}</p>
          </div>
          <div className="p-4 bg-white border rounded">
            <p className="font-bold">Images Type:</p>
            <p>{typeof data.images} - {Array.isArray(data.images) ? 'IS ARRAY' : 'NOT ARRAY'}</p>
          </div>
          <div className="p-4 bg-white border rounded">
            <p className="font-bold">Images Length:</p>
            <p>{data.images?.length || 'undefined'}</p>
          </div>
          <div className="col-span-2 p-4 bg-white border rounded">
            <p className="font-bold">Images Value:</p>
            <pre className="bg-gray-100 p-2 rounded text-xs">
              {JSON.stringify(data.images, null, 2)}
            </pre>
          </div>
          
          {data.images && data.images[0] && (
            <div className="col-span-2 p-4 bg-white border rounded">
              <p className="font-bold mb-2">First Image URL:</p>
              <p className="text-sm break-all mb-4">{data.images[0]}</p>
              <img 
                src={data.images[0]} 
                alt="test"
                style={{ maxWidth: '300px', maxHeight: '200px' }}
                onLoad={() => console.log('✓ Image loaded')}
                onError={(e) => console.error('✗ Image failed:', e)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RawDataDebug;
