"use client";

import { useEffect, useState, useRef } from "react";
import { Terminal, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameStore } from "@/lib/store";
import { getLessonById } from "@/lib/lessons";
import { cn } from "@/lib/utils";

export function OutputPanel() {
  const { currentLessonId, simulatedOutput, isRunning } = useGameStore();
  const lesson = getLessonById(currentLessonId);
  const [displayedText, setDisplayedText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Animate streaming output
  useEffect(() => {
    if (!simulatedOutput || !lesson) {
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
    <div className="flex h-full flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Terminal className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-xs text-muted-foreground">Output</span>
        {(isRunning || isAnimating) && (
          <Loader2 className="ml-auto h-3 w-3 animate-spin text-primary" />
        )}
      </div>

      {/* Output content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {!simulatedOutput && !isRunning ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-2 h-10 w-10 border border-dashed border-muted-foreground/30 flex items-center justify-center">
                <Terminal className="h-5 w-5 text-muted-foreground/30" />
              </div>
              <p className="text-xs text-muted-foreground">
                Haz clic en &quot;Run&quot; para ver el output
              </p>
            </div>
          ) : isRunning && !displayedText ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Ejecutando...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {hasToolCall ? (
                <ToolCallOutput text={displayedText} />
              ) : isJson ? (
                <pre className="font-mono text-xs text-foreground whitespace-pre-wrap bg-muted/30 p-3 border border-border overflow-auto">
                  {displayedText}
                </pre>
              ) : (
                <div className="font-mono text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                  {displayedText}
                  {isAnimating && lesson?.isStreaming && (
                    <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse" />
                  )}
                </div>
              )}
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
              key={i}
              className="bg-blue-500/10 border border-blue-500/20 p-2 text-blue-400"
            >
              {line}
            </div>
          );
        }
        if (line.startsWith("[Tool result:")) {
          return (
            <div
              key={i}
              className="bg-primary/10 border border-primary/20 p-2 text-primary"
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
              key={i}
              className={cn(
                "p-2 border",
                isToolCall && "bg-blue-500/10 border-blue-500/20 text-blue-400",
                isToolResult && "bg-primary/10 border-primary/20 text-primary",
                !isToolCall && !isToolResult && "bg-muted/30 border-border"
              )}
            >
              {line}
            </div>
          );
        }
        if (line.startsWith("[Agent complete")) {
          return (
            <div
              key={i}
              className="bg-primary/10 border border-primary/20 p-2 text-primary font-medium"
            >
              {line}
            </div>
          );
        }
        if (line.trim()) {
          return (
            <p key={i} className="text-foreground leading-relaxed">
              {line}
            </p>
          );
        }
        return <div key={i} className="h-2" />;
      })}
    </div>
  );
}
