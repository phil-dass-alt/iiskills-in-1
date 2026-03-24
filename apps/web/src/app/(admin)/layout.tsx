/**
 * Admin Safe Zone layout.
 *
 * This route group intentionally imports ZERO paywall or purchase components.
 * Admins land here after the UserProvider has resolved their role to 'ADMIN'.
 * No paywall logic runs, no Stripe imports exist, no "Enroll Now" buttons appear.
 *
 * Route group: (admin) — does NOT add a URL segment.
 * Matching paths: /admin-view/course/[id] and /admin-view/dashboard served from this layout.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
