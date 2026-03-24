'use client';

interface LessonContentProps {
  title: string;
  /**
   * HTML or plain-text body from packages/content/data/lessons.json.
   * Content originates from our own controlled legacy data — not user input.
   */
  body: string;
  videoUrl?: string;
}

export interface LessonViewerProps {
  courseId: string;
  content: LessonContentProps;
}

/**
 * LessonViewer — shared "dumb" content renderer used by every learn-* app.
 *
 * Has zero knowledge of access control, pricing, or user roles.
 * Visibility is managed exclusively by AccessGuard in the parent route.
 *
 * NOTE: dangerouslySetInnerHTML is intentional. The `body` field comes only
 * from packages/content/data/lessons.json — our own controlled data, never
 * from user-generated input.
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
    </article>
  );
};
