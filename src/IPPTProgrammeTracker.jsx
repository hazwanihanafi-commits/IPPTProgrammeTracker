import React, { useState, useEffect } from "react";
import IPPTPLOModule from "./IPPTPLOModule";

/* =======================
   CONFIG
======================= */

const PHASES = [
  { key: "q1", label: "Q1 – Penasihat Luar" },
  { key: "q2", label: "Q2 – CE" },
  { key: "q3", label: "Q3 – SRR" },
  { key: "q4", label: "Q4 – Audit APP" },
];

const DEFAULT_PHASE_STATE = {
  q1: "Not started",
  q2: "Not started",
  q3: "Not started",
  q4: "Not started",
};

/* =======================
   PROGRAM LIST (ringkas contoh)
   — guna list penuh anda
======================= */

const PROGRAMS = [
  { id: 1, name: "MSc Chemistry", owner: "PPSK", nec: "0531", pic: "Noorfatimah" },
  { id: 2, name: "MSc Biomedicine", owner: "PPSK", nec: "0912", pic: "Rabiatul" },
  { id: 3, name: "MSc Clinical Sciences", owner: "PPSP", nec: "0914", pic: "Hazwani" },
  { id: 4, name: "MSc Community Medicine", owner: "PPSP", nec: "0923", pic: "Rohayu" },
  // 👉 guna SENARAI PENUH anda di sini
];

/* =======================
   HELPER
======================= */

function getInitialProgrammeStates() {
  const obj = {};
  PROGRAMS.forEach(p => {
    obj[p.id] = { ...DEFAULT_PHASE_STATE };
  });
  return obj;
}

/* =======================
   TABS COMPONENT
======================= */

function ProgrammeTabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].key);

  return (
    <div>
      <div className="flex gap-2 mb-3 border-b">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-3 py-1 text-sm rounded-t ${
              active === t.key
                ? "bg-sky-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-3 bg-slate-50 rounded">
        {tabs.find(t => t.key === active)?.content}
      </div>
    </div>
  );
}

/* =======================
   MAIN COMPONENT
======================= */

export default function IPPTProgrammeTracker() {
  const [programmeStates, setProgrammeStates] = useState({});

  /* ===== INIT STATE ===== */
  useEffect(() => {
    const saved = localStorage.getItem("ipptProgrammeStates");
    if (saved) {
      setProgrammeStates(JSON.parse(saved));
    } else {
      setProgrammeStates(getInitialProgrammeStates());
    }
  }, []);

  useEffect(() => {
    if (Object.keys(programmeStates).length > 0) {
      localStorage.setItem(
        "ipptProgrammeStates",
        JSON.stringify(programmeStates)
      );
    }
  }, [programmeStates]);

  const getProgrammeState = (id) =>
    programmeStates[id] || { ...DEFAULT_PHASE_STATE };

  /* ===== UI ===== */

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-sky-700">
        IPPT Programme Tracker (Tabs per Program)
      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {PROGRAMS.map((p) => {
          const state = getProgrammeState(p.id);

          return (
            <article
              key={p.id}
              className="bg-white border rounded-2xl shadow-sm p-4"
            >
              {/* HEADER */}
              <div className="mb-3">
                <h2 className="font-semibold text-lg">{p.name}</h2>
                <p className="text-xs text-slate-500">
                  {p.owner} · NEC {p.nec} · PIC: {p.pic}
                </p>
              </div>

              {/* TABS */}
              <ProgrammeTabs
                tabs={[
                  {
                    key: "overview",
                    label: "Overview",
                    content: (
                      <ul className="text-sm space-y-1">
                        {PHASES.map(ph => (
                          <li key={ph.key}>
                            <strong>{ph.label}:</strong> {state[ph.key]}
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    key: "plo",
                    label: "PLO & Attainment",
                    content: (
                      <IPPTPLOModule programmeId={p.id} />
                    ),
                  },
                  {
                    key: "srr",
                    label: "SRR Evidence",
                    content: (
                      <p className="text-sm">
                        ✔ Checklist SRR COPPA (akan sambung modul Evidence Matrix)
                      </p>
                    ),
                  },
                  {
                    key: "docs",
                    label: "Documents",
                    content: (
                      <p className="text-sm">
                        📁 Google Drive & local uploads
                      </p>
                    ),
                  },
                  {
                    key: "cqi",
                    label: "CQI",
                    content: (
                      <p className="text-sm">
                        🔁 CQI Issues & Action Plan
                      </p>
                    ),
                  },
                ]}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}
