import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Badge, Button, Flex, Form, Input, InputNumber, theme } from "antd";
import type { PackedItemRow } from "./definitionForm.ts";

type Props = {
  category: string;
};

export const PackedItemList = ({ category }: Props) => {
  const { token } = theme.useToken();

  return (
    <Form.List name={["items", category]}>
      {(fields, { add, remove }) => (
        <Flex vertical gap={token.marginSM}>
          {fields.map(({ key, name }) => (
            <Flex key={key} gap={token.marginSM} align="start">
              <Form.Item
                name={[name, "name"]}
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
                name={[name, "amount"]}
                rules={[{ required: true, message: "Enter an amount" }]}
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  size="large"
                  min={1}
                  precision={0}
                  aria-label="Amount"
                  style={{ width: token.controlHeightLG * 2 }}
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
          <Button
            type="dashed"
            size="large"
            block
            icon={<PlusOutlined />}
            onClick={() => add({ name: "", amount: 1 } satisfies PackedItemRow)}
          >
            Add item
          </Button>
        </Flex>
      )}
    </Form.List>
  );
};

export const PackedItemCount = ({ category }: Props) => {
  const { token } = theme.useToken();
  const form = Form.useFormInstance();
  const rows = Form.useWatch<PackedItemRow[] | undefined>(
    ["items", category],
    form,
  );
  const count = rows?.length ?? 0;

  return (
    <Badge
      count={count}
      showZero
      color={count > 0 ? token.colorPrimary : token.colorFillSecondary}
      styles={
        count > 0
          ? undefined
          : { indicator: { color: token.colorTextDisabled } }
      }
    />
  );
};
