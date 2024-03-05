import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RowDropBox({ onRowChange }: { onRowChange: Function }) {
  const handleChange = (newValue: string) => {
    if (onRowChange) {
      onRowChange(newValue);
    }
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-[65px]">
        <SelectValue placeholder="10" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="40">40</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
