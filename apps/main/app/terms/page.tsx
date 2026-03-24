import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions — iiskills',
  description: 'Terms and Conditions for using iiskills.in and its learning platforms.',
};

const EFFECTIVE_DATE = '24 March 2026';
const SUPPORT_EMAIL  = 'support@iiskills.in';
const SITE_URL       = 'https://iiskills.in';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-primary text-white py-12 px-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Terms &amp; Conditions</h1>
        <p className="text-white/80 text-sm">Effective date: {EFFECTIVE_DATE}</p>
      </header>

      {/* ── Body ───────────────────────────────────────────────── */}
      <article className="max-w-3xl mx-auto py-14 px-8 space-y-10 text-charcoal">

        {/* 1 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
          <p className="leading-relaxed text-charcoal/80">
            By accessing or using any service available at{' '}
            <a href={SITE_URL} className="text-accent hover:underline">{SITE_URL}</a>{' '}
            or its subdomains (collectively, the &ldquo;Platform&rdquo;), you agree to be
            bound by these Terms &amp; Conditions (&ldquo;Terms&rdquo;). If you do not agree,
            please discontinue use immediately.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">2. Description of Service</h2>
          <p className="leading-relaxed text-charcoal/80">
            iiskills provides structured online learning content across multiple disciplines
            including Artificial Intelligence, Chemistry, Web Development, Geography, Management,
            Mathematics, Physics, Public Relations, and Aptitude training (&ldquo;Courses&rdquo;).
            Courses are delivered as independent learning apps on <code className="font-mono text-accent">*.iiskills.in</code> subdomains.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">3. User Accounts &amp; Eligibility</h2>
          <ul className="list-disc list-inside space-y-2 text-charcoal/80 leading-relaxed">
            <li>You must be at least 13 years old to create an account.</li>
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You agree to provide accurate and current information during registration.</li>
            <li>One account per person; sharing accounts is not permitted.</li>
          </ul>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">4. Course Access &amp; Enrolment</h2>
          <p className="leading-relaxed text-charcoal/80">
            Some courses require enrolment or a paid subscription. Access is granted to the
            individual purchaser only and is non-transferable. Enrolment fees are stated at
            the time of purchase. iiskills reserves the right to update pricing with reasonable
            notice to existing subscribers.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">5. Intellectual Property</h2>
          <p className="leading-relaxed text-charcoal/80">
            All lesson content, course materials, trademarks, and software on the Platform are
            the exclusive property of iiskills or its licensors. You may not reproduce, distribute,
            modify, or create derivative works without prior written permission.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">6. Acceptable Use</h2>
          <p className="mb-2 text-charcoal/80">You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 text-charcoal/80 leading-relaxed">
            <li>Use the Platform for any unlawful purpose.</li>
            <li>Scrape, crawl, or systematically download course content.</li>
            <li>Attempt to gain unauthorised access to any part of the Platform.</li>
            <li>Upload or transmit malicious code or harmful content.</li>
            <li>Impersonate another user or iiskills staff.</li>
          </ul>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">7. Privacy</h2>
          <p className="leading-relaxed text-charcoal/80">
            Your use of the Platform is also governed by our Privacy Policy. We use Supabase
            for authentication and data storage. We do not sell personal data to third parties.
            For details on data collection, storage, and your rights, please contact us at{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent hover:underline">{SUPPORT_EMAIL}</a>.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">8. Disclaimer of Warranties</h2>
          <p className="leading-relaxed text-charcoal/80">
            The Platform is provided &ldquo;as is&rdquo; without warranties of any kind, express or
            implied, including but not limited to warranties of merchantability, fitness for a
            particular purpose, or non-infringement. iiskills does not warrant that the service
            will be uninterrupted or error-free.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">9. Limitation of Liability</h2>
          <p className="leading-relaxed text-charcoal/80">
            To the fullest extent permitted by law, iiskills shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages arising out of
            your access to or use of (or inability to use) the Platform.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">10. Modifications to Terms</h2>
          <p className="leading-relaxed text-charcoal/80">
            iiskills may revise these Terms at any time. We will update the effective date at
            the top of this page. Continued use of the Platform after changes constitutes
            acceptance of the revised Terms.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">11. Governing Law</h2>
          <p className="leading-relaxed text-charcoal/80">
            These Terms shall be governed by and construed in accordance with the laws of India.
            Any disputes shall be subject to the exclusive jurisdiction of the courts of India.
          </p>
        </section>

        {/* 12 — Contact */}
        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">12. Contact Us</h2>
          <p className="text-charcoal/80 leading-relaxed">
            For any questions, concerns, or requests regarding these Terms, please reach out to
            our support team:
          </p>
          <p className="mt-3 text-lg font-semibold">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
        </section>

      </article>

      {/* ── Footer nav ─────────────────────────────────────────── */}
      <div className="text-center py-8 text-sm text-charcoal/50">
        <Link href="/" className="hover:text-accent transition-colors">
          ← Back to iiskills home
        </Link>
      </div>

    </main>
  );
}
