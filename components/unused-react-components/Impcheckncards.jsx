import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Check } from "lucide-react";
import MoodSelector from "./MoodSelector";
import { format } from "date-fns";

export default function CheckInCard({ todayCheckIn, onComplete }) {
  const [mood, setMood] = useState(todayCheckIn?.mood || "");
  const [journal, setJournal] = useState(todayCheckIn?.journal || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const data = {
      date: format(new Date(), "yyyy-MM-dd"),
      mood,
      journal,
    };

    if (todayCheckIn?.id) {
      await base44.entities.CheckIn.update(todayCheckIn.id, data);
    } else {
      await base44.entities.CheckIn.create(data);
    }
    setSaving(false);
    onComplete?.();
  };

  if (todayCheckIn && !mood) {
    setMood(todayCheckIn.mood);
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="w-4 h-4 text-primary" />
          Daily Check-in
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-3">How are you feeling right now?</p>
          <MoodSelector value={mood} onChange={setMood} />
        </div>
        <div>
          <Textarea
            placeholder="What's on your mind today? (optional)"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="min-h-[80px] bg-background/50 border-border/50 resize-none"
          />
        </div>
        <Button
          onClick={handleSave}
          disabled={!mood || saving}
          className="w-full"
        >
          {saving ? "Saving..." : todayCheckIn ? (
            <><Check className="w-4 h-4 mr-2" />Update Check-in</>
          ) : (
            "Check In"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}