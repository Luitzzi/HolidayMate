import type {
  ActivityUiDTO,
  CategoryUiDTO,
  PackedItemUiDTO,
} from "../../generated/interface-api.ts";
export type DefinitionFormValues = {
  name: string;
  /** Packed items grouped by category id. */
  items: Record<string, PackedItemUiDTO[] | undefined>;
};

export const EMPTY_FORM_VALUES: DefinitionFormValues = { name: "", items: {} };

export const toFormValues = (activity: ActivityUiDTO): DefinitionFormValues => {
  const items: Record<string, PackedItemUiDTO[]> = {};
  activity.packedItems.forEach((packedItem) => {
    const categoryId = packedItem.ofItem.categoryUiDTO.id;
    (items[categoryId] ??= []).push(packedItem);
  });
  return { name: activity.name, items };
};

export const toActivity = (
  values: DefinitionFormValues,
  id?: string,
): ActivityUiDTO => ({
  id,
  name: values.name,
  packedItems: Object.values(values.items).flatMap((rows) => rows ?? []),
});

/** New items have no ids yet, they are assigned by the backend. */
export const newPackedItem = (category: CategoryUiDTO) =>
  ({
    amount: 1,
    ofItem: { name: "", categoryUiDTO: category },
  }) as PackedItemUiDTO;
