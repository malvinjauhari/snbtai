import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

/**
 * Sanitizes AI-generated text to prevent raw formatting strings 
 * like \\n, \\, \n from leaking into the UI, while preserving valid math.
 */
export const sanitizeText = (text: string) => {
  if (!text) return '';
  // Replace literal '\n' string to actual newline
  let cleaned = text.replace(/\\n/g, '\n');
  
  // Replace literal '\r' string
  cleaned = cleaned.replace(/\\r/g, '');

  return cleaned;
};

// A helper to detect if a snippet is likely meant to be a math block
export const isMathRelevant = (str: string) => {
  return /\\(frac|sqrt|sum|int|infty|alpha|beta|theta|pi|partial|det|matrix|pmatrix|bmatrix|vmatrix)/i.test(str);
};

export const renderMath = (text: string) => {
  if (!text) return null;
  
  const sanitized = sanitizeText(text);

  const tokens: { type: 'text' | 'blockMath' | 'inlineMath', content: string }[] = [];
  
  let current = 0;
  while (current < sanitized.length) {
    if (sanitized.substring(current).startsWith('$$')) {
      const end = sanitized.indexOf('$$', current + 2);
      if (end !== -1) {
        tokens.push({ type: 'blockMath', content: sanitized.substring(current + 2, end) });
        current = end + 2;
        continue;
      }
    }
    if (sanitized.substring(current).startsWith('$')) {
      const end = sanitized.indexOf('$', current + 1);
      if (end !== -1) {
        tokens.push({ type: 'inlineMath', content: sanitized.substring(current + 1, end) });
        current = end + 1;
        continue;
      }
    }
    
    // Read text until next $ or $$
    const nextDollar = sanitized.indexOf('$', current);
    if (nextDollar !== -1) {
      tokens.push({ type: 'text', content: sanitized.substring(current, nextDollar) });
      current = nextDollar;
    } else {
      tokens.push({ type: 'text', content: sanitized.substring(current) });
      break;
    }
  }

  const blocks: React.ReactNode[] = [];
  let currentParagraphTokens: React.ReactNode[] = [];
  
  const flushParagraph = (key: string) => {
    if (currentParagraphTokens.length > 0) {
      blocks.push(
        <div key={key} className="mb-4 last:mb-0 leading-[1.8] text-slate-700 dark:text-slate-300 whitespace-pre-wrap tracking-wide font-medium">
          {currentParagraphTokens}
        </div>
      );
      currentParagraphTokens = [];
    }
  };

  tokens.forEach((token, tokenIndex) => {
    if (token.type === 'blockMath') {
      flushParagraph(`p-pre-block-${tokenIndex}`);
      blocks.push(
        <div key={`block-${tokenIndex}`} className="my-6 p-4 rounded-2xl bg-white dark:bg-slate-900/60 overflow-x-auto overflow-y-hidden text-center shadow-sm border border-slate-200/60 dark:border-slate-800">
          <BlockMath math={token.content.trim()} />
        </div>
      );
    } else if (token.type === 'inlineMath') {
      currentParagraphTokens.push(
        <InlineMath key={`inline-${tokenIndex}`} math={token.content.trim()} />
      );
    } else {
      let textContent = token.content;
      
      // Clean basic markdown
      textContent = textContent.replace(/\*\*(.*?)\*\*/g, '$1')
                               .replace(/\*(.*?)\*/g, '$1')
                               .replace(/__(.*?)__/g, '$1')
                               .replace(/\\\\ /g, '\n')
                               .replace(/\\\\/g, '\n')
                               .replace(/\\\n/g, '\n');

      // Smart transition words newline injection (if there are very few newlines)
      if ((textContent.match(/\n/g) || []).length < 2) {
        textContent = textContent.replace(/(\.)\s+(Untuk|Dari|Substitusi|Sehingga|Maka|Jadi|Dengan demikian|Selanjutnya|Langkah|Pertama|Kedua|Ketiga|Karena|Berdasarkan|Misalkan)/gi, '$1\n\n$2');
      }

      const lines = textContent.split(/\n+/);
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i] !== '') {
          currentParagraphTokens.push(
            <span key={`text-${tokenIndex}-${i}`}>{lines[i]}</span>
          );
        }
        
        if (i < lines.length - 1) {
          flushParagraph(`p-${tokenIndex}-${i}`);
        }
      }
    }
  });

  flushParagraph('p-final');
  
  return <div className="space-y-1">{blocks}</div>;
};
