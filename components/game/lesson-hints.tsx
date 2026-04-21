"use client";

import { ChevronDown, ExternalLink, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getLessonById } from "@/lib/lessons";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function LessonHints() {
  const { currentLessonId } = useGameStore();
  const lesson = getLessonById(currentLessonId);
  const [openHints, setOpenHints] = useState<Record<number, boolean>>({});

  if (!lesson?.hints || lesson.hints.length === 0) {
    return null;
  }

  const toggleHint = (index: number) => {
    setOpenHints((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="space-y-3 border-border border-t pt-4">
      {/* Header with docs link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <Lightbulb className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">Tips para resolver</span>
        </div>
        <Button
          className="h-7 gap-1.5 text-xs"
          nativeButton={false}
          render={
            <Link
              href={lesson.docsUrl}
              rel="noopener noreferrer"
              target="_blank"
            />
          }
          size="sm"
          variant="outline"
        >
          <ExternalLink className="h-3 w-3" />
          Ver Documentacion
        </Button>
      </div>

      {/* Hints accordion */}
      <div className="space-y-2">
        {lesson.hints.map((hint, index) => (
          <Collapsible
            key={index}
            onOpenChange={() => toggleHint(index)}
            open={openHints[index]}
          >
            <CollapsibleTrigger
              render={
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border border-border bg-secondary/50 px-3 py-2 text-left text-sm transition-colors hover:bg-secondary",
                    openHints[index] && "bg-secondary"
                  )}
                  type="button"
                />
              }
            >
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 font-mono text-primary text-xs">
                  {index + 1}
                </span>
                <span className="font-medium text-foreground text-xs">
                  {hint.title}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  openHints[index] && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-1 rounded-md border border-border bg-card px-3 py-2.5">
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {hint.content}
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
