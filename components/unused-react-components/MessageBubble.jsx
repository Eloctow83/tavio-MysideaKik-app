import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Sparkles, Clock, ChevronRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

function ToolCallDisplay({ toolCall }) {
  const [expanded, setExpanded] = useState(false);
  const name = toolCall?.name || "Action";
  const status = toolCall?.status || "pending";

  const statusConfig = {
    pending: { icon: Clock, color: "text-muted-foreground", spin: false },
    running: { icon: Loader2, color: "text-primary", spin: true },
    in_progress: { icon: Loader2, color: "text-primary", spin: true },
    completed: { icon: CheckCircle2, color: "text-green-500", spin: false },
    success: { icon: CheckCircle2, color: "text-green-500", spin: false },
    failed: { icon: AlertCircle, color: "text-destructive", spin: false },
    error: { icon: AlertCircle, color: "text-destructive", spin: false },
  }[status] || { icon: Clock, color: "text-muted-foreground", spin: false };

  const Icon = statusConfig.icon;
  const formattedName = name.replace(/\./g, " ").replace(/_/g, " ");

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-muted/50 text-xs text-muted-foreground hover:bg-muted transition-all mt-1"
    >
      <Icon className={cn("h-3 w-3", statusConfig.color, statusConfig.spin && "animate-spin")} />
      <span className="capitalize">{formattedName}</span>
      {!statusConfig.spin && (
        <ChevronRight className={cn("h-3 w-3 transition-transform", expanded && "rotate-90")} />
      )}
    </button>
  );
}

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 max-w-3xl mx-auto", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
      )}
      <div className={cn("max-w-[80%]", isUser && "flex flex-col items-end")}>
        {message.content && (
          <div
            className={cn(
              "rounded-2xl px-4 py-3",
              isUser
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-card border border-border/50 rounded-bl-md"
            )}
          >
            {isUser ? (
              <p className="text-sm leading-relaxed">{message.content}</p>
            ) : (
              <ReactMarkdown
                className="text-sm prose prose-sm prose-neutral dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                components={{
                  p: ({ children }) => <p className="my-1.5 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="my-1.5 ml-4 list-disc">{children}</ul>,
                  ol: ({ children }) => <ol className="my-1.5 ml-4 list-decimal">{children}</ol>,
                  li: ({ children }) => <li className="my-0.5">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  code: ({ children }) => (
                    <code className="px-1 py-0.5 rounded bg-muted text-xs font-mono">{children}</code>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        )}
        {message.tool_calls?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.tool_calls.map((tc, i) => (
              <ToolCallDisplay key={i} toolCall={tc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}