import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../app/providers';
import { logout as logoutRequest } from '../api';

/**
 * Aksi logout untuk menu profil. Gagal request (mis. BE mati) tidak boleh
 * menghalangi pembersihan sesi lokal.
 */
export function useLogoutAction(): () => void {
  const { logout } = useAuth();
  const mutation = useMutation<void, unknown, void>({ mutationFn: () => logoutRequest() });
  return () => {
    void mutation
      .mutateAsync()
      .catch(() => {})
      .finally(logout);
  };
}
