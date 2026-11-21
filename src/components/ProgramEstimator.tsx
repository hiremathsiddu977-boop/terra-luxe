import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  DESTINATION_HUBS,
  EstimateTransferPayload,
  HospitalityTier,
  PROGRAM_MULTIPLIERS,
  ProgramType,
  TIER_MULTIPLIERS,
} from '../data/businessTourismData';
import { formatUsd } from '../utils/formatters';

interface ProgramEstimatorProps {
  selectedHubId: string;
  onTransferEstimate: (payload: EstimateTransferPayload) => void;
  onBookEstimate: (payload: EstimateTransferPayload) => void;
}

const PROGRAM_TYPES = Object.keys(PROGRAM_MULTIPLIERS) as ProgramType[];
const TIERS: HospitalityTier[] = ['Executive', 'Boardroom Luxury'];

export function ProgramEstimator({
  selectedHubId,
  onTransferEstimate,
  onBookEstimate,
}: ProgramEstimatorProps) {
  const [hubId, setHubId] = useState<string>(selectedHubId || DESTINATION_HUBS[0].id);

  useEffect(() => {
    if (selectedHubId) {
      setHubId(selectedHubId);
    }
  }, [selectedHubId]);

  const [programType, setProgramType] = useState<ProgramType>('Executive Retreat');
  const [delegates, setDelegates] = useState<number>(60);
  const [days, setDays] = useState<number>(3);
  const [tier, setTier] = useState<HospitalityTier>('Executive');

  const activeHub = useMemo(
    () => DESTINATION_HUBS.find((h) => h.id === hubId) || DESTINATION_HUBS[0],
    [hubId]
  );

  const clampedDelegates = Math.min(delegates, activeHub.maxDelegates);

  const breakdown = useMemo(() => {
    const rate = activeHub.baseDailyRateUsd;
    const progFactor = PROGRAM_MULTIPLIERS[programType].factor;
    const tierFactor = TIER_MULTIPLIERS[tier];

    const perDelegateDaily = rate * progFactor * tierFactor;
    const grossTotal = Math.round(perDelegateDaily * clampedDelegates * days);

    const hospitalityAccommodation = Math.round(grossTotal * 0.46);
    const venuesProductionAv = Math.round(grossTotal * 0.24);
    const transfersProtocol = Math.round(grossTotal * 0.18);
    const onSiteOperations =
      grossTotal - hospitalityAccommodation - venuesProductionAv - transfersProtocol;

    const perDelegateTotal = Math.round(grossTotal / Math.max(clampedDelegates, 1));

    return {
      grossTotal,
      perDelegateTotal,
      hospitalityAccommodation,
      venuesProductionAv,
      transfersProtocol,
      onSiteOperations,
    };
  }, [activeHub, programType, tier, clampedDelegates, days]);

  return (
    <section
      id="estimator"
      className="cv-auto py-16 lg:py-24 bg-[#09152e] border-b border-sky-300/15"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white"
            style={{ textWrap: 'balance' }}
          >
            Transparent program budget estimator.
          </h2>
          <p className="mt-4 text-base text-sky-100/80 leading-relaxed">
            Model preliminary land, venue, audiovisual, and ground-protocol allocations before
            confirming a booking or submitting a formal RFP.
          </p>
        </div>

        <div className="mt-10 bg-[#0e1f42] border border-sky-300/20 rounded-xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-7">
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                1. Program Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PROGRAM_TYPES.map((type) => {
                  const active = programType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setProgramType(type)}
                      className={`text-left px-4 py-3 rounded-lg border transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                        active
                          ? 'border-amber-400 bg-amber-400/15 text-white'
                          : 'border-sky-300/20 bg-[#091630] text-sky-100/85 hover:border-sky-300/40'
                      }`}
                    >
                      <div className="text-sm font-semibold">{type}</div>
                      <div className="mt-1 text-xs text-sky-200/70">
                        {PROGRAM_MULTIPLIERS[type].description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="estimator-hub"
                  className="block text-sm font-medium text-white mb-2"
                >
                  2. Destination Hub
                </label>
                <select
                  id="estimator-hub"
                  value={hubId}
                  onChange={(e) => setHubId(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm text-white bg-[#091630] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                >
                  {DESTINATION_HUBS.map((hub) => (
                    <option key={hub.id} value={hub.id}>
                      {hub.city}, {hub.country} (up to {hub.maxDelegates} delegates)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-sm font-medium text-white mb-2">
                  3. Hospitality Standard
                </span>
                <div className="grid grid-cols-2 gap-1 p-1 bg-[#091630] border border-sky-300/20 rounded-lg">
                  {TIERS.map((option) => {
                    const active = tier === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setTier(option)}
                        className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                            : 'text-sky-100/80 hover:text-white'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="estimator-delegates"
                    className="text-sm font-medium text-white"
                  >
                    4. Delegate Headcount
                  </label>
                  <span className="font-mono text-sm font-semibold text-amber-300 tabular-nums">
                    {clampedDelegates} delegates
                  </span>
                </div>
                <input
                  id="estimator-delegates"
                  type="range"
                  min={15}
                  max={activeHub.maxDelegates}
                  step={5}
                  value={clampedDelegates}
                  onChange={(e) => setDelegates(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="mt-1 flex justify-between text-xs text-sky-200/60 font-mono tabular-nums">
                  <span>15</span>
                  <span>{activeHub.maxDelegates} max</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">5. Program Duration</span>
                  <span className="font-mono text-sm font-semibold text-amber-300 tabular-nums">
                    {days} days
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[2, 3, 4, 5, 6].map((dayCount) => {
                    const active = days === dayCount;
                    return (
                      <button
                        key={dayCount}
                        type="button"
                        onClick={() => setDays(dayCount)}
                        className={`h-10 text-sm font-mono font-medium rounded-lg border transition-colors cursor-pointer tabular-nums ${
                          active
                            ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                            : 'bg-[#091630] text-sky-100 border-sky-300/25 hover:border-sky-300/45'
                        }`}
                      >
                        {dayCount}d
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-[#122b5c] to-[#0a1a3a] border border-sky-300/25 text-white rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-sky-200">
                Indicative Land &amp; Production Allocation
              </div>
              <div className="mt-2 font-mono text-3xl sm:text-4xl font-semibold text-amber-300 tabular-nums tracking-tight">
                {formatUsd(breakdown.grossTotal)}
              </div>
              <div className="mt-1 text-sm text-sky-100/85 font-mono tabular-nums">
                {formatUsd(breakdown.perDelegateTotal)} per delegate · {activeHub.city} ({days}{' '}
                days)
              </div>

              <dl className="mt-8 space-y-3.5 pt-6 border-t border-sky-300/20 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sky-100/85">5-Star Accommodation &amp; Dining</dt>
                  <dd className="font-mono font-medium text-white tabular-nums">
                    {formatUsd(breakdown.hospitalityAccommodation)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sky-100/85">Plenary Buyout, Staging &amp; AV</dt>
                  <dd className="font-mono font-medium text-white tabular-nums">
                    {formatUsd(breakdown.venuesProductionAv)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sky-100/85">VIP Tarmac &amp; Ground Fleet</dt>
                  <dd className="font-mono font-medium text-white tabular-nums">
                    {formatUsd(breakdown.transfersProtocol)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sky-100/85">On-Site Producers &amp; Concierge</dt>
                  <dd className="font-mono font-medium text-white tabular-nums">
                    {formatUsd(breakdown.onSiteOperations)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 pt-6 border-t border-sky-300/20 space-y-2.5">
              <p className="text-xs text-sky-200/75 leading-relaxed mb-3">
                Excludes commercial airfare, which is consolidated at negotiated corporate IATA
                contract rates during formal scoping.
              </p>
              <button
                type="button"
                onClick={() =>
                  onBookEstimate({
                    hubId: activeHub.id,
                    programType,
                    delegates: clampedDelegates,
                    days,
                    tier,
                    estimatedTotalUsd: breakdown.grossTotal,
                  })
                }
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span>Book This Program Now</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() =>
                  onTransferEstimate({
                    hubId: activeHub.id,
                    programType,
                    delegates: clampedDelegates,
                    days,
                    tier,
                    estimatedTotalUsd: breakdown.grossTotal,
                  })
                }
                className="w-full inline-flex items-center justify-center px-5 py-2.5 min-h-[40px] text-xs font-medium text-sky-100 border border-sky-300/25 hover:bg-white/10 rounded-lg transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Transfer Estimate to Custom RFP
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
