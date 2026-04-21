import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type LessonLevel, type LessonStatus, lessons } from "./lessons";

interface LessonProgress {
  completedAt?: number;
  status: LessonStatus;
}

interface GameState {
  appendExplanation: (chunk: string) => void;
  completeLesson: (lessonId: string) => void;

  // Editor state
  currentCode: string;
  currentLessonId: string;

  // Explanation panel
  explanation: string;
  getCompletedLessonsCount: () => number;

  // Computed
  getLessonStatus: (lessonId: string) => LessonStatus;
  getLevelProgress: (level: LessonLevel) => {
    completed: number;
    total: number;
  };
  isExplaining: boolean;
  isLevelCompleted: (level: LessonLevel) => boolean;
  isRunning: boolean;
  // Progress tracking
  lessonProgress: Record<string, LessonProgress>;
  resetLesson: (lessonId: string) => void;
  resetProgress: () => void;
  setCode: (code: string) => void;

  // Actions
  setCurrentLesson: (lessonId: string) => void;
  setExplanation: (explanation: string) => void;
  setIsExplaining: (explaining: boolean) => void;
  setIsRunning: (running: boolean) => void;
  setShowExplanation: (show: boolean) => void;
  setShowSolution: (show: boolean) => void;
  setSimulatedOutput: (output: string | null) => void;
  setValidationResult: (
    result: { pass: boolean; hint?: string } | null
  ) => void;
  showExplanation: boolean;

  // UI state
  showSolution: boolean;
  simulatedOutput: string | null;
  totalXp: number;
  validationResult: { pass: boolean; hint?: string } | null;
}

const initialLessonProgress: Record<string, LessonProgress> = {};
lessons.forEach((lesson, index) => {
  initialLessonProgress[lesson.id] = {
    status: index === 0 ? "active" : "locked",
  };
});

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      lessonProgress: initialLessonProgress,
      totalXp: 0,
      currentLessonId: lessons[0].id,
      currentCode: lessons[0].starterCode,
      showSolution: false,
      validationResult: null,
      isRunning: false,
      simulatedOutput: null,
      explanation: "",
      isExplaining: false,
      showExplanation: false,

      // Actions
      setCurrentLesson: (lessonId) => {
        const lesson = lessons.find((l) => l.id === lessonId);
        if (!lesson) {
          return;
        }

        const status = get().getLessonStatus(lessonId);
        if (status === "locked") {
          return;
        }

        set({
          currentLessonId: lessonId,
          currentCode: lesson.starterCode,
          showSolution: false,
          validationResult: null,
          simulatedOutput: null,
          explanation: "",
          showExplanation: false,
        });
      },

      setCode: (code) => set({ currentCode: code }),

      completeLesson: (lessonId) => {
        const state = get();
        const lessonIndex = lessons.findIndex((l) => l.id === lessonId);
        const lesson = lessons[lessonIndex];

        if (!lesson) {
          return;
        }

        // Already completed
        if (state.lessonProgress[lessonId]?.status === "completed") {
          return;
        }

        const newProgress = { ...state.lessonProgress };
        newProgress[lessonId] = {
          status: "completed" as LessonStatus,
          completedAt: Date.now(),
        };

        // Unlock next lesson
        const nextLesson = lessons[lessonIndex + 1];
        if (nextLesson && newProgress[nextLesson.id]?.status === "locked") {
          newProgress[nextLesson.id] = { status: "active" };
        }

        set({
          lessonProgress: newProgress,
          totalXp: state.totalXp + lesson.xp,
        });
      },

      resetLesson: (lessonId) => {
        const lesson = lessons.find((l) => l.id === lessonId);
        if (!lesson) {
          return;
        }

        set({
          currentCode: lesson.starterCode,
          showSolution: false,
          validationResult: null,
          simulatedOutput: null,
        });
      },

      setShowSolution: (show) => set({ showSolution: show }),
      setValidationResult: (result) => set({ validationResult: result }),
      setIsRunning: (running) => set({ isRunning: running }),
      setSimulatedOutput: (output) => set({ simulatedOutput: output }),
      setExplanation: (explanation) => set({ explanation }),
      setIsExplaining: (explaining) => set({ isExplaining: explaining }),
      setShowExplanation: (show) => set({ showExplanation: show }),
      appendExplanation: (chunk) =>
        set((state) => ({ explanation: state.explanation + chunk })),

      resetProgress: () => {
        const freshProgress: Record<string, LessonProgress> = {};
        lessons.forEach((lesson, index) => {
          freshProgress[lesson.id] = {
            status: index === 0 ? "active" : "locked",
          };
        });

        set({
          lessonProgress: freshProgress,
          totalXp: 0,
          currentLessonId: lessons[0].id,
          currentCode: lessons[0].starterCode,
          showSolution: false,
          validationResult: null,
          simulatedOutput: null,
          explanation: "",
          showExplanation: false,
        });
      },

      // Computed getters
      getLessonStatus: (lessonId) =>
        get().lessonProgress[lessonId]?.status ?? "locked",

      getCompletedLessonsCount: () =>
        Object.values(get().lessonProgress).filter(
          (p) => p.status === "completed"
        ).length,

      getLevelProgress: (level) => {
        const levelLessons = lessons.filter((l) => l.level === level);
        const completed = levelLessons.filter(
          (l) => get().lessonProgress[l.id]?.status === "completed"
        ).length;
        return { completed, total: levelLessons.length };
      },

      isLevelCompleted: (level) => {
        const { completed, total } = get().getLevelProgress(level);
        return completed === total;
      },
    }),
    {
      name: "aisdk-quest-progress",
      partialize: (state) => ({
        lessonProgress: state.lessonProgress,
        totalXp: state.totalXp,
      }),
    }
  )
);
