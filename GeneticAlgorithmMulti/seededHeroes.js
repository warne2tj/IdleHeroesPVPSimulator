// Dictionary of heroes containing list of allowed enables, artifacts, equipments, and enables
var seededHeroes = {
  "Aida": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Wildfire Torch"],
    allowedStones: ["HP, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"','"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Amen-Ra": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Wildfire Torch"],
    allowedStones: ["HP, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"','"Vitality", "Vitality2", "Purify", "Vitality", "UnbendingWill"']
  },
  "Amuvor": {
    allowedArtifacts: ["Augustus Magic Ball","Staff Punisher of Immortal","Golden Crown","Wildfire Torch"],
    allowedStones: ["Speed, Crit","Crit, Crit, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Asmodel": {
    allowedArtifacts: ["The Kiss of Ghost","Augustus Magic Ball","Staff Punisher of Immortal","Golden Crown","Wildfire Torch"],
    allowedStones: ["Crit, Crit, Attack","Attack, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Aspen": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Magic Stone Sword","Wildfire Torch"],
    allowedStones: ["Crit, Crit, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Belrain": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Antlers Cane","Magic Stone Sword","Wildfire Torch"],
    allowedStones: ["Attack, Attack","HP, Heal"],
    allowedEquipments: ["Class Gear","Split Attack"],
    allowedEnables: ['"Mightiness", "LethalFightback", "SharedFate", "Mightiness", "BalancedStrike"','"Growth", "Vitality2", "Purify", "Growth", "UnbendingWill"']
  },
  "Carrie": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Demon Bell","Ruyi Scepter","Wildfire Torch"],
    allowedStones: ["Speed, HP","Speed, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"','"Growth", "LethalFightback", "Purify", "Growth", "BalancedStrike"']
  },
  "Cthugha": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Wildfire Torch"],
    allowedStones: ["HP, Attack","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Dark Arthindol": {
    allowedArtifacts: ["Augustus Magic Ball","Staff Punisher of Immortal","Golden Crown","Demon Bell","Ruyi Scepter","Wildfire Torch"],
    allowedStones: ["Speed, Crit","Crit, Crit, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Delacium": {
    allowedArtifacts: ["Augustus Magic Ball","Staff Punisher of Immortal","Golden Crown","Magic Stone Sword","Wildfire Torch"],
    allowedStones: ["Speed, HP","HP, Attack","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"','"Vitality", "Vitality2", "Resilience", "Vitality", "UnbendingWill"']
  },
  "Drake": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Ruyi Scepter","Wildfire Torch"],
    allowedStones: ["Speed, HP","Speed, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Elyvia": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Wildfire Torch"],
    allowedStones: ["Speed, HP","HP, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Emily": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Demon Bell","Wildfire Torch"],
    allowedStones: ["Speed, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Faith Blade": {
    allowedArtifacts: ["Augustus Magic Ball","Staff Punisher of Immortal","Golden Crown","Demon Bell","Wildfire Torch"],
    allowedStones: ["Speed, Crit","HP, Attack","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Garuda": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Magic Stone Sword","Wildfire Torch"],
    allowedStones: ["Attack, Attack, Holy","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"','"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Gustin": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Wildfire Torch"],
    allowedStones: ["Speed, HP","HP, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"','"Vitality", "Vitality2", "Resilience", "Vitality", "UnbendingWill"']
  },
  "Horus": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Magic Stone Sword","Wildfire Torch"],
    allowedStones: ["HP, Attack","HP, Attack, Holy","HP, Block"],
    allowedEquipments: ["Class Gear","Split HP"],
    allowedEnables: ['"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"']
  },
  "Ithaqua": {
    allowedArtifacts: ["The Kiss of Ghost","Augustus Magic Ball","Staff Punisher of Immortal","Golden Crown","Wildfire Torch"],
    allowedStones: ["Speed, Attack","Speed, Crit"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"','"Mightiness", "LethalFightback", "Purify", "Mightiness", "UnbendingWill"']
  },
  "Kroos": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Demon Bell","Ruyi Scepter","Wildfire Torch"],
    allowedStones: ["Speed, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Michelle": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Demon Bell","Ruyi Scepter","Wildfire Torch"],
    allowedStones: ["Speed, Attack","Speed, Crit"],
    allowedEquipments: ["Class Gear","Split HP"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Mihm": {
    allowedArtifacts: ["The Kiss of Ghost","Augustus Magic Ball","Golden Crown","Antlers Cane","Wildfire Torch"],
    allowedStones: ["Attack, Attack, Holy","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear","Split Attack"],
    allowedEnables: ['"Mightiness", "Shelter", "Resilience", "Mightiness", "UnbendingWill"','"Vitality", "Shelter", "Resilience", "Vitality", "UnbendingWill"']
  },
  "Nakia": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Wildfire Torch"],
    allowedStones: ["Speed, Attack","Speed, Crit"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Oberon": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Demon Bell","Ruyi Scepter","Wildfire Torch"],
    allowedStones: ["Speed, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Penny": {
    allowedArtifacts: ["The Kiss of Ghost","Augustus Magic Ball","Staff Punisher of Immortal","Golden Crown","Wildfire Torch"],
    allowedStones: ["Speed, HP","Speed, Crit","Crit, Crit, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"','"Vitality", "Vitality2", "Resilience", "Vitality", "UnbendingWill"']
  },
  "Rogan": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Demon Bell","Ruyi Scepter","Wildfire Torch"],
    allowedStones: ["Speed, HP","Speed, Attack","HP, HP"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "Vitality2", "Purify", "Growth", "UnbendingWill"','"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Russell": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Demon Bell","Wildfire Torch"],
    allowedStones: ["Speed, HP","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"','"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Sherlock": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Lucky Candy Bar","Ruyi Scepter","Wildfire Torch"],
    allowedStones: ["Speed, HP","Speed, Attack"],
    allowedEquipments: ["Class Gear","No Armor"],
    allowedEnables: ['"Growth", "Shelter", "Resilience", "Growth", "UnbendingWill"','"Vitality", "Shelter", "Resilience", "Vitality", "UnbendingWill"']
  },
  "Tara": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Magic Stone Sword","Wildfire Torch"],
    allowedStones: ["Attack, Attack, Holy","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"','"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"']
  },
  "UniMax-3000": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Ruyi Scepter","Wildfire Torch"],
    allowedStones: ["Speed, HP","HP, Attack","HP, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"','"Vitality", "Vitality2", "Resilience", "Vitality", "UnbendingWill"']
  },
  "Ormus": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Magic Stone Sword","Wildfire Torch"],
    allowedStones: ["Attack, Attack","HP, Heal"],
    allowedEquipments: ["Class Gear","Split Attack"],
    allowedEnables: ['"Mightiness", "LethalFightback", "SharedFate", "Mightiness", "BalancedStrike"','"Growth", "Vitality2", "Purify", "Growth", "UnbendingWill"']
  },
  "Valkryie": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Wildfire Torch"],
    allowedStones: ["HP, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"']
  },
  "Gerke": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Magic Stone Sword","Wildfire Torch"],
    allowedStones: ["Attack, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Sleepless": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Magic Stone Sword","Wildfire Torch"],
    allowedStones: ["Attack, Attack, Holy"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "Das Moge": {
    allowedArtifacts: ["Augustus Magic Ball","Staff Punisher of Immortal","Golden Crown","Wildfire Torch"],
    allowedStones: ["Crit, Crit, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Ignis": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Ruyi Scepter","Wildfire Torch"],
    allowedStones: ["Speed, HP","HP, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Growth", "Vitality2", "Purify", "Growth", "UnbendingWill"','"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"']
  },
  "Heart Watcher": {
    allowedArtifacts: ["Augustus Magic Ball","Staff Punisher of Immortal","Golden Crown","Ruyi Scepter","Wildfire Torch"],
    allowedStones: ["Speed, HP","Speed, Crit"],
    allowedEquipments: ["Class Gear","Split HP"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"']
  },
  "King Barton": {
    allowedArtifacts: ["The Kiss of Ghost","Augustus Magic Ball","Golden Crown","Magic Stone Sword","Wildfire Torch"],
    allowedStones: ["Attack, Attack, Holy","HP, Attack"],
    allowedEquipments: ["Class Gear"],
    allowedEnables: ['"Growth", "Shelter", "Purify", "Growth", "UnbendingWill"','"Mightiness", "Shelter", "Purify", "Mightiness", "UnbendingWill"']
  },
  "Xia": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Wildfire Torch"],
    allowedStones: ["HP, HP"],
    allowedEquipments: ["Split HP"],
    allowedEnables: ['"Vitality", "Shelter", "Purify", "Vitality", "UnbendingWill"']
  },
  "Tix": {
    allowedArtifacts: ["Augustus Magic Ball","Golden Crown","Ruyi Scepter","Wildfire Torch"],
    allowedStones: ["Speed, HP","Crit, Crit, Attack","HP, HP"],
    allowedEquipments: ["Class Gear","Split HP"],
    allowedEnables: ['"Growth", "LethalFightback", "Purify", "Growth", "UnbendingWill"','"Growth", "Shelter", "Resilience", "Vitality", "UnbendingWill"']
  }
};
