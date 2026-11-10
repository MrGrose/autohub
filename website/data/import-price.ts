export type ImportPriceCountry = {
  id: string
  code: string
  label: string
}

export type ImportPriceSegment = {
  id: string
  label: string
}

export type ImportPriceItem = {
  id: string
  name: string
  specs: string
  horsepower?: string | null
}

export type ImportPriceSection = {
  id: string
  country: ImportPriceCountry
  segment: ImportPriceSegment | null
  items: ImportPriceItem[]
}

export type ImportPriceData = {
  countries: ImportPriceCountry[]
  segments: ImportPriceSegment[]
  sections: ImportPriceSection[]
}

export function parseEngineSpecs(specs: string): string[] {
  return specs
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
}

export type ParsedEngineOption = {
  engine: string
  hp: string | null
}

/** Отделяет л.с. от описания двигателя в одной опции. */
export function parseEngineOption(part: string): ParsedEngineOption {
  const text = part.trim()
  if (!text) return { engine: '', hp: null }

  const parenMatch = text.match(/\(([^)]+?\s*л\.?\s*с\.?)\)\s*$/i)
  if (parenMatch && parenMatch.index !== undefined) {
    const hp = parenMatch[1].replace(/\s*л\.?\s*с\.?\s*$/i, '').trim()
    const engine = text.slice(0, parenMatch.index).trim()
    return { engine: engine || text, hp: hp || null }
  }

  const trailingMatch = text.match(/^(.+?)\s+(\d[\d\s/.]*)\s*л\.?\s*с\.?\s*$/i)
  if (trailingMatch) {
    return { engine: trailingMatch[1].trim(), hp: trailingMatch[2].trim() }
  }

  return { engine: text, hp: null }
}

export function parseEngineOptions(specs: string, horsepower?: string | null): ParsedEngineOption[] {
  const engines = parseEngineSpecs(specs)
  const hps = horsepower ? parseEngineSpecs(horsepower) : []

  if (engines.length === 0) {
    return parseEngineSpecs(specs).map(parseEngineOption)
  }

  return engines.map((engine, index) => ({
    engine,
    hp: hps[index]?.trim() || parseEngineOption(engine).hp,
  }))
}

export function sectionTitle(section: ImportPriceSection): string {
  if (section.segment) {
    return `${section.country.label} · ${section.segment.label}`
  }
  return section.country.label
}
