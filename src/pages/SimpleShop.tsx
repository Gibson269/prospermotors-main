import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Car } from '@/types/car';
import Layout from '@/components/layout/Layout';

const SimpleShop = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        console.log('Fetching cars...');
        const { data, error: queryError } = await supabase
          .from('cars')
          .select('*')
          .order('created_at', { ascending: false });

        if (queryError) {
          console.error('Query error:', queryError);
          setError(queryError.message);
        } else {
          console.log('Fetched:', data?.length, 'cars');
          console.log('First car images:', data?.[0]?.images);
          console.log('All cars:', data);
          setCars(data as Car[]);
        }
      } catch (err: any) {
        console.error('Exception:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) return <Layout><div className="p-8 text-center">Loading...</div></Layout>;

  if (error) return (
    <Layout>
      <div className="p-8 text-center text-red-600">
        <h2 className="text-2xl font-bold mb-4">Error: {error}</h2>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="w-full bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Our Collection</h1>
          <p className="text-xl text-gray-300 mb-12">
            Showing {cars.length} Premium Vehicles
          </p>

          {cars.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl text-gray-400">No cars found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <div key={car.id} className="bg-white text-black rounded-lg overflow-hidden shadow-lg">
                  {/* Image */}
                  {car.images && car.images[0] ? (
                    <img
                      src={car.images[0]}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-64 object-cover"
                      onLoad={() => console.log('Image loaded:', car.images[0])}
                      onError={(e) => {
                        console.error('Image failed to load:', car.images[0]);
                        console.error('Error details:', e);
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600">No Image (images={JSON.stringify(car.images)})</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-gray-600 mb-4">Year: {car.year}</p>

                    {/* Specs */}
                    <div className="mb-4 text-sm text-gray-700">
                      {car.transmission && <p>Transmission: {car.transmission}</p>}
                      {car.fuel_type && <p>Fuel: {car.fuel_type}</p>}
                      {car.engine && <p>Engine: {car.engine}</p>}
                    </div>

                    {/* Price */}
                    <div className="text-2xl font-bold text-gold mb-4">
                      ₦{(car.price || 0).toLocaleString()}
                    </div>

                    {/* Button */}
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SimpleShop;
