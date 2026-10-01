// components/form/FormSelect.jsx
"use client";

import React from "react";
import Select from "react-select";
import { Controller, useFormContext } from "react-hook-form";
import { useTheme } from "@/components/providers/ThemeProvider";

const getStyles = (isDark) => ({
  control: (provided, state) => ({
    ...provided,
    minHeight: "44px",
    borderRadius: "10px",
    backgroundColor: isDark ? "#172033" : "transparent",
    borderColor: state.isFocused
      ? isDark
        ? "#7fb7ef"
        : "#000"
      : isDark
        ? "#3d4e6b"
        : "#d1d5db",
    boxShadow: "none",
    "&:hover": {
      borderColor: isDark ? "#7fb7ef" : "#000",
    },
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? isDark
        ? "#2f6db3"
        : "#000"
      : state.isFocused
        ? isDark
          ? "#1e2942"
          : "#f3f4f6"
        : isDark
          ? "#172033"
          : "#fff",
    color: state.isSelected ? "#fff" : isDark ? "#e8eef7" : "#111827",
    cursor: "pointer",
  }),

  placeholder: (provided) => ({
    ...provided,
    color: isDark ? "#7b8aa1" : "#9ca3af",
  }),

  input: (provided) => ({
    ...provided,
    color: isDark ? "#e8eef7" : "#111827",
  }),

  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    backgroundColor: isDark ? "#172033" : "#fff",
    borderColor: isDark ? "#2e3d57" : "#e5e7eb",
    boxShadow: isDark ? "0 10px 30px rgb(0 0 0 / 0.45)" : undefined,
  }),

  menuList: (provided) => ({
    ...provided,
    backgroundColor: isDark ? "#172033" : "#fff",
  }),

  noOptionsMessage: (provided) => ({
    ...provided,
    color: isDark ? "#8d9bb0" : "#9ca3af",
  }),

  groupHeading: (provided) => ({
    ...provided,
    color: isDark ? "#8d9bb0" : "#6b7280",
  }),

  multiValue: (provided) => ({
    ...provided,
    backgroundColor: isDark ? "#2c3b56" : "#000",
    borderRadius: "6px",
  }),

  multiValueLabel: (provided) => ({
    ...provided,
    color: "#fff",
  }),

  multiValueRemove: (provided) => ({
    ...provided,
    color: "#fff",
    cursor: "pointer",

    ":hover": {
      backgroundColor: "#dc2626",
      color: "#fff",
    },
  }),
});

const FormSelect = ({
  name,
  label,

  // data
  options = [],

  // customize keys
  labelKey = "label",
  valueKey = "id",

  // select config
  placeholder = "Select...",
  isMulti = false,
  isClearable = true,
  isDisabled = false,
  required = false,

  // remarks
  remark = "",

  // class names
  wrapperClass = "",
  labelClass = "",
  selectClass = "",
  remarkClass = "",

  // custom style
  customStyles = {},

  // extra props
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // dynamic option convert
  const formattedOptions = options?.map((item) => ({
    label: item?.[labelKey],
    value: item?.[valueKey],
    raw: item,
  }));

  const { theme } = useTheme();

  // merge styles
  const mergedStyles = {
    ...getStyles(theme === "dark"),
    ...customStyles,
  };

  return (
    <div className={`w-full ${wrapperClass}`}>
      {label && (
        <label
          htmlFor={name}
          className={`mb-1 text-gray-800 block text-sm font-medium ${labelClass}`}
        >
          {label}

          {required && (
            <span className="ml-1 text-red-700">*</span>
          )}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={{
          required: required
            ? `${label || name} is required`
            : false,
        }}
        render={({ field }) => {
          const selectedValue = isMulti
            ? formattedOptions.filter((option) =>
                field.value?.includes(option.value)
              )
            : formattedOptions.find(
                (option) => option.value === field.value
              ) || null;

          return (
            <Select
              {...props}
              inputId={name}
              options={formattedOptions}
              isMulti={isMulti}
              isClearable={isClearable}
              isDisabled={isDisabled}
              placeholder={placeholder}
              className={selectClass}
              styles={mergedStyles}
              value={selectedValue}
              onChange={(selected) => {
                if (isMulti) {
                  field.onChange(
                    selected
                      ? selected.map((item) => item.value)
                      : []
                  );
                } else {
                  field.onChange(selected?.value || "");
                }
              }}
            />
          );
        }}
      />

      {remark && (
        <p
          className={`mt-1 text-xs text-gray-500 ${remarkClass}`}
        >
          {remark}
        </p>
      )}

      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">
          {errors[name]?.message}
        </p>
      )}
    </div>
  );
};

export default FormSelect;