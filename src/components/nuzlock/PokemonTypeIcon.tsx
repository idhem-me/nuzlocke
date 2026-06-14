import Image from "next/image";
import {
  getPokemonTypeIconUrl,
  getPokemonTypeInfo,
} from "@/lib/pokemon/type-sprites";

interface PokemonTypeIconProps {
  typeId: number;
}

export function PokemonTypeIcon({ typeId }: PokemonTypeIconProps) {
  const type = getPokemonTypeInfo(typeId);
  if (!type) return null;

  return (
    <Image
      src={getPokemonTypeIconUrl(typeId)}
      alt={type.nameFr}
      width={80}
      height={16}
      className="h-4 w-auto object-contain"
      unoptimized
    />
  );
}
