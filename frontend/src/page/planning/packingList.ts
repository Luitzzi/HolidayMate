import type { ActivityUiDTO } from "../../generated/interface-api.ts";

export type PackingListEntry = {
  key: string;
  category: string;
  name: string;
  amount: number;
};

/**
 * Combines the packing lists of the given activities. An item contained in
 * several activities is packed once, with the highest amount.
 */
export const buildPackingList = (
  activities: ActivityUiDTO[],
): PackingListEntry[] => {
  const entries = new Map<string, PackingListEntry>();
  activities
    .flatMap((activity) => activity.packedItems)
    .forEach(({ ofItem, amount }) => {
      const category = ofItem.category.name;
      const name = ofItem.name;
      const key = `${category}/${name}`.toLowerCase();
      const existing = entries.get(key);
      entries.set(key, {
        key,
        category,
        name,
        amount: Math.max(amount, existing?.amount ?? 0),
      });
    });
  return [...entries.values()].sort(
    (a, b) =>
      a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
  );
};
