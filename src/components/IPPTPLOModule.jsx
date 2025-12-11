import React, { useEffect, useState } from "react";
import RubricScoringForm from "./RubricScoringForm";
import PLOCharts from "./PLOCharts";

const DEFAULT_PLO = [
  { id: 1, code: "PLO1", name: "Knowledge & Understanding" },
  { id: 2, code: "PLO2", name: "Cognitive Skills" },
  { id: 3, code: "PLO3", name: "Research / Practical Skills" },
  { id: 4, code: "PLO4", name: "Interpersonal Skills" },
  { id: 5, code: "PLO5", name: "Communication Skills" },
  { id: 6, code: "PLO6", name: "Digital Skills" },
  { id: 7, code: "PLO7", name: "Numeracy Skills" },
  { id: 8, code: "PLO8", name: "Leadership, Autonomy & Responsibility" },
  { id: 9, code: "PLO9", name: "Personal Skills" },
  { id: 10, code: "PLO10", name: "Entrepreneurship" },
  { id: 11, code: "PLO11", name: "Ethics & Professionalism" },
];

const STORAGE_KEY = "ipptPLOModule_v2";

export default function IPPTPLOModule() {
  // ploIndicators: {id, indicator}
  // ploAttainment: {id, meanScore (1-5), attainmentPercent}
  const [indicators, setIndicators] = useState([]);
  const [scores, setScores] = useState({}); // { ploId: {scores: [1,4,5], mean: 3.6 } }
  const [mode, setMode] = useState("summary"); // summary | scoring | charts

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setIndicators(parsed.indicators || DEFAULT_PLO.map(p => ({ id: p.id, indicator: "" })));
        setScores(parsed.scores || {});
      } catch (e) {
        setIndicators(DEFAULT_PLO.map(p => ({ id: p.id, indicator: "" })));
      }
    } else {
      setIndicators(DEFAULT_PLO.map(p => ({ id: p.id, indicator: "" })));
    }
  }, []);

  useEffect(() => {
    const payload = { indicators, scores };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [indicators, scores]);

  const updateIndicator = (id, text) => {
    setIndicators(prev => prev.map(i => (i.id === id ? { ...i, indicator: text } : i)));
  };

  // scoresFromChild: {ploId: {scores: [...], mean: x}}
  const onScoresChange = (scoresFromChild) => {
    setScores(scoresFromChild);
  };

  const ploWithAttainment = DEFAULT_PLO.map((p) => {
    const rec = scores[p.id];
    const mean = rec?.mean ?? 0; // mean on scale 1-5
    // map to percent: (mean -1)/(5-1) => 0-1 then *100
    const attainmentPercent = Math.round(((mean - 1) / 4) * 100);
    const indicator = (indicators.find(i => i.id === p.id) || {}).indicator || "";
    return { ...p, indicator, mean, attainmentPercent, raw: rec?.scores || [] };
  });

  const overallMean =
    ploWithAttainment.reduce((s, p) => s + (p.mean || 0), 0) / ploWithAttainment.length || 0;
  const overallPercent = Math.round(((overallMean - 1) / 4) * 100);

  return (
    <div className="bg-white border rounded-2xl shadow p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">PLO Attainment — Research Mode (Rubric 1–5)</h2>
          <p className="text-sm text-slate-500">Masukkan skor rubrik per pelajar / cohort dan lihat attainment (converted to %).</p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500">Overall mean (1–5)</div>
          <div className="text-2xl font-bold text-indigo-700">{overallMean.toFixed(2)} / 5</div>
          <div className="text-xs text-slate-500 mt-1">Estimated attainment: <span className="font-semibold">{overallPercent}%</span></div>
        </div>
      </div>

      <div className="flex gap-2">
        <button className={`px-3 py-1 rounded ${mode==='summary' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`} onClick={()=>setMode('summary')}>Summary</button>
        <button className={`px-3 py-1 rounded ${mode==='scoring' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`} onClick={()=>setMode('scoring')}>Rubric Scoring</button>
        <button className={`px-3 py-1 rounded ${mode==='charts' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`} onClick={()=>setMode('charts')}>Charts</button>
      </div>

      {mode === "summary" && (
        <div>
          <div className="grid md:grid-cols-2 gap-4">
            {ploWithAttainment.map(p => (
              <div key={p.id} className="border rounded-lg p-3 bg-slate-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{p.code} — {p.name}</div>
                    <div className="text-xs text-slate-600 mt-1">{p.indicator || <em className="text-slate-400">(sila masukkan indikator)</em>}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Mean</div>
                    <div className="text-lg font-bold">{p.mean.toFixed(2)}/5</div>
                    <div className="text-xs text-slate-500 mt-1">{p.attainmentPercent}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === "scoring" && (
        <RubricScoringForm
          plos={DEFAULT_PLO}
          initialIndicators={indicators}
          initialScores={scores}
          onIndicatorsChange={(newInd) => setIndicators(newInd)}
          onScoresChange={onScoresChange}
        />
      )}

      {mode === "charts" && (
        <PLOCharts plos={ploWithAttainment} overallPercent={overallPercent} />
      )}

      <div className="text-xs text-slate-500">
        * Autosaved to browser localStorage. Untuk sync ke server / Drive, gunakan fungsi upload Drive pada tracker utama.
      </div>
    </div>
  );
}
