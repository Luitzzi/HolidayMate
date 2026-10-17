import type {
  ActivityUiDTO,
  CategoryUiDTO,
  ItemUiDTO,
  PackedItemUiDTO,
} from "../../../generated/interface-api.ts";
import type {} from "../DefinitionPage.tsx";
import { normalizeName } from "../hooks/useNamedEntities.ts";

export type DefinitionFormValues = {
  activityName: string;
  categoryGroups: CategoryGroup[];
};

export const DEFINITION_FORM_FIELDS = {
  activityName: "activityName",
  categoryGroups: "categoryGroups",
} as const satisfies Record<
  keyof DefinitionFormValues,
  keyof DefinitionFormValues
>;

export type CategoryGroup = {
  categoryName?: string;
  packedItems: PackedItemUiDTO[];
};

export const CATEGORY_GROUP_FIELDS = {
  categoryName: "categoryName",
  packedItems: "packedItems",
} as const satisfies Record<keyof CategoryGroup, keyof CategoryGroup>;

export const EMPTY_CATEGORY_GROUP: CategoryGroup = { packedItems: [] };
export const EMPTY_FORM_VALUES: DefinitionFormValues = {
  activityName: "",
  categoryGroups: [EMPTY_CATEGORY_GROUP],
};
export const buildEmptyPackedItem = (
  categoryName: string,
  category?: CategoryUiDTO,
): PackedItemUiDTO => {
  return {
    amount: 1,
    ofItem: {
      name: "",
      category: category
        ? category
        : {
            name: categoryName,
          },
    },
  };
};

export const toDefinitionFormValues = (
  activity: ActivityUiDTO,
): DefinitionFormValues => {
  const categoryGroups = new Map<string, CategoryGroup>();
  activity.packedItems.forEach((packedItem) => {
    const categoryName = packedItem.ofItem.category.name;
    if (categoryGroups.has(categoryName)) {
      const categoryGroup = categoryGroups.get(categoryName);
      categoryGroup!.packedItems.push(packedItem);
    } else {
      const newCategoryGroup: CategoryGroup = {
        categoryName,
        packedItems: [packedItem],
      };
      categoryGroups.set(categoryName, newCategoryGroup);
    }
  });
  return {
    activityName: activity.name,
    categoryGroups: [...categoryGroups.values()],
  };
};

export const toActivityUiDTO = (
  formValues: DefinitionFormValues,
): ActivityUiDTO => {
  const packedItems = formValues.categoryGroups.flatMap(
    (categoryGroup) => categoryGroup.packedItems,
  );
  return {
    name: formValues.activityName,
    packedItems: packedItems,
  };
};

export const getUsedCategories = (
  categoryGroups: CategoryGroup[] = [],
): CategoryUiDTO[] =>
  categoryGroups.flatMap((group) =>
    group.categoryName ? [{ name: group.categoryName }] : [],
  );

export const getUsedItems = (
  categoryGroups: CategoryGroup[] = [],
): ItemUiDTO[] =>
  categoryGroups
    .flatMap((group) =>
      group.packedItems.map((packedItem) => packedItem.ofItem),
    )
    .filter((item) => normalizeName(item.name) !== "");
