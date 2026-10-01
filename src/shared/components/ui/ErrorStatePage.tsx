import { useNavigate } from 'react-router';
import { ErrorIcon, SearchIcon, WarningIcon } from '../icons';
import Button from './Button';

export type ErrorStateType = '403' | '404' | '500';

interface ErrorStateConfig {
  title: string;
  subtitle: string;
  testId: string;
  /** Tone medallion ikon. */
  tone: string;
  icon: typeof ErrorIcon;
  /** Aksi primer kontekstual. */
  primaryLabel: string;
}

const ERROR_STATE_CONFIG: Record<ErrorStateType, ErrorStateConfig> = {
  '403': {
    title: 'Akses Ditolak',
    subtitle:
      'Akun Anda tidak memiliki permission untuk membuka halaman ini. ' +
      'Hubungi administrator jika Anda merasa ini keliru.',
    testId: 'forbidden-page',
    tone: 'bg-warning/15 text-warning',
    icon: WarningIcon,
    primaryLabel: 'Ke Dashboard',
  },
  '404': {
    title: 'Halaman Tidak Ditemukan',
    subtitle:
      'Alamat yang Anda tuju tidak tersedia atau sudah dipindahkan. ' +
      'Periksa kembali URL atau kembali ke halaman utama.',
    testId: 'not-found-page',
    tone: 'bg-info/15 text-info',
    icon: SearchIcon,
    primaryLabel: 'Ke Dashboard',
  },
  '500': {
    title: 'Terjadi Kesalahan Sistem',
    subtitle:
      'Sesuatu bermasalah di sisi kami. Coba muat ulang halaman, ' +
      'atau hubungi administrator bila berlanjut.',
    testId: 'error-page',
    tone: 'bg-danger/15 text-danger',
    icon: ErrorIcon,
    primaryLabel: 'Coba Lagi',
  },
};

interface ErrorStatePageProps {
  type: ErrorStateType;
  className?: string;
  /** Override judul/subjudul bawaan. */
  title?: string;
  subtitle?: string;
  /** Tujuan aksi "Ke Dashboard" (default: `/`). */
  homePath?: string;
  /** Aksi tombol "Coba Lagi" untuk 500 (default: muat ulang halaman). */
  onRetry?: () => void;
  /** Sembunyikan seluruh tombol aksi. */
  hideActions?: boolean;
}

function ErrorStatePage({
  type,
  className,
  title,
  subtitle,
  homePath = '/',
  onRetry,
  hideActions = false,
}: ErrorStatePageProps) {
  const navigate = useNavigate();
  const config = ERROR_STATE_CONFIG[type];
  const Icon = config.icon;

  function handlePrimary() {
    if (type === '500') {
      if (onRetry) onRetry();
      else window.location.reload();
    } else {
      navigate(homePath);
    }
  }

  return (
    <div
      data-testid={config.testId}
      className={`flex min-h-full flex-col items-center justify-center px-6 py-16 text-center ${className ?? ''}`}
    >
      <div className={`flex h-20 w-20 items-center justify-center rounded-full ${config.tone}`}>
        <Icon className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-foreground">{title ?? config.title}</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {subtitle ?? config.subtitle}
      </p>
      <p className="mt-4 font-mono text-xs text-muted-foreground">Kode error: {type}</p>
      {!hideActions && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Kembali
          </Button>
          <Button onClick={handlePrimary}>{config.primaryLabel}</Button>
        </div>
      )}
    </div>
  );
}

export default ErrorStatePage;
