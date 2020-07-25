function formatNum(num) {
  return "<span class ='num'>" + num.toLocaleString() + "</span>";
}


// replacement seedable prng
var random = rng();
function rng(seed=0) {
  if (seed == 0) {
    let dt = new Date();
    seed = dt.valueOf();
  }
  
  var strSeed = seed.toString();
  var a, b, c, d;
  
  for (var i = 0, h = 1779033703 ^ strSeed.length; i < strSeed.length; i++) {
    h = Math.imul(h ^ strSeed.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  
  h = Math.imul(h ^ h >>> 16, 2246822507);
  h = Math.imul(h ^ h >>> 13, 3266489909);
  h ^= h >>> 16
  var a = h >>> 0;
  
  h = Math.imul(h ^ h >>> 16, 2246822507);
  h = Math.imul(h ^ h >>> 13, 3266489909);
  h ^= h >>> 16
  var b = h >>> 0;
  
  h = Math.imul(h ^ h >>> 16, 2246822507);
  h = Math.imul(h ^ h >>> 13, 3266489909);
  h ^= h >>> 16
  var c = h >>> 0;
  
  h = Math.imul(h ^ h >>> 16, 2246822507);
  h = Math.imul(h ^ h >>> 13, 3266489909);
  h ^= h >>> 16
  var d = h >>> 0;
  
  
  return function() {
    var t = b << 9;
    var r = a * 5;
    
    r = (r << 7 | r >>> 25) * 9;
    c ^= a; 
    d ^= b;
    b ^= c; 
    a ^= d; 
    c ^= t;
    d = d << 11 | d >>> 21;
    
    return (r >>> 0) / 4294967296;
  }
}


// stack ids for buffs and debuffs
var uniqID;
function uuid() {
  uniqID++;
  return uniqID;
}


function speedSort(heroA, heroB) {
  if (heroA._currentStats["speed"] > heroB._currentStats["speed"]) {
    return -1;
  } else if (heroA._currentStats["speed"] < heroB._currentStats["speed"]) {
    return 1;
  } else if (heroA._attOrDef == "att" && heroB._attOrDef == "def") {
    return -1;
  } else if (heroA._attOrDef == "def" && heroB._attOrDef == "att") {
    return 1;
  } else if (heroA._heroPos < heroB._heroPos) {
    return -1;
  } else {
    return 1;
  }
}


function slotSort(heroA, heroB) {
  if (heroA._attOrDef == "att" && heroB._attOrDef == "def") {
    return -1;
  } else if (heroA._attOrDef == "def" && heroB._attOrDef == "att") {
    return 1;
  } else if (heroA._heroPos < heroB._heroPos) {
    return -1;
  } else {
    return 1;
  }
}


function isMonster(source) {
  if ("_monsterName" in source) {
    return true;
  } else {
    return false;
  }
}


function isDispellable(strName) {
  if (["Seal of Light", "Power of Light", "Ghost Possessed", "Link of Souls", "Demon Totem", "Shrink", "Shield", "Feather Blade"].includes(strName)) {
    return false;
  } else {
    return true;
  }
}


function isControlEffect(strName, effects={}) {
  if (["stun", "petrify", "freeze", "twine", "Silence", "Seal of Light", "Horrify", "Shapeshift", "Taunt", "Dazzle"].includes(strName)) {
    return true;
  } else {
    return false;
  }
}


function isDot(strName, effects={}) {
  if (["Burn", "Bleed", "Poison", "Dot", "burn", "bleed", "poison", "dot", "burnTrue", "bleedTrue", "poisonTrue"].includes(strName)) {
    return true;
  } else {
    for (var e in effects) {
      if (["burn", "bleed", "poison", "dot", "burnTrue", "bleedTrue", "poisonTrue"].includes(e)) {
        return true;
      }
    }
    
    return false;
  }
}


function isFrontLine(target, arrTargets) {
  var frontCount = 0;
  var backCount = 0;
  
  for (var i = 0; i < 2; i++) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      frontCount++;
    }
  }
  
  for (var i = 2; i < arrTargets.length; i++) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      backCount++;
    }
  }
  
  if (frontCount > 0 && target._heroPos < 2) {
    return true;
  } else if (frontCount == 0 && target._heroPos >= 2) {
    return true;
  } else {
    return false;
  }
}


