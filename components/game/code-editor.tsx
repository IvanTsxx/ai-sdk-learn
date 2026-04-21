"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useGameStore } from "@/lib/store";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#1e1e1e]">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

export function CodeEditor() {
  const { currentCode, setCode } = useGameStore();

  return (
    <div className="h-full min-h-0 w-full">
      <Editor
        defaultLanguage="typescript"
        height="100%"
        onChange={(val) => setCode(val ?? "")}
        options={{
          fontSize: 13,
          fontFamily: "Geist Mono, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          renderLineHighlight: "line",
          padding: { top: 12, bottom: 12 },
          tabSize: 2,
          automaticLayout: true,
          wordWrap: "on",
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          overviewRulerLanes: 0,
          guides: {
            indentation: true,
            bracketPairs: false,
          },
        }}
        theme="vs-dark"
        value={currentCode}
      />
    </div>
  );
}
