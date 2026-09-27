import type { ActivityUiDTO } from "../../generated/interface-api.ts";

/** Categories shown even before any item of them exists (see mock). */
export const DEFAULT_CATEGORIES = ["Clothing", "Gear", "Extras"];

export type PackedItemRow = {
  id?: string;
  name: string;
  amount: number;
};

export type DefinitionFormValues = {
  name: string;
  /** Packed items grouped by category name. */
  items: Record<string, PackedItemRow[] | undefined>;
};

export const EMPTY_FORM_VALUES: DefinitionFormValues = { name: "", items: {} };

export const toFormValues = (activity: ActivityUiDTO): DefinitionFormValues => {
  const items: Record<string, PackedItemRow[]> = {};
  activity.packedItems.forEach(({ id, name, category, amount }) => {
    (items[category] ??= []).push({ id, name, amount });
  });
  return { name: activity.name, items };
};

export const toActivity = (
  values: DefinitionFormValues,
  id?: string,
): ActivityUiDTO => ({
  id,
  name: values.name,
  packedItems: Object.entries(values.items ?? {}).flatMap(([category, rows]) =>
    (rows ?? []).map((row) => ({ ...row, category })),
  ),
});

/** Default categories first, all others alphabetically. */
export const mergeCategories = (...sources: string[][]): string[] => {
  const others = new Set(
    sources.flat().filter((category) => !DEFAULT_CATEGORIES.includes(category)),
  );
  return [
    ...DEFAULT_CATEGORIES,
    ...[...others].sort((a, b) => a.localeCompare(b)),
  ];
};
