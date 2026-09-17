import {Button, DatePicker, Flex, Input, Select} from "antd";
import useTheme from "antd/es/config-provider/hooks/useTheme";
const { RangePicker } = DatePicker;

export const PlanningPage = () => {
    const theme = useTheme();
    return (
        <Flex align={"center"} vertical>
            <h1>Planung</h1>
            <Flex align={"center"} style={{width: "500px", padding: "5px", border: "solid 1px"}} gap={"small"} vertical>
                <h2>Holiday-Metadata</h2>
                <RangePicker placeholder={["Startdatum","Enddatum"]} width={"100px"} />
                <Input placeholder={"Zielort"} />
                <Select placeholder={"Holiday-Variante"} />
            </Flex>
            <Flex align={"center"} justify={"space-between"} style={{border: `} ${token.borderStyleBase}`}}>
                <h2>Generierte Packlist</h2>
                <Button>PDF</Button>
            </Flex>

        </Flex>
    )
} 