function isBackLine(target, arrTargets) {
  var frontCount = 0;
  var backCount = 0;
  
  for (var i = 0; i < 2; i++) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      frontCount++;
    }
  }
  
  for (var i = 2; i < arrTargets.length; i++) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      backCount++;
    }
  }
  
  if (backCount > 0 && target._heroPos >= 2) {
    return true;
  } else if (backCount == 0 && target._heroPos < 2) {
    return true;
  } else {
    return false;
  }
}


function isAttribute(strName, effects={}) {
  var arrAttributes = [
    "attack", "attackPercent", "armor", "armorPercent", "hp", "hpPercent", "speed",
    "energy", "precision", "block", "crit", "critDamage", "holyDamage", "armorBreak",
    "controlImmune", "skillDamage", "damageReduce", "allDamageReduce", "controlPrecision",
    "healEffect", "effectBeingHealed", "critDamageReduce", "dotReduce", "fixedAttack", 
    "fixedHP", "allDamageTaken", "allDamageDealt", "damageAgainstBurning", "damageAgainstBleeding",
    "damageAgainstPoisoned", "damageAgainstFrozen", "dodge",
    "warriorReduce", "mageReduce", "rangerReduce", "assassinReduce", "priestReduce",
    "freezeImmune", "petrifyImmune", "stunImmune", "twineImmune"
  ];
  
  if (arrAttributes.includes(strName)) {
    return true;
  } else {
    for (var e in effects) {
      if (arrAttributes.includes(e)) {
        return true;
      }
    }
    
    return false;
  }
}


function getFrontTargets(source, arrTargets) {
  var copyTargets = [];
  
  copyTargets = getTauntedTargets(source, arrTargets);
  if (copyTargets.length > 0) { return copyTargets; }
  
  if (arrTargets[0]._currentStats["totalHP"] > 0) {
    copyTargets.push(arrTargets[0]);
  }
  if (arrTargets[1]._currentStats["totalHP"] > 0) {
    copyTargets.push(arrTargets[1]);
  }
  
  if (copyTargets.length == 0) {
    for (var h=2; h<arrTargets.length; h++) {
      if (arrTargets[h]._currentStats["totalHP"] > 0) {
        copyTargets.push(arrTargets[h]);
      }
    }
  }
  
  return copyTargets;
}


function getBackTargets(source, arrTargets) {
  var copyTargets = [];
  
  copyTargets = getTauntedTargets(source, arrTargets);
  if (copyTargets.length > 0) { return copyTargets; }
  
  for (var h=2; h<arrTargets.length; h++) {
    if (arrTargets[h]._currentStats["totalHP"] > 0) {
      copyTargets.push(arrTargets[h]);
    }
  }
  
  if (copyTargets.length == 0) {
    for (var h=0; h<2; h++) {
      if (arrTargets[h]._currentStats["totalHP"] > 0) {
        copyTargets.push(arrTargets[h]);
      }
    }
  }
  
  return copyTargets;
}


function getAllTargets(source, arrTargets, num=6) {
  var copyTargets = [];
  var count = 0;
  
  copyTargets = getTauntedTargets(source, arrTargets, num);
  if (copyTargets.length > 0) { return copyTargets; }
  
  for (var i in arrTargets) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      copyTargets.push(arrTargets[i]);
      count++;
    }
    
    if (count == num) { break; }
  }
  
  return copyTargets;
}


function getRandomTargets(source, arrTargets, num=6, dazzleBypass=false) {
  var copyTargets = [];
  var copyTargets2 = [];
  var count = 0;
  
  if (!(dazzleBypass)) {
    copyTargets = getTauntedTargets(source, arrTargets, num);
  }
  if (copyTargets.length > 0) { return copyTargets; }
  
  for (var i in arrTargets) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      arrTargets[i]._rng = random();
      copyTargets.push(arrTargets[i]);
    }
  }
  
  copyTargets.sort(function(a,b) {
    if (a._rng > b._rng) {
      return 1;
    } else if (a._rng < b._rng) {
      return -1;
    } else {
      return 0;
    }
  });
  
  for (var i in copyTargets) {
    copyTargets2.push(copyTargets[i]);
    count++;
    if (count == num) { break; }
  }
  
  return copyTargets2;
}


