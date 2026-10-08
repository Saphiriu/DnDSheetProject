/**
 * Default character sheet state, pre-populated with the example
 * character "Jichael Mackson" (Bard 2, Elf) extracted from the
 * filled-in PDF character sheet.
 *
 * Every field on the sheet is editable from the UI; this is just the
 * initial state so the page renders as a real character on first load.
 */

import type { AbilityKey, SkillKey, ArmorType, CoinType } from './dnd'

export interface AbilityState {
  score: number | '' // 1-30, or '' if blank
  saveProficient: boolean
}

export interface SkillState {
  proficient: boolean
  bonus: number // override bonus (0 means use ability mod + prof)
  expertise: boolean
}

export interface WeaponState {
  id: string
  name: string
  atkBonus: string // allow text like "+3" or "DC 14"
  damage: string // e.g. "1d6 Psychic DisAtt"
  notes: string
}

export interface SpellSlotState {
  total: number
  expended: number
}

export interface SpellRowState {
  id: string
  level: string // 'C' for cantrip, '1'..'9' for spell level
  name: string
  castingTime: string
  range: string
  components: { c: boolean; r: boolean; m: boolean }
  concentration: boolean
  ritual: boolean
  notes: string
}

export interface CharacterSheet {
  // Identity
  characterName: string
  background: string
  class: string
  species: string
  subclass: string
  level: number | ''
  xp: number | ''

  // Armor / HP
  armorClass: string
  shield: string // armor bonus from shield
  hpTemp: string
  hpCurrent: string
  hpMax: string
  hitDiceSpent: string
  hitDiceMax: string
  deathSavesSuccesses: boolean[] // length 3
  deathSavesFailures: boolean[] // length 3

  // Stat bar — only editable base values.
  // proficiencyBonus, initiative, and passivePerception are auto-derived
  // at render time from level / DEX / WIS + perception proficiency.
  speed: string
  size: string

  // Abilities
  abilities: Record<AbilityKey, AbilityState>

  // Skills (overrides saved as bonus)
  skills: Record<SkillKey, SkillState>

  // Combat tab
  weapons: WeaponState[]

  // Long-form text
  classFeatures: string
  speciesTraits: string
  feats: string
  equipmentTrainingNotes: string
  appearanceNotes: string
  backstoryNotes: string
  alignment: string

  // Proficiencies
  armorTraining: Record<ArmorType, boolean>
  weaponsProficient: string
  toolsProficient: string
  languages: string
  heroicInsppiration: boolean
  jackOfAllTrades: boolean // Bard level-2 feature: adds floor(PB/2) to non-proficient ability checks

  // Spellcasting — spellcasting ability is chosen; modifier / save DC / attack
  // bonus are all auto-derived at render time.
  spellcastingAbility: string // e.g. 'Charisma'
  spellSlots: SpellSlotState[] // length 9
  spells: SpellRowState[]
  damageCantrips: string // the "Weapons & Damage Cantrips" free text in weapons area

  // Coins
  coins: Record<CoinType, string>

  // Equipment
  equipment: string
  magicItemAttunement: string
}

let _idCounter = 0
const id = () => `id_${++_idCounter}_${Math.random().toString(36).slice(2, 8)}`

export function newId() {
  return id()
}

/**
 * The default character: Jichael Mackson, Elf Bard 2.
 * Values are pulled directly from the populated PDF.
 */
