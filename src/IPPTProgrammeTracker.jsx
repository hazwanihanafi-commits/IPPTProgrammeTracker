/* global gapi, google */
import React, { useState, useMemo, useEffect } from "react";

// ---- Google Drive Config ----
const GOOGLE_CLIENT_ID =
  "24521575326-4hni7mkmiut33lidfaqo9aksf9b1g164.apps.googleusercontent.com";
const GOOGLE_API_KEY = "AIzaSyAFyUx9-w3uShMkr1wwJyIBQ1dvvzQSTkg";
const DRIVE_FOLDER_ID = "1sYLzlypBed420jNele6qaGB0O-1s7nXK";

// ====== Google Picker helpers ======
let gapiLoaded = false;
let pickerLoaded = false;
let tokenClient = null;

function loadGapi() {
  return new Promise((resolve, reject) => {
    if (gapiLoaded && pickerLoaded) return resolve();

    function check() {
      if (window.gapi && window.google) {
        window.gapi.load("client:picker", async () => {
          try {
            await window.gapi.client.init({
              apiKey: GOOGLE_API_KEY,
              discoveryDocs: [
                "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
              ],
            });
            gapiLoaded = true;
            pickerLoaded = true;
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      } else {
        setTimeout(check, 300);
      }
    }
    check();
  });
}

function getAccessToken() {
  return new Promise(async (resolve, reject) => {
    try {
      await loadGapi();
    } catch (e) {
      return reject(e);
    }

    if (!tokenClient) {
      const oauth2 = window.google.accounts.oauth2;
      tokenClient = oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.file",
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            resolve(tokenResponse.access_token);
          } else {
            reject(new Error("No access token"));
          }
        },
      });
    }

    tokenClient.requestAccessToken({ prompt: "" });
  });
}

async function openDrivePicker(programme, onPicked) {
  const accessToken = await getAccessToken();

  const view = new window.google.picker.DocsUploadView()
    .setIncludeFolders(false)
    .setParent(DRIVE_FOLDER_ID);

  const picker = new window.google.picker.PickerBuilder()
    .setOAuthToken(accessToken)
    .setDeveloperKey(GOOGLE_API_KEY)
    .addView(view)
    .setTitle(`Upload dokumen - ${programme.name}`)
    .setCallback((data) => {
      if (data.action === window.google.picker.Action.PICKED) {
        const docs = data.docs || [];
        const mapped = docs.map((d) => ({
          id: d.id,
          name: d.name,
          mimeType: d.mimeType,
          size: d.sizeBytes,
          url: `https://drive.google.com/file/d/${d.id}/view`,
        }));
        onPicked(mapped);
      }
    })
    .build();

  picker.setVisible(true);
}

// ---- Config ----

const PHASES = [
  {
    key: "q1",
    label: "Q1 2026 – Penasihat Luar & Semakan Kurikulum",
  },
  {
    key: "q2",
    label: "Q2 2026 – Curriculum Evaluation (CE)",
  },
  {
    key: "q3",
    label: "Q3 2026 – SRR & Pencalonan APP",
  },
  {
    key: "q4",
    label: "Q4 2026 – Audit APP (Desktop & Lawatan)",
  },
];

const STATUS_OPTIONS = ["Not started", "In progress", "Completed", "Not required"];

// ---- Checklist template per PIC ----
const CHECKLIST_TEMPLATE = [
  "Semak kurikulum dalaman (CLO/PLO/MQF)",
  "Lantik penasihat luar",
  "Sesi penilaian penasihat luar selesai",
  "Kurikulum dimuktamadkan",
  "Lantik penilai luar (CE)",
  "CE dijalankan & laporan diterima",
  "Sediakan SRR",
  "Calon APP disahkan",
  "Audit desktop APP",
  "Audit lokasi APP",
];

