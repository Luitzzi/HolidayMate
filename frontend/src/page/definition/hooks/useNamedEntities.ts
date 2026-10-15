import { useEffect, useMemo, useState } from "react";
import { App } from "antd";
import { useFetchOnce } from "../../../common/hooks/useFetchOnce.ts";
import { buildApiFetchErrorMessage } from "../../../api/utils/fetch.ts";

type Named = { name: string };

export const normalizeName = (name: string) => name.trim().toLowerCase();

const toMapByNormalizedName = <T extends Named>(entities: T[]) =>
  new Map(entities.map((entity) => [normalizeName(entity.name), entity]));

/**
 * Loads named entities once and tracks newly added ones separately
 * @param fetch Api request loading all entities
 * @param errorLabel Entity name used in the fetch error message
 */
export const useNamedEntities = <T extends Named>(
  fetch: () => Promise<T[]>,
  errorLabel: string,
) => {
  const { message } = App.useApp();
  const [fetched, loading, error] = useFetchOnce(fetch);
  const [addedByName, setAddedByName] = useState(new Map<string, T>());

  useEffect(() => {
    if (error)
      message.error(buildApiFetchErrorMessage(errorLabel, error.message));
  }, [error, errorLabel, message]);

  const fetchedByName = useMemo(
    () => toMapByNormalizedName(fetched ?? []),
    [fetched],
  );
  const byName = useMemo(
    () => new Map([...fetchedByName, ...addedByName]),
    [fetchedByName, addedByName],
  );

  const isNameAvailable = (name: string) => {
    const normalizedName = normalizeName(name);
    return normalizedName !== "" && !byName.has(normalizedName);
  };

  const add = (entity: T) =>
    setAddedByName((prev) =>
      new Map(prev).set(normalizeName(entity.name), entity),
    );

  return { byName, addedByName, loading, isNameAvailable, add };
};

export type NamedEntities<T extends Named> = ReturnType<
  typeof useNamedEntities<T>
>;
