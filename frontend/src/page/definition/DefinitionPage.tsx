import { PlusOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Collapse,
  Flex,
  Form,
  Input,
  Select,
  Typography,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { activityApi, categoryApi } from "../../api/apiClient.ts";
import type { ActivityUiDTO } from "../../generated/interface-api.ts";
import {
  type DefinitionFormValues,
  EMPTY_FORM_VALUES,
  DEFAULT_CATEGORIES,
  mergeCategories,
  toActivity,
  toFormValues,
} from "./definitionForm.ts";
import { PageHeader } from "../../components/PageHeader.tsx";
import { PackedItemCount, PackedItemList } from "./PackedItemList.tsx";

export const DefinitionPage = () => {
  const { token } = theme.useToken();
  const { message } = App.useApp();
  const [form] = Form.useForm<DefinitionFormValues>();

  const [activities, setActivities] = useState<ActivityUiDTO[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [selectedId, setSelectedId] = useState<string>();
  const [openCategories, setOpenCategories] = useState<string[]>([
    DEFAULT_CATEGORIES[0],
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([activityApi.getAll(), categoryApi.getAll()])
      .then(([loadedActivities, loadedCategories]) => {
        setActivities(loadedActivities);
        setCategories(
          mergeCategories(loadedCategories.map((category) => category.name)),
        );
      })
      .catch((error: Error) =>
        message.error(`Could not load activities: ${error.message}`),
      )
      .finally(() => setLoading(false));
  }, [message]);

  const showActivity = (activity?: ActivityUiDTO) => {
    setSelectedId(activity?.id);
    form.resetFields();
    form.setFieldsValue(activity ? toFormValues(activity) : EMPTY_FORM_VALUES);
    if (activity) {
      setCategories((current) =>
        mergeCategories(
          current,
          activity.packedItems.map((item) => item.category),
        ),
      );
    }
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
      setOpenCategories((current) => [
        ...new Set([...current, ...invalidCategories]),
      ]);
      return;
    }

    setSaving(true);
    try {
      const activity = toActivity(form.getFieldsValue(true), selectedId);
      const saved = selectedId
        ? await activityApi.update(selectedId, activity)
        : await activityApi.create(activity);
      setActivities((current) =>
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
      <PageHeader
        title="Definition Menu"
        description="Define activities with their associated equipment and tips for the next time."
      />

      <Flex gap={token.marginSM} style={{ marginBottom: token.marginLG }}>
        <Select
          placeholder="Select an activity to edit"
          loading={loading}
          value={selectedId}
          options={activities.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
          onChange={(id: string) =>
            showActivity(activities.find((activity) => activity.id === id))
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
        <Form.Item
          name="name"
          label="Activity name"
          rules={[
            { required: true, whitespace: true, message: "Enter a name" },
          ]}
        >
          <Input size="large" placeholder="Camping trip" />
        </Form.Item>

        <Flex vertical gap={token.marginLG}>
          {categories.map((category) => (
            <Collapse
              key={category}
              size="large"
              activeKey={openCategories.includes(category) ? [category] : []}
              onChange={(keys) =>
                setOpenCategories((current) =>
                  keys.length > 0
                    ? [...current, category]
                    : current.filter((open) => open !== category),
                )
              }
              items={[
                {
                  key: category,
                  label: (
                    <Typography.Text
                      strong
                      style={{ fontSize: token.fontSizeLG }}
                    >
                      {category}
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
      </Form>

      <div
        style={{
          position: "sticky",
          bottom: 0,
          marginTop: token.marginLG,
          padding: `${token.padding}px 0`,
          background: token.colorBgContainer,
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
