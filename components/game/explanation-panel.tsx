"use client";

import { Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameStore } from "@/lib/store";
import { MemoizedMarkdown } from "../memoized-markdown";

export function ExplanationPanel() {
  const { explanation, isExplaining, showExplanation, setShowExplanation } =
    useGameStore();

  if (!showExplanation) {
    return null;
  }

  return (
    <div className="border-border border-t bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-border border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs">Explicacion IA</span>
          {isExplaining && (
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          )}
        </div>
        <Button
          onClick={() => setShowExplanation(false)}
          size="icon-sm"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="h-48">
        <div className="p-4">
          {explanation ? (
            <MemoizedMarkdown content={explanation} id="explanation" />
          ) : isExplaining ? (
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Generando explicacion...</span>
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
}