export function defaultCharacter(): CharacterSheet {
  return {
    characterName: 'Jichael Mackson',
    background: 'ENTERTAINER',
    class: 'Bard',
    species: 'ELF',
    subclass: '',
    level: 2,
    xp: 400,

    armorClass: '14',
    shield: '',
    hpTemp: '',
    hpCurrent: '20',
    hpMax: '20',
    hitDiceSpent: '0',
    hitDiceMax: '2', // 1 Hit Die per class level
    deathSavesSuccesses: [false, false, false],
    deathSavesFailures: [false, false, false],

    // NOTE: proficiencyBonus, initiative, passivePerception, spellcastingModifier,
    // spellSaveDC, and spellAttackBonus are all auto-derived at render time
    // from level / ability scores / proficiency toggles.
    speed: '30',
    size: 'M',

    abilities: {
      str: { score: 11, saveProficient: false },
      dex: { score: 10, saveProficient: false },
      con: { score: 15, saveProficient: true },
      int: { score: 10, saveProficient: false },
      wis: { score: 16, saveProficient: false },
      cha: { score: 18, saveProficient: false },
    },

    skills: {
      acrobatics: { proficient: true, bonus: 0, expertise: false },
      animalHandling: { proficient: false, bonus: 0, expertise: false },
      arcana: { proficient: false, bonus: 0, expertise: false },
      athletics: { proficient: false, bonus: 0, expertise: false },
      deception: { proficient: true, bonus: 0, expertise: false },
      history: { proficient: false, bonus: 0, expertise: false },
      insight: { proficient: false, bonus: 0, expertise: false },
      intimidation: { proficient: false, bonus: 0, expertise: false },
      investigation: { proficient: false, bonus: 0, expertise: false },
      medicine: { proficient: false, bonus: 0, expertise: false },
      nature: { proficient: false, bonus: 0, expertise: false },
      perception: { proficient: true, bonus: 0, expertise: false },
      performance: { proficient: true, bonus: 0, expertise: false },
      persuasion: { proficient: true, bonus: 0, expertise: false },
      religion: { proficient: false, bonus: 0, expertise: false },
      sleightOfHand: { proficient: true, bonus: 0, expertise: false },
      stealth: { proficient: true, bonus: 0, expertise: false },
      survival: { proficient: false, bonus: 0, expertise: false },
    },

    weapons: [
      {
        id: id(),
        name: 'Vicious Mockery (Cantrip)',
        atkBonus: '',
        damage: '1d6 Psychic DisAtt',
        notes: 'Wis save or disadv on next attack',
      },
      {
        id: id(),
        name: 'Dagger',
        atkBonus: '+5',
        damage: '1d4+3 piercing',
        notes: 'Finesse, light, thrown 20/60',
      },
      {
        id: id(),
        name: 'Shortsword',
        atkBonus: '+5',
        damage: '1d6+3 piercing',
        notes: 'Finesse, light',
      },
    ],

    classFeatures:
      'Bardic Inspiration (d6): Bonus action, range 60ft, 1 min. Use Cha mod times per long rest. ' +
      'Jack of All Trades: Half proficiency on non-proficient ability checks. ' +
      'Song of Rest: Allies heal 1d6 HP on short rest. ' +
      'B insp - +d6 on d20 uses = Cha',
    speciesTraits:
      'Darkvision 60ft.  Free Wizard cantrip.  Advantage on saving throws against being Charmed. ' +
      'Immune to magical sleep.  Can\'t be put to sleep by magic.  Skill/weapon/tool proficiency choice.',
    feats: 'Musician. As you finish a Short or Long Rest, play a song to give Heroic Inspiration ' +
      'to allies who hear it (number of allies = Proficiency Bonus).',
    equipmentTrainingNotes: '',
    appearanceNotes: '',
    backstoryNotes: '',
    alignment: 'Chaotic Good',

    armorTraining: {
      Light: true,
      Medium: true,
      Heavy: false,
      Shields: true,
    },
    weaponsProficient: 'Simple weapons, longswords, shortswords, rapiers, hand crossbows',
    toolsProficient: 'Drum, Lute, Panflute (3 instruments)',
    languages: 'Common, Elvish, Celestial, Druid',
    heroicInsppiration: true,
    jackOfAllTrades: true, // Bard level-2 class feature

    spellcastingAbility: 'Charisma',
    spellSlots: [
      { total: 3, expended: 0 }, // L1
      { total: 0, expended: 0 }, // L2
      { total: 0, expended: 0 }, // L3
      { total: 0, expended: 0 }, // L4
      { total: 0, expended: 0 }, // L5
      { total: 0, expended: 0 }, // L6
      { total: 0, expended: 0 }, // L7
      { total: 0, expended: 0 }, // L8
      { total: 0, expended: 0 }, // L9
    ],
    spells: [
      // cantrips
      { id: id(), level: 'C', name: 'Vicious Mockery', castingTime: 'A', range: '60', components: { c: true, r: false, m: false }, concentration: false, ritual: false, notes: '1d6 Psychic DisSa' },
      { id: id(), level: 'C', name: 'Prestidigitation', castingTime: 'A', range: '60', components: { c: true, r: false, m: false }, concentration: false, ritual: false, notes: 'minor magical effect' },
      { id: id(), level: 'C', name: 'Mind Sliver', castingTime: 'A', range: '60', components: { c: true, r: false, m: false }, concentration: false, ritual: false, notes: 'Int save -d6 next save' },
      // L1
      { id: id(), level: '1', name: 'Charm Person', castingTime: 'A', range: '30', components: { c: true, r: false, m: false }, concentration: true, ritual: false, notes: 'Charm 1h WIS S' },
      { id: id(), level: '1', name: 'Color Spray', castingTime: 'A', range: '15ft Co', components: { c: true, r: false, m: true }, concentration: false, ritual: false, notes: 'Blind ENT CON S' },
      { id: id(), level: '1', name: 'Bane', castingTime: 'A', range: '30ft 3t', components: { c: true, r: false, m: true }, concentration: true, ritual: false, notes: '-d4 Att CHA S' },
      { id: id(), level: '1', name: 'Cure Wounds', castingTime: 'A', range: '60ft 5fs', components: { c: true, r: false, m: true }, concentration: false, ritual: false, notes: '2d8+CHA heal' },
      { id: id(), level: '1', name: 'Sleep', castingTime: 'A', range: '90ft', components: { c: true, r: false, m: true }, concentration: false, ritual: false, notes: 'Wis save' },
    ],
    damageCantrips: '',

    coins: {
      cp: '0',
      sp: '0',
      ep: '0',
      gp: '128',
      pp: '0',
    },

    equipment:
      'Studded leather armor, 2 daggers, shortsword, drum, lute, panflute, ' +
      'entertainer\'s pack, burglar\'s pack, fine clothes, 2 trinkets',
    magicItemAttunement: '',
  }
}

