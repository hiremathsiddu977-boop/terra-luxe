import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, X } from 'lucide-react';
import {
  CustomerBooking,
  CustomerProfile,
  DESTINATION_HUBS,
  HospitalityTier,
  PROGRAM_MULTIPLIERS,
  ProgramType,
  TIER_MULTIPLIERS,
} from '../data/businessTourismData';
import { formatUsd } from '../utils/formatters';

export interface BookingDraft {
  hubId: string;
  programType?: ProgramType;
  guests?: number;
  days?: number;
  tier?: HospitalityTier;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: BookingDraft | null;
  customer: CustomerProfile;
  onCreateBooking: (booking: CustomerBooking) => void;
}

const PROGRAM_TYPES = Object.keys(PROGRAM_MULTIPLIERS) as ProgramType[];
const TIERS: HospitalityTier[] = ['Executive', 'Boardroom Luxury'];

function addDaysIso(startIso: string, daysToAdd: number): string {
  const d = new Date(startIso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '2027-05-21';
  d.setDate(d.getDate() + daysToAdd);
  return d.toISOString().slice(0, 10);
}

export function BookingModal({
  isOpen,
  onClose,
  draft,
  customer,
  onCreateBooking,
}: BookingModalProps) {
  const [hubId, setHubId] = useState(DESTINATION_HUBS[0].id);
  const [programType, setProgramType] = useState<ProgramType>('Business & Leisure Stay');
  const [tier, setTier] = useState<HospitalityTier>('Executive');
  const [customerName, setCustomerName] = useState(customer.name);
  const [customerEmail, setCustomerEmail] = useState(customer.email);
  const [company, setCompany] = useState(customer.company);
  const [checkInDate, setCheckInDate] = useState('2027-05-18');
  const [checkOutDate, setCheckOutDate] = useState('2027-05-21');
  const [guests, setGuests] = useState(12);
  const [specialRequests, setSpecialRequests] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<CustomerBooking | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setConfirmedBooking(null);
    setErrorMsg(null);
    setCustomerName(customer.name);
    setCustomerEmail(customer.email);
    setCompany(customer.company);

    if (draft) {
      setHubId(draft.hubId || DESTINATION_HUBS[0].id);
      setProgramType(draft.programType || 'Business & Leisure Stay');
      setTier(draft.tier || 'Executive');
      setGuests(draft.guests || 12);
      const nights = Math.max(1, draft.days || 3);
      const baseStart = '2027-05-18';
      setCheckInDate(baseStart);
      setCheckOutDate(addDaysIso(baseStart, nights));
    }
  }, [isOpen, draft, customer]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const activeHub = useMemo(
    () => DESTINATION_HUBS.find((h) => h.id === hubId) || DESTINATION_HUBS[0],
    [hubId]
  );

  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate + 'T00:00:00');
    const end = new Date(checkOutDate + 'T00:00:00');
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Number.isFinite(diff) && diff > 0 ? diff : 0;
  }, [checkInDate, checkOutDate]);

  const pricing = useMemo(() => {
    const effectiveNights = Math.max(1, nights);
    const safeGuests = Number.isFinite(guests) ? guests : 1;
    const effectiveGuests = Math.max(1, Math.min(safeGuests, activeHub.maxDelegates));
    const perGuestNight =
      activeHub.baseDailyRateUsd *
      PROGRAM_MULTIPLIERS[programType].factor *
      TIER_MULTIPLIERS[tier];
    const subtotal = Math.round(perGuestNight * effectiveGuests * effectiveNights);
    const serviceAndProtocol = Math.round(subtotal * 0.08);
    const totalUsd = subtotal + serviceAndProtocol;

    return {
      effectiveNights,
      effectiveGuests,
      subtotal,
      serviceAndProtocol,
      totalUsd,
    };
  }, [activeHub, nights, guests, programType, tier]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim());
    if (!customerName.trim() || !emailOk) {
      setErrorMsg('Enter a valid customer name and email address.');
      return;
    }
    if (nights < 1) {
      setErrorMsg('Check-out date must be at least one day after check-in.');
      return;
    }
    if (guests < 1 || guests > activeHub.maxDelegates) {
      setErrorMsg(
        `Guest count for ${activeHub.city} must be between 1 and ${activeHub.maxDelegates}.`
      );
      return;
    }

    setErrorMsg(null);
    const randomCode = String(Math.floor(1000 + Math.random() * 9000));
    const newBooking: CustomerBooking = {
      id: `bk-${Date.now()}`,
      referenceCode: `MC-${activeHub.airportCode}-${randomCode}`,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      company: company.trim() || 'Private Executive Booking',
      hubId: activeHub.id,
      city: activeHub.city,
      country: activeHub.country,
      airportCode: activeHub.airportCode,
      programType,
      tier,
      checkInDate,
      checkOutDate,
      nights: pricing.effectiveNights,
      guests: pricing.effectiveGuests,
      totalUsd: pricing.totalUsd,
      status: 'Confirmed',
      createdAt: new Date().toISOString().slice(0, 10),
      specialRequests: specialRequests.trim() || undefined,
    };

    onCreateBooking(newBooking);
    setConfirmedBooking(newBooking);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#030916]/85"
      onClick={onClose}
    >
      <div
        className="bg-[#0c1b3a] border border-sky-300/25 rounded-xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-slate-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-[#0c1b3a] border-b border-sky-300/15 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-amber-300">
              Instant Corporate &amp; Executive Reservation
            </p>
            <h3
              id="booking-modal-title"
              className="font-display text-xl sm:text-2xl font-semibold text-white"
            >
              {confirmedBooking ? 'Reservation Confirmed' : `Book ${activeHub.city}`}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking dialog"
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBooking ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h4 className="font-display text-lg font-semibold text-white">
                  Booking Reference {confirmedBooking.referenceCode}
                </h4>
                <p className="mt-1 text-sm text-sky-100/80">
                  Your reservation in {confirmedBooking.city}, {confirmedBooking.country} is active
                  and visible inside the Customer Portal. Free cancellation is available up to 14
                  days prior to check-in.
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-[#091630] border border-sky-300/20 rounded-lg text-sm">
              <div>
                <dt className="text-xs text-sky-200/70">Traveler / Lead</dt>
                <dd className="mt-0.5 font-medium text-white">
                  {confirmedBooking.customerName} ({confirmedBooking.company})
                </dd>
              </div>
              <div>
                <dt className="text-xs text-sky-200/70">Program &amp; Tier</dt>
                <dd className="mt-0.5 font-medium text-white">
                  {confirmedBooking.programType} · {confirmedBooking.tier}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-sky-200/70">Stay Window</dt>
                <dd className="mt-0.5 font-mono text-sky-50 tabular-nums">
                  {confirmedBooking.checkInDate} → {confirmedBooking.checkOutDate} (
                  {confirmedBooking.nights} nights)
                </dd>
              </div>
              <div>
                <dt className="text-xs text-sky-200/70">Total Confirmed</dt>
                <dd className="mt-0.5 font-mono font-semibold text-amber-300 tabular-nums">
                  {formatUsd(confirmedBooking.totalUsd)} ({confirmedBooking.guests} guests)
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <a
                href="#customer-portal"
                onClick={onClose}
                className="px-5 py-2.5 min-h-[40px] inline-flex items-center justify-center text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
              >
                View in Customer Portal
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {errorMsg && (
              <div
                role="alert"
                className="p-3.5 text-sm text-rose-200 bg-rose-950/70 border border-rose-400/40 rounded-lg"
              >
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="bk-hub" className="block text-sm font-medium text-white mb-1.5">
                  Destination
                </label>
                <select
                  id="bk-hub"
                  value={hubId}
                  onChange={(e) => setHubId(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm text-white bg-[#091630] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {DESTINATION_HUBS.map((hub) => (
                    <option key={hub.id} value={hub.id}>
                      {hub.city}, {hub.country} ({hub.airportCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="bk-program"
                  className="block text-sm font-medium text-white mb-1.5"
                >
                  Program Type
                </label>
                <select
                  id="bk-program"
                  value={programType}
                  onChange={(e) => setProgramType(e.target.value as ProgramType)}
                  className="w-full h-11 px-3.5 text-sm text-white bg-[#091630] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {PROGRAM_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label
                  htmlFor="bk-checkin"
                  className="block text-sm font-medium text-white mb-1.5"
                >
                  Check-In Date
                </label>
                <input
                  id="bk-checkin"
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full h-11 px-3.5 font-mono text-sm text-white bg-[#091630] border border-sky-300/25 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label
                  htmlFor="bk-checkout"
                  className="block text-sm font-medium text-white mb-1.5"
                >
                  Check-Out Date
                </label>
                <input
                  id="bk-checkout"
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full h-11 px-3.5 font-mono text-sm text-white bg-[#091630] border border-sky-300/25 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label
                  htmlFor="bk-guests"
                  className="block text-sm font-medium text-white mb-1.5"
                >
                  Travelers / Delegates
                </label>
                <input
                  id="bk-guests"
                  type="number"
                  min={1}
                  max={activeHub.maxDelegates}
                  value={guests}
                  onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full h-11 px-3.5 font-mono text-sm text-white bg-[#091630] border border-sky-300/25 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label
                  htmlFor="bk-name"
                  className="block text-sm font-medium text-white mb-1.5"
                >
                  Customer Name
                </label>
                <input
                  id="bk-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm text-white bg-[#091630] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label
                  htmlFor="bk-email"
                  className="block text-sm font-medium text-white mb-1.5"
                >
                  Customer Email
                </label>
                <input
                  id="bk-email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm text-white bg-[#091630] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label
                  htmlFor="bk-company"
                  className="block text-sm font-medium text-white mb-1.5"
                >
                  Company / Group
                </label>
                <input
                  id="bk-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm text-white bg-[#091630] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-white mb-2">
                Hospitality &amp; Transfer Tier
              </span>
              <div className="grid grid-cols-2 gap-2">
                {TIERS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTier(option)}
                    className={`px-4 py-2.5 text-sm font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                      tier === option
                        ? 'border-amber-400 bg-amber-400/15 text-white font-semibold'
                        : 'border-sky-300/25 bg-[#091630] text-sky-100/85 hover:border-sky-300/45'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="bk-notes"
                className="block text-sm font-medium text-white mb-1.5"
              >
                Transfer, Landmark Tour, or Room Notes (Optional)
              </label>
              <input
                id="bk-notes"
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="E.g. Private Eiffel Tower dinner transfer, adjoining suites, airport VIP fast-track"
                className="w-full h-11 px-3.5 text-sm text-white placeholder:text-sky-200/45 bg-[#091630] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="bg-[#091630] border border-sky-300/20 rounded-lg p-5 space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-sky-100/80">
                <span>
                  {activeHub.city} ({pricing.effectiveGuests} guests × {pricing.effectiveNights}{' '}
                  nights)
                </span>
                <span className="font-mono tabular-nums text-white">
                  {formatUsd(pricing.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sky-100/80">
                <span>Concierge Dispatch &amp; Tarmac Fast-Track (8%)</span>
                <span className="font-mono tabular-nums text-white">
                  {formatUsd(pricing.serviceAndProtocol)}
                </span>
              </div>
              <div className="pt-2.5 border-t border-sky-300/15 flex items-center justify-between font-semibold text-white">
                <span>Total Reservation</span>
                <span className="font-mono text-lg tabular-nums text-amber-300">
                  {formatUsd(pricing.totalUsd)}
                </span>
              </div>
              <p className="text-xs text-sky-200/70 flex items-center gap-1.5 pt-1">
                <Calendar className="w-3.5 h-3.5 shrink-0 text-amber-300" aria-hidden="true" />
                <span>
                  100% refundable cancellation up to 14 days before check-in; 50% refund 7–13 days
                  prior.
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 min-h-[40px] text-sm font-medium text-sky-100 bg-[#142b59] border border-sky-300/25 hover:bg-[#1a3770] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 min-h-[40px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
