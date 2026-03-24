'use client';

interface PaywallUIProps {
  courseId: string;
}

/**
 * PaywallUI — fallback rendered by AccessGuard when the user lacks access.
 *
 * This is the ONLY place in the codebase where purchase/upgrade prompts live.
 * It is never imported by LessonViewer, admin pages, or any layout.
 * AccessGuard decides whether to render this or the real content.
 */
export const PaywallUI = ({ courseId }: PaywallUIProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-full bg-pastel-lavender mx-auto flex items-center justify-center">
          <span className="text-2xl" aria-hidden="true">🔒</span>
        </div>

        <h2 className="text-2xl font-bold text-charcoal">
          This course requires access
        </h2>

        <p className="text-charcoal/70 leading-relaxed">
          Course <span className="font-mono text-accent">{courseId}</span> is part of
          the iiskills library. Enroll to unlock all lessons, projects, and assessments.
        </p>

        <a
          href={`/enroll?course=${encodeURIComponent(courseId)}`}
          className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-lg
                     hover:bg-primary/90 transition-colors focus:outline-none
                     focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Enroll Now
        </a>

        <p className="text-sm text-charcoal/50">
          Already enrolled?{' '}
          <a href="/login" className="text-accent hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};
