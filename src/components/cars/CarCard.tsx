import { Link } from 'react-router-dom';
import { Eye, Fuel, Gauge } from 'lucide-react';
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="luxury-card group">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {car.images && car.images[0] ? (
          <img
            src={car.images[0]}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {car.is_featured && (
            <Badge className="bg-gold text-primary border-0 text-xs uppercase tracking-wider">
              Featured
            </Badge>
          )}
          {car.is_sold && (
            <Badge variant="secondary" className="bg-charcoal text-white border-0 text-xs uppercase tracking-wider">
              Sold
            </Badge>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute bottom-4 left-4 right-4">
            <Link
              to={`/car/${car.id}`}
              className="flex items-center justify-center gap-2 w-full py-3 bg-white/90 text-primary text-sm font-medium uppercase tracking-wider hover:bg-white transition-colors"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title & Year */}
        <div className="mb-3">
          <h3 className="font-serif text-xl font-semibold">
            {car.brand} {car.model}
          </h3>
          <p className="text-muted-foreground text-sm">{car.year}</p>
        </div>

        {/* Specs */}
        <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
          {car.fuel_type && (
            <div className="flex items-center gap-1">
              <Fuel className="h-4 w-4" />
              <span>{car.fuel_type}</span>
            </div>
          )}
          {car.transmission && (
            <div className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              <span>{car.transmission}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="price-tag">{formatPrice(car.price)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to={`/car/${car.id}`}
            className="flex-1 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium uppercase tracking-wider transition-colors rounded text-center"
          >
            Reserve Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
