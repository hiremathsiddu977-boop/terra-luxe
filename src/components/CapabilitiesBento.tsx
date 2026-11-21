import { CAPABILITIES } from '../data/businessTourismData';

export function CapabilitiesBento() {
  return (
    <section
      id="capabilities"
      className="py-16 lg:py-24 bg-[#071124] border-b border-sky-300/15"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white"
            style={{ textWrap: 'balance' }}
          >
            Four operational disciplines under one corporate contract.
          </h2>
          <p className="mt-4 text-base text-sky-100/80 leading-relaxed">
            Instead of stitching together local destination agencies, air charter brokers, and
            audiovisual vendors, Meridian runs every phase through a single accountable production
            team.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap) => (
            <article
              key={cap.number}
              className={`bg-[#0e1f42] border border-sky-300/20 rounded-xl p-6 sm:p-8 flex flex-col justify-between ${
                cap.span === 'wide' ? 'lg:col-span-2' : 'lg:col-span-1'
              }`}
            >
              <div>
                <div className="flex items-baseline justify-between gap-4 border-b border-sky-300/15 pb-4">
                  <h3 className="font-display text-xl font-semibold text-white">
                    {cap.number}. {cap.title}
                  </h3>
                </div>

                <p className="mt-4 text-sm sm:text-base text-sky-100/80 leading-relaxed max-w-2xl">
                  {cap.outcome}
                </p>

                <ul className="mt-6 space-y-2.5 text-sm text-sky-100/90">
                  {cap.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-sky-300/15 flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-xs font-medium text-sky-200/75">{cap.metricLabel}</span>
                <span className="font-mono text-sm font-semibold text-amber-300 tabular-nums">
                  {cap.metricValue}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
