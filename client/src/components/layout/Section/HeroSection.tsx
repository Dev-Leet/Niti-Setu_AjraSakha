import { Container } from '../Container/Container';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroSection({ children, className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        `
        relative overflow-hidden
        bg-linear-to-br
        from-emerald-50 via-white to-emerald-100
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        `,
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)]" />

      <Container className="relative py-20 lg:py-28">
        {children}
      </Container>
    </section>
  );
}
