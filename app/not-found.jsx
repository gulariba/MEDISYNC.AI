import Link from 'next/link';
export const metadata = { title: 'Page Not Found — MediSync.ai' };

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 px-6">
      <div className="text-center max-w-md">
        <p className="text-7xl font-extrabold text-grad">404</p>
        <h1 className="mt-4 text-2xl font-bold text-surface-900 dark:text-white">Page not found</h1>
        <p className="mt-2 text-surface-500 dark:text-surface-400">The page you are looking for does not exist.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 btn-primary px-6 py-3 text-sm font-semibold text-white rounded-xl">Back to Home</Link>
      </div>
    </div>
  );
}
