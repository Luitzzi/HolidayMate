import type { ThemeConfig } from "antd";

/**
 * Seed tokens from docs/ant-d-design-system.md (the design system's
 * source of truth). Ant Design's defaultAlgorithm derives every other
 * token — hover/active states, per-component radius tiers, shadows —
 * from these seeds, so only seeds are declared here.
 */
export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#1677FF",
    colorSuccess: "#52C41A",
    colorWarning: "#FAAD14",
    colorError: "#FF4D4F",
    colorInfo: "#1677FF",
    colorTextBase: "#1F1F1F",
    borderRadius: 6,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    fontSize: 14,
  },
};
