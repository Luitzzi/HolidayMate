import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Form, InputNumber } from "antd";
import { tokens } from "../../../theme/tokens.ts";
import {
  buildEmptyPackedItem,
  CATEGORY_GROUP_FIELDS,
  DEFINITION_FORM_FIELDS,
} from "../utils/activityDefinitonFormUtils.ts";
import type {
  CategoryUiDTO,
  ItemUiDTO,
  PackedItemUiDTO,
} from "../../../generated/interface-api.ts";
import { toSelectOptions } from "../../../common/components/input/SelectOption.ts";
import { AddableSelect } from "../../../common/components/input/AddableSelect.tsx";
import { useMemo } from "react";
import {
  type NamedEntities,
  normalizeName,
} from "../hooks/useNamedEntities.ts";

type PackedItemListProps = {
  categoriesByName: Map<string, CategoryUiDTO>;
  // Index of the category card in the "categoryGroups" Form.List
  categoryItemIndex: number;
  items: NamedEntities<ItemUiDTO>;
};

export const PackedItemList = ({
  categoriesByName,
  categoryItemIndex,
  items,
}: PackedItemListProps) => {
  const form = Form.useFormInstance();
  const categoryName = Form.useWatch<string | undefined>(
    [
      DEFINITION_FORM_FIELDS.categoryGroups,
      categoryItemIndex,
      CATEGORY_GROUP_FIELDS.categoryName,
    ],
    form,
  );
  const category =
    categoryName !== undefined
      ? categoriesByName.get(normalizeName(categoryName))
      : undefined;

  const getEmptyPackedItem = (): PackedItemUiDTO => {
    if (categoryName === undefined)
      throw Error("Item creation is only allowed when a category name exists");

    return buildEmptyPackedItem(categoryName, category);
  };

  const itemOptions = useMemo(
    () =>
      toSelectOptions(
        [...items.byName.values()],
        (item) => item.name,
        (item) => item.name,
      ),
    [items.byName],
  );

  return (
    <Form.List name={[categoryItemIndex, CATEGORY_GROUP_FIELDS.packedItems]}>
      {(fields, { add, remove }) => (
        <Flex vertical gap={tokens.gap.small}>
          {fields.map(({ key, name }) => (
            <Flex key={key} gap={tokens.gap.small} align="start">
              <Form.Item
                name={[
                  name,
                  "ofItem" satisfies keyof PackedItemUiDTO,
                  "name" satisfies keyof ItemUiDTO,
                ]}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Enter an item",
                  },
                ]}
                style={{ flex: 1, marginBottom: 0 }}
              >
                <AddableSelect
                  selectOptions={itemOptions}
                  onCreate={(name) => {
                    if (category === undefined)
                      throw Error(
                        "Category must not be undefined when selecting an item",
                      );
                    items.add({ name, category });
                  }}
                  isElementValid={items.isNameAvailable}
                />
              </Form.Item>

              <Form.Item
                name={[name, "amount" satisfies keyof PackedItemUiDTO]}
                rules={[{ required: true, message: "Enter an amount" }]}
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  size="large"
                  min={1}
                  precision={0}
                  aria-label="Amount"
                  style={{ width: tokens.controlHeight.large * 2 }}
                />
              </Form.Item>

              <Button
                type="text"
                size="large"
                icon={<DeleteOutlined />}
                aria-label="Remove item"
                onClick={() => remove(name)}
              />
            </Flex>
          ))}

          {categoryName && (
            <Button
              type="dashed"
              size="large"
              block
              icon={<PlusOutlined />}
              onClick={() => add(getEmptyPackedItem())}
            >
              Add item
            </Button>
          )}
        </Flex>
      )}
    </Form.List>
  );
};
