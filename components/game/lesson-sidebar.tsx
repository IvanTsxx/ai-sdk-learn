"use client";

import { Check, Lock, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  type LessonLevel,
  lessons,
  lessonsByLevel,
  levelNames,
  totalXp,
} from "@/lib/lessons";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const levelOrder: LessonLevel[] = ["basic", "intermediate", "advanced"];

export function LessonSidebar() {
  const {
    currentLessonId,
    totalXp: earnedXp,
    getLessonStatus,
    setCurrentLesson,
    getLevelProgress,
  } = useGameStore();

  const progressPercentage = Math.round((earnedXp / totalXp) * 100);

  return (
    <div className="flex h-full flex-col border-border border-r bg-background">
      {/* Header */}
      <div className="flex flex-col gap-3 border-border border-b p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center bg-primary font-bold font-mono text-primary-foreground text-sm">
            AI
          </div>
          <span className="font-medium font-mono text-sm">SDK Quest</span>
        </div>
        <Progress value={progressPercentage}>
          <ProgressLabel>
            Progreso: {earnedXp} / {totalXp} XP
          </ProgressLabel>
          <ProgressValue />
        </Progress>
      </div>

      {/* Lesson list */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {levelOrder.map((level) => {
            const levelLessons = lessonsByLevel[level];
            const { completed, total } = getLevelProgress(level);

            return (
              <div className="mb-4" key={level}>
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
                    {levelNames[level]}
                  </span>
                  <Badge className="font-mono text-[10px]" variant="outline">
                    {completed}/{total}
                  </Badge>
                </div>

                <div className="flex flex-col gap-0.5">
                  {levelLessons.map((lesson) => {
                    const status = getLessonStatus(lesson.id);
                    const isActive = currentLessonId === lesson.id;
                    const lessonNumber =
                      lessons.findIndex((l) => l.id === lesson.id) + 1;

                    return (
                      <button
                        className={cn(
                          "group flex items-center gap-2 px-2 py-2 text-left text-xs transition-colors",
                          "hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-80",
                          isActive && "bg-muted"
                        )}
                        disabled={status === "locked"}
                        key={lesson.id}
                        onClick={() => setCurrentLesson(lesson.id)}
                        type="button"
                      >
                        <div
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center border",
                            status === "completed" &&
                              "border-primary bg-primary text-primary-foreground",
                            status === "active" &&
                              "border-primary text-primary",
                            status === "locked" &&
                              "border-muted-foreground/30 text-muted-foreground/30"
                          )}
                        >
                          {status === "completed" ? (
                            <Check className="h-3 w-3" />
                          ) : status === "locked" ? (
                            <Lock className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span
                            className={cn(
                              "truncate font-medium",
                              status === "locked" && "text-muted-foreground/50"
                            )}
                          >
                            {lessonNumber}. {lesson.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            +{lesson.xp} XP
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
