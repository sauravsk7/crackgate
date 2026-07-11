"use client";

import { cn } from "@/lib/utils";
import {
  Users,
  Crown,
  CreditCard,
  BarChart3,
  ClipboardList,
  FileText,
  Flag,
  Inbox,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP = {
  Users,
  Crown,
  CreditCard,
  BarChart3,
  ClipboardList,
  FileText,
  Flag,
  Inbox,
} as const;

type IconName = keyof typeof ICON_MAP;

function resolveIcon(name: IconName): LucideIcon {
  return ICON_MAP[name] ?? Inbox;
}

export function AdminEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: IconName;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  const Icon = resolveIcon(icon);
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 text-center",
        className
      )}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 -m-3 rounded-full bg-brand/5 animate-pulse" />
        <div className="absolute inset-0 -m-6 rounded-full bg-brand/[0.03]" />
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-brand/10 border border-brand/10">
          <Icon className="w-7 h-7 text-brand/50" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <p className="text-xs text-muted mt-1 max-w-xs leading-relaxed">{description}</p>

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function AdminDataTableEmpty({
  colSpan,
  icon,
  title,
  description,
}: {
  colSpan: number;
  icon: IconName;
  title: string;
  description: string;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-0">
        <AdminEmptyState icon={icon} title={title} description={description} />
      </td>
    </tr>
  );
}
