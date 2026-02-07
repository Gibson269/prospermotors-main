import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Gwarinpa Expressway', 'FCT Abuja, Nigeria'],
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+234 813 362 9899'],
      link: 'tel:+2348133629899',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['prosperousautoslimited@gmail.com'],
      link: 'mailto:prosperousautoslimited@gmail.com',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Sat: 9:00 AM - 6:00 PM', 'Sunday: By Appointment'],
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-obsidian text-white py-24">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">
              Get in Touch
            </p>
            <h1 className="text-display mb-6">Contact Us</h1>
            <p className="text-platinum/70 text-xl font-light">
              We'd love to hear from you. Reach out to discuss your dream vehicle.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-background">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="font-serif text-3xl font-semibold mb-8">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+234 XXX XXX XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="How can we help?"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell us about your inquiry..."
                    rows={5}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold w-full md:w-auto"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>

              {/* WhatsApp CTA */}
              <div className="mt-8 p-6 bg-muted rounded-sm">
                <p className="text-sm text-muted-foreground mb-4">
                  Prefer instant communication? Chat with us directly on WhatsApp.
                </p>
                <Button asChild className="btn-luxury">
                  <a
                    href="https://wa.me/2348133629899?text=Hello%20Prosperous%20Autos,%20I%20have%20an%20inquiry."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Contact Info & Map */}
            <div>
              <h2 className="font-serif text-3xl font-semibold mb-8">Contact Information</h2>
              
              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="p-6 border border-border hover:border-gold transition-colors duration-500"
                  >
                    <info.icon className="h-6 w-6 text-gold mb-4" />
                    <h3 className="font-semibold mb-2">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      info.link ? (
                        <a
                          key={i}
                          href={info.link}
                          className="block text-muted-foreground text-sm hover:text-gold transition-colors"
                        >
                          {detail}
                        </a>
                      ) : (
                        <p key={i} className="text-muted-foreground text-sm">{detail}</p>
                      )
                    ))}
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="aspect-video bg-muted rounded-sm overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.8!2d7.4!3d9.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sGwarinpa%2C%20Abuja!5e0!3m2!1sen!2sng!4v1600000000000!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Prosperous Autos Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
