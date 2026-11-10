import re

# Частые названия → единый код (как в каталоге авто с фото).
_LABEL_TO_CODE: dict[str, str] = {
    "китай": "China",
    "корея": "Korea",
    "южная корея": "Korea",
    "япония": "Japan",
    "оаэ": "UAE",
    "эмираты": "UAE",
}

_CYRILLIC = str.maketrans(
    {
        "а": "a",
        "б": "b",
        "в": "v",
        "г": "g",
        "д": "d",
        "е": "e",
        "ё": "e",
        "ж": "zh",
        "з": "z",
        "и": "i",
        "й": "y",
        "к": "k",
        "л": "l",
        "м": "m",
        "н": "n",
        "о": "o",
        "п": "p",
        "р": "r",
        "с": "s",
        "т": "t",
        "у": "u",
        "ф": "f",
        "х": "h",
        "ц": "ts",
        "ч": "ch",
        "ш": "sh",
        "щ": "sch",
        "ъ": "",
        "ы": "y",
        "ь": "",
        "э": "e",
        "ю": "yu",
        "я": "ya",
    }
)


def _transliterate(label: str) -> str:
    lower = label.strip().lower().translate(_CYRILLIC)
    parts = re.findall(r"[a-z0-9]+", lower)
    if not parts:
        return "Country"
    word = "".join(p.capitalize() for p in parts)
    return word[:32]


def make_country_code(label: str, taken: set[str]) -> str:
    key = label.strip().lower()
    base = _LABEL_TO_CODE.get(key) or _transliterate(label)
    if base not in taken:
        return base
    for i in range(2, 100):
        candidate = f"{base}{i}"[:32]
        if candidate not in taken:
            return candidate
    return base[:28] + "99"
