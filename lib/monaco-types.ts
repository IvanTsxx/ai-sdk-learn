// Type definitions for Monaco Editor to provide IntelliSense for AI SDK

export const aiSdkTypes = `
declare module 'ai' {
  export interface GenerateTextOptions {
    model: LanguageModel;
    prompt?: string;
    messages?: CoreMessage[];
    system?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    topK?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    stopSequences?: string[];
    seed?: number;
    maxRetries?: number;
    abortSignal?: AbortSignal;
    headers?: Record<string, string>;
    tools?: Record<string, Tool>;
    toolChoice?: ToolChoice;
    maxSteps?: number;
  }

  export interface GenerateTextResult {
    text: string;
    finishReason: FinishReason;
    usage: TokenUsage;
    toolCalls?: ToolCall[];
    toolResults?: ToolResult[];
    response?: Response;
    warnings?: Warning[];
  }

  export interface StreamTextOptions extends GenerateTextOptions {}

  export interface StreamTextResult {
    textStream: AsyncIterable<string>;
    fullStream: AsyncIterable<StreamPart>;
    toDataStreamResponse(options?: DataStreamOptions): Response;
    toTextStreamResponse(): Response;
    text: Promise<string>;
    finishReason: Promise<FinishReason>;
    usage: Promise<TokenUsage>;
    toolCalls: Promise<ToolCall[]>;
    toolResults: Promise<ToolResult[]>;
  }

  export interface GenerateObjectOptions<T> {
    model: LanguageModel;
    schema: import('zod').ZodType<T>;
    prompt?: string;
    messages?: CoreMessage[];
    system?: string;
    maxTokens?: number;
    temperature?: number;
    mode?: 'auto' | 'json' | 'tool';
    maxRetries?: number;
    abortSignal?: AbortSignal;
    headers?: Record<string, string>;
  }

  export interface GenerateObjectResult<T> {
    object: T;
    finishReason: FinishReason;
    usage: TokenUsage;
    warnings?: Warning[];
  }

  export interface ToolOptions<TInput, TOutput> {
    description: string;
    inputSchema: import('zod').ZodType<TInput>;
    execute: (input: TInput) => Promise<TOutput>;
  }

  export interface ToolLoopAgentOptions {
    model: LanguageModel;
    system?: string;
    tools?: Record<string, Tool>;
    stopWhen?: StopCondition;
    maxSteps?: number;
  }

  export class ToolLoopAgent {
    constructor(options: ToolLoopAgentOptions);
    generate(options: { prompt?: string; messages?: CoreMessage[] }): Promise<AgentResult>;
    stream(options: { prompt?: string; messages?: CoreMessage[] }): StreamingAgentResult;
  }

  export interface AgentResult {
    text: string;
    finishReason: FinishReason;
    usage: TokenUsage;
    steps: AgentStep[];
  }

  export interface AgentStep {
    text: string;
    toolCalls: ToolCall[];
    toolResults: ToolResult[];
  }

  export type FinishReason = 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other';

  export interface TokenUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  }

  export interface CoreMessage {
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string | MessagePart[];
  }

  export interface Tool<TInput = unknown, TOutput = unknown> {
    description: string;
    inputSchema: import('zod').ZodType<TInput>;
    execute?: (input: TInput) => Promise<TOutput>;
  }

  export interface ToolCall {
    toolCallId: string;
    toolName: string;
    args: unknown;
  }

  export interface ToolResult {
    toolCallId: string;
    toolName: string;
    result: unknown;
  }

  export type ToolChoice = 'auto' | 'none' | 'required' | { type: 'tool'; toolName: string };

  export type StopCondition = (state: AgentState) => boolean;

  export interface AgentState {
    steps: AgentStep[];
  }

  export interface LanguageModel {
    readonly specificationVersion: 'v1';
    readonly provider: string;
    readonly modelId: string;
  }

  export function generateText(options: GenerateTextOptions): Promise<GenerateTextResult>;
  export function streamText(options: StreamTextOptions): StreamTextResult;
  export function generateObject<T>(options: GenerateObjectOptions<T>): Promise<GenerateObjectResult<T>>;
  export function tool<TInput, TOutput>(options: ToolOptions<TInput, TOutput>): Tool<TInput, TOutput>;
  export function stepCountIs(count: number): StopCondition;
}

declare module '@ai-sdk/anthropic' {
  import type { LanguageModel } from 'ai';
  
  export interface AnthropicProvider {
    (modelId: string): LanguageModel;
    chat(modelId: string): LanguageModel;
    completion(modelId: string): LanguageModel;
  }

  export const anthropic: AnthropicProvider;
  export function createAnthropic(options?: { apiKey?: string; baseURL?: string }): AnthropicProvider;
}

declare module '@ai-sdk/openai' {
  import type { LanguageModel } from 'ai';
  
  export interface OpenAIProvider {
    (modelId: string): LanguageModel;
    chat(modelId: string): LanguageModel;
    completion(modelId: string): LanguageModel;
  }

  export const openai: OpenAIProvider;
  export function createOpenAI(options?: { apiKey?: string; baseURL?: string }): OpenAIProvider;
}

declare module '@ai-sdk/react' {
  export interface UseChatOptions {
    api?: string;
    id?: string;
    initialMessages?: UIMessage[];
    initialInput?: string;
    onResponse?: (response: Response) => void;
    onFinish?: (message: UIMessage) => void;
    onError?: (error: Error) => void;
    headers?: Record<string, string>;
    body?: Record<string, unknown>;
  }

  export interface UseChatReturn {
    messages: UIMessage[];
    input: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
    append: (message: Omit<UIMessage, 'id'>) => Promise<string | null | undefined>;
    reload: () => Promise<string | null | undefined>;
    stop: () => void;
    setMessages: (messages: UIMessage[]) => void;
    setInput: (input: string) => void;
    isLoading: boolean;
    status: 'ready' | 'streaming' | 'submitted' | 'error';
    error: Error | undefined;
  }

  export interface UIMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt?: Date;
  }

  export function useChat(options?: UseChatOptions): UseChatReturn;
  export function useCompletion(options?: UseCompletionOptions): UseCompletionReturn;
}

declare global {
  interface Response {
    json<T = unknown>(): Promise<T>;
    static json<T>(data: T, init?: ResponseInit): Response;
  }
}
`;

