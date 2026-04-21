"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { LessonSidebar } from "./lesson-sidebar";
import { CenterPanel } from "./center-panel";
import { OutputPanel } from "./output-panel";

export function GameLayout() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left sidebar - Lesson list */}
        <ResizablePanel
          defaultSize={18}
          minSize={15}
          maxSize={25}
          className="min-w-[200px]"
        >
          <LessonSidebar />
        </ResizablePanel>

        <ResizableHandle />

        {/* Center panel - Content + Editor */}
        <ResizablePanel defaultSize={52} minSize={40}>
          <CenterPanel />
        </ResizablePanel>

        <ResizableHandle />

        {/* Right panel - Output */}
        <ResizablePanel
          defaultSize={30}
          minSize={20}
          maxSize={40}
          className="min-w-[250px]"
        >
          <OutputPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
