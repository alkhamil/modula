import type { ReactNode } from 'react';
import { assetUrl, projectConfig } from '../../../../app/project.config';

/**
 * Pembungkus halaman auth publik (login, register, lupa password, dst.).
 * Panel brand di kiri hanya tampil pada gaya tampilan yang memintanya (lihat `wds/styles.css`).
 */
function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="wds-auth">
      <aside className="wds-auth__brand" aria-hidden="true">
        {projectConfig.logo ? (
          <img src={assetUrl(projectConfig.logo)} alt="" className="wds-auth__logo" />
        ) : (
          <p className="wds-auth__brand-name">{projectConfig.name}</p>
        )}
      </aside>
      <main className="wds-auth__panel">
        <div className="flex w-full max-w-md flex-col stack-gap">{children}</div>
      </main>
    </div>
  );
}

export default AuthLayout;
