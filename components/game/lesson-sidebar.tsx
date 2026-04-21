"use client";

import { Check, Lock, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

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

// ✅ se calcula una sola vez
const lessonIndexMap = Object.fromEntries(lessons.map((l, i) => [l.id, i + 1]));

export function LessonSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const {
    currentLessonId,
    totalXp: earnedXp,
    getLessonStatus,
    setCurrentLesson,
    getLevelProgress,
  } = useGameStore();

  const progressPercentage = Math.round((earnedXp / totalXp) * 100);

  return (
    <Sidebar {...props}>
      {/* HEADER */}
      <SidebarHeader>
        <div className="flex flex-col gap-3 p-2">
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
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        {levelOrder.map((level) => {
          const levelLessons = lessonsByLevel[level];
          const { completed, total } = getLevelProgress(level);

          return (
            <SidebarGroup key={level}>
              <SidebarGroupLabel className="flex items-center justify-between">
                <span className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
                  {levelNames[level]}
                </span>
                <Badge className="font-mono text-[10px]" variant="outline">
                  {completed}/{total}
                </Badge>
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {levelLessons.map((lesson) => {
                    const status = getLessonStatus(lesson.id);
                    const isActive = currentLessonId === lesson.id;
                    const lessonNumber = lessonIndexMap[lesson.id];

                    return (
                      <SidebarMenuItem key={lesson.id}>
                        <SidebarMenuButton
                          className="gap-2"
                          disabled={status === "locked"}
                          isActive={isActive}
                          onClick={() => setCurrentLesson(lesson.id)}
                        >
                          {/* ICON */}
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center border",
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

                          {/* TEXT */}
                          <div className="flex min-w-0 flex-col">
                            <span
                              className={cn(
                                "truncate font-medium",
                                status === "locked" &&
                                  "text-muted-foreground/50"
                              )}
                            >
                              {lessonNumber}. {lesson.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              +{lesson.xp} XP
                            </span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
