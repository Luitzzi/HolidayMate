import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, InputNumber } from "antd";
import { tokens } from "../../../theme/tokens.ts";
import { EMPTY_PACKED_ITEM_VALUES } from "../utils/activityDefinitonFormUtils.ts";
import type { CategoryGroup } from "../DefinitionPage.tsx";
import type {
  ItemUiDTO,
  PackedItemUiDTO,
} from "../../../generated/interface-api.ts";

type PackedItemListProps = {
  // Index of the category card in the "categories" Form.List
  categoryItemIndex: number;
};

export const PackedItemList = ({ categoryItemIndex }: PackedItemListProps) => {
  const form = Form.useFormInstance();
  const categoryName = Form.useWatch<string | undefined>(
    ["categories", categoryItemIndex, "categoryName"],
    form,
  );

  return (
    <Form.List
      name={[categoryItemIndex, "packedItems" satisfies keyof CategoryGroup]}
    >
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
                <Input size="large" placeholder="Item" />
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
              onClick={() => add(EMPTY_PACKED_ITEM_VALUES)}
            >
              Add item
            </Button>
          )}
        </Flex>
      )}
    </Form.List>
  );
};
