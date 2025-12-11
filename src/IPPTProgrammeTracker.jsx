/* global google */
import React, { useState, useMemo, useEffect } from "react";
import IPPTPLOModule from "./components/IPPTPLOModule";

/* ============================================================
   GOOGLE DRIVE CONFIG (Picker / Frontend-only)
===============================================================*/

const GOOGLE_CLIENT_ID =
  "24521575326-4hni7mkmiut33lidfaqo9aksf9b1g164.apps.googleusercontent.com";
const GOOGLE_API_KEY = "AIzaSyAFyUx9-w3uShMkr1wwJyIBQ1dvvzQSTkg";
const DRIVE_FOLDER_ID = "1sYLzlypBed420jNele6qaGB0O-1s7nXK";

const UPLOAD_SECTIONS = [
  {
    key: "advisor",
    label: "A. Penasihat Luar & Semakan Kurikulum (Q1)",
  },
  {
    key: "ce",
    label: "B. CE & Penilai Luar (Q2)",
  },
  {
    key: "srr",
    label: "C. SRR & Audit APP (Q3–Q4)",
  },
];

let pickerLoaded = false;
let tokenClient = null;

function loadPickerAndClient() {
  return new Promise((resolve, reject) => {
    function checkReady() {
      if (window.google && window.google.picker && window.gapi) {
        window.gapi.load("client", async () => {
          try {
            await window.gapi.client.init({
              apiKey: GOOGLE_API_KEY,
              discoveryDocs: [
                "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
              ],
            });
            pickerLoaded = true;
            resolve();
          } catch (err) {
            console.error("GAPI init failed", err);
            reject(err);
          }
        });
      } else {
        setTimeout(checkReady, 300);
      }
    }
    if (pickerLoaded) return resolve();
    checkReady();
  });
}

function getAccessToken() {
  return new Promise(async (resolve, reject) => {
    try {
      await loadPickerAndClient();
    } catch (e) {
      return reject(e);
    }

    if (!tokenClient) {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.file",
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            resolve(tokenResponse.access_token);
          } else {
            reject(new Error("Tiada access token"));
          }
        },
      });
    }

    tokenClient.requestAccessToken({ prompt: "" });
  });
}

async function openDrivePicker(programme, section, onPicked) {
  try {
    const accessToken = await getAccessToken();

    const uploadView = new window.google.picker.DocsUploadView()
      .setIncludeFolders(false)
      .setParent(DRIVE_FOLDER_ID);

    const picker = new window.google.picker.PickerBuilder()
      .setOAuthToken(accessToken)
      .setDeveloperKey(GOOGLE_API_KEY)
      .addView(uploadView)
      .setTitle(
        `Upload dokumen – ${programme.name} (${section.label.replace(
          /^A\. |^B\. |^C\. /,
          ""
        )})`
      )
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
  } catch (err) {
    console.error("Error opening Google Picker", err);
    alert(
      "Google Drive tidak dapat diakses. Pastikan anda login akaun @usm.my dan refresh semula."
    );
  }
}

/* ============================================================
   CONFIG: Phases, Status, Checklists, Programmes
===============================================================*/

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

const STATUS_STYLES = {
  "Not started": "bg-rose-100 text-rose-800 border-rose-200",
  "In progress": "bg-amber-100 text-amber-800 border-amber-200",
  Completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Not required": "bg-slate-100 text-slate-600 border-slate-200",
};

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

/* ============================================================
   SRR COPPA Checklist (Standard 1–9, 30+ items)
===============================================================*/

