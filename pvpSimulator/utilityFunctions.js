function formatNum(num) {
  return "<span class ='num'>" + num.toLocaleString() + "</span>";
}


// UUIDv4
function uuid() {
  return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
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
  if (["stun", "petrify", "freeze", "twine", "Silence", "Seal of Light", "Horrify", "Shapeshift", "Taunt"].includes(strName)) {
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
    "damageAgainstPoisoned", "damageAgainstFrozen",
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
  
  arrTargets = getTauntedTargets(source, arrTargets);
  if (arrTargets.length == 1) { return arrTargets; }
  
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
  
  arrTargets = getTauntedTargets(source, arrTargets);
  if (arrTargets.length == 1) { return arrTargets; }
  
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


function getAllTargets(source, arrTargets) {
  var copyTargets = [];
  
  arrTargets = getTauntedTargets(source, arrTargets);
  if (arrTargets.length == 1) { return arrTargets; }
  
  for (var i=0; i<arrTargets.length; i++) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      copyTargets.push(arrTargets[i]);
    }
  }
  
  return copyTargets;
}


function getRandomTargets(source, arrTargets) {
  var copyTargets = [];
  
  arrTargets = getTauntedTargets(source, arrTargets);
  if (arrTargets.length == 1) { return arrTargets; }
  
  for (var i=0; i<arrTargets.length; i++) {
    if (arrTargets[i]._currentStats["totalHP"] > 0) {
      arrTargets[i]._rng = Math.random();
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
  
  return copyTargets;
}


function getLowestHPTargets(source, arrTargets) {
  // get living targets with lowest current HP
  var copyTargets = [];
  
  arrTargets = getTauntedTargets(source, arrTargets);
  if (arrTargets.length == 1) { return arrTargets; }
  
  for (var i=0; i<arrTargets.length; i++) {
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
  
  return copyTargets;
}


function getLowestHPPercentTargets(source, arrTargets) {
  // get living targets with lowest current HP percent
  var copyTargets = [];
  
  arrTargets = getTauntedTargets(source, arrTargets);
  if (arrTargets.length == 1) { return arrTargets; }
  
  for (var i=0; i<arrTargets.length; i++) {
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
  
  return copyTargets;
}


function getHighestHPTargets(source, arrTargets) {
  // get living target with highest current HP
  var copyTargets = [];
  
  arrTargets = getTauntedTargets(source, arrTargets);
  if (arrTargets.length == 1) { return arrTargets; }
  
  for (var i=0; i<arrTargets.length; i++) {
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
  
  return copyTargets;
}


function getTauntedTargets(source, arrTargets) {
  var copyTargets = [];
  
  if (!(isMonster(source)) && arrTargets.length > 0) {
    if (!(source._attOrDef == arrTargets[0]._attOrDef) && "Taunt" in source._debuffs) {
      for (var i in arrTargets) {
        if (arrTargets[i]._heroName == "UniMax-3000" && arrTargets[i]._currentStats["totalHP"] > 0) {
          copyTargets.push(arrTargets[i]);
          return copyTargets;
        }
      }
    }
  }
  
  return arrTargets;
}