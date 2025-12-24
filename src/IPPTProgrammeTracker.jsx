import React, { useState, useEffect } from "react";

/* =========================
   CONSTANTS
========================= */

const PHASES = [
  { key: "q1", label: "Q1 – Advisor" },
  { key: "q2", label: "Q2 – CE" },
  { key: "q3", label: "Q3 – SRR" },
  { key: "q4", label: "Q4 – Audit" },
];

const STATUS = ["Not started", "In progress", "Completed", "Not required"];

/* =========================
   PROGRAM DATA (INLINE)
========================= */

const PROGRAMS = [
  { id: 1, name: "MSc Chemistry", owner: "PPSK", nec: "0531", pic: "Noorfatimah" },
  { id: 2, name: "MSc Biomedicine", owner: "PPSK", nec: "0912", pic: "Rabiatul" },
  { id: 3, name: "MSc Clinical Sciences", owner: "PPSP", nec: "0914", pic: "" },
  { id: 4, name: "MSc Community Medicine", owner: "PPSP", nec: "0923", pic: "Rohayu" },
  { id: 5, name: "MSc Dentistry", owner: "PPSG", nec: "0910", pic: "Noor Ayuni" },
  { id: 6, name: "MSc Human Genetics", owner: "PPSP", nec: "0912", pic: "Doblin" },
  { id: 7, name: "MSc Lifestyle Science", owner: "IPPT", nec: "0915", pic: "Teoh Soo Huat" },
  { id: 8, name: "MSc Medical Immunology", owner: "PPSP", nec: "0912", pic: "Ida" },
  { id: 9, name: "MSc Medical Microbiology", owner: "PPSP", nec: "0914", pic: "Syamsul" },
  { id: 10, name: "MSc Medical Physics", owner: "PPSP", nec: "0914", pic: "Zahri" },
  { id: 11, name: "MSc Molecular Biology", owner: "PPSK", nec: "0511", pic: "Nurulisa" },
  { id: 12, name: "MSc Nutrition", owner: "PPSK", nec: "0915", pic: "Rabeta" },
  { id: 13, name: "MSc Pathology", owner: "PPSP", nec: "0912", pic: "Emmanuel" },
  { id: 14, name: "MSc Pharm Chem", owner: "PPSF", nec: "0916", pic: "Yusmaidie" },
  { id: 15, name: "MSc Pharm Tech", owner: "PPSF", nec: "0916", pic: "Nadhirah" },
  { id: 16, name: "MSc Pharmacology", owner: "PPSP", nec: "0916", pic: "Nor Adlin" },
  { id: 17, name: "MSc Pharmacy", owner: "PPSF", nec: "0916", pic: "Nozlena" },
  { id: 18, name: "MSc Sports Science", owner: "PPSP", nec: "1014", pic: "Eva" },
  { id: 19, name: "MSc Psychology", owner: "IPPT", nec: "0923", pic: "Afifudin" },
  { id: 20, name: "PhD (Minden)", owner: "KK", nec: "0910", pic: "Lim Vuanghao" },
];

/* =========================
   COMPONENT
========================= */

export default function IPPTProgrammeTracker() {
  const [activeTab, setActiveTab] = useState({});
  const [programmeStates, setProgrammeStates] = useState({});

  /* ---------- INIT STATE ---------- */
  useEffect(() => {
    const init = {};
    PROGRAMS.forEach((p) => {
      init[p.id] = {
        q1: "Not started",
        q2: "Not started",
        q3: "Not started",
        q4: "Not started",
      };
    });
    setProgrammeStates(init);
  }, []);

  const setStatus = (pid, phase, value) => {
    setProgrammeStates((prev) => ({
      ...prev,
      [pid]: { ...prev[pid], [phase]: value },
    }));
  };

  const getProgress = (pid) => {
    const s = programmeStates[pid];
    if (!s) return 0;
    const done = PHASES.filter((p) => s[p.key] === "Completed").length;
    return Math.round((done / PHASES.length) * 100);
  };

  /* ========================= */

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold mb-6">
        IPPT Programme Accreditation Tracker
      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {PROGRAMS.map((p) => {
          const tab = activeTab[p.id] || "overview";
          const state = programmeStates[p.id];

          if (!state) return null;

          return (
            <article
              key={p.id}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >
              {/* HEADER */}
              <div className="mb-3">
                <h2 className="font-semibold">{p.name}</h2>
                <p className="text-xs text-slate-500">
                  {p.owner} · NEC {p.nec} · PIC: {p.pic || "-"}
                </p>
              </div>

              {/* TABS */}
              <div className="flex gap-1 mb-3 text-xs">
                {["overview", "plo", "srr", "docs", "cqi"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab({ ...activeTab, [p.id]: t })}
                    className={`px-2 py-1 rounded ${
                      tab === t
                        ? "bg-sky-600 text-white"
                        : "bg-slate-100"
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}
              {tab === "overview" && (
                <>
                  <div className="text-xs mb-1">
                    Progress: {getProgress(p.id)}%
                  </div>
                  <div className="h-2 bg-slate-100 rounded overflow-hidden mb-2">
                    <div
                      className="h-full bg-emerald-400"
                      style={{ width: `${getProgress(p.id)}%` }}
                    />
                  </div>

                  {PHASES.map((ph) => (
                    <div key={ph.key} className="flex justify-between text-xs mb-1">
                      <span>{ph.label}</span>
                      <select
                        value={state[ph.key]}
                        onChange={(e) =>
                          setStatus(p.id, ph.key, e.target.value)
                        }
                        className="border text-xs"
                      >
                        {STATUS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </>
              )}

              {tab === "plo" && (
                <p className="text-xs text-slate-600">
                  PLO mapping & attainment (from PPBMS – coming soon)
                </p>
              )}

              {tab === "srr" && (
                <p className="text-xs text-slate-600">
                  SRR Evidence checklist & COPPA mapping
                </p>
              )}

              {tab === "docs" && (
                <p className="text-xs text-slate-600">
                  Google Drive evidence links
                </p>
              )}

              {tab === "cqi" && (
                <p className="text-xs text-slate-600">
                  CQI issues & action plan
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
