import { useState } from "react";

export default function ProgrammeTabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].key);

  return (
    <div>
      {/* Tab header */}
      <div className="flex gap-2 border-b mb-3">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-3 py-2 text-sm font-medium border-b-2 ${
              active === t.key
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {tabs.find(t => t.key === active)?.content}
      </div>
    </div>
  );
}
