'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useCharacter } from '@/store/character-store'

const LEVELS = ['C', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

/**
 * Page 2 center column: Cantrips & Prepared Spells table.
 * Columns: Level / Name / Casting Time / Range / C·R·M / Concentration /
 * Ritual / Notes. Plus an Add-spell button.
 */
export function SpellsTable() {
  const sheet = useCharacter((s) => s.sheet)
  const addSpell = useCharacter((s) => s.addSpell)
  const updateSpell = useCharacter((s) => s.updateSpell)
  const removeSpell = useCharacter((s) => s.removeSpell)

  // Group by level for easier reading
  const byLevel = LEVELS.map((lvl) => ({
    level: lvl,
    spells: sheet.spells.filter((s) => s.level === lvl),
  }))

  return (
    <div className="sheet-panel p-2 flex flex-col">
      <div className="sheet-label-lg mb-1">CANTRIPS &amp; PREPARED SPELLS</div>
      <div
        className="grid grid-cols-[40px_1fr_70px_80px_70px_1fr_24px] gap-1 text-[10px] font-bold uppercase pb-1 border-b"
        style={{ color: 'var(--ink-soft)', borderColor: 'var(--rule)' }}
      >
        <div className="text-center">Level</div>
        <div>Name</div>
        <div className="text-center">Cast Time</div>
        <div className="text-center">Range</div>
        <div className="text-center">C·R·M</div>
        <div>Notes</div>
        <div />
      </div>
      <div className="max-h-[600px] overflow-y-auto sheet-scroll">
        {byLevel.map(({ level, spells }) => (
          <div key={level} className="mb-1">
            {spells.length === 0 ? null : (
              <div
                className="text-[9px] font-bold uppercase py-1 border-b"
                style={{
                  color: 'var(--ink-faint)',
                  borderColor: 'var(--rule-light)',
                }}
              >
                {level === 'C' ? 'Cantrips' : `Level ${level}`}
              </div>
            )}
            {spells.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-[40px_1fr_70px_80px_70px_1fr_24px] gap-1 py-0.5 items-center border-b"
                style={{ borderColor: 'var(--rule-light)' }}
              >
                {/* Level selector */}
                <select
                  value={s.level}
                  onChange={(e) => updateSpell(s.id, { level: e.target.value })}
                  className="bg-transparent border-0 outline-none text-[10px] font-bold text-center"
                  style={{ color: 'var(--ink)' }}
                  aria-label="Spell level"
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l === 'C' ? 'Cantrip' : `L${l}`}
                    </option>
                  ))}
                </select>

                {/* Name */}
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => updateSpell(s.id, { name: e.target.value })}
                  className="sheet-input-line text-xs"
                  placeholder="Spell name"
                  aria-label="Spell name"
                />

                {/* Cast time */}
                <input
                  type="text"
                  value={s.castingTime}
                  onChange={(e) => updateSpell(s.id, { castingTime: e.target.value })}
                  className="sheet-input-box text-[10px]"
                  placeholder="A"
                  aria-label="Casting time"
                />

                {/* Range */}
                <input
                  type="text"
                  value={s.range}
                  onChange={(e) => updateSpell(s.id, { range: e.target.value })}
                  className="sheet-input-box text-[10px]"
                  placeholder="60ft"
                  aria-label="Range"
                />

                {/* Components C·R·M + concentration + ritual */}
                <div className="flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      updateSpell(s.id, {
                        components: { ...s.components, c: !s.components.c },
                      })
                    }
                    className="flex items-center gap-0.5"
                    aria-label="Verbal component"
                  >
                    <span
                      className={`sheet-circle ${
                        s.components.c ? 'is-checked' : ''
                      }`}
                      style={{ width: 9, height: 9 }}
                    />
                    <span className="text-[9px]">V</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateSpell(s.id, {
                        components: { ...s.components, r: !s.components.r },
                      })
                    }
                    className="flex items-center gap-0.5"
                    aria-label="Somatic component"
                  >
                    <span
                      className={`sheet-circle ${
                        s.components.r ? 'is-checked' : ''
                      }`}
                      style={{ width: 9, height: 9 }}
                    />
                    <span className="text-[9px]">S</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateSpell(s.id, {
                        components: { ...s.components, m: !s.components.m },
                      })
                    }
                    className="flex items-center gap-0.5"
                    aria-label="Material component"
                  >
                    <span
                      className={`sheet-circle ${
                        s.components.m ? 'is-checked' : ''
                      }`}
                      style={{ width: 9, height: 9 }}
                    />
                    <span className="text-[9px]">M</span>
                  </button>
                </div>

                {/* Notes (also holds conc/ritual flags) */}
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      updateSpell(s.id, { concentration: !s.concentration })
                    }
                    className="text-[9px] font-bold px-0.5"
                    style={{
                      color: s.concentration ? 'var(--blood)' : 'var(--ink-faint)',
                      textDecoration: s.concentration ? 'underline' : 'none',
                    }}
                    title="Concentration"
                  >
                    C
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSpell(s.id, { ritual: !s.ritual })}
                    className="text-[9px] font-bold px-0.5"
                    style={{
                      color: s.ritual ? 'var(--gold)' : 'var(--ink-faint)',
                      textDecoration: s.ritual ? 'underline' : 'none',
                    }}
                    title="Ritual"
                  >
                    R
                  </button>
                  <input
                    type="text"
                    value={s.notes}
                    onChange={(e) => updateSpell(s.id, { notes: e.target.value })}
                    className="sheet-input-line text-[10px]"
                    placeholder="Effect / damage / save"
                    aria-label="Spell notes"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeSpell(s.id)}
                  className="text-[10px]"
                  style={{ color: 'var(--blood)' }}
                  aria-label="Remove spell"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addSpell}
        className="mt-1 text-[11px] flex items-center gap-1 hover:underline self-start"
        style={{ color: 'var(--ink-soft)' }}
      >
        <Plus className="w-3 h-3" /> Add spell
      </button>
    </div>
  )
}
