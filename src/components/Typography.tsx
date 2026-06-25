import React from "react";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

interface DisplayProps extends TypographyProps {
  as?: "h1" | "h2" | "h3" | "h4";
  indented?: boolean;
}

export function Display({
  children,
  as: Component = "h1",
  indented = false,
  className = "",
  ...props
}: DisplayProps) {
  const baseClass = "font-display-strict uppercase text-brand-black";
  const indentClass = indented ? "pl-[10vw] md:pl-[20vw]" : "";
  return (
    <Component className={`${baseClass} ${indentClass} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

interface BodyProps extends TypographyProps {
  as?: "p" | "span" | "div";
  weight?: "light" | "regular" | "semibold";
}

export function Body({
  children,
  as: Component = "p",
  weight = "light",
  className = "",
  ...props
}: BodyProps) {
  const weightClass =
    weight === "light" ? "font-light" : weight === "regular" ? "font-normal" : "font-semibold";
  return (
    <Component
      className={`font-body-strict text-brand-black/70 ${weightClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

interface TechnicalProps extends TypographyProps {
  as?: "span" | "div" | "p";
  highlight?: boolean;
}

export function Technical({
  children,
  as: Component = "span",
  highlight = false,
  className = "",
  ...props
}: TechnicalProps) {
  const colorClass = highlight ? "text-[color:var(--team-accent,var(--brand-red,#7A7A7A))] font-medium" : "text-brand-black/80";
  return (
    <Component
      className={`font-technical-strict uppercase ${colorClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
