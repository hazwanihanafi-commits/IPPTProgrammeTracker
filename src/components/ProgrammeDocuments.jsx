export default function ProgrammeDocuments({
  programme,
  drive,
  onUpload,
  onDelete,
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {["advisor", "ce", "srr"].map((key) => (
          <button
            key={key}
            onClick={() =>
              onUpload(programme, { key, label: key.toUpperCase() })
            }
            className="px-3 py-1 text-xs rounded bg-sky-50 border border-sky-200"
          >
            Upload {key.toUpperCase()}
          </button>
        ))}
      </div>

      {Object.entries(drive || {}).map(([section, files]) => (
        <div key={section}>
          <h4 className="text-xs font-semibold mb-1">{section.toUpperCase()}</h4>
          {files?.map((f, i) => (
            <div
              key={f.id}
              className="flex justify-between text-xs border rounded p-2"
            >
              <a href={f.url} target="_blank" rel="noreferrer">
                {f.name}
              </a>
              <button
                onClick={() => onDelete(programme.id, section, i)}
                className="text-red-600"
              >
                Buang
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
