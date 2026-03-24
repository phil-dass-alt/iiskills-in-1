import lessonsData from '../data/lessons.json';

/**
 * Flat lesson shape. Zero access-control fields by design.
 * All entitlement decisions live in @iiskills/access — never here.
 */
export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  /** HTML or plain-text content — originated from controlled legacy data. */
  content: string;
  order: number;
  /** Optional Vimeo/YouTube embed URL. Absent when the source had no video. */
  videoUrl?: string;
}

const lessons: Lesson[] = lessonsData as Lesson[];

/** Return every lesson for a given course, sorted by order. */
export function getLessonsByCourse(courseId: string): Lesson[] {
  return lessons.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);
}

/** Look up a single lesson by its composite id. Returns undefined if not found. */
export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

/** Look up a single lesson by courseId + slug. Returns undefined if not found. */
export function getLessonBySlug(courseId: string, slug: string): Lesson | undefined {
  return lessons.find((l) => l.courseId === courseId && l.slug === slug);
}

export { lessons };

/**
 * Aggregated course summary derived from lessons data.
 * Contains zero access-control fields — entitlement lives in @iiskills/access.
 */
export interface Course {
  id: string;
  /** Human-readable course name derived from the courseId. */
  title: string;
  /** Total number of extracted lessons for this course. */
  lessonCount: number;
}

/** Stable display names keyed by courseId. Extend as new courses are extracted. */
const COURSE_TITLES: Record<string, string> = {
  'learn-ai': 'Artificial Intelligence',
  'learn-chemistry': 'Chemistry',
  'learn-developer': 'Web Development',
  'learn-geography': 'Geography',
  'learn-management': 'Business Management',
  'learn-math': 'Mathematics',
  'learn-physics': 'Physics',
  'learn-pr': 'Public Relations',
};

/**
 * Return one Course summary entry per distinct courseId found in lessons.json,
 * sorted alphabetically by id.
 */
export function getAllCourses(): Course[] {
  const counts = new Map<string, number>();

  for (const lesson of lessons) {
    counts.set(lesson.courseId, (counts.get(lesson.courseId) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([id, lessonCount]) => ({
      id,
      title: COURSE_TITLES[id] ?? id,
      lessonCount,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}
