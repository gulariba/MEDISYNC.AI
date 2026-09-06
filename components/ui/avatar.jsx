export default function Avatar({ name, size = 'md', className = '' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' };
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = [
    'from-primary-500 to-accent-500', 'from-accent-500 to-primary-600',
    'from-primary-600 to-primary-400', 'from-accent-400 to-primary-500',
    'from-primary-400 to-accent-600',
  ];
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return (
    <div className={`${sizes[size]} rounded-xl bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white font-semibold shadow-sm ${className}`}>
      {initials}
    </div>
  );
}
