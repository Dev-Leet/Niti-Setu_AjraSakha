import { Button } from './button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedButton({ children, className }: AnimatedButtonProps) {
  return (
    <Button
      className={cn(
        `
        transition-all duration-200
        hover:scale-105
        active:scale-95
        shadow-lg shadow-primary/30
        `,
        className
      )}
    >
      {children}
    </Button>
  );
}
