var skins = {
  "Aida": {
    "Dark Eclipse": {controlImmune: 0.05, hpPercent: 0.03, attackPercent: 0.03},
    "Legendary Dark Eclipse": {controlImmune: 0.06, hpPercent: 0.06, attackPercent: 0.06},
    "Luo River Lady": {speed: 4, hpPercent: 0.05, damageReduce: 0.03},
    "Legendary Luo River Lady": {speed: 6, hpPercent: 0.08, damageReduce: 0.04}
  },
  
  "Amen-Ra": {
    "Dread Puppet": {speed: 4, hpPercent: 0.05, damageReduce:0.04},
    "Legendary Dread Puppet": {speed: 6, hpPercent: 0.08, damageReduce:0.04},
    "Monstrous Tribunal": {hpPercent: 0.03, attackPercent: 0.03, controlImmune: 0.05},
    "Legendary Monstrous Tribunal": {hpPercent: 0.06, attackPercent: 0.06, controlImmune: 0.06}
  },
  
  "Amuvor": {
    "Celestial Messenger": {hpPercent: 0.03, armorBreak: 0.05},
    "Original Sin": {attackPercent: 0.03, crit: 0.02, critDamage: 0.05},
    "Legendary Original Sin": {attackPercent: 0.06, crit: 0.03, critDamage: 0.075}
  },
  
  "Aspen": {
    "Dragonic Warrior": {hpPercent: 0.05, attackPercent: 0.03, critDamage: 0.05},
    "Legendary Dragonic Warrior": {hpPercent: 0.08, attackPercent: 0.06, critDamage: 0.075},
    "Santa": {speed: 4, attackPercent: 0.03, critDamage: 0.05},
    "Legendary Santa": {speed: 6, attackPercent: 0.06, critDamage: 0.1}
  },
  
  "Belrain": {
    "Christmas Tiny Reindeer": {hpPercent: 0.03, attackPercent: 0.03, speed: 4},
    "Legendary Christmas Tiny Reindeer": {hpPercent: 0.06, attackPercent: 0.06, speed: 6},
    "Lead Singer of the Angel Band": {attackPercent: 0.03, damageReduce: 0.03, holyDamage: 0.05},
    "Legendary Lead Singer of the Angel Band": {attackPercent: 0.06, damageReduce: 0.04, holyDamage: 0.08}
  },
  
  "Carrie": {
    "Little Red Riding Hood": {hpPercent: 0.03, attackPercent: 0.03, damageReduce: 0.03},
    "Legendary Little Red Riding Hood": {hpPercent: 0.06, attackPercent: 0.06, damageReduce: 0.04}
  },
  
  "Cthuga": {
    "Devils Night": {hpPercent: 0.03, attackPercent: 0.03, controlImmune: 0.05},
    "Legendary Devils Night": {hpPercent: 0.06, attackPercent: 0.06, controlImmune: 0.06},
    "Domineering Boss": {attackPercent: 0.03, controlImmune: 0.05, damageReduce: 0.03},
    "Legendary Domineering Boss": {attackPercent: 0.06, controlImmune: 0.06, damageReduce: 0.04}
  },
  
  "Dark Arthindol": {
    "Gone Like a Dream": {speed: 4, attackPercent: 0.03, critDamage: 0.05},
    "Legendary Gone Like a Dream": {speed: 6, attackPercent: 0.06, critDamage: 0.1},
    "Revenge Bride": {hpPercent: 0.03, attackPercent: 0.02, skillDamage: 0.1},
    "Legendar Revenge Bride": {hpPercent: 0.06, attackPercent: 0.04, skillDamage: 0.15},
  },
  
  "Delacium": {
    "Jellybane": {hpPercent: 0.03, attackPercent: 0.03, crit: 0.2},
    "Legendary Jellybane": {hpPercent: 0.06, attackPercent: 0.06, crit: 0.3}
  },
  
  "Elyvia": {
    "Sweet Dance": {hpPercent: 0.03, controlImmune: 0.04, speed: 4},
    "Legendary Sweet Dance": {hpPercent: 0.06, controlImmune: 0.06, speed: 6},
  },
  
  "Emily": {
    "Fractured Rose": {hpPercent: 0.03, block: 0.04, speed: 4},
    "Legendary Fractured Rose": {hpPercent: 0.06, block: 0.06, speed: 6}
  },
  
  "Garuda": {
    "Super Harvest": {attackPercent: 0.03, hpPercent: 0.03, damageReduce: 0.03},
    "Legendary Super Harvest": {attackPercent: 0.06, hpPercent: 0.06, damageReduce: 0.04},
    "Law of the West": {holyDamage: 0.06, damageReduce: 0.04, critDamage: 0.05},
    "Legendary Law of the West": {holyDamage: 0.1, damageReduce: 0.05, critDamage: 0.1}
  },
  
  "Gustin": {
    "Grand Carnival": {controlImmune: 0.05, hpPercent: 0.05, attackPercent: 0.03},
    "Legendary Grand Carnival": {controlImmune: 0.06, hpPercent: 0.06, attackPercent: 0.06},
  },
  
  "Horus": {
    "Bloody War God": {hpPercent: 0.03, attackPercent: 0.03, critDamage: 0.05},
    "Legendary Bloody War God": {hpPercent: 0.06, attackPercent: 0.06, critDamage: 0.075},
    "Steam Fantasy": {damageReduce: 0.04, attackPercent: 0.03, block: 0.04},
    "Legendary Steam Fantasy": {damageReduce: 0.05, attackPercent: 0.06, block: 0.06}
  },
  
  "Ithaqua": {
    "Skin Placeholder": {},
    "Legendary Skin Placeholder": {}
  },
  
  "Kroos": {
    "Mourners": {hpPercent: 0.03, damageReduce: 0.03, speed: 4},
    "Legendary Mourners": {hpPercent: 0.06, damageReduce: 0.04, speed: 6}
  },
  
  "Michelle": {
    "Seraph": {hpPercent: 0.05, damageReduce: 0.03},
    "Legendary Seraph": {hpPercent: 0.08, damageReduce: 0.04},
    "True Love Queen": {hpPercent: 0.05, attackPercent: 0.03, speed: 4},
    "Legendary True Love Queen": {hpPercent: 0.08, attackPercent: 0.06, speed: 6}
  },
  
  "Mihm": {
    "Ace Quarterback": {holyDamage: 0.05, attackPercent: 0.02, speed: 4},
    "Legendary Ace Quarterback": {holyDamage: 0.08, attackPercent: 0.04, speed: 6},
    "Frost Eye": {hpPercent: 0.03, attackPercent: 0.02, damageReduce: 0.03},
    "Legendary Frost Eye": {hpPercent: 0.06, attackPercent: 0.04, damageReduce: 0.04}
  },
  
  "Nakia": {
    "Crescent Emissary": {attackPercent: 0.03, hpPercent: 0.03, damageReduce: 0.03},
    "Legendary Crescent Emissary": {attackPercent: 0.06, hpPercent: 0.06, damageReduce: 0.04}
  },
  
  "Oberon": {
    "Blue Luan": {speed: 4, attackPercent: 0.03, holyDamage: 0.05},
    "Legendary Blue Luan": {speed: 6, attackPercent: 0.06, holyDamage: 0.08},
    "Golden Memories": {speed: 4, hpPercent: 0.05, damageReduce: 0.03},
    "Legendary Golden Memories": {speed: 6, hpPercent: 0.08, damageReduce: 0.04},
  },
  
  "Penny": {
    "Infinite Joy": {controlImmune: 0.05, critDamage: 0.05, hpPercent: 0.03},
    "Legendary Infinite Joy": {controlImmune: 0.06, critDamage: 0.1, hpPercent: 0.06},
    "Lion and Dragon Dance": {attackPercent: 0.03, controlImmune: 0.05, damageReduce: 0.03},
    "Legendary Lion and Dragon Dance": {attackPercent: 0.06, controlImmune: 0.06, damageReduce: 0.04},
  },
  
  "Tara": {
    "Heroic Knight": {damageReduce: 0.04, controlImmune: 0.04, speed: 4},
    "Legendary Heroic Knight": {damageReduce: 0.05, controlImmune: 0.06, speed: 6},
    "Spirit of Creation": {holyDamage: 0.06, attackPercent: 0.03, hpPercent: 0.03},
    "Legendary Spirit of Creation": {holyDamage: 0.1, attackPercent: 0.06, hpPercent: 0.06}
  },
  
  "UniMax-3000": {
    "League MVP": {controlImmune: 0.05, hpPercent: 0.03, attackPercent: 0.03},
    "Legendary League MVP": {controlImmune: 0.06, hpPercent: 0.06, attackPercent: 0.06},
  }
};