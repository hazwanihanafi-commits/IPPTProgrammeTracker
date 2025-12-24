/* global google */
import React, { useState, useMemo, useEffect } from "react";
import IPPTPLOModule from "./components/IPPTPLOModule";

/* ============================================================
   GOOGLE DRIVE CONFIG (Frontend-only Picker)
=============================================================== */
const GOOGLE_CLIENT_ID =
  "24521575326-4hni7mkmiut33lidfaqo9aksf9b1g164.apps.googleusercontent.com";
const GOOGLE_API_KEY = "AIzaSyAFyUx9-w3uShMkr1wwJyIBQ1dvvzQSTkg";
const DRIVE_FOLDER_ID = "1sYLzlypBed420jNele6qaGB0O-1s7nXK";

const UPLOAD_SECTIONS = [
  { key: "advisor", label: "A. Penasihat Luar & Kurikulum (Q1)" },
  { key: "ce", label: "B. CE & Penilai Luar (Q2)" },
  { key: "srr", label: "C. SRR & Audit APP (Q3–Q4)" },
];

let pickerLoaded = false;
let tokenClient = null;

/* ============================================================
   GOOGLE PICKER HELPERS
=============================================================== */
function loadPicker() {
  return new Promise((resolve) => {
    function check() {
      if (window.google?.picker && window.google?.accounts) {
        pickerLoaded = true;
        resolve();
      } else {
        setTimeout(check, 300);
      }
    }
    if (pickerLoaded) resolve();
    else check();
  });
}

function getAccessToken() {
  return new Promise(async (resolve, reject) => {
    await loadPicker();
    if (!tokenClient) {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.file",
        callback: (resp) =>
          resp?.access_token
            ? resolve(resp.access_token)
            : reject("No token"),
      });
    }
    tokenClient.requestAccessToken({ prompt: "" });
  });
}

async function openDrivePicker(programme, section, onPicked) {
  try {
    const token = await getAccessToken();

    const view = new google.picker.DocsUploadView()
      .setParent(DRIVE_FOLDER_ID)
      .setIncludeFolders(false);

    const picker = new google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(token)
      .setDeveloperKey(GOOGLE_API_KEY)
      .setTitle(`Upload: ${programme.name} – ${section.label}`)
      .setCallback((data) => {
        if (data.action === google.picker.Action.PICKED) {
          onPicked(
            data.docs.map((d) => ({
              id: d.id,
              name: d.name,
              url: `https://drive.google.com/file/d/${d.id}/view`,
            }))
          );
        }
      })
      .build();

    picker.setVisible(true);
  } catch (e) {
    alert("Sila login akaun @usm.my dan refresh halaman.");
  }
}

/* ============================================================
   CONFIG
=============================================================== */
const PHASES = [
  { key: "q1", label: "Q1 – Penasihat Luar" },
  { key: "q2", label: "Q2 – CE" },
  { key: "q3", label: "Q3 – SRR" },
  { key: "q4", label: "Q4 – Audit APP" },
];

const STATUS = ["Not started", "In progress", "Completed", "Not required"];

const STATUS_STYLE = {
  "Not started": "bg-rose-100 text-rose-800",
  "In progress": "bg-amber-100 text-amber-800",
  Completed: "bg-emerald-100 text-emerald-800",
  "Not required": "bg-slate-100 text-slate-600",
};

/* ============================================================
   SRR COPPA (Ringkas & Praktikal)
=============================================================== */
const SRR_ITEMS = [
  "PLO–MQF mapping lengkap",
  "CLO–PLO mapping disahkan",
  "Struktur kurikulum & SLT",
  "Input penasihat luar",
  "Assessment alignment",
  "Moderation & verification",
  "CQI assessment",
  "Monitoring pelajar",
  "Rekod penyeliaan",
  "CQI program",
  "PLO attainment ≥ tahap sasaran",
];

/* ============================================================
   PROGRAM LIST (dipendekkan contoh)
=============================================================== */
const PROGRAMS = [
  {
    id: 1,
    name: "Master of Science (Chemistry)",
    owner: "Pusat Pengajian Sains Kimia",
    pic: "Noorfatimah Yahaya",
  },
  {
    id: 2,
    name: "Doctor of Philosophy (Minden)",
    owner: "Kampus Kesihatan",
    pic: "Lim Vuanghao",
  },
];

/* ============================================================
   MAIN COMPONENT
=============================================================== */
export default function IPPTProgrammeTracker() {
  const [phase, setPhase] = useState({});
  const [srr, setSrr] = useState({});
  const [drive, setDrive] = useState({});

  /* ---------- INIT ---------- */
  useEffect(() => {
    const p = {};
    const s = {};
    const d = {};
    PROGRAMS.forEach((x) => {
      p[x.id] = { q1: "Not started", q2: "Not started", q3: "Not started", q4: "Not started" };
      s[x.id] = Array(SRR_ITEMS.length).fill(false);
      d[x.id] = { advisor: [], ce: [], srr: [] };
    });
    setPhase(p);
    setSrr(s);
    setDrive(d);
  }, []);

  /* ---------- AUTOSAVE ---------- */
  useEffect(() => {
    localStorage.setItem("ipptPhase", JSON.stringify(phase));
    localStorage.setItem("ipptSRR", JSON.stringify(srr));
    localStorage.setItem("ipptDrive", JSON.stringify(drive));
  }, [phase, srr, drive]);

  const progressSRR = (arr) =>
    Math.round((arr.filter(Boolean).length / SRR_ITEMS.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-sky-700">
        IPPT Programme Tracker
      </h1>

      {/* GLOBAL PLO */}
      <IPPTPLOModule />

      {/* PROGRAM CARDS */}
      <div className="grid md:grid-cols-2 gap-4">
        {PROGRAMS.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow p-4 space-y-4">
            <div>
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-xs text-slate-500">
                {p.owner} · PIC: {p.pic}
              </p>
            </div>

            {/* PHASE */}
            {PHASES.map((ph) => (
              <div key={ph.key} className="flex items-center justify-between">
                <span className="text-xs">{ph.label}</span>
                <select
                  className={`text-xs rounded px-2 py-1 ${STATUS_STYLE[phase[p.id]?.[ph.key]]}`}
                  value={phase[p.id]?.[ph.key]}
                  onChange={(e) =>
                    setPhase((prev) => ({
                      ...prev,
                      [p.id]: { ...prev[p.id], [ph.key]: e.target.value },
                    }))
                  }
                >
                  {STATUS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            ))}

            {/* SRR */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span>SRR Readiness</span>
                <span>{progressSRR(srr[p.id] || [])}%</span>
              </div>
              {SRR_ITEMS.map((item, i) => (
                <label key={i} className="flex gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={srr[p.id]?.[i]}
                    onChange={() =>
                      setSrr((prev) => {
                        const arr = [...prev[p.id
