import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Collapse, Flex, Form, type FormInstance, Input } from "antd";
import { tokens } from "../../../theme/tokens.ts";
import { CategorySelect } from "./CategorySelect.tsx";
import { PackedItemList } from "./PackedItemList.tsx";
import {
  EMPTY_CATEGORY_GROUP,
  EMPTY_FORM_VALUES,
} from "../utils/activityDefinitonFormUtils.ts";
import type { SelectOption } from "../../../components/SelectOption.ts";
import type { CategoryUiDTO } from "../../../generated/interface-api.ts";
import type {
  CategoryGroup,
  DefinitionFormValues,
} from "../DefinitionPage.tsx";

export type ActivityDefinitionFormProps = {
  form: FormInstance<DefinitionFormValues>;
  categorySelectOptions: SelectOption<string>[];
  addCategory: (category: CategoryUiDTO) => void;
  isCategoryNameValid: (name: string) => boolean;
};

export const ActivityDefinitionForm = ({
  form,
  categorySelectOptions,
  addCategory,
  isCategoryNameValid,
}: ActivityDefinitionFormProps) => {
  const categoryGroups = Form.useWatch("categories", form);
  const hasCategory = (categoryIndex: number) => {
    return categoryGroups?.[categoryIndex]?.;
  };

  return (
    <Form
      form={form}
      initialValues={EMPTY_FORM_VALUES}
      layout="vertical"
      requiredMark={false}
      style={{ flex: 1 }}
    >
      <Form.Item
        name={"activityName" satisfies keyof DefinitionFormValues}
        label={"Activity name"}
        rules={[{ required: true, whitespace: true, message: "Enter a name" }]}
      >
        <Input size="large" placeholder="Camping trip" />
      </Form.Item>

      <Form.List name={"categoryGroups" satisfies keyof DefinitionFormValues}>
        {(fields, { add, remove }) => (
          <Flex vertical gap={tokens.gap.large}>
            {fields.map((field, index) => (
              <Flex key={field.key} vertical gap={tokens.gap.small}>
                <Collapse
                  size="large"
                  defaultActiveKey={[field.key]}
                  collapsible={hasCategory(field.name) ? undefined : "disabled"}
                  items={[
                    {
                      key: field.key,
                      label: (
                        // Prevents clicks in the select from toggling the panel
                        <div onClick={(event) => event.stopPropagation()}>
                          <Form.Item
                            name={[
                              field.name,
                              "categoryName" satisfies keyof CategoryGroup,
                            ]}
                            rules={[
                              {
                                required: true,
                                message: "Select a category",
                              },
                            ]}
                            style={{ marginBottom: 0 }}
                          >
                            <CategorySelect
                              categories={categorySelectOptions}
                              onCreate={addCategory}
                              isCategoryNameValid={isCategoryNameValid}
                            />
                          </Form.Item>
                        </div>
                      ),
                      extra: (
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          aria-label="Remove category"
                          onClick={(event) => {
                            event.stopPropagation();
                            remove(field.name);
                          }}
                          style={{ marginLeft: tokens.margin.small }}
                        />
                      ),
                      // Renders closed panels too, so their fields are validated
                      forceRender: true,
                      children: (
                        <PackedItemList categoryItemIndex={field.name} />
                      ),
                    },
                  ]}
                />
                {fields.length > 0 && index === fields.length - 1 && (
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => add(EMPTY_CATEGORY_GROUP, index + 1)}
                  >
                    Add category
                  </Button>
                )}
              </Flex>
            ))}
            {fields.length === 0 && (
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => add(EMPTY_CATEGORY_GROUP)}
              >
                Add category
              </Button>
            )}
          </Flex>
        )}
      </Form.List>
    </Form>
  );
};
