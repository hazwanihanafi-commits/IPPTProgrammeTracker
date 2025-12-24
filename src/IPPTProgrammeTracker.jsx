/* global google */
import React, { useState, useEffect, useMemo } from "react";
import IPPTPLOModule from "./components/IPPTPLOModule";

/* ============================================================
   BASIC CONFIG
===============================================================*/

const PHASES = [
  { key: "q1", label: "Q1 2026 – Penasihat Luar" },
  { key: "q2", label: "Q2 2026 – CE" },
  { key: "q3", label: "Q3 2026 – SRR" },
  { key: "q4", label: "Q4 2026 – Audit APP" },
];

const STATUS = ["Not started", "In progress", "Completed"];

const STATUS_STYLE = {
  "Not started": "bg-rose-100 text-rose-700",
  "In progress": "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

/* ============================================================
   PROGRAM LIST (ringkas – boleh tambah)
===============================================================*/

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

/* ============================================================
   HELPER
===============================================================*/

const progressPercent = (statusObj) => {
  if (!statusObj) return 0;
  const done = Object.values(statusObj).filter(
    (s) => s === "Completed"
  ).length;
  return Math.round((done / PHASES.length) * 100);
};

/* ============================================================
   PROGRAMME TABS COMPONENT
===============================================================*/

function ProgrammeTabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].key);

  return (
    <div>
      <div className="flex gap-2 border-b mb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-3 py-1.5 text-sm rounded-t-lg ${
              active === t.key
                ? "bg-sky-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="pt-2">{tabs.find((t) => t.key === active)?.content}</div>
    </div>
  );
}

/* ============================================================
   OVERVIEW TAB
===============================================================*/

function ProgressOverview({ statusObj, onChange }) {
  return (
    <div className="space-y-3">
      {PHASES.map((p) => (
        <div key={p.key} className="flex items-center justify-between">
          <span className="text-sm">{p.label}</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={statusObj[p.key]}
            onChange={(e) => onChange(p.key, e.target.value)}
          >
            {STATUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      ))}

      <div>
        <div className="text-xs text-slate-500 mb-1">
          Overall Progress: {progressPercent(statusObj)}%
        </div>
        <div className="w-full h-2 bg-slate-200 rounded">
          <div
            className="h-2 bg-emerald-500 rounded"
            style={{ width: `${progressPercent(statusObj)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SRR TAB (ringkas)
===============================================================*/

function SRRChecklist({ data, onToggle }) {
  const ITEMS = [
    "PLO–MQF mapping lengkap",
    "Laporan CE tersedia",
    "CQI didokumenkan",
    "Data pelajar aktif & graduan",
    "Bukti pemantauan program",
  ];

  return (
    <ul className="space-y-2">
      {ITEMS.map((item, i) => (
        <li key={i} className="flex gap-2 items-start">
          <input
            type="checkbox"
            checked={data[i]}
            onChange={() => onToggle(i)}
          />
          <span className="text-sm">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ============================================================
   DOCUMENT TAB (link sahaja)
===============================================================*/

function ProgrammeDocuments({ docs, onAdd }) {
  const [url, setUrl] = useState("");

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className="border px-2 py-1 text-sm flex-1"
          placeholder="Paste Google Drive link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="px-3 py-1 bg-sky-600 text-white text-sm rounded"
          onClick={() => {
            if (url) {
              onAdd(url);
              setUrl("");
            }
          }}
        >
          Add
        </button>
      </div>

      <ul className="text-sm list-disc list-inside">
        {docs.map((d, i) => (
          <li key={i}>
            <a href={d} target="_blank" rel="noreferrer" className="underline">
              {d}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================================================
   CQI TAB (placeholder)
===============================================================*/

function CQIModule() {
  return (
    <div className="text-sm text-slate-600">
      CQI akan diisi selepas audit / dapatan penilai.
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
===============================================================*/

export default function IPPTProgrammeTracker() {
  const [phaseStatus, setPhaseStatus] = useState({});
  const [srr, setSrr] = useState({});
  const [docs, setDocs] = useState({});

  useEffect(() => {
    const init = {};
    const initSRR = {};
    const initDocs = {};
    PROGRAMS.forEach((p) => {
      init[p.id] = { q1: "Not started", q2: "Not started", q3: "Not started", q4: "Not started" };
      initSRR[p.id] = Array(5).fill(false);
      initDocs[p.id] = [];
    });
    setPhaseStatus(init);
    setSrr(initSRR);
    setDocs(initDocs);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold mb-6">
        IPPT Programme Accreditation Tracker
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        {PROGRAMS.map((p) => (
          <article
            key={p.id}
            className="bg-white border rounded-2xl shadow-sm p-4"
          >
            <div className="mb-4">
              <h2 className="font-semibold text-lg">{p.name}</h2>
              <p className="text-xs text-slate-500">
                {p.owner} · NEC {p.nec} · PIC: {p.pic}
              </p>
            </div>

            <ProgrammeTabs
              tabs={[
                {
                  key: "overview",
                  label: "Overview",
                  content: (
                    <ProgressOverview
                      statusObj={phaseStatus[p.id]}
                      onChange={(k, v) =>
                        setPhaseStatus((prev) => ({
                          ...prev,
                          [p.id]: { ...prev[p.id], [k]: v },
                        }))
                      }
                    />
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
                      data={srr[p.id]}
                      onToggle={(i) =>
                        setSrr((prev) => {
                          const arr = [...prev[p.id]];
                          arr[i] = !arr[i];
                          return { ...prev, [p.id]: arr };
                        })
                      }
                    />
                  ),
                },
                {
                  key: "docs",
                  label: "Documents",
                  content: (
                    <ProgrammeDocuments
                      docs={docs[p.id]}
                      onAdd={(link) =>
                        setDocs((prev) => ({
                          ...prev,
                          [p.id]: [...prev[p.id], link],
                        }))
                      }
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
        ))}
      </div>
    </div>
  );
}
