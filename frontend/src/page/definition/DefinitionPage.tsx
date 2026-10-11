import { useEffect, useMemo, useState } from "react";
import type {
  ActivityUiDTO,
  CategoryUiDTO,
} from "../../generated/interface-api.ts";
import { activityApi } from "../../api/activityApi.ts";
import {
  buildApiFetchErrorMessage,
  buildApiPostErrorMessage,
} from "../../api/utils/fetch.ts";
import { categoryApi } from "../../api/categoryApi.ts";
import { App, Button, Flex, Form, Select, Spin } from "antd";
import { SectionHeader } from "../../components/SectionHeader.tsx";
import { tokens } from "../../theme/tokens.ts";
import { PlusOutlined } from "@ant-design/icons";
import {
  type SelectOption,
  toSelectOption,
  toSelectOptions,
} from "../../components/SelectOption.ts";
import {
  type DefinitionFormValues,
  toActivityUiDTO,
  toDefinitionFormValues,
} from "./utils/activityDefinitonFormUtils.ts";
import { ActivityDefinitionForm } from "./components/ActivityDefinitionForm.tsx";
import { useNavigate } from "react-router";

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

  const [categoriesByName, setCategoriesByName] = useState<
    Map<string, CategoryUiDTO>
  >(new Map());
  const categoryOptionsByName = useMemo(
    () =>
      new Map(
        [...categoriesByName].map(([name, category]) => [
          name,
          toSelectOption(
            category,
            (category) => category.name,
            (category) => category.name,
          ),
        ]),
      ),
    [categoriesByName],
  );
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  useEffect(() => {
    setCategoriesLoading(true);
    categoryApi
      .getAllCategories()
      .then((result) => {
        const categoriesByName = new Map(
          result.map((result) => [result.name.toLowerCase(), result]),
        );
        setCategoriesByName(categoriesByName);
      })
      .catch((err: Error) =>
        message.error(buildApiFetchErrorMessage("categories", err.message)),
      )
      .finally(() => setCategoriesLoading(false));
  }, [message]);

  const isCategoryNameValid = (name: string) => {
    return name !== "" && !categoriesByName?.has(name.toLowerCase());
  };

  const addCategory = (category: CategoryUiDTO) => {
    setCategoriesByName((prev) =>
      new Map(prev).set(category.name.toLowerCase(), category),
    );
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

  const [saving, setSaving] = useState<boolean>(false);
  const saveActivity = async () => {
    try {
      await form.validateFields({ recursive: true });
    } catch {
      message.error("Please fill out all input fields");
      return;
    }
    const formValues: DefinitionFormValues = form.getFieldsValue(true);
    const activity: ActivityUiDTO = toActivityUiDTO(formValues);
    setSaving(true);
    const successText = "Activity was saved";
    if (selectedActivityId) {
      activityApi
        .updateActivity(selectedActivityId, activity)
        .then(() => {
          message.success(successText);
          navigate("/planning");
        })
        .catch((err: Error) =>
          message.error(buildApiPostErrorMessage("activity", err.message)),
        )
        .finally(() => setSaving(false));
    } else {
      activityApi
        .createActivity(activity)
        .then(() => {
          message.success(successText);
          navigate("/planning");
        })
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
          onChange={(id) => showActivity(id)}
          style={{ flex: 1 }}
        />
        <Button icon={<PlusOutlined />} onClick={() => showActivity()}>
          New activity
        </Button>
      </Flex>

      {categoriesLoading ? (
        <Spin />
      ) : (
        <ActivityDefinitionForm
          form={form}
          categoriesByName={categoriesByName}
          categoryOptionsByName={categoryOptionsByName}
          addCategory={addCategory}
          isCategoryNameValid={isCategoryNameValid}
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
          onClick={saveActivity}
          style={{ marginBottom: tokens.margin.small }}
        >
          Save activity
        </Button>
      </div>
    </Flex>
  );
};
