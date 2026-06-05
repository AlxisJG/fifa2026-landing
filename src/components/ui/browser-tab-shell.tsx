"use client";

import type { ReactNode } from "react";

export type BrowserTabItem = {
  id: string;
  label: string;
};

type BrowserTabShellProps = {
  tabs: BrowserTabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: ReactNode;
  badge?: ReactNode;
};

export function BrowserTabShell({
  tabs,
  activeTab,
  onTabChange,
  children,
  badge
}: BrowserTabShellProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-sky-200/80 bg-slate-100/90 shadow-[0_16px_44px_rgba(30,64,175,0.12)] sm:rounded-3xl">
      <div className="flex items-end gap-2 border-b border-slate-200/80 bg-gradient-to-b from-slate-100 to-slate-200/60 px-2 pt-2 sm:gap-3 sm:px-4 sm:pt-3">
        <div
          className="flex min-w-0 flex-1 items-end gap-0.5 overflow-x-auto pb-0 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-1 [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Secciones"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab.id)}
                className={`relative shrink-0 rounded-t-xl px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-[0.14em] ${
                  isActive
                    ? "z-10 -mb-px border border-b-0 border-sky-200/80 bg-white/95 text-slate-900 shadow-[0_-2px_8px_rgba(15,23,42,0.04)]"
                    : "border border-transparent bg-slate-200/45 text-slate-500 hover:bg-slate-200/75 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {badge ? <div className="mb-2.5 shrink-0 sm:mb-3">{badge}</div> : null}
      </div>

      <div className="bg-white/95 p-4 sm:p-6" role="tabpanel">
        {children}
      </div>
    </div>
  );
}
