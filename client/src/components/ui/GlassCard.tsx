import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        `
        rounded-2xl
        bg-white/70
        dark:bg-slate-900/60
        backdrop-blur-xl
        border border-white/30 dark:border-slate-700
        shadow-2xl
        transition-all duration-300
        hover:shadow-emerald-500/20
        hover:-translate-y-1
        `,
        className
      )}
    >
      {children}
    </div>
  );
}
