import type { SelectOption } from "../../components/SelectOption.ts";
import {Select} from "antd";

export type CategorySelectProps = {
  categoryOptions: SelectOption<string>[];
  onCreate: () => void;
};

export const CategorySelect = ({
  categoryOptions, onCreate}: CategorySelectProps) => {
  return (

  )
};
