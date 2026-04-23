import React from "react";
import { Link } from "react-router-dom";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  ShieldCheck
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-primary-olive/10 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-bold text-primary-olive font-serif tracking-tighter">
              VAYA <span className="text-accent-clay">Discovery</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Crafting bespoke luxury journeys across the heart of Southern Africa. From the peaks of Table Mountain to the waters of the Okavango.
            </p>
            <div className="flex gap-4">
              <Link to="#" className="w-10 h-10 rounded-full bg-bg-warm flex items-center justify-center text-primary-olive hover:bg-primary-olive hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-bg-warm flex items-center justify-center text-primary-olive hover:bg-primary-olive hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-bg-warm flex items-center justify-center text-primary-olive hover:bg-primary-olive hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-primary-olive uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/packages" className="text-text-muted hover:text-primary-olive transition-colors text-sm">Curated Packages</Link></li>
              <li><Link to="/concierge" className="text-text-muted hover:text-primary-olive transition-colors text-sm">Personal Concierge</Link></li>
              <li><Link to="/onboarding" className="text-text-muted hover:text-primary-olive transition-colors text-sm">Trip Builder</Link></li>
              <li><Link to="/cape-town" className="text-text-muted hover:text-primary-olive transition-colors text-sm">Destinations</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-primary-olive uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center text-text-muted text-sm">
                <Phone className="w-4 h-4 mr-3 text-accent-clay" /> +27 12 345 6789
              </li>
              <li className="flex items-center text-text-muted text-sm">
                <Mail className="w-4 h-4 mr-3 text-accent-clay" /> hello@vaya-discovery.com
              </li>
              <li className="flex items-center text-text-muted text-sm">
                <MapPin className="w-4 h-4 mr-3 text-accent-clay" /> V&A Waterfront, Cape Town
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-primary-olive uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-text-muted text-xs mb-4">Join our list for exclusive travel inspiration.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email" 
                className="bg-bg-warm border border-primary-olive/10 rounded-xl px-4 py-2 text-xs flex-grow focus:outline-none focus:ring-1 focus:ring-primary-olive/20"
              />
              <button className="bg-primary-olive text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-olive/90 transition-all">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-olive/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
            © 2026 VAYA Discovery. All rights reserved.
          </p>
          <div className="flex gap-8 items-center">
            <Link to="#" className="text-[10px] text-text-muted hover:text-primary-olive uppercase tracking-widest font-bold">Privacy Policy</Link>
            <Link to="#" className="text-[10px] text-text-muted hover:text-primary-olive uppercase tracking-widest font-bold">Terms of Service</Link>
            <Link to="/admin/leads" className="flex items-center text-[10px] text-accent-clay hover:text-primary-olive uppercase tracking-widest font-bold group">
              <ShieldCheck className="w-3 h-3 mr-1 group-hover:scale-110 transition-transform" /> Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
