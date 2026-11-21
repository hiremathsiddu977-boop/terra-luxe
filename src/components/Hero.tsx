import { ArrowRight } from 'lucide-react';
import { HERO_MEDIA, HERO_METRICS } from '../data/businessTourismData';
import { ResilientImage } from './ResilientImage';

interface HeroProps {
  onBookDestination: () => void;
}

export function Hero({ onBookDestination }: HeroProps) {
  return (
    <section className="relative bg-[#071124] text-white overflow-hidden border-b border-sky-300/15">
      <div className="absolute inset-0">
        <ResilientImage
          src={HERO_MEDIA.imageUrl}
          alt={HERO_MEDIA.imageAlt}
          fallbackTitle="Cantilevered Alpine Fjord Executive Pavilion"
          darkFallback
          priority
          className="w-full h-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#050d1d]/92 via-[#07152e]/70 to-[#07152e]/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#071124] via-[#071124]/25 to-[#071124]/40"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-14 lg:pt-28 lg:pb-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-amber-300 tracking-wide mb-4">
            Paris · Dubai · New York · London · Zurich · Singapore · Barcelona · Kyoto
          </p>

          <h1
            className="font-display font-semibold tracking-tight text-white leading-[1.08]"
            style={{
              fontSize: 'clamp(2.25rem, 4vw, 3.75rem)',
              textWrap: 'balance',
            }}
          >
            Global business tourism &amp; customer booking portal.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-sky-100/90 leading-relaxed max-w-xl tracking-[0.01em]">
            Reserve executive summits, corporate retreats, and luxury city stays across the
            world&apos;s most iconic destinations—with direct self-service booking management and
            flexible cancellations in one portal.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={onBookDestination}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 min-h-[44px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg whitespace-nowrap shrink-0 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071124] focus-visible:ring-amber-400"
            >
              <span>Make a Reservation</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <a
              href="#customer-portal"
              className="inline-flex items-center min-h-[44px] text-sm font-medium text-sky-100 hover:text-amber-300 underline underline-offset-4 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm"
            >
              Manage or Cancel Bookings
            </a>
          </div>
        </div>

        <div className="mt-14 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 bg-[#091630]/92 rounded-xl p-6 sm:p-8 border border-sky-300/20">
          {HERO_METRICS.map((metric) => (
            <div key={metric.label}>
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-amber-300 tabular-nums tracking-tight">
                {metric.value}
              </div>
              <div className="mt-1 text-sm font-medium text-white">{metric.label}</div>
              <div className="mt-0.5 text-xs text-sky-100/75">{metric.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
