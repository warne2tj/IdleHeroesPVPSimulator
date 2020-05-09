// hero base stats dictionary
// base stats before anything is applied, even passives

var baseHeroStats = {
  "None": {
    className: hero,
    heroFaction: "",
    heroClass: "",
    stats: {
      baseHP: 0,
      baseAttack: 0,
      baseArmor: 0,
      baseSpeed: 0,
      growHP: 0,
      growAttack: 0,
      growArmor: 0,
      growSpeed: 0
    }
  },
  
  "Aida": {
    className: Aida,
    heroFaction: "Light",
    heroClass: "Mage",
    stats: {
      baseHP: 7234,
      baseAttack: 512,
      baseArmor: 58,
      baseSpeed: 226,
      growHP: 723.4,
      growAttack: 51.2,
      growArmor: 5.8,
      growSpeed: 2
    }
  },
  
  "Amen-Ra": {
    className: AmenRa,
    heroFaction: "Dark",
    heroClass: "Priest",
    stats: {
      baseHP: 8986,
      baseAttack: 338,
      baseArmor: 61,
      baseSpeed: 235,
      growHP: 898.6,
      growAttack: 34,
      growArmor: 6.1,
      growSpeed: 2
    }
  },
  
  "Amuvor": {
    className: Amuvor,
    heroFaction: "Dark",
    heroClass: "Assassin",
    stats: {
      baseHP: 7363,
      baseAttack: 484,
      baseArmor: 60,
      baseSpeed: 235,
      growHP: 736.3,
      growAttack: 48.4,
      growArmor: 6,
      growSpeed: 2
    }
  },
  
  "Aspen": {
    className: Aspen,
    heroFaction: "Dark",
    heroClass: "Warrior",
    stats: {
      baseHP: 8986,
      baseAttack: 338,
      baseArmor: 61,
      baseSpeed: 235,
      growHP: 898.6,
      growAttack: 34,
      growArmor: 6.1,
      growSpeed: 2
    }
  },
  
  "Belrain": {
    className: Belrain,
    heroFaction: "Light",
    heroClass: "Priest",
    stats: {
      baseHP: 7127,
      baseAttack: 386,
      baseArmor: 60,
      baseSpeed: 210,
      growHP: 712.7,
      growAttack: 38.6,
      growArmor: 6,
      growSpeed: 2
    }
  },
  
  "Carrie": {
    className: Carrie,
    heroFaction: "Dark",
    heroClass: "Ranger",
    stats: {
      baseHP: 9680,
      baseAttack: 343,
      baseArmor: 60,
      baseSpeed: 226,
      growHP: 968,
      growAttack: 34.3,
      growArmor: 6,
      growSpeed: 2
    }
  },
  
  "Dark Arthindol": {
    className: DarkArthindol,
    heroFaction: "Dark",
    heroClass: "Mage",
    stats: {
      baseHP: 6900,
      baseAttack: 422,
      baseArmor: 58,
      baseSpeed: 207,
      growHP: 690,
      growAttack: 42.2,
      growArmor: 5.8,
      growSpeed: 2
    }
  },
  
  "Delacium": {
    className: Delacium,
    heroFaction: "Abyss",
    heroClass: "Mage",
    stats: {
      baseHP: 7587,
      baseAttack: 433,
      baseArmor: 63,
      baseSpeed: 226,
      growHP: 758.7,
      growAttack: 43.3,
      growArmor: 6.3,
      growSpeed: 2
    }
  },
  
  "Elyvia": {
    className: Elyvia,
    heroFaction: "Forest",
    heroClass: "Priest",
    stats: {
      baseHP: 7057,
      baseAttack: 354,
      baseArmor: 60,
      baseSpeed: 228,
      growHP: 705.7,
      growAttack: 35.4,
      growArmor: 6,
      growSpeed: 2
    }
  },
  
  "Garuda": {
    className: Garuda,
    heroFaction: "Forest",
    heroClass: "Warrior",
    stats: {
      baseHP: 8202,
      baseAttack: 353,
      baseArmor: 62,
      baseSpeed: 235,
      growHP: 820.2,
      growAttack: 35.3,
      growArmor: 6.2,
      growSpeed: 2
    }
  },
  
  "Gustin": {
    className: Gustin,
    heroFaction: "Shadow",
    heroClass: "Priest",
    stats: {
      baseHP: 8252,
      baseAttack: 343,
      baseArmor: 62,
      baseSpeed: 220,
      growHP: 825.2,
      growAttack: 34.3,
      growArmor: 6.2,
      growSpeed: 2
    }
  },
  
  "Horus": {
    className: Horus,
    heroFaction: "Shadow",
    heroClass: "Warrior",
    stats: {
      baseHP: 8252,
      baseAttack: 343,
      baseArmor: 62,
      baseSpeed: 227,
      growHP: 825.2,
      growAttack: 34.3,
      growArmor: 6.2,
      growSpeed: 2
    }
  },
  
  "Ithaqua": {
    className: Ithaqua,
    heroFaction: "Shadow",
    heroClass: "Assassin",
    stats: {
      baseHP: 9436,
      baseAttack: 478,
      baseArmor: 62,
      baseSpeed: 235,
      growHP: 943.6,
      growAttack: 47.8,
      growArmor: 6.2,
      growSpeed: 2
    }
  },
  
  "Penny": {
    className: Penny,
    heroFaction: "Fortress",
    heroClass: "Ranger",
    stats: {
      baseHP: 7937,
      baseAttack: 397,
      baseArmor: 60,
      baseSpeed: 236,
      growHP: 793.7,
      growAttack: 39.7,
      growArmor: 6,
      growSpeed: 2
    }
  },
  
  "Tara": {
    className: Tara,
    heroFaction: "Light",
    heroClass: "Warrior",
    stats: {
      baseHP: 9010,
      baseAttack: 338,
      baseArmor: 61,
      baseSpeed: 235,
      growHP: 901,
      growAttack: 34,
      growArmor: 6.1,
      growSpeed: 2
    }
  },
  
  "UniMax-3000": {
    className: UniMax3000,
    heroFaction: "Fortress",
    heroClass: "Warrior",
    stats: {
      baseHP: 9100,
      baseAttack: 306,
      baseArmor: 82,
      baseSpeed: 248,
      growHP: 910,
      growAttack: 30.6,
      growArmor: 8.5,
      growSpeed: 2
    }
  }
};