export const zodTypes = `
declare module 'zod' {
  export interface ZodType<T = unknown> {
    parse(data: unknown): T;
    safeParse(data: unknown): SafeParseResult<T>;
    optional(): ZodOptional<this>;
    nullable(): ZodNullable<this>;
    describe(description: string): this;
  }

  export interface ZodString extends ZodType<string> {
    email(): ZodString;
    url(): ZodString;
    uuid(): ZodString;
    min(length: number): ZodString;
    max(length: number): ZodString;
    length(length: number): ZodString;
    regex(regex: RegExp): ZodString;
    startsWith(prefix: string): ZodString;
    endsWith(suffix: string): ZodString;
    optional(): ZodOptional<ZodString>;
    describe(description: string): ZodString;
  }

  export interface ZodNumber extends ZodType<number> {
    min(value: number): ZodNumber;
    max(value: number): ZodNumber;
    int(): ZodNumber;
    positive(): ZodNumber;
    negative(): ZodNumber;
    optional(): ZodOptional<ZodNumber>;
    describe(description: string): ZodNumber;
  }

  export interface ZodBoolean extends ZodType<boolean> {
    optional(): ZodOptional<ZodBoolean>;
    describe(description: string): ZodBoolean;
  }

  export interface ZodObject<T extends Record<string, ZodType>> extends ZodType<{ [K in keyof T]: T[K] extends ZodType<infer U> ? U : never }> {
    shape: T;
    extend<U extends Record<string, ZodType>>(shape: U): ZodObject<T & U>;
    pick<K extends keyof T>(keys: K[]): ZodObject<Pick<T, K>>;
    omit<K extends keyof T>(keys: K[]): ZodObject<Omit<T, K>>;
    partial(): ZodObject<{ [K in keyof T]: ZodOptional<T[K]> }>;
    optional(): ZodOptional<this>;
    describe(description: string): this;
  }

  export interface ZodArray<T extends ZodType> extends ZodType<Array<T extends ZodType<infer U> ? U : never>> {
    min(length: number): ZodArray<T>;
    max(length: number): ZodArray<T>;
    length(length: number): ZodArray<T>;
    optional(): ZodOptional<ZodArray<T>>;
    describe(description: string): ZodArray<T>;
  }

  export interface ZodOptional<T extends ZodType> extends ZodType<T extends ZodType<infer U> ? U | undefined : undefined> {}
  export interface ZodNullable<T extends ZodType> extends ZodType<T extends ZodType<infer U> ? U | null : null> {}

  export interface SafeParseResult<T> {
    success: boolean;
    data?: T;
    error?: ZodError;
  }

  export interface ZodError {
    issues: ZodIssue[];
    message: string;
  }

  export interface ZodIssue {
    code: string;
    message: string;
    path: (string | number)[];
  }

  export const z: {
    string(): ZodString;
    number(): ZodNumber;
    boolean(): ZodBoolean;
    object<T extends Record<string, ZodType>>(shape: T): ZodObject<T>;
    array<T extends ZodType>(schema: T): ZodArray<T>;
    enum<T extends [string, ...string[]]>(values: T): ZodType<T[number]>;
    union<T extends [ZodType, ZodType, ...ZodType[]]>(types: T): ZodType<T[number] extends ZodType<infer U> ? U : never>;
    literal<T extends string | number | boolean>(value: T): ZodType<T>;
    any(): ZodType<unknown>;
    unknown(): ZodType<unknown>;
    never(): ZodType<never>;
    void(): ZodType<void>;
    null(): ZodType<null>;
    undefined(): ZodType<undefined>;
  };

  export { z as default };
}
`;
