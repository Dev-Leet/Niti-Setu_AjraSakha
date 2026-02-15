import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'none' | 'muted' | 'gradient';
}

const spacingClasses = {
  sm: 'py-8',
  md: 'py-12 sm:py-16',
  lg: 'py-16 sm:py-20 lg:py-24',
  xl: 'py-20 sm:py-24 lg:py-32',
};

const backgroundClasses = {
  none: '',
  muted: 'bg-muted/50',
  gradient: 'bg-gradient-to-b from-background to-muted/30',
};

export const Section = ({
  children,
  className,
  spacing = 'md',
  background = 'none',
}: SectionProps) => {
  return (
    <section className={cn(spacingClasses[spacing], backgroundClasses[background], className)}>
      {children}
    </section>
  );
};