/**
 * A freshly blank character sheet for the "New" button.
 */
export function blankCharacter(): CharacterSheet {
  // Properly initialize every skill to blank
  const skills = {} as Record<SkillKey, SkillState>
  ;([
    'acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception', 'history',
    'insight', 'intimidation', 'investigation', 'medicine', 'nature', 'perception',
    'performance', 'persuasion', 'religion', 'sleightOfHand', 'stealth', 'survival',
  ] as SkillKey[]).forEach((k) => { skills[k] = { proficient: false, bonus: 0, expertise: false } })

  const abilities = {
    str: { score: '' as const, saveProficient: false },
    dex: { score: '' as const, saveProficient: false },
    con: { score: '' as const, saveProficient: false },
    int: { score: '' as const, saveProficient: false },
    wis: { score: '' as const, saveProficient: false },
    cha: { score: '' as const, saveProficient: false },
  }

  return {
    characterName: '',
    background: '',
    class: '',
    species: '',
    subclass: '',
    level: 1,
    xp: 0,
    armorClass: '',
    shield: '',
    hpTemp: '',
    hpCurrent: '',
    hpMax: '',
    hitDiceSpent: '0',
    hitDiceMax: '1',
    deathSavesSuccesses: [false, false, false],
    deathSavesFailures: [false, false, false],
    speed: '30',
    size: 'M',
    abilities,
    skills,
    weapons: [],
    classFeatures: '',
    speciesTraits: '',
    feats: '',
    equipmentTrainingNotes: '',
    appearanceNotes: '',
    backstoryNotes: '',
    alignment: '',
    armorTraining: { Light: false, Medium: false, Heavy: false, Shields: false },
    weaponsProficient: '',
    toolsProficient: '',
    languages: '',
    heroicInspiration: false,
    jackOfAllTrades: false,
    spellcastingAbility: '',
    spellSlots: [
      { total: 2, expended: 0 }, { total: 0, expended: 0 }, { total: 0, expended: 0 },
      { total: 0, expended: 0 }, { total: 0, expended: 0 }, { total: 0, expended: 0 },
      { total: 0, expended: 0 }, { total: 0, expended: 0 }, { total: 0, expended: 0 },
    ],
    spells: [],
    damageCantrips: '',
    coins: { cp: '', sp: '', ep: '', gp: '', pp: '' },
    equipment: '',
    magicItemAttunement: '',
  }
}
