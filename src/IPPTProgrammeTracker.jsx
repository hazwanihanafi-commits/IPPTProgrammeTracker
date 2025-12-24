/* global google */
import React, { useEffect, useMemo, useState } from "react";
import IPPTPLOModule from "./components/IPPTPLOModule";

/* ================================
   BASIC CONFIG
================================ */
const PHASES = [
  { key: "q1", label: "Q1 – Penasihat Luar" },
  { key: "q2", label: "Q2 – Curriculum Evaluation" },
  { key: "q3", label: "Q3 – SRR" },
  { key: "q4", label: "Q4 – Audit APP" },
];

const STATUS_OPTIONS = ["Not started", "In progress", "Completed", "Not required"];

const STATUS_STYLES = {
  "Not started": "bg-rose-100 text-rose-700",
  "In progress": "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
  "Not required": "bg-slate-100 text-slate-500",
};

/* ================================
   PROGRAM LIST (FULL)
================================ */
import { PROGRAMS } from "./data/programs"; 
// 🔴 PASTIKAN: programs.js export SEMUA 22 program

/* ================================
   SAFE DEFAULT GENERATOR
================================ */
function getDefaultProgrammeState() {
  return {
    q1: "Not started",
    q2: "Not started",
    q3: "Not started",
    q4: "Not started",
  };
}

/* ================================
   MAIN COMPONENT
================================ */
export default function IPPTProgrammeTracker() {
  const [programmeStates, setProgrammeStates] = useState({});
  const [search, setSearch] = useState("");

  /* ---------- LOAD STATE ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("ipptProgrammeStates");

    const base = {};
    PROGRAMS.forEach((p) => {
      base[p.id] = getDefaultProgrammeState();
    });

    if (saved) {
      try {
        setProgrammeStates({ ...base, ...JSON.parse(saved) });
      } catch {
        setProgrammeStates(base);
      }
    } else {
      setProgrammeStates(base);
    }
  }, []);

  /* ---------- AUTOSAVE ---------- */
  useEffect(() => {
    if (Object.keys(programmeStates).length > 0) {
      localStorage.setItem(
        "ipptProgrammeStates",
        JSON.stringify(programmeStates)
      );
    }
  }, [programmeStates]);

  /* ---------- FILTER ---------- */
  const filteredPrograms = useMemo(() => {
    const term = search.toLowerCase();
    return PROGRAMS.filter(
      (p) =>
        !term ||
        p.name.toLowerCase().includes(term) ||
        (p.pic || "").toLowerCase().includes(term)
    );
  }, [search]);

  /* ---------- HANDLER ---------- */
  const updateStatus = (programmeId, phase, value) => {
    setProgrammeStates((prev) => ({
      ...prev,
      [programmeId]: {
        ...(prev[programmeId] || getDefaultProgrammeState()),
        [phase]: value,
      },
    }));
  };

  /* ================================
     RENDER
  ================================ */
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold mb-4">
        IPPT Programme Accreditation Tracker
      </h1>

      <input
        className="border px-3 py-2 rounded mb-6 w-full md:w-96"
        placeholder="Cari program / PIC…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPrograms.map((p) => {
          const statusObj =
            programmeStates[p.id] || getDefaultProgrammeState();

          return (
            <article
              key={p.id}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >
              {/* HEADER */}
              <div className="mb-3">
                <h2 className="font-semibold">{p.name}</h2>
                <p className="text-xs text-slate-500">
                  {p.owner} · PIC: {p.pic || "-"}
                </p>
              </div>

              {/* PHASE STATUS */}
              <div className="space-y-2 mb-4">
                {PHASES.map((ph) => (
                  <div key={ph.key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{ph.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded ${STATUS_STYLES[statusObj[ph.key]]}`}
                      >
                        {statusObj[ph.key]}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          className={`text-[10px] px-2 py-0.5 rounded border ${
                            statusObj[ph.key] === s
                              ? "ring-2 ring-sky-400"
                              : "opacity-60"
                          }`}
                          onClick={() =>
                            updateStatus(p.id, ph.key, s)
                          }
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* PLO */}
              <details className="mt-3">
                <summary className="text-sm font-semibold cursor-pointer">
                  PLO & Attainment
                </summary>
                <div className="mt-2">
                  <IPPTPLOModule programmeId={p.id} />
                </div>
              </details>
            </article>
          );
        })}
      </div>

      {filteredPrograms.length === 0 && (
        <p className="text-slate-500 mt-6">Tiada program ditemui.</p>
      )}
    </div>
  );
}
