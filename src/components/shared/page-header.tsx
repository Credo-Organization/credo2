import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 border border-stone-200">
            <Icon className="h-5 w-5 text-stone-700" />
          </div>
        )}
        <div>
          {/* zinc-100 measured 1.03:1 against the cream dashboard panel - the
              heading rendered as a blank space. It follows the page's own
              foreground token so it cannot drift from the surface again. */}
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children && <div className="flex items-center gap-2 mt-3 sm:mt-0">{children}</div>}
    </div>
  );
}
