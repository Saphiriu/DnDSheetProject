'use client'

import { useCharacter } from '@/store/character-store'
import { ARMOR_TYPES, type ArmorType } from '@/lib/dnd'
import { Star } from 'lucide-react'

/**
 * Bottom of page 1: Heroic Inspiration badge + Equipment Training &
 * Proficiencies (armor / weapons / tools).
 */
export function ProficienciesRow() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  const toggleArmorTraining = useCharacter((s) => s.toggleArmorTraining)
  const toggleHeroic = useCharacter((s) => s.toggleHeroicInspiration)

  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2">
      {/* Heroic Inspiration */}
      <div className="sheet-shield p-2 flex flex-col items-center justify-start">
        <div className="sheet-label">HEROIC INSPIRATION</div>
        <button
          type="button"
          onClick={toggleHeroic}
          className={`sheet-star mt-1 ${sheet.heroicInspiration ? 'is-active' : ''}`}
          aria-pressed={sheet.heroicInspiration}
          aria-label="Toggle heroic inspiration"
        >
          <Star className="w-4 h-4" />
        </button>
      </div>

      {/* Equipment training & proficiencies */}
      <div className="sheet-panel p-2 flex flex-col gap-2">
        <div className="sheet-label-lg">EQUIPMENT TRAINING &amp; PROFICIENCIES</div>

        {/* Armor training diamonds */}
        <div>
          <div className="sheet-label mb-1">Armor Training</div>
          <div className="grid grid-cols-4 gap-1">
            {ARMOR_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleArmorTraining(t as ArmorType)}
                className="flex items-center gap-1.5 py-1 px-1 border text-[11px]"
                style={{
                  borderColor: 'var(--rule)',
                  color: 'var(--ink)',
                  backgroundColor: sheet.armorTraining[t as ArmorType]
                    ? 'rgba(180, 138, 59, 0.15)'
                    : 'transparent',
                }}
                aria-label={`Toggle ${t} armor training`}
              >
                <span
                  className={`sheet-diamond ${
                    sheet.armorTraining[t as ArmorType] ? 'is-checked' : ''
                  }`}
                  style={{ width: 10, height: 10 }}
                />
                <span className="font-bold">{t}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Weapons & tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <LabeledField
            label="Weapons"
            value={sheet.weaponsProficient}
            onChange={(v) => setField('weaponsProficient', v)}
            rows={2}
            placeholder="Simple weapons, martial weapons, …"
          />
          <LabeledField
            label="Tools"
            value={sheet.toolsProficient}
            onChange={(v) => setField('toolsProficient', v)}
            rows={2}
            placeholder="Thieves' tools, lute, …"
          />
        </div>
      </div>
    </div>
  )
}

function LabeledField({
  label,
  value,
  onChange,
  rows = 1,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
}) {
  return (
    <div className="flex flex-col">
      <div className="sheet-label text-left mb-0.5">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="sheet-input-line text-xs resize-none"
        placeholder={placeholder}
        aria-label={label}
      />
    </div>
  )
}
