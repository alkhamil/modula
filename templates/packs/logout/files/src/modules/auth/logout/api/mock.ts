/** Saklar sumber data logout: `true` = mock lokal tanpa backend. */
export const USE_MOCK = {
  logout: true,
};

export async function mockLogout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
}
