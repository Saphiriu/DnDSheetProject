'use client'

import { useCharacter } from '@/store/character-store'
import { COIN_TYPES } from '@/lib/dnd'

/**
 * Page 2 right sidebar: Appearance, Backstory & Personality + Alignment,
 * Languages, Equipment, Magic Item Attunement, Coins.
 */
export function CharacterSidebar() {
  return (
    <div className="flex flex-col gap-2">
      <AppearancePanel />
      <BackstoryPanel />
      <LanguagesPanel />
      <EquipmentPanel />
      <CoinsPanel />
    </div>
  )
}

function AppearancePanel() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  return (
    <div className="sheet-panel p-2 flex flex-col">
      <div className="sheet-label-lg mb-1">APPEARANCE</div>
      <textarea
        value={sheet.appearanceNotes}
        onChange={(e) => setField('appearanceNotes', e.target.value)}
        rows={4}
        placeholder="Age, height, eyes, skin, hair, distinguishing features…"
        className="w-full bg-transparent border-0 outline-none text-xs resize-none sheet-grid p-1 min-h-[80px]"
        style={{ color: 'var(--ink)' }}
        aria-label="Appearance"
      />
    </div>
  )
}

function BackstoryPanel() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  return (
    <div className="sheet-panel p-2 flex flex-col">
      <div className="sheet-label-lg mb-1">BACKSTORY &amp; PERSONALITY</div>
      <textarea
        value={sheet.backstoryNotes}
        onChange={(e) => setField('backstoryNotes', e.target.value)}
        rows={6}
        placeholder="Where did the character come from? Bonds, flaws, ideals…"
        className="w-full bg-transparent border-0 outline-none text-xs resize-none sheet-grid p-1 min-h-[120px]"
        style={{ color: 'var(--ink)' }}
        aria-label="Backstory and personality"
      />
      <div className="flex items-center gap-2 mt-1">
        <span className="sheet-label">Alignment</span>
        <input
          type="text"
          value={sheet.alignment}
          onChange={(e) => setField('alignment', e.target.value)}
          className="sheet-input-line text-xs font-bold"
          placeholder="Chaotic Good"
          aria-label="Alignment"
        />
      </div>
    </div>
  )
}

function LanguagesPanel() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  return (
    <div className="sheet-panel p-2">
      <div className="sheet-label mb-1">LANGUAGES</div>
      <textarea
        value={sheet.languages}
        onChange={(e) => setField('languages', e.target.value)}
        rows={2}
        placeholder="Common, Elvish, …"
        className="w-full bg-transparent border-0 outline-none text-xs resize-none"
        style={{ color: 'var(--ink)' }}
        aria-label="Languages"
      />
    </div>
  )
}

function EquipmentPanel() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  return (
    <div className="sheet-panel p-2 flex flex-col">
      <div className="sheet-label-lg mb-1">EQUIPMENT</div>
      <textarea
        value={sheet.equipment}
        onChange={(e) => setField('equipment', e.target.value)}
        rows={5}
        placeholder="Backpack, rope, torches, rations, weapons…"
        className="w-full bg-transparent border-0 outline-none text-xs resize-none sheet-grid p-1 min-h-[100px]"
        style={{ color: 'var(--ink)' }}
        aria-label="Equipment"
      />
      <div className="sheet-label mt-1 text-left">Magic Item Attunement</div>
      <textarea
        value={sheet.magicItemAttunement}
        onChange={(e) => setField('magicItemAttunement', e.target.value)}
        rows={2}
        placeholder="Attuned magic items (max 3)…"
        className="w-full bg-transparent border-0 outline-none text-xs resize-none"
        style={{ color: 'var(--ink)' }}
        aria-label="Magic item attunement"
      />
    </div>
  )
}

function CoinsPanel() {
  const sheet = useCharacter((s) => s.sheet)
  const setCoin = useCharacter((s) => s.setCoin)

  return (
    <div className="sheet-panel p-2">
      <div className="sheet-label-lg mb-1">COINS</div>
      <div className="grid grid-cols-5 gap-1">
        {COIN_TYPES.map((c) => (
          <div
            key={c}
            className="flex flex-col items-center"
          >
            <div
              className="sheet-label uppercase font-extrabold"
              style={{ color: 'var(--ink)' }}
            >
              {c}
            </div>
            <div className="sheet-coin coin-purse flex items-start justify-center pt-0.5">
              <input
                type="text"
                inputMode="numeric"
                value={sheet.coins[c]}
                onChange={(e) => setCoin(c, e.target.value)}
                className="w-10 bg-transparent border-0 outline-none text-center text-sm font-bold mt-0.5"
                style={{ color: 'var(--ink)' }}
                aria-label={`Coins (${c})`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
