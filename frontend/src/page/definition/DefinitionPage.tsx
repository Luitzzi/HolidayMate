import { useEffect, useMemo, useState } from "react";
import type { ActivityUiDTO } from "../../generated/interface-api.ts";
import { activityApi } from "../../api/activityApi.ts";
import {
  buildApiFetchErrorMessage,
  buildApiPostErrorMessage,
} from "../../api/utils/fetch.ts";
import { categoryApi } from "../../api/categoryApi.ts";
import { App, Button, Flex, Form, Select, Spin } from "antd";
import { SectionHeader } from "../../common/components/SectionHeader.tsx";
import { tokens } from "../../theme/tokens.ts";
import { PlusOutlined } from "@ant-design/icons";
import {
  type SelectOption,
  toSelectOptions,
} from "../../common/components/input/SelectOption.ts";
import {
  DEFINITION_FORM_FIELDS,
  type DefinitionFormValues,
  getUsedCategories,
  getUsedItems,
  toActivityUiDTO,
  toDefinitionFormValues,
} from "./utils/activityDefinitonFormUtils.ts";
import { ActivityDefinitionForm } from "./components/ActivityDefinitionForm.tsx";
import { useNavigate } from "react-router";
import { itemApi } from "../../api/itemApi.ts";
import { useNamedEntities } from "./hooks/useNamedEntities.ts";

export const DefinitionPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
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
        message.error(buildApiFetchErrorMessage("activities", err.message)),
      )
      .finally(() => setActivitiesLoading(false));
  }, [message]);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );

  const categoryGroups = Form.useWatch(
    DEFINITION_FORM_FIELDS.categoryGroups,
    form,
  );
  const usedCategories = useMemo(
    () => getUsedCategories(categoryGroups),
    [categoryGroups],
  );
  const usedItems = useMemo(
    () => getUsedItems(categoryGroups),
    [categoryGroups],
  );
  const categories = useNamedEntities(
    categoryApi.getAllCategories,
    "categories",
    usedCategories,
  );
  const items = useNamedEntities(itemApi.getAllItems, "items", usedItems);

  const loadActivity = (activityId?: string) => {
    form.resetFields();
    setSelectedActivityId(activityId ?? null);
    if (activityId) {
      const activity = activities.find(
        (activity) => activity.id === activityId,
      );
      if (activity !== undefined) {
        const fieldValues = toDefinitionFormValues(activity);
        form.setFieldsValue(fieldValues);
      } else {
        message.error("Could not find the selected activity");
      }
    }
  };

  const [saving, setSaving] = useState<boolean>(false);
  const onSuccess = () => {
    message.success("Activity was saved");
    navigate("/planning");
  };
  const saveActivity = () => {
    // onFinish values only contain registered fields, so e.g. packed item ids would be missing
    const formValues: DefinitionFormValues = form.getFieldsValue(true);
    const activity: ActivityUiDTO = toActivityUiDTO(formValues);
    setSaving(true);
    if (selectedActivityId) {
      activityApi
        .updateActivity(selectedActivityId, activity)
        .then(() => onSuccess())
        .catch((err: Error) =>
          message.error(buildApiPostErrorMessage("activity", err.message)),
        )
        .finally(() => setSaving(false));
    } else {
      activityApi
        .createActivity(activity)
        .then(() => onSuccess())
        .catch((err: Error) =>
          message.error(buildApiPostErrorMessage("activity", err.message)),
        )
        .finally(() => setSaving(false));
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
          onChange={(id) => loadActivity(id)}
          style={{ flex: 1 }}
        />
        <Button icon={<PlusOutlined />} onClick={() => loadActivity()}>
          New activity
        </Button>
      </Flex>

      {categories.loading ? (
        <Spin />
      ) : (
        <ActivityDefinitionForm
          form={form}
          categories={categories}
          items={items}
          onFinish={saveActivity}
          onFinishFailed={() =>
            message.error("Please fill out all input fields")
          }
        />
      )}

      <div
        style={{
          position: "sticky",
          bottom: 0,
          marginTop: tokens.margin.large,
          padding: `${tokens.padding.medium} 0`,
          background: tokens.color.background.container,
        }}
      >
        <Button
          type="primary"
          size="large"
          block
          loading={saving}
          onClick={() => form.submit()}
          style={{ marginBottom: tokens.margin.small }}
        >
          Save activity
        </Button>
      </div>
    </Flex>
  );
};