function getLowestHPTargets(source, arrTargets, num=6) {
  // get living targets with lowest current HP
  var copyTargets = [];
  var copyTargets2 = [];
  var count = 0;
  
  copyTargets = getTauntedTargets(source, arrTargets, num);
  if (copyTargets.length > 0) { return copyTargets; }
  
  for (var i in arrTargets) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      copyTargets.push(arrTargets[i]);
    }
  }
  
  copyTargets.sort(function(a,b) {
    if (a._currentStats["totalHP"] > b._currentStats["totalHP"]) {
      return 1;
    } else if (a._currentStats["totalHP"] < b._currentStats["totalHP"]) {
      return -1;
    } else if (a._heroPos < b._heroPos) {
      return -1;
    } else {
      return 1;
    }
  });
  
  for (var i in copyTargets) {
    copyTargets2.push(copyTargets[i]);
    count++;
    if (count == num) { break; }
  }
  
  return copyTargets2;
}


function getLowestHPPercentTargets(source, arrTargets, num=6) {
  // get living targets with lowest current HP percent
  var copyTargets = [];
  var copyTargets2 = [];
  var count = 0;
  
  copyTargets = getTauntedTargets(source, arrTargets, num);
  if (copyTargets.length > 0) { return copyTargets; }
  
  for (var i in arrTargets) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      copyTargets.push(arrTargets[i]);
    }
  }
  
  copyTargets.sort(function(a,b) {
    if (a._currentStats["totalHP"] / a._stats["totalHP"] > b._currentStats["totalHP"] / b._stats["totalHP"]) {
      return 1;
    } else if (a._currentStats["totalHP"] / a._stats["totalHP"] < b._currentStats["totalHP"] / b._stats["totalHP"]) {
      return -1;
    } else if (a._heroPos < b._heroPos) {
      return -1;
    } else {
      return 1;
    }
  });
  
  for (var i in copyTargets) {
    copyTargets2.push(copyTargets[i]);
    count++;
    if (count == num) { break; }
  }
  
  return copyTargets2;
}


function getHighestHPTargets(source, arrTargets, num=6) {
  // get living target with highest current HP
  var copyTargets = [];
  var copyTargets2 = [];
  var count = 0;
  
  copyTargets = getTauntedTargets(source, arrTargets, num);
  if (copyTargets.length > 0) { return copyTargets; }
  
  for (var i in arrTargets) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      copyTargets.push(arrTargets[i]);
    }
  }
  
  copyTargets.sort(function(a,b) {
    if (a._currentStats["totalHP"] > b._currentStats["totalHP"]) {
      return -1;
    } else if (a._currentStats["totalHP"] < b._currentStats["totalHP"]) {
      return 1;
    } else if (a._heroPos < b._heroPos) {
      return -1;
    } else {
      return 1;
    }
  });
  
  for (var i in copyTargets) {
    copyTargets2.push(copyTargets[i]);
    count++;
    if (count == num) { break; }
  }
  
  return copyTargets2;
}


function getTauntedTargets(source, arrTargets, num=6) {
  var copyTargets = [];
  
  if (!(isMonster(source)) && arrTargets.length > 0) {
    if (!(source._attOrDef == arrTargets[0]._attOrDef)) {
      if ("Dazzle" in source._debuffs) {
        return getRandomTargets(source, source._enemies, 1, true);
      } else if ("Taunt" in source._debuffs) {
        for (var i in source._enemies) {
          if (source._enemies[i]._heroName == "UniMax-3000" && source._enemies[i]._currentStats["totalHP"] > 0) {
            copyTargets.push(source._enemies[i]);
          }
        }
      }
    }
  }
  
  return copyTargets;
}


