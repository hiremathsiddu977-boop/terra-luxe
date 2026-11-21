import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  DESTINATION_HUBS,
  EstimateTransferPayload,
  PROGRAM_MULTIPLIERS,
  ProgramType,
} from '../data/businessTourismData';
import { formatUsd } from '../utils/formatters';

interface ProposalFormProps {
  selectedHubId: string;
  transferredEstimate: EstimateTransferPayload | null;
  onClearEstimate: () => void;
}

interface FormErrors {
  fullName?: string;
  workEmail?: string;
  company?: string;
  targetQuarter?: string;
}

interface SubmittedSummary {
  referenceCode: string;
  fullName: string;
  workEmail: string;
  company: string;
  hubCity: string;
  programType: ProgramType;
  delegates: number;
  targetQuarter: string;
}

const PROGRAM_TYPES = Object.keys(PROGRAM_MULTIPLIERS) as ProgramType[];

export function ProposalForm({
  selectedHubId,
  transferredEstimate,
  onClearEstimate,
}: ProposalFormProps) {
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [company, setCompany] = useState('');
  const [hubId, setHubId] = useState(selectedHubId || DESTINATION_HUBS[0].id);
  const [programType, setProgramType] = useState<ProgramType>('Executive Retreat');
  const [delegates, setDelegates] = useState<number>(60);
  const [targetQuarter, setTargetQuarter] = useState('Q2 2027');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<SubmittedSummary | null>(null);

  useEffect(() => {
    if (selectedHubId) {
      setHubId(selectedHubId);
    }
  }, [selectedHubId]);

  useEffect(() => {
    if (transferredEstimate) {
      setHubId(transferredEstimate.hubId);
      setProgramType(transferredEstimate.programType);
      setDelegates(transferredEstimate.delegates);
      setSubmitted(null);
    }
  }, [transferredEstimate]);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!workEmail.trim() || !emailPattern.test(workEmail.trim())) {
      nextErrors.workEmail = 'Enter a valid corporate email address.';
    }
    if (!company.trim() || company.trim().length < 2) {
      nextErrors.company = 'Enter your organization name.';
    }
    if (!targetQuarter.trim()) {
      nextErrors.targetQuarter = 'Specify target dates or quarter.';
    }
    return nextErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const hub = DESTINATION_HUBS.find((h) => h.id === hubId) || DESTINATION_HUBS[0];
    const codeSuffix = String(Math.floor(1000 + Math.random() * 9000));

    setSubmitted({
      referenceCode: `MC-${hub.airportCode}-${codeSuffix}`,
      fullName: fullName.trim(),
      workEmail: workEmail.trim(),
      company: company.trim(),
      hubCity: `${hub.city}, ${hub.country}`,
      programType,
      delegates,
      targetQuarter: targetQuarter.trim(),
    });
  };

  const handleReset = () => {
    setSubmitted(null);
    setFullName('');
    setWorkEmail('');
    setCompany('');
    setNotes('');
    setErrors({});
    onClearEstimate();
  };

  return (
    <section id="proposal" className="cv-auto py-16 lg:py-24 bg-[#071124]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <h2
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white"
              style={{ textWrap: 'balance' }}
            >
              Request a 48-hour venue &amp; logistics brief.
            </h2>
            <p className="mt-4 text-base text-sky-100/80 leading-relaxed">
              Submit your program parameters below. A senior regional producer in Zurich,
              Singapore, or New York will reply with audited room availability, transfer routing,
              and a line-item budget.
            </p>

            <dl className="mt-8 space-y-5 pt-8 border-t border-sky-300/15 text-sm">
              <div>
                <dt className="font-semibold text-amber-300">What you receive in 48 hours</dt>
                <dd className="mt-1 text-sky-100/80">
                  Two shortlisted properties with confirmed buyout holds, plenary floorplans, and
                  contracted airfare benchmarks.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-amber-300">Confidentiality &amp; NDA Ready</dt>
                <dd className="mt-1 text-sky-100/80">
                  Standard mutual NDA execution prior to sharing board rosters or M&amp;A summit
                  agendas.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-amber-300">Direct Regional Desks</dt>
                <dd className="mt-1 text-sky-100/80 font-mono text-xs tabular-nums">
                  EMEA +41 44 580 24 10 · APAC +65 6817 9200
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7 bg-[#0e1f42] border border-sky-300/20 rounded-xl p-6 sm:p-8 lg:p-10">
            {submitted ? (
              <div className="py-6 space-y-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-6 h-6 text-emerald-300 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">
                      Brief Request Logged — {submitted.referenceCode}
                    </h3>
                    <p className="mt-1 text-sm text-sky-100/80">
                      Confirmation has been prepared for{' '}
                      <span className="font-medium text-white">{submitted.workEmail}</span>. A
                      regional lead will deliver your venue dossier within two business days.
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-[#091630] border border-sky-300/20 rounded-lg text-sm">
                  <div>
                    <dt className="text-xs text-sky-200/70">Organization</dt>
                    <dd className="mt-0.5 font-medium text-white">{submitted.company}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-sky-200/70">Primary Contact</dt>
                    <dd className="mt-0.5 font-medium text-white">{submitted.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-sky-200/70">Selected Hub</dt>
                    <dd className="mt-0.5 font-medium text-white">{submitted.hubCity}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-sky-200/70">Program Scope</dt>
                    <dd className="mt-0.5 font-medium text-amber-300 font-mono tabular-nums">
                      {submitted.programType} · {submitted.delegates} delegates ·{' '}
                      {submitted.targetQuarter}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 min-h-[40px] text-sm font-medium text-sky-100 bg-[#142b59] border border-sky-300/25 hover:bg-[#1a3770] rounded-lg transition-colors cursor-pointer"
                >
                  Submit Another Program Brief
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {transferredEstimate && (
                  <div className="p-4 bg-[#091630] border border-amber-400/35 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-sky-100">
                      <span className="font-semibold text-amber-300">Attached Estimate: </span>
                      <span className="font-mono tabular-nums">
                        {transferredEstimate.programType} · {transferredEstimate.delegates}{' '}
                        delegates · {transferredEstimate.days}d ({transferredEstimate.tier}) —{' '}
                        {formatUsd(transferredEstimate.estimatedTotalUsd)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onClearEstimate}
                      className="text-sky-200 hover:text-white underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="rfp-name"
                      className="block text-sm font-medium text-white mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="rfp-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Elena Vance"
                      aria-invalid={Boolean(errors.fullName)}
                      className="w-full h-11 px-3.5 text-sm text-white placeholder:text-sky-200/45 bg-[#091630] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 text-xs text-rose-300">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="rfp-email"
                      className="block text-sm font-medium text-white mb-1.5"
                    >
                      Work Email
                    </label>
                    <input
                      id="rfp-email"
                      type="email"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="elena.vance@company.com"
                      aria-invalid={Boolean(errors.workEmail)}
                      className="w-full h-11 px-3.5 text-sm text-white placeholder:text-sky-200/45 bg-[#091630] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                    {errors.workEmail && (
                      <p className="mt-1.5 text-xs text-rose-300">{errors.workEmail}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="rfp-company"
                      className="block text-sm font-medium text-white mb-1.5"
                    >
                      Company / Institution
                    </label>
                    <input
                      id="rfp-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Nordic Clearing Group"
                      aria-invalid={Boolean(errors.company)}
                      className="w-full h-11 px-3.5 text-sm text-white placeholder:text-sky-200/45 bg-[#091630] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                    {errors.company && (
                      <p className="mt-1.5 text-xs text-rose-300">{errors.company}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="rfp-hub"
                      className="block text-sm font-medium text-white mb-1.5"
                    >
                      Preferred Destination Hub
                    </label>
                    <select
                      id="rfp-hub"
                      value={hubId}
                      onChange={(e) => setHubId(e.target.value)}
                      className="w-full h-11 px-3.5 text-sm text-white bg-[#091630] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    >
                      {DESTINATION_HUBS.map((hub) => (
                        <option key={hub.id} value={hub.id}>
                          {hub.city}, {hub.country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label
                      htmlFor="rfp-type"
                      className="block text-sm font-medium text-white mb-1.5"
                    >
                      Program Format
                    </label>
                    <select
                      id="rfp-type"
                      value={programType}
                      onChange={(e) => setProgramType(e.target.value as ProgramType)}
                      className="w-full h-11 px-3.5 text-sm text-white bg-[#091630] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    >
                      {PROGRAM_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="rfp-delegates"
                      className="block text-sm font-medium text-white mb-1.5"
                    >
                      Estimated Delegates
                    </label>
                    <input
                      id="rfp-delegates"
                      type="number"
                      min={10}
                      max={1200}
                      value={delegates}
                      onChange={(e) => setDelegates(Math.max(10, Number(e.target.value) || 10))}
                      className="w-full h-11 px-3.5 font-mono text-sm text-white bg-[#091630] border border-sky-300/25 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="rfp-dates"
                      className="block text-sm font-medium text-white mb-1.5"
                    >
                      Target Window
                    </label>
                    <input
                      id="rfp-dates"
                      type="text"
                      value={targetQuarter}
                      onChange={(e) => setTargetQuarter(e.target.value)}
                      placeholder="Oct 14–17, 2027"
                      aria-invalid={Boolean(errors.targetQuarter)}
                      className="w-full h-11 px-3.5 text-sm text-white placeholder:text-sky-200/45 bg-[#091630] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                    />
                    {errors.targetQuarter && (
                      <p className="mt-1.5 text-xs text-rose-300">{errors.targetQuarter}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="rfp-notes"
                    className="block text-sm font-medium text-white mb-1.5"
                  >
                    Security, AV, or Charter Requirements (Optional)
                  </label>
                  <textarea
                    id="rfp-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g. Full-property buyout preferred, simultaneous translation for 3 languages, departures from LHR and JFK."
                    className="w-full p-3.5 text-sm text-white placeholder:text-sky-200/45 bg-[#091630] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-sky-200/70">
                    No automated spam. Direct response from a regional program director.
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-3 min-h-[44px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1f42] focus-visible:ring-amber-400"
                  >
                    Request Venue Brief
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
