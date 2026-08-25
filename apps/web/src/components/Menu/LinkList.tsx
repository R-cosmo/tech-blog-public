import type { PropsWithChildren } from "react";

export function LinkList({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}
