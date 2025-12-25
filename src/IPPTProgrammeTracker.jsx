import React, { useState } from "react";

/* =========================================================
   PROGRAM DATA – FINAL (22 PROGRAM)
========================================================= */

const PROGRAMS = [
  {
    id: 1,
    name: "Master of Science (Chemistry)",
    owner: "Pusat Pengajian Sains Kimia",
    nec: "0531 (Chemistry)",
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
    aktif: 8,
    berijazah: 0,
    tangguh: 2,
    label: "Pinjam",
  },
  {
    id: 3,
    name: "Master of Science (Clinical Sciences)",
    owner: "Pusat Pengajian Sains Perubatan",
    nec: "0914 (Medical diagnostic & treatment technology)",
    pic: "Husnaida binti Abdul Manan @ Sulong",
    team: ["Hazwani binti Ahmad Yusof @ Hanafi"],
    aktif: 2,
    berijazah: 0,
    tangguh: 0,
    label: "Pinjam",
  },
  {
    id: 4,
    name: "Master of Science (Community Medicine)",
    owner: "Pusat Pengajian Sains Perubatan",
    nec: "0923 (Social work and counselling)",
    pic: "Rohayu binti Hami",
    team: [
      "Nur Arzuar bin Abdul Rahim",
      "Noorsuzana binti Mohd Shariff",
      "Eva Nabiha binti Zamri",
    ],
    aktif: 8,
    berijazah: 0,
    tangguh: 1,
    label: "Pinjam",
  },
  {
    id: 5,
    name: "Master of Science (Dentistry)",
    owner: "Pusat Pengajian Sains Pergigian",
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
    aktif: 12,
    berijazah: 1,
    tangguh: 0,
    label: "Pinjam",
  },
  {
    id: 6,
    name: "Master of Science (Human Genetics)",
    owner: "Pusat Pengajian Sains Perubatan",
    nec: "0912 (Medicine)",
    pic: "Doblin anak Sandai",
    team: [
      "Zarina Thasneem binti Zainudeen",
      "Siti Nurfatimah binti Mohd Shahpudin",
      "Rabiatul Basria binti S.M.N.Mydin",
      "Ahzad Hadi bin Ahmad",
    ],
    aktif: 2,
    berijazah: 1,
    tangguh: 1,
    label: "Pinjam",
  },
  {
    id: 7,
    name: "Master of Science (Lifestyle Science)",
    owner: "IPPT",
    nec: "0915 (Therapy & Rehabilitation)",
    pic: "Teoh Soo Huat",
    team: [],
    aktif: 0,
    berijazah: 0,
    tangguh: 0,
    label: "IPPT Owner perlu buat FA sebab tiada no SWA",
  },
  {
    id: 8,
    name: "Master of Science (Medical Immunology)",
    owner: "Pusat Pengajian Sains Perubatan",
    nec: "0912 (Medicine)",
    pic: "Ida Shazrina binti Ismail",
    team: [
      "Zarina Thasneem binti Zainudeen",
      "Siti Mardhiana binti Mohamad",
      "Norfarazieda binti Hassan",
      "Asmida binti Isa",
    ],
    aktif: 0,
    berijazah: 1,
    tangguh: 0,
    label: "Pinjam",
  },
  {
    id: 9,
    name: "Master of Science (Medical Microbiology)",
    owner: "Pusat Pengajian Sains Perubatan",
    nec: "0914 (Medical diagnostic & treatment technology)",
    pic: "Mohammad Syamsul Reza bin Harun",
    team: ["Rabiatul Basria binti S.M.N.Mydin"],
    aktif: 7,
    berijazah: 0,
    tangguh: 0,
    label: "Pinjam",
  },
  {
    id: 10,
    name: "Master of Science (Medical Physics)",
    owner: "Pusat Pengajian Sains Perubatan",
    nec: "0914 (Medical diagnostic & treatment technology)",
    pic: "Mohd Zahri bin Abdul Aziz",
    team: [
      "Rafidah binti Zainon",
      "Noor Diyana binti Osman",
      "Mohd Hafiz bin Mohd Zin",
      "Fatanah binti Mohamad Suhaimi",
    ],
    aktif: 5,
    berijazah: 2,
    tangguh: 0,
    label: "Pinjam",
  },
  {
    id: 11,
    name: "Master of Science (Molecular Biology)",
    owner: "Pusat Pengajian Sains Kesihatan",
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
    aktif: 13,
    berijazah: 1,
    tangguh: 2,
    label: "Pinjam",
  },
  {
    id: 14,
    name: "Master of Science (Nutrition)",
    owner: "Pusat Pengajian Sains Kesihatan",
    nec: "0915 (Therapy & Rehabilitation)",
    pic: "Rabeta binti Mohd Salleh",
    team: [
      "Teoh Soo Huat",
      "Nor Shuhada binti Murad @ Mansor",
    ],
    aktif: 4,
    berijazah: 0,
    tangguh: 0,
    label: "Pinjam",
  },
  {
    id: 15,
    name: "Master of Science (Pathology)",
    owner: "Pusat Pengajian Sains Perubatan",
    nec: "0912 (Medicine)",
    pic: "Emmanuel Jairaj Moses",
    team: ["Salbiah binti Isa", "Asmida binti Isa"],
    aktif: 3,
    berijazah: 0,
    tangguh: 0,
    label: "Pinjam",
  },
  {
    id: 16,
    name: "Master of Science (Pharmaceutical Chemistry)",
    owner: "Pusat Pengajian Sains Farmasi",
    nec: "0916 (Pharmacy)",
    pic: "Mohd Yusmaidie bin Aziz",
    team: ["Erazuliana binti Abd Kadir"],
    aktif: 2,
    berijazah: 0,
    tangguh: 0,
    label: "Pinjam",
  },
  {
    id: 17,
    name: "Master of Science (Pharmaceutical Technology)",
    owner: "Pusat Pengajian Sains Farmasi",
    nec: "0916 (Pharmacy)",
    pic: "Nur Nadhirah binti Mohamad Zain",
    team: [],
    aktif: 1,
    berijazah: 0,
    tangguh: 0,
    label: "Pinjam",
  },
  {
    id: 18,
    name: "Master of Science (Pharmacology)",
    owner: "Pusat Pengajian Sains Perubatan",
    nec: "0916 (Pharmacy)",
    pic: "Nor Adlin binti Md Yusoff",
    team: ["Nozlena binti Abdul Samad"],
    aktif: 2,
    berijazah: 1,
    tangguh: 0,
    label: "Pinjam",
  },
  {
    id: 19,
    name: "Master of Science (Pharmacy)",
    owner: "Pusat Pengajian Sains Farmasi",
    nec: "0916 (Pharmacy)",
    pic: "Nozlena binti Abdul Samad",
    team: [],
    aktif: 1,
    berijazah: 0,
    tangguh: 0,
    label: "Pinjam",
  },
  {
    id: 20,
    name: "Master of Science (Sports Science)",
    owner: "Pusat Pengajian Sains Perubatan",
    nec: "1014 (Sports)",
    pic: "Eva Nabiha binti Zamri",
    team: [
      "Syamimi binti Shamsuddin",
      "Nurdiana binti Zainol Abidin",
      "Hazwani binti Ahmad Yusof @ Hanafi",
    ],
    aktif: 3,
    berijazah: 1,
    tangguh: 1,
    label: "Pinjam",
  },
  {
    id: 21,
    name: "Master of Science (Psychology)",
    owner: "IPPT",
    nec: "0923 (Social work and counselling)",
    pic: "Mohd Afifudin bin Mohamad",
    team: ["Nor Shuhada binti Murad @ Mansor"],
    aktif: 0,
    berijazah: 0,
    tangguh: 0,
    label: "Pinjam, NO SRR",
  },
  {
    id: 22,
    name: "Doctor of Philosophy (Minden)",
    owner: "Kampus Kesihatan",
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
    aktif: 198,
    berijazah: 23,
    tangguh: 11,
    label: "Pinjam",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function isProgrammeReady(p) {
  if (p.label.includes("NO SRR")) return false;
  if (p.label.includes("tiada no SWA")) return false;
  return p.aktif > 0;
}

/* =========================================================
   TABS
========================================================= */

function Tabs({ tabs }) {
  const [active, setActive] = useState(tabs[0].key);

  return (
    <>
      <div className="flex gap-2 mb-3 border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-3 py-1 text-sm rounded-t ${
              active === t.key
                ? "bg-sky-100 text-sky-700 font-semibold"
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

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function IPPTProgrammeTracker() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold mb-6">
        IPPT Programme Readiness Tracker
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        {PROGRAMS.map((p) => {
          const ready = isProgrammeReady(p);

          return (
            <article
              key={p.id}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >
              {/* HEADER */}
              <div className="mb-3">
                <h2 className="font-semibold text-lg">{p.name}</h2>
                <p className="text-xs text-slate-500">
                  {p.owner} · NEC {p.nec}
                </p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                    ready
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {ready ? "READY" : "NOT READY"}
                </span>
              </div>

              {/* TABS */}
              <Tabs
                tabs={[
                  {
                    key: "overview",
                    label: "Overview",
                    content: (
                      <div className="text-sm space-y-1">
                        <p>
                          <b>PIC:</b> {p.pic || "-"}
                        </p>
                        <p>
                          <b>Team:</b>{" "}
                          {p.team.length ? p.team.join(", ") : "-"}
                        </p>
                        <p>
                          <b>Aktif:</b> {p.aktif} |{" "}
                          <b>Berijazah:</b> {p.berijazah} |{" "}
                          <b>Tangguh:</b> {p.tangguh}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          Label: {p.label}
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: "plo",
                    label: "PLO & CQI",
                    content: (
                      <p className="text-sm text-slate-600">
                        Data PLO, indikator & CQI akan dipautkan daripada PPBMS.
                      </p>
                    ),
                  },
                  {
                    key: "srr",
                    label: "SRR Evidence",
                    content: (
                      <ul className="text-sm list-disc list-inside">
                        <li>Pemetaan PLO–MQF</li>
                        <li>Senarai pelajar aktif & graduan</li>
                        <li>Laporan CQI & minit mesyuarat</li>
                      </ul>
                    ),
                  },
                  {
                    key: "docs",
                    label: "Documents",
                    content: (
                      <p className="text-sm text-slate-600">
                        Letakkan pautan dokumen (Google Drive / SharePoint).
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
