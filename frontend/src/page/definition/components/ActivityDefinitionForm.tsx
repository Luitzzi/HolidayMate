import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Collapse,
  Flex,
  Form,
  type FormInstance,
  Input,
  Spin,
} from "antd";
import { tokens } from "../../../theme/tokens.ts";
import { CategorySelect } from "./CategorySelect.tsx";
import { PackedItemList } from "./PackedItemList.tsx";
import {
  CATEGORY_GROUP_FIELDS,
  DEFINITION_FORM_FIELDS,
  type DefinitionFormValues,
  EMPTY_CATEGORY_GROUP,
  EMPTY_FORM_VALUES,
} from "../utils/activityDefinitonFormUtils.ts";
import type { SelectOption } from "../../../common/components/input/SelectOption.ts";
import type {
  CategoryUiDTO,
  ItemUiDTO,
} from "../../../generated/interface-api.ts";
import { useMemo } from "react";

export type ActivityDefinitionFormProps = {
  form: FormInstance<DefinitionFormValues>;
  categoriesByName: Map<string, CategoryUiDTO>;
  categoryOptionsByName: Map<string, SelectOption<string>>;
  addCategory: (category: CategoryUiDTO) => void;
  isCategoryNameValid: (name: string) => boolean;
  itemsLoading: boolean;
  itemOptionsByName: Map<string, SelectOption<string>>;
  addItem: (name: string, category: CategoryUiDTO) => void;
};

export const ActivityDefinitionForm = ({
  form,
  categoriesByName,
  categoryOptionsByName,
  addCategory,
  isCategoryNameValid,
  itemsLoading,
  itemOptionsByName,
  addItem,
}: ActivityDefinitionFormProps) => {
  const categoryGroups = Form.useWatch(
    DEFINITION_FORM_FIELDS.categoryGroups,
    form,
  );

  const hasCategory = (categoryIndex: number) => {
    return Boolean(
      categoryGroups?.[categoryIndex]?.[CATEGORY_GROUP_FIELDS.categoryName],
    );
  };

  const selectedCategoryNames = useMemo(
    () =>
      new Set(
        categoryGroups?.map((group) =>
          group?.[CATEGORY_GROUP_FIELDS.categoryName]?.toLowerCase(),
        ),
      ),
    [categoryGroups],
  );

  // Disables categories that are already selected in another category group
  const getCategoryOptions = (categoryIndex: number) => {
    const ownName =
      categoryGroups?.[categoryIndex]?.[
        CATEGORY_GROUP_FIELDS.categoryName
      ]?.toLowerCase();
    const selectedNames = selectedCategoryNames;
    return [...categoryOptionsByName.entries()].map(([name, option]) => ({
      ...option,
      disabled: name !== ownName && selectedNames.has(name),
    }));
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
        name={DEFINITION_FORM_FIELDS.activityName}
        label={"Activity name"}
        rules={[{ required: true, whitespace: true, message: "Enter a name" }]}
      >
        <Input size="large" placeholder="Activity name" />
      </Form.Item>

      <Form.List name={DEFINITION_FORM_FIELDS.categoryGroups}>
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
                              CATEGORY_GROUP_FIELDS.categoryName,
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
                              categories={getCategoryOptions(field.name)}
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
                      children: itemsLoading ? (
                        <Spin />
                      ) : (
                        <PackedItemList
                          categoriesByName={categoriesByName}
                          categoryItemIndex={field.name}
                          itemOptionsByName={itemOptionsByName}
                          addItem={addItem}
                        />
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
