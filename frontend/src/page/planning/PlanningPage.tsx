import {
  App,
  Button,
  Collapse,
  DatePicker,
  Empty,
  Flex,
  Input,
  Listy,
  Select,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  SectionHeader,
  TitleDivider,
} from "../../components/SectionHeader.tsx";
import type { ActivityUiDTO } from "../../generated/interface-api.ts";
import { tokens } from "../../theme/tokens.ts";
import { buildPackingList, type PackingListEntry } from "./packingList.ts";
import { activityApi } from "../../api/activityApi.ts";

const { RangePicker } = DatePicker;

export const PlanningPage = () => {
  const { message } = App.useApp();

  const [activities, setActivities] = useState<ActivityUiDTO[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityApi
      .getAll()
      .then(setActivities)
      .catch((error: Error) =>
        message.error(`Could not load activities: ${error.message}`),
      )
      .finally(() => setLoading(false));
  }, [message]);

  const packingList = useMemo(
    () =>
      buildPackingList(
        activities.filter(({ id }) => id && selectedIds.includes(id)),
      ),
    [activities, selectedIds],
  );

  return (
    <Flex vertical>
      <SectionHeader
        title="Planning Menu"
        description="Let HolidayMate generate a packing list based on the location's weather and your defined holiday type."
      />

      <Collapse
        size="large"
        defaultActiveKey={["selection"]}
        items={[
          {
            key: "selection",
            label: (
              <Typography.Text
                strong
                style={{ fontSize: tokens.fontSize.large }}
              >
                Holiday Selection
              </Typography.Text>
            ),
            children: (
              <Flex vertical gap={tokens.gap.small}>
                <RangePicker
                  size="large"
                  placeholder={["Start date", "End date"]}
                  style={{ width: "100%" }}
                />
                <Input size="large" placeholder="Location" />
                <Select
                  size="large"
                  mode="multiple"
                  placeholder="Activities"
                  loading={loading}
                  value={selectedIds}
                  onChange={setSelectedIds}
                  options={activities.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  }))}
                  style={{ width: "100%" }}
                />
              </Flex>
            ),
          },
        ]}
      />

      <div style={{ marginTop: tokens.margin.large }}>
        <TitleDivider
          title="Generated Packing List"
          level={5}
          extra={
            <Button disabled title="PDF export is not available yet">
              PDF
            </Button>
          }
        />
      </div>

      {packingList.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Select activities to generate a packing list"
        />
      ) : (
        <Listy<PackingListEntry>
          items={packingList}
          rowKey="key"
          group={{
            key: (entry) => entry.category,
            title: (category) => (
              <Typography.Text strong>{category}</Typography.Text>
            ),
          }}
          itemRender={({ name, amount }) => (
            <Flex justify="space-between">
              <Typography.Text>{name}</Typography.Text>
              <Typography.Text strong>{amount}</Typography.Text>
            </Flex>
          )}
        />
      )}
    </Flex>
  );
};
