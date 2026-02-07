import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Debug = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        console.log('Attempting to fetch cars...');
        const { data, error } = await supabase
          .from('cars')
          .select('*');

        console.log('Query result:', { data, error });

        if (error) {
          setError(`Error: ${error.message}`);
          console.error('Supabase error:', error);
        } else {
          setCars(data || []);
          console.log(`Fetched ${data?.length || 0} cars`);
        }
      } catch (err: any) {
        setError(`Exception: ${err.message}`);
        console.error('Exception:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug Page</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      <p>Cars found: <strong>{cars.length}</strong></p>
      
      {cars.length > 0 && (
        <div>
          <h2>Cars List:</h2>
          <pre>{JSON.stringify(cars, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Debug;
