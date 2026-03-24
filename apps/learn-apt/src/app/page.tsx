/**
 * Aptitude home page — standalone app at learn-apt.iiskills.in.
 *
 * This app is independent of the lessons.json content used by the 8 learn-*
 * apps.  Add aptitude modules, quizzes, and practice sets here.
 */
export default function AptitudePage() {
  return (
    <main className="min-h-screen bg-neutral">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-primary text-white py-12 px-8 text-center">
        <a href="https://iiskills.in" className="text-white/70 text-sm hover:text-white mb-4 inline-block">
          ← iiskills.in
        </a>
        <h1 className="text-4xl font-bold mt-2">Aptitude Training</h1>
        <p className="mt-2 text-white/80 max-w-xl mx-auto">
          Sharpen your reasoning, quantitative, and verbal skills for competitive exams.
        </p>
      </section>

      {/* ── Categories ───────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto py-14 px-8">
        <h2 className="text-2xl font-bold text-charcoal mb-6">Practice Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🔢</div>
            <h3 className="text-xl font-bold text-charcoal mb-2">Quantitative Aptitude</h3>
            <p className="text-sm text-slate-500">Numbers, arithmetic, algebra, geometry, and data interpretation.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-charcoal mb-2">Verbal Aptitude</h3>
            <p className="text-sm text-slate-500">Reading comprehension, vocabulary, grammar, and verbal reasoning.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-bold text-charcoal mb-2">Logical Reasoning</h3>
            <p className="text-sm text-slate-500">Patterns, syllogisms, analogies, and critical thinking.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-charcoal mb-2">Data Interpretation</h3>
            <p className="text-sm text-slate-500">Charts, graphs, tables, and statistical analysis.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-charcoal mb-2">General Knowledge</h3>
            <p className="text-sm text-slate-500">Current affairs, history, science, and static GK.</p>
          </div>
        </div>
      </section>

    </main>
  );
}
