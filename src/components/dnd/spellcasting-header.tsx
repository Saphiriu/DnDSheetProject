'use client'

import { useCharacter } from '@/store/character-store'
import { suggestedSpellSlots } from '@/lib/dnd'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Top of page 2 left column: spellcasting ability, modifier, save DC,
 * spell attack bonus. Plus the 3x3 spell slots grid to its right.
 */
export function SpellcastingHeader() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  const setSpellSlotTotal = useCharacter((s) => s.setSpellSlotTotal)
  const toggleSpellSlotExpended = useCharacter((s) => s.toggleSpellSlotExpended)

  function autoFillSlots() {
    const level = typeof sheet.level === 'number' ? sheet.level : 1
    const suggested = suggestedSpellSlots(level)
    suggested.forEach((total, idx) => {
      setSpellSlotTotal(idx + 1, total)
    })
    toast.success(`Filled spell slots for level ${level} (full caster)`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2">
      {/* Spellcasting stats (left) */}
      <div className="sheet-panel p-2 flex flex-col gap-1.5">
        <div className="sheet-label-lg text-center">SPELLCASTING</div>

        <SpellStat
          label="Spellcasting Ability"
          value={sheet.spellcastingAbility}
          onChange={(v) => setField('spellcastingAbility', v)}
          placeholder="Charisma"
        />
        <SpellStat
          label="Spellcasting Modifier"
          value={sheet.spellcastingModifier}
          onChange={(v) => setField('spellcastingModifier', v)}
          placeholder="+3"
        />
        <SpellStat
          label="Spell Save DC"
          value={sheet.spellSaveDC}
          onChange={(v) => setField('spellSaveDC', v)}
          placeholder="14"
        />
        <SpellStat
          label="Spell Attack Bonus"
          value={sheet.spellAttackBonus}
          onChange={(v) => setField('spellAttackBonus', v)}
          placeholder="+5"
        />
      </div>

      {/* Spell slots (3x3 grid) */}
      <div className="sheet-panel p-2">
        <div className="flex items-center justify-between mb-1">
          <div className="sheet-label-lg">SPELL SLOTS</div>
          <button
            type="button"
            onClick={autoFillSlots}
            className="text-[10px] flex items-center gap-1"
            style={{ color: 'var(--ink-soft)' }}
            title="Auto-fill from full caster table"
          >
            <RefreshCw className="w-3 h-3" /> auto-fill
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {sheet.spellSlots.map((slot, idx) => {
            const level = idx + 1
            const slotsArr = Array.from({ length: slot.total }, (_, i) => i < slot.expended)
            return (
              <div
                key={level}
                className="border p-1 flex flex-col items-center"
                style={{ borderColor: 'var(--rule)' }}
              >
                <div className="sheet-label">LEVEL {level}</div>
                <div
                  className="text-[9px] font-bold uppercase flex gap-2 w-full justify-center"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  <span>
                    Total: <input
                      type="number"
                      min={0}
                      max={9}
                      value={slot.total}
                      onChange={(e) =>
                        setSpellSlotTotal(
                          level,
                          Math.max(0, Math.min(9, parseInt(e.target.value, 10) || 0)),
                        )
                      }
                      className="w-5 bg-transparent border-0 border-b outline-none text-center"
                      style={{ borderColor: 'var(--rule)' }}
                      aria-label={`Total level ${level} slots`}
                    />
                  </span>
                  <span>Exp: {slot.expended}</span>
                </div>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {slotsArr.length === 0 ? (
                    <span
                      className="text-[10px] italic"
                      style={{ color: 'var(--ink-faint)' }}
                    >
                      —
                    </span>
                  ) : (
                    slotsArr.map((expended, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleSpellSlotExpended(level, i)}
                        className={`sheet-diamond ${expended ? 'is-filled' : ''}`}
                        aria-label={`Level ${level} slot ${i + 1} expended`}
                        style={{ width: 11, height: 11 }}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SpellStat({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="flex flex-col">
      <div className="sheet-label text-left">{label}</div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sheet-input-line text-sm font-bold"
        placeholder={placeholder}
        aria-label={label}
      />
    </div>
  )
}
