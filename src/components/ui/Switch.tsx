"use client";

import { cn } from "@/lib/utils/cn";
import { useId, type InputHTMLAttributes } from "react";

interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  "aria-label": string;
}

export function Switch({
  className,
  id,
  disabled,
  checked,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div
      className={cn(
        "md-switch",
        checked && "md-switch--selected",
        disabled && "md-switch--disabled",
        className,
      )}
    >
      <div className="md-switch__container">
        <input
          id={inputId}
          type="checkbox"
          role="switch"
          disabled={disabled}
          checked={checked}
          className="md-switch__input"
          {...props}
        />
        <span className="md-switch__track">
          <span className="md-switch__handle-container">
            <span className="md-switch__ripple" aria-hidden />
            <span className="md-switch__handle" />
          </span>
        </span>
      </div>
    </div>
  );
}
