import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Alert, Button, Card, InputField } from '../../../../shared/components/ui';
import { AuthLayout } from '../../login';
import { requestReset } from '../api';

/** Form lupa password: kirim tautan reset ke email. */
function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [demoToken, setDemoToken] = useState<string | undefined>();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) {
      setError(t('auth.emailRequired'));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await requestReset(email.trim());
      setDemoToken(result.demoToken);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? t(err.message) : t('auth.requestFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <Card title={t('auth.forgotPasswordTitle')}>
        <form data-testid="auth-forgot-form" onSubmit={handleSubmit} className="flex flex-col stack-gap">
          <p className="text-sm text-muted-foreground">{t('auth.forgotPasswordHint')}</p>
          {error && <Alert variant="error" message={error} />}
          {sent && <Alert variant="success" message={t('auth.resetLinkSent')} />}
          {sent && demoToken && (
            <p className="text-sm">
              <Link
                to={`/reset-password?token=${demoToken}`}
                data-testid="auth-reset-demo-link"
                className="text-primary hover:underline"
              >
                {t('auth.openResetDemo')}
              </Link>
            </p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">{t('auth.email')}</label>
            <InputField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              maxLength={100}
              autoComplete="email"
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? t('auth.processing') : t('auth.sendResetLink')}
          </Button>
          <Link to="/login" className="text-center text-sm text-primary hover:underline">
            {t('auth.backToLogin')}
          </Link>
        </form>
      </Card>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
