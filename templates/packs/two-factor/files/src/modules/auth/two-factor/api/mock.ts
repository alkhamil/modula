/** Saklar sumber data: `true` = mock lokal tanpa backend. */
export const USE_MOCK = {
  verify: true,
};

/** Kode demo mock — pada backend nyata kode datang dari authenticator/SMS. */
export const DEMO_CODE = '123456';

export async function mockVerifyCode(_username: string, code: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (code !== DEMO_CODE) throw new Error('auth.twoFactorInvalid');
}
