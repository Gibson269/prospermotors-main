import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ImageDebug = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('id, brand, model, images')
        .limit(3);
      
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Cars fetched:', data);
        setCars(data || []);
      }
      setLoading(false);
    };

    fetchCars();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-bold mb-8">Image Debug</h1>
      
      {cars.map(car => (
        <div key={car.id} className="mb-8 p-4 border-2 border-gray-300">
          <h2 className="text-xl font-bold mb-4">{car.brand} {car.model}</h2>
          
          <div className="mb-4 p-2 bg-gray-100 text-sm font-mono overflow-auto">
            <pre>{JSON.stringify(car.images, null, 2)}</pre>
          </div>

          {car.images && car.images.length > 0 ? (
            <>
              <p className="mb-2 text-sm">URL: {car.images[0]}</p>
              <div className="mb-4">
                <img 
                  src={car.images[0]} 
                  alt={`${car.brand} ${car.model}`}
                  style={{ maxWidth: '300px', maxHeight: '200px', border: '2px solid red' }}
                  onLoad={() => console.log('Image loaded:', car.images[0])}
                  onError={(e) => console.error('Image error:', car.images[0], e)}
                />
              </div>
              <p className="text-sm text-green-600">✓ Image element rendered</p>
            </>
          ) : (
            <p className="text-sm text-red-600">✗ No images array or empty</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageDebug;
