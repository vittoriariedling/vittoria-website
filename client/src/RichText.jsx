import { Fragment } from 'react';

/** "**bold**" -> <strong>; everything else stays plain text (no HTML is ever injected). */
function inline(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => (
    part.startsWith('**') && part.endsWith('**') && part.length > 4
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  ));
}

/**
 * Newsletter text with light formatting: a blank line starts a new paragraph,
 * a single line break stays a line break, and **double asterisks** make bold.
 */
export default function RichText({ text }) {
  if (!text) return null;
  return text.trim().split(/\n\s*\n/).map((para, i) => (
    <p key={i}>
      {para.split('\n').map((line, j) => (
        <Fragment key={j}>{j > 0 && <br />}{inline(line)}</Fragment>
      ))}
    </p>
  ));
}
