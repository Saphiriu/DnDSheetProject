/**
 * Zustand store for the interactive character sheet.
 *
 * Holds the full CharacterSheet state, plus UI helpers for the dice
 * roller. Auto-persists to localStorage so refresh keeps your edits.
 */

'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  CharacterSheet,
  defaultCharacter,
  blankCharacter,
  newId,
} from '@/lib/character-defaults'
import {
  abilityModifier,
  proficiencyBonusByLevel,
  spellSaveDC as calcSpellSaveDC,
  spellAttackBonus as calcSpellAttackBonus,
  passivePerception as calcPassivePerception,
  abilityModifier as abilityMod,
  signed,
  type AbilityKey,
  type SkillKey,
  type ArmorType,
  type CoinType,
} from '@/lib/dnd'

interface RollHistoryItem {
  id: string
  expression: string
  rolls: number[]
  total: number
  modifier: number
  final: number
  note?: string
  advantage?: boolean
  disadvantage?: boolean
  timestamp: number
}

interface CharacterStore {
  sheet: CharacterSheet
  savedCharId: string | null
  rolls: RollHistoryItem[]

  // Sheet-level operations
  setSheet: (s: CharacterSheet) => void
  resetDefault: () => void
  newBlank: () => void
  clearAll: () => void

  // Generic field updater
  setField: <K extends keyof CharacterSheet>(key: K, value: CharacterSheet[K]) => void

  // Ability operations
  setAbilityScore: (k: AbilityKey, score: number | '') => void
  toggleAbilitySaveProficient: (k: AbilityKey) => void

  // Skill operations
  toggleSkillProficient: (k: SkillKey) => void
  toggleSkillExpertise: (k: SkillKey) => void
  setSkillBonus: (k: SkillKey, v: number) => void

  // Weapons
  addWeapon: () => void
  updateWeapon: (id: string, patch: Partial<CharacterSheet['weapons'][number]>) => void
  removeWeapon: (id: string) => void

  // Spells
  addSpell: () => void
  updateSpell: (id: string, patch: Partial<CharacterSheet['spells'][number]>) => void
  removeSpell: (id: string) => void

  // Spell slots
  setSpellSlotTotal: (level: number, total: number) => void
  toggleSpellSlotExpended: (level: number, idx: number) => void

  // Death saves
  toggleDeathSave: (kind: 'success' | 'failure', idx: number) => void

  // Armor / proficiencies
  toggleArmorTraining: (t: ArmorType) => void

  // Heroic inspiration
  toggleHeroicInspiration: () => void

  // Coins
  setCoin: (k: CoinType, v: string) => void

  // Auto-derive helpers (do NOT mutate; return derived value)
  recalcDerived: () => void

  // Save/Load with API
  setSavedId: (id: string | null) => void

  // Dice roller
  pushRoll: (r: RollHistoryItem) => void
  clearRolls: () => void

  // Roll d20 (with optional advantage / disadvantage)
  rollD20: (modifier: number, note: string, opts?: { advantage?: boolean; disadvantage?: boolean }) => number
  // Roll arbitrary dice: e.g. {count:2, faces:6, modifier:3} -> 2d6+3
  rollDice: (count: number, faces: number, modifier: number, note?: string) => number
}

function mutate<K extends keyof CharacterSheet>(state: { sheet: CharacterSheet }, key: K, value: CharacterSheet[K]): CharacterSheet {
  return { ...state.sheet, [key]: value }
}

