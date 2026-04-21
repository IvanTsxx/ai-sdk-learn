"use client";

import { FileCode2 } from "lucide-react";
import { LessonHints } from "@/components/game/lesson-hints";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getLessonById, levelNames } from "@/lib/lessons";
import { useGameStore } from "@/lib/store";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

export function LessonDescription() {
  const { currentLessonId } = useGameStore();
  const lesson = getLessonById(currentLessonId);

  if (!lesson) {
    return null;
  }

  // Parse description and add tooltips for terms
  const renderDescription = (text: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Find all code blocks (backtick wrapped)
    const codeRegex = /`([^`]+)`/g;
    let match: RegExpExecArray | null;

    // biome-ignore lint/suspicious/noAssignInExpressions: <This is a common pattern for iterating over regex matches>
    while ((match = codeRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.slice(lastIndex, match.index)}
          </span>
        );
      }

      const term = match[1];
      const tooltipData = lesson.tooltips.find(
        (t) => t.term === term || term.includes(t.term)
      );

      if (tooltipData) {
        parts.push(
          <Tooltip key={`tooltip-${match.index}`}>
            <TooltipTrigger
              render={
                <code className="cursor-help border-primary/50 border-b border-dashed bg-muted px-1.5 py-0.5 font-mono text-primary text-xs" />
              }
            >
              {term}
            </TooltipTrigger>
            <TooltipContent className="max-w-xs" side="top">
              <p className="text-xs">{tooltipData.description}</p>
            </TooltipContent>
          </Tooltip>
        );
      } else {
        parts.push(
          <code
            className="bg-muted px-1.5 py-0.5 font-mono text-xs"
            key={`code-${match.index}`}
          >
            {term}
          </code>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key={"text-end"}>{text.slice(lastIndex)}</span>);
    }

    return parts;
  };

  const paragraphs = lesson.description.split("\n\n");

  return (
    <div className="space-y-4">
      {/* Header */}

      <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
        <section className="flex flex-1 items-center">
          <SidebarTrigger />
          <Separator
            className="data-[orientation=vertical]:h-4"
            orientation="vertical"
          />
          <section className="flex items-start justify-between gap-4">
            <div className="mb-1 flex items-center gap-2">
              <Badge
                className="font-mono text-[10px] uppercase"
                variant="outline"
              >
                {levelNames[lesson.level]}
              </Badge>
              <Badge className="font-mono text-[10px]">+{lesson.xp} XP</Badge>
            </div>
            <h1 className="font-medium text-lg">{lesson.title}</h1>
          </section>
        </section>
      </header>

      {/* File context */}
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <FileCode2 className="h-3.5 w-3.5" />
        <span className="font-mono">{lesson.fileContext}</span>
      </div>

      {/* Description */}
      <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{renderDescription(paragraph)}</p>
        ))}
      </div>

      {/* Concept */}
      <div className="flex flex-wrap gap-1.5 border-border border-t pt-2">
        <span className="text-muted-foreground text-xs">Conceptos:</span>
        {lesson.concept.split(", ").map((concept, i) => (
          <Badge className="font-mono text-[10px]" key={i} variant="secondary">
            {concept}
          </Badge>
        ))}
      </div>

      {/* Hints */}
      <LessonHints />
    </div>
  );
}
