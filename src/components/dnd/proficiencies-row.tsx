'use client'

import { useCharacter } from '@/store/character-store'
import { ARMOR_TYPES, type ArmorType } from '@/lib/dnd'
import { Star, Sparkles } from 'lucide-react'

/**
 * Bottom of page 1: Heroic Inspiration badge + Jack of All Trades toggle +
 * Equipment Training & Proficiencies (armor / weapons / tools).
 */
export function ProficienciesRow() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  const toggleArmorTraining = useCharacter((s) => s.toggleArmorTraining)
  const toggleHeroic = useCharacter((s) => s.toggleHeroicInspiration)
  const toggleJoAT = useCharacter((s) => s.toggleJackOfAllTrades)

  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2">
      {/* Heroic Inspiration + Jack of All Trades */}
      <div className="sheet-shield p-2 flex flex-col items-center justify-start gap-2">
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

        {/* Jack of All Trades toggle (under Heroic Inspiration) */}
        <button
          type="button"
          onClick={toggleJoAT}
          className="mt-2 w-full flex items-center gap-2 py-1.5 px-2 border text-[10px] font-bold uppercase tracking-wider"
          style={{
            borderColor: 'var(--rule)',
            color: sheet.jackOfAllTrades ? 'var(--ink)' : 'var(--ink-faint)',
            backgroundColor: sheet.jackOfAllTrades
              ? 'rgba(180, 138, 59, 0.18)'
              : 'transparent',
          }}
          aria-pressed={sheet.jackOfAllTrades}
          aria-label="Toggle Jack of All Trades (+1 to non-proficient ability checks)"
          title="Jack of All Trades — Bard level-2 feature: +1 to ability checks you are not proficient in"
        >
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-[9px] leading-tight text-left">
            Jack of All Trades
            <span className="block font-normal opacity-80">+1 to non-proficient checks</span>
          </span>
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
