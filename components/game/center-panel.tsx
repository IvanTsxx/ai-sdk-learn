"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { ActionBar } from "./action-bar";
import { CodeEditor } from "./code-editor";
import { ExplanationPanel } from "./explanation-panel";
import { LessonDescription } from "./lesson-description";

export function CenterPanel() {
  return (
    <div className="flex h-full flex-col bg-background">
      <ResizablePanel defaultSize="50%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="50%">
            {/* Lesson description */}
            <ScrollArea className="max-h-[35%] shrink-0 border-border border-b">
              <div className="p-4">
                <LessonDescription />
              </div>
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="50%">
            <CodeEditor />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>

      {/* Explanation panel (conditional) */}
      <ExplanationPanel />

      {/* Action bar */}
      <ActionBar />
    </div>
  );
}
