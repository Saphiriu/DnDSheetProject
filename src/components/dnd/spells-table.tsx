'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Flame, Clock, Target } from 'lucide-react'
import { useCharacter } from '@/store/character-store'

const LEVELS = ['C', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

/**
 * Page 2 center column: Cantrips & Prepared Spells.
 *
 * Spells are displayed as cards (not table rows) grouped by level. Each card
 * shows the spell name, level badge, components (V/S/M), concentration / ritual
 * tags, cast time + range, a short mechanical note, and a fully-editable
 * description (the full spell text). Cards can collapse to save space.
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
      <div className="flex items-center justify-between mb-2">
        <div className="sheet-label-lg">CANTRIPS &amp; PREPARED SPELLS</div>
        <button
          type="button"
          onClick={addSpell}
          className="text-[11px] flex items-center gap-1 px-2 py-1 border hover:bg-rule/10 transition-colors"
          style={{ color: 'var(--ink-soft)', borderColor: 'var(--rule)' }}
        >
          <Plus className="w-3 h-3" /> Add spell
        </button>
      </div>

      {sheet.spells.length === 0 ? (
        <div
          className="text-xs italic py-8 text-center"
          style={{ color: 'var(--ink-faint)' }}
        >
          No spells yet — click &ldquo;Add spell&rdquo; to start your grimoire.
        </div>
      ) : (
        <div className="flex flex-col gap-3 pr-1">
          {byLevel.map(({ level, spells }) =>
            spells.length === 0 ? null : (
              <div key={level} className="flex flex-col gap-2">
                <div
                  className="text-[11px] font-bold uppercase tracking-widest py-1 px-2 border-l-2"
                  style={{
                    color: 'var(--gold)',
                    borderColor: 'var(--gold)',
                  }}
                >
                  {level === 'C' ? 'Cantrips' : `Level ${level} Spells`}
                  <span
                    className="ml-2 opacity-60"
                    style={{ color: 'var(--ink-faint)' }}
                  >
                    ({spells.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2">
                  {spells.map((s) => (
                    <SpellCard
                      key={s.id}
                      spell={s}
                      onChange={(patch) => updateSpell(s.id, patch)}
                      onRemove={() => removeSpell(s.id)}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

interface SpellCardProps {
  spell: import('@/lib/character-defaults').SpellRowState
  onChange: (patch: Partial<import('@/lib/character-defaults').SpellRowState>) => void
  onRemove: () => void
}

function SpellCard({ spell, onChange, onRemove }: SpellCardProps) {
  const [expanded, setExpanded] = useState(false)
  const s = spell

  // Pick a "school color" accent — we don't track school, so just use level
  // color hint: cantrip = bronze, L1 = gold, L2+ = warmer
  const levelAccent = s.level === 'C' ? 'var(--ink-soft)' : 'var(--gold)'

  return (
    <div
      className="relative border flex flex-col overflow-hidden"
      style={{
        borderColor: 'var(--rule)',
        backgroundColor: 'var(--parchment)',
      }}
    >
      {/* Card header — level badge + name + tags + remove */}
      <div
        className="flex items-stretch border-b"
        style={{ borderColor: 'var(--rule)' }}
      >
        {/* Level badge */}
        <div
          className="flex items-center justify-center w-12 flex-shrink-0 text-[10px] font-extrabold uppercase"
          style={{
            backgroundColor: levelAccent,
            color: 'var(--parchment)',
            letterSpacing: '0.05em',
          }}
          title={s.level === 'C' ? 'Cantrip' : `Level ${s.level} spell`}
        >
          {s.level === 'C' ? 'C' : `L${s.level}`}
        </div>

        {/* Name + Concentration/Ritual tags */}
        <div className="flex-1 flex flex-col px-2.5 py-2 min-w-0">
          <input
            type="text"
            value={s.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="bg-transparent border-0 outline-none text-base font-bold"
            style={{ color: 'var(--ink)' }}
            placeholder="Spell name"
            aria-label="Spell name"
          />
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            {s.concentration && (
              <Tag
                label="Concentration"
                color="var(--blood)"
                title="Concentration spell"
              />
            )}
            {s.ritual && (
              <Tag
                label="Ritual"
                color="var(--gold)"
                title="Can be cast as a ritual"
              />
            )}
            {/* Component tags */}
            <div className="flex items-center gap-1 ml-auto">
              <ComponentToggle
                letter="V"
                full="Verbal"
                active={s.components.c}
                onToggle={() =>
                  onChange({ components: { ...s.components, c: !s.components.c } })
                }
              />
              <ComponentToggle
                letter="S"
                full="Somatic"
                active={s.components.r}
                onToggle={() =>
                  onChange({ components: { ...s.components, r: !s.components.r } })
                }
              />
              <ComponentToggle
                letter="M"
                full="Material"
                active={s.components.m}
                onToggle={() =>
                  onChange({ components: { ...s.components, m: !s.components.m } })
                }
              />
            </div>
          </div>
        </div>

        {/* Collapse / Remove */}
        <div
          className="flex flex-col border-l"
          style={{ borderColor: 'var(--rule)' }}
        >
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex-1 px-2.5 flex items-center justify-center hover:bg-rule/10 transition-colors"
            style={{ color: 'var(--ink-soft)' }}
            aria-label={expanded ? 'Collapse description' : 'Expand description'}
            title={expanded ? 'Collapse' : 'Expand full description'}
          >
            {expanded
              ? <ChevronUp className="w-4 h-4" />
              : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="flex-1 px-2.5 flex items-center justify-center hover:bg-rule/10 transition-colors border-t"
            style={{ color: 'var(--blood)', borderColor: 'var(--rule)' }}
            aria-label="Remove spell"
            title="Remove spell"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metadata row: cast time | range */}
      <div
        className="grid grid-cols-2 border-b"
        style={{ borderColor: 'var(--rule)' }}
      >
        <MetaField
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Cast Time"
          value={s.castingTime}
          onChange={(v) => onChange({ castingTime: v })}
          placeholder="1A"
        />
        <MetaField
          icon={<Target className="w-3.5 h-3.5" />}
          label="Range"
          value={s.range}
          onChange={(v) => onChange({ range: v })}
          placeholder="60 ft"
          borderLeft
        />
      </div>

      {/* Quick notes — short mechanical summary */}
      <div className="px-2.5 py-2 flex items-center gap-1.5 border-b"
           style={{ borderColor: 'var(--rule-light)' }}>
        <Sparkles className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--gold)' }} />
        <input
          type="text"
          value={s.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          className="flex-1 bg-transparent border-0 outline-none text-xs italic"
          style={{ color: 'var(--ink-soft)' }}
          placeholder="Quick mechanical summary (e.g. 1d6 Psychic · Wis save)"
          aria-label="Quick mechanical summary"
        />
      </div>

      {/* Description — the main feature.
          When collapsed: shows a non-editable preview of the first ~5 lines
          (enough to read most spell descriptions without expanding).
          When expanded: shows an editable textarea with the full description. */}
      {expanded ? (
        <textarea
          value={s.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={12}
          placeholder="Full spell description (mechanics, scaling, flavor…)"
          className="w-full bg-transparent border-0 outline-none text-xs leading-relaxed p-3 resize-y sheet-grid min-h-[220px]"
          style={{ color: 'var(--ink)' }}
          aria-label="Full spell description"
          autoFocus
        />
      ) : (
        <div
          onClick={() => setExpanded(true)}
          className="px-3 py-2.5 text-xs leading-relaxed cursor-text sheet-grid min-h-[100px] max-h-[160px] overflow-hidden whitespace-pre-wrap"
          style={{ color: 'var(--ink)' }}
          title="Click to edit the full description"
        >
          {s.description
            ? s.description
            : <span className="italic" style={{ color: 'var(--ink-faint)' }}>
                Click to add full spell description…
              </span>}
        </div>
      )}

      {/* Footer — toggleable flags row */}
      <div
        className="grid grid-cols-3 border-t"
        style={{ borderColor: 'var(--rule)' }}
      >
        <FooterToggle
          label="Concentration"
          active={s.concentration}
          onToggle={() => onChange({ concentration: !s.concentration })}
          color="var(--blood)"
          icon={<Flame className="w-3 h-3" />}
        />
        <FooterToggle
          label="Ritual"
          active={s.ritual}
          onToggle={() => onChange({ ritual: !s.ritual })}
          color="var(--gold)"
          icon={<Sparkles className="w-3 h-3" />}
          borderLeft
        />
        <LevelPicker
          value={s.level}
          onChange={(v) => onChange({ level: v })}
          borderLeft
        />
      </div>
    </div>
  )
}

