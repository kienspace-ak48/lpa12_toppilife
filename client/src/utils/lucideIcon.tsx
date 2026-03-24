import React from "react";
import * as Icons from "lucide-react";
import { type LucideProps } from "lucide-react";

type IconComponent = React.ComponentType<LucideProps>;

const ALIAS_MAP: Record<string, string> = {
  Shield: "ShieldCheck",
  RefreshCcw: "RotateCcw",
};

function normalizeIconName(raw?: string): string {
  if (!raw) return "Truck";
  const clean = String(raw).trim();
  const withoutPrefix = clean.replace(/^lucide-/, "");
  const camel = withoutPrefix.replace(/[-_\s]+(.)?/g, (_, c: string) =>
    c ? c.toUpperCase() : "",
  );
  const pascal = camel.charAt(0).toUpperCase() + camel.slice(1);
  return ALIAS_MAP[pascal] || pascal;
}

export function getLucideIconByName(name?: string): IconComponent {
  const key = normalizeIconName(name);
  const DynamicIcon = Icons[key as keyof typeof Icons] as unknown as IconComponent;
  return DynamicIcon || (Icons.Truck as unknown as IconComponent);
}

