import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Alert, Button, Card, InputField } from '../../../../shared/components/ui';
import { AuthLayout } from '../../login';
import { register } from '../api';
import { validateRegisterInput } from '../validation/registerValidation';

/** Form pendaftaran akun baru. */
function RegisterPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const invalid = validateRegisterInput(form);
    if (invalid) {
      setError(t(invalid.key, invalid.params));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await register({ name: form.name, username: form.username, email: form.email, password: form.password });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? t(err.message) : t('auth.registerFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <Card title={t('auth.registerTitle')}>
        <form data-testid="auth-register-form" onSubmit={handleSubmit} className="flex flex-col stack-gap">
          {error && <Alert variant="error" message={error} />}
          {done && <Alert variant="success" message={t('auth.registerSuccess')} />}
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">{t('auth.fullName')}</label>
            <InputField value={form.name} onChange={(e) => update('name', e.target.value)} maxLength={100} autoComplete="name" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">{t('auth.username')}</label>
            <InputField value={form.username} onChange={(e) => update('username', e.target.value)} maxLength={50} autoComplete="username" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">{t('auth.email')}</label>
            <InputField type="email" value={form.email} onChange={(e) => update('email', e.target.value)} maxLength={100} autoComplete="email" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">{t('auth.password')}</label>
            <InputField type="password" value={form.password} onChange={(e) => update('password', e.target.value)} maxLength={100} autoComplete="new-password" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">{t('auth.confirmPassword')}</label>
            <InputField type="password" value={form.confirm} onChange={(e) => update('confirm', e.target.value)} maxLength={100} autoComplete="new-password" />
          </div>
          <Button type="submit" disabled={submitting || done} className="w-full">
            {submitting ? t('auth.processing') : t('auth.register')}
          </Button>
          <Link to="/login" data-testid="auth-register-login-link" className="text-center text-sm text-primary hover:underline">
            {t('auth.haveAccount')}
          </Link>
        </form>
      </Card>
    </AuthLayout>
  );
}

export default RegisterPage;
