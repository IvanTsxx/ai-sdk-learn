"use client";

import { FileCode2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getLessonById, levelNames } from "@/lib/lessons";
import { useGameStore } from "@/lib/store";

export function LessonDescription() {
  const { currentLessonId } = useGameStore();
  const lesson = getLessonById(currentLessonId);

  if (!lesson) return null;

  // Parse description and add tooltips for terms
  const renderDescription = (text: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Find all code blocks (backtick wrapped)
    const codeRegex = /`([^`]+)`/g;
    let match;

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
            <TooltipTrigger asChild>
              <code className="cursor-help bg-muted px-1.5 py-0.5 font-mono text-xs text-primary border-b border-dashed border-primary/50">
                {term}
              </code>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs">{tooltipData.description}</p>
            </TooltipContent>
          </Tooltip>
        );
      } else {
        parts.push(
          <code
            key={`code-${match.index}`}
            className="bg-muted px-1.5 py-0.5 font-mono text-xs"
          >
            {term}
          </code>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key={`text-end`}>{text.slice(lastIndex)}</span>);
    }

    return parts;
  };

  const paragraphs = lesson.description.split("\n\n");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="font-mono text-[10px] uppercase">
              {levelNames[lesson.level]}
            </Badge>
            <Badge className="font-mono text-[10px]">+{lesson.xp} XP</Badge>
          </div>
          <h1 className="text-lg font-medium">{lesson.title}</h1>
        </div>
      </div>

      {/* File context */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <FileCode2 className="h-3.5 w-3.5" />
        <span className="font-mono">{lesson.fileContext}</span>
      </div>

      {/* Description */}
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{renderDescription(paragraph)}</p>
        ))}
      </div>

      {/* Concept */}
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">Conceptos:</span>
        {lesson.concept.split(", ").map((concept, i) => (
          <Badge key={i} variant="secondary" className="font-mono text-[10px]">
            {concept}
          </Badge>
        ))}
      </div>
    </div>
  );
}
