import { PlusOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Listy, Tag, Typography } from "antd";
import { useNavigate } from "react-router";
import { SectionHeader } from "../../components/SectionHeader.tsx";
import { tokens } from "../../theme/tokens.ts";

type PlannedHoliday = {
  id: string;
  location: string;
  startDate: string;
  endDate: string;
  activities: string[];
};

// Filled from the backend once planned holidays can be saved.
const holidays: PlannedHoliday[] = [];

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString(undefined, { dateStyle: "medium" });

export const HolidayListPage = () => {
  const navigate = useNavigate();

  const planHoliday = () => navigate("/planning");

  return (
    <Flex vertical>
      <SectionHeader
        title="Planned Holidays"
        description="Your upcoming trips and their packing lists."
      />

      {holidays.length === 0 ? (
        <Empty description="No holidays planned yet">
          <Button type="primary" icon={<PlusOutlined />} onClick={planHoliday}>
            Plan a holiday
          </Button>
        </Empty>
      ) : (
        <Flex vertical gap={tokens.gap.large}>
          <Listy<PlannedHoliday>
            items={holidays}
            rowKey="id"
            itemRender={({ location, startDate, endDate, activities }) => (
              <Flex vertical gap={tokens.gap.small}>
                <Typography.Text strong>{location}</Typography.Text>
                <Typography.Text type="secondary">
                  {formatDate(startDate)} – {formatDate(endDate)}
                </Typography.Text>
                <Flex wrap gap={tokens.gap.small}>
                  {activities.map((activity) => (
                    <Tag key={activity}>{activity}</Tag>
                  ))}
                </Flex>
              </Flex>
            )}
          />
          <Button
            type="primary"
            size="large"
            block
            icon={<PlusOutlined />}
            onClick={planHoliday}
          >
            Plan a holiday
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
