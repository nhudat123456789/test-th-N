import { safeReturnTo } from '@/lib/authReturnTo';

export function isAdmin(user) {
  return user?.role === 'admin';
}

/** Base44 default role for customers is "user". */
export function isCustomer(user) {
  return !!user && user.role !== 'admin';
}

export function getPostLoginPath(user, returnTo) {
  if (isAdmin(user)) return '/admin/dashboard';

  const safe = returnTo || safeReturnTo();
  if (safe.startsWith('/admin')) return '/';
  return safe;
}
