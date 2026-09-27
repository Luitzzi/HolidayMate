import {
  ProfileOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Flex, Grid, Layout, Menu, theme } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import logo from "../../assets/holidaymate-logo.png";

const { Header, Content } = Layout;

const NAV_ITEMS = [
  { key: "/planning", icon: <ScheduleOutlined />, label: "Planning" },
  { key: "/definition", icon: <ProfileOutlined />, label: "Definition" },
];

export const RootLayout = () => {
  const { token } = theme.useToken();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  // Icon-only navigation on phones, so it fits next to the logo.
  const navItems = screens.sm
    ? NAV_ITEMS
    : NAV_ITEMS.map(({ label, ...item }) => ({ ...item, title: label }));

  // Framed white box on larger screens (see docs/design-*.png), edge to edge on phones.
  const framed = screens.md;
  const gutter = framed ? token.paddingXL : token.padding;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Flex
        vertical
        style={{
          width: "100%",
          maxWidth: token.screenXL,
          minHeight: framed ? `calc(100vh - ${2 * token.marginXL}px)` : "100vh",
          margin: framed ? `${token.marginXL}px auto` : 0,
          background: token.colorBgContainer,
          ...(framed && {
            border: `${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowTertiary,
            // clip instead of hidden keeps position: sticky working inside the box
            overflow: "clip",
          }),
        }}
      >
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            gap: token.marginLG,
            padding: `0 ${gutter}px`,
            background: token.colorBgContainer,
            borderBottom: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`,
          }}
        >
          <Link to="/" style={{ display: "flex", flexShrink: 0 }}>
            <img
              src={logo}
              alt="HolidayMate"
              style={{ height: token.controlHeightLG, display: "block" }}
            />
          </Link>
          <Menu
            mode="horizontal"
            items={navItems}
            selectedKeys={[pathname]}
            onClick={({ key }) => navigate(key)}
            style={{ flex: 1, minWidth: 0, borderBottom: "none" }}
          />
          <Avatar size="large" icon={<UserOutlined />} />
        </Header>
        <Content style={{ padding: `${gutter}px ${gutter}px 0` }}>
          <Outlet />
        </Content>
      </Flex>
    </Layout>
  );
};
