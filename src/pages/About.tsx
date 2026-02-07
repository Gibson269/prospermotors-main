import { Award, Shield, Users, Target, Eye, Heart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Trust',
      description: 'We build lasting relationships through transparency and honesty in every transaction.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Only the finest vehicles that meet our rigorous standards make it to our collection.',
    },
    {
      icon: Users,
      title: 'Service',
      description: 'White-glove service from first inquiry to long after the keys are handed over.',
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We share your love for exceptional automobiles and understand what luxury means.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-obsidian text-white py-24">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">
              Our Story
            </p>
            <h1 className="text-display mb-6">About Us</h1>
            <p className="text-platinum/70 text-xl font-light">
              Driven by Trust. Defined by Excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-background">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold text-sm uppercase tracking-[0.2em] mb-4">
                Who We Are
              </p>
              <h2 className="text-headline mb-6">
                Nigeria's Premier Luxury Auto Destination
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in the heart of Nigeria's capital, Prosperous Autos Limited has established 
                  itself as the trusted name in luxury automobiles. Our journey began with a simple 
                  vision: to bring world-class automotive excellence to discerning Nigerian customers.
                </p>
                <p>
                  Located on Gwarinpa Expressway in FCT Abuja, our showroom showcases a carefully 
                  curated selection of premium vehicles from the world's most prestigious brands. 
                  From Mercedes-Benz to Range Rover, Porsche to BMW, we offer only the finest 
                  automobiles that meet our exacting standards.
                </p>
                <p>
                  What sets us apart is our unwavering commitment to trust and transparency. 
                  Every vehicle in our collection undergoes rigorous inspection and certification, 
                  ensuring you receive nothing but the best. Our team of automotive experts is 
                  dedicated to providing personalized service that matches the luxury of our vehicles.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-hero rounded-sm overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <p className="font-serif text-6xl font-semibold text-gold mb-2">10+</p>
                    <p className="uppercase tracking-wider text-sm">Years of Excellence</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-cream">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-12 bg-white border border-border">
              <div className="w-14 h-14 rounded-full border-2 border-gold flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide Nigeria's elite with access to the world's finest automobiles, 
                backed by exceptional service and unwavering integrity. We strive to make 
                the luxury car buying experience seamless, transparent, and memorable.
              </p>
            </div>
            <div className="p-12 bg-white border border-border">
              <div className="w-14 h-14 rounded-full border-2 border-gold flex items-center justify-center mb-6">
                <Eye className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the definitive luxury automotive destination in West Africa, 
                recognized for our unparalleled selection, trustworthy practices, 
                and the lasting relationships we build with our valued clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container-luxury">
          <div className="text-center mb-16">
            <p className="text-gold text-sm uppercase tracking-[0.2em] mb-4">
              What Drives Us
            </p>
            <h2 className="text-headline">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-8 border border-border hover:border-gold transition-colors duration-500 group"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-muted group-hover:border-gold flex items-center justify-center transition-colors">
                  <value.icon className="h-7 w-7 text-muted-foreground group-hover:text-gold transition-colors" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-obsidian text-white py-20">
        <div className="container-luxury text-center">
          <h2 className="text-headline mb-6">Experience the Difference</h2>
          <p className="text-platinum/70 text-lg max-w-2xl mx-auto mb-8">
            Visit our showroom on Gwarinpa Expressway or contact us today to discover 
            your perfect luxury vehicle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/shop" className="btn-gold inline-flex items-center justify-center">
              View Collection
            </a>
            <a href="/contact" className="btn-outline-gold inline-flex items-center justify-center">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
