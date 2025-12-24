import React, { useEffect, useState } from "react";
import IPPTPLOModule from "./components/IPPTPLOModule";
import ProgrammeTabs from "./components/ProgrammeTabs";
import ProgressOverview from "./components/ProgressOverview";
import SRRChecklist from "./components/SRRChecklist";
import ProgrammeDocuments from "./components/ProgrammeDocuments";
import CQIModule from "./components/CQIModule";
import { PROGRAMS, PHASES } from "./data/programmes";

export default function IPPTProgrammeTracker() {
  const [programmeStates, setProgrammeStates] = useState({});
  const [srrChecklist, setSrrChecklist] = useState({});
  const [driveFiles, setDriveFiles] = useState({});

  /* ===== INIT ===== */
  useEffect(() => {
    const prog = {};
    const srr = {};
    const drive = {};

    PROGRAMS.forEach((p) => {
      prog[p.id] = {
        q1: "Not started",
        q2: "Not started",
        q3: "Not started",
        q4: "Not started",
      };
      srr[p.id] = [];
      drive[p.id] = { advisor: [], ce: [], srr: [] };
    });

    setProgrammeStates(prog);
    setSrrChecklist(srr);
    setDriveFiles(drive);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">
        IPPT Programme Accreditation Tracker
      </h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {PROGRAMS.map((p) => {
          const statusObj =
            programmeStates[p.id] ?? {
              q1: "Not started",
              q2: "Not started",
              q3: "Not started",
              q4: "Not started",
            };

          return (
            <article
              key={p.id}
              className="bg-white border rounded-2xl shadow-sm p-4"
            >
              {/* HEADER */}
              <div className="mb-3">
                <h2 className="font-semibold text-lg">{p.name}</h2>
                <p className="text-xs text-slate-500">
                  {p.owner} · NEC {p.nec} · PIC: {p.pic || "-"}
                </p>
              </div>

              {/* TABS */}
              <ProgrammeTabs
                programmeId={p.id}
                tabs={[
                  {
                    key: "overview",
                    label: "Overview",
                    content: (
                      <ProgressOverview
                        statusObj={statusObj}
                        phases={PHASES}
                      />
                    ),
                  },
                  {
                    key: "plo",
                    label: "PLO & Attainment",
                    content: (
                      <IPPTPLOModule programmeId={p.id} />
                    ),
                  },
                  {
                    key: "srr",
                    label: "SRR Evidence",
                    content: (
                      <SRRChecklist
                        programmeId={p.id}
                        value={srrChecklist[p.id]}
                        onChange={(v) =>
                          setSrrChecklist((prev) => ({
                            ...prev,
                            [p.id]: v,
                          }))
                        }
                      />
                    ),
                  },
                  {
                    key: "docs",
                    label: "Documents",
                    content: (
                      <ProgrammeDocuments
                        programme={p}
                        value={driveFiles[p.id]}
                        onChange={(v) =>
                          setDriveFiles((prev) => ({
                            ...prev,
                            [p.id]: v,
                          }))
                        }
                      />
                    ),
                  },
                  {
                    key: "cqi",
                    label: "CQI",
                    content: <CQIModule programmeId={p.id} />,
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
