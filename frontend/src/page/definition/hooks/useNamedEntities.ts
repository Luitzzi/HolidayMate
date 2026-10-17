import { useEffect, useMemo } from "react";
import { App } from "antd";
import { useFetchOnce } from "../../../common/hooks/useFetchOnce.ts";
import { buildApiFetchErrorMessage } from "../../../api/utils/fetch.ts";

type Named = { name: string };

export const normalizeName = (name: string) => name.trim().toLowerCase();

const toMapByNormalizedName = <T extends Named>(entities: T[]) =>
  new Map(entities.map((entity) => [normalizeName(entity.name), entity]));

/**
 * Loads named entities once and merges them with the entities used in the form
 * @param fetch Api request loading all entities
 * @param errorLabel Entity name used in the fetch error message
 * @param used Entities currently used in the form, including newly added ones
 */
export const useNamedEntities = <T extends Named>(
  fetch: () => Promise<T[]>,
  errorLabel: string,
  used: T[],
) => {
  const { message } = App.useApp();
  const [fetched, loading, error] = useFetchOnce(fetch);

  useEffect(() => {
    if (error)
      message.error(buildApiFetchErrorMessage(errorLabel, error.message));
  }, [error, errorLabel, message]);

  const fetchedByName = useMemo(
    () => toMapByNormalizedName(fetched ?? []),
    [fetched],
  );
  // Fetched entities take precedence, as only they contain the id
  const byName = useMemo(
    () => new Map([...toMapByNormalizedName(used), ...fetchedByName]),
    [used, fetchedByName],
  );

  const isNameAvailable = (name: string) => {
    const normalizedName = normalizeName(name);
    return normalizedName !== "" && !byName.has(normalizedName);
  };

  return { byName, loading, isNameAvailable };
};

export type NamedEntities<T extends Named> = ReturnType<
  typeof useNamedEntities<T>
>;
