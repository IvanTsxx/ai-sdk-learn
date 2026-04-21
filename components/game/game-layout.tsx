"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { CenterPanel } from "./center-panel";
import { LessonSidebar } from "./lesson-sidebar";
import { OutputPanel } from "./output-panel";

export function GameLayout() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <ResizablePanelGroup className="h-full" orientation="horizontal">
        {/* Left sidebar - Lesson list */}
        <ResizablePanel className="min-w-[200px]" defaultSize="20%">
          <LessonSidebar />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Center panel - Content + Editor */}
        <ResizablePanel defaultSize="60%">
          <CenterPanel />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right panel - Output */}
        <ResizablePanel className="min-w-[250px]" defaultSize="20%">
          <OutputPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
