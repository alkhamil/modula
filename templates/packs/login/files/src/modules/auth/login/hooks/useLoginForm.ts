import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../app/providers';
import { useLoginMutation } from '../api';
import { validateLoginInput } from '../validation/loginValidation';
// __LOGIN_FLOW_IMPORTS__

/** State + submit form login (mock-only lewat `api/resolver.ts`). */
export function useLoginForm() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const loginMutation = useLoginMutation();
  // __LOGIN_FLOW_HOOKS__
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    const invalidKey = validateLoginInput(username, password);
    if (invalidKey) {
      setError(t(invalidKey));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await loginMutation.mutateAsync({ username, password });
      // __LOGIN_FLOW_STEPS__
      signIn(result);
    } catch (err) {
      setError(err instanceof Error ? t(err.message) : t('auth.loginFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemoAccount(account: { username: string; password: string }) {
    setUsername(account.username);
    setPassword(account.password);
    setError(null);
  }

  return {
    username,
    password,
    error,
    submitting,
    setUsername,
    setPassword,
    handleSubmit,
    fillDemoAccount,
  };
}
