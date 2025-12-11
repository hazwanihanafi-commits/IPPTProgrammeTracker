import React, { useState, useEffect } from "react";

const DEFAULT_PLO = [
  { id: 1, name: "PLO1 – Knowledge & Understanding", indicator: "", attainment: 0 },
  { id: 2, name: "PLO2 – Cognitive Skills", indicator: "", attainment: 0 },
  { id: 3, name: "PLO3 – Research / Practical Skills", indicator: "", attainment: 0 },
  { id: 4, name: "PLO4 – Interpersonal Skills", indicator: "", attainment: 0 },
  { id: 5, name: "PLO5 – Communication Skills", indicator: "", attainment: 0 },
  { id: 6, name: "PLO6 – Digital Skills", indicator: "", attainment: 0 },
  { id: 7, name: "PLO7 – Numeracy Skills", indicator: "", attainment: 0 },
  { id: 8, name: "PLO8 – Leadership, Autonomy & Responsibility", indicator: "", attainment: 0 },
  { id: 9, name: "PLO9 – Personal Skills", indicator: "", attainment: 0 },
  { id: 10, name: "PLO10 – Entrepreneurship", indicator: "", attainment: 0 },
  { id: 11, name: "PLO11 – Ethics & Professionalism", indicator: "", attainment: 0 },
];

export default function IPPTPLOModule() {
  const [ploData, setPloData] = useState([]);

  // Load autosaved data
  useEffect(() => {
    const saved = localStorage.getItem("ipptPLOData");
    if (saved) {
      setPloData(JSON.parse(saved));
    } else {
      setPloData(DEFAULT_PLO);
    }
  }, []);

  // Auto-save
  useEffect(() => {
    if (ploData.length > 0) {
      localStorage.setItem("ipptPLOData", JSON.stringify(ploData));
    }
  }, [ploData]);

  const updateIndicator = (id, value) => {
    setPloData(prev =>
      prev.map(plo =>
        plo.id === id ? { ...plo, indicator: value } : plo
      )
    );
  };

  const updateAttainment = (id, value) => {
    const num = Math.min(100, Math.max(0, Number(value) || 0));
    setPloData(prev =>
      prev.map(plo =>
        plo.id === id ? { ...plo, attainment: num } : plo
      )
    );
  };

  const averageAttainment = () => {
    const total = ploData.reduce((sum, p) => sum + p.attainment, 0);
    return (total / ploData.length).toFixed(1);
  };

  return (
    <div className="bg-white border rounded-2xl shadow p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">PLO Attainment Module</h2>
          <p className="text-slate-500 text-sm">
            Manage indicators & attainment for all 11 MQF PLOs.
          </p>
        </div>

        <div className="px-4 py-2 bg-sky-50 text-sky-700 font-semibold text-sm rounded-xl border border-sky-200">
          Overall Attainment: {averageAttainment()}%
        </div>
      </div>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-slate-100 text-left">
            <th className="p-2 border">PLO</th>
            <th className="p-2 border w-1/3">Indicator</th>
            <th className="p-2 border w-32">Attainment (%)</th>
          </tr>
        </thead>

        <tbody>
          {ploData.map((plo) => (
            <tr key={plo.id} className="border-b">
              <td className="p-2 border font-medium">{plo.name}</td>

              <td className="p-2 border">
                <textarea
                  className="w-full p-2 border rounded bg-slate-50"
                  value={plo.indicator}
                  onChange={(e) => updateIndicator(plo.id, e.target.value)}
                  placeholder="Describe indicator for this PLO..."
                />
              </td>

              <td className="p-2 border">
                <input
                  type="number"
                  className={`w-full p-2 border rounded text-center ${
                    plo.attainment >= 80
                      ? "bg-emerald-100 border-emerald-400"
                      : plo.attainment >= 50
                      ? "bg-amber-100 border-amber-400"
                      : "bg-red-100 border-red-400"
                  }`}
                  value={plo.attainment}
                  min="0"
                  max="100"
                  onChange={(e) => updateAttainment(plo.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-xs text-slate-500">
        *Autosaved automatically. Data remains even after refreshing the page.
      </p>
    </div>
  );
}