var translate = {
  "hp": "Pre-Multiplier HP",
  "attack": "Pre-Multiplier Attack",
  "armor": "Pre-Multiplier Armor",
  "totalHP": "Total HP",
  "totalAttack": "Total Attack",
  "totalArmor": "Total Armor",
  "speed": "Speed",
  "hpPercent": "HP Percent Multiplier",
  "attackPercent": "Attack Percent Multiplier",
  "armorPercent": "Armor Percent Multiplier",
  "energy": "Energy",
  "skillDamage": "Skill Damage",
  "precision": "Precision",
  "block": "Block Chance",
  "crit": "Crit Chance",
  "critDamage": "Crit Damage",
  "armorBreak": "Armor Break",
  "controlImmune": "CC Resist Chance",
  "damageReduce": "Damage Reduce",
  "holyDamage": "Holy Damage",
  "warriorReduce": "Reduce Damage Taken from Warrior",
  "mageReduce": "Reduce Damage Taken from Mage",
  "rangerReduce": "Reduce Damage Taken from Ranger",
  "assassinReduce": "Reduce Damage Taken from Assassin",
  "priestReduce": "Reduce Damage Taken from Priest",
  "freezeImmune": "Chance to Resist Freeze",
  "petrifyImmune": "Chance to Resist Petrify",
  "stunImmune": "Chance to Resist Stun",
  "twineImmune": "Chance to Resist Twine",
  "critDamageReduce": "Reduce Damage Taken from Crit",
  "unbendingWillTriggered": "Unbending Will Triggered This Battle",
  "unbendingWillStacks": "Unbending Will Stacks Left",
  "effectBeingHealed": "Increase Heal Received",
  "healEffect": "Increase Heals Given",
  "dotReduce": "Reduced Damage from DoT",
  "controlPrecision": "Increase Chance to Apply CC",
  "fixedAttack": "Fixed Attack",
  "fixedHP": "Fixed HP",
  "damageAgainstBurning": "Damage Dealt to Burning Targets",
  "damageAgainstBleeding": "Damage Dealt to Bleeding Targets",
  "damageAgainstPoisoned": "Damage Dealt to Poisoned Targets",
  "damageAgainstFrozen": "Damage Dealt to Frozen Targets",
  "allDamageReduce": "Reduce All Damage Taken",
  "allDamageTaken": "Increase All Damage Taken",
  "allDamageDealt": "Increase All Damage Dealt",
  "controlImmunePen": "Reduce Target CC Resistance",
  "firstCC": "First CC Received During Battle",
  "revive": "Resurrecter",
  "spiritPowerStacks": "Spirit Power Stacks",
  "courageousTriggered": "Courageous Triggered This Battle",
  "linkCount": "Number of Link Activations This Round",
  "blockCount": "Number of Blocks",
  "flameInvasionTriggered": "Flame Invasion Triggered This Battle",
  "wellCalculatedStacks": "Well Calculated Stacks",
  "burn": "Burn",
  "burnTrue": "Burn (True Damage)",
  "bleed": "Bleed",
  "bleedTrue": "Bleed (True Damage)",
  "poison": "Poison",
  "poisonTrue": "Poison (True Damage)",
  "dot": "Generic DoT",
  "heal": "Heal",
  "attackAmount": "Snapshot Attack Amount",
  "rounds": "Number of Rounds",
  "stacks": "Number of Stacks",
  "dodge": "Dodge",
  "isCharging": "Charging Attack",
  "damageAmount": "Snapshot Damage Amount",
  "damageAgainstWarrior": "Damage Against Warrior",
  "damageAgainstMage": "Damage Against Mage",
  "damageAgainstRanger": "Damage Against Ranger",
  "damageAgainstAssassin": "Damage Against Assassin",
  "damageAgainstPriest": "Damage Against Priest",
  "valkryieBasic": "Flag Burn from Valkryie Basic",
  "Seal of LightImmune": "Chance to Resist Seal of Light",
  "ShapeshiftImmune": "Chance to Resist Shapeshift",
  "TauntImmune": "Chance to Resist Taunt",
  "DazzleImmune": "Chance to Resist Dazzle",
  "HorrifyImmune": "Chance to Resist Horrify",
  "SilenceImmune": "Chance to Resist Silence"
};