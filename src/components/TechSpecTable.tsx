import React from "react";
import { Technical } from "./Typography";

interface SpecItem {
  label: string;
  value: string;
  highlighted?: boolean;
}

interface TechSpecTableProps extends React.HTMLAttributes<HTMLDivElement> {
  specs: SpecItem[];
  title?: string;
}

export function TechSpecTable({ specs, title, className = "", ...props }: TechSpecTableProps) {
  return (
    <div className={`border border-brand-black/10 bg-brand-white rounded-none ${className}`} {...props}>
      {title && (
        <div className="border-b border-brand-black/10 px-4 py-3 bg-brand-black/5">
          <Technical highlight className="text-xs font-semibold tracking-widest">
            {title}
          </Technical>
        </div>
      )}
      <div className="divide-y divide-brand-black/10">
        {specs.map((spec, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-brand-black/[0.02] transition-colors duration-150"
          >
            <Technical className="text-xs text-brand-black/40 tracking-wider">{spec.label}</Technical>
            <Technical highlight={spec.highlighted} className="text-xs text-right tracking-widest">
              {spec.value}
            </Technical>
          </div>
        ))}
      </div>
    </div>
  );
}
