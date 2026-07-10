import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function AdminSectionHeader({
  title,
  subtitle,
  action,
  actionHref,
  actionLabel,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-3 flex-wrap", className)}>
      <div>
        <h2 className="text-base font-bold text-ink">{title}</h2>
        {subtitle && (
          <p className="text-xs text-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand-2 transition-colors"
        >
          {actionLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
      {action}
    </div>
  );
}
