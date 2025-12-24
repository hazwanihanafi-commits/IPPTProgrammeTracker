import { useState } from "react";

export default function ProgrammeTabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].key);

  return (
    <div className="mt-4">
      {/* TAB HEADER */}
      <div className="flex gap-2 border-b mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              active === tab.key
                ? "border-purple-600 text-purple-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="bg-slate-50 rounded-xl p-4">
        {tabs.find((t) => t.key === active)?.content}
      </div>
    </div>
  );
}
