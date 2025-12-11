// src/components/IPPTPLOModule.jsx
import React, { useEffect, useMemo, useState } from "react";

/*
IPPTPLOModule.jsx
- Self-contained PLO Attainment module
- Autosaves to localStorage key: "ipptPloAttainment"
- Accepts optional prop `programs` (array); otherwise uses fallback PROGRAMS
- Provides per-program PLO inputs, summary, and export-to-CSV
*/

const LOCALSTORAGE_KEY = "ipptPloAttainment_v1";

// ---- PLO Indicators (Research Mode: MSc & PhD) ----
const PLO_INDICATORS = [
  { code: "PLO1", title: "Knowledge & Understanding", threshold: 70 },
  { code: "PLO2", title: "Cognitive Skills", threshold: 70 },
  { code: "PLO3", title: "Practical / Research Skills", threshold: 80 },
  { code: "PLO4", title: "Interpersonal Skills", threshold: 80 },
  { code: "PLO5", title: "Communication Skills", threshold: 75 },
  { code: "PLO6", title: "Digital Skills", threshold: 80 },
  { code: "PLO7", title: "Numeracy Skills", threshold: 70 },
  { code: "PLO8", title: "Leadership, Autonomy & Responsibility", threshold: 80 },
  { code: "PLO9", title: "Personal Skills (lifelong learning)", threshold: 80 },
  { code: "PLO10", title: "Entrepreneurship Skills", threshold: 50 },
  { code: "PLO11", title: "Ethics & Professionalism", threshold: 100 },
];

// fallback program list (used if no programs prop passed)
const FALLBACK_PROGRAMS = [
  { id: 1, no: 1, name: "Master of Science (Chemistry)", pic: "Noorfatimah" },
  { id: 2, no: 2, name: "Master of Science (Biomedicine)", pic: "Rabiatul" },
  { id: 20, no: 20, name: "Master of Science (Sports Science)", pic: "Eva" },
];

function computePloSummaryFor(ploMap) {
  if (!ploMap) return { achieved: 0, total: PLO_INDICATORS.length };
  let achieved = 0;
  PLO_INDICATORS.forEach((plo) => {
    const val = Number(ploMap[plo.code]);
    if (!Number.isNaN(val) && val >= plo.threshold) achieved += 1;
  });
  return { achieved, total: PLO_INDICATORS.length };
}

function formatPercent(v) {
  if (v === "" || v === undefined || v === null) return "-";
  const num = Number(v);
  if (Number.isNaN(num)) return "-";
  return `${Math.round(num)}%`;
}

