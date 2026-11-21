interface FooterProps {
  onOpenOwnerPage: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export function Footer({ onOpenOwnerPage, onNavigateSection }: FooterProps) {
  return (
    <footer className="bg-[#050d1d] border-t border-sky-300/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-sky-300/15">
          <div className="md:col-span-5">
            <div className="font-display text-lg font-bold tracking-tight text-white">
              Meridian Corporate
            </div>
            <p className="mt-2 text-sm text-sky-100/75 max-w-sm leading-relaxed">
              Corporate travel architecture, MICE production, and executive summit operations across
              24 international business hubs.
            </p>
          </div>

          <div className="md:col-span-4 space-y-2 text-sm text-sky-100/80">
            <div className="font-semibold text-amber-300">Regional Operations Desks</div>
            <div>Zurich — Bahnhofstrasse 64, 8001</div>
            <div>Singapore — Marina View 12, 018961</div>
            <div>New York — 450 Lexington Ave, 10017</div>
          </div>

          <div className="md:col-span-3 space-y-2 text-sm">
            <div className="font-semibold text-amber-300">Navigation</div>
            <ul className="space-y-1.5 text-sky-100/80">
              <li>
                <a
                  href="#destinations"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateSection('destinations');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Destinations
                </a>
              </li>
              <li>
                <a
                  href="#customer-portal"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateSection('customer-portal');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Customer Portal
                </a>
              </li>
              <li>
                <a
                  href="#estimator"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateSection('estimator');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Budget Estimator
                </a>
              </li>
              <li>
                <a
                  href="#proposal"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateSection('proposal');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Request Proposal
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenOwnerPage}
                  className="text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
                >
                  Owner Login
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-sky-200/60">
          <span>© 2026 Meridian Corporate Travel AG. All rights reserved.</span>
          <span>IATA Accredited · ISO 20121 Sustainable Events Compliant</span>
        </div>
      </div>
    </footer>
  );
}
