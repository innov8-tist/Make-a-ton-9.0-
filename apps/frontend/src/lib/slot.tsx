import * as React from 'react';
import { cn } from './utils';

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(({ children, ...props }, ref) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ...props,
      className: cn(
        (children.props as { className?: string }).className,
        props.className
      ),
      ref,
    });
  }

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} {...props}>
      {children}
    </div>
  );
});

Slot.displayName = 'Slot';

export { Slot };
