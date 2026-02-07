import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-obsidian text-platinum">
      {/* Main Footer */}
      <div className="container-luxury section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl font-semibold text-white mb-2">
              Prosperous Autos
            </h3>
            <p className="text-gold text-sm tracking-widest uppercase mb-6">
              Luxury on Wheels | Driven by Trust
            </p>
            <p className="text-platinum/70 text-sm leading-relaxed">
              Welcome to Prosperous Autos Limited. We appreciate your trust in us 
              for your luxury automotive needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Collection', href: '/shop' },
                { name: 'About Us', href: '/about' },
                { name: 'Videos', href: '/videos' },
                { name: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-platinum/70 hover:text-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-platinum/70 text-sm">
                  Gwarinpa Expressway,<br />FCT Abuja, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                <a
                  href="tel:+2348133629899"
                  className="text-platinum/70 hover:text-gold transition-colors text-sm"
                >
                  +234 813 362 9899
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                <a
                  href="mailto:prosperousautoslimited@gmail.com"
                  className="text-platinum/70 hover:text-gold transition-colors text-sm break-all"
                >
                  prosperousautoslimited@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-6">
              Follow Us
            </h4>
            <div className="flex gap-4 mb-8">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-platinum/30 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-platinum/30 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-platinum/30 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p className="text-platinum/50 text-xs italic">
              "We appreciate your trust."
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-platinum/10">
        <div className="container-luxury py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-platinum/50 text-xs">
              © {new Date().getFullYear()} Prosperous Autos Limited. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/admin" className="text-platinum/50 hover:text-gold text-xs transition-colors">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
