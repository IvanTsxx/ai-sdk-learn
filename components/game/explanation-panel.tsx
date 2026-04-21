"use client";

import { X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameStore } from "@/lib/store";

export function ExplanationPanel() {
  const { explanation, isExplaining, showExplanation, setShowExplanation } =
    useGameStore();

  if (!showExplanation) return null;

  return (
    <div className="border-t border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs">Explicacion IA</span>
          {isExplaining && (
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setShowExplanation(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="h-48">
        <div className="p-4">
          {explanation ? (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {explanation}
              {isExplaining && (
                <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse" />
              )}
            </p>
          ) : isExplaining ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Generando explicacion...</span>
            </div>
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
}
