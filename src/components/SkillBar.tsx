import { useEffect, useRef, useState } from "react";

interface Props {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

const levelPercent = { Beginner: 33, Intermediate: 66, Advanced: 90 };

export default function SkillBar({ name, level }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const pct = levelPercent[level];

  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-foreground">{name}</span>
        <span className="text-muted-foreground">{level}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
          style={{ width: visible ? `${pct}%` : "0%" }}
        />
      </div>
    </div>
  );
}
