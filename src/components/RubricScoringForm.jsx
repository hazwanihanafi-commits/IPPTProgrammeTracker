import React, { useEffect, useState } from "react";

/**
 Props:
  - plos: [{id, code, name}]
  - initialIndicators: [{id, indicator}]
  - initialScores: { ploId: { scores: [1,4], mean: 3.5 } }
  - onIndicatorsChange(newIndicators)
  - onScoresChange(newScores)
*/

const STORAGE = "ipptPLOScores_v2";

export default function RubricScoringForm({
  plos,
  initialIndicators = [],
  initialScores = {},
  onIndicatorsChange = () => {},
  onScoresChange = () => {},
}) {
  const [indicators, setIndicators] = useState([]);
  const [scores, setScores] = useState({}); // {ploId: {scores: [], mean}}

  useEffect(() => {
    // merge defaults
    const defaultInd = plos.map(p => ({ id: p.id, indicator: (initialIndicators.find(i=>i.id===p.id)||{}).indicator || "" }));
    setIndicators(defaultInd);

    const defaultScores = {};
    plos.forEach(p => {
      const rec = initialScores[p.id] || { scores: [], mean: 0 };
      defaultScores[p.id] = { scores: rec.scores.slice() || [], mean: rec.mean || 0 };
    });
    setScores(defaultScores);
  }, [plos, initialIndicators, initialScores]);

  useEffect(() => {
    // local autosave
    localStorage.setItem(STORAGE, JSON.stringify({ indicators, scores }));
    onIndicatorsChange(indicators);
    onScoresChange(scores);
  }, [indicators, scores]);

  const updateIndicator = (id, text) => {
    setIndicators(prev => prev.map(i => i.id === id ? { ...i, indicator: text } : i));
  };

  const addStudentScore = (ploId, value) => {
    setScores(prev => {
      const copy = { ...prev };
      const arr = (copy[ploId]?.scores || []).concat([Number(value)]);
      const mean = arr.length ? (arr.reduce((s,a)=>s+a,0)/arr.length) : 0;
      copy[ploId] = { scores: arr, mean: parseFloat(mean.toFixed(2)) };
      return copy;
    });
  };

  const removeScore = (ploId, idx) => {
    setScores(prev => {
      const copy = { ...prev };
      const arr = (copy[ploId]?.scores || []).filter((_,i)=>i!==idx);
      const mean = arr.length ? (arr.reduce((s,a)=>s+a,0)/arr.length) : 0;
      copy[ploId] = { scores: arr, mean: parseFloat(mean.toFixed(2)) };
      return copy;
    });
  };

  const quickSetMean = (ploId, mean) => {
    // convert mean (1-5) to a single-score array for storage convenience
    setScores(prev => {
      const copy = { ...prev };
      copy[ploId] = { scores: [Number(mean)], mean: Number(mean) };
      return copy;
    });
  };

  return (
    <div className="space-y-4">
      {plos.map(p => {
        const rec = scores[p.id] || { scores: [], mean: 0 };
        return (
          <div key={p.id} className="border rounded-lg p-3 bg-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">{p.code} — {p.name}</div>
                <div className="text-xs text-slate-500">Indicator (editable)</div>
                <textarea
                  className="w-full mt-2 p-2 border rounded bg-slate-50 text-sm"
                  rows={2}
                  value={(indicators.find(i=>i.id===p.id)||{}).indicator || ""}
                  onChange={(e)=>updateIndicator(p.id, e.target.value)}
                />
              </div>

              <div className="w-44">
                <div className="text-xs text-slate-500">Cohort mean (1–5)</div>
                <div className="text-2xl font-bold text-indigo-700">{rec.mean || 0}</div>
                <div className="text-xs text-slate-400 mb-2">Attainment ≈ {Math.round(((rec.mean-1)/4)*100) || 0}%</div>

                <div className="space-y-1">
                  <label className="text-xs">Quick set mean</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n=>(
                      <button key={n} className="px-2 py-0.5 rounded bg-slate-100 text-sm" onClick={()=>quickSetMean(p.id, n)}>{n}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs text-slate-500 mb-1">Raw student scores (1–5) — add individual scores to compute mean</div>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={()=>addStudentScore(p.id, n)} className="px-2 py-1 rounded bg-slate-100 text-sm">{n}</button>
                ))}
                <button onClick={()=> setScores(prev=>({...prev, [p.id]: { scores: [], mean: 0 }}))} className="ml-2 px-2 py-1 text-xs rounded bg-rose-100">Reset</button>
              </div>

              <div className="mt-2 text-xs">
                Scores: {rec.scores.length ? rec.scores.join(", ") : <em className="text-slate-400">(no scores)</em>}
              </div>

              <div className="mt-2">
                {rec.scores.map((s, idx) => (
                  <div key={idx} className="inline-flex items-center gap-2 mr-2 mt-2 bg-slate-50 border px-2 py-1 rounded">
                    <div className="font-medium">{s}</div>
                    <button className="text-xs text-rose-600" onClick={()=>removeScore(p.id, idx)}>remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
