import { getLessonsByCourse } from '@iiskills/content';
import { LessonViewer } from '@iiskills/ui';

interface AdminCoursePageProps {
  params: Promise<{ id: string }>;
}

/**
 * Admin course page — Admin Safe Zone.
 *
 * Admins see all lessons unconditionally.
 * AccessGuard is deliberately NOT used here — admins need zero friction.
 * No paywall component is imported anywhere in this file or its layout.
 *
 * Route: /admin-view/course/[id]
 * Kept under (admin)/admin-view/ to prevent parallel path collisions
 * with the student (student)/course/[id] route.
 */
export default async function AdminCoursePage({ params }: AdminCoursePageProps) {
  const { id } = await params;
  const lessons = getLessonsByCourse(id);

  if (lessons.length === 0) {
    return (
      <main className="p-8">
        <p className="text-charcoal">No lessons found for course: {id}</p>
      </main>
    );
  }

  // Render the first lesson by default (full nav can be added incrementally).
  const first = lessons[0];

  return (
    <main>
      <LessonViewer
        courseId={first.courseId}
        content={{
          title: first.title,
          body: first.content,
          videoUrl: first.videoUrl,
        }}
      />
    </main>
  );
}
