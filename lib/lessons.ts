export type LessonLevel = "basic" | "intermediate" | "advanced";
export type LessonStatus = "locked" | "active" | "completed";

export interface TooltipData {
  description: string;
  term: string;
}

export interface Lesson {
  concept: string;
  description: string;
  fileContext: string;
  id: string;
  isStreaming: boolean;
  level: LessonLevel;
  simulatedOutput: string;
  solution: string;
  starterCode: string;
  title: string;
  tooltips: TooltipData[];
  validationPatterns: string[];
  xp: number;
}

export const lessons: Lesson[] = [
  // LEVEL 1 - BASIC
  {
    id: "lesson-1",
    title: "Tu primera llamada generateText",
    level: "basic",
    xp: 100,
    concept: "generateText, configuracion de modelo, destructuring de { text }",
    fileContext: "app/api/hello/route.ts",
    description: `En esta leccion aprenderas a hacer tu primera llamada al AI SDK usando \`generateText\`.

Esta funcion es el nucleo del SDK: hace una solicitud no-streaming a un LLM y devuelve el texto completo cuando termina.

Tu objetivo es:
1. Llamar a \`generateText\` con el modelo \`anthropic('claude-3-5-haiku-20241022')\`
2. Usar el prompt: "Say hello to a developer learning the AI SDK"
3. Retornar el texto en formato JSON`,
    starterCode: `import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function GET() {
  // TODO: Call generateText with:
  // - model: anthropic('claude-3-5-haiku-20241022')
  // - prompt: 'Say hello to a developer learning the AI SDK'

  // TODO: Return Response.json({ text })
}`,
    solution: `import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function GET() {
  const { text } = await generateText({
    model: anthropic('claude-3-5-haiku-20241022'),
    prompt: 'Say hello to a developer learning the AI SDK',
  })

  return Response.json({ text })
}`,
    validationPatterns: [
      "generateText",
      "anthropic(",
      "prompt:",
      "Response.json({ text })",
    ],
    simulatedOutput: JSON.stringify(
      {
        text: "Hello, developer! Welcome to the AI SDK — let's build something amazing together.",
      },
      null,
      2
    ),
    isStreaming: false,
    tooltips: [
      {
        term: "generateText",
        description:
          "Funcion principal del paquete 'ai'. Hace una solicitud no-streaming a un LLM y retorna el texto completo cuando termina.",
      },
      {
        term: "anthropic()",
        description:
          "Factory de proveedor de @ai-sdk/anthropic. Acepta un string de modelo y retorna un objeto modelo compatible con todas las funciones del AI SDK.",
      },
      {
        term: "{ text }",
        description:
          "Destructurado del resultado. generateText tambien retorna usage, finishReason, toolCalls, etc.",
      },
    ],
  },
  {
    id: "lesson-2",
    title: "Streaming con streamText",
    level: "basic",
    xp: 100,
    concept: "streamText, toDataStreamResponse(), Edge runtime",
    fileContext: "app/api/stream/route.ts",
    description: `Ahora aprenderas a usar \`streamText\` para enviar respuestas en tiempo real.

El streaming mejora drasticamente la UX porque el usuario ve la respuesta mientras se genera, en lugar de esperar a que termine.

Tu objetivo es:
1. Llamar a \`streamText\` con el modelo y prompt
2. Retornar \`result.toDataStreamResponse()\` para el protocolo de streaming del AI SDK`,
    starterCode: `import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  // TODO: Call streamText with:
  // - model: anthropic('claude-3-5-haiku-20241022')
  // - prompt

  // TODO: Return result.toDataStreamResponse()
}`,
    solution: `import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = streamText({
    model: anthropic('claude-3-5-haiku-20241022'),
    prompt,
  })

  return result.toDataStreamResponse()
}`,
    validationPatterns: [
      "streamText",
      "toDataStreamResponse",
      "runtime = 'edge'",
    ],
    simulatedOutput:
      "The Vercel AI SDK is a powerful TypeScript toolkit that lets you build AI-powered applications using a unified API across 100+ language models. It handles streaming, tool calling, structured output, and agent loops — all with full type safety.",
    isStreaming: true,
    tooltips: [
      {
        term: "streamText",
        description:
          "Como generateText pero retorna un ReadableStream de deltas de texto. Usalo para interfaces de chat donde quieres mostrar la respuesta mientras llega.",
      },
      {
        term: "toDataStreamResponse()",
        description:
          "Convierte el resultado de streamText en un objeto Response formateado para el protocolo de data stream del AI SDK — el formato que useChat espera en el cliente.",
      },
      {
        term: "runtime = 'edge'",
        description:
          "Ejecuta esta ruta en la Edge Network de Vercel en lugar de Node.js. Reduce el cold start de ~segundos a ~milisegundos. Recomendado para rutas de streaming.",
      },
    ],
  },
  // LEVEL 2 - INTERMEDIATE
  {
    id: "lesson-3",
    title: "useChat en el cliente",
    level: "intermediate",
    xp: 200,
    concept:
      "useChat, messages, input, handleInputChange, handleSubmit, status",
    fileContext: "app/chat/page.tsx",
    description: `Es hora de conectar el frontend. El hook \`useChat\` maneja todo el estado del chat automaticamente.

Gestiona mensajes, input, actualizaciones de streaming y manejo de errores para interfaces de chat.

Tu objetivo es:
1. Importar y usar \`useChat\` del paquete \`@ai-sdk/react\`
2. Destructurar messages, input, handleInputChange, handleSubmit y status
3. Renderizar los mensajes y un formulario funcional`,
    starterCode: `'use client'

// TODO: import useChat from '@ai-sdk/react'

export default function ChatPage() {
  // TODO: destructure { messages, input, handleInputChange, handleSubmit, status }
  // from useChat({ api: '/api/chat' })

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <div className="flex flex-col gap-2">
        {/* TODO: map over messages and render role + content */}
      </div>

      {/* TODO: render a form with onSubmit={handleSubmit}
          containing an input and a submit button
          disable input when status !== 'ready' */}
    </div>
  )
}`,
    solution: `'use client'

import { useChat } from '@ai-sdk/react'

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat',
  })

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <div className="flex flex-col gap-2">
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          disabled={status !== 'ready'}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message..."
        />
        <button type="submit" disabled={status !== 'ready'}>
          Send
        </button>
      </form>
    </div>
  )
}`,
    validationPatterns: [
      "useChat",
      "messages.map",
      "handleSubmit",
      "handleInputChange",
      "status !== 'ready'",
    ],
    simulatedOutput: `user: What is the AI SDK?
assistant: The Vercel AI SDK is a TypeScript toolkit for building AI-powered applications. It provides a unified interface for 100+ language models...

user: How do I stream responses?
assistant: Use streamText on the server and useChat on the client. The hook handles all the streaming protocol automatically...`,
    isStreaming: true,
    tooltips: [
      {
        term: "useChat",
        description:
          "Hook de React de @ai-sdk/react. Gestiona estado de mensajes, input, actualizaciones de streaming y manejo de errores para interfaces de chat. Se conecta a una ruta streamText.",
      },
      {
        term: "status",
        description:
          "Puede ser 'ready', 'streaming', 'submitted', o 'error'. Usalo para deshabilitar inputs mientras el modelo responde.",
      },
      {
        term: "messages",
        description:
          "Array de objetos UIMessage. Cada uno tiene id, role ('user' | 'assistant'), content, y parts (para contenido multi-modal en AI SDK 5+).",
      },
    ],
  },
  {
    id: "lesson-4",
    title: "Tool calling",
    level: "intermediate",
    xp: 200,
    concept: "tool(), inputSchema con Zod, execute, maxSteps",
    fileContext: "app/api/tools/route.ts",
    description: `Los tools permiten que el modelo ejecute funciones en tu servidor.

Define un tool con descripcion (para que el LLM sepa cuando usarlo), inputSchema (schema Zod para los argumentos), y execute (la funcion a ejecutar).

Tu objetivo es:
1. Crear un tool \`getWeather\` usando el helper \`tool()\`
2. Definir el inputSchema con Zod
3. Implementar la funcion execute`,
    starterCode: `import { streamText, tool } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: anthropic('claude-3-5-haiku-20241022'),
    messages,
    maxSteps: 5,
    tools: {
      // TODO: Add a 'getWeather' tool with:
      // description: 'Get the current weather for a city'
      // inputSchema: z.object({ city: z.string().describe('The city name') })
      // execute: async ({ city }) => ({ city, temperature: 22, condition: 'sunny' })
    },
  })

  return result.toDataStreamResponse()
}`,
    solution: `import { streamText, tool } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: anthropic('claude-3-5-haiku-20241022'),
    messages,
    maxSteps: 5,
    tools: {
      getWeather: tool({
        description: 'Get the current weather for a city',
        inputSchema: z.object({
          city: z.string().describe('The city name'),
        }),
        execute: async ({ city }) => ({
          city,
          temperature: 22,
          condition: 'sunny',
        }),
      }),
    },
  })

  return result.toDataStreamResponse()
}`,
    validationPatterns: [
      "tool(",
      "inputSchema:",
      "z.object(",
      "execute:",
      "maxSteps",
    ],
    simulatedOutput: `[Tool call: getWeather({ city: "Buenos Aires" })]
[Tool result: { city: "Buenos Aires", temperature: 22, condition: "sunny" }]

The weather in Buenos Aires is currently sunny with a temperature of 22°C.`,
    isStreaming: false,
    tooltips: [
      {
        term: "tool()",
        description:
          "Funcion helper que define un tool que el modelo puede llamar. Requiere description, inputSchema (schema Zod), y execute (funcion a ejecutar).",
      },
      {
        term: "inputSchema",
        description:
          "AI SDK v6 renombro 'parameters' a 'inputSchema'. Un schema Zod que valida y tipea los argumentos que el modelo pasa a tu tool.",
      },
      {
        term: "maxSteps",
        description:
          "Habilita tool calling multi-step. El modelo puede llamar tools, ver resultados, y continuar generando — hasta maxSteps iteraciones.",
      },
    ],
  },
  // LEVEL 3 - ADVANCED
  {
    id: "lesson-5",
    title: "Structured output con generateObject",
    level: "advanced",
    xp: 300,
    concept: "generateObject, schema con Zod, output tipado",
    fileContext: "app/api/extract/route.ts",
    description: `\`generateObject\` fuerza al modelo a retornar JSON estructurado segun tu schema Zod.

Perfecto para extraccion de datos, clasificacion, y generacion estructurada con tipos TypeScript completos.

Tu objetivo es:
1. Llamar a \`generateObject\` con un schema Zod
2. Extraer informacion de contacto del texto
3. Retornar el objeto estructurado`,
    starterCode: `import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

export async function POST(req: Request) {
  const { text } = await req.json()

  // TODO: Call generateObject with:
  // - model: anthropic('claude-3-5-haiku-20241022')
  // - schema: z.object({
  //     name: z.string(),
  //     email: z.string().email(),
  //     company: z.string().optional(),
  //   })
  // - prompt: \`Extract contact info from: \${text}\`

  // TODO: Return Response.json(object)
}`,
    solution: `import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

export async function POST(req: Request) {
  const { text } = await req.json()

  const { object } = await generateObject({
    model: anthropic('claude-3-5-haiku-20241022'),
    schema: z.object({
      name: z.string(),
      email: z.string().email(),
      company: z.string().optional(),
    }),
    prompt: \`Extract contact info from: \${text}\`,
  })

  return Response.json(object)
}`,
    validationPatterns: [
      "generateObject",
      "schema:",
      "z.object(",
      "z.string()",
      "{ object }",
    ],
    simulatedOutput: JSON.stringify(
      {
        name: "Ivan Bongiovanni",
        email: "ivan@noctis.dev",
        company: "Noctis",
      },
      null,
      2
    ),
    isStreaming: false,
    tooltips: [
      {
        term: "generateObject",
        description:
          "Como generateText pero fuerza al modelo a retornar un objeto JSON segun tu schema Zod. Perfecto para extraccion de datos y clasificacion.",
      },
      {
        term: "schema",
        description:
          "Un schema Zod que define la forma exacta del output. El SDK lo convierte a JSON Schema y lo pasa al modelo como formato de output.",
      },
      {
        term: "{ object }",
        description:
          "El resultado destructurado esta tipado exactamente como tu schema Zod — inferencia TypeScript completa. Tambien disponible: usage, finishReason, rawResponse.",
      },
    ],
  },
  {
    id: "lesson-6",
    title: "ToolLoopAgent (AI SDK v6)",
    level: "advanced",
    xp: 300,
    concept: "ToolLoopAgent, stopWhen, stepCountIs, generate()",
    fileContext: "app/api/agent/route.ts",
    description: `\`ToolLoopAgent\` es nuevo en AI SDK v6. Una clase que encapsula configuracion del modelo, tools, y logica del loop.

A diferencia del approach funcional, ToolLoopAgent es reutilizable entre rutas, background jobs, y endpoints sin repetir configuracion.

Tu objetivo es:
1. Crear un agente de investigacion con \`new ToolLoopAgent()\`
2. Configurar \`stopWhen\` con \`stepCountIs()\`
3. Usar \`researchAgent.generate()\` para ejecutarlo`,
    starterCode: `import { ToolLoopAgent, tool, stepCountIs } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

// TODO: Create a ToolLoopAgent called 'researchAgent' with:
// - model: anthropic('claude-3-5-haiku-20241022')
// - system: 'You are a research assistant. Use tools to gather information before answering.'
// - stopWhen: stepCountIs(10)
// - tools: {
//     search: tool({
//       description: 'Search for information on a topic',
//       inputSchema: z.object({ query: z.string() }),
//       execute: async ({ query }) => ({ results: [\`Result for: \${query}\`] })
//     })
//   }

export async function POST(req: Request) {
  const { prompt } = await req.json()

  // TODO: Call researchAgent.generate({ prompt })
  // TODO: Return Response.json({ text: result.text })
}`,
    solution: `import { ToolLoopAgent, tool, stepCountIs } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const researchAgent = new ToolLoopAgent({
  model: anthropic('claude-3-5-haiku-20241022'),
  system: 'You are a research assistant. Use tools to gather information before answering.',
  stopWhen: stepCountIs(10),
  tools: {
    search: tool({
      description: 'Search for information on a topic',
      inputSchema: z.object({ query: z.string() }),
      execute: async ({ query }) => ({ results: [\`Result for: \${query}\`] }),
    }),
  },
})

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = await researchAgent.generate({ prompt })

  return Response.json({ text: result.text })
}`,
    validationPatterns: [
      "ToolLoopAgent",
      "stopWhen",
      "stepCountIs(",
      "researchAgent.generate(",
      "new ToolLoopAgent(",
    ],
    simulatedOutput: `[Step 1] Tool call: search({ query: "Vercel AI SDK v6 features" })
[Step 1] Tool result: { results: ["Result for: Vercel AI SDK v6 features"] }

[Step 2] Tool call: search({ query: "ToolLoopAgent documentation" })
[Step 2] Tool result: { results: ["Result for: ToolLoopAgent documentation"] }

[Agent complete after 2 steps]

AI SDK v6 introduces the ToolLoopAgent class — a production-ready implementation that handles the complete tool execution loop automatically. Unlike the functional approach with stopWhen on streamText/generateText, ToolLoopAgent is reusable across routes, background jobs, and API endpoints without repeating configuration.`,
    isStreaming: false,
    tooltips: [
      {
        term: "ToolLoopAgent",
        description:
          "Nuevo en AI SDK v6. Una clase que encapsula config del modelo, tools, y logica del loop. Llama .generate() o .stream() para ejecutarlo.",
      },
      {
        term: "stopWhen",
        description:
          "Controla cuando termina el loop del agente. stepCountIs(n) para despues de n steps. Tambien puedes usar predicados custom.",
      },
      {
        term: "stepCountIs",
        description:
          "Utilidad importada de 'ai'. Retorna una condicion de parada que detiene el loop despues de exactamente n steps.",
      },
      {
        term: ".generate()",
        description:
          "Ejecuta el agente y retorna cuando completa. Usa .stream() si quieres recibir deltas de texto parciales mientras llegan.",
      },
    ],
  },
];

export const lessonsByLevel = {
  basic: lessons.filter((l) => l.level === "basic"),
  intermediate: lessons.filter((l) => l.level === "intermediate"),
  advanced: lessons.filter((l) => l.level === "advanced"),
};

export const levelNames: Record<LessonLevel, string> = {
  basic: "Basico",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

export const levelXp: Record<LessonLevel, number> = {
  basic: 100,
  intermediate: 200,
  advanced: 300,
};

export const totalXp = lessons.reduce((acc, l) => acc + l.xp, 0);

export function validateCode(
  userCode: string,
  patterns: string[]
): { pass: boolean; hint?: string } {
  const normalized = userCode.replace(/\s+/g, " ");
  for (const pattern of patterns) {
    if (!normalized.includes(pattern)) {
      return { pass: false, hint: `Falta: ${pattern}` };
    }
  }
  return { pass: true };
}

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}
