import { useRef, useState, type DragEvent } from 'react';
import { FieldErrorIcon } from '../../icons';

interface FileUploadFieldProps {
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: string;
  accept?: string;
  multiple?: boolean;
  value: File | File[] | null;
  onChange: (files: File | File[] | null) => void;
  className?: string;
  testId?: string;
}

const zoneSizeStyles: Record<string, string> = {
  sm: 'p-4 text-xs',
  md: 'p-6 text-sm',
  lg: 'p-8 text-base',
};

function FileUploadField({
  size = 'md',
  disabled = false,
  error,
  accept,
  multiple = false,
  value,
  onChange,
  className = '',
  testId,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = multiple ? Array.from(fileList) : fileList[0];
    onChange(multiple ? files : (files as File));
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (!disabled) setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
  }

  const hasFile = multiple ? (value as File[])?.length > 0 : !!value;

  function formatName(file: File) {
    return file.name.length > 30 ? file.name.slice(0, 27) + '...' : file.name;
  }

  return (
    <div data-testid={testId} className={className}>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={[
          'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
          error ? 'border-danger' : dragging ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground',
          disabled ? 'cursor-not-allowed bg-muted' : '',
          zoneSizeStyles[size],
        ].join(' ')}
      >
        {error && (
          <span className="absolute top-2 right-3">
            <FieldErrorIcon className="h-3.5 w-3.5" />
          </span>
        )}
        {hasFile ? (
          <div className="flex flex-col items-center gap-2">
            {multiple ? (
              (value as File[]).map((f, i) => (
                <span key={i} className="text-foreground">{formatName(f)}</span>
              ))
            ) : (
              <span className="text-foreground">{formatName(value as File)}</span>
            )}
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs font-medium text-danger hover:text-danger/80"
              >
                Remove
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            <span>Drop files or click to upload</span>
          </div>
        )}
      </div>
      <input
        data-testid={testId ? `${testId}-input` : undefined}
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      {error && (
        <p data-testid={testId ? `${testId}-error` : undefined} className="mt-1 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default FileUploadField;
