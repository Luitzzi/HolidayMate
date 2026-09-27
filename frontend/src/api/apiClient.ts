import type {
  ActivityUiDTO,
  CategoryUiDTO,
} from "../generated/interface-api.ts";

type ProblemDetail = {
  detail?: string;
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const problem = (await response
      .json()
      .catch(() => null)) as ProblemDetail | null;
    throw new Error(
      problem?.detail ?? `Request failed with status ${response.status}`,
    );
  }
  return (await response.json()) as T;
};

export const activityApi = {
  getAll: () => request<ActivityUiDTO[]>("/activities"),
  create: (activity: ActivityUiDTO) =>
    request<ActivityUiDTO>("/activities", {
      method: "POST",
      body: JSON.stringify(activity),
    }),
  update: (id: string, activity: ActivityUiDTO) =>
    request<ActivityUiDTO>(`/activities/${id}`, {
      method: "PUT",
      body: JSON.stringify(activity),
    }),
};

export const categoryApi = {
  getAll: () => request<CategoryUiDTO[]>("/categories"),
};
