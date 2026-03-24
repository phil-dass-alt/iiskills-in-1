import { getLessonBySlug } from '@iiskills/content';
import { AccessGuard } from '@iiskills/access';
import { LessonViewer, PaywallUI } from '@iiskills/ui';
import Link from 'next/link';

const COURSE_ID = 'learn-physics';

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Individual lesson page for Physics.
 *
 * AccessGuard is the ONLY place paywall logic runs.
 * If the user has access → LessonViewer renders content.
 * If the user is paywalled → PaywallUI renders the enrol prompt.
 */
export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(COURSE_ID, slug);

  if (!lesson) {
    return (
      <main className="p-8">
        <Link href="/" className="text-primary hover:underline text-sm">← Back to Physics</Link>
        <p className="mt-4 text-charcoal">Lesson not found.</p>
      </main>
    );
  }

  return (
    <main>
      <div className="bg-neutral border-b px-8 py-3">
        <Link href="/" className="text-primary hover:underline text-sm">
          ← Physics
        </Link>
      </div>

      <AccessGuard
        courseId={COURSE_ID}
        fallback={<PaywallUI courseId={COURSE_ID} />}
      >
        <LessonViewer
          courseId={COURSE_ID}
          content={{
            title: lesson.title,
            body: lesson.content,
            videoUrl: lesson.videoUrl,
          }}
        />
      </AccessGuard>
    </main>
  );
}
