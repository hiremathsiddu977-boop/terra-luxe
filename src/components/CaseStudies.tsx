import { CASE_STUDIES } from '../data/businessTourismData';

export function CaseStudies() {
  return (
    <section
      id="case-studies"
      className="py-16 lg:py-24 bg-[#09152e] border-b border-sky-300/15"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white"
            style={{ textWrap: 'balance' }}
          >
            Measured commercial outcomes from recent programs.
          </h2>
          <p className="mt-4 text-base text-sky-100/80 leading-relaxed">
            Every engagement is audited against pre-agreed attendance, budget variance, and
            strategic alignment objectives.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CASE_STUDIES.map((study) => (
            <article
              key={study.id}
              className="bg-[#0e1f42] border border-sky-300/20 rounded-xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-sky-200/75">
                  <span>{study.sector}</span>
                  <span aria-hidden="true">·</span>
                  <span>{study.hub}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {study.delegates} delegates ({study.durationDays}d)
                  </span>
                </div>

                <h3 className="mt-3 font-display text-xl font-semibold text-white">
                  {study.client}
                </h3>

                <div className="mt-5 py-4 border-y border-sky-300/15">
                  <div className="font-display text-lg font-semibold text-amber-300 tabular-nums">
                    {study.headlineMetric}
                  </div>
                  <p className="mt-1 text-xs text-sky-200/75 leading-relaxed">
                    {study.metricContext}
                  </p>
                </div>

                <div className="mt-5 space-y-3 text-sm text-sky-100/80 leading-relaxed">
                  <p>
                    <span className="font-semibold text-white">Mandate: </span>
                    {study.challenge}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Execution: </span>
                    {study.execution}
                  </p>
                </div>
              </div>

              <blockquote className="mt-6 pt-5 border-t border-sky-300/15">
                <p className="text-sm text-sky-50/90 leading-relaxed italic">
                  “{study.quote}”
                </p>
                <footer className="mt-3 text-xs">
                  <div className="font-semibold text-white">{study.authorName}</div>
                  <div className="text-sky-200/70">{study.authorRole}</div>
                </footer>
              </blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
