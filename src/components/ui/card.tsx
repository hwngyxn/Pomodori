import * as React from "react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-xl bg-card text-card-foreground shadow ${className || ''}`}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