export const useCharacter = create<CharacterStore>()(
  persist(
    (set, get) => ({
      sheet: defaultCharacter(),
      savedCharId: null,
      rolls: [],

      setSheet: (s) => set({ sheet: s }),

      resetDefault: () => set({ sheet: defaultCharacter(), savedCharId: null }),

      newBlank: () => set({ sheet: blankCharacter(), savedCharId: null }),

      clearAll: () => {
        const fresh = blankCharacter()
        set({ sheet: fresh, savedCharId: null, rolls: [] })
      },

      setField: (key, value) =>
        set((state) => ({ sheet: mutate(state, key, value) })),

      setAbilityScore: (k, score) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            abilities: {
              ...state.sheet.abilities,
              [k]: { ...state.sheet.abilities[k], score },
            },
          },
        })),

      toggleAbilitySaveProficient: (k) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            abilities: {
              ...state.sheet.abilities,
              [k]: {
                ...state.sheet.abilities[k],
                saveProficient: !state.sheet.abilities[k].saveProficient,
              },
            },
          },
        })),

      toggleSkillProficient: (k) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            skills: {
              ...state.sheet.skills,
              [k]: {
                ...state.sheet.skills[k],
                proficient: !state.sheet.skills[k].proficient,
              },
            },
          },
        })),

      toggleSkillExpertise: (k) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            skills: {
              ...state.sheet.skills,
              [k]: {
                ...state.sheet.skills[k],
                expertise: !state.sheet.skills[k].expertise,
              },
            },
          },
        })),

      setSkillBonus: (k, v) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            skills: {
              ...state.sheet.skills,
              [k]: { ...state.sheet.skills[k], bonus: v },
            },
          },
        })),

      addWeapon: () =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            weapons: [
              ...state.sheet.weapons,
              { id: newId(), name: '', atkBonus: '', damage: '', notes: '' },
            ],
          },
        })),

      updateWeapon: (id, patch) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            weapons: state.sheet.weapons.map((w) =>
              w.id === id ? { ...w, ...patch } : w
            ),
          },
        })),

      removeWeapon: (id) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            weapons: state.sheet.weapons.filter((w) => w.id !== id),
          },
        })),

      addSpell: () =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            spells: [
              ...state.sheet.spells,
              {
                id: newId(),
                level: '1',
                name: '',
                castingTime: '',
                range: '',
                components: { c: false, r: false, m: false },
                concentration: false,
                ritual: false,
                notes: '',
              },
            ],
          },
        })),

      updateSpell: (id, patch) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            spells: state.sheet.spells.map((s) =>
              s.id === id ? { ...s, ...patch } : s
            ),
          },
        })),

      removeSpell: (id) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            spells: state.sheet.spells.filter((s) => s.id !== id),
          },
        })),

      setSpellSlotTotal: (level, total) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            spellSlots: state.sheet.spellSlots.map((slot, idx) =>
              idx === level - 1 ? { ...slot, total, expended: Math.min(slot.expended, total) } : slot
            ),
          },
        })),

      toggleSpellSlotExpended: (level, idx) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            spellSlots: state.sheet.spellSlots.map((slot, idx2) => {
              if (idx2 !== level - 1) return slot
              const arr = Array.from({ length: slot.total }, (_, i) =>
                i < slot.expended
              )
              arr[idx] = !arr[idx]
              const newExpended = arr.filter(Boolean).length
              return { ...slot, expended: newExpended }
            }),
          },
        })),

      toggleDeathSave: (kind, idx) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            deathSavesSuccesses:
              kind === 'success'
                ? state.sheet.deathSavesSuccesses.map((v, i) =>
                    i === idx ? !v : v
                  )
                : state.sheet.deathSavesSuccesses,
            deathSavesFailures:
              kind === 'failure'
                ? state.sheet.deathSavesFailures.map((v, i) =>
                    i === idx ? !v : v
                  )
                : state.sheet.deathSavesFailures,
          },
        })),

      toggleArmorTraining: (t) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            armorTraining: {
              ...state.sheet.armorTraining,
              [t]: !state.sheet.armorTraining[t],
            },
          },
        })),

      toggleHeroicInspiration: () =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            heroicInspiration: !state.sheet.heroicInspiration,
          },
        })),

      setCoin: (k, v) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            coins: { ...state.sheet.coins, [k]: v },
          },
        })),

      recalcDerived: () => {
        const s = get().sheet
        const level = typeof s.level === 'number' ? s.level : 1
        const prof = proficiencyBonusByLevel(level)

        // Find the spellcasting ability and its modifier.
        const abilityMap: Record<string, AbilityKey> = {
          Strength: 'str', Dexterity: 'dex', Constitution: 'con',
          Intelligence: 'int', Wisdom: 'wis', Charisma: 'cha',
        }
        const spellAbKey = abilityMap[s.spellcastingAbility] || 'cha'
        const spellScore = typeof s.abilities[spellAbKey].score === 'number' ? s.abilities[spellAbKey].score as number : 10
        const spellMod = abilityMod(spellScore)

        const wisScore = typeof s.abilities.wis.score === 'number' ? s.abilities.wis.score as number : 10
        const wisMod = abilityMod(wisScore)
        const dexScore = typeof s.abilities.dex.score === 'number' ? s.abilities.dex.score as number : 10
        const dexMod = abilityMod(dexScore)
        const intScore = typeof s.abilities.int.score === 'number' ? s.abilities.int.score as number : 10
        const intMod = abilityMod(intScore)

        const perceptionProficient = s.skills.perception.proficient

        set({
          sheet: {
            ...s,
            proficiencyBonus: signed(prof),
            initiative: signed(dexMod),
            intelligence: signed(intMod),
            passivePerception: String(calcPassivePerception(wisMod, prof, perceptionProficient)),
            spellcastingModifier: signed(spellMod),
            spellSaveDC: String(calcSpellSaveDC(prof, spellMod)),
            spellAttackBonus: signed(calcSpellAttackBonus(prof, spellMod)),
          },
        })
      },

      setSavedId: (id) => set({ savedCharId: id }),

      pushRoll: (r) =>
        set((state) => ({ rolls: [r, ...state.rolls].slice(0, 50) })),

      clearRolls: () => set({ rolls: [] }),

      rollD20: (modifier, note, opts) => {
        const r1 = Math.floor(Math.random() * 20) + 1
        const r2 = Math.floor(Math.random() * 20) + 1
        let chosen = r1
        const advantage = opts?.advantage
        const disadvantage = opts?.disadvantage
        if (advantage && !disadvantage) chosen = Math.max(r1, r2)
        else if (disadvantage && !advantage) chosen = Math.min(r1, r2)
        const final = chosen + modifier
        const rolls = advantage || disadvantage ? [r1, r2] : [r1]
        get().pushRoll({
          id: newId(),
          expression: `d20${modifier >= 0 ? '+' : ''}${modifier}`,
          rolls,
          total: chosen,
          modifier,
          final,
          note,
          advantage,
          disadvantage,
          timestamp: Date.now(),
        })
        return final
      },

      rollDice: (count, faces, modifier, note) => {
        const rolls: number[] = []
        for (let i = 0; i < count; i++) rolls.push(Math.floor(Math.random() * faces) + 1)
        const total = rolls.reduce((a, b) => a + b, 0)
        const final = total + modifier
        const sign = modifier >= 0 ? '+' : ''
        get().pushRoll({
          id: newId(),
          expression: `${count}d${faces}${modifier !== 0 ? `${sign}${modifier}` : ''}`,
          rolls,
          total,
          modifier,
          final,
          note,
          timestamp: Date.now(),
        })
        return final
      },
    }),
    {
      name: 'dnd-character-sheet-v2',
      partialize: (s) => ({ sheet: s.sheet, savedCharId: s.savedCharId }),
    }
  )
)

export type { RollHistoryItem }
