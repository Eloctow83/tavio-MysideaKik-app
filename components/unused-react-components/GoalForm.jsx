import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Trash2 } from "lucide-react";

const categories = [
  { value: "health", label: "Health" },
  { value: "career", label: "Career" },
  { value: "relationships", label: "Relationships" },
  { value: "finance", label: "Finance" },
  { value: "personal_growth", label: "Personal Growth" },
  { value: "creativity", label: "Creativity" },
  { value: "other", label: "Other" },
];

export default function GoalForm({ goal, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: goal?.title || "",
    description: goal?.description || "",
    category: goal?.category || "",
    target_date: goal?.target_date || "",
    milestones: goal?.milestones || [],
  });

  const addMilestone = () => {
    setForm((prev) => ({
      ...prev,
      milestones: [...prev.milestones, { title: "", completed: false }],
    }));
  };

  const updateMilestone = (index, title) => {
    const milestones = [...form.milestones];
    milestones[index] = { ...milestones[index], title };
    setForm((prev) => ({ ...prev, milestones }));
  };

  const removeMilestone = (index) => {
    setForm((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{goal ? "Edit Goal" : "New Goal"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="What do you want to achieve?"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Textarea
            placeholder="Why does this matter to you? (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="min-h-[60px] resize-none"
          />
          <div className="flex gap-3">
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={form.target_date}
              onChange={(e) => setForm({ ...form, target_date: e.target.value })}
              className="flex-1"
            />
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Milestones</p>
              <Button type="button" variant="ghost" size="sm" onClick={addMilestone}>
                <Plus className="w-3.5 h-3.5 mr-1" />Add
              </Button>
            </div>
            {form.milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  placeholder={`Milestone ${i + 1}`}
                  value={m.title}
                  onChange={(e) => updateMilestone(i, e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeMilestone(i)} className="h-8 w-8">
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={!form.title.trim()} className="flex-1">
              {goal ? "Update" : "Create Goal"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}