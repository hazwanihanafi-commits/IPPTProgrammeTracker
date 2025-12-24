import React, { useEffect, useMemo, useState } from "react";
import IPPTPLOModule from "./components/IPPTPLOModule";

/* =========================================================
   CONSTANTS
========================================================= */

const PHASES = [
  { key: "q1", label: "Q1 – Penasihat Luar" },
  { key: "q2", label: "Q2 – Curriculum Evaluation (CE)" },
  { key: "q3", label: "Q3 – SRR" },
  { key: "q4", label: "Q4 – Audit APP" },
];

const DEFAULT_PHASE_STATE = {
  q1: "Not started",
  q2: "Not started",
  q3: "Not started",
  q4: "Not started",
};

const STATUS_OPTIONS = ["Not started", "In progress", "Completed"];

const STATUS_STYLE = {
  "Not started": "bg-rose-100 text-rose-700",
  "In progress": "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

/* =========================================================
   SAMPLE PROGRAM LIST (boleh guna list penuh anda)
========================================================= */

const PROGRAMS = [
  {
    id: 1,
    name: "Master of Science (Chemistry)",
    owner: "Pusat Pengajian Sains Kimia",
    nec: "0531",
    pic: "Noorfatimah Yahaya",
  },
  {
    id: 2,
    name: "Master of Science (Biomedicine)",
    owner: "Pusat Pengajian Sains Kesihatan",
    nec: "0912",
    pic: "Rabiatul Basria",
  },
];

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function ProgrammeTabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].key);

  const current = tabs.find((t) => t.key === active);

  return (
    <div>
      {/* TAB HEADER */}
      <div className="flex flex-wrap gap-2 border-b mb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg ${
              active === t.key
                ? "bg-sky-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="pt-2">{current?.content}</div>
    </div>
  );
}

function ProgressOverview({ statusObj }) {
  const safeStatus = statusObj || DEFAULT_PHASE_STATE;

  const completed = PHASES.filter(
    (p) => safeStatus[p.key] === "Completed"
  ).length;

  const progress = Math.round((completed / PHASES.length) * 100);

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-slate-700">
        Progress Fasa: {progress}%
      </div>

      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-2">
        {PHASES.map((p) => (
          <div
            key={p.key}
            className="flex items-center justify-between text-xs"
          >
            <span>{p.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full ${
                STATUS_STYLE[safeStatus[p.key]]
              }`}
            >
              {safeStatus[p.key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SRRChecklist({ checklist, onToggle }) {
  return (
    <ul className="space-y-2 text-xs">
      {checklist.map((item, idx) => (
        <li key={idx} className="flex gap-2 items-start">
          <input
            type="checkbox"
            checked={item.done}
            onChange={() => onToggle(idx)}
          />
          <span>
            <strong>{item.code}</strong> – {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

function CQIModule() {
  return (
    <div className="text-sm text-slate-600">
      <p className="mb-2 font-semibold">CQI & Audit Actions</p>
      <p className="text-xs">
        Modul CQI boleh ditambah: isu → tindakan → bukti → status.
      </p>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function IPPTProgrammeTracker() {
  const [programmeStates, setProgrammeStates] = useState({});
  const [srrData, setSrrData] = useState({});

  /* ---------- INIT DEFAULT ---------- */
  useEffect(() => {
    const initStates = {};
    const initSRR = {};

    PROGRAMS.forEach((p) => {
      initStates[p.id] = { ...DEFAULT_PHASE_STATE };
      initSRR[p.id] = [
        { code: "1.1", label: "PLO–MQF mapping lengkap", done: false },
        { code: "1.2", label: "CLO–PLO alignment", done: false },
        { code: "2.1", label: "Assessment plan", done: false },
      ];
    });

    setProgrammeStates(initStates);
    setSrrData(initSRR);
  }, []);

  /* ---------- HANDLERS ---------- */
  const updatePhaseStatus = (pid, key, value) => {
    setProgrammeStates((prev) => ({
      ...prev,
      [pid]: {
        ...(prev[pid] || DEFAULT_PHASE_STATE),
        [key]: value,
      },
    }));
  };

  const toggleSRR = (pid, idx) => {
    setSrrData((prev) => {
      const list = prev[pid] || [];
      const updated = [...list];
      updated[idx] = { ...updated[idx], done: !updated[idx].done };
      return { ...prev, [pid]: updated };
    });
  };

  /* ===================================================== */

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold mb-6">
        IPPT Programme Tracker – SRR & Compliance
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        {PROGRAMS.map((p) => {
          const statusObj = programmeStates[p.id] || DEFAULT_PHASE_STATE;
          const srrChecklist = srrData[p.id] || [];

          return (
            <article
              key={p.id}
              className="bg-white border rounded-2xl shadow-sm p-4"
            >
              {/* PROGRAM HEADER */}
              <div className="mb-4">
                <h2 className="font-semibold text-lg">{p.name}</h2>
                <p className="text-xs text-slate-500">
                  {p.owner} · NEC {p.nec} · PIC: {p.pic || "-"}
                </p>
              </div>

              {/* PROGRAM TABS */}
              <ProgrammeTabs
                tabs={[
                  {
                    key: "overview",
                    label: "Overview",
                    content: (
                      <>
                        <ProgressOverview statusObj={statusObj} />

                        <div className="mt-3 space-y-2">
                          {PHASES.map((ph) => (
                            <div
                              key={ph.key}
                              className="flex items-center justify-between text-xs"
                            >
                              <span>{ph.label}</span>
                              <select
                                className="border rounded px-2 py-1"
                                value={statusObj[ph.key]}
                                onChange={(e) =>
                                  updatePhaseStatus(
                                    p.id,
                                    ph.key,
                                    e.target.value
                                  )
                                }
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </>
                    ),
                  },
                  {
                    key: "plo",
                    label: "PLO & Attainment",
                    content: <IPPTPLOModule programmeId={p.id} />,
                  },
                  {
                    key: "srr",
                    label: "SRR Evidence",
                    content: (
                      <SRRChecklist
                        checklist={srrChecklist}
                        onToggle={(idx) => toggleSRR(p.id, idx)}
                      />
                    ),
                  },
                  {
                    key: "cqi",
                    label: "CQI",
                    content: <CQIModule />,
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
