import type { ReactElement, ReactNode } from "react";

type ReactElementWithProps = ReactElement<{
  children?: ReactNode;
  href?: string;
  src?: string;
  alt?: string;
  language?: string;
  className?: string;
}>;

/**
 * Extracts plain text content from a React node.
 * Recursively traverses React elements and their children to collect all text.
 */
export function extractTextFromReactNode(node: ReactNode): string {
  // Handle null, undefined, and booleans
  if (node == null || typeof node === "boolean") {
    return "";
  }

  // Handle strings and numbers directly
  if (typeof node === "string") {
    return node;
  }

  if (typeof node === "number") {
    return String(node);
  }

  // Handle arrays by recursively processing each item
  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).join("");
  }

  // Handle React elements (objects with type and props)
  if (typeof node === "object" && "props" in node) {
    const { children } = node.props as { children?: ReactNode };
    return extractTextFromReactNode(children);
  }

  return "";
}

/**
 * Converts a React node to markdown string.
 * Handles common HTML elements and converts them to markdown syntax.
 */
export function reactNodeToMarkdown(node: ReactNode): string {
  if (node == null || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string") {
    return node;
  }

  if (typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(reactNodeToMarkdown).join("");
  }

  if (typeof node === "object" && "type" in node && "props" in node) {
    const element = node as ReactElementWithProps;
    const { type, props } = element;
    const children = reactNodeToMarkdown(props.children);

    // Handle string element types (HTML elements)
    if (typeof type === "string") {
      switch (type) {
        // Headings
        case "h1":
          return `# ${children}\n\n`;
        case "h2":
          return `## ${children}\n\n`;
        case "h3":
          return `### ${children}\n\n`;
        case "h4":
          return `#### ${children}\n\n`;
        case "h5":
          return `##### ${children}\n\n`;
        case "h6":
          return `###### ${children}\n\n`;

        // Text formatting
        case "p":
          return `${children}\n\n`;
        case "strong":
        case "b":
          return `**${children}**`;
        case "em":
        case "i":
          return `*${children}*`;
        case "del":
        case "s":
          return `~~${children}~~`;
        case "code":
          return `\`${children}\``;

        // Links and images
        case "a":
          return `[${children}](${props.href ?? ""})`;
        case "img":
          return `![${props.alt ?? ""}](${props.src ?? ""})`;

        // Lists
        case "ul":
        case "ol":
          return `${children}\n`;
        case "li":
          return `- ${children}\n`;

        // Block elements
        case "blockquote":
          return children
            .split("\n")
            .map((line) => `> ${line}`)
            .join("\n") + "\n\n";
        case "pre":
          // Extract language from className if present (e.g., "language-js")
          const langMatch = props.className?.match(/language-(\w+)/);
          const lang = langMatch?.[1] ?? "";
          return `\`\`\`${lang}\n${extractTextFromReactNode(props.children)}\n\`\`\`\n\n`;
        case "hr":
          return "---\n\n";
        case "br":
          return "\n";

        // Container elements - just return children
        case "div":
        case "span":
        case "section":
        case "article":
        case "main":
        case "aside":
        case "header":
        case "footer":
        case "nav":
          return children;

        default:
          return children;
      }
    }

    // For component types (functions/classes), just process children
    return children;
  }

  return "";
}
