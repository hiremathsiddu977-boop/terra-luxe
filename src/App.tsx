import { useEffect, useState } from 'react';
import { BookingDraft, BookingModal } from './components/BookingModal';
import { CapabilitiesBento } from './components/CapabilitiesBento';
import { CaseStudies } from './components/CaseStudies';
import { CustomerPortal } from './components/CustomerPortal';
import { DestinationsExplorer } from './components/DestinationsExplorer';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { OwnerPortalPage } from './components/OwnerPortalPage';
import { ProgramEstimator } from './components/ProgramEstimator';
import { ProposalForm } from './components/ProposalForm';
import {
  CustomerBooking,
  CustomerProfile,
  DEFAULT_CUSTOMER_PROFILE,
  DESTINATION_HUBS,
  EmployeeRecord,
  EstimateTransferPayload,
  INITIAL_CUSTOMER_BOOKINGS,
  INITIAL_EMPLOYEES,
} from './data/businessTourismData';

const BOOKINGS_STORAGE_KEY = 'meridian_portal_bookings_v1';
const PROFILE_STORAGE_KEY = 'meridian_portal_customer_v1';
const EMPLOYEES_STORAGE_KEY = 'meridian_owner_employees_v1';
const OWNER_AUTH_STORAGE_KEY = 'meridian_owner_auth_v1';

export default function App() {
  const [activeView, setActiveView] = useState<'portal' | 'owner'>('portal');
  const [ownerAuthenticated, setOwnerAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(OWNER_AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [selectedHubId, setSelectedHubId] = useState<string>(DESTINATION_HUBS[0].id);
  const [transferredEstimate, setTransferredEstimate] =
    useState<EstimateTransferPayload | null>(null);

  const [customer, setCustomer] = useState<CustomerProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CustomerProfile) : DEFAULT_CUSTOMER_PROFILE;
    } catch {
      return DEFAULT_CUSTOMER_PROFILE;
    }
  });

  const [bookings, setBookings] = useState<CustomerBooking[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CustomerBooking[]) : INITIAL_CUSTOMER_BOOKINGS;
    } catch {
      return INITIAL_CUSTOMER_BOOKINGS;
    }
  });

  const [employees, setEmployees] = useState<EmployeeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as EmployeeRecord[]) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // Ignore storage quota issues gracefully
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(customer));
    } catch {
      // Ignore storage quota issues gracefully
    }
  }, [customer]);

  useEffect(() => {
    try {
      localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
    } catch {
      // Ignore storage quota issues gracefully
    }
  }, [employees]);

  useEffect(() => {
    try {
      localStorage.setItem(OWNER_AUTH_STORAGE_KEY, ownerAuthenticated ? 'true' : 'false');
    } catch {
      // Ignore storage quota issues gracefully
    }
  }, [ownerAuthenticated]);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    if (activeView !== 'portal') {
      setActiveView('portal');
      window.setTimeout(() => scrollToSection(sectionId), 50);
      return;
    }
    scrollToSection(sectionId);
  };

  const handleOpenOwnerPage = () => {
    setActiveView('owner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingModal = (draft?: BookingDraft) => {
    setBookingDraft(draft || { hubId: selectedHubId });
    setBookingModalOpen(true);
  };

  const handleSelectHubForProposal = (hubId: string) => {
    setSelectedHubId(hubId);
    handleNavigateSection('proposal');
  };

  const handleTransferEstimate = (payload: EstimateTransferPayload) => {
    setSelectedHubId(payload.hubId);
    setTransferredEstimate(payload);
    handleNavigateSection('proposal');
  };

  const handleBookEstimate = (payload: EstimateTransferPayload) => {
    setSelectedHubId(payload.hubId);
    handleOpenBookingModal({
      hubId: payload.hubId,
      programType: payload.programType,
      guests: payload.delegates,
      days: payload.days,
      tier: payload.tier,
    });
  };

  const handleCreateBooking = (newBooking: CustomerBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleCancelBooking = (bookingId: string, reason: string, refundUsd: number) => {
    const cancelledAt = new Date().toISOString().slice(0, 10);
    setBookings((prev) =>
      prev.map((item) =>
        item.id === bookingId
          ? {
              ...item,
              status: 'Cancelled',
              cancelledAt,
              cancellationReason: reason,
              refundAmountUsd: refundUsd,
            }
          : item
      )
    );
  };

  const handleAddEmployee = (newEmployee: EmployeeRecord) => {
    setEmployees((prev) => [newEmployee, ...prev]);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#071124] text-slate-50">
      <Header
        activeView={activeView}
        onNavigateSection={handleNavigateSection}
        onOpenOwnerPage={handleOpenOwnerPage}
        onBookTrip={() => handleOpenBookingModal()}
      />

      <main className="flex-1">
        {activeView === 'owner' ? (
          <OwnerPortalPage
            isAuthenticated={ownerAuthenticated}
            onLoginSuccess={() => setOwnerAuthenticated(true)}
            onLogout={() => setOwnerAuthenticated(false)}
            onReturnToPortal={() => handleNavigateSection('top')}
            bookings={bookings}
            employees={employees}
            onAddEmployee={handleAddEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        ) : (
          <>
            <Hero onBookDestination={() => handleOpenBookingModal()} />
            <DestinationsExplorer
              onBookDestination={(hubId) => {
                setSelectedHubId(hubId);
                handleOpenBookingModal({ hubId });
              }}
              onSelectHubForProposal={handleSelectHubForProposal}
            />
            <CustomerPortal
              customer={customer}
              onUpdateCustomer={setCustomer}
              bookings={bookings}
              onOpenNewBooking={(hubId) =>
                handleOpenBookingModal({ hubId: hubId || selectedHubId })
              }
              onCancelBooking={handleCancelBooking}
            />
            <ProgramEstimator
              selectedHubId={selectedHubId}
              onTransferEstimate={handleTransferEstimate}
              onBookEstimate={handleBookEstimate}
            />
            <CapabilitiesBento />
            <CaseStudies />
            <ProposalForm
              selectedHubId={selectedHubId}
              transferredEstimate={transferredEstimate}
              onClearEstimate={() => setTransferredEstimate(null)}
            />
          </>
        )}
      </main>

      <Footer
        onOpenOwnerPage={handleOpenOwnerPage}
        onNavigateSection={handleNavigateSection}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        draft={bookingDraft}
        customer={customer}
        onCreateBooking={handleCreateBooking}
      />
    </div>
  );
}
