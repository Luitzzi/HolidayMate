import type { CategoryUiDTO } from "../generated/interface-api.ts";
import { buildURL } from "./utils/urlBuilder.ts";
import { get, post } from "./utils/fetch.ts";

const basePath = "categories";

const getAllCategories = () => {
  const requestUrl = buildURL(basePath);
  return get<CategoryUiDTO[]>(requestUrl.toString());
};

const createCategory = (category: CategoryUiDTO) => {
  const requestUrl = buildURL(basePath);
  return post<CategoryUiDTO>(requestUrl.toString(), category);
};

export const categoryApi = {
  getAllCategories,
  createCategory,
} as const;
