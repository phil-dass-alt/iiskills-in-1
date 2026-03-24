'use client';

import Link from 'next/link';

export interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  /** Absolute URL of the learn subdomain, e.g. https://learn-ai.iiskills.in */
  href: string;
  /** Tailwind colour class for the card accent strip */
  accentClass?: string;
}

/**
 * CourseCard — used on the iiskills.in homepage to link to each learn subdomain.
 * Also used by the learn-* apps' own homepages for navigation context.
 */
export const CourseCard = ({
  title,
  description,
  lessonCount,
  href,
  accentClass = 'bg-pastel-blue',
}: CourseCardProps) => {
  return (
    <a
      href={href}
      className="group block rounded-2xl border border-slate-200 bg-white shadow-sm
                 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Accent strip */}
      <div className={`h-2 w-full ${accentClass}`} />

      <div className="p-6 space-y-3">
        <h3 className="text-xl font-bold text-charcoal group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-medium text-slate-400">
            {lessonCount} lessons
          </span>
          <span className="text-sm font-semibold text-primary group-hover:underline">
            Start Learning →
          </span>
        </div>
      </div>
    </a>
  );
};
