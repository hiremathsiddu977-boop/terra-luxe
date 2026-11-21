import { FormEvent, useMemo, useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Plus,
  Search,
  UserCheck,
  X,
  XCircle,
} from 'lucide-react';
import {
  BookingStatus,
  calculateCancellationPolicy,
  CustomerBooking,
  CustomerProfile,
  DESTINATION_HUBS,
} from '../data/businessTourismData';

interface CustomerPortalProps {
  customer: CustomerProfile;
  onUpdateCustomer: (profile: CustomerProfile) => void;
  bookings: CustomerBooking[];
  onOpenNewBooking: (hubId?: string) => void;
  onCancelBooking: (bookingId: string, reason: string, refundUsd: number) => void;
}

const STATUS_TABS: { id: 'All' | BookingStatus; label: string }[] = [
  { id: 'All', label: 'All Bookings' },
  { id: 'Confirmed', label: 'Confirmed' },
  { id: 'Cancelled', label: 'Cancelled' },
  { id: 'Completed', label: 'Completed' },
];

const CANCELLATION_REASONS = [
  'Executive schedule change',
  'Budget or headcount reallocation',
  'Switching destination hub',
  'Travel advisory or flight disruption',
];

export function CustomerPortal({
  customer,
  onUpdateCustomer,
  bookings,
  onOpenNewBooking,
  onCancelBooking,
}: CustomerPortalProps) {
  const [statusFilter, setStatusFilter] = useState<'All' | BookingStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState(customer.name);
  const [draftEmail, setDraftEmail] = useState(customer.email);
  const [draftCompany, setDraftCompany] = useState(customer.company);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [inspectedBooking, setInspectedBooking] = useState<CustomerBooking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<CustomerBooking | null>(null);
  const [cancelReason, setCancelReason] = useState(CANCELLATION_REASONS[0]);

  const portalStats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === 'Confirmed');
    const cancelled = bookings.filter((b) => b.status === 'Cancelled');
    const activeSpend = confirmed.reduce((sum, b) => sum + b.totalUsd, 0);
    const totalRefunds = cancelled.reduce((sum, b) => sum + (b.refundAmountUsd || 0), 0);
    const activeGuests = confirmed.reduce((sum, b) => sum + b.guests, 0);

    return {
      confirmedCount: confirmed.length,
      activeGuests,
      activeSpend,
      totalRefunds,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return bookings.filter((b) => {
      const statusOk = statusFilter === 'All' || b.status === statusFilter;
      if (!statusOk) return false;
      if (!q) return true;
      return (
        b.referenceCode.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.country.toLowerCase().includes(q) ||
        b.programType.toLowerCase().includes(q)
      );
    });
  }, [bookings, statusFilter, searchQuery]);

  const formatUsd = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draftEmail.trim());
    if (!draftName.trim() || !emailOk) {
      setProfileError('Enter a valid name and work email address.');
      return;
    }
    setProfileError(null);
    onUpdateCustomer({
      name: draftName.trim(),
      email: draftEmail.trim(),
      company: draftCompany.trim() || 'Private Executive Account',
    });
    setEditingProfile(false);
  };

  const renderStatusLabel = (status: BookingStatus) => {
    if (status === 'Confirmed') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Confirmed</span>
        </span>
      );
    }
    if (status === 'Cancelled') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-300">
          <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Cancelled</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-200">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>Completed</span>
      </span>
    );
  };

  const cancellationPolicy = bookingToCancel
    ? calculateCancellationPolicy(bookingToCancel.checkInDate, bookingToCancel.totalUsd)
    : null;

  return (
    <section
      id="customer-portal"
      className="py-16 lg:py-24 bg-[#071124] border-b border-sky-300/15"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              Customer Booking &amp; Cancellation Portal
            </h2>
            <p className="mt-3 text-base text-sky-100/80 leading-relaxed">
              Manage active corporate and executive leisure reservations, inspect itinerary
              receipts, create new bookings, or process instant self-service cancellations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setDraftName(customer.name);
                setDraftEmail(customer.email);
                setDraftCompany(customer.company);
                setEditingProfile((prev) => !prev);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] text-sm font-medium text-sky-100 bg-[#0e1f42] border border-sky-300/25 hover:bg-[#142b59] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-amber-300" aria-hidden="true" />
              <span>{customer.name}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenNewBooking()}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[40px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>New Booking</span>
            </button>
          </div>
        </div>

        {editingProfile && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 bg-[#0d1c3a] border border-sky-300/20 rounded-xl p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-base font-semibold text-white">
                  Switch Customer Portal Account
                </h3>
                <p className="text-xs text-sky-200/75">
                  Signed in as {customer.email} · {customer.company}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                className="text-xs font-medium text-sky-200 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>

            {profileError && <p className="text-xs text-rose-300">{profileError}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Traveler Full Name"
                aria-label="Traveler Full Name"
                className="h-10 px-3 text-sm text-white placeholder:text-sky-200/50 bg-[#081329] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="email"
                value={draftEmail}
                onChange={(e) => setDraftEmail(e.target.value)}
                placeholder="Work Email"
                aria-label="Work Email"
                className="h-10 px-3 text-sm text-white placeholder:text-sky-200/50 bg-[#081329] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="text"
                value={draftCompany}
                onChange={(e) => setDraftCompany(e.target.value)}
                placeholder="Company or Group"
                aria-label="Company or Group"
                className="h-10 px-3 text-sm text-white placeholder:text-sky-200/50 bg-[#081329] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 min-h-[40px] text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
              >
                Update Portal Account
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 bg-[#0d1c3a] border border-sky-300/20 rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-sky-300/15 border-b border-sky-300/15 bg-[#102247]">
            <div className="p-5 sm:p-6">
              <div className="text-xs font-medium text-sky-200/75">Confirmed Bookings</div>
              <div className="mt-1 font-mono text-2xl font-semibold text-white tabular-nums">
                {portalStats.confirmedCount}
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="text-xs font-medium text-sky-200/75">Scheduled Travelers</div>
              <div className="mt-1 font-mono text-2xl font-semibold text-white tabular-nums">
                {portalStats.activeGuests}
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="text-xs font-medium text-sky-200/75">Active Committed Spend</div>
              <div className="mt-1 font-mono text-2xl font-semibold text-amber-300 tabular-nums">
                {formatUsd(portalStats.activeSpend)}
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="text-xs font-medium text-sky-200/75">Refunds Processed</div>
              <div className="mt-1 font-mono text-2xl font-semibold text-emerald-300 tabular-nums">
                {formatUsd(portalStats.totalRefunds)}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 border-b border-sky-300/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div
              role="group"
              aria-label="Filter bookings by status"
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#081329] border border-sky-300/15 rounded-lg self-start"
            >
              {STATUS_TABS.map((tab) => {
                const active = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-3 py-1.5 min-h-[36px] text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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

            <div className="relative w-full md:w-72">
              <Search
                className="w-4 h-4 text-sky-300/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reference or city..."
                aria-label="Search bookings by reference or destination"
                className="w-full h-10 pl-9 pr-3 text-sm text-white placeholder:text-sky-200/50 bg-[#081329] border border-sky-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-display text-base font-semibold text-white">
                No matching bookings found
              </p>
              <p className="mt-1 text-sm text-sky-200/75">
                Adjust your status filter or search query, or schedule a new destination stay.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 min-h-[40px] text-sm font-medium text-sky-100 bg-[#142b59] border border-sky-300/25 hover:bg-[#1a3770] rounded-lg cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  type="button"
                  onClick={() => onOpenNewBooking()}
                  className="px-4 py-2 min-h-[40px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer"
                >
                  Make a Booking
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-sky-300/15 bg-[#09152e] text-xs font-medium text-sky-200/75">
                    <th className="py-3.5 px-6">Reference &amp; Destination</th>
                    <th className="py-3.5 px-4">Program</th>
                    <th className="py-3.5 px-4">Stay Dates</th>
                    <th className="py-3.5 px-4 text-right">Travelers</th>
                    <th className="py-3.5 px-4 text-right">Total</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-300/15 text-sm">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-white/[0.04] transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-mono text-xs font-semibold text-amber-300 tabular-nums">
                          {booking.referenceCode}
                        </div>
                        <div className="font-medium text-white">
                          {booking.city}, {booking.country}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sky-50">{booking.programType}</div>
                        <div className="text-xs text-sky-200/70">{booking.tier}</div>
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-sky-100 tabular-nums whitespace-nowrap">
                        <div>
                          {booking.checkInDate} → {booking.checkOutDate}
                        </div>
                        <div className="text-sky-200/65">{booking.nights} nights</div>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-white tabular-nums">
                        {booking.guests}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-semibold text-white tabular-nums">
                        {formatUsd(booking.totalUsd)}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {renderStatusLabel(booking.status)}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setInspectedBooking(booking)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[34px] text-xs font-medium text-sky-100 bg-[#142b59] border border-sky-300/25 hover:bg-[#1a3770] rounded-md cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Receipt</span>
                          </button>

                          {booking.status === 'Confirmed' && (
                            <button
                              type="button"
                              onClick={() => {
                                setCancelReason(CANCELLATION_REASONS[0]);
                                setBookingToCancel(booking);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[34px] text-xs font-medium text-rose-200 bg-rose-950/60 border border-rose-400/35 hover:bg-rose-900/70 rounded-md cursor-pointer"
                            >
                              <span>Cancel Booking</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {inspectedBooking && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="receipt-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#030916]/80 backdrop-blur-sm"
          onClick={() => setInspectedBooking(null)}
        >
          <div
            className="bg-[#0c1b3a] border border-sky-300/25 rounded-xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-sky-300/15 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-amber-300 tabular-nums">
                  {inspectedBooking.referenceCode} · Created {inspectedBooking.createdAt}
                </p>
                <h3
                  id="receipt-modal-title"
                  className="font-display text-lg font-semibold text-white"
                >
                  {inspectedBooking.city}, {inspectedBooking.country} Reservation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedBooking(null)}
                aria-label="Close receipt modal"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-sky-200 hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-sm">
              <div className="flex items-center justify-between pb-4 border-b border-sky-300/15">
                <span className="text-sky-200/75">Reservation Status</span>
                {renderStatusLabel(inspectedBooking.status)}
              </div>

              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs text-sky-200/70">Traveler</dt>
                  <dd className="mt-0.5 font-medium text-white">
                    {inspectedBooking.customerName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-sky-200/70">Organization</dt>
                  <dd className="mt-0.5 font-medium text-white">{inspectedBooking.company}</dd>
                </div>
                <div>
                  <dt className="text-xs text-sky-200/70">Dates &amp; Airport</dt>
                  <dd className="mt-0.5 font-mono text-sky-50 tabular-nums">
                    {inspectedBooking.checkInDate} → {inspectedBooking.checkOutDate} (
                    {inspectedBooking.airportCode})
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-sky-200/70">Allocation</dt>
                  <dd className="mt-0.5 font-mono font-semibold text-amber-300 tabular-nums">
                    {formatUsd(inspectedBooking.totalUsd)} · {inspectedBooking.guests} guests
                  </dd>
                </div>
              </dl>

              {(() => {
                const hub = DESTINATION_HUBS.find((h) => h.id === inspectedBooking.hubId);
                return hub ? (
                  <div className="p-4 bg-[#11244b] border border-sky-300/20 rounded-lg">
                    <div className="text-xs font-medium text-amber-300">
                      Included Destination Highlights
                    </div>
                    <div className="mt-1 text-sm text-sky-50">{hub.famousLandmarks}</div>
                  </div>
                ) : null;
              })()}

              {inspectedBooking.specialRequests && (
                <div>
                  <div className="text-xs font-medium text-sky-200/70">Special Protocol Notes</div>
                  <p className="mt-1 text-sky-100">{inspectedBooking.specialRequests}</p>
                </div>
              )}

              {inspectedBooking.status === 'Cancelled' && (
                <div className="p-4 bg-rose-950/60 border border-rose-400/35 rounded-lg space-y-1">
                  <div className="text-xs font-semibold text-rose-200">
                    Cancelled on {inspectedBooking.cancelledAt}
                  </div>
                  <div className="text-xs text-rose-200/80">
                    Reason: {inspectedBooking.cancellationReason}
                  </div>
                  <div className="text-sm font-mono font-semibold text-white tabular-nums pt-1">
                    Refund Issued: {formatUsd(inspectedBooking.refundAmountUsd || 0)}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-[#09152e] border-t border-sky-300/15 flex justify-end gap-3">
              {inspectedBooking.status === 'Confirmed' && (
                <button
                  type="button"
                  onClick={() => {
                    const target = inspectedBooking;
                    setInspectedBooking(null);
                    setCancelReason(CANCELLATION_REASONS[0]);
                    setBookingToCancel(target);
                  }}
                  className="px-4 py-2 min-h-[38px] text-xs font-medium text-rose-200 bg-rose-950/60 border border-rose-400/35 hover:bg-rose-900/70 rounded-lg cursor-pointer"
                >
                  Cancel This Booking
                </button>
              )}
              <button
                type="button"
                onClick={() => setInspectedBooking(null)}
                className="px-4 py-2 min-h-[38px] text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {bookingToCancel && cancellationPolicy && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#030916]/80 backdrop-blur-sm"
          onClick={() => setBookingToCancel(null)}
        >
          <div
            className="bg-[#0c1b3a] border border-sky-300/25 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-sky-300/15 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-amber-300 tabular-nums">
                  {bookingToCancel.referenceCode}
                </p>
                <h3
                  id="cancel-modal-title"
                  className="font-display text-lg font-semibold text-white"
                >
                  Cancel {bookingToCancel.city} Booking
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                aria-label="Close cancellation dialog"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-sky-200 hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-sm">
              <p className="text-sky-100/85 leading-relaxed">
                Confirm cancellation for your{' '}
                <span className="font-medium text-white">{bookingToCancel.programType}</span> in{' '}
                {bookingToCancel.city} ({bookingToCancel.checkInDate} →{' '}
                {bookingToCancel.checkOutDate}).
              </p>

              <div className="p-4 bg-[#11244b] border border-sky-300/20 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-sky-200/75">
                  <span>Original Booking Value</span>
                  <span className="font-mono tabular-nums text-white">
                    {formatUsd(bookingToCancel.totalUsd)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-sky-200/75">
                  <span>Applicable Policy</span>
                  <span className="font-medium text-sky-50">
                    {cancellationPolicy.policyLabel}
                  </span>
                </div>
                <div className="pt-2 border-t border-sky-300/15 flex items-center justify-between font-semibold text-white">
                  <span>Refund to Corporate Card</span>
                  <span className="font-mono text-base tabular-nums text-emerald-300">
                    {formatUsd(cancellationPolicy.refundUsd)}
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="cancel-reason"
                  className="block text-sm font-medium text-white mb-1.5"
                >
                  Reason for Cancellation
                </label>
                <select
                  id="cancel-reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm text-white bg-[#081329] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {CANCELLATION_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#09152e] border-t border-sky-300/15 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                className="px-4 py-2.5 min-h-[40px] text-sm font-medium text-sky-100 bg-[#142b59] border border-sky-300/25 hover:bg-[#1a3770] rounded-lg cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={() => {
                  onCancelBooking(
                    bookingToCancel.id,
                    cancelReason,
                    cancellationPolicy.refundUsd
                  );
                  setBookingToCancel(null);
                }}
                className="px-5 py-2.5 min-h-[40px] text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
