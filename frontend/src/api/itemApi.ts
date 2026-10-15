import { buildURL } from "./utils/urlBuilder.ts";
import { get } from "./utils/fetch.ts";
import type { ItemUiDTO } from "../generated/interface-api.ts";

const basePath = "items";

const getAllItems = () => {
  const requestUrl = buildURL(basePath);
  return get<ItemUiDTO[]>(requestUrl.toString());
};

export const itemApi = {
  getAllItems,
};
