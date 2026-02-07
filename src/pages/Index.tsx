import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Clock, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import CarCard from '@/components/cars/CarCard';
import { useCars } from '@/hooks/useCars';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-car.jpg';

const Index = () => {
  const { data: featuredCars, isLoading: featuredLoading } = useCars({ featured: true, limit: 6 });
  const { data: allCars, isLoading: allLoading } = useCars({ limit: 8 });

  const features = [
    {
      icon: Shield,
      title: 'Certified Quality',
      description: 'Every vehicle undergoes rigorous inspection and certification before joining our collection.',
    },
    {
      icon: Award,
      title: 'Premium Selection',
      description: 'Handpicked luxury vehicles from the world\'s most prestigious automotive brands.',
    },
    {
      icon: Clock,
      title: 'Seamless Service',
      description: 'From inquiry to delivery, experience white-glove service at every touchpoint.',
    },
  ];

  const testimonials = [
    {
      name: 'Chief Olumide Adeyemi',
      role: 'Business Executive',
      text: 'Prosperous Autos exceeded my expectations. The Range Rover I purchased was in pristine condition, and their service was impeccable.',
      rating: 5,
    },
    {
      name: 'Dr. Amara Okonkwo',
      role: 'Medical Consultant',
      text: 'I\'ve bought three vehicles from Prosperous Autos. Their attention to detail and customer service is unmatched in Abuja.',
      rating: 5,
    },
    {
      name: 'Alhaji Mohammed Ibrahim',
      role: 'Real Estate Developer',
      text: 'True luxury experience from start to finish. They made the entire process seamless and delivered my Mercedes to my doorstep.',
      rating: 5,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Luxury Car"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/95 via-obsidian/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="container-luxury relative z-10">
          <div className="max-w-2xl">
            <p className="text-gold text-sm md:text-base uppercase tracking-[0.3em] mb-4 animate-fade-up">
              Welcome to Prosperous Autos
            </p>
            <h1 className="text-display text-white mb-6 animate-fade-up delay-100">
              Luxury on Wheels
            </h1>
            <p className="text-platinum/80 text-lg md:text-xl font-light mb-8 animate-fade-up delay-200">
              Driven by Trust. Discover Nigeria's finest collection of premium automobiles, 
              curated for those who demand excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-300">
              <Button asChild className="btn-gold">
                <Link to="/shop">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="btn-outline-gold">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent animate-pulse" />
        </div>
      </section>

      {/* Featured Vehicles */}
      {featuredCars && featuredCars.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-luxury">
            <div className="text-center mb-12">
              <p className="text-gold text-sm uppercase tracking-[0.2em] mb-4">
                Handpicked Excellence
              </p>
              <h2 className="text-headline">Featured Vehicles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild className="btn-luxury">
                <Link to="/shop">
                  View All Vehicles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="section-padding bg-background">
        <div className="container-luxury">
          <div className="text-center mb-16">
            <p className="text-gold text-sm uppercase tracking-[0.2em] mb-4">
              The Prosperous Difference
            </p>
            <h2 className="text-headline">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 border border-border hover:border-gold transition-colors duration-500"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-gold flex items-center justify-center">
                  <feature.icon className="h-7 w-7 text-gold" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Vehicles Grid */}
      <section className="section-padding bg-muted">
        <div className="container-luxury">
          <div className="text-center mb-12">
            <p className="text-gold text-sm uppercase tracking-[0.2em] mb-4">
              Our Collection
            </p>
            <h2 className="text-headline">Latest Arrivals</h2>
          </div>
          {allLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-sm h-80 animate-pulse" />
              ))}
            </div>
          ) : allCars && allCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                New inventory coming soon. Contact us for specific requests.
              </p>
              <Button asChild className="btn-gold mt-6">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-obsidian text-platinum">
        <div className="container-luxury">
          <div className="text-center mb-16">
            <p className="text-gold text-sm uppercase tracking-[0.2em] mb-4">
              Client Experiences
            </p>
            <h2 className="text-headline text-white">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 border border-platinum/20 hover:border-gold/50 transition-colors duration-500"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-platinum/80 text-sm leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-gold text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-hero text-white relative overflow-hidden">
        <div className="container-luxury relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-headline mb-6">
              Ready to Experience Luxury?
            </h2>
            <p className="text-platinum/80 text-lg mb-8">
              Visit our showroom or contact us today to find your perfect vehicle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-gold">
                <Link to="/shop">
                  Browse Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="btn-outline-gold">
                <a href="https://wa.me/2348133629899" target="_blank" rel="noopener noreferrer">
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