const SRR_COPPA_SECTIONS = [
  {
    title: "Standard 1 – Programme Development & Delivery",
    items: [
      {
        code: "1.1",
        label: "PLO selaras dengan MQF Level (mapping PLO → MQF lengkap).",
      },
      {
        code: "1.2",
        label: "Pemetaan CLO–PLO lengkap dan konsisten untuk semua kursus.",
      },
      {
        code: "1.3",
        label:
          "Struktur kurikulum jelas, logik, holistik (struktur program + agihan kredit + SLT).",
      },
      {
        code: "1.4",
        label:
          "Strategi pengajaran mematuhi OBE & student-centred learning (SCL).",
      },
      {
        code: "1.5",
        label:
          "Penyemakan kurikulum terkini dengan input penasihat luar / industri didokumenkan.",
      },
    ],
  },
  {
    title: "Standard 2 – Assessment of Student Learning",
    items: [
      {
        code: "2.1",
        label:
          "Pelan penilaian selaras dengan CLO & PLO (constructive alignment dibuktikan).",
      },
      {
        code: "2.2",
        label:
          "Instrumen penilaian memenuhi tahap kognitif MQF (Level 5: apply–analyse–evaluate–create).",
      },
      {
        code: "2.3",
        label:
          "Proses moderation / verification penilaian (dalaman/luaran) dilaksanakan dan direkodkan.",
      },
      {
        code: "2.4",
        label:
          "CQI penilaian (assessment) dilaksana berasaskan data (course report / analisis markah).",
      },
    ],
  },
  {
    title: "Standard 3 – Student Selection & Support Services",
    items: [
      {
        code: "3.1",
        label:
          "Kriteria kemasukan jelas, dipatuhi, dan sejajar dengan tahap program.",
      },
      {
        code: "3.2",
        label:
          "Perkhidmatan sokongan pelajar (akademik, kaunseling, pastoral) mencukupi dan digunakan.",
      },
      {
        code: "3.3",
        label:
          "Kemajuan pelajar dipantau secara sistematik (supervision log / progress report).",
      },
    ],
  },
  {
    title: "Standard 4 – Academic Staff",
    items: [
      {
        code: "4.1",
        label:
          "Kelayakan & kepakaran staf bersesuaian dengan kursus / bidang yang diajar.",
      },
      {
        code: "4.2",
        label:
          "Agihan beban tugas staf akademik seimbang dan direkodkan (teaching + supervision).",
      },
      {
        code: "4.3",
        label:
          "Staf mengikuti pembangunan profesional (CPD/latihan) dan rekodnya disimpan.",
      },
      {
        code: "4.4",
        label:
          "Prestasi staf dinilai secara berkala (penilaian tahunan / teaching evaluation).",
      },
    ],
  },
  {
    title: "Standard 5 – Educational Resources",
    items: [
      {
        code: "5.1",
        label:
          "Sumber fizikal & digital (makmal, perpustakaan, pangkalan data) mencukupi.",
      },
      {
        code: "5.2",
        label:
          "Akses, penyelenggaraan dan keselamatan sumber/fasiliti diurus dengan baik.",
      },
    ],
  },
  {
    title: "Standard 6 – Programme Management",
    items: [
      {
        code: "6.1",
        label:
          "Struktur tadbir urus program jelas (carta organisasi + peranan jawatankuasa).",
      },
      {
        code: "6.2",
        label:
          "Polisi & proses akademik (kurikulum, penilaian, pelajar) didokumenkan sebagai SOP.",
      },
      {
        code: "6.3",
        label:
          "Minit mesyuarat program lengkap dengan tindakan susulan (action item tracking).",
      },
    ],
  },
  {
    title: "Standard 7 – Monitoring, Review & CQI",
    items: [
      {
        code: "7.1",
        label:
          "Keberkesanan pengajaran & program dipantau (teaching evaluation, course report).",
      },
      {
        code: "7.2",
        label:
          "Input pihak industri / penasihat luar diambil kira dan ditindaklajuti.",
      },
      {
        code: "7.3",
        label:
          "Penilaian tahunan program (Annual Monitoring / Programme Review) dilaksanakan.",
      },
      {
        code: "7.4",
        label:
          "CQI program direkodkan dengan jelas (isu → tindakan → bukti pelaksanaan).",
      },
    ],
  },
  {
    title: "Standard 8 – Student Learning Outcomes (PLO)",
    items: [
      {
        code: "8.1",
        label:
          "Pengukuran langsung PLO (direct assessment) disediakan dan dianalisis.",
      },
      {
        code: "8.2",
        label:
          "Pengukuran tidak langsung PLO (indirect: survey/feedback) dikumpul dan dianalisis.",
      },
      {
        code: "8.3",
        label:
          "Pencapaian PLO memenuhi ambang (cth ≥70% pelajar mencapai tahap sasaran).",
      },
    ],
  },
  {
    title: "Standard 9 – Leadership, Governance & Administration",
    items: [
      {
        code: "9.1",
        label:
          "Sokongan kepimpinan (fakulti/universiti) dan sumber bagi program adalah mencukupi.",
      },
      {
        code: "9.2",
        label:
          "Pelan pengurusan risiko / kesinambungan program (risk & continuity plan) wujud dan didokumenkan.",
      },
    ],
  },
];

