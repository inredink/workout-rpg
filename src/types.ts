export type Faction = {
  id: string;
  name: string;
  faction: string;
  subfactions: string[];
  rankLadder: string[];
  portrait: string;
};

export const getFactionCatalog = (): Faction[] => [
  {
    id: 'ultramarines',
    name: 'Ultramarines',
    faction: 'Space Marines',
    subfactions: ['Ultramarines', 'Macragge'],
    rankLadder: ['Scout', 'Battle-Brother', 'Sergeant', 'Captain', 'Chapter Master'],
    portrait: 'portrait-ultramarines',
  },
  {
    id: 'blood-angels',
    name: 'Blood Angels',
    faction: 'Space Marines',
    subfactions: ['Blood Angels', 'Sanguinary Guard'],
    rankLadder: ['Scout', 'Battle-Brother', 'Captain', 'Commander', 'Lord'],
    portrait: 'portrait-blood-angels',
  },
  {
    id: 'astra-militarum',
    name: 'Astra Militarum',
    faction: 'Imperium',
    subfactions: ['Cadian', 'Valhallan'],
    rankLadder: ['Recruit', 'Guardsman', 'Sergeant', 'Captain', 'General'],
    portrait: 'portrait-astra-militarum',
  },
  {
    id: 'orks',
    name: 'Orks',
    faction: 'Orks',
    subfactions: ['Bad Moons', 'Goffs'],
    rankLadder: ['Grot', 'Boy', 'Nob', 'Warboss'],
    portrait: 'portrait-orks',
  },
  {
    id: 'eldar',
    name: 'Craftworld Eldar',
    faction: 'Aeldari',
    subfactions: ['Ulthwé', 'Iyanden'],
    rankLadder: ['Guardian', 'Warlock', 'Farseer', 'Autarch'],
    portrait: 'portrait-eldar',
  },
  {
    id: 'tau',
    name: 'T’au Empire',
    faction: 'Tau',
    subfactions: ['Fire Warriors', 'Kroot', 'T’au Sept'],
    rankLadder: ['Shasla', 'Shasui', 'Shas', 'Commander'],
    portrait: 'portrait-tau',
  },
  {
    id: 'necrons',
    name: 'Necrons',
    faction: 'Necrons',
    subfactions: ['Sautekh', 'Decurion'],
    rankLadder: ['Warrior', 'Immortal', 'Destroyer', 'Overlord'],
    portrait: 'portrait-necrons',
  },
  {
    id: 'tyranids',
    name: 'Tyranids',
    faction: 'Tyranids',
    subfactions: ['Hive Fleet Behemoth', 'Hive Fleet Kraken'],
    rankLadder: ['Ripper', 'Termagaunt', 'Carnifex', 'Hive Tyrant'],
    portrait: 'portrait-tyranids',
  },
];
