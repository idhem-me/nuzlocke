"use client";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from "@floating-ui/react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const inputId = useId();
  const listboxId = `${inputId}-listbox`;
  const suggestions = open && value.trim() ? search(value) : [];
  const floated = focused || value.length > 0;
  const showList = open && suggestions.length > 0;

  const { refs, floatingStyles, context, update } = useFloating({
    open,
    onOpenChange: setOpen,
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

  const dismiss = useDismiss(context, {
    outsidePressEvent: "pointerdown",
  });

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
  });

  const role = useRole(context, { role: "combobox" });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    dismiss,
    listNavigation,
    role,
  ]);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (showList) {
      update();
    }
  }, [showList, update, suggestions.length]);

  useEffect(() => {
    listRef.current = listRef.current.slice(0, suggestions.length);
    if (showList) {
      setActiveIndex(0);
    } else {
      setActiveIndex(null);
    }
  }, [showList, suggestions.length, value]);

  function selectSpecies(species: PokemonSpeciesEntry) {
    onSelect(species);
    setOpen(false);
  }

  const listbox = showList ? (
    <ul
      {...getFloatingProps({
        ref: refs.setFloating,
        id: listboxId,
        style: floatingStyles,
        className: cn(
          "pointer-events-auto z-50 overflow-y-auto py-2",
          "rounded-[var(--md-shape-corner-extra-small)]",
          "bg-[var(--md-sys-color-surface-container)]",
          "shadow-[var(--md-elevation-2)]",
          "border border-[var(--md-sys-color-outline-variant)]",
        ),
      })}
    >
      {suggestions.map((species, i) => (
        <li key={species.id}>
          <button
            type="button"
            {...getItemProps({
              ref(node) {
                listRef.current[i] = node;
              },
              active: activeIndex === i,
              selected: false,
              onPointerDown(e) {
                e.preventDefault();
                selectSpecies(species);
              },
              className: cn(
                stateLayer(),
                "w-full min-h-12 px-4 text-left md-body-large",
                i === activeIndex
                  ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                  : "text-[var(--md-sys-color-on-surface)]",
              ),
            })}
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
          {...getReferenceProps({
            ref: refs.setReference,
            id: inputId,
            disabled,
            value,
            placeholder: " ",
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: false,
            className: cn(
              "peer h-14 w-full rounded-[var(--md-shape-corner-extra-small)] px-4 pt-4 pb-1",
              "bg-transparent text-[var(--md-sys-color-on-surface)] md-body-large",
              "border border-[var(--md-sys-color-outline)]",
              "placeholder:text-transparent",
              "focus:outline-none focus:border-2 focus:border-[var(--md-sys-color-primary)] focus:px-[15px] focus:pt-[15px]",
              "disabled:text-[var(--md-sys-color-on-surface-disabled)] disabled:border-[var(--md-sys-color-on-surface)] disabled:opacity-[0.38] disabled:cursor-not-allowed",
            ),
            onChange(e) {
              onChange((e.target as HTMLInputElement).value);
              setOpen(true);
            },
            onFocus() {
              setFocused(true);
              setOpen(true);
            },
            onBlur() {
              setFocused(false);
              // iOS : relatedTarget est null au tap sur le portal — ne pas fermer
              // immédiatement ; laisser pointerdown sur l'option se terminer.
              window.setTimeout(() => {
                const active = document.activeElement;
                if (
                  !refs.floating.current?.contains(active) &&
                  active !== refs.domReference.current
                ) {
                  setOpen(false);
                }
              }, 0);
            },
            onKeyDown(e) {
              if (
                e.key === "Enter" &&
                activeIndex !== null &&
                suggestions[activeIndex]
              ) {
                e.preventDefault();
                selectSpecies(suggestions[activeIndex]);
              }
            },
          })}
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
