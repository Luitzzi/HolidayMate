import {
  Button,
  Card,
  DatePicker,
  Flex,
  Input,
  Select,
  Typography,
  theme,
} from "antd";

const { RangePicker } = DatePicker;
const { Title } = Typography;

export const PlanningPage = () => {
  const { token } = theme.useToken();

  return (
    <Flex align="center" vertical gap={token.marginLG}>
      <Title level={2} style={{ marginBottom: 0 }}>
        Planung
      </Title>

      <Card title="Holiday-Metadata" style={{ width: 500 }}>
        <Flex vertical gap={token.marginSM}>
          <RangePicker
            placeholder={["Startdatum", "Enddatum"]}
            style={{ width: "100%" }}
          />
          <Input placeholder="Zielort" />
          <Select placeholder="Holiday-Variante" style={{ width: "100%" }} />
        </Flex>
      </Card>

      <Card style={{ width: 500 }}>
        <Flex align="center" justify="space-between">
          <Title level={5} style={{ marginBottom: 0 }}>
            Generierte Packliste
          </Title>
          <Button>PDF</Button>
        </Flex>
      </Card>
    </Flex>
  );
};
