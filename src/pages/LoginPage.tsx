import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router';
import {
  Alert,
  Button,
  Card,
  PasswordField,
  TextField,
} from '../shared/components/ui';
import { getFirstAccessiblePath } from '../shared/utils';
import { navItems } from '../app/navigation';
import { demoAccounts, useAuth } from '../modules/auth';

function LoginPage() {
  const { isAuthenticated, permissions, login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={from ?? getFirstAccessiblePath(navItems, permissions)} replace />;
  }

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError('Username dan password wajib diisi.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await login({ username, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
      <div className="flex w-full max-w-md flex-col stack-gap">
        <Card title="Login">
          <form onSubmit={handleSubmit} className="flex flex-col stack-gap">
            {error && <Alert variant="error" message={error} />}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Username</label>
              <TextField
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                maxLength={50}
                autoComplete="username"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                maxLength={100}
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Memproses…' : 'Login'}
            </Button>
          </form>
        </Card>
        <Card title="Akun demo (mock)">
          <ul className="flex flex-col gap-2">
            {demoAccounts.map((account) => (
              <li key={account.username}>
                <button
                  type="button"
                  onClick={() => {
                    setUsername(account.username);
                    setPassword(account.password);
                    setError(null);
                  }}
                  title="Klik untuk isi otomatis"
                  className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-left transition-colors hover:border-primary"
                >
                  <span className="font-mono text-sm font-medium text-foreground">
                    {account.username} / {account.password}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {account.role} — {account.description}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