const SRR_SECTION_OFFSETS = (() => {
  const offsets = [];
  let acc = 0;
  SRR_COPPA_SECTIONS.forEach((sec) => {
    offsets.push(acc);
    acc += sec.items.length;
  });
  return offsets;
})();

const SRR_TOTAL_ITEMS =
  SRR_SECTION_OFFSETS[SRR_SECTION_OFFSETS.length - 1] +
  SRR_COPPA_SECTIONS[SRR_COPPA_SECTIONS.length - 1].items.length;

/* ============================================================
   PROGRAMME LIST (20 PROGRAMMES)
   (kept as provided)
===============================================================*/

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

/* ============================================================
   HELPERS
===============================================================*/

function computeProgress(statusByPhase) {
  if (!statusByPhase) return 0;
  const total = PHASES.length;
  const completed = PHASES.filter(
    (p) => statusByPhase[p.key] === "Completed"
  ).length;
  return Math.round((completed / total) * 100);
}

function computeSrrProgress(srrArray) {
  if (!srrArray || !srrArray.length) return 0;
  const done = srrArray.filter(Boolean).length;
  return Math.round((done / SRR_TOTAL_ITEMS) * 100);
}

/* ============================================================
   MAIN COMPONENT
===============================================================*/

export default function IPPTProgrammeTracker() {
  const [programmeStates, setProgrammeStates] = useState({});
  const [checklistStates, setChecklistStates] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [srrChecklist, setSrrChecklist] = useState({});
  const [driveFiles, setDriveFiles] = useState({});
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");

  // Load from localStorage
  useEffect(() => {
    try {
      const savedProg = localStorage.getItem("ipptProgrammeStates");
      const savedChecklist = localStorage.getItem("ipptChecklistStates");
      const savedFiles = localStorage.getItem("ipptUploadedFiles");
      const savedSRR = localStorage.getItem("ipptSrrCoppaChecklist");
      const savedDrive = localStorage.getItem("ipptDriveFiles");

      const defaultProg = {};
      const defaultChecklist = {};
      const defaultFiles = {};
      const defaultSRR = {};
      const defaultDrive = {};

      PROGRAMS.forEach((p) => {
        defaultProg[p.id] = {
          q1: "Not started",
          q2: "Not started",
          q3: "Not started",
          q4: "Not started",
        };
        defaultChecklist[p.id] = CHECKLIST_TEMPLATE.map(() => false);
        defaultFiles[p.id] = [];
        defaultSRR[p.id] = Array(SRR_TOTAL_ITEMS).fill(false);
        defaultDrive[p.id] = {
          advisor: [],
          ce: [],
          srr: [],
        };
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
      setSrrChecklist(
        savedSRR ? { ...defaultSRR, ...JSON.parse(savedSRR) } : defaultSRR
      );
      setDriveFiles(
        savedDrive ? { ...defaultDrive, ...JSON.parse(savedDrive) } : defaultDrive
      );
    } catch (error) {
      console.error("Failed to load saved IPPT tracker state", error);
    }
  }, []);

  // Auto-save
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
    if (Object.keys(srrChecklist).length) {
      localStorage.setItem("ipptSrrCoppaChecklist", JSON.stringify(srrChecklist));
    }
    if (Object.keys(driveFiles).length) {
      localStorage.setItem("ipptDriveFiles", JSON.stringify(driveFiles));
    }
  }, [programmeStates, checklistStates, uploadedFiles, srrChecklist, driveFiles]);

  const owners = useMemo(() => {
    const set = new Set(PROGRAMS.map((p) => p.owner));
    return ["all", ...Array.from(set)];
  }, []);

  const filteredPrograms = PROGRAMS.filter((p) => {
    const term = search.trim().toLowerCase();
    const matchSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      (p.pic || "").toLowerCase().includes(term) ||
      (p.nec || "").toLowerCase().includes(term);
    const matchOwner = ownerFilter === "all" || p.owner === ownerFilter;
    return matchSearch && matchOwner;
  });

  // Dashboard summary
  const summary = useMemo(() => {
    if (!PROGRAMS.length) {
      return {
        total: 0,
        avgPhase: 0,
        avgSRR: 0,
        atRisk: 0,
      };
    }

    let totalPhase = 0;
    let totalSrr = 0;
    let atRisk = 0;

    PROGRAMS.forEach((p) => {
      const statusObj =
        programmeStates[p.id] ||
        PHASES.reduce(
          (acc, phase) => ({ ...acc, [phase.key]: "Not started" }),
          {}
        );
      totalPhase += computeProgress(statusObj);

      const srrArray =
        srrChecklist[p.id] || Array(SRR_TOTAL_ITEMS).fill(false);
      const sp = computeSrrProgress(srrArray);
      totalSrr += sp;
      if (sp < 50) atRisk += 1;
    });

    const total = PROGRAMS.length;
    return {
      total,
      avgPhase: Math.round(totalPhase / total),
      avgSRR: Math.round(totalSrr / total),
      atRisk,
    };
  }, [programmeStates, srrChecklist]);

  // Handlers
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

  const handleSrrToggle = (programmeId, index) => {
    setSrrChecklist((prev) => {
      const current = prev[programmeId] || Array(SRR_TOTAL_ITEMS).fill(false);
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

  const handleDriveUploadClick = (programme, section) => {
    openDrivePicker(programme, section, (newFiles) => {
      setDriveFiles((prev) => {
        const existingProgram =
          prev[programme.id] || { advisor: [], ce: [], srr: [] };
        return {
          ...prev,
          [programme.id]: {
            ...existingProgram,
            [section.key]: [...(existingProgram[section.key] || []), ...newFiles],
          },
        };
      });
    });
  };

  const handleDriveDelete = (programmeId, sectionKey, index) => {
    setDriveFiles((prev) => {
      const programFiles =
        prev[programmeId] || { advisor: [], ce: [], srr: [] };
      const sectionFiles = programFiles[sectionKey] || [];
      const updatedSection = sectionFiles.filter((_, i) => i !== index);
      return {
        ...prev,
        [programmeId]: {
          ...programFiles,
          [sectionKey]: updatedSection,
        },
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-violet-50 text-slate-900">
      {/* Top header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent">
              IPPT Programme Accreditation Tracker 2026
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Pantau Penasihat Luar, CE, SRR & Audit APP bagi program OWN IPPT
              dan program pinjam.
            </p>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <input
              className="border rounded-xl px-3 py-2 text-sm w-full md:w-64 shadow-sm focus:outline-none focus:ring focus:ring-sky-200 bg-white"
              placeholder="Cari program / PIC / NEC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border rounded-xl px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:ring-sky-200 bg-white"
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
        {/* DASHBOARD SUMMARY */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Bilangan Program
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-3xl font-bold text-slate-900">
                {summary.total}
              </div>
              <div className="text-xs text-slate-500 text-right">
                Termasuk program OWN & pinjam
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Purata Progress Fasa 2026
            </div>
            <div className="flex items-center justify-between mt-2 mb-1">
              <div className="text-2xl font-bold text-emerald-700">
                {summary.avgPhase}%
              </div>
              <span className="inline-flex px-2 py-1 rounded-full text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100">
                Q1–Q4
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all"
                style={{ width: `${summary.avgPhase}%` }}
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Purata SRR COPPA Readiness
            </div>
            <div className="flex items-center justify-between mt-2 mb-1">
              <div className="text-2xl font-bold text-indigo-700">
                {summary.avgSRR}%
              </div>
              <span
                className={`inline-flex px-2 py-1 rounded-full text-[11px] border ${
                  summary.avgSRR >= 80
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : summary.avgSRR >= 50
                    ? "bg-amber-50 text-amber-700 border-amber-100"
                    : "bg-rose-50 text-rose-700 border-rose-100"
                }`}
              >
                {summary.avgSRR >= 80
                  ? "On Track"
                  : summary.avgSRR >= 50
                  ? "Perlu Pemantauan"
                  : "Berisiko"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Program berisiko (SRR &lt; 50%):{" "}
              <span className="font-semibold">{summary.atRisk}</span>
            </p>
          </div>
        </section>

        {/* PLO MODULE (global card) */}
        <section className="mb-6">
          <IPPTPLOModule />
        </section>

        {/* LEGEND */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-xs md:text-sm flex flex-wrap gap-6">
          <div>
            <div className="font-semibold mb-1 text-slate-700">
              Fasa 2026 (Gantt)
            </div>
            <ul className="space-y-0.5 list-disc list-inside text-slate-600">
              {PHASES.map((p) => (
                <li key={p.key}>{p.label}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-1 text-slate-700">Status Fasa</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] border border-rose-200">
                Not started
              </span>
              <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] border border-amber-200">
                In progress
              </span>
              <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] border border-emerald-200">
                Completed
              </span>
              <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] border border-slate-200">
                Not required
              </span>
            </div>
          </div>
        </section>

        {/* PROGRAMME CARDS */}
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
            const srrArray =
              srrChecklist[p.id] || Array(SRR_TOTAL_ITEMS).fill(false);
            const drive = driveFiles[p.id] || {
              advisor: [],
              ce: [],
              srr: [],
            };

            const progress = computeProgress(statusObj);
            const srrProgress = computeSrrProgress(srrArray);

            return (
              <article
                key={p.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] text-slate-400">
                      Program #{p.no}
                    </div>
                    <h2 className="font-semibold text-sm md:text-base leading-snug text-slate-900">
                      {p.name}
                    </h2>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {p.owner} · {p.remarks} · NEC {p.nec}
                    </div>
                    {p.label && (
                      <div className="inline-flex mt-2 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide bg-sky-50 text-sky-700 border border-sky-100">
                        {p.label}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-[11px] text-slate-500 max-w-[55%]">
                    <div className="font-medium text-slate-700">PIC</div>
                    <div>{p.pic || "-"}</div>
                    {p.team?.length > 0 && (
                      <div className="mt-1 text-[10px] text-slate-500">
                        <span className="font-semibold">Team:</span>{" "}
                        {p.team.join(", ")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Overall Progress */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Progress Fasa 2026</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 via-emerald-400 to-violet-400 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Phase status selectors */}
                <div className="space-y-2">
                  {PHASES.map((phase) => (
                    <div key={phase.key} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-medium text-slate-700">
                          {phase.label}
                        </div>
                        <div
                          className={`px-2 py-0.5 rounded-full text-[10px] border ${STATUS_STYLES[statusObj[phase.key]]}`}
                        >
                          {statusObj[phase.key]}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {STATUS_OPTIONS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                              STATUS_STYLES[s]
                            } ${
                              statusObj[phase.key] === s
                                ? "ring-2 ring-sky-400 ring-offset-1"
                                : "opacity-70 hover:opacity-100"
                            }`}
                            onClick={() =>
                              handleStatusChange(p.id, phase.key, s)
                            }
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Local Upload */}
                <div className="border-t border-slate-100 pt-3 mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[11px] font-semibold text-slate-700">
                      Upload Tempatan (tidak ke Drive)
                    </div>
                  </div>
                  <input
                    type="file"
                    multiple
                    className="text-[11px]"
                    onChange={(e) => handleFileUpload(p.id, e)}
                  />
                  {files.length > 0 && (
                    <ul className="mt-2 space-y-1 max-h-20 overflow-y-auto pr-1 text-[11px] text-slate-600">
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
                    Hanya rekod di pelayar ini (backup internal sebelum upload
                    rasmi SRR).
                  </p>
                </div>

                {/* Google Drive uploads */}
                <div className="border-t border-slate-100 pt-3 mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[11px] font-semibold text-sky-800">
                      Dokumen Google Drive (Folder IPPT)
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Guna akaun <span className="font-semibold">@usm.my</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {UPLOAD_SECTIONS.map((sec) => (
                      <button
                        key={sec.key}
                        type="button"
                        className="text-[10px] px-2 py-1 rounded-full border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
                        onClick={() => handleDriveUploadClick(p, sec)}
                      >
                        Upload {sec.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                    {UPLOAD_SECTIONS.map((sec) => {
                      const sectionFiles = drive[sec.key] || [];
                      if (!sectionFiles.length) return null;
                      return (
                        <div key={sec.key} className="mb-1">
                          <div className="text-[10px] font-semibold text-slate-700 mb-0.5">
                            {sec.label}
                          </div>
                          <ul className="space-y-0.5 text-[10px] text-slate-600">
                            {sectionFiles.map((f, idx) => (
                              <li
                                key={f.id + idx}
                                className="flex items-center justify-between gap-2"
                              >
                                <a
                                  href={f.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline truncate hover:text-sky-700"
                                >
                                  • {f.name}
                                </a>
                                <button
                                  type="button"
                                  className="text-[9px] px-1.5 py-0.5 border rounded-full text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() =>
                                    handleDriveDelete(p.id, sec.key, idx)
                                  }
                                >
                                  Buang
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                    {!drive.advisor.length &&
                      !drive.ce.length &&
                      !drive.srr.length && (
                        <p className="text-[10px] text-slate-400">
                          Tiada rekod dokumen Drive lagi untuk program ini.
                        </p>
                      )}
                  </div>
                </div>

                {/* PIC Checklist */}
                <div className="border-t border-slate-100 pt-3 mt-2">
                  <div className="text-[11px] font-semibold text-slate-700 mb-2">
                    Senarai Semak PIC (Tugasan Operasi)
                  </div>
                  <ul className="space-y-1 max-h-28 overflow-y-auto pr-1">
                    {CHECKLIST_TEMPLATE.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={!!checklist[idx]}
                          onChange={() => handleChecklistToggle(p.id, idx)}
                        />
                        <span className="text-[11px] text-slate-600">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SRR COPPA checklist */}
                <div className="border-t border-slate-100 pt-3 mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[11px] font-semibold text-indigo-700">
                      SRR COPPA Checklist (Level 5 Attainment)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      SRR Ready:{" "}
                      <span className="font-semibold">{srrProgress}%</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2">
                    Tick item yang telah lengkap dengan bukti (dokumen, minit,
                    laporan) untuk program ini.
                  </p>

                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {SRR_COPPA_SECTIONS.map((section, sIdx) => (
                      <details
                        key={section.title}
                        className="border border-slate-100 rounded-xl bg-slate-50/70"
                      >
                        <summary className="px-2 py-1.5 cursor-pointer text-[10px] font-semibold text-slate-700 flex items-center justify-between">
                          <span>{section.title}</span>
                        </summary>
                        <div className="px-2 pb-2 pt-1">
                          <ul className="space-y-1">
                            {section.items.map((item, iIdx) => {
                              const globalIndex =
                                SRR_SECTION_OFFSETS[sIdx] + iIdx;
                              return (
                                <li
                                  key={item.code}
                                  className="flex items-start gap-2 text-[10px]"
                                >
                                  <input
                                    type="checkbox"
                                    className="mt-0.5"
                                    checked={!!srrArray[globalIndex]}
                                    onChange={() =>
                                      handleSrrToggle(p.id, globalIndex)
                                    }
                                  />
                                  <span className="text-slate-700">
                                    <span className="font-semibold mr-1">
                                      {item.code}
                                    </span>
                                    {item.label}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </details>
                    ))}
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
