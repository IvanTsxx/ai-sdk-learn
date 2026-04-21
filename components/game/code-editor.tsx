"use client";

import type { Monaco } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import { aiSdkTypes, zodTypes } from "@/lib/monaco-types";
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

  const handleBeforeMount = useCallback((monaco: Monaco) => {
    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      strict: true,
      skipLibCheck: true,
      noEmit: true,
    });

    // Add AI SDK type definitions
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      aiSdkTypes,
      "file:///node_modules/@types/ai-sdk/index.d.ts"
    );

    // Add Zod type definitions
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      zodTypes,
      "file:///node_modules/@types/zod/index.d.ts"
    );

    // Enable better IntelliSense
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  }, []);

  return (
    <Editor
      beforeMount={handleBeforeMount}
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
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true,
        },
        suggestOnTriggerCharacters: true,
        parameterHints: {
          enabled: true,
        },
      }}
      theme="vs-dark"
      value={currentCode}
    />
  );
}
