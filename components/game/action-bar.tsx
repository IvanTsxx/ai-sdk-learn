"use client";

import { Check, Eye, Play, RotateCcw, Sparkles, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { MemoizedMarkdown } from "@/components/memoized-markdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getLessonById, validateCode } from "@/lib/lessons";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

export function ActionBar() {
  const ref = useRef<HTMLDivElement>(null);
  const {
    currentLessonId,
    currentCode,
    validationResult,
    isRunning,
    showSolution,
    showExplanation,
    explanation,

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
    setHasReexplained,
  } = useGameStore();

  const lesson = getLessonById(currentLessonId);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [explanation]);

  if (!lesson) {
    return null;
  }

  const handleRun = async () => {
    // Validar que el usuario haya modificado el codigo
    const normalizedCurrent = currentCode.replace(/\s+/g, " ").trim();
    const normalizedStarter = lesson.starterCode.replace(/\s+/g, " ").trim();

    if (normalizedCurrent === normalizedStarter) {
      setValidationResult({
        pass: false,
        hint: "Escribe tu solucion antes de ejecutar",
      });
      return;
    }

    // Verificar que no este vacio o solo tenga comentarios
    const codeWithoutComments = currentCode
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (codeWithoutComments.length < 50) {
      setValidationResult({
        pass: false,
        hint: "Completa los TODOs con tu implementacion",
      });
      return;
    }

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
    if (explanation !== "") {
      setShowExplanation(true);
      return;
    }
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

      if (!response.ok) {
        throw new Error("Failed to get explanation");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data:")) {
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") {
              continue;
            }
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

  const handleReexplain = async () => {
    setExplanation("");
    setHasReexplained(false);
    setShowExplanation(true);
    await handleExplain();
  };

  return (
    <div className="flex items-center justify-between border-border border-t bg-card px-4 py-3">
      {/* Left: Validation result */}
      <div className="flex items-center gap-2">
        {validationResult && (
          <div
            className={cn(
              "flex items-center gap-1.5 font-medium text-xs",
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
          disabled={isRunning}
          onClick={handleReset}
          size="sm"
          variant="ghost"
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset
        </Button>

        <Dialog>
          <DialogTrigger
            render={
              <Button
                disabled={isRunning || showSolution}
                size="sm"
                variant="ghost"
              />
            }
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            Solucion
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
              <DialogClose render={<Button variant="outline" />}>
                Cancelar
              </DialogClose>
              <DialogClose render={<Button onClick={handleShowSolution} />}>
                Mostrar solucion
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet onOpenChange={setShowExplanation} open={showExplanation}>
          <SheetTrigger
            render={
              <Button
                disabled={isRunning}
                onClick={handleExplain}
                size="sm"
                variant="ghost"
              />
            }
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            {explanation === "" ? "Explicar con IA" : "Explicacion"}
          </SheetTrigger>
          <SheetContent className="flex-1">
            <SheetHeader>
              <SheetTitle>Explicacion IA</SheetTitle>
              <SheetDescription>Explicacion de tu solucion</SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-200px)] w-full p-4">
              {explanation && (
                <div className="prose dark:prose-invert">
                  <MemoizedMarkdown content={explanation} id="explanation" />
                </div>
              )}
              <div ref={ref} />
            </ScrollArea>
            <SheetFooter>
              <Button onClick={handleReexplain}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Re-explicar
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Button disabled={isRunning} onClick={handleRun} size="sm">
          <Play className="mr-1.5 h-3.5 w-3.5" />
          Run
        </Button>
      </div>
    </div>
  );
}
