import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface PokemonSpriteProps {
  src: string | null;
  name: string;
  size?: number;
  className?: string;
}

export function PokemonSprite({
  src,
  name,
  size = 56,
  className,
}: PokemonSpriteProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex aspect-square max-h-full max-w-full items-center justify-center rounded-[var(--md-shape-corner-small)]",
          "bg-[var(--md-sys-color-surface-container)]",
          className,
        )}
        style={{ width: size, height: size, maxHeight: "100%", maxWidth: "100%" }}
        aria-hidden
      >
        <span className="text-2xl opacity-30">?</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      style={{ width: size, height: size, maxWidth: "100%", maxHeight: "100%" }}
      unoptimized
    />
  );
}
