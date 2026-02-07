import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Check, CreditCard } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Car } from '@/types/car';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FlutterWavePayment from '@/components/payment/FlutterWavePayment';

interface ReservationStep {
  step: number;
  title: string;
  description: string;
  action: string;
}

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!id) {
        setError('No vehicle selected');
        return;
      }

      const { data, error: queryError } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (queryError) {
        setError('Vehicle not found');
        return;
      }

      setCar(data as Car);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = (action: string) => {
    if (!car) return;

    let message = '';
    switch (action) {
      case 'reserve':
        message = `Hi, I'd like to reserve the ${car.brand} ${car.model} (${car.year}) priced at ₦${car.price.toLocaleString()}.`;
        break;
      case 'deposit':
        const depositAmount = car.price * 0.5;
        message = `I'm interested in making a 50% deposit (₦${depositAmount.toLocaleString()}) for the ${car.brand} ${car.model} (${car.year}).`;
        break;
      case 'inspect':
        message = `I'd like to schedule an inspection for the ${car.brand} ${car.model} (${car.year}).`;
        break;
      case 'enquiry':
        message = `Hi, I have general enquiries about the ${car.brand} ${car.model} (${car.year}).`;
        break;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2348012345678?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setSelectedAction(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="h-96 bg-slate-200 rounded-xl animate-pulse mb-8" />
              <div className="space-y-4">
                <div className="h-12 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-12 bg-slate-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !car) {
    return (
      <Layout>
        <div className="py-16">
          <div className="container mx-auto px-4">
            <Alert variant="destructive" className="max-w-2xl mx-auto mb-8">
              <AlertDescription>{error || 'Vehicle not found'}</AlertDescription>
            </Alert>
            <div className="text-center">
              <Button onClick={() => navigate('/shop')} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shop
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const images = (car.images && Array.isArray(car.images) && car.images.filter((img: any) => typeof img === 'string' && (img.startsWith('http') || img.startsWith('/')))) || [];
  const currentImage = images && images.length > 0 ? images[imageIndex] : '/placeholder.jpg';

  const reservationSteps: ReservationStep[] = [
    {
      step: 1,
      title: 'Reserve Vehicle',
      description: 'Lock in your vehicle with a reservation',
      action: 'reserve'
    },
    {
      step: 2,
      title: 'Pay 50% Deposit',
      description: 'Secure your purchase with deposit',
      action: 'deposit'
    },
    {
      step: 3,
      title: 'Schedule Inspection',
      description: 'Arrange viewing at your convenience',
      action: 'inspect'
    }
  ];

  return (
    <Layout>
      {/* Hero Image Section */}
      <section className="bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <Button 
            onClick={() => navigate('/shop')}
            variant="ghost"
            className="text-white hover:bg-slate-800 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>

          <div className="max-w-5xl mx-auto">
            {/* Main Image */}
            <div className="relative h-96 md:h-[500px] bg-slate-800 rounded-xl overflow-hidden mb-6">
              {currentImage && currentImage.startsWith('http') ? (
                <img
                  src={currentImage}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
                  <svg className="w-32 h-32 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {car.is_featured && (
                <div className="absolute top-6 left-6 bg-amber-400 text-slate-900 px-6 py-2 rounded-full font-bold uppercase text-sm tracking-wider">
                  Featured
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images && images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      imageIndex === idx ? 'border-amber-400' : 'border-slate-700'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Details */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-10">
                <p className="text-amber-600 text-sm uppercase tracking-[0.2em] font-semibold mb-2">
                  {car.year} Model
                </p>
                <h1 className="text-5xl font-serif font-bold text-slate-900 mb-2">
                  {car.brand} {car.model}
                </h1>
                <p className="text-2xl font-bold text-slate-900 mb-4">
                  ₦{(car.price / 1000000).toFixed(1)}M
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {car.description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 p-8 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">Year</p>
                  <p className="text-2xl font-bold text-slate-900">{car.year}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">Transmission</p>
                  <p className="text-2xl font-bold text-slate-900">{car.transmission}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">Fuel Type</p>
                  <p className="text-2xl font-bold text-slate-900">{car.fuel_type}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">Engine</p>
                  <p className="text-lg font-semibold text-slate-900">{car.engine}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">Mileage</p>
                  <p className="text-lg font-semibold text-slate-900">{car.mileage}km</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">Exterior</p>
                  <p className="text-lg font-semibold text-slate-900">{car.exterior_color}</p>
                </div>
              </div>

              {/* Colors & Interior */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="border-l-4 border-amber-400 pl-6">
                  <p className="text-sm uppercase tracking-wider text-slate-500 mb-2 font-semibold">Interior</p>
                  <p className="text-xl font-semibold text-slate-900">{car.interior_color}</p>
                </div>
                <div className="border-l-4 border-slate-300 pl-6">
                  <p className="text-sm uppercase tracking-wider text-slate-500 mb-2 font-semibold">Exterior</p>
                  <p className="text-xl font-semibold text-slate-900">{car.exterior_color}</p>
                </div>
              </div>

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Features</h3>
                  <ul className="grid grid-cols-2 gap-4">
                    {car.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center text-slate-700">
                        <Check className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar - Action Steps */}
            <div>
              <div className="bg-slate-50 rounded-xl p-8 sticky top-24">
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-8">How It Works</h3>

                <div className="space-y-6">
                  {reservationSteps.map((step) => (
                    <div key={step.step} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-400 text-slate-900 font-bold text-lg">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">{step.title}</h4>
                        <p className="text-sm text-slate-600 mb-4">{step.description}</p>
                        <Button
                          onClick={() => setSelectedAction(step.action)}
                          size="sm"
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          {step.action === 'reserve' && 'Reserve Now'}
                          {step.action === 'deposit' && 'Arrange Deposit'}
                          {step.action === 'inspect' && 'Schedule Visit'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* General Enquiry */}
                <div className="mt-8 pt-8 border-t border-slate-200 space-y-3">
                  <Button
                    onClick={() => handleWhatsAppClick('enquiry')}
                    variant="outline"
                    className="w-full border-slate-900 text-slate-900 hover:bg-slate-100 h-11"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    General Enquiry
                  </Button>
                  
                  <Button
                    onClick={() => setShowPayment(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-11"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Now (Full Amount)
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal for action confirmation */}
          {selectedAction && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-sm mx-4">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {selectedAction === 'reserve' && 'Reserve This Vehicle'}
                  {selectedAction === 'deposit' && 'Arrange Deposit Payment'}
                  {selectedAction === 'inspect' && 'Schedule Inspection'}
                </h3>
                <p className="text-slate-600 mb-6">
                  Click the button below to contact us on WhatsApp:
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => handleWhatsAppClick(selectedAction)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Open WhatsApp
                  </Button>
                  <Button
                    onClick={() => setSelectedAction(null)}
                    variant="outline"
                    className="w-full h-12"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Modal */}
          {showPayment && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-900">
                      Complete Payment
                    </h3>
                    <button
                      onClick={() => setShowPayment(false)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Vehicle Summary */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">{car.brand} {car.model}</h4>
                    <p className="text-sm text-slate-600 mb-3">{car.year} • {car.transmission} • {car.fuel_type}</p>
                    <div className="border-t border-slate-200 pt-3">
                      <p className="text-sm text-slate-600">Total Amount</p>
                      <p className="text-2xl font-bold text-slate-900">₦{car.price.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Customer Information Form */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Your Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+234 800 000 0000"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>

                  {/* Payment Button */}
                  <FlutterWavePayment
                    amount={car.price}
                    customerEmail={customerEmail}
                    customerPhone={customerPhone}
                    customerName={customerName}
                    orderId={`car_${car.id}_${Date.now()}`}
                    onSuccess={(transactionId, reference) => {
                      alert(`Payment successful! Transaction ID: ${transactionId}`);
                      setShowPayment(false);
                      // Redirect to confirmation page or update UI
                      navigate('/');
                    }}
                    onError={(error) => {
                      console.error('Payment error:', error);
                    }}
                    disabled={!customerEmail || !customerPhone || !customerName}
                  />

                  <Button
                    onClick={() => setShowPayment(false)}
                    variant="outline"
                    className="w-full h-11"
                  >
                    Cancel Payment
                  </Button>

                  <p className="text-xs text-slate-500 text-center">
                    Your payment will be processed securely through Flutterwave. Please enter correct information.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CarDetail;
