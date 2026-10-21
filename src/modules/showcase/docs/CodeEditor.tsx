import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';
import { useEffect, useRef } from 'react';
import './code.css';

const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.tagName, t.angleBracket, t.operatorKeyword], color: 'var(--code-keyword)' },
  { tag: [t.attributeName, t.propertyName, t.definition(t.propertyName)], color: 'var(--code-attr)' },
  { tag: [t.string, t.special(t.string)], color: 'var(--code-string)' },
  { tag: [t.number, t.bool, t.null], color: 'var(--code-number)' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: 'var(--code-comment)', fontStyle: 'italic' },
  { tag: [t.punctuation, t.brace, t.bracket, t.operator], color: 'var(--code-punct)' },
  { tag: [t.className, t.typeName, t.function(t.variableName)], color: 'var(--code-type)' },
]);

const theme = (maxHeight: string) =>
  EditorView.theme({
    '&': {
      fontSize: '11px',
      backgroundColor: 'transparent',
      color: 'var(--theme-foreground)',
      maxHeight,
    },
    '&.cm-focused': { outline: '2px solid var(--wds-stroke-focus)', outlineOffset: '-2px' },
    '.cm-scroller': {
      overflow: 'auto',
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
      lineHeight: '1.65',
    },
    '.cm-content': { padding: '12px 0', caretColor: 'transparent' },
    '.cm-line': { padding: '0 16px 0 4px' },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: 'var(--theme-muted-foreground)',
      border: 'none',
      borderRight: '1px solid var(--theme-border)',
    },
    '.cm-gutterElement': { padding: '0 10px 0 14px', minWidth: '2.2em', opacity: '0.7' },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: 'color-mix(in srgb, var(--theme-primary) 22%, transparent)',
    },
  });

interface CodeEditorProps {
  code: string;
  /** Tinggi maksimum area kode (CSS); lebih dari itu discroll. */
  maxHeight: string;
  ariaLabel: string;
}

/** Editor kode read-only (CodeMirror 6): nomor baris, highlight JSX/TSX, scroll bila melebihi tinggi. */
function CodeEditor({ code, maxHeight, ariaLabel }: CodeEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!host.current) return;
    const editor = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: code,
        extensions: [
          lineNumbers(),
          javascript({ jsx: true, typescript: true }),
          syntaxHighlighting(highlight),
          EditorState.readOnly.of(true),
          EditorView.editable.of(false),
          // Tetap bisa difokus keyboard agar bisa di-scroll dengan panah/PageUp.
          EditorView.contentAttributes.of({ tabindex: '0', 'aria-label': ariaLabel }),
          theme(maxHeight),
        ],
      }),
    });
    view.current = editor;
    return () => {
      editor.destroy();
      view.current = null;
    };
    // `code` ditangani efek di bawah; editor dibuat ulang hanya saat tinggi berubah.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxHeight, ariaLabel]);

  useEffect(() => {
    const editor = view.current;
    if (editor && editor.state.doc.toString() !== code) {
      editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: code } });
    }
  }, [code]);

  return <div ref={host} data-testid="code-editor" />;
}

export default CodeEditor;
