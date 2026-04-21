/** biome-ignore-all lint/performance/useTopLevelRegex: <> */
import { marked } from "marked";
import type { CSSProperties } from "react";
import { type ComponentProps, memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark as oneDarkStyle } from "react-syntax-highlighter/dist/esm/styles/prism";

const syntaxStyle = oneDarkStyle as unknown as {
  [key: string]: CSSProperties;
};

interface CodeProps extends ComponentProps<"code"> {
  inline?: boolean;
}

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => (
    <ReactMarkdown
      components={{
        code({ inline, className, children, style, ref, ...props }: CodeProps) {
          const match = /language-(\w+)/.exec(className || "");

          if (inline) {
            return (
              <code className="rounded bg-muted px-1 py-0.5 text-sm">
                {children}
              </code>
            );
          }

          return (
            <SyntaxHighlighter
              customStyle={{
                borderRadius: "0.5rem",
                padding: "1rem",
                fontSize: "0.85rem",
              }}
              language={match?.[1] || "ts"}
              PreTag="div"
              style={syntaxStyle}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  ),
  (prevProps, nextProps) => prevProps.content === nextProps.content
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
    ));
  }
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
