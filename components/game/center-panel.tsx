"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { LessonDescription } from "./lesson-description";
import { CodeEditor } from "./code-editor";
import { ActionBar } from "./action-bar";
import { ExplanationPanel } from "./explanation-panel";

export function CenterPanel() {
  return (
    <div className="flex h-full flex-col bg-background">
      {/* Lesson description */}
      <ScrollArea className="shrink-0 max-h-[35%] border-b border-border">
        <div className="p-4">
          <LessonDescription />
        </div>
      </ScrollArea>

      {/* Code editor */}
      <div className="flex-1 min-h-0">
        <CodeEditor />
      </div>

      {/* Explanation panel (conditional) */}
      <ExplanationPanel />

      {/* Action bar */}
      <ActionBar />
    </div>
  );
}