const PROGRAMS = [
  {
    id: 1,
    no: 1,
    name: "Master of Science (Chemistry)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Kimia",
    noMqa: "MQA/SWA10625",
    nec: "0531 (Chemistry)",
    pic: "Noorfatimah binti Yahaya",
    team: [
      "Nur Nadhirah binti Mohamad Zain",
      "Muhammad Azrul bin Zabidi",
    ],
    label: "Pinjam",
  },
  {
    id: 2,
    no: 2,
    name: "Master of Science (Biomedicine)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Kesihatan",
    noMqa: "MQA/SWA10593",
    nec: "0912 (Medicine)",
    pic: "Rabiatul Basria binti S.M.N.Mydin",
    team: [
      "Siti Razila binti Abdul Razak",
      "Siti Hawa binti Ngalim",
      "Ooi Jer Ping",
      "Nor Effa Syazuli binti Zulkafli",
      "Mohammad Syamsul Reza bin Harun",
      "Emmanuel Jairaj Moses",
      "Asmida binti Isa",
    ],
    label: "Pinjam",
  },
  {
    id: 3,
    no: 3,
    name: "Master of Science (Clinical Sciences)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Perubatan",
    noMqa: "MQA/SWA10648",
    nec: "0914 (Medical diagnostic and treatment technology)",
    pic: "",
    team: ["Hazwani binti Ahmad Yusof@Hanafi"],
    label: "Pinjam",
  },
  {
    id: 4,
    no: 4,
    name: "Master of Science (Community Medicine)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Perubatan",
    noMqa: "MQA/SWA10639",
    nec: "0923 (Social work and counselling)",
    pic: "Rohayu binti Hami",
    team: [
      "Nur Arzuar bin Abdul Rahim",
      "Noorsuzana binti Mohd Shariff",
      "Eva Nabiha binti Zamri",
    ],
    label: "Pinjam",
  },
  {
    id: 5,
    no: 5,
    name: "Master of Science (Dentistry)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Pergigian",
    noMqa: "MQA/SWA10638",
    nec: "0910 (Health not further defined)",
    pic: "Noor Ayuni binti Shafiai",
    team: [
      "Norehan binti Mokhtar",
      "Nawal Radhiah Abdul Rahman",
      "Juzailah binti Roffie",
      "Husniyati binti Roslan",
      "Fatanah binti Mohamad Suhaimi",
      "Anis Farhan binti Kamaruddin",
      "Ahmad Fakrurrozi bin Mohamad",
    ],
    label: "Pinjam",
  },
  {
    id: 6,
    no: 6,
    name: "Master of Science (Human Genetics)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Perubatan",
    noMqa: "MQA/SWA10607",
    nec: "0912 (Medicine)",
    pic: "Doblin anak Sandai",
    team: [
      "Zarina Thasneem binti Zainudeen",
      "Siti Nurfatimah binti Mohd Shahpudin",
      "Rabiatul Basria binti S.M.N.Mydin",
      "Ahzad Hadi bin Ahmad",
    ],
    label: "Pinjam",
  },
  {
    id: 7,
    no: 7,
    name: "Master of Science (Lifestyle Science)",
    remarks: "OWN",
    owner: "IPPT (Owner)",
    noMqa: "-",
    nec: "0915 (Therapy and rehabilitation)",
    pic: "Teoh Soo Huat",
    team: [],
    label: "IPPT Owner perlu buat FA sebab tiada no SWA",
  },
  {
    id: 8,
    no: 8,
    name: "Master of Science (Medical Immunology)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Perubatan",
    noMqa: "MQA/SWA10609",
    nec: "0912 (Medicine)",
    pic: "Ida Shazrina binti Ismail",
    team: [
      "Zarina Thasneem binti Zainudeen",
      "Siti Mardhiana binti Mohamad",
      "Norfarazieda binti Hassan",
      "Asmida binti Isa",
    ],
    label: "Pinjam",
  },
  {
    id: 9,
    no: 9,
    name: "Master of Science (Medical Microbiology)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Perubatan",
    noMqa: "MQA/SWA10627",
    nec: "0914 (Medical diagnostic and treatment technology)",
    pic: "Mohammad Syamsul Reza bin Harun",
    team: ["Rabiatul Basria binti S.M.N.Mydin"],
    label: "Pinjam",
  },
  {
    id: 10,
    no: 10,
    name: "Master of Science (Medical Physics)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Perubatan",
    noMqa: "MQA/SWA10605",
    nec: "0914 (Medical diagnostic and treatment technology)",
    pic: "Mohd Zahri bin Abdul Aziz",
    team: [
      "Rafidah binti Zainon",
      "Noor Diyana binti Osman",
      "Mohd Hafiz bin Mohd Zin",
      "Fatanah binti Mohamad Suhaimi",
    ],
    label: "Pinjam",
  },
  {
    id: 11,
    no: 11,
    name: "Master of Science (Molecular Biology)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Kesihatan",
    noMqa: "MQA/SWA10591",
    nec: "0511 (Biology)",
    pic: "Nurulisa binti Zulkifle",
    team: [
      "Siti Nurfatimah binti Mohd Shahpudin",
      "Siti Nazmin binti Saifuddin",
      "Siti Hawa binti Ngalim",
      "Shahrul Bariyah binti Sahul Hamid",
      "Shafinah binti Ahmad Suhaimi",
      "Rabiatul Basria binti S.M.N.Mydin",
      "Ng Siew Kit",
      "Mohammad Syamsul Reza bin Harun",
      "Hazrina binti Yusof Hamdani",
      "Asmida binti Isa",
      "Ahmad Naqib bin Shuid",
    ],
    label: "Pinjam",
  },
  {
    id: 14,
    no: 14,
    name: "Master of Science (Nutrition)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Kesihatan",
    noMqa: "MQA/SWA12540",
    nec: "0915 (Therapy and rehabilitation)",
    pic: "Rabeta binti Mohd Salleh",
    team: ["Teoh Soo Huat", "Nor Shuhada binti Murad @ Mansor"],
    label: "Pinjam",
  },
  {
    id: 15,
    no: 15,
    name: "Master of Science (Pathology)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Perubatan",
    noMqa: "MQA/SWA10635",
    nec: "0912 (Medicine)",
    pic: "Emmanuel Jairaj Moses",
    team: ["Salbiah binti Isa", "Asmida binti Isa"],
    label: "Pinjam",
  },
  {
    id: 16,
    no: 16,
    name: "Master of Science (Pharmaceutical Chemistry)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Farmasi",
    noMqa: "MQA/SWA10624",
    nec: "0916 (Pharmacy)",
    pic: "Mohd Yusmaidie bin Aziz",
    team: ["Erazuliana binti Abd Kadir"],
    label: "Pinjam",
  },
  {
    id: 17,
    no: 17,
    name: "Master of Science (Pharmaceutical Technology)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Farmasi",
    noMqa: "MQA/SWA10661",
    nec: "0916 (Pharmacy)",
    pic: "Nur Nadhirah binti Mohamad Zain",
    team: [],
    label: "Pinjam",
  },
  {
    id: 18,
    no: 18,
    name: "Master of Science (Pharmacology)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Perubatan",
    noMqa: "MQA/SWA10599",
    nec: "0916 (Pharmacy)",
    pic: "Nor Adlin binti Md Yusoff",
    team: ["Nozlena binti Abdul Samad"],
    label: "Pinjam",
  },
  {
    id: 19,
    no: 19,
    name: "Master of Science (Pharmacy)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Farmasi",
    noMqa: "MQA/SWA10602",
    nec: "0916 (Pharmacy)",
    pic: "Nozlena binti Abdul Samad",
    team: [],
    label: "Pinjam",
  },
  {
    id: 20,
    no: 20,
    name: "Master of Science (Sports Science)",
    remarks: "Not own",
    owner: "Pusat Pengajian Sains Perubatan",
    noMqa: "MQA/SWA10653",
    nec: "1014 (Sports)",
    pic: "Eva Nabiha binti Zamri",
    team: [
      "Syamimi binti Shamsuddin",
      "Nurdiana binti Zainol Abidin",
      "Hazwani binti Ahmad Yusof@Hanafi",
    ],
    label: "Pinjam",
  },
  {
    id: 21,
    no: 21,
    name: "Master of Science (Psychology)",
    remarks: "OWN",
    owner: "IPPT (Owner)",
    noMqa: "-",
    nec: "0923 (Social work and counselling)",
    pic: "Mohd Afifudin bin Mohamad",
    team: ["Nor Shuhada binti Murad@Mansor"],
    label: "Pinjam, NO SRR",
  },
  {
    id: 22,
    no: 22,
    name: "Doctor of Philosophy (Minden)",
    remarks: "Not own",
    owner: "Kampus Kesihatan",
    noMqa: "MQA/SWA10573",
    nec: "0910 (Health not further defined)",
    pic: "Lim Vuanghao",
    team: [
      "Noorsuzana binti Mohd Shariff",
      "Mohd Afifudin bin Mohamad",
      "Norehan binti Mokhtar",
      "Noor Diyana binti Osman",
      "Nor Hazwani binti Ahmad",
      "Fatanah binti Mohamad Suhaimi",
    ],
    label: "Pinjam",
  },
];

