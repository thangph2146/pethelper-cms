
import { cn } from '@/lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'warning' | 'error';
}

export const Alert = ({ variant = 'default', className, ...props }: AlertProps) => {
  return <div className={cn('alert', variant, className)} {...props} />;
};