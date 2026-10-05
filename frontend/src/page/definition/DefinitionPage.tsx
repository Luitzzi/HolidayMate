/*

import { PlusOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Collapse,
  Flex,
  Form,
  Input,
  Select,
  Spin,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import type {
  ActivityUiDTO,
  CategoryUiDTO,
} from "../../generated/interface-api.ts";
import {
  type DefinitionFormValues,
  EMPTY_FORM_VALUES,
  toActivity,
  toFormValues,
} from "./definitionForm.ts";
import { SectionHeader } from "../../components/SectionHeader.tsx";
import { PackedItemCount, PackedItemList } from "./PackedItemList.tsx";
import { tokens } from "../../theme/tokens.ts";
import { activityApi } from "../../api/activityApi.ts";
import { categoryApi } from "../../api/categoryApi.ts";
import { getApiFetchErrorMessage } from "../../api/utils/fetch.ts";


export const DefinitionPage = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm<DefinitionFormValues>();



  const [selectedActivityId, setSelectedActivityId] = useState<string>();
  const [openCategoryIds, setOpenCategoryIds] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  const showActivity = (activity?: ActivityUiDTO) => {
    setSelectedActivityId(activity?.id);
    form.resetFields();
    const values = activity ? toFormValues(activity) : EMPTY_FORM_VALUES;
    form.setFieldsValue(values);
    setOpenCategoryIds(Object.keys(values.items));
  };

  const save = async () => {
    try {
      await form.validateFields({ recursive: true });
    } catch (error) {
      const { errorFields = [] } = error as {
        errorFields?: { name: (string | number)[] }[];
      };
      const invalidCategories = errorFields
        .filter(({ name }) => name[0] === "items")
        .map(({ name }) => String(name[1]));
      setOpenCategoryIds((current) => [
        ...new Set([...current, ...invalidCategories]),
      ]);
      return;
    }

    setSaving(true);
    try {
      const activity = toActivity(
        form.getFieldsValue(true),
        selectedActivityId,
      );
      const saved = selectedActivityId
        ? await activityApi.updateActivity(selectedActivityId, activity)
        : await activityApi.createActivity(activity);
      setActivities((current = []) =>
        [...current.filter(({ id }) => id !== saved.id), saved].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      showActivity(saved);
      message.success(`Saved "${saved.name}"`);
    } catch (error) {
      message.error(`Could not save activity: ${(error as Error).message}`);
    } finally {
      setSaving(false);
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
          options={(activities ?? []).map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
          onChange={(id) =>
            showActivity(
              (activities ?? []).find((activity) => activity.id === id),
            )
          }
          style={{ flex: 1 }}
        />
        <Button icon={<PlusOutlined />} onClick={() => showActivity()}>
          New activity
        </Button>
      </Flex>

      <Form
        form={form}
        layout="vertical"
        initialValues={EMPTY_FORM_VALUES}
        requiredMark={false}
        style={{ flex: 1 }}
      >


        {categoriesLoading ? (
          <Spin />
        ) : (
          <Flex vertical gap={tokens.gap.large}>
            {(categories ?? []).map((category) => (
              <Collapse
                key={category.id}
                size="large"
                activeKey={
                  openCategoryIds.includes(category.id) ? [category.id] : []
                }
                onChange={(keys) =>
                  setOpenCategoryIds((current) =>
                    keys.length > 0
                      ? [...current, category.id]
                      : current.filter((id) => id !== category.id),
                  )
                }
                items={[
                  {
                    key: category.id,
                    label: (
                      <Typography.Text
                        strong
                        style={{ fontSize: tokens.fontSize.large }}
                      >
                        {category.name}
                      </Typography.Text>
                    ),
                    extra: <PackedItemCount category={category} />,
                    forceRender: true,
                    children: <PackedItemList category={category} />,
                  },
                ]}
              />
            ))}
          </Flex>
        )}
      </Form>

      <div
        style={{
          position: "sticky",
          bottom: 0,
          marginTop: tokens.margin.large,
          padding: `${tokens.padding.medium}px 0`,
          background: tokens.color.background.container,
        }}
      >
        <Button
          type="primary"
          size="large"
          block
          loading={saving}
          onClick={save}
        >
          Save activity
        </Button>
      </div>
    </Flex>
  );
};


 */
