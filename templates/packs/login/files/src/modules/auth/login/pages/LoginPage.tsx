import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../../../app/providers';
import { navItems } from '../../../../app/navigation';
import { getFirstAccessiblePath } from '../../../../shared/utils';
import { useLoginForm } from '../hooks';
import LoginForm from '../components/LoginForm';
import DemoAccountsCard from '../components/DemoAccountsCard';
import AuthLayout from '../components/AuthLayout';

/** Halaman login: redirect bila sudah auth, sonst form + akun demo. */
function LoginPage() {
  const { isAuthenticated, permissions } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const form = useLoginForm();

  if (isAuthenticated) {
    return <Navigate to={from ?? getFirstAccessiblePath(navItems, permissions)} replace />;
  }

  return (
    <AuthLayout>
      <LoginForm
        username={form.username}
        password={form.password}
        error={form.error}
        submitting={form.submitting}
        onUsernameChange={form.setUsername}
        onPasswordChange={form.setPassword}
        onSubmit={form.handleSubmit}
      />
      <DemoAccountsCard onSelect={form.fillDemoAccount} />
    </AuthLayout>
  );
}

export default LoginPage;
