import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, AlertCircle, MessageCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Car } from '@/types/car';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CarWithImages extends Car {
  imageUrls?: string[];
}

const Shop = () => {
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    transmission: '',
    fuelType: '',
    year: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [cars, setCars] = useState<CarWithImages[]>([]);
  const [allCars, setAllCars] = useState<CarWithImages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());

  // Fetch all cars on mount
  useEffect(() => {
    console.log('[Shop] Mounting, fetching cars...');
    fetchAllCars();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    console.log('[Shop] Applying filters:', filters, 'Search:', searchTerm);
    applyFilters();
  }, [filters, searchTerm, allCars]);

  const fetchAllCars = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('[Shop] ========== FETCH START ==========');
      console.log('[Shop] Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('[Shop] Fetching cars from Supabase...');
      
      const { data, error: queryError } = await supabase
        .from('cars')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      console.log('[Shop] Query Error:', queryError);
      console.log('[Shop] Query Data:', data);
      console.log('[Shop] Data Type:', typeof data);
      console.log('[Shop] Data Length:', data?.length);

      if (queryError) {
        console.error('[Shop] ❌ Query error:', queryError);
        setError(`Failed to load vehicles: ${queryError.message}`);
        setIsLoading(false);
        return;
      }

      if (!data) {
        console.error('[Shop] ❌ No data returned from query (data is null)');
        setError('No data returned from database');
        setIsLoading(false);
        return;
      }

      if (data.length === 0) {
        console.warn('[Shop] ⚠️ No cars found in database');
        setAllCars([]);
        setCars([]);
        setBrands([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      console.log(`[Shop] ✅ Fetched ${data.length} cars:`, data);

      // Process cars to ensure image URLs are valid
      const carsWithImages = data.map((car: any) => {
        let imageUrls: string[] = [];
        
        if (car.images && Array.isArray(car.images)) {
          imageUrls = car.images.filter((img: any) => {
            const isValid = typeof img === 'string' && (img.startsWith('http') || img.startsWith('/'));
            if (!isValid) console.warn('[Shop] Invalid image URL:', img);
            return isValid;
          });
        }

        return {
          ...car,
          imageUrls: imageUrls.length > 0 ? imageUrls : [],
        };
      });

      console.log('[Shop] ✅ Processed cars:', carsWithImages);

      setAllCars(carsWithImages);
      setCars(carsWithImages);

      // Extract unique brands
      const uniqueBrands = [...new Set(carsWithImages.map(car => car.brand))].sort();
      console.log('[Shop] ✅ Brands:', uniqueBrands);
      setBrands(uniqueBrands);
      console.log('[Shop] ========== FETCH COMPLETE ==========');
    } catch (err: any) {
      console.error('[Shop] ❌ Exception:', err);
      console.error('[Shop] Error message:', err.message);
      console.error('[Shop] Error stack:', err.stack);
      setError(`Error loading vehicles: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = allCars;

    if (filters.brand) {
      filtered = filtered.filter(car => car.brand === filters.brand);
    }

    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      filtered = filtered.filter(car => car.price >= minPrice);
    }

    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      filtered = filtered.filter(car => car.price <= maxPrice);
    }

    if (filters.transmission) {
      filtered = filtered.filter(car => car.transmission === filters.transmission);
    }

    if (filters.fuelType) {
      filtered = filtered.filter(car => car.fuel_type === filters.fuelType);
    }

    if (filters.year) {
      filtered = filtered.filter(car => car.year === parseInt(filters.year));
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(car =>
        car.brand.toLowerCase().includes(search) ||
        car.model.toLowerCase().includes(search) ||
        car.year.toString().includes(search)
      );
    }

    console.log(`[Shop] Filtered to ${filtered.length} cars`);
    setCars(filtered);
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      transmission: '',
      fuelType: '',
      year: '',
    });
    setSearchTerm('');
  };

  const handleImageError = (carId: string) => {
    console.warn(`[Shop] Image failed to load for car ${carId}`);
    setImageLoadErrors(prev => new Set(prev).add(carId));
  };

  const handleWhatsAppClick = (car: CarWithImages) => {
    const message = `Hi, I'm interested in the ${car.brand} ${car.model} (${car.year}) priced at ₦${car.price.toLocaleString()}. Can I get more details?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2348012345678?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '') || searchTerm !== '';
  const transmissionOptions = ['Automatic', 'Manual', 'CVT'];
  const fuelOptions = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
  const yearOptions = Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() - i).toString());

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium uppercase tracking-wider mb-2 block">Brand</label>
        <Select value={filters.brand} onValueChange={(value) => setFilters({ ...filters, brand: value })}>
          <SelectTrigger>
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium uppercase tracking-wider mb-2 block">Price Range (₦)</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium uppercase tracking-wider mb-2 block">Transmission</label>
        <Select value={filters.transmission} onValueChange={(value) => setFilters({ ...filters, transmission: value })}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {transmissionOptions.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium uppercase tracking-wider mb-2 block">Fuel Type</label>
        <Select value={filters.fuelType} onValueChange={(value) => setFilters({ ...filters, fuelType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {fuelOptions.map((fuel) => (
              <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium uppercase tracking-wider mb-2 block">Year</label>
        <Select value={filters.year} onValueChange={(value) => setFilters({ ...filters, year: value })}>
          <SelectTrigger>
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Years</SelectItem>
            {yearOptions.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-amber-400 text-sm uppercase tracking-[0.2em] mb-4 font-semibold">
              Premium Collection
            </p>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              Luxury Vehicles
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Discover our curated selection of premium automobiles. Each vehicle is meticulously inspected and certified for excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search by brand, model, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
            
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden h-12">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 h-5 w-5 rounded-full bg-amber-400 text-slate-900 text-xs font-bold flex items-center justify-center">
                      !
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Refine Search</SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters */}
            <aside className="hidden md:block w-80 flex-shrink-0">
              <div className="sticky top-24 bg-slate-50 p-8 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold mb-8 text-slate-900">Refine Search</h3>
                <FilterContent />
              </div>
            </aside>

            {/* Cars Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-slate-200 rounded-lg h-96 animate-pulse" />
                  ))}
                </div>
              ) : cars.length === 0 ? (
                <div className="bg-slate-50 rounded-xl p-16 text-center border border-slate-200">
                  <svg className="w-24 h-24 mx-auto text-slate-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-2">No Vehicles Found</h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    {hasActiveFilters 
                      ? 'No vehicles match your criteria. Try adjusting your filters.' 
                      : 'Currently no vehicles available. Check back soon for new inventory.'}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-8 flex items-center justify-between">
                    <p className="text-slate-600">
                      Showing <span className="font-semibold text-slate-900">{cars.length}</span> vehicle{cars.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cars.map((car) => (
                      <div key={car.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-300 border border-slate-100">
                        {/* Image Container */}
                        <div className="relative h-64 overflow-hidden bg-slate-200">
                          {car.imageUrls && car.imageUrls.length > 0 && !imageLoadErrors.has(car.id) ? (
                            <img
                              src={car.imageUrls[0]}
                              alt={`${car.brand} ${car.model}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={() => handleImageError(car.id)}
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
                              <div className="text-center">
                                <svg className="w-16 h-16 text-slate-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm font-medium text-slate-600">Image Not Available</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Featured Badge */}
                          {car.is_featured && (
                            <div className="absolute top-4 left-4 bg-amber-400 text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                              Featured
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            {car.brand} {car.model}
                          </h3>
                          <p className="text-sm text-slate-500 mb-4">{car.year}</p>

                          {/* Specs */}
                          <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-slate-600">
                            {car.transmission && (
                              <div>
                                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Transmission</p>
                                <p className="font-medium">{car.transmission}</p>
                              </div>
                            )}
                            {car.fuel_type && (
                              <div>
                                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Fuel</p>
                                <p className="font-medium">{car.fuel_type}</p>
                              </div>
                            )}
                          </div>

                          {/* Price */}
                          <div className="mb-6 border-t border-b border-slate-200 py-4">
                            <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Price</p>
                            <p className="text-2xl font-bold text-slate-900">
                              ₦{(car.price / 1000000).toFixed(1)}M
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="space-y-3">
                            <Button 
                              onClick={() => window.location.href = `/car/${car.id}`}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold h-11"
                            >
                              View Details
                            </Button>
                            
                            <Button 
                              onClick={() => handleWhatsAppClick(car)}
                              variant="outline"
                              className="w-full border-slate-900 text-slate-900 hover:bg-slate-50 font-semibold h-11"
                            >
                              <MessageCircle className="mr-2 h-4 w-4" />
                              WhatsApp Enquiry
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
