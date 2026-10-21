import { useState, type ReactNode } from 'react';

interface TabsProps {
  tabs: { id: string; label: string; content: ReactNode }[];
}

/** Tab sederhana (tablist/tab/tabpanel) untuk Preview ⇄ Kode. */
function Tabs({ tabs }: TabsProps) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <div role="tablist" className="flex gap-1 border-b border-border bg-surface px-2 pt-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === current?.id}
            onClick={() => setActive(tab.id)}
            className={[
              '-mb-px cursor-pointer rounded-t-md border border-b-0 px-3 py-1.5 text-[11px] font-medium',
              tab.id === current?.id
                ? 'border-border bg-background text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{current?.content}</div>
    </div>
  );
}

export default Tabs;
