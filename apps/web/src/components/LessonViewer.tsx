'use client';

interface LessonContentProps {
  title: string;
  /** HTML or plain-text body from packages/content/data/lessons.json.
   *  Content originates from our own controlled legacy data — not user input. */
  body: string;
  videoUrl?: string;
}

interface LessonViewerProps {
  courseId: string;
  content: LessonContentProps;
}

/**
 * LessonViewer — "Dumb" content component.
 *
 * Accepts all data via props. Has zero knowledge of:
 *   - Whether the current user is an admin or a student.
 *   - Whether the course is paid, free, or locked.
 *   - Stripe, pricing, or entitlement state.
 *
 * Visibility is controlled exclusively by AccessGuard (in the parent route).
 * By the time this component renders, access has already been granted.
 *
 * NOTE: dangerouslySetInnerHTML is used intentionally. The `body` field is
 * sourced from our own controlled JSON (packages/content/data/lessons.json),
 * never from user-generated input. It is not an XSS vector in this context.
 */
export const LessonViewer = ({ courseId, content }: LessonViewerProps) => {
  return (
    <article className="prose prose-slate max-w-none mx-auto p-6">
      <header className="mb-8 border-b pb-4">
        <span className="text-accent font-mono text-sm uppercase tracking-widest">
          Course ID: {courseId}
        </span>
        <h1 className="text-4xl font-bold text-charcoal">{content.title}</h1>
      </header>

      {content.videoUrl && (
        <div className="aspect-video mb-8 bg-black rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src={content.videoUrl}
            className="w-full h-full"
            allowFullScreen
            title={content.title}
          />
        </div>
      )}

      <section
        className="lesson-content-body"
        dangerouslySetInnerHTML={{ __html: content.body }}
      />

      {/*
        NOTE: No "Enroll Now" or "Purchase" components are imported here.
        The AccessGuard handles visibility before this component even renders.
      */}
    </article>
  );
};
