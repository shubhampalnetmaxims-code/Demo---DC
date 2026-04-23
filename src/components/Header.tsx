import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-warm/80 backdrop-blur-md border-b border-primary-olive/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-widest text-primary-olive font-serif uppercase">
              Safari<span className="text-accent-clay">Discovery</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-text-muted hover:text-primary-olive transition-colors uppercase tracking-wider">Home</Link>
            <div className="relative group">
              <button className="text-sm font-medium text-text-muted hover:text-primary-olive transition-colors uppercase tracking-wider">Destinations</button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-primary-olive/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/cape-town" className="block px-4 py-2 text-sm text-text-muted hover:text-primary-olive hover:bg-bg-warm">Cape Town</Link>
                <Link to="/johannesburg" className="block px-4 py-2 text-sm text-text-muted hover:text-primary-olive hover:bg-bg-warm">Johannesburg</Link>
                <Link to="/botswana" className="block px-4 py-2 text-sm text-text-muted hover:text-primary-olive hover:bg-bg-warm">Botswana</Link>
              </div>
            </div>
            <Link to="/packages" className="text-sm font-medium text-text-muted hover:text-primary-olive transition-colors uppercase tracking-wider">Packages</Link>
            <Link to="/concierge" className="text-sm font-medium text-text-muted hover:text-primary-olive transition-colors uppercase tracking-wider">Concierge</Link>
            <Link to="/onboarding" className="text-sm font-medium text-text-muted hover:text-primary-olive transition-colors uppercase tracking-wider">Trip Builder</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button asChild className="bg-primary-olive hover:bg-primary-olive/90 text-white rounded-full px-6 font-semibold">
              <Link to="/onboarding">Start Trip</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
