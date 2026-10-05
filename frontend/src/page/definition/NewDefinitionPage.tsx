import { useEffect, useState } from "react";
import type {
  ActivityUiDTO,
  CategoryUiDTO,
  PackedItemUiDTO,
} from "../../generated/interface-api.ts";
import { activityApi } from "../../api/activityApi.ts";
import { getApiFetchErrorMessage } from "../../api/utils/fetch.ts";
import { categoryApi } from "../../api/categoryApi.ts";
import { App, Button, Collapse, Flex, Form, Input, Select } from "antd";
import type { DefinitionFormValues } from "./definitionForm.ts";
import { SectionHeader } from "../../components/SectionHeader.tsx";
import { tokens } from "../../theme/tokens.ts";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  type SelectOption,
  toSelectOption,
  toSelectOptions,
} from "../../components/SelectOption.ts";
import { PackedItemList } from "./PackedItemList.tsx";

type NewDefinitionFormValues = {
  name: string;
  categories: CategoryGroup[];
};

type CategoryGroup = {
  categoryId?: string;
  packedItems: PackedItemUiDTO[];
};

const EMPTY_CATEGORY_GROUP: CategoryGroup = { packedItems: [] };

const EMPTY_FORM_VALUES: NewDefinitionFormValues = {
  name: "",
  categories: [EMPTY_CATEGORY_GROUP],
};

const toDefinitionFormValues = (
  activity: ActivityUiDTO,
): NewDefinitionFormValues => {
  const categoryGroups = new Map<string, CategoryGroup>();
  activity.packedItems.forEach((packedItem) => {
    const categoryId = packedItem.ofItem.categoryUiDTO.id as string;
    if (categoryGroups.has(categoryId)) {
      const categoryGroup = categoryGroups.get(categoryId);
      categoryGroup!.packedItems.push(packedItem);
    } else {
      const newCategoryGroup: CategoryGroup = {
        categoryId,
        packedItems: [packedItem],
      };
      categoryGroups.set(categoryId, newCategoryGroup);
    }
  });
  return {
    name: activity.name,
    categories: [...categoryGroups.values()],
  };
};

export const NewDefinitionPage = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm<DefinitionFormValues>();

  const [activities, setActivities] = useState<ActivityUiDTO[]>([]);
  const [activityOptions, setActivityOptions] = useState<
    SelectOption<string>[]
  >([]);
  const [activitiesLoading, setActivitiesLoading] = useState<boolean>(true);
  useEffect(() => {
    activityApi
      .getAllActivities()
      .then((result) => {
        setActivities(result);
        setActivityOptions(
          toSelectOptions(
            result,
            (activity) => activity.id as string,
            (activity) => activity.name,
          ),
        );
      })
      .catch((err: Error) =>
        message.error(getApiFetchErrorMessage("activities", err.message)),
      )
      .finally(() => setActivitiesLoading(false));
  }, [message]);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );

  const [categories, setCategories] = useState<CategoryUiDTO[]>([]);
  const [categorySelectOptions, setCategorySelectOptions] = useState<
    SelectOption<string>[]
  >([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  useEffect(() => {
    setCategoriesLoading(true);
    categoryApi
      .getAllCategories()
      .then((result) => {
        setCategories(result);
        setCategorySelectOptions(
          toSelectOptions(
            result,
            (category) => category.id as string,
            (category) => category.name,
          ),
        );
      })
      .catch((err: Error) =>
        message.error(getApiFetchErrorMessage("categories", err.message)),
      )
      .finally(() => setCategoriesLoading(false));
  }, [message]);
  const addCategory = (category: CategoryUiDTO) => {
    setCategories((prev) => [...prev, category]);
    const categoryOption = toSelectOption(
      category,
      (category) => category.id as string,
      (category) => category.name,
    );
    setCategorySelectOptions((prev) => [...prev, categoryOption]);
  };

  const showActivity = (activityId?: string) => {
    form.resetFields();
    if (activityId) {
      setSelectedActivityId(activityId);
      const activity = activities.find(
        (activity) => activity.id === activityId,
      );
      if (activity !== undefined) {
        const fieldValues = toDefinitionFormValues(activity);
        form.setFieldsValue(fieldValues);
      } else {
        message.error("Could not find the selectedActivity");
      }
    }
  };

  return (
    <Flex vertical style={{ minHeight: "100%" }}>
      <SectionHeader
        title="Definition Menu"
        description="Define activities with their associated equipment and tips for the next time."
      />

      <Flex
        gap={tokens.gap.small}
        style={{ marginBottom: tokens.margin.large }}
      >
        <Select
          placeholder="Select an activity to edit"
          loading={activitiesLoading}
          value={selectedActivityId}
          options={activityOptions}
          onChange={(id) => showActivity(id)}
          style={{ flex: 1 }}
        />
        <Button icon={<PlusOutlined />} onClick={() => showActivity()}>
          New activity
        </Button>
      </Flex>

      <Form
        form={form}
        initialValues={EMPTY_FORM_VALUES}
        layout="vertical"
        requiredMark={false}
        style={{ flex: 1 }}
      >
        <Form.Item
          name="name"
          label="Activity name"
          rules={[
            { required: true, whitespace: true, message: "Enter a name" },
          ]}
        >
          <Input size="large" placeholder="Camping trip" />
        </Form.Item>
        <Form.List name="categories">
          {(fields, { add, remove }) => (
            <Flex vertical gap={tokens.gap.large}>
              {fields.map((field, index) => (
                <Flex key={field.key} vertical gap={tokens.gap.small}>
                  <Collapse
                    size="large"
                    defaultActiveKey={[field.key]}
                    items={[
                      {
                        key: field.key,
                        label: (
                          <Form.Item
                            name={[field.name, "categoryId"]}
                            noStyle
                            rules={[{ required: true }]}
                          >
                            <CategorySelect
                              categories={categories}
                              onCreate={addCategory}
                            />
                          </Form.Item>
                        ),
                        extra: (
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        ),
                        forceRender: true, // Ensures that input inside closed Collaps elements are validated
                        children: (
                          <PackedItemList name={[field.name, "packedItems"]} />
                        ),
                      },
                    ]}
                  />
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => add(EMPTY_CATEGORY_GROUP, index + 1)}
                  >
                    Add category
                  </Button>
                </Flex>
              ))}
            </Flex>
          )}
        </Form.List>
      </Form>
    </Flex>
  );
};