export default function IPPTPLOModule({ programs }) {
  const programList = useMemo(() => programs && programs.length ? programs : FALLBACK_PROGRAMS, [programs]);

  // ploAttainment structure: { [programmeId]: { PLO1: 78, PLO2: 62, ... } }
  const [ploAttainment, setPloAttainment] = useState({});

  // load saved on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCALSTORAGE_KEY);
      if (raw) {
        setPloAttainment(JSON.parse(raw));
      } else {
        // init empty structure
        const init = {};
        programList.forEach((p) => (init[p.id] = {}));
        setPloAttainment(init);
      }
    } catch (err) {
      console.error("Failed to load PLO attainment from localStorage", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // autosave whenever ploAttainment changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(ploAttainment));
    } catch (err) {
      console.error("Failed to autosave PLO attainment", err);
    }
  }, [ploAttainment]);

  const handlePloChange = (programmeId, ploCode, rawValue) => {
    // sanitize number between 0 and 100 (allow empty string)
    let v = rawValue === "" ? "" : Number(rawValue);
    if (v !== "" && Number.isNaN(v)) v = "";
    if (typeof v === "number") {
      if (v < 0) v = 0;
      if (v > 100) v = 100;
      // round to 1 decimal optionally: v = Math.round(v*10)/10;
    }
    setPloAttainment((prev) => ({
      ...prev,
      [programmeId]: {
        ...(prev[programmeId] || {}),
        [ploCode]: v,
      },
    }));
  };

  const exportProgramCSV = (programmeId) => {
    const p = programList.find((pp) => pp.id === programmeId);
    const map = ploAttainment[programmeId] || {};
    const rows = [
      ["Programme", p ? p.name : programmeId],
      ["PLO Code", "PLO Title", "Target (%)", "Achieved (%)"],
      ...PLO_INDICATORS.map((plo) => [
        plo.code,
        plo.title,
        plo.threshold,
        map[plo.code] === undefined || map[plo.code] === "" ? "" : map[plo.code],
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(p && p.name ? p.name.replace(/\s+/g, "_") : "programme")}_PLO_Attainment.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const overallSummary = useMemo(() => {
    // compute overall across programs: avg % of PLOs met
    let totalPrograms = 0;
    let totalAchieved = 0;
    programList.forEach((p) => {
      const s = computePloSummaryFor(ploAttainment[p.id] || {});
      totalPrograms += 1;
      totalAchieved += s.achieved;
    });
    return {
      programs: totalPrograms,
      totalPloAchieved: totalAchieved,
      totalPossible: totalPrograms * PLO_INDICATORS.length,
      percent: totalPrograms === 0 ? 0 : Math.round((totalAchieved / (totalPrograms * PLO_INDICATORS.length)) * 100),
    };
  }, [ploAttainment, programList]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <div>
          <h3 className="text-lg font-semibold">PLO Attainment Module</h3>
          <p className="text-sm text-slate-500">Manage PLO attainment (% of cohort reaching PLO threshold) per programme. Autosaved locally.</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Overall PLO attainment</div>
          <div className="text-xl font-semibold">{overallSummary.percent}%</div>
          <div className="text-xs text-slate-400">{overallSummary.totalPloAchieved}/{overallSummary.totalPossible} PLOs met (all programmes)</div>
        </div>
      </div>

      {/* Program list */}
      <div className="grid md:grid-cols-2 gap-4">
        {programList.map((p) => {
          const map = ploAttainment[p.id] || {};
          const summary = computePloSummaryFor(map);
          return (
            <div key={p.id} className="bg-white border rounded-2xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-500">Program #{p.no || p.id}</div>
                  <h4 className="font-semibold">{p.name}</h4>
                  <div className="text-xs text-slate-500">PIC: {p.pic || "-"}</div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-500">PLOs met</div>
                  <div className="text-lg font-semibold">
                    {summary.achieved}/{summary.total}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="px-2 py-1 text-[12px] border rounded bg-emerald-50 text-emerald-700"
                      onClick={() => exportProgramCSV(p.id)}
                    >
                      Export CSV
                    </button>
                    <button
                      className="px-2 py-1 text-[12px] border rounded bg-sky-50 text-sky-700"
                      onClick={() => {
                        // quick fill demo: set random values to demo
                        const demo = {};
                        PLO_INDICATORS.forEach((plo) => {
                          demo[plo.code] = Math.min(100, Math.max(40, plo.threshold + Math.round(Math.random() * 30)));
                        });
                        setPloAttainment((prev) => ({ ...prev, [p.id]: demo }));
                      }}
                      title="Demo fill (for workshop)"
                    >
                      Fill demo
                    </button>
                  </div>
                </div>
              </div>

              {/* progress bar showing % of PLO met */}
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>PLO attainment progress</span>
                  <span>{Math.round((summary.achieved / summary.total) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all"
                    style={{ width: `${(summary.achieved / summary.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* PLO inputs */}
              <div className="mt-3 border-t pt-3">
                <div className="text-[12px] font-semibold text-slate-700 mb-2">PLO Attainment (%)</div>
                <div className="overflow-auto max-h-48 pr-2">
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs text-slate-500 sticky top-0 bg-white">
                      <tr>
                        <th className="py-1 pr-2">PLO</th>
                        <th className="py-1 pr-2">Title</th>
                        <th className="py-1 pr-2">Target</th>
                        <th className="py-1 pr-2">Achieved (%)</th>
                        <th className="py-1 pr-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PLO_INDICATORS.map((plo) => {
                        const val = map[plo.code];
                        const met = typeof val === "number" && val >= plo.threshold;
                        return (
                          <tr key={plo.code} className="border-t">
                            <td className="py-1 pr-2 align-top font-medium">{plo.code}</td>
                            <td className="py-1 pr-2 align-top text-[13px]">{plo.title}</td>
                            <td className="py-1 pr-2 align-top">{plo.threshold}%</td>
                            <td className="py-1 pr-2 align-top">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                className="w-20 border rounded px-2 py-1 text-[13px]"
                                value={val === undefined ? "" : val}
                                onChange={(e) => handlePloChange(p.id, plo.code, e.target.value)}
                              />
                            </td>
                            <td className="py-1 pr-2 align-top">
                              {val === "" || val === undefined ? (
                                <span className="text-xs text-slate-400">—</span>
                              ) : met ? (
                                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Met</span>
                              ) : (
                                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">Not met</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  Enter the percentage of cohort achieving the minimum rubric level for each PLO.
                  A PLO is considered <span className="font-semibold">Met</span> when the Achieved (%) ≥ Target.
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-slate-500">
          Tip: Use the <span className="font-semibold">Fill demo</span> button when practicing.
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded bg-slate-50 text-slate-700 border"
            onClick={() => {
              // reset all
              const cleared = {};
              programList.forEach((p) => (cleared[p.id] = {}));
              setPloAttainment(cleared);
            }}
            title="Clear all attainment data"
          >
            Clear all
          </button>
          <button
            className="px-3 py-2 rounded bg-emerald-600 text-white"
            onClick={() => {
              // quick export summary CSV for all programs
              const rows = [
                ["Programme", "PLO", "Target(%)", "Achieved(%)", "Met?"],
              ];
              programList.forEach((p) => {
                const map = ploAttainment[p.id] || {};
                PLO_INDICATORS.forEach((plo) => {
                  const val = map[plo.code];
                  const met = typeof val === "number" && val >= plo.threshold;
                  rows.push([p.name, plo.code, plo.threshold, val === undefined ? "" : val, met ? "Yes" : "No"]);
                });
              });
              const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `IPPT_PLO_Attainment_Summary.csv`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
          >
            Export all CSV
          </button>
        </div>
      </div>
    </div>
  );
}
