import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import { TrendingUp } from "lucide-react";

const moodValues = { great: 5, good: 4, okay: 3, rough: 2, terrible: 1 };
const moodLabels = { 5: "Great", 4: "Good", 3: "Okay", 2: "Rough", 1: "Terrible" };

export default function MoodChart({ checkIns }) {
  const data = checkIns
    .filter((c) => c.mood)
    .sort((a, b) => a.date?.localeCompare(b.date))
    .slice(-14)
    .map((c) => ({
      date: c.date,
      mood: moodValues[c.mood] || 3,
      label: format(parseISO(c.date), "MMM d"),
    }));

  if (data.length < 2) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4 text-primary" />
            Mood Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Check in for a few more days to see your mood trend.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="w-4 h-4 text-primary" />
          Mood Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(35, 95%, 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(35, 95%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "hsl(220, 10%, 55%)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={(v) => moodLabels[v] || ""}
                tick={{ fontSize: 10, fill: "hsl(220, 10%, 55%)" }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220, 13%, 15%)",
                  border: "1px solid hsl(220, 10%, 30%)",
                  borderRadius: "6px",
                }}
                labelFormatter={(label) => label}
                formatter={(value) => [moodLabels[value] || "", "Mood"]}
              />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="hsl(35, 95%, 55%)"
                strokeWidth={2}
                fill="url(#moodGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
