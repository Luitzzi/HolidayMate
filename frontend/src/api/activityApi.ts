import type { ActivityUiDTO } from "../generated/interface-api.ts";
import { buildURL } from "./utils/urlBuilder.ts";
import { get, post, put } from "./utils/fetch.ts";

const basePath = "activities";

const getAllActivities = () => {
  const requestUrl = buildURL(basePath);
  return get<ActivityUiDTO[]>(requestUrl.toString());
};

const getActivity = (id: string) => {
  const requestUrl = buildURL(`${basePath}/${id}`);
  return get<ActivityUiDTO>(requestUrl.toString());
};

const createActivity = (activity: ActivityUiDTO) => {
  const requestUrl = buildURL(basePath);
  return post<ActivityUiDTO>(requestUrl.toString(), activity);
};

const updateActivity = (id: string, activity: ActivityUiDTO) => {
  const requestUrl = buildURL(`${basePath}/${id}`);
  return put<ActivityUiDTO>(requestUrl.toString(), activity);
};

export const activityApi = {
  getAllActivities,
  getActivity,
  createActivity,
  updateActivity,
} as const;
