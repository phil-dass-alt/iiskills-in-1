import { AccessGuard } from '@iiskills/access';
import { getLessonsByCourse } from '@iiskills/content';
import { LessonViewer } from '@/components/LessonViewer';
import { PaywallUI } from '@/components/PaywallUI';

interface StudentCoursePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Student course page — Content Gate.
 *
 * AccessGuard is the ONLY place paywall logic runs.
 * This component never imports useAccess, never checks entitledCourses,
 * and never knows whether the user is an admin.
 *
 * If the user has access  → LessonViewer renders the content.
 * If the user is paywalled → PaywallUI renders the upgrade prompt.
 */
export default async function StudentCoursePage({ params }: StudentCoursePageProps) {
  const { id } = await params;
  const lessons = getLessonsByCourse(id);
  const first = lessons[0];

  if (!first) {
    return (
      <main className="p-8">
        <p className="text-charcoal">No lessons found for course: {id}</p>
      </main>
    );
  }

  return (
    <main>
      <AccessGuard
        courseId={id}
        fallback={<PaywallUI courseId={id} />}
      >
        <LessonViewer
          courseId={first.courseId}
          content={{
            title: first.title,
            body: first.content,
            videoUrl: first.videoUrl,
          }}
        />
      </AccessGuard>
    </main>
  );
}
