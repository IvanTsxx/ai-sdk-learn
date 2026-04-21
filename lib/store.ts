import { create } from "zustand";
import { persist } from "zustand/middleware";
import { lessons, type LessonStatus, type LessonLevel } from "./lessons";

interface LessonProgress {
  status: LessonStatus;
  completedAt?: number;
}

interface GameState {
  // Progress tracking
  lessonProgress: Record<string, LessonProgress>;
  totalXp: number;
  currentLessonId: string;
  
  // Editor state
  currentCode: string;
  
  // UI state
  showSolution: boolean;
  validationResult: { pass: boolean; hint?: string } | null;
  isRunning: boolean;
  simulatedOutput: string | null;
  
  // Explanation panel
  explanation: string;
  isExplaining: boolean;
  showExplanation: boolean;
  
  // Actions
  setCurrentLesson: (lessonId: string) => void;
  setCode: (code: string) => void;
  completeLesson: (lessonId: string) => void;
  resetLesson: (lessonId: string) => void;
  setShowSolution: (show: boolean) => void;
  setValidationResult: (result: { pass: boolean; hint?: string } | null) => void;
  setIsRunning: (running: boolean) => void;
  setSimulatedOutput: (output: string | null) => void;
  setExplanation: (explanation: string) => void;
  setIsExplaining: (explaining: boolean) => void;
  setShowExplanation: (show: boolean) => void;
  appendExplanation: (chunk: string) => void;
  resetProgress: () => void;
  
  // Computed
  getLessonStatus: (lessonId: string) => LessonStatus;
  getCompletedLessonsCount: () => number;
  getLevelProgress: (level: LessonLevel) => { completed: number; total: number };
  isLevelCompleted: (level: LessonLevel) => boolean;
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
        if (!lesson) return;
        
        const status = get().getLessonStatus(lessonId);
        if (status === "locked") return;
        
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
        
        if (!lesson) return;
        
        // Already completed
        if (state.lessonProgress[lessonId]?.status === "completed") return;
        
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
        if (!lesson) return;
        
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
      getLessonStatus: (lessonId) => {
        return get().lessonProgress[lessonId]?.status ?? "locked";
      },

      getCompletedLessonsCount: () => {
        return Object.values(get().lessonProgress).filter(
          (p) => p.status === "completed"
        ).length;
      },

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
