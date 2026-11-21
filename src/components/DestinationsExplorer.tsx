import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import {
  DESTINATION_HUBS,
  DestinationHub,
  RegionFilter,
} from '../data/businessTourismData';
import { ResilientImage } from './ResilientImage';

interface DestinationsExplorerProps {
  onBookDestination: (hubId: string) => void;
  onSelectHubForProposal: (hubId: string) => void;
}

const REGION_TABS: { id: RegionFilter; label: string }[] = [
  { id: 'all', label: 'All Destinations' },
  { id: 'europe', label: 'Europe' },
  { id: 'asia-pacific', label: 'Asia-Pacific' },
  { id: 'americas-mea', label: 'Americas & Middle East' },
];

export function DestinationsExplorer({
  onBookDestination,
  onSelectHubForProposal,
}: DestinationsExplorerProps) {
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedHub, setInspectedHub] = useState<DestinationHub | null>(null);
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  const visibleHubs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return DESTINATION_HUBS.filter((hub) => {
      const regionOk = regionFilter === 'all' || hub.region === regionFilter;
      if (!regionOk) return false;
      if (!q) return true;
      return (
        hub.city.toLowerCase().includes(q) ||
        hub.country.toLowerCase().includes(q) ||
        hub.famousLandmarks.toLowerCase().includes(q)
      );
    });
  }, [regionFilter, searchQuery]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && inspectedHub) {
        setInspectedHub(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectedHub]);

  const openHubDossier = (hub: DestinationHub) => {
    setActiveDayIdx(0);
    setInspectedHub(hub);
  };

  return (
    <section
      id="destinations"
      className="py-16 lg:py-24 bg-[#09152e] border-b border-sky-300/15"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              World-famous business &amp; executive leisure destinations.
            </h2>
            <p className="mt-4 text-base text-sky-100/80 leading-relaxed">
              Explore iconic global cities with pre-audited corporate venues, landmark private
              access, and instant customer booking availability.
            </p>
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search
              className="w-4 h-4 text-sky-300/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city or landmark..."
              aria-label="Search destinations by city or landmark"
              className="w-full h-11 pl-10 pr-3.5 text-sm text-white placeholder:text-sky-200/50 bg-[#0d1f42] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />
          </div>
        </div>

        <div className="mt-6">
          <div
            role="group"
            aria-label="Filter destinations by region"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#0d1f42] border border-sky-300/20 rounded-lg"
          >
            {REGION_TABS.map((tab) => {
              const active = regionFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRegionFilter(tab.id)}
                  className={`px-3.5 py-2 min-h-[40px] text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    active
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                      : 'text-sky-100/80 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {visibleHubs.length === 0 ? (
          <div className="mt-10 p-12 bg-[#0e1f42] border border-sky-300/20 rounded-xl text-center">
            <p className="font-display text-base font-semibold text-white">
              No destinations match “{searchQuery}”
            </p>
            <button
              type="button"
              onClick={() => {
                setRegionFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 min-h-[40px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer"
            >
              Show All 8 Destinations
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {visibleHubs.map((hub) => (
              <article
                key={hub.id}
                className="bg-[#0e1f42] border border-sky-300/20 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-[#071124] border-b border-sky-300/15">
                    <ResilientImage
                      src={hub.imageUrl}
                      alt={hub.imageAlt}
                      fallbackTitle={`${hub.city}, ${hub.country}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    />
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-sky-200/75 font-medium">
                      <span>{hub.regionLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{hub.country}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {hub.transferMinutes} min from {hub.airportCode}
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                      {hub.city}
                    </h3>

                    <p className="mt-1.5 text-xs font-medium text-amber-300">
                      {hub.famousLandmarks}
                    </p>

                    <p className="mt-3 text-sm sm:text-base text-sky-100/80 leading-relaxed">
                      {hub.headline}
                    </p>

                    <div className="mt-6 pt-5 border-t border-sky-300/15 grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-sky-200/70">Max Capacity</div>
                        <div className="mt-1 font-mono text-base font-semibold text-white tabular-nums">
                          {hub.maxDelegates}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-sky-200/70">Breakout Suites</div>
                        <div className="mt-1 font-mono text-base font-semibold text-white tabular-nums">
                          {hub.breakoutRooms}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-sky-200/70">Daily Rate</div>
                        <div className="mt-1 font-mono text-base font-semibold text-amber-300 tabular-nums">
                          ${hub.baseDailyRateUsd}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => openHubDossier(hub)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[40px] text-sm font-medium text-sky-100 bg-[#142b59] border border-sky-300/25 hover:bg-[#1a3770] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <span>Inspect Hub &amp; Agenda</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onBookDestination(hub.id)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 min-h-[40px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <span>Book Destination</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {inspectedHub && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="hub-dossier-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#030916]/80 backdrop-blur-sm"
          onClick={() => setInspectedHub(null)}
        >
          <div
            className="bg-[#0c1b3a] border border-sky-300/25 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-[#0c1b3a] border-b border-sky-300/15 px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-amber-300">
                  {inspectedHub.regionLabel} · {inspectedHub.country} · Peak Season:{' '}
                  {inspectedHub.bestMonths}
                </p>
                <h3
                  id="hub-dossier-title"
                  className="font-display text-xl sm:text-2xl font-semibold text-white"
                >
                  {inspectedHub.city} Corporate Hub Dossier
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedHub(null)}
                aria-label="Close hub dossier"
                className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-sky-300/15">
                <div>
                  <div className="text-xs text-sky-200/70">Airport Transfer</div>
                  <div className="mt-1 font-mono text-base font-semibold text-white tabular-nums">
                    {inspectedHub.transferMinutes} min ({inspectedHub.airportCode})
                  </div>
                </div>
                <div>
                  <div className="text-xs text-sky-200/70">Plenary Footprint</div>
                  <div className="mt-1 font-mono text-base font-semibold text-white tabular-nums">
                    {inspectedHub.plenarySqm.toLocaleString()} m²
                  </div>
                </div>
                <div>
                  <div className="text-xs text-sky-200/70">Breakout Capacity</div>
                  <div className="mt-1 font-mono text-base font-semibold text-white tabular-nums">
                    {inspectedHub.breakoutRooms} suites
                  </div>
                </div>
                <div>
                  <div className="text-xs text-sky-200/70">Daily Rate</div>
                  <div className="mt-1 font-mono text-base font-semibold text-amber-300 tabular-nums">
                    ${inspectedHub.baseDailyRateUsd} / guest
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-display text-base font-semibold text-white">
                  Signature Landmarks &amp; Operational Profile
                </h4>
                <p className="mt-1 text-xs font-medium text-amber-300">
                  {inspectedHub.famousLandmarks}
                </p>
                <p className="mt-2 text-sm sm:text-base text-sky-100/80 leading-relaxed">
                  {inspectedHub.summary}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-sky-100/90">
                  {inspectedHub.venueHighlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h4 className="font-display text-base font-semibold text-white">
                    Sample 3-Day Executive Schedule
                  </h4>
                  <div className="inline-flex items-center gap-1 p-1 bg-[#132954] rounded-lg self-start">
                    {inspectedHub.sampleAgenda.map((item, idx) => (
                      <button
                        key={item.day}
                        type="button"
                        onClick={() => setActiveDayIdx(idx)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          activeDayIdx === idx
                            ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                            : 'text-sky-100/80 hover:text-white'
                        }`}
                      >
                        {item.day}
                      </button>
                    ))}
                  </div>
                </div>

                {inspectedHub.sampleAgenda[activeDayIdx] && (
                  <div className="bg-[#11244b] border border-sky-300/20 rounded-lg p-5 space-y-4">
                    <div className="text-sm font-semibold text-white">
                      {inspectedHub.sampleAgenda[activeDayIdx].day} —{' '}
                      {inspectedHub.sampleAgenda[activeDayIdx].focus}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-sky-300/15">
                      <div>
                        <div className="text-xs font-medium text-amber-300">Morning</div>
                        <p className="mt-1 text-sm text-sky-100/85 leading-relaxed">
                          {inspectedHub.sampleAgenda[activeDayIdx].morning}
                        </p>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-amber-300">Afternoon</div>
                        <p className="mt-1 text-sm text-sky-100/85 leading-relaxed">
                          {inspectedHub.sampleAgenda[activeDayIdx].afternoon}
                        </p>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-amber-300">Evening</div>
                        <p className="mt-1 text-sm text-sky-100/85 leading-relaxed">
                          {inspectedHub.sampleAgenda[activeDayIdx].evening}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-sky-300/15 px-6 py-4 bg-[#09152e] flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  onSelectHubForProposal(inspectedHub.id);
                  setInspectedHub(null);
                }}
                className="text-xs font-medium text-sky-200 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
              >
                Request Custom RFP Brief Instead
              </button>
              <button
                type="button"
                onClick={() => {
                  onBookDestination(inspectedHub.id);
                  setInspectedHub(null);
                }}
                className="px-5 py-2.5 min-h-[40px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Book {inspectedHub.city} Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
