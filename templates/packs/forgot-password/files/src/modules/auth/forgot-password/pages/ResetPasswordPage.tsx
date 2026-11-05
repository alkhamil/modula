import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Alert, Button, Card, InputField } from '../../../../shared/components/ui';
import { AuthLayout } from '../../login';
import { resetPassword } from '../api';

const MIN_PASSWORD_LENGTH = 6;

/** Form reset password: token dari query `?token=`. */
function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t('auth.passwordTooShort', { count: MIN_PASSWORD_LENGTH }));
      return;
    }
    if (password !== confirm) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (err) {
      setError(err instanceof Error ? t(err.message) : t('auth.requestFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <Card title={t('auth.resetPasswordTitle')}>
        <form data-testid="auth-reset-form" onSubmit={handleSubmit} className="flex flex-col stack-gap">
          {!token && <Alert variant="warning" message={t('auth.resetTokenInvalid')} />}
          {error && <Alert variant="error" message={error} />}
          {done && <Alert variant="success" message={t('auth.passwordUpdated')} />}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">{t('auth.newPassword')}</label>
            <InputField type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={100}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">{t('auth.confirmPassword')}</label>
            <InputField type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              maxLength={100}
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" disabled={submitting || !token || done} className="w-full">
            {submitting ? t('auth.processing') : t('auth.resetPassword')}
          </Button>
          <Link to="/login" className="text-center text-sm text-primary hover:underline">
            {t('auth.backToLogin')}
          </Link>
        </form>
      </Card>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
