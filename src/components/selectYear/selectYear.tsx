import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectYear() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Years" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Years</SelectLabel>
          <SelectItem value="February">2024</SelectItem>
          <SelectItem value="March">2023</SelectItem>
          <SelectItem value="April">2022</SelectItem>
          <SelectItem value="January">2021</SelectItem>
          <SelectItem value="January">2020</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
