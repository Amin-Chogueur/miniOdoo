import React, { ChangeEvent, ReactNode } from "react";

type InputPropsType = {
  children?: ReactNode;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  name: string;
  type: string;
  lable: string;
};

export default function Input({
  children,
  handleChange,
  value,
  placeholder,
  name,
  type,
  lable,
}: InputPropsType) {
  return (
    <div className="space-y-2 relative">
      <label className="block text-lg font-medium ">{lable}</label>
      <input
        onChange={handleChange}
        value={value}
        placeholder={placeholder}
        name={name}
        type={type}
        className="w-full px-4 py-3 rounded-xl outline-none text-base focus:ring-2 focus:ring-blue-500"
        style={{
          backgroundColor: "var(--background)",
          border: `1px solid var(--border)`,
          color: "var(--text-primary)",
        }}
      />
      {children}
    </div>
  );
}
