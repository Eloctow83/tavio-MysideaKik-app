import { Card, CardContent } from "@/components/ui/card";
import { Target, Repeat, Calendar, Flame } from "lucide-react";

export default function StatsRow({ goals, habits, checkIns }) {
  const activeGoals = goals.filter((g) => g.status === "active").length;
  const activeHabits = habits.filter((h) => h.active !== false).length;
  const streak = checkIns.length; // simplified: count of total check-ins
  
  // Calculate longest current habit streak
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);

  const stats = [
    { icon: Target, label: "Active Goals", value: activeGoals, color: "text-blue-500" },
    { icon: Repeat, label: "Habits", value: activeHabits, color: "text-green-500" },
    { icon: Calendar, label: "Check-ins", value: streak, color: "text-purple-500" },
    { icon: Flame, label: "Best Streak", value: bestStreak, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card/60">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}