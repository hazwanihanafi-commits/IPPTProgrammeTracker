import React, { useState, useMemo, useEffect } from "react";

// ---- Google Drive Config ----
const GOOGLE_CLIENT_ID = "24521575326-4hni7mkmiut33lidfaqo9aksf9b1g164.apps.googleusercontent.com";
const DRIVE_FOLDER_ID = "1sYLzlypBed420jNele6qaGB0O-1s7nXK";

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
    pic: "Noor Ayuni binti Ahmad Shafiai",
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
  const completed = PHASES.filter((p) => statusByPhase[p.key] === "Completed").length;
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
      localStorage.setItem("ipptChecklistStates", JSON.stringify(checklistStates));
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

  const handleFileUpload = (programmeId, event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploadedFiles((prev) => {
      const existing = prev[programmeId] || [];
      const newEntries = files.map((file) => ({
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
      }));
      return {
        ...prev,
        [programmeId]: [...existing, ...newEntries],
      };
    });

    // reset input so the same file can be reselected later
    event.target.value = "";
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              IPPT Programme Accreditation Tracker 2026
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Pantau status Penasihat Luar, CE, SRR dan Audit APP bagi 20 program.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <input
              className="border rounded-xl px-3 py-2 text-sm w-full md:w-64 shadow-sm focus:outline-none focus:ring focus:ring-sky-200"
              placeholder="Cari program / PIC / NEC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border rounded-xl px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:ring-sky-200"
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Legend */}
        <section className="bg-white rounded-2xl shadow-sm border p-4 text-xs md:text-sm flex flex-wrap gap-4">
          <div>
            <div className="font-semibold mb-1">Fasa 2026</div>
            <ul className="space-y-0.5 list-disc list-inside">
              {PHASES.map((p) => (
                <li key={p.key}>{p.label}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-1">Status</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                Not started
              </span>
              <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                In progress
              </span>
              <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Completed
              </span>
              <span className="px-2 py-1 rounded-full bg-slate-200 text-slate-700">
                Not required
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

            return (
              <article
                key={p.id}
                className="bg-white border rounded-2xl shadow-sm p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs text-slate-500">Program #{p.no}</div>
                    <h2 className="font-semibold text-sm md:text-base leading-snug">
                      {p.name}
                    </h2>
                    <div className="text-xs text-slate-500 mt-1">
                      {p.owner} · {p.remarks} · NEC {p.nec}
                    </div>
                    {p.label && (
                      <div className="inline-flex mt-2 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide bg-sky-50 text-sky-700 border border-sky-100">
                        {p.label}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <div className="font-medium text-slate-700">PIC</div>
                    <div>{p.pic || "-"}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Progress 2026</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Phase status selectors */}
                <div className="space-y-2">
                  {PHASES.map((phase) => (
                    <div key={phase.key} className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="text-[11px] font-medium text-slate-700">
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

                {/* Upload documents */}
                <div className="border-t pt-3 mt-2">
                  <div className="text-[11px] font-semibold text-slate-700 mb-2">
                    Dokumen Berkaitan (rekod tempatan)
                  </div>
                  <input
                    type="file"
                    multiple
                    className="text-[11px]"
                    onChange={(e) => handleFileUpload(p.id, e)}
                  />
                  {files.length > 0 && (
                    <ul className="mt-2 space-y-1 max-h-24 overflow-y-auto pr-1 text-[11px] text-slate-600">
                      {files.map((f, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="truncate">
                            • {f.name} ({Math.round(f.size / 1024)} KB)
                          </span>
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
                  <p className="text-[10px] text-slate-500 mt-1">
                    Nota: Fail tidak disimpan di server; senarai ini hanya sebagai rekod
                    di pelayar ini.
                  </p>
                </div>

                {/* Checklist Section */}
                <div className="border-t pt-3 mt-2">
                  <div className="text-[11px] font-semibold text-slate-700 mb-2">
                    Senarai Semak PIC
                  </div>
                  <ul className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {CHECKLIST_TEMPLATE.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={!!checklist[idx]}
                          onChange={() => handleChecklistToggle(p.id, idx)}
                        />
                        <span className="text-[11px] text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
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
