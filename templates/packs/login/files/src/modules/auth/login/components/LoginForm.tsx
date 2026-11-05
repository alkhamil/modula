import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  Alert,
  Button,
  Card,
  InputField,
} from '../../../../shared/components/ui';
import { authLinks } from '../auth-links';

interface LoginFormProps {
  username: string;
  password: string;
  error: string | null;
  submitting: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  testId?: string;
}

/** Kartu form kredensial login (username + password + tombol masuk). */
function LoginForm({
  username,
  password,
  error,
  submitting,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  testId = 'auth-login-form',
}: LoginFormProps) {
  const { t } = useTranslation();
  return (
    <Card title={t('auth.loginTitle')}>
      <form data-testid={testId} onSubmit={onSubmit} className="flex flex-col stack-gap">
        {error && <Alert variant="error" message={error} />}
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">{t('auth.username')}</label>
          <InputField
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="admin"
            maxLength={50}
            autoComplete="username"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">{t('auth.password')}</label>
          <InputField type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="••••••••"
            maxLength={100}
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? t('auth.processing') : t('auth.login')}
        </Button>
        {authLinks.length > 0 && (
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            {authLinks.map((link) => (
              <Link key={link.to} to={link.to} data-testid={link.testId} className="text-primary hover:underline">
                {t(link.labelKey)}
              </Link>
            ))}
          </div>
        )}
      </form>
    </Card>
  );
}

export default LoginForm;
