export default function SRRChecklist({ programmeId, srrArray = [], onToggle }) {
  return (
    <div className="space-y-2 max-h-80 overflow-y-auto">
      {srrArray.map((checked, idx) => (
        <label
          key={idx}
          className="flex items-start gap-2 text-sm border rounded-lg p-2"
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggle(programmeId, idx)}
          />
          <span>Item SRR #{idx + 1}</span>
        </label>
      ))}
    </div>
  );
}
