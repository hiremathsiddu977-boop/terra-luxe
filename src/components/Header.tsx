import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  activeView: 'portal' | 'owner';
  onNavigateSection: (sectionId: string) => void;
  onOpenOwnerPage: () => void;
  onBookTrip: () => void;
}

export function Header({
  activeView,
  onNavigateSection,
  onOpenOwnerPage,
  onBookTrip,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileOpen(false);
    onNavigateSection(sectionId);
  };

  const handleOwnerClick = () => {
    setMobileOpen(false);
    onOpenOwnerPage();
  };

  const handleMobileAction = () => {
    setMobileOpen(false);
    onBookTrip();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#071124] border-b border-sky-300/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigateSection('top');
          }}
          className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm"
        >
          Meridian Corporate
        </a>

        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-sky-100/80"
        >
          <a
            href="#destinations"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('destinations');
            }}
            className="hover:text-amber-300 underline-offset-4 hover:underline transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm"
          >
            Destinations
          </a>
          <a
            href="#customer-portal"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('customer-portal');
            }}
            className="hover:text-amber-300 underline-offset-4 hover:underline transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm"
          >
            Customer Portal
          </a>
          <a
            href="#estimator"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('estimator');
            }}
            className="hover:text-amber-300 underline-offset-4 hover:underline transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm"
          >
            Estimator
          </a>
          <button
            type="button"
            onClick={handleOwnerClick}
            className={`underline-offset-4 hover:underline transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm ${
              activeView === 'owner'
                ? 'text-amber-300 underline font-semibold'
                : 'hover:text-amber-300'
            }`}
          >
            Owner Login
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onBookTrip}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 min-h-[40px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071124] focus-visible:ring-amber-400"
          >
            Book Destination
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-sky-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-sky-300/15 bg-[#0a1834] px-4 py-4">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
            <a
              href="#destinations"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('destinations');
              }}
              className="px-3 py-3 text-base font-medium text-sky-100 hover:text-amber-300 hover:bg-white/5 rounded-lg transition-colors duration-150"
            >
              Destinations
            </a>
            <a
              href="#customer-portal"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('customer-portal');
              }}
              className="px-3 py-3 text-base font-medium text-sky-100 hover:text-amber-300 hover:bg-white/5 rounded-lg transition-colors duration-150"
            >
              Customer Portal
            </a>
            <a
              href="#estimator"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('estimator');
              }}
              className="px-3 py-3 text-base font-medium text-sky-100 hover:text-amber-300 hover:bg-white/5 rounded-lg transition-colors duration-150"
            >
              Estimator
            </a>
            <button
              type="button"
              onClick={handleOwnerClick}
              className="text-left px-3 py-3 text-base font-medium text-amber-300 hover:bg-white/5 rounded-lg transition-colors duration-150 cursor-pointer"
            >
              Owner Login
            </button>
            <button
              type="button"
              onClick={handleMobileAction}
              className="mt-2 w-full px-4 py-3 min-h-[44px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors duration-150 cursor-pointer"
            >
              Book Destination
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
