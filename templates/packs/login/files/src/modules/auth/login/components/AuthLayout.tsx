import type { ReactNode } from 'react';

/** Pembungkus halaman auth publik (login, register, lupa password, dst.). */
function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
      <div className="flex w-full max-w-md flex-col stack-gap">{children}</div>
    </div>
  );
}

export default AuthLayout;
