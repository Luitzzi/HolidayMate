import type {
  ActivityUiDTO,
  PackedItemUiDTO,
} from "../../../generated/interface-api.ts";
import type {
  CategoryGroup,
  DefinitionFormValues,
} from "../DefinitionPage.tsx";

/** Field names of the form values, checked against their types */
export const DEFINITION_FORM_FIELDS = {
  activityName: "activityName",
  categoryGroups: "categoryGroups",
} as const satisfies Record<
  keyof DefinitionFormValues,
  keyof DefinitionFormValues
>;

export const CATEGORY_GROUP_FIELDS = {
  categoryName: "categoryName",
  packedItems: "packedItems",
} as const satisfies Record<keyof CategoryGroup, keyof CategoryGroup>;

export const EMPTY_CATEGORY_GROUP: CategoryGroup = { packedItems: [] };
export const EMPTY_FORM_VALUES: DefinitionFormValues = {
  activityName: "",
  categoryGroups: [EMPTY_CATEGORY_GROUP],
};
export const EMPTY_PACKED_ITEM_VALUES = {
  amount: 1,
  ofItem: {
    name: "",
  },
} as PackedItemUiDTO;

export const toDefinitionFormValues = (
  activity: ActivityUiDTO,
): DefinitionFormValues => {
  const categoryGroups = new Map<string, CategoryGroup>();
  activity.packedItems.forEach((packedItem) => {
    const categoryName = packedItem.ofItem.categoryUiDTO.name;
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
