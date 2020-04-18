var weapons = {
  "None": {
    set: "",
    stats: {},
    limit: "",
    limitStats: {}
  },
  
  "6* Thorny Flame Whip": {
    set: "Thorny Flame Suit",
    stats: {attack: 3704, critDamage: 0.05},
    limit: "",
    limitStats: {}
  },
  
  "5* Glory Warrior Sword": {
    set: "Glory Suit",
    stats: {attack: 2464, critDamage: 0.03},
    limit: "",
    limitStats: {}
  },
  
  "Warrior's Epee": {
    set: "",
    stats: {attack: 3704, attackPercent: 0.07},
    limit: "Warrior",
    limitStats: {attackPercent: 0.06, block: 0.1}
  }
};


var armors = {
  "None": {
    set: "",
    stats: {},
    limit: "",
    limitStats: {}
  },
  
  "6* Flame Armor": {
    set: "Thorny Flame Suit",
    stats: {hp: 52449, damageReduce: 0.02},
    limit: "",
    limitStats: {}
  },
  
  "5* Glory Armor": {
    set: "Glory Suit",
    stats: {hp: 32455, damageReduce: 0.01},
    limit: "",
    limitStats: {}
  },
  
  "Warrior's Armor": {
    set: "",
    stats: {hp: 52449, hpPercent: 0.07},
    limit: "Warrior",
    limitStats: {hpPercent: 0.06, damageReduce: 0.05}
  }
};


var shoes = {
  "None": {
    set: "",
    stats: {},
    limit: "",
    limitStats: {}
  },
  
  "6* Flame Boots": {
    set: "Thorny Flame Suit",
    stats: {hp: 32367, block: 0.04},
    limit: "",
    limitStats: {}
  },
  
  "5* Glory Boots": {
    set: "Glory Suit",
    stats: {hp: 20146, block: 0.02},
    limit: "",
    limitStats: {}
  },
  
  "Warrior's Boots": {
    set: "",
    stats: {hp: 32367, hpPercent: 0.07},
    limit: "Warrior",
    limitStats: {hpPercent: 0.06, speed: 20}
  }
};


var accessories = {
  "None": {
    set: "",
    stats: {},
    limit: "",
    limitStats: {}
  },
  
  "6* Flame Necklace": {
    set: "Thorny Flame Suit",
    stats: {attack: 2469, skillDamage: 0.05},
    limit: "",
    limitStats: {}
  },
  
  "5* Glory Ring": {
    set: "Glory Suit",
    stats: {attack: 1643, skillDamage: 0.03},
    limit: "",
    limitStats: {}
  },
  
  "Warrior's Necklace": {
    set: "",
    stats: {attack: 2469, attackPercent: 0.07},
    limit: "Warrior",
    limitStats: {attackPercent: 0.06, controlImmune: 0.05}
  }
};


// Set order seems to matter, ordered in order of weakest to strongest set.
var setBonus = {
  "Glory Suit": {
    2: {hpPercent: 0.15},
    3: {attackPercent: 0.2},
    4: {hpPercent: 0.08}
  },
  
  "Thorny Flame Suit": {
    2: {hpPercent: 0.16},
    3: {attackPercent: 0.21},
    4: {hpPercent: 0.08}
  }
};