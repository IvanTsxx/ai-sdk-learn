"use client";

import { Loader2, Terminal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getLessonById } from "@/lib/lessons";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function OutputPanel() {
  const { currentLessonId, simulatedOutput, isRunning } = useGameStore();
  const lesson = getLessonById(currentLessonId);
  const [displayedText, setDisplayedText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Animate streaming output
  useEffect(() => {
    if (!(simulatedOutput && lesson)) {
      setDisplayedText("");
      return;
    }

    // Clear any existing animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    if (lesson.isStreaming) {
      setIsAnimating(true);
      setDisplayedText("");
      let index = 0;

      const animate = () => {
        if (index < simulatedOutput.length) {
          setDisplayedText(simulatedOutput.slice(0, index + 1));
          index++;
          animationRef.current = setTimeout(animate, 15);
        } else {
          setIsAnimating(false);
        }
      };

      animate();
    } else {
      // Non-streaming: show after delay
      setIsAnimating(true);
      animationRef.current = setTimeout(() => {
        setDisplayedText(simulatedOutput);
        setIsAnimating(false);
      }, 600);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [simulatedOutput, lesson]);

  const isJson = simulatedOutput?.trim().startsWith("{");
  const hasToolCall = simulatedOutput?.includes("[Tool call:");

  return (
    <div className="flex h-full flex-col border-border border-l bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 border-border border-b px-4 py-3">
        <Terminal className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-muted-foreground text-xs">Output</span>
        {(isRunning || isAnimating) && (
          <Loader2 className="ml-auto h-3 w-3 animate-spin text-primary" />
        )}
      </div>

      {/* Output content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {simulatedOutput || isRunning ? (
            isRunning && !displayedText ? (
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Ejecutando...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {hasToolCall ? (
                  <ToolCallOutput text={displayedText} />
                ) : isJson ? (
                  <pre className="overflow-auto whitespace-pre-wrap border border-border bg-muted/30 p-3 font-mono text-foreground text-xs">
                    {displayedText}
                  </pre>
                ) : (
                  <div className="whitespace-pre-wrap font-mono text-foreground text-xs leading-relaxed">
                    {displayedText}
                    {isAnimating && lesson?.isStreaming && (
                      <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-primary" />
                    )}
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center border border-muted-foreground/30 border-dashed">
                <Terminal className="h-5 w-5 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground text-xs">
                Haz clic en &quot;Run&quot; para ver el output
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function ToolCallOutput({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-2 font-mono text-xs">
      {lines.map((line, i) => {
        if (line.startsWith("[Tool call:")) {
          return (
            <div
              className="border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400"
              key={i}
            >
              {line}
            </div>
          );
        }
        if (line.startsWith("[Tool result:")) {
          return (
            <div
              className="border border-primary/20 bg-primary/10 p-2 text-primary"
              key={i}
            >
              {line}
            </div>
          );
        }
        if (line.startsWith("[Step")) {
          const isToolCall = line.includes("Tool call:");
          const isToolResult = line.includes("Tool result:");
          return (
            <div
              className={cn(
                "border p-2",
                isToolCall && "border-blue-500/20 bg-blue-500/10 text-blue-400",
                isToolResult && "border-primary/20 bg-primary/10 text-primary",
                !(isToolCall || isToolResult) && "border-border bg-muted/30"
              )}
              key={i}
            >
              {line}
            </div>
          );
        }
        if (line.startsWith("[Agent complete")) {
          return (
            <div
              className="border border-primary/20 bg-primary/10 p-2 font-medium text-primary"
              key={i}
            >
              {line}
            </div>
          );
        }
        if (line.trim()) {
          return (
            <p className="text-foreground leading-relaxed" key={i}>
              {line}
            </p>
          );
        }
        return <div className="h-2" key={i} />;
      })}
    </div>
  );
}
