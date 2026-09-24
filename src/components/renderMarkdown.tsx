import { Fragment, type ReactNode } from "react";

type TextRenderer = (text: string) => ReactNode;

type Rule = {
  type: string;
  regex: RegExp;
};

// Yazıda aranacak biçimler (sıra önemli)
const inlineRules: Rule[] = [
  { type: "code", regex: /`([^`\n]+)`/ },
  { type: "link", regex: /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/ },
  { type: "boldItalic", regex: /\*\*\*([\s\S]+?)\*\*\*/ },
  { type: "bold", regex: /\*\*([\s\S]+?)\*\*/ },
  { type: "underline", regex: /__([\s\S]+?)__/ },
  { type: "strike", regex: /~~([\s\S]+?)~~/ },
  { type: "italicStar", regex: /\*([^*\n]+?)\*/ },
  { type: "italicUnderscore", regex: /(?<!\w)_([^_\n]+?)_(?!\w)/ },
];

const plainText: TextRenderer = (text) => text;

function renderInline(
  text: string,
  renderText: TextRenderer,
  keyPrefix: string
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let counter = 0;

  while (rest.length > 0) {
    // Kalan yazıda en başta görünen biçimi bul
    let best: { rule: Rule; match: RegExpExecArray } | null = null;

    for (const rule of inlineRules) {
      const match = rule.regex.exec(rest);

      if (match && (best === null || match.index < best.match.index)) {
        best = { rule, match };
      }
    }

    // Hiç biçim kalmadıysa geri kalanı düz yazı olarak ekle
    if (best === null) {
      nodes.push(
        <Fragment key={`${keyPrefix}-${counter++}`}>
          {renderText(rest)}
        </Fragment>
      );
      break;
    }

    const { rule, match } = best;

    // Biçimden önceki düz yazı
    if (match.index > 0) {
      nodes.push(
        <Fragment key={`${keyPrefix}-${counter++}`}>
          {renderText(rest.slice(0, match.index))}
        </Fragment>
      );
    }

    const key = `${keyPrefix}-${counter++}`;
    const inner = () => renderInline(match[1], renderText, key);

    switch (rule.type) {
      case "code":
        nodes.push(
          <code
            key={key}
            className="rounded bg-[#1e1f22] px-1 py-0.5 font-mono text-[0.85em]"
          >
            {match[1]}
          </code>
        );
        break;

      case "link":
        nodes.push(
          <a
            key={key}
            href={match[2]}
            target="_blank"
            rel="noreferrer"
            className="text-[#00A8FC] hover:underline"
          >
            {inner()}
          </a>
        );

        break;

      case "boldItalic":
        nodes.push(
          <strong key={key}>
            <em>{inner()}</em>
          </strong>
        );
        break;

      case "bold":
        nodes.push(<strong key={key}>{inner()}</strong>);
        break;

      case "underline":
        nodes.push(<u key={key}>{inner()}</u>);
        break;

      case "strike":
        nodes.push(<s key={key}>{inner()}</s>);
        break;

      default:
        nodes.push(<em key={key}>{inner()}</em>);
        break;
    }

    // Biçimden sonrasına geç
    rest = rest.slice(match.index + match[0].length);
  }

  return nodes;
}

export function renderMarkdown(
  text: string,
  renderText: TextRenderer = plainText
): ReactNode[] {
  const nodes: ReactNode[] = [];
  const codeBlockRegex = /```(?:[a-zA-Z0-9_+-]*\n)?([\s\S]*?)```/g;

  let lastIndex = 0;
  let counter = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Kod bloğundan önceki normal yazı
    if (match.index > lastIndex) {
      nodes.push(
        ...renderInline(
          text.slice(lastIndex, match.index),
          renderText,
          `t${counter++}`
        )
      );
    }

    // Kod bloğunun kendisi
    nodes.push(
      <pre
        key={`block-${counter++}`}
        className="my-1 overflow-x-auto whitespace-pre-wrap rounded-md border border-[#1e1f22] bg-[#1e1f22] p-2 font-mono text-sm"
      >
        <code>{match[1].replace(/\n$/, "")}</code>
      </pre>
    );

    lastIndex = match.index + match[0].length;
  }


  if (lastIndex < text.length) {
    nodes.push(
      ...renderInline(text.slice(lastIndex), renderText, `t${counter++}`)
    );
  }

  return nodes;
}