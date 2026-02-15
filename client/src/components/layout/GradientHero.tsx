import { cn } from '@/lib/utils';

interface GradientHeroProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'subtle';
}

const variantClasses = {
  primary:
    'bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:to-secondary/5',
  secondary:
    'bg-gradient-to-br from-secondary/10 via-background to-accent/10 dark:from-secondary/5 dark:to-accent/5',
  subtle: 'bg-gradient-to-b from-muted/30 to-background',
};

export const GradientHero = ({ children, className, variant = 'primary' }: GradientHeroProps) => {
  return (
    <div className={cn('relative overflow-hidden', variantClasses[variant], className)}>
      {children}
    </div>
  );
};