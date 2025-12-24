export default function ProgressOverview({ statusObj = {}, phases }) {
  return (
    <div className="space-y-2">
      {phases.map((phase) => (
        <div
          key={phase.key}
          className="flex justify-between items-center text-sm border rounded-lg px-3 py-2"
        >
          <span>{phase.label}</span>
          <span className="font-semibold">{statusObj?.[phase.key]}</span>
        </div>
      ))}
    </div>
  );
}
