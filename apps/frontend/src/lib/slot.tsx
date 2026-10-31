import * as React from 'react';
import { cn } from './utils';

interface SlotProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLDivElement, SlotProps>(({ children, ...props }, ref) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      className: cn(
        (children.props as { className?: string }).className,
        props.className
      ),
    });
  }

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

Slot.displayName = 'Slot';

export { Slot };
