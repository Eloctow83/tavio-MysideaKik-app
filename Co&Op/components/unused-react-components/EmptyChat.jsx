import { Sparkles, Brain, Target, TrendingUp, Shield } from "lucide-react";

const suggestions = [
  { icon: Brain, text: "Help me think through a tough decision" },
  { icon: Target, text: "I want to set a new goal" },
  { icon: TrendingUp, text: "How am I doing this week?" },
  { icon: Shield, text: "I need a reality check" },
];

export default function EmptyChat({ onSuggestionClick }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-12">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight mb-2">Hey, I'm your Sidekick</h2>
      <p className="text-muted-foreground text-center max-w-sm mb-8 text-sm leading-relaxed">
        Think of me as the version of you that doesn't get pulled into nonsense. 
        I'm here to help you think clearly, stay on track, and make better calls.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s.text)}
            className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/50 transition-all text-left group"
          >
            <s.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}