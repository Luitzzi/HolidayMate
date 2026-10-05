import { config } from "../../assets/config.ts";

export const buildURL = (path: string, queryParameters?: string) => {
  return new URL(
    `${config.backendBaseUrl}/${path}${queryParameters ? queryParameters : ""}`,
    window.location.origin,
  );
};
