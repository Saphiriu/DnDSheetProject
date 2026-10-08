'use client'

import { useCharacter } from '@/store/character-store'

/**
 * The 6-cell horizontal stat bar that appears below the identity header
 * on page 1: PROFICIENCY BONUS, INTELLIGENCE, INITIATIVE, SPEED, SIZE,
 * PASSIVE PERCEPTION.
 *
 * Each cell is a small parchment panel with a header label and a single
 * editable value underneath.
 */
export function StatsBar() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)

  const cells: {
    label: string
    value: string
    onChange: (v: string) => void
    wide?: boolean
  }[] = [
    {
      label: 'PROFICIENCY BONUS',
      value: sheet.proficiencyBonus,
      onChange: (v) => setField('proficiencyBonus', v),
    },
    {
      label: 'INTELLIGENCE',
      value: sheet.intelligence,
      onChange: (v) => setField('intelligence', v),
    },
    {
      label: 'INITIATIVE',
      value: sheet.initiative,
      onChange: (v) => setField('initiative', v),
    },
    {
      label: 'SPEED',
      value: sheet.speed,
      onChange: (v) => setField('speed', v),
    },
    {
      label: 'SIZE',
      value: sheet.size,
      onChange: (v) => setField('size', v),
    },
    {
      label: 'PASSIVE PERCEPTION',
      value: sheet.passivePerception,
      onChange: (v) => setField('passivePerception', v),
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-1.5">
      {cells.map((c) => (
        <div
          key={c.label}
          className="sheet-panel flex flex-col items-center justify-center py-1.5 px-1"
        >
          <div className="sheet-label">{c.label}</div>
          <input
            type="text"
            value={c.value}
            onChange={(e) => c.onChange(e.target.value)}
            className="w-full bg-transparent border-0 outline-none text-center text-base font-extrabold mt-0.5"
            style={{ color: 'var(--ink)' }}
            aria-label={c.label}
          />
        </div>
      ))}
    </div>
  )
}
