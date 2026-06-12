"use client";

import { cn } from "@/lib/utils/cn";
import { useId, useState, type InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: boolean;
}

export function TextField({
  label,
  helperText,
  error,
  className,
  id,
  disabled,
  value,
  defaultValue,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [focused, setFocused] = useState(false);
  const hasValue =
    value !== undefined && value !== ""
      ? true
      : defaultValue !== undefined && defaultValue !== "";
  const floated = focused || hasValue;

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      <div className="relative">
        <input
          id={inputId}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          placeholder=" "
          className={cn(
            "peer h-14 w-full rounded-[var(--md-shape-corner-extra-small)] px-4 pt-4 pb-1",
            "bg-transparent text-[var(--md-sys-color-on-surface)] md-body-large",
            "border border-[var(--md-sys-color-outline)]",
            "placeholder:text-transparent",
            "focus:outline-none focus:border-2 focus:border-[var(--md-sys-color-primary)] focus:px-[15px] focus:pt-[15px]",
            "disabled:text-[var(--md-sys-color-on-surface-disabled)] disabled:border-[var(--md-sys-color-on-surface)] disabled:opacity-[0.38] disabled:cursor-not-allowed",
            error && "border-[var(--md-sys-color-error)] focus:border-[var(--md-sys-color-error)]",
          )}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          aria-invalid={error || undefined}
          aria-describedby={
            helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-4 pointer-events-none transition-all duration-150",
            "text-[var(--md-sys-color-on-surface-variant)]",
            floated
              ? "top-1 md-label-small"
              : "top-1/2 -translate-y-1/2 md-body-large",
            focused && !error && "text-[var(--md-sys-color-primary)]",
            error && "text-[var(--md-sys-color-error)]",
            disabled && "text-[var(--md-sys-color-on-surface-disabled)]",
            "peer-focus:top-1 peer-focus:md-label-small peer-focus:-translate-y-0",
            !error && "peer-focus:text-[var(--md-sys-color-primary)]",
            error && "peer-focus:text-[var(--md-sys-color-error)]",
            "peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:md-label-small peer-[:not(:placeholder-shown)]:-translate-y-0",
          )}
        >
          {label}
        </label>
      </div>
      {helperText && (
        <p
          id={`${inputId}-helper`}
          className={cn(
            "px-4 md-body-small",
            error
              ? "text-[var(--md-sys-color-error)]"
              : "text-[var(--md-sys-color-on-surface-variant)]",
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
