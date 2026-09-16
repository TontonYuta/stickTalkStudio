import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
  inline?: boolean;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '', inline = false }) => {
  if (!text) return null;

  // If text has no math markers ($ or \), render directly
  if (!text.includes('$') && !text.includes('\\')) {
    return <span className={className}>{text}</span>;
  }

  // Parse text into regular text and LaTeX segments
  // Matches $$...$$ (display math) or $...$ (inline math)
  const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = mathRegex.exec(text)) !== null) {
    // Push preceding plain text
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const matchedStr = match[0];
    const isDisplay = matchedStr.startsWith('$$') && matchedStr.endsWith('$$');
    const formula = isDisplay 
      ? matchedStr.slice(2, -2).trim() 
      : matchedStr.slice(1, -1).trim();

    try {
      const html = katex.renderToString(formula, {
        displayMode: isDisplay,
        throwOnError: false,
        output: 'htmlAndMathml'
      });

      parts.push(
        <span 
          key={match.index}
          className={isDisplay ? "block my-1 text-center" : "inline-block align-middle mx-0.5"}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch (e) {
      parts.push(<span key={match.index} className="text-red-500 font-mono text-xs">{matchedStr}</span>);
    }

    lastIndex = match.index + matchedStr.length;
  }

  // Push remaining plain text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return (
    <span className={`${className} ${inline ? 'inline' : 'inline-block'}`}>
      {parts.length > 0 ? parts : text}
    </span>
  );
};
