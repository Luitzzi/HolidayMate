import {Outlet} from "react-router";
import {Content} from "antd/es/layout/layout";
import {Flex} from "antd";

export const RootLayout = () => {
    return (
        <Content>
            <Flex justify={"center"}>
                <div style={{width: "80%", padding: "10px", marginTop: "15px", border: "solid 2px"}}>
                    <Outlet />
                </div>
            </Flex>
        </Content>
    );
}