function computeProgress(statusByPhase) {
  if (!statusByPhase) return 0;
  const total = PHASES.length;
  const completed = PHASES.filter(
    (p) => statusByPhase[p.key] === "Completed"
  ).length;
  return Math.round((completed / total) * 100);
}

export default function IPPTProgrammeTracker() {
  const [programmeStates, setProgrammeStates] = useState({});
  const [checklistStates, setChecklistStates] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");

  // Load from localStorage on first mount
  useEffect(() => {
    try {
      const savedProg = localStorage.getItem("ipptProgrammeStates");
      const savedChecklist = localStorage.getItem("ipptChecklistStates");
      const savedFiles = localStorage.getItem("ipptUploadedFiles");

      const defaultProg = {};
      const defaultChecklist = {};
      const defaultFiles = {};

      PROGRAMS.forEach((p) => {
        defaultProg[p.id] = {
          q1: "Not started",
          q2: "Not started",
          q3: "Not started",
          q4: "Not started",
        };
        defaultChecklist[p.id] = CHECKLIST_TEMPLATE.map(() => false);
        defaultFiles[p.id] = [];
      });

      setProgrammeStates(
        savedProg ? { ...defaultProg, ...JSON.parse(savedProg) } : defaultProg
      );
      setChecklistStates(
        savedChecklist
          ? { ...defaultChecklist, ...JSON.parse(savedChecklist) }
          : defaultChecklist
      );
      setUploadedFiles(
        savedFiles ? { ...defaultFiles, ...JSON.parse(savedFiles) } : defaultFiles
      );
    } catch (error) {
      console.error("Failed to load saved IPPT tracker state", error);
    }
  }, []);

  // Auto-save whenever state changes
  useEffect(() => {
    if (Object.keys(programmeStates).length) {
      localStorage.setItem(
        "ipptProgrammeStates",
        JSON.stringify(programmeStates)
      );
    }
    if (Object.keys(checklistStates).length) {
      localStorage.setItem(
        "ipptChecklistStates",
        JSON.stringify(checklistStates)
      );
    }
    if (Object.keys(uploadedFiles).length) {
      localStorage.setItem("ipptUploadedFiles", JSON.stringify(uploadedFiles));
    }
  }, [programmeStates, checklistStates, uploadedFiles]);

  const owners = useMemo(() => {
    const set = new Set(PROGRAMS.map((p) => p.owner));
    return ["all", ...Array.from(set)];
  }, []);

  const filteredPrograms = PROGRAMS.filter((p) => {
    const matchSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.pic.toLowerCase().includes(search.toLowerCase()) ||
      p.nec.toLowerCase().includes(search.toLowerCase());
    const matchOwner = ownerFilter === "all" || p.owner === ownerFilter;
    return matchSearch && matchOwner;
  });

  const handleStatusChange = (programmeId, phaseKey, newStatus) => {
    setProgrammeStates((prev) => ({
      ...prev,
      [programmeId]: {
        ...(prev[programmeId] || {
          q1: "Not started",
          q2: "Not started",
          q3: "Not started",
          q4: "Not started",
        }),
        [phaseKey]: newStatus,
      },
    }));
  };

  const handleChecklistToggle = (programmeId, index) => {
    setChecklistStates((prev) => {
      const current = prev[programmeId] || CHECKLIST_TEMPLATE.map(() => false);
      const updated = [...current];
      updated[index] = !updated[index];
      return {
        ...prev,
        [programmeId]: updated,
      };
    });
  };

  // ==== NEW: upload using Google Picker ====
  const handleFileUpload = async (programmeId) => {
    const programme = PROGRAMS.find((p) => p.id === programmeId);
    if (!programme) return;

    try {
      await openDrivePicker(programme, (pickedFiles) => {
        setUploadedFiles((prev) => {
          const existing = prev[programmeId] || [];
          return {
            ...prev,
            [programmeId]: [...existing, ...pickedFiles],
          };
        });
      });
    } catch (err) {
      console.error(err);
      alert("Gagal upload ke Google Drive. Sila cuba lagi.");
    }
  };

  const handleFileDelete = (programmeId, index) => {
    setUploadedFiles((prev) => {
      const existing = prev[programmeId] || [];
      const updated = existing.filter((_, i) => i !== index);
      return {
        ...prev,
        [programmeId]: updated,
      };
    });
  };

  // ===== Dashboard summary (colourful cards) =====
  const totalPrograms = PROGRAMS.length;

  const overallProgress = useMemo(() => {
    if (!totalPrograms) return 0;
    const totals = PROGRAMS.map((p) =>
      computeProgress(
        programmeStates[p.id] || {
          q1: "Not started",
          q2: "Not started",
          q3: "Not started",
          q4: "Not started",
        }
      )
    );
    const sum = totals.reduce((a, b) => a + b, 0);
    return Math.round(sum / totalPrograms);
  }, [programmeStates]);

  const quarterCompletion = useMemo(() => {
    const stats = {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
    };
    PROGRAMS.forEach((p) => {
      const s =
        programmeStates[p.id] || {
          q1: "Not started",
          q2: "Not started",
          q3: "Not started",
          q4: "Not started",
        };
      PHASES.forEach((ph) => {
        if (s[ph.key] === "Completed") stats[ph.key] += 1;
      });
    });
    return stats;
  }, [programmeStates]);

  const urgentProgramsCount = useMemo(() => {
    // Simple rule: any program with at least one phase still "Not started"
    return PROGRAMS.filter((p) => {
      const s =
        programmeStates[p.id] || {
          q1: "Not started",
          q2: "Not started",
          q3: "Not started",
          q4: "Not started",
        };
      return Object.values(s).includes("Not started");
    }).length;
  }, [programmeStates]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-violet-50 text-slate-900">
      {/* Top gradient header */}
      <header className="bg-gradient-to-r from-sky-600 via-sky-500 to-violet-500 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                📊
              </span>
              <span>IPPT Accreditation Dashboard 2026</span>
            </h1>
            <p className="text-sm md:text-base text-sky-100 mt-1 max-w-xl">
              Pantau secara visual status Penasihat Luar, CE, SRR dan Audit APP
              bagi semua program berkaitan IPPT.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
            <div className="flex flex-wrap gap-2">
              <input
                className="border border-white/40 bg-white/10 rounded-xl px-3 py-2 text-sm w-full md:w-64 shadow-sm placeholder:text-sky-100/70 focus:outline-none focus:ring-2 focus:ring-white/60"
                placeholder="🔍 Cari program / PIC / NEC..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="border border-white/40 bg-white/10 rounded-xl px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-white/60"
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
              >
                {owners.map((o) => (
                  <option key={o} value={o}>
                    {o === "all" ? "Semua Owner" : o}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-[11px] text-sky-100/80">
              {filteredPrograms.length} daripada {totalPrograms} program
              dipaparkan
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Dashboard summary cards */}
        <section className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-sky-100/60 p-4 flex flex-col gap-2">
            <div className="text-xs font-semibold text-sky-600 uppercase tracking-wide">
              Keseluruhan
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-slate-800">
                {overallProgress}%
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                Progress 2026
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Purata pencapaian semua program mengikut fasa Q1–Q4.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-4 flex flex-col gap-2">
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
              Program
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-slate-800">
                  {totalPrograms}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Jumlah program dalam radar IPPT
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                Semua NEC
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 flex flex-col gap-2">
            <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
              Perlu Perhatian
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-slate-800">
                {urgentProgramsCount}
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                Ada fasa “Not started”
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Program yang masih ada sekurang-kurangnya satu fasa belum
              bermula.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-4 flex flex-col gap-2">
            <div className="text-xs font-semibold text-violet-600 uppercase tracking-wide">
              Fasa Siap / {totalPrograms}
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] mt-1">
              <div className="flex items-center justify-between bg-violet-50 rounded-xl px-2 py-1">
                <span>Q1</span>
                <span className="font-semibold text-violet-700">
                  {quarterCompletion.q1}
                </span>
              </div>
              <div className="flex items-center justify-between bg-sky-50 rounded-xl px-2 py-1">
                <span>Q2</span>
                <span className="font-semibold text-sky-700">
                  {quarterCompletion.q2}
                </span>
              </div>
              <div className="flex items-center justify-between bg-emerald-50 rounded-xl px-2 py-1">
                <span>Q3</span>
                <span className="font-semibold text-emerald-700">
                  {quarterCompletion.q3}
                </span>
              </div>
              <div className="flex items-center justify-between bg-rose-50 rounded-xl px-2 py-1">
                <span>Q4</span>
                <span className="font-semibold text-rose-700">
                  {quarterCompletion.q4}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Bilangan program yang sudah lengkap pada setiap suku tahun.
            </p>
          </div>
        </section>

        {/* Legend */}
        <section className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-slate-100 p-4 text-xs md:text-sm flex flex-wrap gap-6">
          <div>
            <div className="font-semibold mb-1 text-slate-700">Fasa 2026</div>
            <ul className="space-y-0.5 list-disc list-inside text-slate-600">
              {PHASES.map((p) => (
                <li key={p.key}>{p.label}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-1 text-slate-700">Status</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                Not started
              </span>
              <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[11px]">
                In progress
              </span>
              <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px]">
                Completed
              </span>
              <span className="px-2 py-1 rounded-full bg-slate-200 text-slate-700 border border-slate-300 text-[11px]">
                Not required
              </span>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1 text-slate-700">Label Program</div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                Pinjam
              </span>
              <span className="px-2 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                IPPT Owner (FA)
              </span>
              <span className="px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                Pinjam, NO SRR
              </span>
            </div>
          </div>
        </section>

        {/* Programme cards with checklist & uploads */}
        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPrograms.map((p) => {
            const statusObj =
              programmeStates[p.id] ||
              PHASES.reduce(
                (acc, phase) => ({ ...acc, [phase.key]: "Not started" }),
                {}
              );
            const checklist =
              checklistStates[p.id] || CHECKLIST_TEMPLATE.map(() => false);
            const files = uploadedFiles[p.id] || [];
            const progress = computeProgress(statusObj);

            // pick stripe colour based on owner/label
            const stripeClass =
              p.remarks === "OWN"
                ? "from-violet-400 to-violet-500"
                : p.label?.includes("NO SRR")
                ? "from-rose-400 to-rose-500"
                : "from-sky-400 to-sky-500";

            return (
              <article
                key={p.id}
                className="relative bg-white/90 backdrop-blur border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
              >
                {/* coloured stripe */}
                <div
                  className={`absolute inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r ${stripeClass}`}
                />

                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2 mt-2">
                    <div>
                      <div className="text-[11px] text-slate-400">
                        Program #{p.no}
                      </div>
                      <h2 className="font-semibold text-sm md:text-base leading-snug text-slate-900">
                        {p.name}
                      </h2>
                      <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                        <div>{p.owner}</div>
                        <div>
                          <span className="font-medium">NEC:</span> {p.nec}
                        </div>
                        <div className="text-[10px]">
                          <span className="font-medium">MQA:</span>{" "}
                          {p.noMqa || "-"}
                        </div>
                      </div>
                      {p.label && (
                        <div className="inline-flex mt-2 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide bg-sky-50 text-sky-700 border border-sky-100">
                          {p.label}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      <div className="font-semibold text-slate-700">PIC</div>
                      <div className="max-w-[140px] truncate">
                        {p.pic || "-"}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Progress 2026</span>
                      <span className="font-semibold text-slate-700">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Phase status selectors */}
                  <div className="space-y-2">
                    {PHASES.map((phase, idx) => (
                      <div
                        key={phase.key}
                        className="flex items-center gap-2 text-[11px]"
                      >
                        <div className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center text-[10px] text-slate-500 bg-slate-50">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-700">
                            {phase.label}
                          </div>
                        </div>
                        <select
                          className="border rounded-lg px-2 py-1 text-[11px] bg-white shadow-sm focus:outline-none focus:ring focus:ring-sky-200"
                          value={statusObj[phase.key]}
                          onChange={(e) =>
                            handleStatusChange(p.id, phase.key, e.target.value)
                          }
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Upload documents (Google Drive) */}
                  <div className="border-t pt-3 mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[11px] font-semibold text-slate-700">
                        Dokumen Berkaitan (Google Drive)
                      </div>
                      <button
                        type="button"
                        className="text-[11px] px-3 py-1.5 rounded-full border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700"
                        onClick={() => handleFileUpload(p.id)}
                      >
                        Upload ke Drive
                      </button>
                    </div>

                    {files.length > 0 && (
                      <ul className="mt-1 space-y-1 max-h-24 overflow-y-auto pr-1 text-[11px] text-slate-600">
                        {files.map((f, idx) => (
                          <li
                            key={idx}
                            className="flex items-center justify-between gap-2"
                          >
                            {f.url ? (
                              <a
                                href={f.url}
                                target="_blank"
                                rel="noreferrer"
                                className="truncate underline hover:text-sky-700"
                                title={f.name}
                              >
                                • {f.name}
                                {f.size &&
                                  ` (${Math.round(f.size / 1024)} KB)`}
                              </a>
                            ) : (
                              <span className="truncate">
                                • {f.name}
                                {f.size &&
                                  ` (${Math.round(f.size / 1024)} KB)`}
                              </span>
                            )}

                            <button
                              type="button"
                              className="text-[10px] px-1.5 py-0.5 border rounded-full text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleFileDelete(p.id, idx)}
                            >
                              Buang
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {files.length === 0 && (
                      <p className="text-[10px] text-slate-400">
                        Belum ada dokumen dimuat naik untuk program ini.
                      </p>
                    )}

                    <p className="text-[10px] text-slate-500 mt-1">
                      Nota: Fail disimpan di Google Drive (folder IPPT). Senarai
                      ini hanya menyimpan link untuk program ini.
                    </p>
                  </div>

                  {/* Checklist Section */}
                  <div className="border-t pt-3 mt-2">
                    <div className="text-[11px] font-semibold text-slate-700 mb-2">
                      Senarai Semak PIC
                    </div>
                    <ul className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {CHECKLIST_TEMPLATE.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-[11px]"
                        >
                          <input
                            type="checkbox"
                            className="mt-0.5"
                            checked={!!checklist[idx]}
                            onChange={() => handleChecklistToggle(p.id, idx)}
                          />
                          <span className="text-slate-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredPrograms.length === 0 && (
            <p className="text-sm text-slate-500">
              Tiada program ditemui. Cuba ubah carian atau penapis owner.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
