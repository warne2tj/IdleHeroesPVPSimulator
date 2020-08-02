// Dictionary of heroes containing list of allowed enables, artifacts, equipments, and enables
var seededHeroes = {
  "Aida": {
    allowedArtifacts: ["Golden Crown"],
    allowedStones: ["HP, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"','"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Amen-Ra": {
    allowedArtifacts: ["Golden Crown"],
    allowedStones: ["HP, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"','"Vitality", "Vitality2", "Purify", "Vitality", "UnbendingWill"']
  },
  "Amuvor": {
    allowedArtifacts: ["Staff Punisher of Immortal"],
    allowedStones: ["Speed, Crit","Crit, Crit, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Asmodel": {
    allowedArtifacts: ["The Kiss of Ghost","Staff Punisher of Immortal"],
    allowedStones: ["Crit, Crit, Attack","Attack, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Aspen": {
    allowedArtifacts: ["Golden Crown","Magic Stone Sword"],
    allowedStones: ["Crit, Crit, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Belrain": {
    allowedArtifacts: ["Augustus Magic Ball","Antlers Cane","Magic Stone Sword"],
    allowedStones: ["Attack, Attack","HP, Heal"],
    allowedEquipments: ["Class Gear","Split Attack"],
    allowedEnables: ['"Mightiness", "LethalFightback", "SharedFate", "Mightiness", "BalancedStrike"','"Growth", "Vitality2", "Purify", "Growth", "UnbendingWill"']
  },
  "Carrie": {
    allowedArtifacts: ["Augustus Magic Ball","Demon Bell","Ruyi Scepter"],
    allowedStones: ["Speed, HP","Speed, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"','"Growth", "LethalFightback", "Purify", "Growth", "BalancedStrike"']
  },
  "Cthugha": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown"],
    allowedStones: ["HP, Attack","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Dark Arthindol": {
    allowedArtifacts: ["Staff Punisher of Immortal","Demon Bell","Ruyi Scepter"],
    allowedStones: ["Speed, Crit","Crit, Crit, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Delacium": {
    allowedArtifacts: ["Staff Punisher of Immortal","Golden Crown","Magic Stone Sword"],
    allowedStones: ["Speed, HP","HP, Attack","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"','"Vitality", "Vitality2", "Resilience", "Vitality", "UnbendingWill"']
  },
  "Drake": {
    allowedArtifacts: ["Augustus Magic Ball","Ruyi Scepter"],
    allowedStones: ["Speed, HP","Speed, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Elyvia": {
    allowedArtifacts: ["Golden Crown"],
    allowedStones: ["Speed, HP","HP, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Emily": {
    allowedArtifacts: ["Demon Bell"],
    allowedStones: ["Speed, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Faith Blade": {
    allowedArtifacts: ["Augustus Magic Ball","Staff Punisher of Immortal","Demon Bell"],
    allowedStones: ["Speed, Crit","HP, Attack","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Garuda": {
    allowedArtifacts: ["Golden Crown","Magic Stone Sword"],
    allowedStones: ["Attack, Attack, Holy","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"','"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Gustin": {
    allowedArtifacts: ["Golden Crown"],
    allowedStones: ["Speed, HP","HP, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"','"Vitality", "Vitality2", "Resilience", "Vitality", "UnbendingWill"']
  },
  "Horus": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Magic Stone Sword"],
    allowedStones: ["HP, Attack","HP, Attack, Holy","HP, Block"],
    allowedEquipments: ["Class Gear","Split HP"],
    allowedEnables: ['"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"']
  },
  "Ithaqua": {
    allowedArtifacts: ["The Kiss of Ghost","Augustus Magic Ball","Staff Punisher of Immortal"],
    allowedStones: ["Speed, Attack","Speed, Crit"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"','"Mightiness", "LethalFightback", "Purify", "Mightiness", "UnbendingWill"']
  },
  "Kroos": {
    allowedArtifacts: ["Demon Bell","Ruyi Scepter"],
    allowedStones: ["Speed, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Michelle": {
    allowedArtifacts: ["Demon Bell","Ruyi Scepter"],
    allowedStones: ["Speed, Attack","Speed, Crit"],
    allowedEquipments: ["Class Gear","Split HP"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Mihm": {
    allowedArtifacts: ["The Kiss of Ghost","Antlers Cane"],
    allowedStones: ["Attack, Attack, Holy","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear","Split Attack"],
    allowedEnables: ['"Mightiness", "Shelter", "Resilience", "Mightiness", "UnbendingWill"','"Vitality", "Shelter", "Resilience", "Vitality", "UnbendingWill"']
  },
  "Nakia": {
    allowedArtifacts: ["Augustus Magic Ball"],
    allowedStones: ["Speed, Attack","Speed, Crit"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Oberon": {
    allowedArtifacts: ["Demon Bell","Ruyi Scepter"],
    allowedStones: ["Speed, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Penny": {
    allowedArtifacts: ["The Kiss of Ghost","Staff Punisher of Immortal"],
    allowedStones: ["Speed, HP","Speed, Crit","Crit, Crit, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"','"Vitality", "Vitality2", "Resilience", "Vitality", "UnbendingWill"']
  },
  "Rogan": {
    allowedArtifacts: ["Golden Crown","Demon Bell"],
    allowedStones: ["Speed, HP","HP, HP"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"','"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Russell": {
    allowedArtifacts: ["Golden Crown","Demon Bell"],
    allowedStones: ["Speed, HP","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"','"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Sherlock": {
    allowedArtifacts: ["Lucky Candy Bar","Ruyi Scepter"],
    allowedStones: ["Speed, HP","Speed, Attack"],
    allowedEquipments: ["Class Gear","No Armor"],
    allowedEnables: ['"Growth", "Shelter", "Resilience", "Growth", "UnbendingWill"','"Vitality", "Shelter", "Resilience", "Vitality", "UnbendingWill"']
  },
  "Tara": {
    allowedArtifacts: ["Golden Crown","Magic Stone Sword"],
    allowedStones: ["Attack, Attack, Holy","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"','"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"']
  },
  "UniMax-3000": {
    allowedArtifacts: ["Augustus Magic Ball","Ruyi Scepter"],
    allowedStones: ["Speed, HP","HP, Attack","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"','"Vitality", "Vitality2", "Resilience", "Vitality", "UnbendingWill"']
  },
  "Ormus": {
    allowedArtifacts: ["Augustus Magic Ball","Magic Stone Sword"],
    allowedStones: ["Attack, Attack","HP, Heal"],
    allowedEquipments: ["Class Gear","Split Attack"],
    allowedEnables: ['"Mightiness", "LethalFightback", "SharedFate", "Mightiness", "BalancedStrike"','"Growth", "Vitality2", "Purify", "Growth", "UnbendingWill"']
  },
  "Valkryie": {
    allowedArtifacts: ["Golden Crown"],
    allowedStones: ["HP, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"']
  },
  "Gerke": {
    allowedArtifacts: ["Golden Crown","Magic Stone Sword"],
    allowedStones: ["Attack, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },"
  "Sleepless": {
    allowedArtifacts: ["Golden Crown","Magic Stone Sword"],
    allowedStones: ["Attack, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Das Moge": {
    allowedArtifacts: ["Staff Punisher of Immortal"],
    allowedStones: ["Crit, Crit, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  }
};
