"use client";

import { useMagnetic } from "../hooks/useMagnetic";

export default function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useMagnetic<HTMLAnchorElement>();
  return (
    <a ref={ref} href={href} className={className}>
      {children}
    </a>
  );
}
