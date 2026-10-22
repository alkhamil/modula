import { lazy, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from '../../../shared/components/icons';

// Editor (CodeMirror) dimuat lazy supaya tidak masuk bundel utama.
const CodeEditor = lazy(() => import('./CodeEditor'));

interface CodeBlockProps {
  code: string;
  language?: string;
  /** Tanpa border/radius (dipakai di dalam kartu lain). */
  flush?: boolean;
  /** Tinggi maksimum area kode; lebih dari itu discroll (default 20rem). */
  maxHeight?: string;
  /** Tinggi tetap area kode (tidak ikut panjang kode); scroll di dalam. */
  height?: string;
}

/** Blok kode bergaya editor: bilah bahasa + salin, nomor baris, syntax highlight, tinggi maksimum. */
function CodeBlock({ code, language = 'tsx', flush = false, maxHeight = '20rem', height }: CodeBlockProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className={['overflow-hidden bg-surface', flush ? '' : 'rounded-xl border border-border'].join(' ')}>
      <div className="flex items-center justify-between border-b border-border px-4 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{language}</span>
        <button
          type="button"
          onClick={copy}
          className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {copied && <Check className="h-3.5 w-3.5 text-success" />}
          {copied ? t('docs.code.copied') : t('docs.code.copy')}
        </button>
      </div>
      <div style={height ? { height } : undefined}>
        <Suspense
          fallback={
            <pre
              style={height ? { height } : { maxHeight }}
              className="overflow-auto px-4 py-3 font-mono text-[11px] leading-relaxed text-foreground"
            >
              <code>{code}</code>
            </pre>
          }
        >
          <CodeEditor code={code} maxHeight={maxHeight} fill={Boolean(height)} ariaLabel={t('docs.code.readOnly')} />
        </Suspense>
      </div>
    </div>
  );
}

export default CodeBlock;
