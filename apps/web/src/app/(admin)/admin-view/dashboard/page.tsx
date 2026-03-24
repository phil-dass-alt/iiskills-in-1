import { getAllCourses } from '@iiskills/content';
import Link from 'next/link';

/**
 * Admin Dashboard — Content Manager.
 *
 * Lists every extracted course from packages/content/data/lessons.json.
 * Lives inside the (admin) route group: no AccessGuard, no paywall imports.
 * Admins see all courses unconditionally; the UserProvider at the root has
 * already resolved their role before this page is visited.
 */
export default function AdminDashboard() {
  const courses = getAllCourses();

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-charcoal">Admin Content Manager</h1>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Unrestricted Mode Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-slate-500 text-sm mb-4">
              {course.lessonCount} Lessons Extracted
            </p>
            <div className="flex gap-3">
              <Link
                href={`/admin-view/course/${course.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                Preview Lessons →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
