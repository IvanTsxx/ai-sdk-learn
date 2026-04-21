"use client";

import { Play, Eye, Sparkles, RotateCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useGameStore } from "@/lib/store";
import { getLessonById, validateCode } from "@/lib/lessons";
import { cn } from "@/lib/utils";

export function ActionBar() {
  const {
    currentLessonId,
    currentCode,
    validationResult,
    isRunning,
    showSolution,
    setCode,
    setValidationResult,
    setIsRunning,
    setSimulatedOutput,
    setShowSolution,
    completeLesson,
    resetLesson,
    setExplanation,
    setIsExplaining,
    setShowExplanation,
  } = useGameStore();

  const lesson = getLessonById(currentLessonId);

  if (!lesson) return null;

  const handleRun = async () => {
    setIsRunning(true);
    setSimulatedOutput(null);
    setValidationResult(null);

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 300));

    const result = validateCode(currentCode, lesson.validationPatterns);
    setValidationResult(result);

    if (result.pass) {
      setSimulatedOutput(lesson.simulatedOutput);
      completeLesson(lesson.id);
    }

    setIsRunning(false);
  };

  const handleShowSolution = () => {
    setCode(lesson.solution);
    setShowSolution(true);
  };

  const handleReset = () => {
    resetLesson(lesson.id);
  };

  const handleExplain = async () => {
    setExplanation("");
    setShowExplanation(true);
    setIsExplaining(true);

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonTitle: lesson.title,
          solution: lesson.solution,
          concept: lesson.concept,
        }),
      });

      if (!response.ok) throw new Error("Failed to get explanation");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader");

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data:")) {
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              // AI SDK 6 UIMessageStream format
              if (parsed.type === "text-delta" && parsed.delta) {
                useGameStore.getState().appendExplanation(parsed.delta);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Explanation error:", error);
      useGameStore
        .getState()
        .setExplanation("Error al generar la explicacion. Intenta de nuevo.");
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
      {/* Left: Validation result */}
      <div className="flex items-center gap-2">
        {validationResult && (
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium",
              validationResult.pass ? "text-primary" : "text-destructive"
            )}
          >
            {validationResult.pass ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Correcto</span>
              </>
            ) : (
              <>
                <X className="h-3.5 w-3.5" />
                <span>{validationResult.hint}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={isRunning}
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Reset
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isRunning || showSolution}>
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Solucion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ver solucion</DialogTitle>
              <DialogDescription>
                Estas seguro? Esto revelara la solucion completa y perderas la
                oportunidad de resolverlo por tu cuenta.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleShowSolution}>Mostrar solucion</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="ghost" size="sm" onClick={handleExplain}>
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          Explicar
        </Button>

        <Button size="sm" onClick={handleRun} disabled={isRunning}>
          <Play className="h-3.5 w-3.5 mr-1.5" />
          Run
        </Button>
      </div>
    </div>
  );
}
