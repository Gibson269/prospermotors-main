import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Star, X, Upload, Image } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Car } from '@/types/car';
import { formatPrice } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const AdminCars = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const initialFormData = {
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    engine: '',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    interior_color: '',
    exterior_color: '',
    description: '',
    features: '',
    is_featured: false,
    is_sold: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  const { data: cars, isLoading } = useQuery({
    queryKey: ['admin-cars'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Car[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (carData: any) => {
      // Validate required fields
      if (!carData.brand || !carData.model || !carData.year || carData.price === undefined) {
        throw new Error('Brand, model, year, and price are required');
      }

      // Ensure price is a number
      const cleanData = {
        ...carData,
        price: parseFloat(carData.price),
        year: parseInt(carData.year),
        mileage: carData.mileage ? parseInt(carData.mileage) : 0,
      };

      console.log('[AdminCars] Creating car:', cleanData);
      const { data, error } = await supabase.from('cars').insert(cleanData).select();
      
      if (error) {
        console.error('[AdminCars] Supabase error:', error);
        throw new Error(error.message || 'Failed to add car to database');
      }
      
      console.log('[AdminCars] Car created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('[AdminCars] onSuccess: refetching cars list');
      queryClient.invalidateQueries({ queryKey: ['admin-cars'] });
      toast.success('Car added successfully');
      closeDialog();
    },
    onError: (error: any) => {
      console.error('[AdminCars] Error creating car:', error);
      const errorMessage = error?.message || 'Failed to add car';
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // Ensure price is a number
      const cleanData = {
        ...data,
        price: parseFloat(data.price),
        year: parseInt(data.year),
        mileage: data.mileage ? parseInt(data.mileage) : 0,
      };

      console.log('Updating car data:', cleanData);
      const { error } = await supabase.from('cars').update(cleanData).eq('id', id);
      
      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to update car');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cars'] });
      toast.success('Car updated successfully');
      closeDialog();
    },
    onError: (error: any) => {
      console.error('Error updating car:', error);
      const errorMessage = error?.message || 'Failed to update car';
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cars').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cars'] });
      toast.success('Car deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting car:', error);
      toast.error('Failed to delete car');
    },
  });

  const closeDialog = () => {
    console.log('[AdminCars] Closing dialog');
    setDialogOpen(false);
    setEditingCar(null);
    setFormData(initialFormData);
    setImageUrls([]);
    setNewImageUrl('');
  };

  const openEditDialog = (car: Car) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage || 0,
      engine: car.engine || '',
      transmission: car.transmission || 'Automatic',
      fuel_type: car.fuel_type || 'Petrol',
      interior_color: car.interior_color || '',
      exterior_color: car.exterior_color || '',
      description: car.description || '',
      features: car.features?.join(', ') || '',
      is_featured: car.is_featured || false,
      is_sold: car.is_sold || false,
    });
    setImageUrls(car.images || []);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[AdminCars] Form submitted');

    // Validate required fields
    if (!formData.brand.trim()) {
      toast.error('Please enter car brand');
      return;
    }
    if (!formData.model.trim()) {
      toast.error('Please enter car model');
      return;
    }
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      toast.error('Please enter valid year');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Please enter valid price');
      return;
    }

    const carData = {
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      year: parseInt(String(formData.year)),
      price: parseFloat(String(formData.price)),
      mileage: formData.mileage ? parseInt(String(formData.mileage)) : 0,
      engine: formData.engine.trim() || null,
      transmission: formData.transmission || 'Automatic',
      fuel_type: formData.fuel_type || 'Petrol',
      interior_color: formData.interior_color.trim() || null,
      exterior_color: formData.exterior_color.trim() || null,
      description: formData.description.trim() || null,
      features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [],
      images: imageUrls.length > 0 ? imageUrls : [],
      is_featured: formData.is_featured,
      is_sold: formData.is_sold,
    };

    console.log('[AdminCars] Form data prepared:', carData);

    if (editingCar) {
      console.log('[AdminCars] Updating car:', editingCar.id);
      updateMutation.mutate({ id: editingCar.id, data: carData });
    } else {
      console.log('[AdminCars] Creating new car');
      createMutation.mutate(carData);
    }
  };

  const addImageUrl = () => {
    const url = newImageUrl.trim();
    if (!url) {
      toast.error('Please enter an image URL');
      return;
    }
    
    // Basic URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      toast.error('Image URL must start with http:// or https://');
      return;
    }
    
    // Check if URL already exists
    if (imageUrls.includes(url)) {
      toast.error('This image URL is already added');
      return;
    }
    
    console.log('[AdminCars] Adding image URL:', url);
    setImageUrls([...imageUrls, url]);
    setNewImageUrl('');
    toast.success('Image URL added');
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this car?')) {
      deleteMutation.mutate(id);
    }
  };

  const transmissionOptions = ['Automatic', 'Manual', 'CVT'];
  const fuelOptions = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold">Cars</h1>
            <p className="text-muted-foreground">Manage your vehicle inventory</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gold" onClick={() => {
                console.log('[AdminCars] Add Car button clicked');
                setDialogOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Car
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">
                  {editingCar ? 'Edit Car' : 'Add New Car'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      required
                      placeholder="e.g. Mercedes-Benz"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      required
                      placeholder="e.g. S-Class"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      required
                      min={1990}
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                </div>

                {/* Price & Mileage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (NGN) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : 0 })}
                      required
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage (km)</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: e.target.value ? parseInt(e.target.value) : 0 })}
                      min={0}
                    />
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engine">Engine</Label>
                    <Input
                      id="engine"
                      value={formData.engine}
                      onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                      placeholder="e.g. 3.0L V6 Turbo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select value={formData.transmission} onValueChange={(v) => setFormData({ ...formData, transmission: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {transmissionOptions.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuel_type">Fuel Type</Label>
                    <Select value={formData.fuel_type} onValueChange={(v) => setFormData({ ...formData, fuel_type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelOptions.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exterior_color">Exterior Color</Label>
                    <Input
                      id="exterior_color"
                      value={formData.exterior_color}
                      onChange={(e) => setFormData({ ...formData, exterior_color: e.target.value })}
                      placeholder="e.g. Obsidian Black"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interior_color">Interior Color</Label>
                    <Input
                      id="interior_color"
                      value={formData.interior_color}
                      onChange={(e) => setFormData({ ...formData, interior_color: e.target.value })}
                      placeholder="e.g. Saddle Brown Leather"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of the vehicle..."
                    rows={3}
                  />
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <Label htmlFor="features">Features (comma-separated)</Label>
                  <Input
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="e.g. Sunroof, Heated Seats, Navigation"
                  />
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <Label>Images (URLs)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Enter image URL"
                    />
                    <Button type="button" onClick={addImageUrl} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Image ${index + 1}`}
                            className="w-20 h-16 object-cover rounded-sm border"
                            loading="lazy"
                            onError={(e) => {
                              console.error('[AdminCars] Image load error:', url);
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2264%22 viewBox=%220 0 80 64%22%3E%3Crect width=%2280%22 height=%2264%22 fill=%22%23e5e7eb%22/%3E%3Ctext x=%2240%22 y=%2232%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%236b7280%22%3EError%3C/text%3E%3C/svg%3E';
                            }}
                            title={url}
                          />
                          <button
                            type="button"
                            onClick={() => removeImageUrl(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Toggles */}
                <div className="flex gap-8">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_sold"
                      checked={formData.is_sold}
                      onCheckedChange={(v) => setFormData({ ...formData, is_sold: v })}
                    />
                    <Label htmlFor="is_sold">Mark as Sold</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => {
                    console.log('[AdminCars] Cancel button clicked');
                    closeDialog();
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-gold" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? (
                      <>Loading...</>
                    ) : (
                      editingCar ? 'Update Car' : 'Add Car'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cars Table */}
        <div className="bg-card rounded-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">Vehicle</th>
                  <th className="text-left p-4 text-sm font-medium">Year</th>
                  <th className="text-left p-4 text-sm font-medium">Price</th>
                  <th className="text-left p-4 text-sm font-medium">Status</th>
                  <th className="text-left p-4 text-sm font-medium">Featured</th>
                  <th className="text-right p-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <div className="animate-pulse">Loading...</div>
                    </td>
                  </tr>
                ) : cars && cars.length > 0 ? (
                  cars.map((car) => (
                    <tr key={car.id} className="border-t border-border">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 bg-muted rounded-sm overflow-hidden flex-shrink-0">
                            {car.images && car.images[0] ? (
                              <img
                                src={car.images[0]}
                                alt={`${car.brand} ${car.model}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{car.brand} {car.model}</p>
                            <p className="text-muted-foreground text-sm">{car.transmission} • {car.fuel_type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{car.year}</td>
                      <td className="p-4 font-semibold text-gold">{formatPrice(car.price)}</td>
                      <td className="p-4">
                        <Badge variant={car.is_sold ? 'secondary' : 'default'}>
                          {car.is_sold ? 'Sold' : 'Available'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {car.is_featured && <Star className="h-5 w-5 text-gold fill-gold" />}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(car)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(car.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No cars in inventory. Add your first vehicle.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCars;
