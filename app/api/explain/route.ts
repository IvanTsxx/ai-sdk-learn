import { streamText } from "ai";

export async function POST(req: Request) {
  const { lessonTitle, solution, concept } = await req.json();

  const result = streamText({
    model: "anthropic/claude-3-5-haiku-20241022",
    system: `You are an expert teacher explaining Vercel AI SDK code to developers.
Be concise, practical, and focus on WHY — not just what the code does.
Use short paragraphs. No markdown headers. Max 200 words.
Always respond in Spanish.`,
    prompt: `Lesson: "${lessonTitle}"
Concept: ${concept}

Solution code:
${solution}

Explain this solution. Focus on the key concepts and why each piece matters.`,
  });

  return result.toUIMessageStreamResponse();
}
