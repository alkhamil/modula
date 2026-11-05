import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate } from 'react-router';
import { Alert, Button, Card, InputField } from '../../../../shared/components/ui';
import { useAuth } from '../../../../app/providers';
import { AuthLayout } from '../../login';
import { DEMO_CODE, verifyCode } from '../api';
import { clearPendingSession, readPendingSession } from '../lib/pending';

/** Verifikasi kode 6 digit; sesi baru dibuat setelah kode benar. */
function TwoFactorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, signIn } = useAuth();
  const [pending] = useState(() => readPendingSession());
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;
  if (!pending) return <Navigate to="/login" replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError(t('auth.twoFactorFormat'));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await verifyCode(pending!.user.username, code);
      clearPendingSession();
      signIn(pending!);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? t(err.message) : t('auth.twoFactorFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <Card title={t('auth.twoFactorTitle')}>
        <form data-testid="auth-two-factor-form" onSubmit={handleSubmit} className="flex flex-col stack-gap">
          <p className="text-sm text-muted-foreground">{t('auth.twoFactorHint')}</p>
          <Alert variant="info" message={t('auth.twoFactorDemo', { code: DEMO_CODE })} />
          {error && <Alert variant="error" message={error} />}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">{t('auth.twoFactorCode')}</label>
            <InputField
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              placeholder="123456"
              maxLength={6}
              autoComplete="one-time-code"
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? t('auth.processing') : t('auth.twoFactorVerify')}
          </Button>
          <Link
            to="/login"
            onClick={clearPendingSession}
            className="text-center text-sm text-primary hover:underline"
          >
            {t('auth.backToLogin')}
          </Link>
        </form>
      </Card>
    </AuthLayout>
  );
}

export default TwoFactorPage;
