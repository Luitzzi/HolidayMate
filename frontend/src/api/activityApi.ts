import type { ActivityUiDTO } from "../generated/interface-api.ts";
import { request } from "./apiClient.ts";

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
