import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button, InputField, Alert, Badge } from '../../../shared/components/ui';
import { useAuth } from '../../../app/providers/useAuth';
import { loginWithApi } from '../authApi';
import { SEED_ACCOUNTS, type DemoSeedAccount } from '../types';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('superadmin@modula.io');
  const [password, setPassword] = useState('modula123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | undefined)?.from || '/';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Harap isi alamat email dan kata sandi');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await loginWithApi(email, password);
      signIn({
        token: res.token,
        user: res.user,
        permissions: res.user.permissions,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal masuk ke sistem');
    } finally {
      setLoading(false);
    }
  }

  function handleSelectSeed(account: DemoSeedAccount) {
    setEmail(account.email);
    setPassword('modula123');
    setError(null);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-xl flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-sm">
            M
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Modula 2.0
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Modular Mockup Generator & Development Platform
          </p>
        </div>

        {/* Main Login Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex flex-col">
            <h2 className="text-lg font-bold text-foreground">Masuk Akun Internal</h2>
            <p className="text-xs text-muted-foreground">
              Gunakan akun internal terdaftar untuk mengakses workspace proyek.
            </p>
          </div>

          {error && (
            <div className="mb-4">
              <Alert variant="error" message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Alamat Email</label>
              <InputField
                type="email"
                placeholder="nama@modula.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Kata Sandi</label>
              <InputField
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full mt-1">
              {loading ? 'Memverifikasi...' : 'Masuk ke Platform'}
            </Button>
          </form>

          {/* 1-Click Account Switcher for Testing / Demonstration */}
          <div className="mt-6 border-t border-border pt-5">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Pilih Role Akun Internal (1-Click Test):
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                PW: modula123
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SEED_ACCOUNTS.map((acc) => {
                const isSelected = email === acc.email;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleSelectSeed(acc)}
                    className={`flex flex-col items-start gap-1 rounded-xl border p-2.5 text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-surface hover:border-primary/50 hover:bg-surface/80'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {acc.name}
                      </span>
                      <Badge
                        variant={
                          acc.role === 'SUPER_ADMIN' || acc.role === 'ADMIN'
                            ? 'primary'
                            : acc.role === 'DEVELOPER'
                              ? 'info'
                              : acc.role === 'QA'
                                ? 'warning'
                                : 'neutral'
                        }
                        size="xs"
                      >
                        {acc.role}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">
                      {acc.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground">
          Platform internal Modula · Build Once, Reuse Everywhere, Deliver Faster
        </p>
      </div>
    </div>
  );
}
