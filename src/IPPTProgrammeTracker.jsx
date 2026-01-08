import React, { useState } from "react";

/* =====================================================
   PROGRAM DATA (22 PROGRAM – RINGKAS & BOLEH TAMBAH)
===================================================== */

const PROGRAMS = [
  {
    id: 1,
    name: "Master of Science (Chemistry)",
    owner: "Pusat Pengajian Sains Kimia",
    pic: "Noorfatimah binti Yahaya",
    team: [
      "Nur Nadhirah binti Mohamad Zain",
      "Muhammad Azrul bin Zabidi",
    ],
    aktif: 4,
    berijazah: 4,
    tangguh: 0,
    label: "Pinjam",
  },
  {
    id: 2,
    name: "Master of Science (Biomedicine)",
    owner: "Pusat Pengajian Sains Kesihatan",
    pic: "Rabiatul Basria binti S.M.N.Mydin",
    team: [
      "Siti Razila binti Abdul Razak",
      "Siti Hawa binti Ngalim",
      "Ooi Jer Ping",
    ],
    aktif: 8,
    berijazah: 0,
    tangguh: 2,
    label: "Pinjam",
  },
  {
    id: 7,
    name: "Master of Science (Lifestyle Science)",
    owner: "IPPT",
    pic: "Teoh Soo Huat",
    team: [],
    aktif: 0,
    berijazah: 0,
    tangguh: 0,
    label: "IPPT Owner perlu buat FA sebab tiada no SWA",
  },
  {
    id: 21,
    name: "Master of Science (Psychology)",
    owner: "IPPT",
    pic: "Mohd Afifudin bin Mohamad",
    team: ["Nor Shuhada binti Murad @ Mansor"],
    aktif: 0,
    berijazah: 0,
    tangguh: 0,
    label: "Pinjam, NO SRR",
  },
];

/* =====================================================
   COPPA 2nd Edition – STANDARD 1–7 (0303 / 0304 / PART C)
===================================================== */

const COPPA_STANDARDS = [
  {
    std: "Standard 1",
    title: "Programme Development & Delivery",
    pic: "Owner",
    evidence: [
      "Dokumen PLO & MQF mapping",
      "Struktur kurikulum & SLT",
      "Minit semakan kurikulum",
    ],
  },
  {
    std: "Standard 2",
    title: "Assessment of Student Learning",
    pic: "Owner",
    evidence: [
      "CLO–PLO mapping",
      "Rubrik penilaian",
      "Moderation report",
    ],
  },
  {
    std: "Standard 3",
    title: "Student Selection & Support",
    pic: "IPPT",
    evidence: [
      "Senarai pelajar aktif",
      "Rekod penyeliaan",
      "Laporan kemajuan pelajar",
    ],
  },
  {
    std: "Standard 4",
    title: "Academic Staff",
    pic: "IPPT",
    evidence: [
      "Senarai staf & kelayakan",
      "Agihan beban tugas",
      "Rekod CPD",
    ],
  },
  {
    std: "Standard 5",
    title: "Educational Resources",
    pic: "IPPT",
    evidence: [
      "Senarai kemudahan",
      "Akses makmal/perpustakaan",
    ],
  },
  {
    std: "Standard 6",
    title: "Programme Management",
    pic: "Owner + IPPT",
    evidence: [
      "Carta organisasi",
      "Minit mesyuarat program",
      "SOP akademik",
    ],
  },
  {
    std: "Standard 7",
    title: "Monitoring, Review & CQI",
    pic: "Owner",
    evidence: [
      "Laporan CQI",
      "Analisis PLO",
      "Tindakan penambahbaikan",
    ],
  },
];

/* =====================================================
   HELPER
===================================================== */

function isReady(p) {
  if (p.label.includes("NO SRR")) return false;
  if (p.label.includes("tiada no SWA")) return false;
  return p.aktif > 0;
}

/* =====================================================
   TABS
===================================================== */

function Tabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].key);
  return (
    <>
      <div className="flex gap-2 border-b mb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-3 py-1 text-sm ${
              active === t.key
                ? "border-b-2 border-sky-600 font-semibold"
                : "text-slate-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{tabs.find((t) => t.key === active)?.content}</div>
    </>
  );
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function IPPTProgrammeTracker() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold mb-6">
        IPPT Programme Compliance & SRR Tracker
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        {PROGRAMS.map((p) => {
          const ready = isReady(p);

          return (
            <article key={p.id} className="bg-white p-4 rounded-xl shadow">
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-xs text-slate-500">{p.owner}</p>

              <span
                className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${
                  ready
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {ready ? "READY" : "NOT READY"}
              </span>

              <Tabs
                tabs={[
                  {
                    key: "overview",
                    label: "Overview",
                    content: (
                      <div className="text-sm mt-2">
                        <p><b>PIC:</b> {p.pic}</p>
                        <p><b>Team:</b> {p.team.join(", ") || "-"}</p>
                        <p>
                          Aktif: {p.aktif} | Graduan: {p.berijazah} | Tangguh:{" "}
                          {p.tangguh}
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: "coppa",
                    label: "COPPA Evidence",
                    content: (
                      <ul className="text-sm list-disc list-inside mt-2">
                        {COPPA_STANDARDS.map((s) => (
                          <li key={s.std}>
                            <b>{s.std}</b> – {s.title}  
                            <br />
                            <span className="text-xs text-slate-500">
                              PIC: {s.pic}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    key: "docs",
                    label: "Documents",
                    content: (
                      <p className="text-sm mt-2">
                        Letak <b>LINK</b> bukti (Drive / SharePoint) di sini
                        semasa audit.
                      </p>
                    ),
                  },
                ]}
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}
