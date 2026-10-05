type EnvVariable = {
  readonly VITE_BACKEND_HOST: string;
  readonly VITE_BACKEND_PORT: string;
};

const getEnvironmentVariable = (key: keyof EnvVariable) => {
  const value = import.meta.env[key];
  if (!value) throw Error(`Missing env variable: ${key}`);
  return value;
};

export const config = {
  backendBaseUrl: `http://${getEnvironmentVariable("VITE_BACKEND_HOST")}:${getEnvironmentVariable("VITE_BACKEND_PORT")}/api`,
} as const;
