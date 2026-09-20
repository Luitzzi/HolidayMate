import { Flex, Layout, theme } from 'antd';
import { Outlet } from 'react-router';

const { Content } = Layout;

export const RootLayout = () => {
  const { token } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
        <Flex justify="center" style={{ paddingTop: token.marginLG }}>
          <div style={{ width: '80%' }}>
            <Outlet />
          </div>
        </Flex>
      </Content>
    </Layout>
  );
};