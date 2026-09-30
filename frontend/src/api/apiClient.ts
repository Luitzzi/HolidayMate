export const request = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    throw new Error(
      problem?.detail ?? `Request failed with status ${response.status}`,
    );
  }
  return (await response.json()) as T;
};
