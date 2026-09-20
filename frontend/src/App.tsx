import { ConfigProvider } from "antd";
import { AllRoutes } from "./AllRoutes.tsx";
import { themeConfig } from "./theme/tokens.ts";
import "./css/index.css";

const App = () => (
  <ConfigProvider theme={themeConfig}>
    <AllRoutes />
  </ConfigProvider>
);

export default App;