function Tag({
  label,
  color,
  title,
}: {
  label: string
  color: string
  title?: string
}) {
  return (
    <span
      className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm"
      style={{
        backgroundColor: color,
        color: 'var(--parchment)',
      }}
      title={title}
    >
      {label}
    </span>
  )
}

function ComponentToggle({
  letter,
  full,
  active,
  onToggle,
}: {
  letter: string
  full: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-0.5 px-1 py-0.5"
      title={`${full} component`}
      aria-label={`Toggle ${full} component`}
      aria-pressed={active}
    >
      <span
        className="font-bold text-[9px]"
        style={{
          color: active ? 'var(--ink)' : 'var(--ink-faint)',
          textDecoration: active ? 'none' : 'line-through',
          opacity: active ? 1 : 0.5,
        }}
      >
        {letter}
      </span>
    </button>
  )
}

function MetaField({
  icon,
  label,
  value,
  onChange,
  placeholder,
  borderLeft = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  borderLeft?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-2 px-2.5 py-2 ${borderLeft ? 'border-l' : ''}`}
      style={{ borderColor: 'var(--rule)' }}
    >
      <span style={{ color: 'var(--ink-faint)' }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <div
          className="text-[9px] font-bold uppercase tracking-wider"
          style={{ color: 'var(--ink-faint)' }}
        >
          {label}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-0 outline-none text-xs font-bold"
          style={{ color: 'var(--ink)' }}
          placeholder={placeholder}
          aria-label={label}
        />
      </div>
    </div>
  )
}

function FooterToggle({
  label,
  active,
  onToggle,
  color,
  icon,
  borderLeft = false,
}: {
  label: string
  active: boolean
  onToggle: () => void
  color: string
  icon: React.ReactNode
  borderLeft?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center justify-center gap-1 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors hover:bg-rule/10 ${borderLeft ? 'border-l' : ''}`}
      style={{
        borderColor: 'var(--rule)',
        color: active ? color : 'var(--ink-faint)',
      }}
      aria-pressed={active}
      aria-label={`Toggle ${label}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function LevelPicker({
  value,
  onChange,
  borderLeft = false,
}: {
  value: string
  onChange: (v: string) => void
  borderLeft?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-center gap-1 py-1.5 ${borderLeft ? 'border-l' : ''}`}
      style={{ borderColor: 'var(--rule)' }}
    >
      <span
        className="text-[8px] font-bold uppercase tracking-wider"
        style={{ color: 'var(--ink-faint)' }}
      >
        Lvl
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-0 outline-none text-[11px] font-bold cursor-pointer"
        style={{ color: 'var(--ink)' }}
        aria-label="Spell level"
      >
        {LEVELS.map((l) => (
          <option key={l} value={l} style={{ color: '#000' }}>
            {l === 'C' ? 'Cantrip' : `L${l}`}
          </option>
        ))}
      </select>
    </div>
  )
}
