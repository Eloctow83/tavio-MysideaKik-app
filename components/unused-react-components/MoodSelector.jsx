import { cn } from "@/lib/utils";

const moods = [
  { value: "great", emoji: "🔥", label: "Great" },
  { value: "good", emoji: "😊", label: "Good" },
  { value: "okay", emoji: "😐", label: "Okay" },
  { value: "rough", emoji: "😔", label: "Rough" },
  { value: "terrible", emoji: "😫", label: "Terrible" },
];

export default function MoodSelector({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {moods.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onChange(mood.value)}
          className={cn(
            "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all flex-1",
            value === mood.value
              ? "border-primary bg-primary/10 scale-105"
              : "border-border/50 bg-card hover:bg-muted/50"
          )}
        >
          <span className="text-xl">{mood.emoji}</span>
          <span className="text-[10px] font-medium text-muted-foreground">{mood.label}</span>
        </button>
      ))}
    </div>
  );
}