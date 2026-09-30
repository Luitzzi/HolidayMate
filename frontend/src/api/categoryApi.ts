import type { CategoryUiDTO } from "../generated/interface-api.ts";
import { request } from "./apiClient.ts";

export const categoryApi = {
  getAll: () => request<CategoryUiDTO[]>("/categories"),
};
