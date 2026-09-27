import { Divider, Flex, Typography, theme } from "antd";
import type { ReactNode } from "react";

type TitleDividerProps = {
  title: string;
  level?: 4 | 5;
  extra?: ReactNode;
};

/** Divider with a primary colored title, as used for page and section titles. */
export const TitleDivider = ({
  title,
  level = 4,
  extra,
}: TitleDividerProps) => {
  const { token } = theme.useToken();

  return (
    <Flex align="center" gap={token.marginSM}>
      <Divider
        styles={{
          root: { flex: 1, width: "auto", minWidth: 0 },
          rail: { borderTopColor: token.colorPrimary },
          content: { color: token.colorPrimary },
        }}
      >
        <Typography.Title level={level} style={{ margin: 0, color: "inherit" }}>
          {title}
        </Typography.Title>
      </Divider>
      {extra}
    </Flex>
  );
};

type PageHeaderProps = {
  title: string;
  description: string;
};

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  const { token } = theme.useToken();

  return (
    <>
      <TitleDivider title={title} />
      <Typography.Paragraph
        type="secondary"
        style={{ fontSize: token.fontSizeLG }}
      >
        {description}
      </Typography.Paragraph>
    </>
  );
};
