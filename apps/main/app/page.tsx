import { getAllCourses } from '@iiskills/content';
import { CourseCard } from '@iiskills/ui';

/** Human-readable descriptions for each learn subdomain. */
const DESCRIPTIONS: Record<string, string> = {
  'learn-ai':         'Master AI, machine learning, and neural networks through 300 structured lessons.',
  'learn-chemistry':  'Explore atomic theory, chemical reactions, and molecular science in depth.',
  'learn-developer':  'Build modern web apps with HTML, CSS, JavaScript, and the latest frameworks.',
  'learn-geography':  "Discover Earth's landscapes, climates, and human settlements.",
  'learn-management': 'Learn leadership, strategy, operations, and organisational skills.',
  'learn-math':       'From algebra and calculus to statistics, probability, and number theory.',
  'learn-physics':    'Understand mechanics, thermodynamics, electromagnetism, and quantum theory.',
  'learn-pr':         'Craft compelling narratives and master brand communications.',
};

/** Tailwind accent strip colour per course. */
const ACCENTS: Record<string, string> = {
  'learn-ai':         'bg-pastel-lavender',
  'learn-chemistry':  'bg-pastel-blue',
  'learn-developer':  'bg-pastel-blue-light',
  'learn-geography':  'bg-green-200',
  'learn-management': 'bg-orange-200',
  'learn-math':       'bg-pastel-lavender-light',
  'learn-physics':    'bg-blue-200',
  'learn-pr':         'bg-pink-200',
};

export default function HomePage() {
  const courses = getAllCourses(); // 8 × 300-lesson courses from lessons.json

  return (
    <main className="min-h-screen bg-neutral">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-primary text-white py-20 px-8 text-center">
        <h1 className="text-5xl font-bold mb-4">iiskills</h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          Skilling India — 2,400 lessons across 8 disciplines, plus Aptitude training.
        </p>
      </section>

      {/* ── Courses grid ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto py-16 px-8">
        <h2 className="text-3xl font-bold text-charcoal mb-2">Courses</h2>
        <p className="text-slate-500 mb-8">
          Click any course to open its dedicated learning app on the
          <code className="font-mono text-accent mx-1">*.iiskills.in</code> subdomain.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* 8 standard courses (300 lessons each) */}
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={DESCRIPTIONS[course.id] ?? ''}
              lessonCount={course.lessonCount}
              href={`https://${course.id}.iiskills.in`}
              accentClass={ACCENTS[course.id]}
            />
          ))}

          {/* Standalone: learn-apt (no lesson JSON — independent app) */}
          <CourseCard
            id="learn-apt"
            title="Aptitude"
            description="Sharpen reasoning, quantitative, and verbal aptitude skills for competitive exams."
            lessonCount={0}
            href="https://learn-apt.iiskills.in"
            accentClass="bg-yellow-200"
          />
        </div>
      </section>

    </main>
  );
}
