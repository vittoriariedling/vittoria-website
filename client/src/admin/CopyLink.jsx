import { useRef, useState } from 'react';

/** A read-only link with a Copy button. */
export default function CopyLink({ url, label = 'Link' }) {
  const input = useRef(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API unavailable: select the text so it can be copied manually.
      input.current?.select();
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="copy-link">
      <input ref={input} className="admin-input copy-link-input" value={url} readOnly aria-label={label}
             onFocus={(e) => e.target.select()} />
      <button type="button" className="admin-btn admin-btn-primary" onClick={copy}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
