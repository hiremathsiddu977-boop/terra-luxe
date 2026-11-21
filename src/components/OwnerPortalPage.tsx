import { FormEvent, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  CustomerBooking,
  DESTINATION_HUBS,
  EmployeeDepartment,
  EmployeeRecord,
  EmploymentType,
  MONTHLY_BASELINES,
} from '../data/businessTourismData';
import { formatHourly, formatUsd } from '../utils/formatters';

interface OwnerPortalPageProps {
  isAuthenticated: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
  onReturnToPortal: () => void;
  bookings: CustomerBooking[];
  employees: EmployeeRecord[];
  onAddEmployee: (employee: EmployeeRecord) => void;
  onDeleteEmployee: (employeeId: string) => void;
}

const DEPARTMENTS: ('All' | EmployeeDepartment)[] = [
  'All',
  'Operations & Protocol',
  'Client Concierge',
  'Aviation & Logistics',
  'Production & AV',
];

const DEPARTMENT_OPTIONS: EmployeeDepartment[] = [
  'Operations & Protocol',
  'Client Concierge',
  'Aviation & Logistics',
  'Production & AV',
];

const WEEKS_PER_MONTH = 4.33;

export function OwnerPortalPage({
  isAuthenticated,
  onLoginSuccess,
  onLogout,
  onReturnToPortal,
  bookings,
  employees,
  onAddEmployee,
  onDeleteEmployee,
}: OwnerPortalPageProps) {
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard filter & modal state
  const [deptFilter, setDeptFilter] = useState<'All' | EmployeeDepartment>('All');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(MONTHLY_BASELINES.length - 1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeRecord | null>(null);

  // Add employee form state
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empDept, setEmpDept] = useState<EmployeeDepartment>('Operations & Protocol');
  const [empHub, setEmpHub] = useState(DESTINATION_HUBS[0].city);
  const [empType, setEmpType] = useState<EmploymentType>('Full-Time');
  const [empHourlyRate, setEmpHourlyRate] = useState(65);
  const [empWeeklyHours, setEmpWeeklyHours] = useState(40);
  const [empError, setEmpError] = useState<string | null>(null);

  // Live employee & payroll math
  const payrollMetrics = useMemo(() => {
    const count = employees.length;
    const totalHourlyRates = employees.reduce((sum, e) => sum + e.hourlyRateUsd, 0);
    const totalWeeklyHours = employees.reduce((sum, e) => sum + e.weeklyHours, 0);
    const monthlyPayrollUsd = Math.round(
      employees.reduce((sum, e) => sum + e.hourlyRateUsd * e.weeklyHours * WEEKS_PER_MONTH, 0)
    );
    const avgHourlyUsd = count > 0 ? totalHourlyRates / count : 0;

    return {
      count,
      avgHourlyUsd,
      totalWeeklyHours,
      monthlyPayrollUsd,
    };
  }, [employees]);

  // Live bookings revenue + refunds
  const bookingRevenueMetrics = useMemo(() => {
    const activeAndCompleted = bookings.filter(
      (b) => b.status === 'Confirmed' || b.status === 'Completed'
    );
    const cancelled = bookings.filter((b) => b.status === 'Cancelled');

    const grossPortalBookingsUsd = activeAndCompleted.reduce((sum, b) => sum + b.totalUsd, 0);
    const cancelledOriginalUsd = cancelled.reduce((sum, b) => sum + b.totalUsd, 0);
    const refundsIssuedUsd = cancelled.reduce((sum, b) => sum + (b.refundAmountUsd || 0), 0);
    const retainedCancelFeesUsd = cancelledOriginalUsd - refundsIssuedUsd;

    return {
      grossPortalBookingsUsd,
      refundsIssuedUsd,
      retainedCancelFeesUsd,
      totalBookingCount: activeAndCompleted.length,
    };
  }, [bookings]);

  // Combined 6-month financial series (Nov 2026 reflects live portal bookings & live payroll)
  const financialSeries = useMemo(() => {
    return MONTHLY_BASELINES.map((m, idx) => {
      const isCurrentMonth = idx === MONTHLY_BASELINES.length - 1;
      const revenueUsd = isCurrentMonth
        ? m.baseRevenueUsd +
          bookingRevenueMetrics.grossPortalBookingsUsd +
          bookingRevenueMetrics.retainedCancelFeesUsd
        : m.baseRevenueUsd;

      const directCogsUsd = Math.round(revenueUsd * m.directCogsRatio);
      const payrollUsd = payrollMetrics.monthlyPayrollUsd;
      const totalExpenseUsd = directCogsUsd + payrollUsd + m.fixedLeaseUsd;
      const netProfitUsd = revenueUsd - totalExpenseUsd;
      const marginPct = revenueUsd > 0 ? (netProfitUsd / revenueUsd) * 100 : 0;

      return {
        month: m.month,
        revenueUsd,
        directCogsUsd,
        payrollUsd,
        fixedLeaseUsd: m.fixedLeaseUsd,
        totalExpenseUsd,
        netProfitUsd,
        marginPct,
      };
    });
  }, [bookingRevenueMetrics, payrollMetrics]);

  // 6-Month Cumulative Totals
  const totals6Mo = useMemo(() => {
    const totalRevenueUsd = financialSeries.reduce((s, r) => s + r.revenueUsd, 0);
    const totalExpensesUsd = financialSeries.reduce((s, r) => s + r.totalExpenseUsd, 0);
    const netProfitUsd = totalRevenueUsd - totalExpensesUsd;
    const marginPct = totalRevenueUsd > 0 ? (netProfitUsd / totalRevenueUsd) * 100 : 0;

    return {
      totalRevenueUsd,
      totalExpensesUsd,
      netProfitUsd,
      marginPct,
    };
  }, [financialSeries]);

  const maxChartValue = useMemo(() => {
    const maxVal = Math.max(
      ...financialSeries.map((r) => Math.max(r.revenueUsd, r.totalExpenseUsd)),
      1
    );
    return Math.ceil(maxVal / 50000) * 50000;
  }, [financialSeries]);

  const activeMonthData = financialSeries[selectedMonthIdx] || financialSeries[financialSeries.length - 1];

  const filteredEmployees = useMemo(() => {
    const q = employeeSearch.trim().toLowerCase();
    return employees.filter((emp) => {
      const deptOk = deptFilter === 'All' || emp.department === deptFilter;
      if (!deptOk) return false;
      if (!q) return true;
      return (
        emp.name.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.hubCity.toLowerCase().includes(q)
      );
    });
  }, [employees, deptFilter, employeeSearch]);

  const hubBreakdown = useMemo(() => {
    return DESTINATION_HUBS.map((hub) => {
      const hubBookings = bookings.filter(
        (b) => b.hubId === hub.id && (b.status === 'Confirmed' || b.status === 'Completed')
      );
      const hubStaff = employees.filter((e) => e.hubCity === hub.city);
      const staffCostMo = Math.round(
        hubStaff.reduce((sum, e) => sum + e.hourlyRateUsd * e.weeklyHours * WEEKS_PER_MONTH, 0)
      );
      const portalRev = hubBookings.reduce((sum, b) => sum + b.totalUsd, 0);
      const guests = hubBookings.reduce((sum, b) => sum + b.guests, 0);

      return {
        id: hub.id,
        city: hub.city,
        country: hub.country,
        activeBookings: hubBookings.length,
        guests,
        portalRevenueUsd: portalRev,
        staffCount: hubStaff.length,
        monthlyPayrollUsd: staffCostMo,
      };
    });
  }, [bookings, employees]);

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim());
    if (!emailOk) {
      setLoginError('Enter a valid owner email address.');
      return;
    }
    if (loginPassword.trim().length < 6) {
      setLoginError('Password must be at least 6 characters.');
      return;
    }
    setLoginError(null);
    onLoginSuccess();
  };

  const handleFillDemoOwner = () => {
    setLoginEmail('owner@meridiancorp.com');
    setLoginPassword('Meridian2026!');
    setLoginError(null);
  };

  const handleAddEmployeeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empRole.trim()) {
      setEmpError('Employee name and role title are required.');
      return;
    }
    const rate = Number.isFinite(empHourlyRate) ? empHourlyRate : 0;
    const hours = Number.isFinite(empWeeklyHours) ? empWeeklyHours : 0;

    if (rate <= 0 || rate > 500) {
      setEmpError('Hourly salary must be between $1 and $500.');
      return;
    }
    if (hours < 1 || hours > 80) {
      setEmpError('Weekly hours must be between 1 and 80.');
      return;
    }

    setEmpError(null);
    onAddEmployee({
      id: `emp-${Date.now()}`,
      name: empName.trim(),
      role: empRole.trim(),
      department: empDept,
      hubCity: empHub,
      employmentType: empType,
      hourlyRateUsd: rate,
      weeklyHours: hours,
      joinedDate: new Date().toISOString().slice(0, 10),
    });

    setEmpName('');
    setEmpRole('');
    setEmpHourlyRate(65);
    setEmpWeeklyHours(40);
    setAddModalOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <section className="min-h-[calc(100vh-4rem)] bg-[#071124] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-[#0d1c3a] border border-sky-300/25 rounded-xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between gap-4 pb-6 border-b border-sky-300/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-400/15 border border-amber-400/35 flex items-center justify-center text-amber-300">
                <Lock className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold text-white">
                  Owner Executive Login
                </h1>
                <p className="text-xs text-sky-200/75">
                  Financial P&amp;L, Revenue &amp; Staff Payroll Access
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} noValidate className="mt-6 space-y-5">
            {loginError && (
              <div
                role="alert"
                className="p-3 text-xs text-rose-200 bg-rose-950/70 border border-rose-400/40 rounded-lg"
              >
                {loginError}
              </div>
            )}

            <div>
              <label
                htmlFor="owner-email"
                className="block text-sm font-medium text-white mb-1.5"
              >
                Owner Email
              </label>
              <input
                id="owner-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="owner@meridiancorp.com"
                className="w-full h-11 px-3.5 text-sm text-white placeholder:text-sky-200/45 bg-[#081329] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label
                htmlFor="owner-password"
                className="block text-sm font-medium text-white mb-1.5"
              >
                Passcode
              </label>
              <div className="relative">
                <input
                  id="owner-password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter owner passcode"
                  className="w-full h-11 pl-3.5 pr-11 text-sm text-white placeholder:text-sky-200/45 bg-[#081329] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 inline-flex items-center justify-center text-sky-200/75 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-[#09152e] border border-sky-300/20 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="text-sky-200/80">
                Demo Owner: <span className="font-mono text-amber-300">owner@meridiancorp.com</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemoOwner}
                className="font-medium text-amber-300 hover:text-amber-200 underline underline-offset-2 cursor-pointer"
              >
                Fill Demo Credentials
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 min-h-[44px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              Sign In to Owner Dashboard
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-sky-300/15 text-center">
            <button
              type="button"
              onClick={onReturnToPortal}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-200 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Return to Customer Tourism Portal</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-[#071124] text-slate-50 min-h-screen py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Owner Workspace Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-sky-300/15">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
              <span>Owner Executive Console</span>
              <span aria-hidden="true">·</span>
              <span>Alex Mercer, Managing Director</span>
            </div>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              Tourism Business P&amp;L &amp; Workforce Ledger
            </h1>
            <p className="mt-2 text-sm text-sky-100/80 max-w-2xl">
              Live financial performance combining historical corporate contracts, customer portal
              bookings, cancellation refunds, and real-time hourly employee payroll.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onReturnToPortal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[40px] text-sm font-medium text-sky-100 bg-[#0e1f42] border border-sky-300/25 hover:bg-[#142b59] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Customer Portal</span>
            </button>

            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[40px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add Employee</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[40px] text-sm font-medium text-rose-200 bg-rose-950/50 border border-rose-400/30 hover:bg-rose-900/60 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* 4-Column Executive KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0e1f42] border border-sky-300/20 rounded-xl p-6">
            <div className="text-xs font-medium text-sky-200/75">
              6-Month Total Revenue
            </div>
            <div className="mt-2 font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums">
              {formatUsd(totals6Mo.totalRevenueUsd)}
            </div>
            <div className="mt-2 text-xs text-sky-200/75 font-mono tabular-nums">
              Includes {formatUsd(bookingRevenueMetrics.grossPortalBookingsUsd)} active portal
              bookings
            </div>
          </div>

          <div className="bg-[#0e1f42] border border-sky-300/20 rounded-xl p-6">
            <div className="text-xs font-medium text-sky-200/75">
              Total Operating &amp; Payroll Cost
            </div>
            <div className="mt-2 font-mono text-2xl sm:text-3xl font-semibold text-white tabular-nums">
              {formatUsd(totals6Mo.totalExpensesUsd)}
            </div>
            <div className="mt-2 text-xs text-sky-200/75 font-mono tabular-nums">
              Monthly staff payroll: {formatUsd(payrollMetrics.monthlyPayrollUsd)}
            </div>
          </div>

          <div className="bg-[#0e1f42] border border-sky-300/20 rounded-xl p-6">
            <div className="text-xs font-medium text-sky-200/75">Net Profit / Loss (6 Mo)</div>
            <div
              className={`mt-2 font-mono text-2xl sm:text-3xl font-semibold tabular-nums flex items-center gap-2 ${
                totals6Mo.netProfitUsd >= 0 ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {totals6Mo.netProfitUsd >= 0 ? (
                <TrendingUp className="w-6 h-6 shrink-0" aria-hidden="true" />
              ) : (
                <TrendingDown className="w-6 h-6 shrink-0" aria-hidden="true" />
              )}
              <span>
                {totals6Mo.netProfitUsd >= 0 ? '+' : ''}
                {formatUsd(totals6Mo.netProfitUsd)}
              </span>
            </div>
            <div className="mt-2 text-xs font-mono tabular-nums text-sky-200/80">
              {totals6Mo.netProfitUsd >= 0 ? 'Net Profit Margin' : 'Operating Loss'}:{' '}
              {totals6Mo.marginPct.toFixed(1)}%
            </div>
          </div>

          <div className="bg-[#0e1f42] border border-sky-300/20 rounded-xl p-6">
            <div className="text-xs font-medium text-sky-200/75">
              Staff Headcount &amp; Hourly Rate
            </div>
            <div className="mt-2 font-mono text-2xl sm:text-3xl font-semibold text-amber-300 tabular-nums">
              {formatHourly(payrollMetrics.avgHourlyUsd)}/hr
            </div>
            <div className="mt-2 text-xs text-sky-200/80 font-mono tabular-nums">
              {payrollMetrics.count} employees · {payrollMetrics.totalWeeklyHours} hrs/week
            </div>
          </div>
        </div>

        {/* Monthly Revenue vs Expense Chart + Live Month P&L Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-[#0e1f42] border border-sky-300/20 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-sky-300/15">
              <div>
                <h2 className="font-display text-lg font-semibold text-white">
                  Monthly Revenue vs. Expenses
                </h2>
                <p className="text-xs text-sky-200/75">
                  Click any month bar to inspect its detailed profit &amp; loss statement
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-sky-100">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" aria-hidden="true" />
                  <span>Revenue</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-sky-400" aria-hidden="true" />
                  <span>Expenses &amp; Payroll</span>
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-6 gap-3 sm:gap-5 items-end h-60 pt-4">
              {financialSeries.map((item, idx) => {
                const revHeightPct = Math.max(8, (item.revenueUsd / maxChartValue) * 100);
                const expHeightPct = Math.max(8, (item.totalExpenseUsd / maxChartValue) * 100);
                const isSelected = idx === selectedMonthIdx;

                return (
                  <button
                    key={item.month}
                    type="button"
                    onClick={() => setSelectedMonthIdx(idx)}
                    className={`group flex flex-col items-center h-full justify-end p-2 rounded-lg transition-colors cursor-pointer ${
                      isSelected ? 'bg-white/10 ring-1 ring-amber-400/60' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="w-full flex items-end justify-center gap-1.5 h-44">
                      <div
                        style={{ height: `${revHeightPct}%` }}
                        className="w-3.5 sm:w-5 bg-amber-400 rounded-t-sm transition-all"
                        title={`${item.month} Revenue: ${formatUsd(item.revenueUsd)}`}
                      />
                      <div
                        style={{ height: `${expHeightPct}%` }}
                        className="w-3.5 sm:w-5 bg-sky-400 rounded-t-sm transition-all"
                        title={`${item.month} Expenses: ${formatUsd(item.totalExpenseUsd)}`}
                      />
                    </div>
                    <span className="mt-3 font-mono text-[11px] text-sky-100/85 tabular-nums whitespace-nowrap">
                      {item.month.replace(' 2026', '')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0d1c3a] border border-sky-300/20 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-sky-300/15">
                <div>
                  <div className="text-xs font-medium text-amber-300">
                    Selected Period Statement
                  </div>
                  <h2 className="font-display text-xl font-semibold text-white">
                    {activeMonthData.month} P&amp;L Breakdown
                  </h2>
                </div>
                <span
                  className={`font-mono text-xs font-semibold px-2.5 py-1 rounded-md tabular-nums ${
                    activeMonthData.netProfitUsd >= 0
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-400/30'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-400/30'
                  }`}
                >
                  {activeMonthData.marginPct.toFixed(1)}% Margin
                </span>
              </div>

              <dl className="mt-6 space-y-3.5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-sky-100/85">Gross Tourism Revenue</dt>
                  <dd className="font-mono font-semibold text-white tabular-nums">
                    {formatUsd(activeMonthData.revenueUsd)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sky-200/75">Venue, Hotel &amp; Charter COGS</dt>
                  <dd className="font-mono text-rose-200 tabular-nums">
                    -{formatUsd(activeMonthData.directCogsUsd)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sky-200/75">
                    Employee Hourly Payroll ({payrollMetrics.count} staff)
                  </dt>
                  <dd className="font-mono text-rose-200 tabular-nums">
                    -{formatUsd(activeMonthData.payrollUsd)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sky-200/75">Global Hub Leases &amp; Compliance</dt>
                  <dd className="font-mono text-rose-200 tabular-nums">
                    -{formatUsd(activeMonthData.fixedLeaseUsd)}
                  </dd>
                </div>
                <div className="pt-4 border-t border-sky-300/20 flex items-center justify-between text-base font-semibold">
                  <dt className="text-white">
                    {activeMonthData.netProfitUsd >= 0 ? 'Net Operating Profit' : 'Net Operating Loss'}
                  </dt>
                  <dd
                    className={`font-mono tabular-nums ${
                      activeMonthData.netProfitUsd >= 0 ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {activeMonthData.netProfitUsd >= 0 ? '+' : ''}
                    {formatUsd(activeMonthData.netProfitUsd)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 pt-4 border-t border-sky-300/15 text-xs text-sky-200/70">
              Refunds issued in Customer Portal ({formatUsd(bookingRevenueMetrics.refundsIssuedUsd)})
              are automatically excluded from active recognized revenue.
            </div>
          </div>
        </div>

        {/* Employee Hourly Salary & Roster Management */}
        <div className="bg-[#0d1c3a] border border-sky-300/20 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-sky-300/15 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-white">
                Employee Roster &amp; Hourly Compensation
              </h2>
              <p className="mt-1 text-xs text-sky-200/75">
                Add or remove staff members across regional hubs. Payroll updates immediately reflect
                in the business Profit &amp; Loss ledger above.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[40px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap self-start lg:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add Employee</span>
            </button>
          </div>

          <div className="p-4 sm:p-6 border-b border-sky-300/15 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div
              role="group"
              aria-label="Filter employees by department"
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#081329] border border-sky-300/15 rounded-lg self-start"
            >
              {DEPARTMENTS.map((dept) => {
                const active = deptFilter === dept;
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setDeptFilter(dept)}
                    className={`px-3 py-1.5 min-h-[36px] text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                        : 'text-sky-100/80 hover:text-white'
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-72">
              <Search
                className="w-4 h-4 text-sky-300/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="Search employee, role, or hub..."
                aria-label="Search employees"
                className="w-full h-10 pl-9 pr-3 text-sm text-white placeholder:text-sky-200/50 bg-[#081329] border border-sky-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-display text-base font-semibold text-white">
                No employees match current filters
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDeptFilter('All');
                    setEmployeeSearch('');
                  }}
                  className="px-4 py-2 min-h-[40px] text-sm font-medium text-sky-100 bg-[#142b59] border border-sky-300/25 rounded-lg cursor-pointer"
                >
                  Reset Filters
                </button>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(true)}
                  className="px-4 py-2 min-h-[40px] text-sm font-semibold text-slate-950 bg-amber-400 rounded-lg cursor-pointer"
                >
                  Add Employee
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-sky-300/15 bg-[#09152e] text-xs font-medium text-sky-200/75">
                    <th className="py-3.5 px-6">Employee &amp; Role</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Hub &amp; Type</th>
                    <th className="py-3.5 px-4 text-right">Hourly Salary</th>
                    <th className="py-3.5 px-4 text-right">Hours / Wk</th>
                    <th className="py-3.5 px-4 text-right">Monthly Payroll</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-300/15 text-sm">
                  {filteredEmployees.map((emp) => {
                    const monthlyPay = Math.round(
                      emp.hourlyRateUsd * emp.weeklyHours * WEEKS_PER_MONTH
                    );
                    return (
                      <tr key={emp.id} className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-medium text-white">{emp.name}</div>
                          <div className="text-xs text-sky-200/70">{emp.role}</div>
                        </td>
                        <td className="py-4 px-4 text-sky-100">{emp.department}</td>
                        <td className="py-4 px-4">
                          <div className="text-white">{emp.hubCity}</div>
                          <div className="text-xs text-sky-200/65">{emp.employmentType}</div>
                        </td>
                        <td className="py-4 px-4 text-right font-mono font-semibold text-amber-300 tabular-nums">
                          {formatHourly(emp.hourlyRateUsd)}/hr
                        </td>
                        <td className="py-4 px-4 text-right font-mono text-sky-100 tabular-nums">
                          {emp.weeklyHours} hrs
                        </td>
                        <td className="py-4 px-4 text-right font-mono font-semibold text-white tabular-nums">
                          {formatUsd(monthlyPay)}
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setEmployeeToDelete(emp)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] text-xs font-medium text-rose-200 bg-rose-950/60 border border-rose-400/35 hover:bg-rose-900/70 rounded-md cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Hub-by-Hub Revenue & Staffing Footprint */}
        <div className="bg-[#0d1c3a] border border-sky-300/20 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-sky-300/15">
            <h2 className="font-display text-lg font-semibold text-white">
              Global Hub Portal Bookings &amp; Staff Allocation
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sky-300/15 bg-[#09152e] text-xs font-medium text-sky-200/75">
                  <th className="py-3 px-6">Destination Hub</th>
                  <th className="py-3 px-4 text-right">Portal Bookings</th>
                  <th className="py-3 px-4 text-right">Travelers</th>
                  <th className="py-3 px-4 text-right">Portal Revenue</th>
                  <th className="py-3 px-4 text-right">Assigned Staff</th>
                  <th className="py-3 px-6 text-right">Hub Monthly Payroll</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-300/15 text-sm">
                {hubBreakdown.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.04]">
                    <td className="py-3.5 px-6 font-medium text-white">
                      {row.city}, <span className="text-sky-200/75 font-normal">{row.country}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-sky-100 tabular-nums">
                      {row.activeBookings}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-sky-100 tabular-nums">
                      {row.guests}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-amber-300 tabular-nums">
                      {formatUsd(row.portalRevenueUsd)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-sky-100 tabular-nums">
                      {row.staffCount}
                    </td>
                    <td className="py-3.5 px-6 text-right font-mono text-white tabular-nums">
                      {formatUsd(row.monthlyPayrollUsd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {addModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-emp-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#030916]/85"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            className="bg-[#0c1b3a] border border-sky-300/25 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-sky-300/15 flex items-center justify-between">
              <h3 id="add-emp-title" className="font-display text-lg font-semibold text-white">
                Add Tourism Staff Member
              </h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                aria-label="Close add employee modal"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-sky-200 hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="p-6 space-y-5 text-sm">
              {empError && (
                <div
                  role="alert"
                  className="p-3 text-xs text-rose-200 bg-rose-950/70 border border-rose-400/40 rounded-lg"
                >
                  {empError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emp-name" className="block font-medium text-white mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="emp-name"
                    type="text"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    placeholder="Sofia Lindholm"
                    className="w-full h-11 px-3.5 text-white placeholder:text-sky-200/45 bg-[#081329] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label htmlFor="emp-role" className="block font-medium text-white mb-1.5">
                    Role / Title
                  </label>
                  <input
                    id="emp-role"
                    type="text"
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value)}
                    placeholder="Regional Event Director"
                    className="w-full h-11 px-3.5 text-white placeholder:text-sky-200/45 bg-[#081329] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emp-dept" className="block font-medium text-white mb-1.5">
                    Department
                  </label>
                  <select
                    id="emp-dept"
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value as EmployeeDepartment)}
                    className="w-full h-11 px-3.5 text-white bg-[#081329] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {DEPARTMENT_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="emp-hub" className="block font-medium text-white mb-1.5">
                    Assigned Hub
                  </label>
                  <select
                    id="emp-hub"
                    value={empHub}
                    onChange={(e) => setEmpHub(e.target.value)}
                    className="w-full h-11 px-3.5 text-white bg-[#081329] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {DESTINATION_HUBS.map((h) => (
                      <option key={h.id} value={h.city}>
                        {h.city}, {h.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="emp-rate" className="block font-medium text-white mb-1.5">
                    Hourly Salary ($/hr)
                  </label>
                  <input
                    id="emp-rate"
                    type="number"
                    min={1}
                    max={500}
                    step={0.5}
                    value={empHourlyRate}
                    onChange={(e) => setEmpHourlyRate(Number(e.target.value))}
                    className="w-full h-11 px-3.5 font-mono text-white bg-[#081329] border border-sky-300/25 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label htmlFor="emp-hours" className="block font-medium text-white mb-1.5">
                    Hours / Week
                  </label>
                  <input
                    id="emp-hours"
                    type="number"
                    min={1}
                    max={80}
                    value={empWeeklyHours}
                    onChange={(e) => setEmpWeeklyHours(Number(e.target.value))}
                    className="w-full h-11 px-3.5 font-mono text-white bg-[#081329] border border-sky-300/25 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label htmlFor="emp-type" className="block font-medium text-white mb-1.5">
                    Employment
                  </label>
                  <select
                    id="emp-type"
                    value={empType}
                    onChange={(e) => setEmpType(e.target.value as EmploymentType)}
                    className="w-full h-11 px-3.5 text-white bg-[#081329] border border-sky-300/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-[#09152e] border border-sky-300/20 rounded-lg flex items-center justify-between text-xs">
                <span className="text-sky-200/80">Projected Monthly Payroll Cost</span>
                <span className="font-mono text-base font-semibold text-amber-300 tabular-nums">
                  {formatUsd(
                    Math.round(
                      (Number.isFinite(empHourlyRate) ? Math.max(0, empHourlyRate) : 0) *
                        (Number.isFinite(empWeeklyHours) ? Math.max(0, empWeeklyHours) : 0) *
                        WEEKS_PER_MONTH
                    )
                  )}
                  /mo
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 min-h-[40px] text-sm font-medium text-sky-100 bg-[#142b59] border border-sky-300/25 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 min-h-[40px] text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Employee Confirmation Modal */}
      {employeeToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="del-emp-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#030916]/85"
          onClick={() => setEmployeeToDelete(null)}
        >
          <div
            className="bg-[#0c1b3a] border border-sky-300/25 rounded-xl max-w-md w-full shadow-2xl overflow-hidden text-slate-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-sky-300/15 flex items-center justify-between">
              <h3 id="del-emp-title" className="font-display text-lg font-semibold text-white">
                Remove Staff Member
              </h3>
              <button
                type="button"
                onClick={() => setEmployeeToDelete(null)}
                aria-label="Close delete confirmation"
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-sky-200 hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 text-sm text-sky-100/85 space-y-3">
              <p>
                Remove <span className="font-semibold text-white">{employeeToDelete.name}</span> (
                {employeeToDelete.role} · {employeeToDelete.hubCity}) from the active employee
                roster?
              </p>
              <p className="text-xs font-mono text-amber-300 tabular-nums">
                Payroll reduction:{' '}
                {formatUsd(
                  Math.round(
                    employeeToDelete.hourlyRateUsd *
                      employeeToDelete.weeklyHours *
                      WEEKS_PER_MONTH
                  )
                )}
                /month
              </p>
            </div>
            <div className="px-6 py-4 bg-[#09152e] border-t border-sky-300/15 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEmployeeToDelete(null)}
                className="px-4 py-2 min-h-[38px] text-sm font-medium text-sky-100 bg-[#142b59] border border-sky-300/25 rounded-lg cursor-pointer"
              >
                Keep Employee
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteEmployee(employeeToDelete.id);
                  setEmployeeToDelete(null);
                }}
                className="px-4 py-2 min-h-[38px] text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg cursor-pointer"
              >
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
