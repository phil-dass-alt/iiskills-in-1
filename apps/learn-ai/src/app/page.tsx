import { getLessonsByCourse } from '@iiskills/content';
import Link from 'next/link';

const COURSE_ID = 'learn-ai';

/**
 * Artificial Intelligence home page.
 * Lists every lesson for this course, ordered by module then lesson number.
 * Access to individual lessons is gated by AccessGuard on the lesson page.
 */
export default function CoursePage() {
  const lessons = getLessonsByCourse(COURSE_ID);

  return (
    <main className="min-h-screen bg-neutral">
      <section className="bg-primary text-white py-12 px-8">
        <a href="https://iiskills.in" className="text-white/70 text-sm hover:text-white mb-4 inline-block">
          ← iiskills.in
        </a>
        <h1 className="text-4xl font-bold">Artificial Intelligence</h1>
        <p className="mt-2 text-white/80">{lessons.length} lessons</p>
      </section>

      <section className="max-w-4xl mx-auto py-10 px-8">
        <ul className="space-y-3">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                href={`/lesson/${lesson.slug}`}
                className="flex items-center justify-between p-4 rounded-xl border
                           border-slate-200 bg-white hover:shadow-md hover:border-primary
                           transition-all duration-150 group"
              >
                <span className="text-charcoal font-medium group-hover:text-primary transition-colors">
                  {lesson.title}
                </span>
                <span className="text-slate-400 text-sm ml-4 shrink-0">
                  Lesson {lesson.order}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
