import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, MoreHorizontal, Pencil, Trash2, Pause, Play } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const categoryColors = {
  health: "bg-green-500/10 text-green-600 border-green-500/20",
  career: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  relationships: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  finance: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  personal_growth: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  creativity: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  other: "bg-muted text-muted-foreground border-border",
};

export default function GoalCard({ goal, onEdit, onDelete }) {
  const [updating, setUpdating] = useState(false);

  const toggleStatus = async (newStatus) => {
    setUpdating(true);
    await base44.entities.Goal.update(goal.id, { status: newStatus });
    setUpdating(false);
  };

  const toggleMilestone = async (index) => {
    const milestones = [...(goal.milestones || [])];
    milestones[index] = { ...milestones[index], completed: !milestones[index].completed };
    const completedCount = milestones.filter((m) => m.completed).length;
    const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : goal.progress;
    await base44.entities.Goal.update(goal.id, { milestones, progress });
  };

  return (
    <Card className={cn("transition-all", goal.status === "completed" && "opacity-60")}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {goal.category && (
                <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", categoryColors[goal.category])}>
                  {goal.category?.replace("_", " ")}
                </Badge>
              )}
              {goal.status === "paused" && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">Paused</Badge>
              )}
            </div>
            <h3 className={cn("font-medium", goal.status === "completed" && "line-through")}>{goal.title}</h3>
            {goal.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{goal.description}</p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(goal)}>
                <Pencil className="w-3.5 h-3.5 mr-2" />Edit
              </DropdownMenuItem>
              {goal.status === "active" && (
                <DropdownMenuItem onClick={() => toggleStatus("paused")}>
                  <Pause className="w-3.5 h-3.5 mr-2" />Pause
                </DropdownMenuItem>
              )}
              {goal.status === "paused" && (
                <DropdownMenuItem onClick={() => toggleStatus("active")}>
                  <Play className="w-3.5 h-3.5 mr-2" />Resume
                </DropdownMenuItem>
              )}
              {goal.status !== "completed" && (
                <DropdownMenuItem onClick={() => toggleStatus("completed")}>
                  <Check className="w-3.5 h-3.5 mr-2" />Complete
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDelete(goal.id)} className="text-destructive">
                <Trash2 className="w-3.5 h-3.5 mr-2" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{goal.progress || 0}% complete</span>
            {goal.target_date && <span>Due {format(new Date(goal.target_date), "MMM d")}</span>}
          </div>
          <Progress value={goal.progress || 0} className="h-1.5" />
        </div>

        {/* Milestones */}
        {goal.milestones?.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {goal.milestones.map((m, i) => (
              <button
                key={i}
                onClick={() => toggleMilestone(i)}
                className="flex items-center gap-2 w-full text-left group"
              >
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                  m.completed ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"
                )}>
                  {m.completed && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                <span className={cn(
                  "text-sm",
                  m.completed && "line-through text-muted-foreground"
                )}>{m.title}</span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}