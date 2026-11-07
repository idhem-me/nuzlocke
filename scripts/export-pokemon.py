"""Export Nuzlocke's PokéAPI catalogue and sprite assets as local files."""

import csv
import io
import json
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import urlopen

DATA = "https://raw.githubusercontent.com/PokeAPI/pokeapi/6ea97b5641faa12e090866e8144ae8f57764fc64/data/v2/csv"
SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/1b3b7c0a538dd2226ae08d0d2f8955125075bbd4/sprites"
TYPE_ICONS = "types/generation-viii/brilliant-diamond-shining-pearl"
OUTPUT = Path(__file__).resolve().parents[1] / "exports" / "pokemon"
LANGUAGES = {"5": "fr", "6": "de", "7": "es", "8": "it", "9": "en", "12": "zh"}


def download(url):
    for attempt in range(4):
        try:
            with urlopen(url, timeout=25) as response:
                return response.read()
        except (URLError, TimeoutError):
            if attempt == 3:
                raise
        time.sleep(2 ** attempt)


def rows(table):
    source = download(f"{DATA}/{table}.csv").decode("utf-8-sig")
    return csv.DictReader(io.StringIO(source))


def write_png(source, destination, optional=False):
    try:
        contents = download(f"{SPRITES}/{source}")
    except HTTPError as error:
        if optional and error.code == 404:
            return False
        raise
    if not contents.startswith(b"\x89PNG\r\n\x1a\n"):
        raise ValueError(f"Invalid PNG: {source}")
    (OUTPUT / destination).write_bytes(contents)
    return True


def main():
    species = {
        int(row["id"]): row
        for row in rows("pokemon_species")
        if 1 <= int(row["id"]) <= 1025
    }
    if set(species) != set(range(1, 1026)):
        raise ValueError("Incomplete Nuzlocke species catalogue")
    names = defaultdict(dict)
    for row in rows("pokemon_species_names"):
        locale = LANGUAGES.get(row["local_language_id"])
        if locale:
            names[int(row["pokemon_species_id"])][locale] = row["name"]
    defaults = {
        int(row["species_id"]): int(row["id"])
        for row in rows("pokemon")
        if row["is_default"] == "1"
    }
    types = defaultdict(list)
    for row in rows("pokemon_types"):
        types[int(row["pokemon_id"])].append(int(row["type_id"]))

    def export_species(species_id):
        pokemon_id = defaults[species_id]
        sprite = f"sprites/{species_id}.png"
        has_sprite = write_png(f"pokemon/{pokemon_id}.png", sprite, optional=True)
        shiny = f"shiny/{species_id}.png"
        has_shiny = write_png(f"pokemon/shiny/{pokemon_id}.png", shiny, optional=True)
        return {
            "id": species_id,
            "names": names[species_id],
            "slug": species[species_id]["identifier"],
            "generation": int(species[species_id]["generation_id"]),
            "types": types[pokemon_id],
            "sprite": sprite if has_sprite else None,
            "shiny": shiny if has_shiny else None,
        }

    (OUTPUT / "sprites").mkdir(parents=True, exist_ok=True)
    (OUTPUT / "types").mkdir(exist_ok=True)
    (OUTPUT / "shiny").mkdir(exist_ok=True)
    with ThreadPoolExecutor(max_workers=16) as pool:
        catalogue = list(pool.map(export_species, sorted(species)))
        list(pool.map(
            lambda type_id: write_png(f"{TYPE_ICONS}/{type_id}.png", f"types/{type_id}.png"),
            range(1, 19),
        ))
    (OUTPUT / "catalogue.json").write_text(
        json.dumps(catalogue, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    missing = [entry["id"] for entry in catalogue if entry["sprite"] is None]
    print(f"{len(catalogue)} species, {len(catalogue) - len(missing)} sprites, 18 type icons")
    print(f"Species without sprites: {missing}")
    print(f"Shiny sprites: {sum(entry['shiny'] is not None for entry in catalogue)}")


if __name__ == "__main__":
    main()
