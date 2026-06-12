"use client";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react";
import { useEffect, useId, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { stateLayer } from "@/lib/utils/state-layer";
import type { PokemonSpeciesEntry } from "@/lib/pokemon/types";

interface PokemonAutocompleteProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSelect: (species: PokemonSpeciesEntry) => void;
  search: (query: string) => PokemonSpeciesEntry[];
}

export function PokemonAutocomplete({
  value,
  disabled,
  onChange,
  onSelect,
  search,
}: PokemonAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputId = useId();
  const listboxId = `${inputId}-listbox`;
  const suggestions = open && value.trim() ? search(value) : [];
  const floated = focused || value.length > 0;
  const showList = open && suggestions.length > 0;

  const { refs, floatingStyles, update } = useFloating({
    open: showList,
    strategy: "fixed",
    placement: "bottom-start",
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.max(0, availableHeight)}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (showList) {
      update();
    }
  }, [showList, update, suggestions.length]);

  useEffect(() => {
    if (!showList) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        refs.domReference.current?.contains(target) ||
        refs.floating.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showList, refs.domReference, refs.floating]);

  useEffect(() => {
    if (!showList) return;
    document
      .getElementById(`${inputId}-option-${highlight}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [highlight, showList, inputId]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && suggestions[highlight]) {
      e.preventDefault();
      onSelect(suggestions[highlight]);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const listbox = showList ? (
    <ul
      ref={refs.setFloating}
      id={listboxId}
      style={floatingStyles}
      className={cn(
        "z-50 overflow-y-auto py-2",
        "rounded-[var(--md-shape-corner-extra-small)]",
        "bg-[var(--md-sys-color-surface-container)]",
        "shadow-[var(--md-elevation-2)]",
        "border border-[var(--md-sys-color-outline-variant)]",
      )}
      role="listbox"
    >
      {suggestions.map((species, i) => (
        <li
          key={species.id}
          id={`${inputId}-option-${i}`}
          role="option"
          aria-selected={i === highlight}
        >
          <button
            type="button"
            className={cn(
              stateLayer(),
              "w-full min-h-12 px-4 text-left md-body-large",
              i === highlight
                ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                : "text-[var(--md-sys-color-on-surface)]",
            )}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(species);
              setOpen(false);
            }}
          >
            {species.nameFr}
          </button>
        </li>
      ))}
    </ul>
  ) : null;

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={refs.setReference}
          id={inputId}
          disabled={disabled}
          value={value}
          placeholder=" "
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            showList && suggestions[highlight]
              ? `${inputId}-option-${highlight}`
              : undefined
          }
          className={cn(
            "peer h-14 w-full rounded-[var(--md-shape-corner-extra-small)] px-4 pt-4 pb-1",
            "bg-transparent text-[var(--md-sys-color-on-surface)] md-body-large",
            "border border-[var(--md-sys-color-outline)]",
            "placeholder:text-transparent",
            "focus:outline-none focus:border-2 focus:border-[var(--md-sys-color-primary)] focus:px-[15px] focus:pt-[15px]",
            "disabled:text-[var(--md-sys-color-on-surface-disabled)] disabled:border-[var(--md-sys-color-on-surface)] disabled:opacity-[0.38] disabled:cursor-not-allowed",
          )}
          onChange={(e) => {
            onChange(e.target.value);
            setHighlight(0);
            setOpen(true);
          }}
          onFocus={() => {
            setFocused(true);
            setOpen(true);
          }}
          onBlur={(e) => {
            setFocused(false);
            const related = e.relatedTarget as Node | null;
            if (related && refs.floating.current?.contains(related)) {
              return;
            }
            setOpen(false);
          }}
          onKeyDown={handleKeyDown}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-4 pointer-events-none transition-all duration-150",
            "text-[var(--md-sys-color-on-surface-variant)]",
            floated
              ? "top-1 md-label-small"
              : "top-1/2 -translate-y-1/2 md-body-large",
            focused && "text-[var(--md-sys-color-primary)]",
            disabled && "text-[var(--md-sys-color-on-surface-disabled)]",
            "peer-focus:top-1 peer-focus:md-label-small peer-focus:-translate-y-0",
            "peer-focus:text-[var(--md-sys-color-primary)]",
            "peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:md-label-small peer-[:not(:placeholder-shown)]:-translate-y-0",
          )}
        >
          Pokémon
        </label>
      </div>
      {mounted && listbox ? createPortal(listbox, document.body) : null}
    </div>
  );
}
