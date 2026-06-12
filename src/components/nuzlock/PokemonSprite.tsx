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
          "flex items-center justify-center rounded-[var(--md-shape-corner-small)]",
          "bg-[var(--md-sys-color-surface-container)]",
          className,
        )}
        style={{ width: size, height: size }}
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
      className={cn("object-contain", className)}
      unoptimized
    />
  );
}
