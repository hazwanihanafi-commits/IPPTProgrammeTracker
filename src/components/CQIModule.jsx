import { useState, useEffect } from "react";

export default function CQIModule({ programmeId }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(`cqi_${programmeId}`);
    if (saved) setText(saved);
  }, [programmeId]);

  useEffect(() => {
    localStorage.setItem(`cqi_${programmeId}`, text);
  }, [programmeId, text]);

  return (
    <textarea
      className="w-full border rounded-lg p-3 text-sm"
      rows={6}
      placeholder="Nyatakan isu audit, dapatan, dan pelan CQI..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}
