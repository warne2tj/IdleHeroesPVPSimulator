/* Start of monsters.js */

class monster {
  constructor(sMonsterName, attOrDef) {
    this._monsterName = sMonsterName;
    this._attOrDef = attOrDef;
    this._heroClass = "monster";
    
    if (attOrDef == "att") {
      this._allies = attHeroes;
      this._enemies = defHeroes;
    } else {
      this._allies = defHeroes;
      this._enemies = attHeroes;
    }
    
    this._currentStats = {
      "damageDealt": 0,
      "damageHealed": 0,
      "healEffect": 0.0
    };
    
    this._energy = 0;
  }
  
  
  heroDesc() {
    return "<span class='" + this._attOrDef + "'>" + this._monsterName + " (" + this._energy + " energy)</span>";
  }
  
  
  calcDamage(target, attackDamage, damageSource, damageType) {
    var damageAmount = attackDamage;
    var allDamageReduce = target._currentStats["allDamageReduce"];
    var dotReduce = 0;
    
    if (isDot(damageType)) {
      dotReduce = target._currentStats["dotReduce"];
    }
    
    damageAmount = Math.floor(damageAmount * (1 - allDamageReduce) * (1 - dotReduce));
    
    return {
      "damageAmount": damageAmount,
      "critted": false, 
      "blocked": false, 
      "damageSource": damageSource, 
      "damageType": damageType
    };
  }
  
  
  calcHeal(target, healAmount) {
    var effectBeingHealed = 1 + target._currentStats["effectBeingHealed"];
    if (effectBeingHealed < 0) { effectBeingHealed = 0; }
    
    return Math.floor(healAmount * effectBeingHealed);
  }
  
  
  doActive() {
    var result = "";
    
    result = "<div><span class='" + this._attOrDef + "'>" + this._monsterName + "</span> used <span class='skill'>Active Template</span>.</div>";
    
    this._energy = 0;
    return result;
  }
}


class mDyne extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = getRandomTargets(this, this._enemies, 4);
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], 402068, "monster", "true");
      result += targets[i].takeDamage(this, "Emerald Nourishing", damageResult);
    }
    
    
    var healAmount = 0;
    var targets = getRandomTargets(this, this._allies, 4);
    
    for (var i in targets) {
      result += targets[i].getBuff(this, "Armor Percent", 2, {armorPercent: 0.37});
      result += targets[i].getBuff(this, "Attack Percent", 2, {attackPercent: 0.15});
      
      healAmount = this.calcHeal(targets[i], targets[i]._stats["totalHP"] * 0.2);
      result += targets[i].getHeal(this, healAmount);
    }
    
    this._energy = 0;
    
    return result;
  }
}


class mFenlier extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = getRandomTargets(this, this._enemies, 4);
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], 602441, "monster", "true");
      result += targets[i].takeDamage(this, "Violent Bite", damageResult);
      
      damageResult = this.calcDamage(targets[i], 559177, "monster", "bleedTrue");
      result += targets[i].getDebuff(this, "Bleed", 3, {bleedTrue: damageResult["damageAmount"]}, false, "monster");
    }
    
    
    targets = getRandomTargets(this, this._allies, 4);
    for (var i in targets) {
      result += targets[i].getBuff(this, "Damage Against Bleeding", 3, {damageAgainstBleeding: 0.8});
    }
    
    this._energy = 0;
    
    return result;
  }
}


class mFox extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = getRandomTargets(this, this._enemies, 4);
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], 636573, "monster", "true");
      result += targets[i].takeDamage(this, "Soul Shock", damageResult);
      result += targets[i].getDebuff(this, "Silence", 2, {}, false, "", 0.40);
    }
    
    targets = getRandomTargets(this, this._allies, 4);
    for (var i in targets) {
      result += targets[i].getEnergy(this, 62);
    }
    
    this._energy = 0;
    
    return result;
  }
}


class mIceGolem extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = getRandomTargets(this, this._enemies, 4);
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], 809114, "monster", "true");
      result += targets[i].takeDamage(this, "Frozen", damageResult);
      result += targets[i].getDebuff(this, "freeze", 2, {}, false, "", 0.36);
    }
    
    targets = getRandomTargets(this, this._allies, 4);
    for (var i in targets) {
      result += targets[i].getBuff(this, "Damage Against Frozen", 2, {damageAgainstFrozen: 1.2})
    }
    
    this._energy = 0;
    
    return result;
  }
}


class mJormangund extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = getRandomTargets(this, this._enemies, 4);
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], 593312, "monster", "true");
      result += targets[i].takeDamage(this, "Toxic Track", damageResult);
      
      damageResult = this.calcDamage(targets[i], 548328, "monster", "poisonTrue");
      result += targets[i].getDebuff(this, "Poison", 3, {poisonTrue: damageResult["damageAmount"]}, false, "monster");
    }
    
    
    targets = getRandomTargets(this, this._allies, 4);
    for (var i in targets) {
      result += targets[i].getBuff(this, "Damage Against Poisoned", 3, {damageAgainstPoisoned: 0.8});
    }
    
    this._energy = 0;
    
    return result;
  }
}


class mNiederhog extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = getRandomTargets(this, this._enemies, 4);
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], 809114, "monster", "true");
      result += targets[i].takeDamage(this, "Dragon Sigh", damageResult);
      result += targets[i].getDebuff(this, "stun", 2, {}, false, "", 0.36);
    }
    
    targets = getRandomTargets(this, this._allies, 4);
    for (var i in targets) {
      result += targets[i].getBuff(this, "Holy Damage", 2, {holyDamage: 0.75})
    }
    
    this._energy = 0;
    
    return result;
  }
}


class mPhoenix extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = getRandomTargets(this, this._enemies, 4);
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], 451830, "monster", "true");
      result += targets[i].takeDamage(this, "Blazing Spirit", damageResult);
      
      damageResult = this.calcDamage(targets[i], 363465, "monster", "burnTrue");
      result += targets[i].getDebuff(this, "Burn", 3, {burnTrue: damageResult["damageAmount"]}, false, "monster");
    }
    
    
    var healAmount = 0;
    targets = getRandomTargets(this, this._allies, 4);
    for (var i in targets) {
      healAmount = this.calcHeal(targets[i], 500535);
      result += targets[i].getBuff(this, "Heal", 3, {heal: healAmount});
      result += targets[i].getBuff(this, "Damage Against Burning", 15, {damageAgainstBurning: 0.8});
    }
    
    this._energy = 0;
    
    return result;
  }
}


class mSphinx extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = getRandomTargets(this, this._enemies, 4);
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], 636141, "monster", "true");
      result += targets[i].takeDamage(this, "Subduction Hit", damageResult);
      result += targets[i].getDebuff(this, "Armor Percent", 3, {armorPercent: 0.37});
      result += targets[i].getDebuff(this, "Speed", 3, {speed: 37});
    }
    
    
    targets = getRandomTargets(this, this._allies, 4);
    for (var i in targets) {
      result += targets[i].getBuff(this, "Attack Percent", 2, {attackPercent: 0.25});
    }
    
    this._energy = 0;
    
    return result;
  }
}


class mStoneGolem extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = getRandomTargets(this, this._enemies, 4);
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], 809114, "monster", "true");
      result += targets[i].takeDamage(this, "Death Stares", damageResult);
      result += targets[i].getDebuff(this, "petrify", 2, {}, false, "", 0.36);
    }
    
    targets = getRandomTargets(this, this._allies, 4);
    for (var i in targets) {
      result += targets[i].getBuff(this, "Crit Damage", 2, {critDamage: 0.75})
    }
    
    this._energy = 0;
    
    return result;
  }
}

/* End of monsters.js */


/* Start of heroes.js */

// base hero class, extend this class for each hero
class hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    this._heroName = sHeroName;
    this._heroPos = iHeroPos;
    this._attOrDef = attOrDef;
    this._heroFaction = baseHeroStats[sHeroName]["heroFaction"];
    this._heroClass = baseHeroStats[sHeroName]["heroClass"];
    this._starLevel = 0;
    this._heroLevel = 0;
    
    this._stats = {};
    this._currentStats = {};
    this._attackMultipliers = {};
    this._hpMultipliers = {};
    this._armorMultipliers = {};
    
    this._stats["revive"] = 0;
    
    // set equipment
    this._stone = "None";
    this._artifact = "None";
    this._weapon = "None";
    this._armor = "None";
    this._shoe = "None";
    this._accessory = "None";
    this._skin = "None";
    
    // set enables 
    this._enable1 = "None";
    this._enable2 = "None";
    this._enable3 = "None";
    this._enable4 = "None";
    this._enable5 = "None";
    
    // dictionary to track buffs and debuffs during combat
    this._buffs = {};
    this._debuffs = {};
    
    if (attOrDef == "att") {
      this._allies = attHeroes;
      this._enemies = defHeroes;
    } else {
      this._allies = defHeroes;
      this._enemies = attHeroes;
    }
    
    this._damageDealt = 0;
    this._damageHealed = 0;
    this._rng = random();
  }
  
  
  // Update current stats based on user selections.
  updateCurrentStats() {
    var arrLimits = [this._heroClass, this._heroFaction];
    var keySet = "";
    
    if (this._heroLevel > 310) {
      this._starLevel = 15;
    } else if (this._heroLevel > 290) {
      this._starLevel = 14;
    } else if (this._heroLevel > 270) {
      this._starLevel = 13;
    } else if (this._heroLevel > 260) {
      this._starLevel = 12;
    } else if (this._heroLevel > 250) {
      this._starLevel = 11;
    } else {
      this._starLevel = 10;
    }
    
    // start with base stats
    var baseStats = baseHeroStats[this._heroName]["stats"];
    this._stats["hp"] = Math.floor((baseStats["baseHP"] + (this._heroLevel - 1) * baseStats["growHP"]) * 2.2);
    this._stats["attack"] = Math.floor((baseStats["baseAttack"] + (this._heroLevel - 1) * baseStats["growAttack"]) * 2.2);
    this._stats["armor"] = Math.floor(baseStats["baseArmor"] + (this._heroLevel - 1) * baseStats["growArmor"]);
    this._stats["speed"] = Math.floor((baseStats["baseSpeed"] + (this._heroLevel - 1) * baseStats["growSpeed"]) * 1.6);
    
    this._stats["fixedAttack"] = 0;
    this._stats["fixedHP"] = 0;
    this._stats["totalHP"] = this._stats["hp"];
    this._stats["totalAttack"] = this._stats["attack"];
    this._stats["totalArmor"] = this._stats["armor"];
    this._stats["energy"] = 50;
    this._stats["skillDamage"] = 0.0;
    this._stats["precision"] = 0.0;
    this._stats["block"] = 0.0;
    this._stats["crit"] = 0.0;
    this._stats["critDamage"] = 0.0;
    this._stats["armorBreak"] = 0.0;
    this._stats["controlImmune"] = 0.0;
    this._stats["damageReduce"] = 0.0;
    this._stats["holyDamage"] = 0.0;
    this._stats["warriorReduce"] = 0.0;
    this._stats["mageReduce"] = 0.0;
    this._stats["rangerReduce"] = 0.0;
    this._stats["assassinReduce"] = 0.0;
    this._stats["priestReduce"] = 0.0;
    this._stats["freezeImmune"] = 0.0;
    this._stats["petrifyImmune"] = 0.0;
    this._stats["stunImmune"] = 0.0;
    this._stats["twineImmune"] = 0.0;
    this._stats["critDamageReduce"] = 0.0;
    this._stats["unbendingWillTriggered"] = 0;
    this._stats["unbendingWillStacks"] = 0;
    this._stats["effectBeingHealed"] = 0.0;
    this._stats["healEffect"] = 0.0;
    this._stats["dotReduce"] = 0.0;
    this._stats["controlPrecision"] = 0.0;
    this._stats["damageAgainstBurning"] = 0.0;
    this._stats["damageAgainstBleeding"] = 0.0;
    this._stats["damageAgainstPoisoned"] = 0.0;
    this._stats["damageAgainstFrozen"] = 0.0;
    this._stats["damageAgainstWarrior"] = 0.0;
    this._stats["damageAgainstMage"] = 0.0;
    this._stats["damageAgainstRanger"] = 0.0;
    this._stats["damageAgainstAssassin"] = 0.0;
    this._stats["damageAgainstPriest"] = 0.0;
    this._stats["allDamageReduce"] = 0.0;
    this._stats["allDamageTaken"] = 0.0;
    this._stats["allDamageDealt"] = 0.0;
    this._stats["controlImmunePen"] = 0.0;
    this._stats["firstCC"] = "";
    this._stats["dodge"] = 0.0;
    this._stats["Seal of LightImmune"] = 0.0;
    this._stats["ShapeshiftImmune"] = 0.0;
    this._stats["TauntImmune"] = 0.0;
    this._stats["DazzleImmune"] = 0.0;
    this._stats["HorrifyImmune"] = 0.0;
    this._stats["SilenceImmune"] = 0.0;
    
    this._attackMultipliers = {};
    this._hpMultipliers = {};
    this._armorMultipliers = {};
    
    
    // apply enable bonus
    if (this._starLevel > 10) {
      this.applyStatChange({hpPercent: (this._starLevel - 10) * 0.14, attackPercent: (this._starLevel - 10) * 0.1}, "enableBonuses")
    }
    
    
    // apply enables
    if (this._starLevel >= 11) {
      switch(this._enable1) {
        case "Vitality":
          this.applyStatChange({hpPercent: 0.12}, "enable1");
          break;
          
        case "Mightiness":
          this.applyStatChange({attackPercent: 0.08}, "enable1");
          break;
          
        case "Growth":
          this.applyStatChange({hpPercent: 0.05, attackPercent: 0.03, speed: 20}, "enable1");
          break;
      }
    }
    
    if (this._starLevel >= 12) {
      switch(this._enable2) {
        case "Shelter":
          this.applyStatChange({critDamageReduce: 0.15}, "enable2");
          break;
          
        case "Vitality2":
          this.applyStatChange({effectBeingHealed: 0.15}, "enable2");
          break;
      }
    }
    
    if (this._starLevel >= 14) {
      switch(this._enable4) {
        case "Vitality":
          this.applyStatChange({hpPercent: 0.12}, "enable4");
          break;
          
        case "Mightiness":
          this.applyStatChange({attackPercent: 0.08}, "enable4");
          break;
          
        case "Growth":
          this.applyStatChange({hpPercent: 0.05, attackPercent: 0.03, speed: 20}, "enable4");
          break;
      }
    }
    
    
    // apply equipment and set bonus
    var sets = {};
    
    this.applyStatChange(weapons[this._weapon]["stats"], "weapon");
    keySet = weapons[this._weapon]["set"];
    if (keySet != "") {
      if (keySet in sets) {
        sets[keySet] += 1;
      } else {
        sets[keySet] = 1;
      }
    }
    if (arrLimits.includes(weapons[this._weapon]["limit"])) {
      this.applyStatChange(weapons[this._weapon]["limitStats"], "weaponLimit");
    }
    
    this.applyStatChange(armors[this._armor]["stats"], "armor");
    keySet = armors[this._armor]["set"];
    if (keySet != "") {
      if (keySet in sets) {
        sets[keySet] += 1;
      } else {
        sets[keySet] = 1;
      }
    }
    if (arrLimits.includes(armors[this._armor]["limit"])) {
      this.applyStatChange(armors[this._armor]["limitStats"], "armorLimit");
    }
    
    this.applyStatChange(shoes[this._shoe]["stats"], "shoe");
    keySet = shoes[this._shoe]["set"];
    if (keySet != "") {
      if (keySet in sets) {
        sets[keySet] += 1;
      } else {
        sets[keySet] = 1;
      }
    }
    if (arrLimits.includes(shoes[this._shoe]["limit"])) {
      this.applyStatChange(shoes[this._shoe]["limitStats"], "shoeLimit");
    }
    
    this.applyStatChange(accessories[this._accessory]["stats"], "accessory");
    keySet = accessories[this._accessory]["set"];
    if (keySet != "") {
      if (keySet in sets) {
        sets[keySet] += 1;
      } else {
        sets[keySet] = 1;
      }
    }
    if (arrLimits.includes(accessories[this._accessory]["limit"])) {
      this.applyStatChange(accessories[this._accessory]["limitStats"], "accessoryLimit");
    }
    
    
    // Set bonus multipliers seem to be applied in a specific order?
    for (var x in setBonus) {
      if (x in sets) {
        if (sets[x] >= 2) {
          this.applyStatChange(setBonus[x][2], "Two piece " + x);
        }
        if (sets[x] >= 3) {
          this.applyStatChange(setBonus[x][3], "Three piece " + x);
        }
        if (sets[x] >= 4) {
          this.applyStatChange(setBonus[x][4], "Four piece " + x);
        }
      }
    } 
    
    
    // skin
    if (this._skin != "None") {
      this.applyStatChange(skins[this._heroName][this._skin], "skin");
    } 
    
    
    // get and apply guild tech
    var tech = guildTech[this._heroClass];
    var techLevels = [60, 50, 40, 30, 20, 20, 20, 20, 30, 30, 30, 30, 20, 20, 20, 20];
    var techLevel = 0;
    var tl = 0;
    
    for (var techName in tech){
      techLevel = techLevels[tl]; //document.getElementById(this._attOrDef + "Tech" + this._heroClass + techName).value;
      tl++;
      
      for (var statToBuff in tech[techName]){
        var techStatsToBuff = {};
        var buffAmount = tech[techName][statToBuff]*techLevel;
        techStatsToBuff[statToBuff] = buffAmount;
        this.applyStatChange(techStatsToBuff, techName);
      }
    }
    
    
    // apply passives that give stats, does nothing unless overridden in subclass
    this.passiveStats();
    
    
    // artifact
    this.applyStatChange(artifacts[this._artifact]["stats"], "artifact");
    if (arrLimits.includes(artifacts[this._artifact]["limit"])) {
      this.applyStatChange(artifacts[this._artifact]["limitStats"], "artifactLimit");
    }
    
    
    // stone
    this.applyStatChange(stones[this._stone], "stone");
    
    
    // avatar frame
    var sAvatarFrame;// = document.getElementById(this._attOrDef + "AvatarFrame").value;
    if (this._attOrDef == "att") {
      sAvatarFrame = attFrame;
    } else {
      sAvatarFrame = defFrame;
    }
    this.applyStatChange(avatarFrames[sAvatarFrame], "avatarFrame");
    
    
    // monster
    var monsterName; //= document.getElementById(this._attOrDef + "Monster").value;
    if (this._attOrDef == "att") {
      monsterName = attMonsterName;
    } else {
      monsterName = defMonsterName;
    }
    this.applyStatChange(baseMonsterStats[monsterName]["stats"], "monster");
    
    
    // celestial island statues
    var statuePrefix = this._attOrDef;
    if (["Light", "Forest", "Fortress"].includes(this._heroFaction)) {
      statuePrefix += "Holy";
    } else {
      statuePrefix += "Evil";
    }
    
    var statueStats = {};
    statueStats["speed"] = 2 * 30; // document.getElementById(statuePrefix + "speed").value;
    statueStats["hpPercent"] = 0.01 * 30; // document.getElementById(statuePrefix + "hpPercent").value;
    statueStats["attackPercent"] = 0.005 * 30; // document.getElementById(statuePrefix + "attackPercent").value;
    this.applyStatChange(statueStats, "statue");
    
    
    // aura
    var arrToUse;
    if (this._attOrDef == "att") {
      arrToUse = attHeroes;
    } else {
      arrToUse = defHeroes;
    }
    
    var arrIdentical = {
      0: {hpPercent: 0, attackPercent: 0},
      1: {hpPercent: 0.02, attackPercent: 0.015},
      2: {hpPercent: 0.05, attackPercent: 0.035},
      3: {hpPercent: 0.08, attackPercent: 0.055},
      4: {hpPercent: 0.11, attackPercent: 0.075},
      5: {hpPercent: 0.14, attackPercent: 0.095},
      6: {hpPercent: 0.18, attackPercent: 0.12}
    };
    
    var factionCount = {
      Shadow: 0,
      Fortress: 0,
      Abyss: 0,
      Forest: 0,
      Dark: 0,
      Light: 0
    };
    
    var heroCount = 0;

    for (var x = 0; x < arrToUse.length; x++) {
      if (arrToUse[x]._heroFaction != "") {
        factionCount[arrToUse[x]._heroFaction] += 1;
        heroCount++;
      }
    }
      
    var factionHPBonus = 0;
    var factionAttackBonus = 0;
    if (heroCount == 6) {
      for (var x in factionCount) {
        factionHPBonus += arrIdentical[factionCount[x]]["hpPercent"];
        factionAttackBonus += arrIdentical[factionCount[x]]["attackPercent"];
      }
      
      this.applyStatChange({hpPercent: factionHPBonus, attackPercent: factionAttackBonus}, "factionAura");
    
      var addBonuses = {
        damageReduce: 0.02 * (factionCount["Shadow"] + factionCount["Fortress"] + factionCount["Abyss"] + factionCount["Forest"]),
        controlImmune: 0.04 * (factionCount["Light"] + factionCount["Dark"])
      }
      this.applyStatChange(addBonuses, "auraAdditionalBonuses");
    }
    
    
    this._stats["totalHP"] = this.calcHP();
    this._stats["totalAttack"] = this.calcAttack();
    this._stats["totalArmor"] = this.calcArmor();
  }
  
  
  applyStatChange(arrStats, strSource) {
    for (var strStatName in arrStats) {
      if (strStatName == "attackPercent" || strStatName == "attackPercent2") {
        this._attackMultipliers[strSource + ":" + strStatName] = 1 + arrStats[strStatName];
      } else if (strStatName == "hpPercent" || strStatName == "hpPercent2") {
        this._hpMultipliers[strSource + ":" + strStatName] = 1 + arrStats[strStatName];
      } else if (strStatName == "armorPercent") {
        this._armorMultipliers[strSource + ":" + strStatName] = 1 + arrStats[strStatName];
      } else {
        this._stats[strStatName] += arrStats[strStatName];
      }
    }
  }
  
  
  calcAttack() {
    var att = this._stats["attack"];
    for (var x in this._attackMultipliers) {
      att = Math.floor(att * this._attackMultipliers[x]);
    }
    
    att += this._stats["fixedAttack"];
    
    return att;
  }
  
  
  calcHP() {
    var ehp = this._stats["hp"];
    for (var x in this._hpMultipliers) {
      ehp = Math.floor(ehp * this._hpMultipliers[x]);
    }
    
    ehp += this._stats["fixedHP"];
    
    return ehp;
  }
  
  
  calcArmor() {
    var armor = this._stats["armor"];
    for (var x in this._armorMultipliers) {
      armor = Math.floor(armor * this._armorMultipliers[x]);
    }
    
    return armor;
  }
  
  
  // Get hero stats for display.
  getHeroSheet() {
    console.log("Get stats summary for " + this._heroName);
    var heroSheet = "";
    
    var arrIntStats = [
      "hp", "attack", "speed", "armor", 
      "totalHP", "totalAttack", "totalArmor", 
      "unbendingWillTriggered", "unbendingWillStacks",
      "revive", "fixedAttack", "fixedHP", "energy", "isCharging"
    ];
    
    var arrStrStats = ["firstCC"];
    
    heroSheet += "Level " + this._heroLevel + " " + this._heroName + "<br/>";
    heroSheet += this._starLevel + "* " + this._heroFaction + " " + this._heroClass + "<br/>";
    
    for (var statName in this._stats) {
      if (arrIntStats.includes(statName)) {
        heroSheet += "<br/>" + translate[statName] + ": " + this._stats[statName].toString();
      } else if (arrStrStats.includes(statName)) {
        heroSheet += "<br/>" + translate[statName] + ": " + this._stats[statName];
      } else {
        heroSheet += "<br/>" + translate[statName] + ": " + (this._stats[statName] * 100).toFixed() + "%";
      }
    }
    
    return heroSheet;
  }
  
  heroDesc() {
    if (this._heroName == "None") {
      return "";
    } else {
      var pos1 = parseInt(this._heroPos) + 1;
      return "<span class='" + this._attOrDef + "'>" + this._heroName + "-" + pos1 + " (" + this._currentStats["totalHP"].toString() + " hp, " + this._currentStats["totalAttack"].toString() + " attack, " + this._currentStats["energy"].toString() + " energy)</span>";
    }
  }
  
  
  // Snapshot stats for combat
  snapshotStats() {
    this._currentStats = Object.assign({}, this._stats);
    this._currentStats["damageDealt"] = 0;
    this._currentStats["damageHealed"] = 0;
  }
  
  
  // utility functions for combat
  
  hasStatus(strStatus) {
    if (this._currentStats["totalHP"] <= 0) { return false; }
    
    var result = false;
    
    for (let [b, ob] of Object.entries(this._debuffs)) {
      if (b == strStatus) {
        return true; 
      } else {
        for (let s of Object.values(ob)) {
          for (let e of Object.keys(s["effects"])) {
            if (e == strStatus) { return true; }
          }
        }
      }
    }
    
    
    for (let [b, ob] of Object.entries(this._buffs)) {
      if (b == strStatus) {
        return true; 
      } else {
        for (let s of Object.values(ob)) {
          for (let e of Object.keys(s["effects"])) {
            if (e == strStatus) { return true; }
          }
        }
      }
    }
    
    return result;
  }
  
  
  isUnderStandardControl() {
    if (this._currentStats["totalHP"] <= 0) { return false; }
    
    if (this.hasStatus("petrify") || this.hasStatus("stun") || this.hasStatus("twine") || this.hasStatus("freeze") || this.hasStatus("Shapeshift")) { 
      return true;
    } else {
      return false;
    }
  }
  
  
  isNotSealed() {
    if (this._currentStats["totalHP"] <= 0) { return false; }
    
    if ("Seal of Light" in this._debuffs || "Shapeshift" in this._debuffs) {
      return false;
    } else {
      return true;
    }
  }
  
  
  // can further extend this to account for new mechanics by adding parameters to the end
  // supply a default value so as to not break other calls to this function
  calcDamage(target, attackDamage, damageSource, damageType, skillDamage=1, canCrit=1, dotRounds=0, canBlock=1, armorReduces=1) {
    
    // Get damage related stats
    var critChance = canCrit * this._currentStats["crit"];
    var critDamage = 2 * this._currentStats["critDamage"] + 1.5;
    var precision = this._currentStats["precision"];
    var precisionDamageIncrease = 1;
    var holyDamageIncrease = this._currentStats["holyDamage"] * .7;
    var damageAgainstBurning = 1;
    var damageAgainstBleeding = 1;
    var damageAgainstPoisoned = 1;
    var damageAgainstFrozen = 1;
    var damageAgainstClass = 1;
    var allDamageDealt = 1 + this._currentStats["allDamageDealt"]
    var armorBreak = this._currentStats["armorBreak"];
    var allDamageTaken = 1 + target._currentStats["allDamageTaken"];
    
    // mitigation stats
    var critDamageReduce = target._currentStats["critDamageReduce"];
    var classDamageReduce = target._currentStats[this._heroClass.toLowerCase() + "Reduce"];
    var damageReduce = target._currentStats["damageReduce"]
    var allDamageReduce = target._currentStats["allDamageReduce"];
    var dotReduce = 0;
    var armorMitigation = armorReduces * ((1 - armorBreak) * target._currentStats["totalArmor"] / (180 + 20*(target._heroLevel)));
    
    
    // faction advantage
    var factionA = this._heroFaction;
    var factionB = target._heroFaction;
    
    if (
      (factionA == "Abyss" && factionB == "Forest") ||
      (factionA == "Forest" && factionB == "Shadow") ||
      (factionA == "Shadow" && factionB == "Fortress") ||
      (factionA == "Fortress" && factionB == "Abyss") ||
      (factionA == "Dark" && factionB == "Light") ||
      (factionA == "Light" && factionB == "Dark")
    ) {
      damageReduce -= 0.3;
      precision += 0.15;
    }
    precisionDamageIncrease = 1 + precision * 0.3;
    
    
    // caps and min
    if (critDamage > 4.5) { critDamage = 4.5; }
    if (critChance < 0) { critChance = 0; }
    if (precision < 0) { precision = 0; }
    if (precisionDamageIncrease < 1) { precisionDamageIncrease = 1; }
    if (precisionDamageIncrease > 1.45) { precisionDamageIncrease = 1.45; }
    if (armorBreak > 1) { armorBreak = 1; }
    if (damageReduce > 0.75) { damageReduce = 0.75; }
    if (allDamageReduce < 0) { allDamageReduce = 0; }
    
    var blockChance = canBlock * (target._currentStats["block"] - precision);
    if (blockChance < 0) { blockChance = 0; }
    
    
    // status modifiers
    if (target.hasStatus("burn")) {
      damageAgainstBurning += this._currentStats["damageAgainstBurning"];
    }
    
    if (target.hasStatus("bleed")) {
      damageAgainstBleeding += this._currentStats["damageAgainstBleeding"];
    }
    
    if (target.hasStatus("poison")) {
      damageAgainstPoisoned += this._currentStats["damageAgainstPoisoned"];
    }
    
    if (target.hasStatus("freeze")) {
      damageAgainstFrozen += this._currentStats["damageAgainstFrozen"];
    }
    
    if (isDot(damageType)) {
      dotReduce = target._currentStats["dotReduce"];
    }
    
    damageAgainstClass += this._currentStats["damageAgainst" + target._heroClass];
    
    
    // damage source and damage type overrides
    if (damageSource == "active") {
      if (isDot(damageType)) {
        skillDamage += (this._currentStats["skillDamage"] + ((this._currentStats["energySnapshot"] - 100) / 100)) / (dotRounds + 1);
      } else if (!(["energy", "true"].includes(damageType))) {
        skillDamage += this._currentStats["skillDamage"] + ((this._currentStats["energySnapshot"] - 100) / 100);
      }
    } else if (isDot(damageType) && !(["burnTrue", "bleedTrue", "poisonTrue"].includes(damageType))) {
      skillDamage += this._currentStats["skillDamage"] / (dotRounds + 1);
    }
    
    if (["passive", "mark"].includes(damageSource) || isDot(damageType)) {
      critChance = 0;
      blockChance = 0;
    }
    
    if (["energy", "true", "burnTrue", "bleedTrue", "poisonTrue"].includes(damageType)) {
      precisionDamageIncrease = 1;
      damageAgainstBurning = 1;
      damageAgainstBleeding = 1;
      damageAgainstPoisoned = 1;
      damageAgainstFrozen = 1;
      allDamageDealt = 1;
      holyDamageIncrease = 0;
      armorMitigation = 0;
      damageReduce = 0;
      classDamageReduce = 0;
      allDamageTaken = 1;
      critChance = 0;
      blockChance = 0;
    }
    
    if (canCrit == 2) {
      critChance = 1;
    }
    
    
    // calculate damage
    attackDamage = attackDamage * skillDamage * precisionDamageIncrease * damageAgainstBurning * damageAgainstBleeding * damageAgainstPoisoned * damageAgainstFrozen * damageAgainstClass * allDamageDealt;
    attackDamage = attackDamage * (1-allDamageReduce) * (1-damageReduce) * (1 - armorMitigation + holyDamageIncrease) * (1-classDamageReduce) * allDamageTaken;
    
    var blocked = false;
    var critted = false;
    var blockRoll = random();
    var critRoll = random();
    
    if (critRoll < critChance && blockRoll < blockChance) {
      // blocked crit
      attackDamage = attackDamage * 0.56 * (1-critDamageReduce) * critDamage;
      blocked = true;
      critted = true;
    } else if (critRoll < critChance) {
      // crit
      attackDamage = attackDamage * (1-critDamageReduce) * critDamage;
      critted = true;
    } else if (blockRoll < blockChance) {
      // blocked normal
      attackDamage = attackDamage * 0.7;
      blocked = true;
    } else {
      // normal
    }
    
    
    if (roundNum > 15) {
      attackDamage = attackDamage * (1 + (roundNum - 15) * 0.15);
    }
    
    
    if (attackDamage == 0 && this._currentStats["totalAttack"] == 0) {
      attackDamage = 1;
    }
    
    
    return {
      "damageAmount": Math.floor(attackDamage),
      "critted": critted, 
      "blocked": blocked, 
      "damageSource": damageSource, 
      "damageType": damageType
    };
  }
  
  
  calcHeal(target, healAmount) {
    var healEffect = this._currentStats["healEffect"] + 1;
    return Math.floor(healAmount * healEffect);
  }
  
  
  getHeal(source, amountHealed) {
    if (this._currentStats["totalHP"] <= 0) { return ""; }
    
    var result = "";
    var effectBeingHealed = 1 + this._currentStats["effectBeingHealed"];
    if (effectBeingHealed < 0) { effectBeingHealed = 0; }
    
    amountHealed = Math.floor(amountHealed * effectBeingHealed);
    
    if (!(isMonster(source)) && "Healing Curse" in this._debuffs) {
      var debuffKey = Object.keys(this._debuffs["Healing Curse"])[0];
      var debuffStack = this._debuffs["Healing Curse"][debuffKey];
      var damageResult = {};
      
      result += "<div>Heal from " + source.heroDesc() + " blocked by <span class='skill'>Healing Curse</span>.</div>";
      result += this.removeDebuff("Healing Curse", debuffKey);
      
      triggerQueue.push([debuffStack["source"], "addHurt", this, amountHealed, "Healing Curse"]);
      
    } else {
      
      result = "<div>" + source.heroDesc() + " healed ";
      
      // prevent overheal 
      if (this._currentStats["totalHP"] + amountHealed > this._stats["totalHP"]) {
        this._currentStats["totalHP"] = this._stats["totalHP"];
      } else {
        this._currentStats["totalHP"] += amountHealed;
      }
      
      source._currentStats["damageHealed"] += amountHealed;
      
      if (this.heroDesc() == source.heroDesc()) {
        result += " themself for " + formatNum(amountHealed) + ".</div>";
      } else {
        result += this.heroDesc() + " for " + formatNum(amountHealed) + ".</div>";
      }
    }
    
    return result;
  }
  
  
  getEnergy(source, amount) {
    if (this._currentStats["totalHP"] <= 0) { return ""; }
    
    var result = "";
    
    if (this._currentStats["totalHP"] > 0) {
      if (this.heroDesc() == source.heroDesc()) {
        result = "<div>" + this.heroDesc() + " gained " + formatNum(amount) + " energy. Energy at ";
      } else {
        result = "<div>" + source.heroDesc() + " gave " + this.heroDesc() + " " + formatNum(amount) + " energy. Energy at "; 
      }
      
      this._currentStats["energy"] += amount;
      result += formatNum(this._currentStats["energy"]) + ".</div>"
      
      if ("Devouring Mark" in this._debuffs && this._currentStats["energy"] >= 100) {
        for (var s in this._debuffs["Devouring Mark"]) {
          triggerQueue.push([this._debuffs["Devouring Mark"][s]["source"], "devouringMark", this, this._debuffs["Devouring Mark"][s]["effects"]["attackAmount"], this._currentStats["energy"]]);
        }
        
        result += this.removeDebuff("Devouring Mark");
      }
    }
    
    return result;
  }
  
  
  loseEnergy(source, amount) {
    if (this._currentStats["totalHP"] <= 0) { return ""; }
    
    var result = ""
    
    result = "<div>" + source.heroDesc() + " drained from " + this.heroDesc() + " " + formatNum(amount) + " energy. Energy at "; 
    
    if (this._currentStats["energy"] < amount) {
      this._currentStats["energy"] = 0;
    } else {
      this._currentStats["energy"] -= amount;
    }
    
    result += formatNum(this._currentStats["energy"]) + ".</div>";
    
    return result;
  }
  
  
  calcCombatAttack() {
    var att = this._currentStats["attack"];
    
    for (var x in this._attackMultipliers) {
      att = Math.floor(att * this._attackMultipliers[x]);
    }
    
    // apply buffs
    for (let b of Object.values(this._buffs)) {
      for (let s of Object.values(b)) {
        for (let [e, oe] of Object.entries(s["effects"])) {
          if (e == "attackPercent") {
            att = Math.floor(att * (1 + oe));
          }
        }
      }
    }
    
    // apply debuffs
    for (let b of Object.values(this._debuffs)) {
      for (let s of Object.values(b)) {
        for (let [e, oe] of Object.entries(s["effects"])) {
          if (e == "attackPercent") {
            att = Math.floor(att * (1 - oe));
          }
        }
      }
    }
    
    att += this._currentStats["fixedAttack"];
    return att;
  }
  
  
  calcCombatArmor() {
    var armr = this._currentStats["armor"];
    
    for (var x in this._armorMultipliers) {
      armr = Math.floor(armr * this._armorMultipliers[x]);
    }
    
    // apply buffs
    for (let b of Object.values(this._debuffs)) {
      for (let s of Object.values(b)) {
        for (let [e, oe] of Object.entries(s["effects"])) {
          if (e == "armorPercent") {
            armr = Math.floor(armr * (1 + oe));
          }
        }
      }
    }
    
    // apply debuffs
    for (let b of Object.values(this._debuffs)) {
      for (let s of Object.values(b)) {
        for (let [e, oe] of Object.entries(s["effects"])) {
          if (e == "armorPercent") {
            armr = Math.floor(armr * (1 - oe));
          }
        }
      }
    }
    
    return armr;
  }
  
  
  getBuff(source, buffName, duration, effects={}, unstackable=false) {
    if (this._currentStats["totalHP"] <= 0) { return ""; }
    
    var result = "";
    var healResult = "";
    
    if (duration > 15) {
      result += "<div>" + this.heroDesc() + " gained buff <span class='skill'>" + buffName + "</span>.";
    } else if (duration ==1) {
      result += "<div>" + this.heroDesc() + " gained buff <span class='skill'>" + buffName + "</span> for " + formatNum(1) + " round.";
    } else {
      result += "<div>" + this.heroDesc() + " gained buff <span class='skill'>" + buffName + "</span> for " + formatNum(duration) + " rounds.";
    }
      
      
    if (unstackable && buffName in this._buffs) {
      let stackObj = Object.values(this._buffs[buffName])[0];
      stackObj["duration"] = duration;
      
    } else {
      var keyAt = uuid();
      if (buffName in this._buffs) {
        this._buffs[buffName][keyAt] = {"source": source, "duration": duration, "effects": effects};
      } else {
        this._buffs[buffName] = {};
        this._buffs[buffName][keyAt] = {"source": source, "duration": duration, "effects": effects};
      }
      
      
      for (var strStatName in effects) {
        result += " " + translate[strStatName] + ": " + formatNum(effects[strStatName]) + ".";
        
        if (strStatName == "attackPercent") {
          this._currentStats["totalAttack"] = this.calcCombatAttack();
          
        } else if (strStatName == "armorPercent") {
          this._currentStats["totalArmor"] = this.calcCombatArmor();
          
        } else if (strStatName == "heal") {
          healResult = this.getHeal(source, effects[strStatName]);
          
        } else if (strStatName == "attackAmount") {
          // ignore, used for snapshotting attack
          
        } else {
          this._currentStats[strStatName] += effects[strStatName];
          
          if (strStatName == "attack" || strStatName == "fixedAttack") {
            this._currentStats["totalAttack"] = this.calcCombatAttack();
          } else if (strStatName == "armor") {
            this._currentStats["totalArmor"] = this.calcCombatArmor();
          }
        }
      }
    }
    
    return result + "</div>" + healResult;
  }
  
  
  getDebuff(source, debuffName, duration, effects={}, bypassControlImmune=false, damageSource="passive", ccChance=1, unstackable=false) {
    if (this._currentStats["totalHP"] <= 0) { return ""; }
    
    var damageResult = {};
    var strDamageResult = "";
    var result = "";
    var controlImmune;
    var controlImmunePen;
    var isControl = isControlEffect(debuffName, effects);
    var rollCCHit;
    var rollCCPen;
    
    
    if (isControl) {
      controlImmune = this._currentStats["controlImmune"];
      controlImmunePen = source._currentStats["controlImmunePen"];
      controlImmune -= controlImmunePen;
      if (controlImmune < 0) { controlImmune = 0; }
      
      if ((debuffName + "Immune") in this._currentStats) {
        controlImmune = 1 - (1-controlImmune) * (1 - this._currentStats[debuffName + "Immune"]);
      }
      
      ccChance = ccChance * (1 + source._currentStats["controlPrecision"]);
      rollCCHit = random();
      rollCCPen = random();
    }
    
    if (isControl && rollCCHit >= ccChance) {
      // failed CC roll
    } else if (isControl && rollCCPen < controlImmune && !(bypassControlImmune)) {
      result += "<div>" + this.heroDesc() + " resisted debuff <span class='skill'>" + debuffName + "</span>.</div>";
    } else if (
      isControl && 
      (rollCCPen >= controlImmune || bypassControlImmune) &&
      this._artifact.includes(" Lucky Candy Bar") &&
      (this._currentStats["firstCC"] == "" || this._currentStats["firstCC"] == debuffName)
    ) {
      this._currentStats["firstCC"] = debuffName;
      result += "<div>" + this.heroDesc() + " resisted debuff <span class='skill'>" + debuffName + "</span> using <span class='skill'>" + this._artifact + "</span>.</div>";
    } else {
      if (duration == 1) {
        result += "<div>" + this.heroDesc() + " gained debuff <span class='skill'>" + debuffName + "</span> for " + formatNum(1) + " round.";
      } else {
        result += "<div>" + this.heroDesc() + " gained debuff <span class='skill'>" + debuffName + "</span> for " + formatNum(duration) + " rounds.";
      }
      
      
      if (unstackable && debuffName in this._debuffs) {
        let stackObj = Object.values(this._debuffs[debuffName])[0];
        stackObj["duration"] = duration;
        
        if (debuffName == "Shapeshift") {
          stackObj["effects"]["stacks"] = effects["stacks"];
        }
        
      } else {
        var keyAt = uuid();
        if (debuffName in this._debuffs) {
          this._debuffs[debuffName][keyAt] = {"source": source, "duration": duration, "effects": effects};
        } else {
          this._debuffs[debuffName] = {};
          this._debuffs[debuffName][keyAt] = {"source": source, "duration": duration, "effects": effects};
        }
        
        
        // process effects
        for (var strStatName in effects) {
          result += " " + translate[strStatName] + ": " + formatNum(effects[strStatName]) + ".";
          
          if (strStatName == "attackPercent") {
            this._currentStats["totalAttack"] = this.calcCombatAttack();
            
          } else if (strStatName == "armorPercent") {
            this._currentStats["totalArmor"] = this.calcCombatArmor();
            
          } else if (isDot(strStatName)) {
            if (this._currentStats["totalHP"] > 0) {
              damageResult = {
                damageAmount: effects[strStatName],
                damageSource: damageSource,
                damageType: strStatName,
                critted: false,
                blocked: false
              };
              result += "<div>" + this.takeDamage(source, "Debuff " + debuffName, damageResult) + "</div>";
            }
            
          } else if (["rounds", "stacks", "attackAmount", "damageAmount", "valkryieBasic"].includes(strStatName)) {
            //ignore, used to track other stuff
            
          } else {
            this._currentStats[strStatName] -= effects[strStatName];
            
            if (strStatName == "attack" || strStatName == "fixedAttack") {
              this._currentStats["totalAttack"] = this.calcCombatAttack();
            } else if (strStatName == "armor") {
              this._currentStats["totalArmor"] = this.calcCombatArmor();
            } else if (["dodge", "crit", "block"].includes(strStatName)) {
              if (this._currentStats[strStatName] < 0) {
                this._currentStats[strStatName] = 0;
              }
            }
          }
        }
        
        if (isControl) {
          triggerQueue.push([this, "eventGotCC", source, debuffName, keyAt]);
        }
        
        result += "</div>";
        
        
        // handle special debuffs
        if (debuffName == "Devouring Mark" && this._currentStats["energy"] >= 100) {
          triggerQueue.push([source, "devouringMark", this, effects["attackAmount"], this._currentStats["energy"]]);
          result += this.removeDebuff("Devouring Mark");
          
        } else if (debuffName == "Power of Light" && Object.keys(this._debuffs[debuffName]).length >= 2) {
          result += this.removeDebuff("Power of Light");
          result += this.getDebuff(source, "Seal of Light", 2);
          
        } else if (debuffName == "twine") {
          for (var h in source._allies) {
            if (source._allies[h]._heroName == "Oberon") {
              triggerQueue.push([source._allies[h], "eventTwine"]);
            }
          }
        } else if (debuffName == "Horrify") {
          for (var h in this._enemies) {
            triggerQueue.push([this._enemies[h], "enemyHorrified"])
          }
        }
      }
    }
    
    return result + strDamageResult;
  }


  removeBuff(strBuffName, stack="") {   
    var result = "";
    
    if (strBuffName in this._buffs) {
      result += "<div>" + this.heroDesc() + " lost buff <span class='skill'>" + strBuffName + "</span>."

      // for each stack
      for (var s in this._buffs[strBuffName]) {
        // remove the effects
        if (stack == "" || stack == s) {
          for (var strStatName in this._buffs[strBuffName][s]["effects"]) {
            result += " " + translate[strStatName] + ": " + formatNum(this._buffs[strBuffName][s]["effects"][strStatName]) + ".";

            if (strStatName == "attackPercent") {
              this._currentStats["totalAttack"] = this.calcCombatAttack();
              
            } else if (strStatName == "armorPercent") {
              this._currentStats["totalArmor"] = this.calcCombatArmor();
              
            } else if(["heal", "attackAmount"].includes(strStatName)) {
              // do nothing
              
            } else {
              this._currentStats[strStatName] -= this._buffs[strBuffName][s]["effects"][strStatName];
              
              if (strStatName == "attack" || strStatName == "fixedAttack") {
                this._currentStats["totalAttack"] = this.calcCombatAttack();
              } else if (strStatName == "armor") {
                this._currentStats["totalArmor"] = this.calcCombatArmor();
              }
            }
          }
          
          delete this._buffs[strBuffName][s];
        }
      }
      
      if (Object.keys(this._buffs[strBuffName]).length == 0) {
        delete this._buffs[strBuffName];
      }
      
      result += "</div>";
    }

    return result;
  }


  removeDebuff(strDebuffName, stack = "") {   
    var result = "";
    
    if (strDebuffName in this._debuffs) {
      result += "<div>" + this.heroDesc() + " lost debuff <span class='skill'>" + strDebuffName + "</span>."

      // for each stack
      for (var s in this._debuffs[strDebuffName]) {
        // remove the effects
        if (stack == "" || stack == s) {
          for (var strStatName in this._debuffs[strDebuffName][s]["effects"]) {
            result += " " + translate[strStatName] + ": " + formatNum(this._debuffs[strDebuffName][s]["effects"][strStatName]) + ".";

            if (strStatName == "attackPercent") {
              this._currentStats["totalAttack"] = this.calcCombatAttack();
              
            } else if (strStatName == "armorPercent") {
              this._currentStats["totalArmor"] = this.calcCombatArmor();
              
            } else if (["rounds", "stacks", "attackAmount", "damageAmount", "valkryieBasic"].includes(strStatName)) {
                  // do nothing, used to track other stuff
                  
            } else if (isDot(strStatName)) {
              // do nothing
              
            } else {
              this._currentStats[strStatName] += this._debuffs[strDebuffName][s]["effects"][strStatName];
              
              if (strStatName == "attack" || strStatName == "fixedAttack") {
                this._currentStats["totalAttack"] = this.calcCombatAttack();
              } else if (strStatName == "armor") {
                this._currentStats["totalArmor"] = this.calcCombatArmor();
              }
            }
          }
          
          delete this._debuffs[strDebuffName][s];
        }
      }

      if (Object.keys(this._debuffs[strDebuffName]).length == 0) {
        delete this._debuffs[strDebuffName];
      }
      
      result += "</div>";
    }

    return result;
  }
  
  
  tickBuffs() {
    var result = "";
    var stacksLeft = 0;
    
    if (this._currentStats["totalHP"] > 0) {
      // for each buff name
      for (var b in this._buffs) {
        stacksLeft = 0;
        
        // for each stack
        for (var s in this._buffs[b]) {
          if (this._currentStats["totalHP"] > 0) {
            this._buffs[b][s]["duration"] -= 1;
            
            if (this._buffs[b][s]["duration"] == 0) {
              result += "<div>" + this.heroDesc() + " buff (<span class='skill'>" + b + "</span>) ended.</div>";
              
              // remove the effects
              for (var strStatName in this._buffs[b][s]["effects"]) {
                if (strStatName == "attackPercent") {
                  this._currentStats["totalAttack"] = this.calcCombatAttack();
                  
                } else if (strStatName == "armorPercent") {
                  this._currentStats["totalArmor"] = this.calcCombatArmor();
                  
                } else if (["heal", "attackAmount"].includes(strStatName)) {
                  // do nothing
                } else {
                  this._currentStats[strStatName] -= this._buffs[b][s]["effects"][strStatName];
                  
                  if (strStatName == "attack" || strStatName == "fixedAttack") {
                    this._currentStats["totalAttack"] = this.calcCombatAttack();
                  } else if (strStatName == "armor") {
                    this._currentStats["totalArmor"] = this.calcCombatArmor();
                  }
                }
              }
              
              delete this._buffs[b][s];
            } else {
              stacksLeft++;
              
              for (var strStatName in this._buffs[b][s]["effects"]) {
                if (strStatName == "heal") {
                  result += "<div>" + this.heroDesc() + " layer of buff <span class='skill'>" + b + "</span> ticked.</div>";
                  result += "<div>" + this.getHeal(this._buffs[b][s]["source"], this._buffs[b][s]["effects"][strStatName]) + "</div>";
                }
              }
            }
          }
        }
        
        if (stacksLeft == 0 && this._currentStats["totalHP"] > 0) {
          delete this._buffs[b];
        }
      }
    }
    
    return result;
  }
  
  
  tickDebuffs() {
    var result = "";
    var damageResult = {};
    var stacksLeft = 0;
    
    if (this._currentStats["totalHP"] > 0) {
      // for each buff name
      for (var b in this._debuffs) {
        stacksLeft = 0;
        
        // for each stack
        for (var s in this._debuffs[b]) {
          if (this._currentStats["totalHP"] > 0) {
            this._debuffs[b][s]["duration"] -= 1;
            
            if (this._debuffs[b][s]["duration"] == 0) {
              result += "<div>" + this.heroDesc() + " debuff (<span class='skill'>" + b + "</span>) ended.</div>";
              
              if (b == "Sow Seeds") {
                result += this.getDebuff(this._debuffs[b][s]["source"], "twine", this._debuffs[b][s]["effects"]["rounds"]);
                
              } else if (b == "Black Hole Mark") {
                if (this._currentStats["totalHP"] > 0) {
                  let bhMark = this._debuffs[b][s];
                  let damageAmount = bhMark["effects"]["damageAmount"];
                  
                  if (damageAmount > bhMark["effects"]["attackAmount"]) {damageAmount = bhMark["effects"]["attackAmount"]; }
                  
                  damageResult = {
                    damageAmount: damageAmount,
                    damageSource: "mark",
                    damageType: "true",
                    critted: false,
                    blocked: false
                  };
                  
                  result += "<div>" + this.takeDamage(bhMark["source"], "Black Hole Mark", damageResult) + "</div>";
                }
                
              } else if (b == "Round Mark") {
                if (this._currentStats["totalHP"] > 0) {
                  let roundMark = this._debuffs[b][s];
                  let damageResult = roundMark["effects"]["attackAmount"];
                  
                  result += "<div>" + this.takeDamage(roundMark["source"], "Round Mark", damageResult) + "</div>";
                }
                
              } else {
                // remove the effects
                for (var strStatName in this._debuffs[b][s]["effects"]) {
                  if (strStatName == "attackPercent") {
                    this._currentStats["totalAttack"] = this.calcCombatAttack();
                    
                  } else if (strStatName == "armorPercent") {
                    this._currentStats["totalArmor"] = this.calcCombatArmor();
                    
                  } else if (["rounds", "stacks", "attackAmount", "damageAmount", "valkryieBasic"].includes(strStatName)) {
                    // do nothing, used to track stuff
                    
                  }  else if (isDot(strStatName)) {
                    // do nothing, full burn damage already done
                    
                    // unless it's the burn from valkryie's basic
                    if (this._currentStats["totalHP"] > 0 && "valkryieBasic" in this._debuffs[b][s]["effects"]) {
                      damageResult = {
                        damageAmount: this._debuffs[b][s]["effects"][strStatName],
                        damageSource: "passive",
                        damageType: strStatName,
                        critted: false,
                        blocked: false
                      };
                      
                      result += "<div>" + this.heroDesc() + " layer of debuff <span class='skill'>" + b + "</span> ticked.</div>";
                      result += "<div>" + this.takeDamage(this._debuffs[b][s]["source"], "Debuff " + b, damageResult) + "</div>";
                    }
                    
                  } else {
                    this._currentStats[strStatName] += this._debuffs[b][s]["effects"][strStatName];
                    
                    if (strStatName == "attack" || strStatName == "fixedAttack") {
                      this._currentStats["totalAttack"] = this.calcCombatAttack();
                    } else if (strStatName == "armor") {
                      this._currentStats["totalArmor"] = this.calcCombatArmor();
                    }
                  }
                }
              }
              
              delete this._debuffs[b][s];
            } else {
              stacksLeft++;
              
              for (var strStatName in this._debuffs[b][s]["effects"]) {
                if (isDot(strStatName)) {
                  if (this._currentStats["totalHP"] > 0) {
                    damageResult = {
                      damageAmount: this._debuffs[b][s]["effects"][strStatName],
                      damageSource: "passive",
                      damageType: strStatName,
                      critted: false,
                      blocked: false
                    };
                    
                    result += "<div>" + this.heroDesc() + " layer of debuff <span class='skill'>" + b + "</span> ticked.</div>";
                    result += "<div>" + this.takeDamage(this._debuffs[b][s]["source"], "Debuff " + b, damageResult) + "</div>";
                  }
                  
                  if (this._debuffs[b][s]["duration"] == 1) {
                    // last dot ticked
                    delete this._debuffs[b][s];
                    stacksLeft--;
                    break;
                  }
                }
              }
            }
          }
        }
        
        if (stacksLeft == 0 && this._currentStats["totalHP"] > 0) {
          delete this._debuffs[b];
        }
      }
    }
    
    return result;
  }
  
  
  tickEnable3() {
    var result = "";
    
    if (this._enable3 == "Resilience") {
      var healAmount = this.calcHeal(this, 0.15 * (this._stats["totalHP"] - this._currentStats["totalHP"]));
      
      if (healAmount > 0) {
        result += "<div>" + this.heroDesc() + " Resilience triggered.</div>" 
        result += this.getHeal(this, healAmount);
      }
      
    } else if (this._enable3 == "SharedFate") {
      var numLiving = 0;
      
      for (var h in this._allies) {
        if (this._allies[h]._currentStats["totalHP"] > 0) { numLiving++; }
      }
      
      for (var h in this._enemies) {
        if (this._enemies[h]._currentStats["totalHP"] > 0) { numLiving++; }
      }
      
      
      var attBuff = numLiving * 0.012;
      if (numLiving > 0) {
        result += "<div>" + this.heroDesc() + " gained Shared Fate. Increased attack by " + formatNum(attBuff * 100) + "%.</div>";
        this.getBuff(this, "Attack Percent", 1, {attackPercent: attBuff});
      }
      
    } else if (this._enable3 == "Purify") {
      var listDebuffs = []; 
      var rng;
      
      for (var d in this._debuffs) {
        if (isDispellable(d)) {
          listDebuffs.push(d);
        }
      }
      
      rng = Math.floor(random() * listDebuffs.length)
      
      if (listDebuffs.length > 0) {
        result += "<div>" + this.heroDesc() + " <span class='skill'>Purify</span> removed debuff.</div>";
        result += this.removeDebuff(listDebuffs[rng]);
      }
    }
    
    return result;
  }
  
  
  // a bunch of functions for override by hero subclasses as needed to trigger special abilities.
  // usually you'll want to check that the hero is still alive before triggering their effect
  
  passiveStats() { return {}; }
  eventSelfBasic(e) { return ""; }
  eventAllyBasic(e) { return ""; }
  eventEnemyBasic(e) { return ""; }
  eventAllyActive(e) { return ""; }
  eventEnemyActive(e) { return ""; }
  eventSelfDied(e) { return ""; }
  eventAllyDied(e) { return ""; }
  eventEnemyDied(e) { return ""; }
  eventGotCC(source, ccName, ccStackID) { return ""; }
  startOfBattle() { return ""; }
  endOfRound(roundNum) { return ""; }
  eventHPlte50() { return ""; }
  eventHPlte30() { return ""; }
  
  
  handleTrigger(trigger) { 
    var result = "";
    
    if (trigger[1] == "addHurt" && this._currentStats["totalHP"] > 0) {
      if (trigger[2]._currentStats["totalHP"] > 0) {
        let damageResult = this.calcDamage(trigger[2], trigger[3], "passive", "true");
        return trigger[2].takeDamage(this, trigger[4], damageResult);
      }
      
    } else if (trigger[1] == "getHP" && this._currentStats["totalHP"] > 0) {
      return this.getHP(trigger[2], Math.floor(trigger[3]));
      
    } else if (trigger[1] == "getHeal" && this._currentStats["totalHP"] > 0) {
      return this.getHeal(trigger[2], Math.floor(trigger[3]));
      
    } else if (["eventSelfBasic", "eventSelfActive"].includes(trigger[1]) && "Bloodthirsty" in this._buffs && this._currentStats["totalHP"] > 0) {
      return this.eventBloodthirsty(trigger[2]);
      
    }
    
    return ""; 
  }
  
  
  takeDamage(source, strAttackDesc, damageResult) {
    if (this._currentStats["totalHP"] <= 0) { return ""; }
    
    var result = "";
    var beforeHP = this._currentStats["totalHP"];
    
    damageResult["damageAmount"] = Math.floor(damageResult["damageAmount"]);
    
    
    strAttackDesc = "<span class='skill'>" + strAttackDesc + "</span>";
    result = "<div>" + source.heroDesc() + " used " + strAttackDesc + " against " + this.heroDesc() + ".</div>";
    
    
    if (this._artifact.includes(" Magic Stone Sword") && strAttackDesc != "Healing Curse" && !(isMonster(source))) {
      let maxDamage = Math.floor(this._stats.totalHP * artifacts[this._artifact].enhance);
      if (damageResult.damageAmount > maxDamage) {
        result += "<div><span class='skill'>" + this._artifact + "</span> prevented some damage.</div>";
        damageResult.damageAmount = maxDamage;
      }
    }
    
    
    if (this._artifact.includes(" Augustus Magic Ball") && strAttackDesc != "Healing Curse" && !(isMonster(source))) {
      let damMit = Math.floor(this._stats.totalAttack * artifacts[this._artifact].enhance);
      
      if (damageResult.damageAmount > 1) {
        result += "<div><span class='skill'>" + this._artifact + "</span> prevented some damage.</div>";
        
        if (damageResult.damageAmount <= damMit) {
          damageResult.damageAmount = 1;
        } else {
          damageResult.damageAmount -= damMit;
        }
      }
    }
    
    
    // amenra shields
    if ("Guardian Shadow" in this._buffs && !(["passive", "mark"].includes(damageResult["damageSource"])) && !(isMonster(source)) && damageResult["damageAmount"] > 0) {
      var keyDelete = Object.keys(this._buffs["Guardian Shadow"]);
      
      result += "<div>Damage prevented by <span class='skill'>Guardian Shadow</span>.</div>";
      this._buffs["Guardian Shadow"][keyDelete[0]]["source"]._currentStats["damageHealed"] += damageResult["damageAmount"];
      triggerQueue.push([this, "getHP", this._buffs["Guardian Shadow"][keyDelete[0]]["source"], damageResult["damageAmount"]]);
      
      damageResult["damageAmount"] = 0;
      damageResult["critted"] = false;
      damageResult["blocked"] = false;
      
      delete this._buffs["Guardian Shadow"][keyDelete[0]];
      
      if (keyDelete.length <= 1) {
        result += this.removeBuff("Guardian Shadow");
      }
    }
    
    if (this._currentStats["unbendingWillStacks"] > 0 && damageResult["damageSource"] != "mark") {
      this._currentStats["unbendingWillStacks"] -= 1;
      this._currentStats["damageHealed"] += damageResult["damageAmount"];
      result += "<div>" + formatNum(damageResult["damageAmount"]) + " damage prevented by <span class='skill'>Unbending Will</span>.</div>";
      
      if (this._currentStats["unbendingWillStacks"] == 0) {
        result += "<div><span class='skill'>Unbending Will</span> ended.</div>";
      }
      
    } else if (this._currentStats["totalHP"] <= damageResult["damageAmount"]) {
      // hero would die, check for unbending will
      if (this._enable5 == "UnbendingWill" && this._currentStats["unbendingWillTriggered"] == 0 && damageResult["damageSource"] != "mark") {
        this._currentStats["unbendingWillTriggered"] = 1;
        this._currentStats["unbendingWillStacks"] = 3;
        this._currentStats["damageHealed"] += damageResult["damageAmount"];
        result += "<div>" + formatNum(damageResult["damageAmount"]) + " damage prevented by <span class='skill'>Unbending Will</span>.</div>";
        
      } else {
        // hero died
        this._currentStats["totalHP"] = this._currentStats["totalHP"] - damageResult["damageAmount"];
        source._currentStats["damageDealt"] += damageResult["damageAmount"];
        
        if (damageResult["critted"] == true && damageResult["blocked"] == true) {
          result += "<div>Blocked crit " + strAttackDesc + " dealt " + formatNum(damageResult["damageAmount"]) + " damage.</div>";
        } else if (damageResult["critted"] == true && damageResult["blocked"] == false) {
          result += "<div>Crit " + strAttackDesc + " dealt " + formatNum(damageResult["damageAmount"]) + " damage.</div>";
        } else if (damageResult["critted"] == false && damageResult["blocked"] == true) {
          result += "<div>Blocked " + strAttackDesc + " dealt " + formatNum(damageResult["damageAmount"]) + " damage.</div>";
        } else {
          result += "<div>" + strAttackDesc + " dealt " + formatNum(damageResult["damageAmount"]) + " damage.</div>";
        }
        
        result += "<div>Enemy health dropped from " + formatNum(beforeHP) + " to " + formatNum(0) + ".</div><div>" + this.heroDesc() + " died.</div>";
        
        triggerQueue.push([this, "eventSelfDied", source, this]);

        for (var h in this._allies) {
          if (this._heroPos != this._allies[h]._heroPos) {
            triggerQueue.push([this._allies[h], "eventAllyDied", source, this]);
          }
        }
        
        for (var h in this._enemies) {
          triggerQueue.push([this._enemies[h], "eventEnemyDied", source, this]);
        }
      }
      
    } else {
      this._currentStats["totalHP"] = this._currentStats["totalHP"] - damageResult["damageAmount"];
      source._currentStats["damageDealt"] += damageResult["damageAmount"];
        
      if (damageResult["critted"] == true && damageResult["blocked"] == true) {
        result += "<div>Blocked crit " + strAttackDesc + " dealt " + formatNum(damageResult["damageAmount"]) + " damage.</div>";
      } else if (damageResult["critted"] == true && damageResult["blocked"] == false) {
        result += "<div>Crit " + strAttackDesc + " dealt " + formatNum(damageResult["damageAmount"]) + " damage.</div>";
      } else if (damageResult["critted"] == false && damageResult["blocked"] == true) {
        result += "<div>Blocked " + strAttackDesc + " dealt " + formatNum(damageResult["damageAmount"]) + " damage.</div>";
      } else {
        result += "<div>" + strAttackDesc + " dealt " + formatNum(damageResult["damageAmount"]) + " damage.</div>";
      }
      
      result += "<div>Enemy health dropped from " + formatNum(beforeHP) + " to " + formatNum(this._currentStats["totalHP"]) + ".</div>";
    }
    
    
    // E2 Lethal Fightback
    if (
      source._enable2 == "LethalFightback" && 
      source._currentStats["totalHP"] < this._currentStats["totalHP"] &&
      damageResult["damageType"] != "true" &&
      !(isDot(damageResult["damageType"])) &&
      ["active", "basic"].includes(damageResult["damageSource"])
    ) {
      triggerQueue.push([source, "addHurt", this, damageResult["damageAmount"] * 0.12, "Lethal Fightback"]);
    }

    
    // E5 balanced strike
    if (["active", "basic"].includes(damageResult["damageSource"]) && source._enable5 == "BalancedStrike") {
      if (damageResult["critted"] == true) {
        let healAmount = source.calcHeal(source, 0.15 * (damageResult["damageAmount"]));
        result += "<div><span class='skill'>Balanced Strike</span> triggered heal on crit.</div>";
        triggerQueue.push([source, "getHeal", source, healAmount]);
      } else if (!(isDot(damageResult["damageType"])) && damageResult["damageType"] != "true") {
        triggerQueue.push([source, "addHurt", this, damageResult["damageAmount"] * 0.30, "Balanced Strike"]);
      }
    }
    
    
    if (damageResult["critted"] && "Crit Mark" in this._debuffs) {
      for (var s in this._debuffs["Crit Mark"]) {
        triggerQueue.push([this._debuffs["Crit Mark"][s]["source"], "critMark", this, this._debuffs["Crit Mark"][s]["effects"]["attackAmount"]]);
      }
      
      result += this.removeDebuff("Crit Mark");
    }
    
    
    if (this._currentStats["totalHP"] > 0 && "Shapeshift" in this._debuffs && damageResult["damageAmount"] > 0 && ["active", "basic"].includes(damageResult["damageSource"])) {
      var shapeshiftKey = Object.keys(this._debuffs["Shapeshift"])[0];
      if (this._debuffs["Shapeshift"][shapeshiftKey]["effects"]["stacks"] > 1) {
        this._debuffs["Shapeshift"][shapeshiftKey]["effects"]["stacks"]--;
      } else {
        result += this.removeDebuff("Shapeshift", shapeshiftKey);
      }
    }
    
    
    if ("Black Hole Mark" in this._debuffs && ["active", "basic"].includes(damageResult["damageSource"])) {
      let key = Object.keys(this._debuffs["Black Hole Mark"])[0];
      this._debuffs["Black Hole Mark"][key]["effects"]["damageAmount"] += Math.floor(0.60 * damageResult["damageAmount"]);
    }
    
    
    var beforePercent = beforeHP / this._stats["totalHP"];
    var afterPercent = this._currentStats["totalHP"] / this._stats["totalHP"];
    
    if (this._currentStats["totalHP"] > 0 && beforePercent > 0.50 && afterPercent <= 0.50) {
      triggerQueue.push([this, "eventHPlte50"]);
    }
    
    if (this._currentStats["totalHP"] > 0 && beforePercent > 0.30 && afterPercent <= 0.30) {
      triggerQueue.push([this, "eventHPlte30"]);
      
      if ("Rescue Mark" in this._buffs) {
        for (let s in this._buffs["Rescue Mark"]) {
          triggerQueue.push([this, "getHeal", this._buffs["Rescue Mark"][s]["source"], this._buffs["Rescue Mark"][s]["effects"]["attackAmount"]]);
        }
        
        result += this.removeBuff("Rescue Mark");
      }
    }
    
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies, 1);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "basic", "normal");
        result += targets[i].takeDamage(this, "Basic Attack", damageResult);
        basicQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies, 2);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.5);
        result += targets[i].takeDamage(this, "Active Template", damageResult);
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  getTargetLock(source) {
    if (random() < this._currentStats["dodge"]) {
      return "<div>" + source.heroDesc() + " attack against " + this.heroDesc() + " was dodged.</div>";
    } else {
      return "";
    }
  }
  
  
  isUnderControl() {
    for (var d in this._debuffs) {
      if (isControlEffect(d)) {
        return true;
      }
    }
    
    return false;
  }
  
  
  getHP(source, amountHealed) {
    if (this._currentStats["totalHP"] <= 0) { return ""; }
    
    var result = "";
    result = "<div>" + source.heroDesc() + " healed ";
    
    // prevent overheal 
    if (this._currentStats["totalHP"] + amountHealed > this._stats["totalHP"]) {
      this._currentStats["totalHP"] = this._stats["totalHP"];
    } else {
      this._currentStats["totalHP"] += amountHealed;
    }
    
    source._currentStats["damageHealed"] += amountHealed;
    
    if (this.heroDesc() == source.heroDesc()) {
      result += " themself for " + formatNum(amountHealed) + ".</div>";
    } else {
      result += this.heroDesc() + " for " + formatNum(amountHealed) + ".</div>";
    }
    
    return result;
  }
  
  
  eventBloodthirsty(targets) {
    var result = "";
    var damageResult = {};
    var hpDamage = 0;
    var healAmount = 0;
    var maxDamage = 15 * this._currentStats["totalAttack"];
    
    for (let i in targets) {
      hpDamage = 0.20 * (targets[i][1]._stats["totalHP"] - targets[i][1]._currentStats["totalHP"]);
      maxDamage = 15 * this._currentStats["totalAttack"];
      if (hpDamage > maxDamage) { hpDamage = maxDamage; }
        
      damageResult = this.calcDamage(targets[i][1], hpDamage, "passive", "true");
      result += targets[i][1].takeDamage(this, "Bloodthirsty", damageResult);
        
      let healAmount = this.calcHeal(this, 0.30 * damageResult["damageAmount"]);
      result += this.getHeal(this, healAmount);
    }
    
    return result;
  }
}

/* End of heroes.js */


/* Start of heroSubclasses.js */

// Aida
class Aida extends hero {
  passiveStats() {
    // apply Blessing of Light passive
    this.applyStatChange({hpPercent: 0.4, holyDamage: 1.0, damageReduce: 0.3, speed: 80}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "balanceMark") {
      if (trigger[2]._currentStats["totalHP"] > 0) {
        return this.balanceMark(trigger[2], trigger[3]);
      }
    }
    
    return result;
  }
  
  
  balanceMark(target, attackAmount) {
    var result = "";
    var damageAmount = target._stats["totalHP"] * 0.25;
    
    if (damageAmount > attackAmount * 30) {
      damageAmount = attackAmount * 30;
    }
    
    var damageResult = this.calcDamage(target, damageAmount, "mark", "true");
    result += target.takeDamage(this, "Balance Mark", damageResult);
    
    return result;
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    var healAmount = 0;
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
      
    for (var i in targets) {
      damageResult = this.calcDamage(this, targets[i]._currentStats["totalAttack"] * 3, "passive", "normal");
      result += targets[i].takeDamage(this, "Final Verdict", damageResult);
      result += targets[i].getDebuff(this, "Effect Being Healed", 15, {effectBeingHealed: 0.1});
    }
    
    healAmount = this.calcHeal(this, this._stats["totalHP"] * 0.15);
    result += this.getHeal(this, healAmount);
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {damageAmount: 0};
    var targets = getHighestHPTargets(this, this._enemies, 1);
    var additionalDamage = 0;
    var healAmount = 0;
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 1.2, "basic", "normal");
        result = targets[i].takeDamage(this, "Basic Attack", damageResult);
        
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          additionalDamage = targets[i]._stats["totalHP"] * 0.2;
          if (additionalDamage > this._currentStats["totalAttack"] * 15) {
            additionalDamage = this._currentStats["totalAttack"] * 15;
          }
          
          additionalDamageResult = this.calcDamage(targets[i], additionalDamage, "basic", "true");
          result += targets[i].takeDamage(this, "Fury of Justice", additionalDamageResult);
        }
        
        basicQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    
    if (damageResult["damageAmount"] + additionalDamageResult["damageAmount"] > 0) {
      healAmount = this.calcHeal(this, (damageResult["damageAmount"] + additionalDamageResult["damageAmount"]) * 0.35);
      result += this.getHeal(this, healAmount);
    }
    
    return result;
    
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 4);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1, 1, 0, 1, 0);
        result += targets[i].takeDamage(this, "Order Restore", damageResult);
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    targets = getAllTargets(this, this._enemies);
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        result += targets[i].getDebuff(this, "Balance Mark", 3, {attackAmount: this._currentStats["totalAttack"]});
      }
    }
    
    return result;
    
  }
}



// Amen-Ra
class AmenRa extends hero {
  passiveStats() {
    // apply Aura of Despair passive
    this.applyStatChange({hpPercent: 0.2, attackPercent: 0.25, damageReduce: 0.25}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventAllyActive", "eventSelfActive"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventAllyActive();
    }
    
    return result;
  }
  
  
  eventAllyActive() {
    var result = "";
    var damageResult = {};
    var targets;
    
    for (var i=1; i<=3; i++) {
      targets = getRandomTargets(this, this._enemies, 1);
      
      if (targets.length > 0) {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 2, "passive", "normal");
        result += targets[0].takeDamage(this, "Terrible Feast", damageResult);
      }
    }
    
    return result;
  }
  
  
  getDebuff(source, debuffName, duration, effects={}, bypassControlImmune=false, damageSource="", ccChance=1, unstackable=false) {
    var result = "";
    
    if (isControlEffect(debuffName, effects)) {
      duration--;
      
      if (duration == 0) {
        result = "<div>" + this.heroDesc() + " negated <span class='skill'>" + debuffName + "</span> by reducing it's duration to " + formatNum(0) + " rouunds.</div>";
      } else {
        result = super.getDebuff(source, debuffName, duration, effects, bypassControlImmune, damageSource, ccChance, unstackable);
      }
    } else {
      result = super.getDebuff(source, debuffName, duration, effects, bypassControlImmune, damageSource, ccChance, unstackable);
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var targets;
    
    result = super.doBasic();
    
    for (var i=1; i<=2; i++) {
      targets = getRandomTargets(this, this._enemies, 1);
      
      if (targets.length > 0) {
        result += targets[0].getDebuff(this, "Healing Curse", 15);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getFrontTargets(this, this._enemies);
    var controlPrecision = 1 + this._currentStats["controlPrecision"];
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2);
        result += targets[i].takeDamage(this, "Shadow Defense", damageResult);
        result += targets[i].getDebuff(this, "petrify", 2, {}, false, "", 0.70);
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    targets = getAllTargets(this, this._allies);
    for (i in targets) {
      result += targets[i].getBuff(this, "Guardian Shadow", 15, {});
      result += targets[i].getBuff(this, "Guardian Shadow", 15, {});
    }
    
    return result;
  }
}


// Amuvor
class Amuvor extends hero {
  passiveStats() {
    // apply Journey of Soul passive
    this.applyStatChange({hpPercent: 0.3, speed: 60, attackPercent: .3, petrifyImmune: 1}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventAllyActive", "eventSelfActive"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventAllyActive();
    }
    
    return result;
  }
  
  
  eventAllyActive() {
    var result = "";
    
    result += "<div>" + this.heroDesc() + " <span class='skill'>Energy Oblivion</span> triggered.</div>";
    
    var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 2);
    result += this.getHeal(this, healAmount)
    result += this.getEnergy(this, 35);
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getLowestHPTargets(this, this._enemies, 1);
    var targetLock;
    
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 1.8, "basic", "normal");
        result += targets[0].takeDamage(this, "Basic Attack", damageResult);
        
        if (targets[0]._currentStats["totalHP"] > 0) {
          result += "<div><span class='skill'>Arcane Imprisonment</span> drained target's energy.</div>";
          result += targets[0].loseEnergy(this, 50)
        }
        
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var hpDamage = 0;
    var hpDamageResult = {damageAmount: 0};
    var priestDamageResult = {damageAmount: 0};
    var targets = getRandomTargets(this, this._enemies, 2);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 3.5);
        result = targets[i].takeDamage(this, "Scarlet Contract", damageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          hpDamage = targets[i]._stats["totalHP"] * 0.21;
          if (hpDamage > this._currentStats["totalAttack"] * 15) {
            hpDamage = this._currentStats["totalAttack"] * 15;
          }
          
          hpDamageResult = this.calcDamage(targets[i], hpDamage, "active", "true");
          result += targets[i].takeDamage(this, "Scarlet Contract HP", hpDamageResult);
        }
        
        if (targets[i]._currentStats["totalHP"] > 0 && targets[i]._heroClass == "Priest") {
          priestDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.7);
          result += targets[i].takeDamage(this, "Scarlet Contract Priest", priestDamageResult);
        }
        
        result += targets[i].getDebuff(this, "Effect Being Healed", 2, {effectBeingHealed: 0.3});
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + hpDamageResult["damageAmount"] + priestDamageResult["damageAmount"], damageResult["critted"] || priestDamageResult["critted"]]);
      }
    }
    
    result += this.getBuff(this, "Crit", 3, {crit: 0.4});
    
    return result;
    
  }
}



// Aspen
class Aspen extends hero {
  passiveStats() {
    // apply Dark Storm passive
    this.applyStatChange({hpPercent: 0.4, attackPercent: 0.2, crit: 0.35, armorBreak: 0.5}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventSelfBasic", "eventSelfActive"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventSelfBasic();
    } else if (trigger[1] == "enemyHorrified" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.enemyHorrified();
    }
    
    return result;
  }
  
  
  enemyHorrified() {
    var result = "";
    var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 1.5);
    result += this.getHeal(this, healAmount);
    result += this.getBuff(this, "Shield", 15, {controlImmune: 0.2, damageReduce: 0.06});
    return result;
  }
  
  
  eventSelfBasic() {
    var result = "";
    result += this.getBuff(this, "Attack Percent", 15, {attackPercent: 0.15});
    result += this.getBuff(this, "Crit Damage", 15, {critDamage: 0.15});
    result += this.getBuff(this, "Shield", 15, {controlImmune: 0.2, damageReduce: 0.06});
    return result;
  }
  
  
  getBuff(source, buffName, duration, effects={}, unstackable=false) {
    if ("Shield" in this._buffs && buffName == "Shield") {
      if (Object.keys(this._buffs["Shield"]).length < 5) {
        return super.getBuff(source, buffName, duration, effects, unstackable);
      } else {
        return "";
      }
    } else {
      return super.getBuff(source, buffName, duration, effects, unstackable);
    }
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var hpDamage = 0;
    var maxDamage = 0;
    var hpDamageResult = {damageAmount: 0};
    var additionalDamage = 0;
    var additionalDamageResult = {damageAmount: 0};
    var targets = getLowestHPTargets(this, this._enemies, 1);
    var targetLock;
    
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 2, "basic", "normal");
        result += targets[0].takeDamage(this, "Basic Attack", damageResult);
        
        if (targets[0]._currentStats["totalHP"] > 0) {
          hpDamage = 0.15 * (targets[0]._stats["totalHP"] - targets[0]._currentStats["totalHP"]);
          maxDamage = 15 * this._currentStats["totalAttack"];
          if (hpDamage > maxDamage) { hpDamage = maxDamage; }
          
          hpDamageResult = this.calcDamage(targets[0], hpDamage, "basic", "true");
          result += targets[0].takeDamage(this, "Rage of Shadow HP", hpDamageResult);
        }
          
        if (targets[0]._currentStats["totalHP"] > 0) {
          result += targets[0].getDebuff(this, "Horrify", 2);
          
          if (targets[0]._currentStats["totalHP"] > 0 && (targets[0]._currentStats["totalHP"] / targets[0]._stats["totalHP"]) < 0.35) {
            additionalDamage = 1.6 * (damageResult["damageAmount"] + hpDamageResult["damageAmount"]);
            additionalDamageResult = this.calcDamage(targets[0], additionalDamage, "basic", "true");
            result += targets[0].takeDamage(this, "Rage of Shadow Below 35%", additionalDamageResult);
            
            var healAmount = this.calcHeal(this, additionalDamageResult["damageAmount"]);
            result += this.getHeal(this, healAmount);
          }
        }
        
        basicQueue.push([this, targets[0], damageResult["damageAmount"] + hpDamageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var hpDamage = 0;
    var maxDamage = 0;
    var hpDamageResult = {damageAmount: 0};
    var additionalDamage = 0;
    var additionalDamageResult = {damageAmount: 0};
    var targets = getRandomTargets(this, this._enemies, 4);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.6);
        result += targets[i].takeDamage(this, "Dread's Coming", damageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          hpDamage = 0.2 * targets[i]._currentStats["totalHP"];
          maxDamage = 15 * this._currentStats["totalAttack"];
          if (hpDamage > maxDamage) { hpDamage = maxDamage; }
          
          hpDamageResult = this.calcDamage(targets[i], hpDamage, "active", "true");
          result += targets[i].takeDamage(this, "Dread's Coming HP", hpDamageResult);
        }
          
        if (targets[i]._currentStats["totalHP"] > 0) {
          result += targets[i].getDebuff(this, "Horrify", 2, {}, false, "", 0.50);
          
          if (targets[i]._currentStats["totalHP"] > 0 && (targets[i]._currentStats["totalHP"] / targets[i]._stats["totalHP"]) < 0.35) {
            additionalDamage = 2.2 * (damageResult["damageAmount"] + hpDamageResult["damageAmount"]);

            additionalDamageResult = this.calcDamage(targets[i], additionalDamage, "active", "true");
            result += targets[i].takeDamage(this, "Dread's Coming Below 35%", additionalDamageResult);
            
            var healAmount = this.calcHeal(this, additionalDamageResult["damageAmount"]);
            result += this.getHeal(this, healAmount);
          }
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + hpDamageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
}



// Belrain
class Belrain extends hero {
  passiveStats() {
    // apply Divine Awakening passive
    this.applyStatChange({hpPercent: 0.3, attackPercent: 0.45, controlImmune: 0.3, healEffect: 0.4}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventSelfBasic" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfBasic();
    } else if (trigger[1] == "eventSelfDied") {
      return this.eventSelfDied();
    }
    
    return result;
  }
  
  
  eventSelfBasic() {
    var result = "";
    var healAmount;
    var targets = getLowestHPTargets(this, this._allies, 3);
    
    for (var i in targets) {
      healAmount = this.calcHeal(targets[i], this._currentStats["totalAttack"] * 2.5);
      result += targets[i].getBuff(this, "Heal", 2, {heal: healAmount});
    }
    
    return result;
  }
  
  
  eventSelfDied() { 
    var result = "";
    
    var targets = getAllTargets(this, this._allies);
    var healAmount;
    
    for (var i in targets) {
      healAmount = this.calcHeal(targets[i], this._currentStats["totalAttack"] * 4);
      result += targets[i].getBuff(this, "Heal", 4, {heal: healAmount});
    }
    
    return result; 
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 4);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.82);
        result += targets[i].takeDamage(this, "Holylight Sparkle", damageResult);
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    targets = getRandomTargets(this, this._allies, 4);
    for (var i in targets) {
      result += targets[i].getBuff(this, "Attack Percent", 3, {attackPercent: 0.3});
      result += targets[i].getBuff(this, "Speed", 3, {speed: 30});
      result += targets[i].getBuff(this, "Effect Being Healed", 3, {effectBeingHealed: 0.2});
      
      if (random() < 0.4) {
        for (var d in this._debuffs) {
          if (isControlEffect(d)) {
            result += this.removeDebuff(d);
          }
        }
      }
    }
    
    return result;
  }
}



// Carrie
class Carrie extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
    this._stats["revive"] = 1;
    this._stats["spiritPowerStacks"] = 0;
  }
  
  
  passiveStats() {
    // apply Darkness Befall passive
    this.applyStatChange({attackPercent: 0.25, controlImmune: 0.3, speed: 60, dodge: 0.40}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if ((trigger[1] == "eventAllyDied" || trigger[1] == "eventEnemyDied") && this._currentStats["totalHP"] <= 0) {
      return this.eventAllyDied();
    } else if (trigger[1] == "devouringMark") {
      if (trigger[2]._currentStats["totalHP"] > 0) {
        return this.devouringMark(trigger[2], trigger[3], trigger[4]);
      }
    }
    
    return result;
  }
  
  
  devouringMark(target, attackAmount, energyAmount) {
    var result = "";
    var damageResult = {};
    
    // attack % per energy damage seems to be true damage
    damageResult = this.calcDamage(target, attackAmount * 0.1 * energyAmount, "mark", "energy");
    result = target.takeDamage(this, "Devouring Mark", damageResult);
    
    if (target._currentStats["totalHP"] > 0) {
      result += "<div>Energy set to " + formatNum(0) + ".</div>";
      target._currentStats["energy"] = 0;
    }
    
    return result;
  }
  
  
  eventAllyDied(e) { 
    this._currentStats["spiritPowerStacks"] += 1;
    return ""; 
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    
    if (this._currentStats["totalHP"] <= 0) {
      var damageResult = {};
      var targets = getLowestHPTargets(this, this._enemies, 1);
      var maxDamage = 15 * this._currentStats["totalAttack"];
      
      if (targets.length > 0) {
        var damageAmount = 0.5 * (targets[0]._stats["totalHP"] - targets[0]._currentStats["totalHP"]);
        
        if (damageAmount > maxDamage) {
          damageAmount = maxDamage;
        }
        
        damageResult = this.calcDamage(targets[0], damageAmount, "passive", "true");
        result += targets[0].takeDamage(this, "Shadowy Spirit", damageResult);
      }
      
      
      this._currentStats["spiritPowerStacks"] += 1;
      if (this._currentStats["spiritPowerStacks"] >= 4) {
        for (var b in this._buffs) {
          this.removeBuff(b);
        }
        
        for (var d in this._debuffs) {
          this.removeDebuff(d);
        }
        
        this._currentStats["spiritPowerStacks"] = 0;
        this._currentStats["totalHP"] = this._stats["totalHP"];
        this._currentStats["energy"] = 100;
        result += "<div>" + this.heroDesc() + " has revived with full health and energy.</div>";
      }
    }
    
    return result;
  }
  
  
  takeDamage(source, strAttackDesc, damageResult) {
    var result = "";
    result = super.takeDamage(source, strAttackDesc, damageResult);
    
    if (this._currentStats["totalHP"] <= 0 && damageResult["damageSource"] != "passive") {
      this._currentStats["spiritPowerStacks"] = 0;
      result += "<div>" + this.heroDesc() + " became a <span class='skill'>Shadowy Spirit</span>.</div>";
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {damageAmount: 0};
    var targets = getRandomTargets(this, this._enemies, 1);
    var targetLock;
    
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 1.56, "basic", "normal");
        result = targets[0].takeDamage(this, "Basic Attack", damageResult);
        
        // attack % per energy damage seems to be true damage
        if (targets[0]._currentStats["totalHP"] > 0) {
          var additionalDamageAmount = this._currentStats["totalAttack"] * 0.06 * (targets[0]._currentStats["energy"] + 50);
          additionalDamageResult = this.calcDamage(targets[0], additionalDamageAmount, "basic", "energy");
          result += targets[0].takeDamage(this, "Outburst of Magic", additionalDamageResult);
        }
          
        if (targets[0]._currentStats["totalHP"] > 0) {
          result += targets[0].getEnergy(this, 50);
          targets[0]._currentStats["energy"] = 0;
          result += "<div>" + targets[0].heroDesc() + " energy set to " + formatNum(0) + ".</div>";
        }
        
        basicQueue.push([this, targets[0], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {damageAmount: 0};
    var targets = getRandomTargets(this, this._enemies, 4);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.2);
        result += targets[i].takeDamage(this, "Energy Devouring", damageResult);
        
        // attack % per energy damage seems to be true damage
        if (targets[i]._currentStats["totalHP"] > 0) {
          var additionalDamageAmount = this._currentStats["totalAttack"] * 0.06 * targets[i]._currentStats["energy"];
          additionalDamageResult = this.calcDamage(targets[i], additionalDamageAmount, "active", "energy");
          result += targets[i].takeDamage(this, "Energy Oscillation", additionalDamageResult);
        }
        
        if (targets[i]._currentStats["totalHP"] > 0 && random() < 0.7) {
          result += targets[i].getDebuff(this, "Devouring Mark", 15, {attackAmount: this._currentStats["totalAttack"]});
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
}



// Cthugha
class Cthugha extends hero {
  passiveStats() {
    // apply Demon Bloodline passive
    this.applyStatChange({attackPercent: 0.25, hpPercent: 0.2, damageReduce: 0.2}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventTookDamage" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      var burnDamageResult = {};
      var bleedDamageResult = {};
      var targets = getRandomTargets(this, this._enemies, 3);
      
      for (var i in targets) {
        burnDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 0.5, "passive", "burn", 1, 1, 3);
        bleedDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 0.5, "passive", "bleed", 1, 1, 3);
        
        result += targets[i].getDebuff(this, "Burn", 3, {burn: burnDamageResult["damageAmount"]}, false, "passive");
        result += targets[i].getDebuff(this, "Bleed", 3, {bleed: bleedDamageResult["damageAmount"]}, false, "passive");
      }
      
    } else if (trigger[1] == "eventTookDamageFromBurning" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
        result += "<div>" + this.heroDesc() + " <span class='skill'>Soul Shackle</span> triggered.</div>";
        result += this.getBuff(this, "Attack Percent", 3, {attackPercent: 0.10});
        
    } else if (trigger[1] == "eventTookDamageFromBleeding" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
        result += "<div>" + this.heroDesc() + " <span class='skill'>Soul Shackle</span> triggered.</div>";
        var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 0.6);
        result += this.getBuff(this, "Heal", 3, {heal: healAmount});
        
    }
    
    return result;
  }
  
  
  takeDamage(source, strAttackDesc, damageResult) {
    var result = "";
    
    if (!(isMonster(source)) && ["burn", "bleed", "burnTrue", "bleedTrue"].includes(damageResult["damageType"])) {
      damageResult["damageAmount"] = 0;
    }
    
    result = super.takeDamage(source, strAttackDesc, damageResult);
    
    if (damageResult["damageSource"] == "active" || damageResult["damageSource"] == "basic") {
      triggerQueue.push([this, "eventTookDamage"]);
      
      if (!(isMonster(source))) {
        if (source.hasStatus("burn") || source.hasStatus("burnTrue")) {
          triggerQueue.push([this, "eventTookDamageFromBurning"]);
        }
        
        if (source.hasStatus("bleed") || source.hasStatus("bleedTrue")) {
          triggerQueue.push([this, "eventTookDamageFromBleeding"]);
        }
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var detonateDamage = 0;
    var detonateDamageResult = {damageAmount: 0};
    var targets = getRandomTargets(this, this._enemies, 3);
    var isBleedOrBurn = false;
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.36);
        result += targets[i].takeDamage(this, "Terror Blade", damageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          detonateDamage = 0;
          
          for (var d in targets[i]._debuffs) {
            for (var s in targets[i]._debuffs[d]) {
              isBleedOrBurn = false;
              
              for (var e in targets[i]._debuffs[d][s]["effects"]) {
                if (["bleed", "burn", "burnTrue", "bleedTrue"].includes(e)) {
                  isBleedOrBurn = true;
                  detonateDamage += (targets[i]._debuffs[d][s]["duration"] - 1) * targets[i]._debuffs[d][s]["effects"][e];
                }
              }
              
              if (isBleedOrBurn) {
                result += targets[i].removeDebuff(d, s);
              }
            }
          }
          
          if (detonateDamage > 0) {
            detonateDamage *= 1.2;
            if (detonateDamage > this._currentStats["totalAttack"] * 20) {
              detonateDamage = this._currentStats["totalAttack"] * 20;
            }
            
            detonateDamageResult = this.calcDamage(targets[i], detonateDamage, "active", "true");
            result += targets[i].takeDamage(this, "Terror Blade Detonate", detonateDamageResult);
          }
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + detonateDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
}



// Dark Arthindol
class DarkArthindol extends hero {
  passiveStats() {
    // apply Black Hole passive
    this.applyStatChange({skillDamage: 1.0, hpPercent: 0.4, speed: 60}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventSelfBasic" && trigger[2].length > 0 && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      if (trigger[2][0][1]._currentStats["totalHP"] > 0) {
        return this.eventSelfBasic(trigger[2][0][1]);
      }
    } else if (trigger[1] == "eventTookDamage" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.getBuff(this, "Attack Percent", 6, {attackPercent: 0.03});
      result += this.getBuff(this, "Skill Damage", 6, {skillDamage: 0.05});
      result += this.getEnergy(this, 10);
    }
    
    return result;
  }
  
  
  eventSelfBasic(target) {
    var result = "";
    result += "<div><span class='skill'>Petrify</span> drained target's energy.</div>";
    result += target.loseEnergy(this, 50)
    result += target.getDebuff(this, "petrify", 1);
    return result;
  }
  
  
  takeDamage(source, strAttackDesc, damageResult) {
    var result = "";
    var preHP = this._currentStats["totalHP"];
    
    result += super.takeDamage(source, strAttackDesc, damageResult);
    
    var postHP = this._currentStats["totalHP"];
    
    if (this.isNotSealed() && (preHP - postHP)/this._stats["totalHP"] >= 0.03) {
      triggerQueue.push([this, "eventTookDamage"]);
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 0.98);
        result += targets[i].takeDamage(this, "Chaotic Shade", damageResult);
        
        if (targets[0]._currentStats["totalHP"] > 0) {
          result += targets[i].getDebuff(this, "petrify", 2, {}, false, "", 0.30);
          
          if (random() < 0.3) {
            result += "<div><span class='skill'>Chaotic Shade</span> drained target's energy.</div>";
            result += targets[i].loseEnergy(this, 30);
          }
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    result += this.getBuff(this, "Damage Reduce", 2, {damageReduce: 0.4});
    
    return result;
  }
}



// Delacium
class Delacium extends hero {
  passiveStats() {
    // apply Extreme Rage passive
    this.applyStatChange({attackPercent: 0.40, hpPercent: 0.30, crit: 0.35, controlImmune: 0.30, speed: 60}, "PassiveStats");
  }
  
  endOfRound(roundNum) {
    var result = "";
    var targets = []; 
    var maxTargets = 3;
    var maxToCopy = 3;
    var maxStacks = 3;
    var copyFrom = [];
    var copyTo = [];
    
    
    for (let i in this._enemies) {
      if (Object.keys(this._enemies[i]._debuffs).length > 0) {
        copyFrom.push(this._enemies[i]);
      }
    }
    
    copyFrom = getRandomTargets(this, copyFrom, 1);
    if (copyFrom.length > 0) {
      for (let i in this._enemies) {
        if (this._enemies[i].heroDesc() != copyFrom[0].heroDesc()) {
          copyTo.push(this._enemies[i]);
        }
      }
      
      copyTo = getRandomTargets(this, copyTo, 2);
      targets = copyFrom.concat(copyTo);
    }
    
    
    if (targets.length > 0 && this._currentStats["totalHP"] > 0) {
      var validDebuffs = [];
      var effects;
      
      for (var d in targets[0]._debuffs) {
        // Delacium does not copy Mihm's dot
        if (d != "Dot") {
          effects = Object.values(targets[0]._debuffs[d])[0]["effects"];
          
          if (isDot(d, effects) || isAttribute(d, effects)) {
            validDebuffs.push([d, targets[0]._debuffs[d], random()]);
          }
        }
      }
      
      if (validDebuffs.length < maxToCopy) { maxToCopy = validDebuffs.length; }
      if (targets.length < maxTargets) { maxTargets = targets.length; }
      
      validDebuffs.sort(function(a,b) {
        if (a[2] > b[2]) {
          return 1;
        } else {
          return -1;
        }
      });
      
      if (targets.length > 1 && maxToCopy > 0) {
        result += "<p><div>" + this.heroDesc() + " <span class='skill'>Transmissive Seed</span> triggered. Copying dots and attribute reduction debuffs.</div>";
        
        for (let h = 1; h < maxTargets; h++) {
          for (let d = 0; d < maxToCopy; d++) {
            let stackKeys = Object.keys(validDebuffs[d][1]);
            maxStacks = 3;
            if (stackKeys.length < maxStacks) { maxStacks = stackKeys.length; }
            
            for (let s = 0; s < maxStacks; s++) {
              result += targets[h].getDebuff(validDebuffs[d][1][stackKeys[s]]["source"], validDebuffs[d][0], validDebuffs[d][1][stackKeys[s]]["duration"], validDebuffs[d][1][stackKeys[s]]["effects"]);
            }
          }
        }
        
        result += "</p>";
      }
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var additionalDamage = 0;
    var additionalDamageResult = {};
    var targets = getRandomTargets(this, this._enemies, 3);
    var targetLock;
    
    for (var i in  targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 2.5, "basic", "normal");
        result += targets[i].takeDamage(this, "Basic Attack", damageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          additionalDamage = this._currentStats["totalAttack"] * 2.5 * (1 + Object.keys(targets[i]._debuffs).length);
          additionalDamageResult = this.calcDamage(targets[i], additionalDamage, "basic", "normal", 1, 0);
          result += targets[i].takeDamage(this, "Durative Weakness", additionalDamageResult);
        }
        
        basicQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"] || additionalDamageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  doActive() {
    var result = "";
    var damageResult = {};
    var additionalDamage = 0;
    var additionalDamageResult = {};
    var targets = getRandomTargets(this, this._enemies, 4);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 4);
        result += targets[i].takeDamage(this, "Ray of Delacium", damageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          additionalDamage = 4 * (1 + Object.keys(targets[i]._debuffs).length);
          additionalDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", additionalDamage, 0);
          result += targets[i].takeDamage(this, "Ray of Delacium 2", additionalDamageResult);
        }
          
        if (targets[i]._currentStats["totalHP"] > 0 && random() < 0.7) {
          for (var b in targets[i]._debuffs) {
            for (var s in targets[i]._debuffs[b]) {
              if (isDot(b, targets[i]._debuffs[b][s]["effects"]) || isAttribute(b, targets[i]._debuffs[b][s]["effects"]) || isControlEffect(b, targets[i]._debuffs[b][s]["effects"])) {
                targets[i]._debuffs[b][s]["duration"] += 2;
                result += "<div><span class='skill'>Ray of Delacium</span> extended duration of Debuff <span class='skill'>" + b + "</span>.</div>";
              }
            }
          }
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"] || additionalDamageResult["critted"]]);
      }
    }
    
    return result;
  }
}


// Elyvia
class Elyvia extends hero {
  passiveStats() {
    // apply Nothing Scare Elyvia passive
    this.applyStatChange({hpPercent: 0.30, attackPercent: 0.25, effectBeingHealed: 0.30}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventSelfBasic" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfBasic();
    } else if (["eventEnemyActive", "eventEnemyBasic"].includes(trigger[1])) {
      return this.eventEnemyBasic(trigger[2], trigger[3]);
    }
    
    return result;
  }
  
  
  eventSelfBasic() {
    var result = "";
    var targets = getRandomTargets(this, this._enemies, 1);
    
    if (targets.length > 0) {
      result += targets[0].getDebuff(this, "Shrink", 2, {allDamageTaken: -0.30, allDamageDealt: 0.50}, false, "", 1, true);
    }
    
    return result;
  }
  
  
  eventEnemyBasic(source, e) {
    var result = "";
    
    for (var i in e) {
      if ("Fairy's Guard" in e[i][1]._buffs) {
        var damageResult = e[i][1].calcDamage(source, e[i][1]._currentStats["totalAttack"] * 3, "passive", "normal", 1, 1, 0, 1, 0);
        result += source.takeDamage(e[i][1], "Fairy's Guard", damageResult);
        
        var healAmount = e[i][1].calcHeal(e[i][1], e[i][1]._currentStats["totalAttack"] * 1.5);
        result += e[i][1].getHeal(e[i][1], healAmount);
      }
    }
    
    return result;
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    
    if (this._currentStats["totalHP"] > 0) {
      var targets = getRandomTargets(this, this._enemies);
      var speedDiff = 0;
      
      for (var i in targets) {
        if (targets[i]._currentStats["speed"] > this._currentStats["speed"]) {
          result += "<div>" + this.heroDesc() + " <span class='skill'>Exchange, Not Steal!</span> swapped speed with " + targets[i].heroDesc() + ".</div>";
          
          speedDiff = targets[i]._currentStats["speed"] - this._currentStats["speed"];
          result += this.getBuff(this, "Exchange, Not Steal!", 1, {speed: speedDiff});
          result += targets[i].getDebuff(this, "Exchange, Not Steal!", 1, {speed: speedDiff});
        }
        break;
      }
      
      
      var targets = getRandomTargets(this, this._allies, 1);
      if (targets.length > 0) {
        result += targets[0].getBuff(this, "Fairy's Guard", 2, {}, true);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 1);
    var targetLock;
    
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 4);
        result += targets[0].takeDamage(this, "You Miss Lilliput?!", damageResult);
        result += targets[0].getDebuff(this, "Shrink", 2, {allDamageTaken: -0.30, allDamageDealt: 0.50}, false, "", 1, true);
      }
    }
    
    var targets = getRandomTargets(this, this._allies, 3);
    for (var i in targets) {
      result += targets[i].getBuff(this, "Fairy's Guard", 2, {}, true);
    }
    
    return result;
  }
}


// Emily
class Emily extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
    this._stats["courageousTriggered"] = 0;
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventHPlte50" && this._currentStats["courageousTriggered"] == 0 && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      this._currentStats["courageousTriggered"] = 1;
      result += "<div>" + this.heroDesc() + " <span class='skill'>Courageous</span> triggered.</div>";
      
      var targets = getAllTargets(this, this._allies);
      for (var h in targets) {
        result += targets[h].getBuff(this, "Attack Percent", 3, {attackPercent: 0.29});
      }
      
      targets = getAllTargets(this, this._enemies);
      for (var h in targets) {
        result += targets[h].getDebuff(this, "Armor Percent", 3, {armorPercent: 0.29});
      }
    }
    
    return result;
  }
  
  
  passiveStats() {
    // apply Spiritual Blessing passive
    this.applyStatChange({hpPercent: 0.40, speed: 50}, "PassiveStats");
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 3);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 0.8, "basic", "normal");
        result += targets[i].takeDamage(this, "Element Fission", damageResult);
        result += targets[i].getDebuff(this, "Crit", 3, {crit: 0.20});
        basicQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.16);
        result += targets[i].takeDamage(this, "Nether Nightmare", damageResult);
        result += targets[i].getDebuff(this, "Precision", 3, {precision: 0.40});
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    targets = getAllTargets(this, this._allies);
    for (var i in targets) {
      result += targets[i].getBuff(this, "Speed", 3, {speed: 30});
      result += targets[i].getBuff(this, "Attack Percent", 3, {attackPercent: 0.20});
    }
    
    return result;
  }
}



// Garuda
class Garuda extends hero {
  passiveStats() {
    // apply Eagle Power passive
    this.applyStatChange({attackPercent: 0.25, hpPercent: 0.3, critDamage: 0.4, controlImmune: 0.3}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventAllyBasic", "eventAllyActive"].includes(trigger[1]) && !(this.isUnderStandardControl()) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
        return this.eventAllyBasic(trigger[3]);
    } else if (["eventSelfBasic", "eventSelfActive"].includes(trigger[1]) && !(this.isUnderStandardControl()) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
        return this.eventAllyBasic(trigger[2]);
    } else if (["eventAllyDied", "eventEnemyDied"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventAllyDied();
    }
    
    return result;
  }
  
  
  eventAllyBasic(e) {
    var result = "";
    var damageResult = {};
    
    result += "<div>" + this.heroDesc() + " <span class='skill'>Instinct of Hunt</span> passive triggered.</div>";
    
    for (var i in e) {
      if (e[i][1]._currentStats["totalHP"] > 0) {
        damageResult = this.calcDamage(e[i][1], this._currentStats["totalAttack"] * 2.5, "passive", "normal");
        result += e[i][1].takeDamage(this, "Instinct of Hunt", damageResult);
      }
    }
    
    result += this.getBuff(this, "Feather Blade", 15, {damageReduce: 0.04});
    result += this.getBuff(this, "Crit", 2, {crit: 0.05});
    
    return result;
  }
  
  
  eventAllyDied() {
    var result = "";
    
    result += "<div>" + this.heroDesc() + " <span class='skill'>Unbeatable Force</span> passive triggered.</div>";
    
    var healAmount = this.calcHeal(this, this._stats["totalHP"] * 0.3);
    result += this.getHeal(this, healAmount);
    result += this.getBuff(this, "Feather Blade", 15, {damageReduce: 0.04});
    result += this.getBuff(this, "Feather Blade", 15, {damageReduce: 0.04});
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 3);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 4.8);
        result += targets[i].takeDamage(this, "Fatal Feather", damageResult);
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    // Use up all Feather Blades
    var featherTarget;
    if ("Feather Blade" in this._buffs) {
      var numBlades = Object.keys(this._buffs["Feather Blade"]);
      
      for (var i in numBlades) {
        featherTarget = getRandomTargets(this, targets, 1);
        
        if (featherTarget.length > 0) {
          targetLock = targets[0].getTargetLock(this);
          result += targetLock;
          
          if (targetLock == "") {
            damageResult = this.calcDamage(featherTarget[0], this._currentStats["totalAttack"], "active", "normal", 3.2);
            result += featherTarget[0].takeDamage(this, "Feather Blade", damageResult);
          }
        }
      }
      result += this.removeBuff("Feather Blade");
    }
    
    return result;
  }
}


// Faith Blade
class FaithBlade extends hero {
  passiveStats() {
    // apply Ultimate Faith passive
    this.applyStatChange({holyDamage: 0.70, speed: 60, crit: 0.30, stunImmune: 1}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventEnemyDied" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventEnemyDied();
    }
    
    return result;
  }
  
  
  eventEnemyDied() {
    var result = "";
    result += this.getEnergy(this, 100);
    result += this.getBuff(this, "Holy Damage", 3, {holyDamage: 0.30});
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getLowestHPTargets(this, this._enemies, 1);
    var targetLock;
    
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 2, "basic", "normal", 1, 1, 0, 1, 0);
        result += targets[0].takeDamage(this, "Basic Attack", damageResult);
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {damageAmount: 0, critted: false};
    var hpDamage = 0;
    var hpDamageResult = {damageAmount: 0};
    var targets = getLowestHPTargets(this, this._enemies, 2);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        result += targets[i].getDebuff(this, "stun", 2);
        
        hpDamage = 0.20 * (targets[i]._stats["totalHP"] - targets[i]._currentStats["totalHP"]);
        if (hpDamage > this._currentStats["totalAttack"] * 15) { hpDamage = this._currentStats["totalAttack"] * 15; }
        hpDamageResult = this.calcDamage(targets[i], hpDamage, "active", "true");
        result += targets[i].takeDamage(this, "Blade Assault HP", hpDamageResult);
          
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 3);
          result += targets[i].takeDamage(this, "Blade Assault", damageResult);
        }
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          additionalDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.08, 1, 0, 1, 0);
          result += targets[i].takeDamage(this, "Blade Assault 2", additionalDamageResult);
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"] + hpDamageResult["damageAmount"], damageResult["critted"] || additionalDamageResult["critted"]]);
      }
    }
    
    return result;
  }
}


// Gustin
class Gustin extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
    this._stats["linkCount"] = 0;
  }
  
  passiveStats() {
    // apply Shadow Imprint passive
    this.applyStatChange({hpPercent: 0.25, speed: 30, controlImmune: 0.3, effectBeingHealed: 0.3}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventEnemyBasic", "eventEnemyActive"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventEnemyBasic(trigger[3]);
    } else if (trigger[1] == "eventTookDamage" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventTookDamage(trigger[2], trigger[3]);
    }
    
    return result;
  }
  
  
  startOfBattle() {
    var targets = getRandomTargets(this, this._enemies, 1);
    var result = targets[0].getDebuff(this, "Link of Souls", 15);
    return result;
  }
  
  
  eventTookDamage(source, damageAmount) {
    var result = "";
    
    if (source._currentStats["totalHP"] > 0 && this._currentStats["linkCount"] < 5) {
      var damageResult = this.calcDamage(source, damageAmount, "passive", "true");
      result += source.takeDamage(this, "Link of Souls", damageResult);
      this._currentStats["linkCount"]++;
    }
    
    return result;
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    var targets = [];
    
    if ("Demon Totem" in this._buffs) {
      targets = getLowestHPTargets(this, this._allies, 1);
      if (targets.length > 0) {
        var healAmount = this.calcHeal(this, 0.25 * targets[0]._stats["totalHP"]);
        result += targets[0].getHeal(this, healAmount);
      }
    }
    
    
    if (random() < 0.5 && this._currentStats["totalHP"] > 0) {
      targets = getRandomTargets(this, this._enemies, 2);
      for (var i in targets) {
        result += "<div>" + this.heroDesc() + " <span class='skill'>Cloak of Fog</span> drained " + targets[i].heroDesc() + " energy.</div>";
        result += targets[i].loseEnergy(this, 30);
      }
    }
    
    
    var linked = false;
    targets = getRandomTargets(this, this._enemies);
    
    if (targets.length > 0) {
      for (var i in targets) {
        if ("Link of Souls" in targets[i]._debuffs) { linked = true; }
      }
      
      if (!(linked)) {
        result += targets[0].getDebuff(this, "Link of Souls", 15);
      }
    }
    
    this._currentStats["linkCount"] = 0;
    
    return result;
  }
  
  
  eventEnemyBasic(e) {
    var result = "";
    
    if ("Demon Totem" in this._buffs) {
      for (var i in e) {
        if (this._currentStats["demonTotemStacks"] > 0 && random() < 0.6) {
          this._currentStats["demonTotemStacks"]--;
          result += "<div>" + this.heroDesc() + " <span class='skill'>Demon Totem</span> triggered dispell.</div>";
          
          var listDebuffs = []; 
          var allDebuffs = Object.keys(e[i][1]._debuffs);
          var maxDispell = 2;
          
          for (var d in allDebuffs) {
            if (isDispellable(allDebuffs[d])) {
              listDebuffs.push([allDebuffs[d], random()]);
            }
          }
          
          listDebuffs.sort(function(a,b) {
            if (a[1] < b[1]) {
              return true;
            } else {
              return false;
            }
          });
          
          if (listDebuffs.length < maxDispell) { maxDispell = listDebuffs.length; }
          
          for (var d = 0; d < maxDispell; d++) {
            result += e[i][1].removeDebuff(listDebuffs[d][0]);
          }
        }
      }
    }
    
    return result;
  }
  
  
  takeDamage(source, strAttackDesc, damageResult) {
    var result = "";
    var preHP = this._currentStats["totalHP"];
    
    result += super.takeDamage(source, strAttackDesc, damageResult);
    
    var postHP = this._currentStats["totalHP"];
    var damageAmount = 0.70 * (preHP - postHP);
    
    if (damageAmount > 0) {
      triggerQueue.push([this, "eventTookDamage", source, damageAmount]);
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 2);
    var buffRemoved;
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2);
        result += targets[i].takeDamage(this, "Demon Totem", damageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0 && random() < 0.60) {
          buffRemoved = false;
          
          for (var b in targets[i]._buffs) {
            for (var s in targets[i]._buffs[b]) {
              if (isAttribute(b, targets[i]._buffs[b][s]["effects"])) {
                result += targets[i].removeBuff(b, s);
                buffRemoved = true;
                break;
              }
            }
            
            if (buffRemoved) { break; } 
          }
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    result += this.getBuff(this, "Demon Totem", 3, {}, false);
    this._currentStats["demonTotemStacks"] = 4;
    
    return result;
  }
}



// Horus
class Horus extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
    this._stats["blockCount"] = 0;
  }
  
  
  passiveStats() {
    // apply Corrupted Rebirth passive
    this.applyStatChange({hpPercent: 0.4, attackPercent: 0.3, armorBreak: 0.4, block: 0.6}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventEnemyActive", "eventAllyActive", "eventSelfActive"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventEnemyActive();
    } else if (trigger[1] == "eventTookDamage" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventTookDamage();
    }
    
    return result;
  }
  
  
  eventTookDamage() {
    var result = "";
    
    if (this._currentStats["blockCount"] >= 3) {
      this._currentStats["blockCount"] = 0;
      
      for (var d in this._debuffs) {
        if (isControlEffect(d)) {
          result += this.removeDebuff(d);
        }
      }
      
      
      var damageAmount = this._stats["totalHP"] * 0.2;
      var maxDamage = this._currentStats["totalAttack"] * 25;
      
      if (damageAmount > maxDamage) { damageAmount = maxDamage; }
      
      var damageResult;
      var targets = getRandomTargets(this, this._enemies, 3);
      var totalDamage = 0;
      
      for (var i in targets) {
        damageResult = this.calcDamage(targets[i], damageAmount, "passive", "true");
        result += targets[i].takeDamage(this, "Crimson Contract", damageResult);
        totalDamage += damageResult["damageAmount"];
      }
      
      var healAmount = this.calcHeal(this, totalDamage * 0.4);
      result += this.getHeal(this, healAmount);
    }
    
    return result;
  }
  
  
  eventEnemyActive() {
    var result = "";
    result += this.getBuff(this, "Attack Percent", 15, {attackPercent: 0.05});
    result += this.getBuff(this, "Crit Damage", 15, {critDamage:0.02});
    return result;
  }
  
  
  takeDamage(source, strAttackDesc, damageResult) {
    var result = super.takeDamage(source, strAttackDesc, damageResult);
    
    if (damageResult["blocked"] == true) {
      this._currentStats["blockCount"]++;
      triggerQueue.push([this, "eventTookDamage"]);
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var bleedDamageResult = {};
    var hpDamage = 0;
    var hpDamageResult = {damageAmount: 0}
    var additionalDamage = 0;
    var additionalDamageResult = {damageAmount: 0, critted: false};
    var targets = getRandomTargets(this, this._enemies, 3);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.06);
        result += targets[i].takeDamage(this, "Torment of Flesh and Soul", damageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          bleedDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "bleed", 1, 3);
          result += targets[i].getDebuff(this, "Bleed", 3, {bleed: bleedDamageResult["damageAmount"]}, false, "active");
        }
        
        if (targets[i]._currentStats["totalHP"] > 0 && isFrontLine(targets[i], this._enemies)) {
          hpDamage = targets[i]._stats["totalHP"] * 0.15;
          var maxDamage = this._currentStats["totalAttack"] * 15;
          if (hpDamage > maxDamage) { hpDamage = maxDamage; }
          
          hpDamageResult = this.calcDamage(targets[i], hpDamage, "active", "true");
          result += targets[i].takeDamage(this, "Torment of Flesh and Soul Front Line", hpDamageResult);
        }
        
        if (targets[i]._currentStats["totalHP"] > 0 && isBackLine(targets[i], this._enemies)){
          additionalDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.08, 2);
          result += targets[i].takeDamage(this, "Torment of Flesh and Soul Back Line", additionalDamageResult);
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + hpDamageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"] || additionalDamageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getFrontTargets(this, this._enemies);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "basic", "normal");
        result += targets[i].takeDamage(this, "Basic Attack", damageResult);
        basicQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
}



// Ithaqua
class Ithaqua extends hero {
  passiveStats() {
    // apply Ode to Shadow passive
    this.applyStatChange({attackPercent: 0.35, crit: 0.35, critDamage: 0.5, speed: 60, controlImmune: 0.3}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventSelfBasic", "eventSelfActive"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfActive(trigger[2]);
    } else if (trigger[1] == "eventEnemyDied" && trigger[2].heroDesc() == this.heroDesc() && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventEnemyDied();
    }
    
    return result;
  }
  
  
  eventEnemyDied(e) {
    var result = "";
    var targets = getRandomTargets(this, this._enemies, 1);
    
    if (targets.length > 0) {
      result += targets[0].getDebuff(this, "Ghost Possessed", 3, {}, false, "", 1, true);
    }
    
    result += this.getBuff(this, "Armor Break", 3, {armorBreak: 1.0});
    return result;
  }
  
  
  eventSelfActive(e) {
    var result = "";
    var damageResult = {};
    
    for (var i in e) {
      if (e[i][1]._currentStats["totalHP"] > 0) {
        damageResult = this.calcDamage(e[i][1], e[i][2] * 0.25, "passive", "poison");
        result += e[i][1].getDebuff(this, "Poison", 2, {poison: damageResult["damageAmount"]}, false, "passive");
        
        if (e[i][1]._currentStats["totalHP"] > 0 && e[i][3] == true) {
          damageResult = this.calcDamage(e[i][1], e[i][2] * 0.25, "passive", "bleed");
          result += e[i][1].getDebuff(this, "Bleed", 2, {bleed: damageResult["damageAmount"]}, false, "passive");
        }
      }
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
    var healAmount = 0;
    var targetLock;
    var alreadyTargeted = [];
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        if ("Ghost Possessed" in this._enemies[i]._debuffs) {
          damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 1.8, "basic", "normal");
          result += targets[i].takeDamage(this, "GP - Basic Attack", damageResult);
          basicQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
          alreadyTargeted.push(targets[i]._heroPos);
          
          healAmount = this.calcHeal(this, damageResult["damageAmount"]);
          result += this.getHeal(this, healAmount);
        }
      }
    }
    
    
    targets = getLowestHPTargets(this, this._enemies, 1);
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 1.8, "basic", "normal");
        result += targets[0].takeDamage(this, "Basic Attack", damageResult);
        result += targets[0].getDebuff(this, "Ghost Possessed", 3, {}, false, "", 1, true);
        
        if (alreadyTargeted.includes(targets[0]._heroPos)) {
          basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
        }
      }
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
    var healAmount = 0;
    var hpDamage = 0;
    var hpDamageResult = {damageAmount: 0};
    var targetLock;
    var alreadyTargeted = [];
    
    for (var i in targets) {
      if ("Ghost Possessed" in targets[i]._debuffs) {
        targetLock = targets[i].getTargetLock(this);
        result += targetLock;
        
        if (targetLock == "") {
          damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 4.4);
          result += targets[i].takeDamage(this, "GP - Ghost Possession", damageResult);
          
          if (targets[i]._currentStats["totalHP"] > 0) {
            hpDamage = targets[i]._stats["totalHP"] * 0.10;
            if (hpDamage > this._currentStats["totalAttack"] * 15) { hpDamage = this._currentStats["totalAttack"] * 15; }
            hpDamageResult = this.calcDamage(targets[i], hpDamage, "active", "true");
            result += targets[i].takeDamage(this, "GP - Ghost Possession HP", hpDamageResult);
          }
          
          healAmount = this.calcHeal(this, damageResult["damageAmount"] + hpDamageResult["damageAmount"]);
          result += this.getHeal(this, healAmount);
        
          activeQueue.push([this, targets[i], damageResult["damageAmount"] + hpDamageResult["damageAmount"], damageResult["critted"]]);
          alreadyTargeted.push(targets[i]._heroPos);
        }
      }
    }
    
    
    targets = getLowestHPTargets(this, this._enemies, 1);
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 4.4);
        result += targets[0].takeDamage(this, "Ghost Possession", damageResult);
        
        if (targets[0]._currentStats["totalHP"] > 0) {
          hpDamage = targets[0]._stats["totalHP"] * 0.10;
          if (hpDamage > this._currentStats["totalAttack"] * 15) { hpDamage = this._currentStats["totalAttack"] * 15; }
          hpDamageResult = this.calcDamage(targets[0], hpDamage, "active", "true");
          result += targets[0].takeDamage(this, "Ghost Possession HP", hpDamageResult);
        }
          
        result += targets[0].getDebuff(this, "Ghost Possessed", 3, {}, false, "", 1, true);
        
        if (alreadyTargeted.includes(targets[0]._heroPos)) {
          activeQueue.push([this, targets[0], damageResult["damageAmount"] + hpDamageResult["damageAmount"], damageResult["critted"]]);
        }
      }
    }
    
    return result;
  }
}


// Kroos
class Kroos extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
    this._stats["flameInvasionTriggered"] = 0;
  }
  
  
  passiveStats() {
    // apply Flame Power passive
    this.applyStatChange({hpPercent: 0.30, speed: 60, damageReduce: 0.20}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventHPlte50" && this._currentStats["flameInvasionTriggered"] == 0 && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      this._currentStats["flameInvasionTriggered"] = 1;
      result += "<div>" + this.heroDesc() + " <span class='skill'>Flame Invasion</span> triggered.</div>";
      
      var targets = getAllTargets(this, this._enemies);
      for (var h in targets) {
        result += targets[h].getDebuff(this, "stun", 2, {}, false, "", 0.75);
      }
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getBackTargets(this, this._enemies);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 0.90, "basic", "normal");
        result += targets[i].takeDamage(this, "Vicious Fire Perfusion", damageResult);
        result += targets[i].getDebuff(this, "Armor Percent", 3, {armorPercent: 0.15});
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    
    var healAmount = 0;
    targets = getRandomTargets(this, this._allies, 2);
    for (var i in targets) {
      healAmount = this.calcHeal(targets[i], targets[i]._stats["totalHP"] * 0.20);
      result += targets[i].getHeal(this, healAmount);
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 4);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.5);
        result += targets[i].takeDamage(this, "Weak Curse", damageResult);
        result += targets[i].getDebuff(this, "Weak Curse", 3, {allDamageTaken: -0.50}, false, "", 1, true);
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    targets = getRandomTargets(this, this._allies, 1);
    if (targets.length > 0) {
      result += targets[0].getEnergy(this, 100);
    }
    
    return result;
  }
}



// Michelle
class Michelle extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
    this._stats["revive"] = 1;
  }
  
  
  passiveStats() {
    // apply Redemption of Michelle and Light Will passive
    this.applyStatChange({controlImmune: 1.0, holyDamage: 0.60, attackPercent: 0.30, speed: 40}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventAllyActive", "eventAllyBasic"].includes(trigger[1]) && "Blaze of Seraph" in trigger[2]._buffs) {
      return this.eventAllyBasic(trigger[2], trigger[3]);
    } else if (["eventSelfBasic", "eventSelfActive"].includes(trigger[1]) && "Blaze of Seraph" in this._buffs) {
      return this.eventAllyBasic(this, trigger[2]);
    }
    
    return result;
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    
    if (this._currentStats["totalHP"] <= 0 && this._currentStats["revive"] == 1) {          
      for (var b in this._buffs) {
        this.removeBuff(b);
      }
      
      for (var d in this._debuffs) {
        this.removeDebuff(d);
      }
          
      this._currentStats["revive"] = 0;
      this._currentStats["totalHP"] = this._stats["totalHP"];
      this._currentStats["energy"] = 100;
      result += "<div>" + this.heroDesc() + " has revived with full health and energy.</div>";
      result += this.getBuff(this, "Blaze of Seraph", 2, {attackAmount: this._currentStats["totalAttack"]});
    }
    
    return result;
  }
  
  
  eventAllyBasic(source, e) {
    var result = "";
    var firstKey = Object.keys(source._buffs["Blaze of Seraph"])[0];
    var maxAmount = 5 * source._buffs["Blaze of Seraph"][firstKey]["effects"]["attackAmount"];
    
    for (var i in e) {
      var damageAmount = e[i][1]._stats["totalHP"] * 0.06;
      if (damageAmount > maxAmount) {
        damageAmount = maxAmount;
      }
      
      var damageResult = this.calcDamage(e[i][1], damageAmount, "passive", "true");
      result += e[i][1].getDebuff(this, "Burn", 2, {burnTrue: damageResult["damageAmount"]}, false, "passive");
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getFrontTargets(this, this._enemies);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "basic", "normal");
        result += targets[i].takeDamage(this, "Basic Attack", damageResult);
        basicQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 4);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.98);
        result += targets[i].takeDamage(this, "Divine Sanction", damageResult);
        result += targets[i].getDebuff(this, "stun", 2, {}, false, "", 0.40);
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    targets = getLowestHPPercentTargets(this, this._allies, 1);
    if (targets.length > 0) {
      var healAmount = this.calcHeal(targets[0], this._currentStats["totalAttack"] * 10);
      result += targets[0].getHeal(this, healAmount);
    }
    
    targets = getRandomTargets(this, this._allies, 1);
    if (targets.length > 0) {
      result += targets[0].getBuff(this, "Blaze of Seraph", 3, {attackAmount: this._currentStats["totalAttack"]});
    }
    
    return result;
  }
}



// Mihm
class Mihm extends hero {
  passiveStats() {
    // apply Unreal Instinct passive
    this.applyStatChange({hpPercent: 0.4, damageReduce: 0.3, speed: 60, controlImmune: 1.0}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventAllyDied", "eventEnemyDied"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventEnemyDied();
    }
    
    return result;
  }
  
  
  eventEnemyDied() {
    var result = "";
    var targets = getAllTargets(this, this._enemies);
    var damageResult = {};
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 2, "passive", "dot", 1, 1, 1);
      result += targets[i].getDebuff(this, "Dot", 2, {dot: damageResult["damageAmount"]}, false, "passive");
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getLowestHPTargets(this, this._enemies, 1);
    var targetLock;
    
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 1.4, "basic", "normal");
        result += targets[0].takeDamage(this, "Energy Absorbing", damageResult);
        result += targets[0].loseEnergy(this, 60);
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 1);
    var targetLock;
    
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 4);
        result += targets[0].takeDamage(this, "Collapse Rays", damageResult);
        
        if (targets[0]._currentStats["totalHP"] > 0 && isFrontLine(targets[0], this._enemies)) {
          result += targets[0].getDebuff(this, "Armor Percent", 3, {armorPercent: 0.75});
          result += targets[0].getDebuff(this, "petrify", 2);
        }
        
        if (targets[0]._currentStats["totalHP"] > 0 && isBackLine(targets[0], this._enemies)) {
          result += targets[0].getDebuff(this, "Attack Percent", 3, {attackPercent: 0.30});
          result += targets[0].getDebuff(this, "Speed", 3, {speed: 80});
        }
        
        activeQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
}



// Nakia
class Nakia extends hero {
  passiveStats() {
    // apply Arachnid Madness passive
    this.applyStatChange({attackPercent: 0.35, crit: 0.35, controlImmune: 0.3, speed: 30, damageAgainstBleed: 0.80}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventSelfActive" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfActive(trigger[2]);
    } else if (trigger[1] == "eventSelfBasic" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfBasic(trigger[2]);
    }
    
    return result;
  }
  
  
  eventSelfBasic(e) {
    var result = "";
    var damageResult;
    var targets = getBackTargets(this, this._enemies);
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "passive", "bleed", 1, 1, 3);
      result += targets[i].getDebuff(this, "Bleed", 3, {bleed: damageResult["damageAmount"]}, false, "passive");
      result += targets[i].getDebuff(this, "Speed", 3, {speed: 30});
    }
    
    result += this.eventSelfActive(e);
    
    return result;
  }
  
  
  eventSelfActive(e) {
    var result = "";
    var damageResult;
    var targets = getAllTargets(this, this._enemies);
    var didCrit = false;
    
    for (var i in e) {
      if (e[i][3] == true) { didCrit = true; }
    }
    
    for (var i in targets) {
      if ("Bleed" in targets[i]._debuffs) {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "passive", "bleed", 1, 1, 3);
        result += targets[i].getDebuff(this, "Bleed", 3, {bleed: damageResult["damageAmount"]}, false, "passive");
        
        if (didCrit) {
          result += targets[i].getDebuff(this, "Bleed", 3, {bleed: damageResult["damageAmount"]}, false, "passive");
        }
      }
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getLowestHPTargets(this, this._enemies, 1);
    var targetLock;
    
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "basic", "normal");
        result += targets[0].takeDamage(this, "Basic Attack", damageResult);
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var bleedDamageResult = {damageAmount: 0};
    var targets = getBackTargets(this, this._enemies);
    var targetLock;
    
    targets = getRandomTargets(this, targets, 2);
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.3);
        result += targets[i].takeDamage(this, "Ferocious Bite", damageResult);
      
        if (targets[i]._currentStats["totalHP"] > 0) {
          bleedDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "bleed", 1.98, 1, 15);
          result += targets[i].getDebuff(this, "Bleed", 15, {bleed: bleedDamageResult["damageAmount"]}, false, "active");
        }
        
        if ("Speed" in targets[i]._debuffs && targets[i]._currentStats["totalHP"] > 0) {
          result += targets[i].getDebuff(this, "Bleed", 15, {bleed: bleedDamageResult["damageAmount"]}, false, "active");
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
}



// Oberon
class Oberon extends hero {
  passiveStats() {
    // apply Strength of Elf passive
    this.applyStatChange({attackPercent: 0.3, hpPercent: 0.35, speed: 40, effectBeingHealed: 0.3}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventSelfBasic" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfBasic();
    } else if (trigger[1] == "eventTwine" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventTwine();
    }
    
    return result;
  }
  
  
  eventSelfBasic() {
    var result = "";
    var targets = getRandomTargets(this, this._enemies, 1);
    
    if (targets.length > 0) {
      result += targets[0].getDebuff(this, "Sow Seeds", 1, {rounds: 1});
    }
    
    return result;
  }
  
  
  eventTwine() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 3);
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 2, "passive", "poison", 1, 1, 3);
      result += targets[i].getDebuff(this, "Poison", 3, {poison: damageResult["damageAmount"]}, false, "passive");
    }
    
    
    var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 1.8);
    result += this.getHeal(this, healAmount);
    result += this.getBuff(this, "Attack Percent", 6, {attackPercent: 0.20});
  
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 3);
    var targetLock;
    
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 1.85);
        result += targets[0].takeDamage(this, "Lethal Twining", damageResult);
        result+= targets[0].getDebuff(this, "twine", 2);
        activeQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    
    if (targets.length > 1) {
      targetLock = targets[1].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[1], this._currentStats["totalAttack"], "active", "normal", 2.25);
        result += targets[1].takeDamage(this, "Lethal Twining", damageResult);
        result+= targets[1].getDebuff(this, "Sow Seeds", 1, {rounds: 2});
        activeQueue.push([this, targets[1], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    
    if (targets.length > 2) {
      targetLock = targets[2].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[2], this._currentStats["totalAttack"], "active", "normal", 2.65);
        result += targets[2].takeDamage(this, "Lethal Twining", damageResult);
        result+= targets[2].getDebuff(this, "Sow Seeds", 2, {rounds: 2});
        activeQueue.push([this, targets[2], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
}



// Penny
class Penny extends hero {
  passiveStats() {
    // apply Troublemaker Gene passive
    this.applyStatChange({attackPercent: 0.3, hpPercent: 0.25, crit: 0.3, precision: 1.0}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventSelfBasic", "eventSelfActive"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfBasic(trigger[2]);
    } else if (trigger[1] == "eventTookDamage" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventTookDamage(trigger[2], trigger[3]);
    }
    
    return result;
  }
  
  
  eventTookDamage(target, damageAmount) {
    var result = "";
    var reflectDamageResult;
    
    result += "<div><span class='skill'>Reflection Armor</span> consumed.</div>";
    
    reflectDamageResult = this.calcDamage(target, damageAmount, "passive", "true");
    result += target.takeDamage(this, "Reflection Armor", reflectDamageResult);
    
    return result;
  }
  
  
  eventSelfBasic(e) {
    var result = "";
    var didCrit = false;
    var damageDone = 0;
    
    for (var i in e) {
      if (e[i][3] == true) {
        didCrit = true;
        damageDone += e[i][2];
      }
    }
    
    if (didCrit && damageDone > 0) {
      var damageResult = {};
      var targets = getAllTargets(this, this._enemies);
      
      result += "<div>" + this.heroDesc() + " <span class='skill'>Eerie Trickery</span> triggered on crit.</div>";
      
      for (var h in targets) {
        if (targets[h]._currentStats["totalHP"] > 0) {
          damageResult = this.calcDamage(targets[h], damageDone, "passive", "true");
          result += targets[h].takeDamage(this, "Eerie Trickery", damageResult);
        }
      }
      
      result += this.getBuff(this, "Dynamite Armor", 15, {});
      result += this.getBuff(this, "Reflection Armor", 15, {});
    }
    
    return result;
  }
  
  
  takeDamage(source, strAttackDesc, damageResult) {
    var result = "";
    var reflectDamageResult = {};
    var tempDamageAmount = damageResult["damageAmount"];
    
    
    if (["active", "active", "basic", "basic"].includes(damageResult["damageSource"]) && "Reflection Armor" in this._buffs && !("Guardian Shadow" in this._buffs) && this.isNotSealed()) {
      damageResult["damageAmount"] = Math.floor(damageResult["damageAmount"] / 2);
      
      result += super.takeDamage(source, strAttackDesc, damageResult);
      
      tempDamageAmount = Math.floor(tempDamageAmount / 2);
      this._currentStats["damageHealed"] += tempDamageAmount;
      triggerQueue.push([this, "eventTookDamage", source, tempDamageAmount]);
      
      var keyDelete = Object.keys(this._buffs["Reflection Armor"]);
      if (keyDelete.length <= 1) {
        delete this._buffs["Reflection Armor"];
      } else {
        delete this._buffs["Reflection Armor"][keyDelete[0]];
      }
      
    } else {
      result += super.takeDamage(source, strAttackDesc, damageResult);
    }
    
    return result;
  }
  
  
  getDebuff(source, debuffName, duration, effects={}, bypassControlImmune=false, damageSource="passive", ccChance=1, unstackable=false) {
    var result = "";
    var isControl = isControlEffect(debuffName, effects);
    
    
    if ("Dynamite Armor" in this._buffs && isControl && this.isNotSealed()) {
      var controlImmune = this._currentStats["controlImmune"];
      var rollCCHit;
      var rollCCPen;
      
      if (isControl) {
        if ((debuffName + "Immune") in this._currentStats) {
          controlImmune = 1 - (1-controlImmune) * (1 - this._currentStats[debuffName + "Immune"]);
        }
      
        ccChance = 1 - (1 - ccChance * (1 + source._currentStats["controlPrecision"]))
        rollCCHit = random();
        rollCCPen = random();
    
    
        if (isControl && rollCCHit >= ccChance) {
          // failed CC roll
        } else if (isControl && rollCCPen < controlImmune && !(bypassControlImmune)) {
          result += "<div>" + this.heroDesc() + " resisted debuff <span class='skill'>" + debuffName + "</span>.</div>";
        } else if (
          isControl && 
          (rollCCPen >= controlImmune || !(bypassControlImmune)) 
          && this._artifact.includes(" Lucky Candy Bar") &&
          (this._currentStats["firstCC"] == "" || this._currentStats["firstCC"] == debuffName)
        ) {
          this._currentStats["firstCC"] = debuffName;
          result += "<div>" + this.heroDesc() + " resisted debuff <span class='skill'>" + debuffName + "</span> using <span class='skill'>" + this._artifact + "</span>.</div>";
        } else {
          result += "<div>" + this.heroDesc() + " consumed <span class='skill'>Dynamite Armor</span> to resist <span class='skill'>" + debuffName + "</span>.</div>";
          
          var keyDelete = Object.keys(this._buffs["Dynamite Armor"]);
          if (keyDelete.length <= 1) {
            delete this._buffs["Dynamite Armor"];
          } else {
            delete this._buffs["Dynamite Armor"][keyDelete[0]];
          }
        }
      }
    } else {
      result += super.getDebuff(source, debuffName, duration, effects, bypassControlImmune, damageSource, ccChance, unstackable);
    }
    
    return result;
  }
  
  
  doBasic() { 
    var result = "";
    var damageResult = {};
    var targets = getFrontTargets(this, this._enemies);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 1.8, "basic", "normal");
        result += targets[i].takeDamage(this, "Gunshot Symphony", damageResult);
        basicQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    result += this.getBuff(this, "Crit Damage", 2, {critDamage: 0.4});
    result += this.getBuff(this, "Reflection Armor", 15, {});
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var burnDamageResult = {};
    var targets = getHighestHPTargets(this, this._enemies, 1);
    var targetLock;
    
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 4.5);
        result += targets[0].takeDamage(this, "Fatal Fireworks", damageResult);
        
        burnDamageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "burn", 1.5, 1, 6);
        result += targets[0].getDebuff(this, "Burn", 6, {burn: burnDamageResult["damageAmount"]}, false, "active");
          
        activeQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    result += this.getBuff(this, "Dynamite Armor", 15, {});
    
    return result;
  }
}



// Sherlock
class Sherlock extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
    this._stats["wellCalculatedStacks"] = 3;
  }
  
  
  passiveStats() {
    // apply Source of Magic passive
    this.applyStatChange({attackPercent: 0.25, hpPercent: 0.30, speed: 40, damageReduce: 0.30}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventHPlte30" && this._currentStats["wellCalculatedStacks"] > 1 && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventHPlte30();
    } else if (trigger[1] == "eventGotCC" && this._currentStats["wellCalculatedStacks"] > 0 && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventGotCC(trigger[2], trigger[3], trigger[4]);
    }
    
    return result;
  }
  
  
  eventGotCC(source, ccName, ccStackID) {
    var result = "";
    
    if (ccName in this._debuffs) {
      if (ccStackID in this._debuffs[ccName]) {
        var targets = getRandomTargets(this, this._enemies, 1);
        var ccStack = this._debuffs[ccName][ccStackID];
        
        this._currentStats["wellCalculatedStacks"] -= 1;
        result += "<div>" + this.heroDesc() + " <span class='skill'>Well-Calculated</span> transfered <span class='skill'>" + ccName + "</span.</div>";
        
        if (targets.length > 0) {
          result += this.removeDebuff(ccName, ccStackID);
          result += targets[0].getDebuff(this, ccName, ccStack["duration"], ccStack["effects"]);
        }
      }
    }
    
    return result;
  }
  
  
  eventHPlte30() {
    var result = "";
    var targets = getHighestHPTargets(this, this._enemies, 1);
    
    this._currentStats["wellCalculatedStacks"] -= 2;
    
    if (targets.length > 0) {
      if (targets[0]._currentStats["totalHP"] > this._currentStats["totalHP"]) {
        var swapAmount = targets[0]._currentStats["totalHP"] - this._currentStats["totalHP"];
        if (swapAmount > this._currentStats["totalAttack"] * 50) { swapAmount = Math.floor(this._currentStats["totalAttack"] * 50);}
        
        this._currentStats["totalHP"] += swapAmount;
        targets[0]._currentStats["totalHP"] -= swapAmount;
        
        this._currentStats["damageHealed"] += swapAmount;
        this._currentStats["damageDealt"] += swapAmount;
        
        result += "<div>" + this.heroDesc() + " <span class='skill'>Deceiving Tricks</span> swapped " + formatNum(swapAmount) + " HP with " + targets[0].heroDesc() + ".</div>";
      }
    }
    
    return result;
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    
    if(random() < 0.5) {
      result = "<div>" + this.heroDesc() + " gained <span class='num'>2</span> stacks of <span class='skill'>Well-Calculated</span>.</div>";
      this._currentStats["wellCalculatedStacks"] += 2;
    } else {
      result = "<div>" + this.heroDesc() + " gained <span class='num'>1</span> stack of <span class='skill'>Well-Calculated</span>.</div>";
      this._currentStats["wellCalculatedStacks"] += 1;
    }
    
    return result;
  }
  
  
  getDebuff(source, debuffName, duration, effects={}, bypassControlImmune=false, damageSource="passive", ccChance=1, unstackable=false) {
    var result = "";
    
    if (debuffName.includes("Mark") && this.isNotSealed() && this._currentStats["wellCalculatedStacks"] > 0) {
      this._currentStats["wellCalculatedStacks"] -= 1;
      result += "<div>" + this.heroDesc() + " <span class='skill'>Well-Calculated</span> prevented <span class='skill'>" + debuffName + "</span.</div>";
      
    } else {
      result += super.getDebuff(source, debuffName, duration, effects, bypassControlImmune, damageSource, ccChance, unstackable);
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 1);
    var targetLock;
    
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "basic", "normal");
        result += targets[0].takeDamage(this, "Basic Attack", damageResult);
        result += targets[0].getDebuff(this, "Shapeshift", 15, {stacks: 3}, false, "", 0.50, true);
        
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 2);
    var ccChance = 1.0;
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 3);
        result += targets[i].takeDamage(this, "Master Showman", damageResult);
        result += targets[i].getDebuff(this, "Shapeshift", 15, {stacks: 3}, false, "", ccChance, true);
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
        
      ccChance -= 0.35;
    }
    
    result += "<div>" + this.heroDesc() + " gained <span class='num'>2</span> stacks of <span class='skill'>Well-Calculated</span>.</div>";
    this._currentStats["wellCalculatedStacks"] += 2;
    
    return result;
  }
}


// Tara
class Tara extends hero {
  passiveStats() {
    // apply Immense Power passive
    this.applyStatChange({hpPercent: 0.4, holyDamage: 0.7, controlImmune: 0.3, damageReduce: 0.3}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventSelfBasic", "eventSelfActive"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfBasic();
    }
    
    return result;
  }
  
  
  eventSelfBasic() {
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 4, "passive", "normal", 1, 1, 0, 1, 0);
      result += targets[i].takeDamage(this, "Fluctuation of Light", damageResult);
      
      if (random() < 0.3) {
        result += targets[i].getDebuff(this, "Power of Light", 15);
      }
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 1);
    var targetLock;
    
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 3, "basic", "normal");
        result = targets[0].takeDamage(this, "Basic Attack", damageResult);
        
        result += targets[0].getDebuff(this, "Power of Light", 15);
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 1);
    var didCrit = false;
    var damageDone = 0;
    var targetLock;
    
    if (targets.length > 0) {
      targetLock = targets[0].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 3);
        didCrit = didCrit || damageResult["critted"];
        result += targets[0].takeDamage(this, "Seal of Light", damageResult);
        damageDone += damageResult["damageAmount"];
        
        if (targets[0]._currentStats["totalHP"] > 0) {
          damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 3);
          didCrit = didCrit || damageResult["critted"];
          result += targets[0].takeDamage(this, "Seal of Light", damageResult);
          damageDone += damageResult["damageAmount"];
        }
          
        if (targets[0]._currentStats["totalHP"] > 0 && random() < 0.5) {
          damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 3);
          didCrit = didCrit || damageResult["critted"];
          result += targets[0].takeDamage(this, "Seal of Light", damageResult);
          damageDone += damageResult["damageAmount"];
        }
          
        if (targets[0]._currentStats["totalHP"] > 0 && random() < 0.34) {
          damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 3);
          didCrit = didCrit || damageResult["critted"];
          result += targets[0].takeDamage(this, "Seal of Light", damageResult);
          damageDone += damageResult["damageAmount"];
        }
          
        result += targets[0].getDebuff(this, "Power of Light", 15);
        activeQueue.push([this, targets[0], damageDone, didCrit]);
      }
    }
        
        
    targets = getAllTargets(this, this._enemies);
    for (var h in targets) {
      targetLock = targets[h].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        if ("Power of Light" in targets[h]._debuffs && random() < 0.6) {
          result += targets[h].getDebuff(this, "Power of Light", 15);
        }
      }
    }
      
    result += this.getBuff(this, "Holy Damage", 15, {holyDamage: 0.5});
    
    return result;
  }
}



// Unimax-3000
class UniMax3000 extends hero {
  passiveStats() {
    // apply Machine Forewarning passive
    this.applyStatChange({armorPercent: 0.3, hpPercent: 0.4, attackPercent: 0.25, controlImmune: 0.3, energy: 50}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventSelfBasic" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfBasic();
    } else if (["eventEnemyActive", "eventEnemyBasic"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventEnemyActive(trigger[2], trigger[3]);
    }
    
    return result;
  }
  
  
  eventEnemyActive(target, e) {
    var result = "";
    
    if (target._currentStats["totalHP"] > 0) {
      for (let i in e) {
        if (this.heroDesc() == e[i][1].heroDesc()) {
          var attackStolen = Math.floor(target._currentStats["totalAttack"] * 0.2);
          
          result += "<div>" + this.heroDesc() + " <span class='skill'>Frenzied Taunt</span> triggered.</div>"
          result += target.getDebuff(this, "Fixed Attack", 2, {fixedAttack: attackStolen});
          result += this.getBuff(this, "Fixed Attack", 2, {fixedAttack: attackStolen});
          result += target.getDebuff(this, "Taunt", 2, {}, false, "", 0.30);
          
          break;
        }
      }
    }
    
    return result;
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 1.2);
      
    result += this.getHeal(this, healAmount);
    result += this.getHeal(this, healAmount);
    result += this.getHeal(this, healAmount);
      
    if (roundNum == 4) {
      for (var d in this._debuffs) {
        if (isControlEffect(d)) {
          result += this.removeDebuff(d);
        }
      }
      
      result += this.getBuff(this, "Crit Damage", 15, {critDamage: 0.5});
      result += this.getBuff(this, "Rampage", 15);
    }
    
    return result;
  }
  
  
  calcDamage(target, attackDamage, damageSource, damageType, skillDamage=1, canCrit=1, dotRounds=0, canBlock=1, armorReduces=1) {
    var result = "";
    
    if ("Rampage" in this._buffs) {
      result = super.calcDamage(target, attackDamage, damageSource, damageType, skillDamage, 2, dotRounds, 0, armorReduces);
    } else {
      result = super.calcDamage(target, attackDamage, damageSource, damageType, skillDamage, canCrit, dotRounds, canBlock, armorReduces);
    }
    
    return result;
  }
  
  
  eventSelfBasic() {
    var result = "";
    var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 1.5);
    result += this.getBuff(this, "Heal", 2, {heal: healAmount});
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var damageResult2 = {damageAmount: 0, critted: false};
    var targets = getBackTargets(this, this._enemies);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 4.2);
        result += targets[i].takeDamage(this, "Iron Whirlwind", damageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          damageResult2 = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 4.2);
          result += targets[i].takeDamage(this, "Iron Whirlwind 2", damageResult2);
        }
        
        result += targets[i].getDebuff(this, "Taunt", 2, {}, false, "", 0.50);
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + damageResult2["damageAmount"], damageResult["critted"] || damageResult2["critted"]]);
      }
    }
    
    result += this.getBuff(this, "All Damage Reduce", 2, {allDamageReduce: 0.2});
    
    return result;
  }
}


// Asmodel
class Asmodel extends hero {
  passiveStats() {
    // apply Asmodeus passive
    this.applyStatChange({hpPercent: 0.40, attackPercent: 0.35, holyDamage: 0.50, crit: 0.35, controlImmune: 0.30}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "critMark") {
      if (trigger[2]._currentStats["totalHP"] > 0) {
        return this.critMark(trigger[2], trigger[3]);
      }
    } else if (["eventEnemyActive", "eventEnemyBasic"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventEnemyActive(trigger[3]);
    }
    
    return result;
  }
  
  
  eventEnemyActive(e) {
    var result = "";
    
    for (let t in e) {
      if (e[t][1].heroDesc() == this.heroDesc()) {
        var targets = getAllTargets(this, this._enemies);
        var damageResult;
        
        for (var i in targets) {
          damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 1.8, "mark", "normal");
          result += targets[i].getDebuff(this, "Crit Mark", 15, {attackAmount: damageResult});
        }
        
        break;
      }
    }
    
    result += this.getBuff(this, "Damage Reduce", 1, {damageReduce: 0.25});
    
    return result;
  }
  
  
  critMark(target, damageResult) {
    var result = "";
    result += target.takeDamage(this, "Crit Mark", damageResult);
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var markDamageResult = {};
    var targets = getFrontTargets(this, this._enemies);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 1.6, "basic", "normal");
        result += targets[i].takeDamage(this, "Basic Attack", damageResult);
        
        markDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 2.5, "mark", "normal");
        result += targets[i].getDebuff(this, "Crit Mark", 15, {attackAmount: markDamageResult});
        
        basicQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    result += this.getBuff(this, "Crit Damage", 3, {critDamage: 0.40});
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var markDamageResult = {};
    var targets = getRandomTargets(this, this._enemies, 4);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.25);
        result += targets[i].takeDamage(this, "Divine Burst", damageResult);
        
        markDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 3, "mark", "normal");
        result += targets[i].getDebuff(this, "Crit Mark", 15, {attackAmount: markDamageResult});
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    result += this.getBuff(this, "Attack Percent", 3, {attackPercent: 0.40});
    
    return result;
  }
}


// Drake
class Drake extends hero {
  passiveStats() {
    // apply Power of Void passive
    this.applyStatChange({attackPercent: 0.40, critDamage: 0.50, skillDamage: 0.70, controlImmune: 0.30, speed: 60}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventSelfActive", "eventSelfBasic"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfActive();
    }
    
    return result;
  }
  
  
  eventSelfActive() {
    return this.getBuff(this, "Shadow Lure", 1, {dodge: 0.60}, true);
  }
  
  
  startOfBattle() {
    var result = "";
    var targets = getLowestHPTargets(this, this._enemies, 1);
    
    for (let i in targets) {
      result += targets[i].getDebuff(this, "Drake Break Defense", 2, {armorPercent: 1, dodge: 1, block: 1, allDamageReduce: 1, damageReduce: 1}, false, "passive", 1, true);
    }
    
    return result;
  }
  
  
  endOfRound(roundNum) {
    return this.startOfBattle();
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var hpDamage = 0;
    var hpDamageResult = {damageAmount: 0};
    var targets = getLowestHPTargets(this, this._enemies, 1);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 2.2, "basic", "normal");
        result += targets[i].takeDamage(this, "Deadly Strike", damageResult);
        
        if ("Black Hole Mark" in targets[i]._debuffs) {
          if (targets[i]._currentStats["totalHP"] > 0) {
            hpDamage = 0.20 * targets[i]._stats["totalHP"];
            if (hpDamage > this._currentStats["totalAttack"] * 15) { hpDamage = this._currentStats["totalAttack"] * 15; }
            hpDamageResult = this.calcDamage(targets[i], hpDamage, "basic", "true");
            result += targets[i].takeDamage(this, "Deadly Strike - HP", hpDamageResult);
          }
        } else {
          result += targets[i].getDebuff(this, "Black Hole Mark", 1, {attackAmount: this._currentStats["totalAttack"] * 40, damageAmount: 0});
        }
        
        basicQueue.push([this, targets[i], damageResult["damageAmount"] + hpDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var hpDamage = 0;
    var hpDamageResult1 = {damageAmount: 0};
    var hpDamageResult2 = {damageAmount: 0};
    var targets = getRandomTargets(this, this._enemies, 2);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 4, "active", "normal");
        result += targets[i].takeDamage(this, "Annihilating Meteor", damageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          hpDamage = 0.20 * targets[i]._stats["totalHP"];
          if (hpDamage > this._currentStats["totalAttack"] * 15) { hpDamage = this._currentStats["totalAttack"] * 15; }
          hpDamageResult1 = this.calcDamage(targets[i], hpDamage, "active", "true");
          result += targets[i].takeDamage(this, "Annihilating Meteor - HP2", hpDamageResult1);
        }
        
        if ("Black Hole Mark" in targets[i]._debuffs) {
          if (targets[i]._currentStats["totalHP"] > 0) {
            hpDamageResult2 = this.calcDamage(targets[i], hpDamage, "active", "true");
            result += targets[i].takeDamage(this, "Annihilating Meteor - HP2", hpDamageResult2);
          }
        } else {
          result += targets[i].getDebuff(this, "Black Hole Mark", 1, {attackAmount: this._currentStats["totalAttack"] * 40, damageAmount: 0});
        }
        
        basicQueue.push([this, targets[i], damageResult["damageAmount"] + hpDamageResult1["damageAmount"] + hpDamageResult2["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
}


// Russell
class Russell extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
    this._stats["isCharging"] = false;
  }
  
  
  passiveStats() {
    // apply Baptism of Light passive
    this.applyStatChange({attackPercent: 0.30, holyDamage: 0.80, critDamage: 0.40, controlImmune: 0.30, speed: 60}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventSelfActive" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfActive();
    } else if (trigger[1] == "eventSelfBasic" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfBasic();
    }
    
    return result;
  }
  
  
  eventSelfBasic() {
    var result = this.eventSelfActive();
    result += this.getBuff(this, "Light Arrow", 4);
    result += this.getBuff(this, "Light Arrow", 4);
    return result;
  }
  
  
  eventSelfActive() {
    var result = "";
    var damageResult;
    var targets;
    
    if ("Light Arrow" in this._buffs && !(this._currentStats["isCharging"])) {
      for (let i in Object.keys(this._buffs["Light Arrow"])) {
        targets = getLowestHPTargets(this, this._enemies, 1);
        
        for (let i in targets) {
          damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 3, "passive", "normal");
          result += targets[i].takeDamage(this, "Light Arrow", damageResult);
        }
      }
    }
    
    return result;
  }
  
  
  startOfBattle() {
    var result = "";
    var targets = getLowestHPTargets(this, this._enemies, 2);
    
    for (let i in targets)  {
      result += targets[i].getDebuff(this, "Dazzle", 1);
    }
    
    return result;
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    var healAmount = this.calcHeal(this, 4 * this._currentStats["totalAttack"]);
    var targets = getLowestHPTargets(this, this._enemies, 2);
    
    
    result += this.getHeal(this, healAmount);
    result += this.getBuff(this, "Light Arrow", 4);
    result += this.getBuff(this, "Light Arrow", 4);
    
    for (let i in targets)  {
      result += targets[i].getDebuff(this, "Dazzle", 1);
    }
    
    return result;
  }
  
  
  getEnergy(source, amount) {
    if (!(this._currentStats["isCharging"])) {
      return super.getEnergy(source, amount);
    } else {
      return "";
    }
  }
  
  
  getDebuff(source, debuffName, duration, effects={}, bypassControlImmune=false, damageSource="passive", ccChance=1, unstackable=false) {
    if (isControlEffect(debuffName) && this._currentStats["isCharging"]) {
      return "";
    } else {
      return super.getDebuff(source, debuffName, duration, effects, bypassControlImmune, damageSource, ccChance, unstackable);
    }
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 1);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "basic", "normal");
        result += targets[i].takeDamage(this, "Basic Attack", damageResult);
        basicQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    
    if (this._currentStats["isCharging"]) {
      var damageResult = {};
      var targets = getAllTargets(this, this._enemies);
      var targetLock;
      
      this._currentStats["energySnapshot"] = this._currentStats["energy"];
      this._currentStats["energy"] = 0;
      
      for (var i in targets) {
        targetLock = targets[i].getTargetLock(this);
        result += targetLock;
        
        if (targetLock == "") {
          damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 16);
          result += targets[i].takeDamage(this, "Radiant Arrow", damageResult);
          activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
        }
      }
      
      this._currentStats["isCharging"] = false;
      
      result += this.getBuff(this, "Light Arrow", 4);
      result += this.getBuff(this, "Light Arrow", 4);
      result += this.getBuff(this, "Light Arrow", 4);
      result += this.getBuff(this, "Light Arrow", 4);
      
    } else {
      result += "<div>" + this.heroDesc() + " starts charging Radiant Arrow.</div>";
      result += this.getBuff(this, "Crit", 2, {crit: 0.50});
      result += this.getBuff(this, "Damage Reduce", 2, {damageReduce: 0.40});
      
      this._currentStats["isCharging"] = true;
    }
    
    return result;
  }
}


// Valkryie
class Valkryie extends hero {
  passiveStats() {
    // apply Unparalleled Brave passive
    this.applyStatChange({hpPercent: 0.35, attackPercent: 0.25, crit: 0.30}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventGotCC" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventGotCC();
    }
    
    return result;
  }
  
  
  eventGotCC() {
    var result = "";
    var targets = getRandomTargets(this, this._enemies, 3);
    var damageResult;
    var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 2);
    
    result += this.getBuff(this, "Heal", 3, {heal: healAmount});
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], this._stats["totalHP"] * 0.03, "passive", "burnTrue", 1, 0, 1);
      result += targets[i].getDebuff(this, "Burn", 1, {burnTrue: damageResult["damageAmount"]});
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var burnDamageResult = {damageAmount: 0};
    var targets = getRandomTargets(this, this._enemies, 3);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 0.95, "basic", "normal");
        result += targets[i].takeDamage(this, "Fire of the Soul", damageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          damageResult = this.calcDamage(targets[i], this._stats["totalHP"] * 0.06, "basic", "burnTrue", 1, 0, 1);
          result += targets[i].getDebuff(this, "Burn", 1, {valkryieBasic: true, burnTrue: damageResult["damageAmount"]});
        }
        
        result += targets[i].getDebuff(this, "Attack", 3, {attack: Math.floor(targets[i]._stats["attack"] * 0.12)});
        
        basicQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 3);
    var targetLock;
    var attackStolen = 0;
    
    for (let i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.62);
        result += targets[i].takeDamage(this, "Flap Dance", damageResult);
        
        attackStolen = Math.floor(targets[i]._currentStats["totalAttack"] * 0.15);
        result += targets[i].getDebuff(this, "Fixed Attack", 3, {fixedAttack: attackStolen});
        result += this.getBuff(this, "Fixed Attack", 3, {fixedAttack: attackStolen});
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }

    targets = getHighestHPTargets(this, this._enemies, 1);
    for (let i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._stats["totalHP"] * 0.18, "active", "burnTrue", 1, 0, 2);
        result += targets[i].getDebuff(this, "Burn", 1, {burnTrue: damageResult["damageAmount"]});
      }
    }
    
    return result;
  }
}


// Ormus
class Ormus extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
    this._stats["heartOfOrmusTriggered"] = false;
  }
  
  
  passiveStats() {
    // apply Power of Ormus passive
    this.applyStatChange({hpPercent: 0.35, attackPercent: 0.25, healEffect: 0.50}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventHPlte50" && this._currentStats["heartOfOrmusTriggered"] == false && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventHPlte50();
    } else if (trigger[1] == "eventSelfBasic" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfBasic(trigger[2]);
    }
    
    return result;
  }
  
  
  eventSelfBasic(e) {
    var result = "";
    var damageResult = {};
    
    for (let i in e) {
      damageResult = this.calcDamage(e[i][1], this._currentStats["totalAttack"], "passive", "normal");
      result += e[i][1].takeDamage(this, "Passive 1", damageResult);
    }
    
    
    var targets = getAllTargets(this, this._allies);
    var healAmount = 0;
    
    for (let i in targets) {
      healAmount = this.calcHeal(targets[i], this._currentStats["totalAttack"] * 1.5);
      result += targets[i].getBuff(this, "Heal", 2, {heal: healAmount});
    }
    
    return result;
  }
  
  
  eventHPlte50() {
    var result = "";
    var targets = getAllTargets(this, this._allies);
    
    this._currentStats["heartOfOrmusTriggered"] = true;
    
    for (let i in targets) {
      let healAmount = this.calcHeal(targets[i], 3 * this._currentStats["totalAttack"]);
      
      result += targets[i].getBuff(this, "Effect Being Healed", 3, {effectBeingHealed: 0.20});
      result += targets[i].getBuff(this, "Rescue Mark", 15, {attackAmount: healAmount});
      
      if (targets[i]._currentStats["totalHP"] <= targets[i]._stats["totalHP"] * 0.3) {
        result += targets[i].removeBuff("Rescue Mark");
        triggerQueue.push([targets[i], "getHeal", this, healAmount]);
      }
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getBackTargets(this, this._enemies);
    var targetLock;
    var healAmount = 0;
    
    targets = getRandomTargets(this, targets, 2);
    
    for (let i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.42);
        result += targets[i].takeDamage(this, "Blue Lightning Laser", damageResult);
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }

    targets = getLowestHPTargets(this, this._allies, 1);
    for (let i in targets) {
      healAmount = this.calcHeal(targets[i], this._currentStats["totalAttack"] * 3);
      result += targets[i].getHeal(this, healAmount);
      
      healAmount = this.calcHeal(targets[i], this._currentStats["totalAttack"] * 5);
      result += targets[i].getBuff(this, "Rescue Mark", 15, {attackAmount: healAmount});
      
      if (targets[i]._currentStats["totalHP"] <= targets[i]._stats["totalHP"] * 0.3) {
        result += targets[i].removeBuff("Rescue Mark");
        triggerQueue.push([targets[i], "getHeal", this, healAmount]);
      }
    }
    
    return result;
  }
}


// Rogan
class Rogan extends hero {
  passiveStats() {
    // apply Wolfish Blood passive
    this.applyStatChange({attackPercent:0.30, hpPercent: 0.25, critDamage: 0.40, damageReduce: 0.30, speed: 60}, "PassiveStats");
  }
  
  
  startOfBattle() {
    var result = "";
    var targets = getAllTargets(this, this._allies);
    
    for (let i in targets) {
      if (targets[i]._heroClass == "Assassin") {
        result += targets[i].getBuff(this, "Speed", 2, {speed: 40});
        result += targets[i].getBuff(this, "Crit Damage", 2, {critDamage: 0.40});
      } else {
        result += targets[i].getBuff(this, "Speed", 2, {speed: 20});
        result += targets[i].getBuff(this, "Crit Damage", 2, {critDamage: 0.20});
      }
    }
    
    return result;
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    var targets = getAllTargets(this, this._allies);
    
    for (let i in targets) {
      if (targets[i]._heroClass == "Assassin") {
        result += targets[i].getBuff(this, "attackPercent", 2, {attackPercent: 0.40});
        result += targets[i].getBuff(this, "Crit", 2, {crit: 0.20});
      } else {
        result += targets[i].getBuff(this, "attackPercent", 2, {attackPercent: 0.20});
        result += targets[i].getBuff(this, "Crit", 2, {crit: 0.10});
      }
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var maxDamage = 0;
    var hpDamage = 0;
    var hpDamageResult = {damageAmount: 0};
    var targets = getLowestHPTargets(this, this._enemies, 1);
    var targetLock;
    
    for (let i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        let canCrit = 1;
        if (targets[i]._currentStats["totalHP"] / targets[i]._stats["totalHP"] <= 0.50) {
          canCrit = 2;
        }
        
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 2.6, "basic", "normal", 1, canCrit);
        result += targets[i].takeDamage(this, "Savagery", damageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          hpDamage = 0.20 * (targets[i]._stats["totalHP"] - targets[i]._currentStats["totalHP"]);
          maxDamage = 15 * this._currentStats["totalAttack"];
          if (hpDamage > maxDamage) { hpDamage = maxDamage; }
          
          hpDamageResult = this.calcDamage(targets[i], hpDamage, "basic", "true");
          result += targets[i].takeDamage(this, "Savagery HP", hpDamageResult);
        }
        
        let healAmount = this.calcHeal(this, 0.30 * (damageResult["damageAmount"] + hpDamageResult["damageAmount"]));
        result += this.getHeal(this, healAmount);
        
        basicQueue.push([this, targets[i], damageResult["damageAmount"] + hpDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var maxDamage = 0;
    var hpDamage = 0;
    var hpDamageResult = {damageAmount: 0};
    var totalDamage = 0;
    var didCrit = false;
    var targets = getLowestHPTargets(this, this._enemies, 1);
    var targetLock;
    
    for (let i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        let canCrit = 1;
        didCrit = false;
        totalDamage = 0;
        
        if (targets[i]._currentStats["totalHP"] / targets[i]._stats["totalHP"] <= 0.50) {
          canCrit = 2;
        } else {
          canCrit = 1;
        }
        
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 3, canCrit);
        result += targets[i].takeDamage(this, "Bloodthirsty Predator 1", damageResult);
        totalDamage += damageResult["damageAmount"];
        didCrit = didCrit || damageResult["critted"];
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          if (targets[i]._currentStats["totalHP"] / targets[i]._stats["totalHP"] <= 0.50) {
            canCrit = 2;
          } else {
            canCrit = 1;
          }
          
          damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 3, canCrit);
          result += targets[i].takeDamage(this, "Bloodthirsty Predator 2", damageResult);
          totalDamage += damageResult["damageAmount"];
          didCrit = didCrit || damageResult["critted"];
        }
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          hpDamage = 0.20 * (targets[i]._stats["totalHP"] - targets[i]._currentStats["totalHP"]);
          maxDamage = 15 * this._currentStats["totalAttack"];
          if (hpDamage > maxDamage) { hpDamage = maxDamage; }
          
          hpDamageResult = this.calcDamage(targets[i], hpDamage, "active", "true");
          result += targets[i].takeDamage(this, "Bloodthirsty Predator HP", hpDamageResult);
          totalDamage += hpDamageResult["damageAmount"];
        }
        
        let healAmount = this.calcHeal(this, 0.50 * totalDamage);
        result += this.getHeal(this, healAmount);
        
        basicQueue.push([this, targets[i], totalDamage, didCrit]);
      }
    }
    
    
    var numTargets = 0;
    targets = getRandomTargets(this, this._allies, 3);
    
    for (let i in targets) {
      if (this.heroDesc() != targets[i].heroDesc()) {
        result += targets[i].getBuff(this, "Bloodthirsty", 3, {}, true);
        numTargets++;
      }
      
      if (numTargets == 2) {
        break;
      }
    }
    
    
    return result;
  }
}


// Gerke
class Gerke extends hero {
  passiveStats() {
    // apply Heavenly Order passive
    this.applyStatChange({holyDamage: 0.60, attackPercent: 0.25, hpPercent: 0.20, crit: 0.20}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventSelfBasic" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfBasic();
    } else if (["eventEnemyActive", "eventEnemyBasic"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventEnemyActive(trigger[3]);
    }
    
    return result;
  }
  
  
  eventSelfBasic() {
    var result = "";
    var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 1.95);
    
    result = this.getHeal(this, healAmount);
    result += this.getBuff(this, "Holy Damage", 4, {holyDamage: 0.20});
    
    return result;
  }
  
  
  eventEnemyActive(e) {
    var result = "";
    
    for (let t in e) {
      if (e[t][1].heroDesc() == this.heroDesc()) {
        var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 0.40);
        
        result = this.getHeal(this, healAmount);
        result += this.getBuff(this, "Holy Damage", 3, {holyDamage: 0.20});
        
        break;
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 4);
    var targetLock;
    var healAmount = 0;
    
    for (let i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.88);
        result += targets[i].takeDamage(this, "Divine Light", damageResult);
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    
    targets = getRandomTargets(this, this._allies, 3);
    for (let i in targets) {
      healAmount = this.calcHeal(targets[i], this._currentStats["totalAttack"] * 2.65);
      result += targets[i].getHeal(this, healAmount);
      result += targets[i].getBuff(this, "Holy Damage", 15, {holyDamage: 0.25});
    }
    
    
    return result;
  }
}


// Sleepless
class Sleepless extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
    this._stats["revive"] = 1;
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventSelfBasic" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfBasic(trigger[2]);
    } else if (["eventEnemyActive", "eventEnemyBasic"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventEnemyActive(trigger[2], trigger[3]);
    }
    
    return result;
  }
  
  
  eventSelfBasic(e) {
    var result = "";
    var damageResult = {};
    
    for (let t in e) {
      if (e[t][1]._currentStats["totalHP"] > 0) {
        damageResult = this.calcDamage(e[t][1], this._currentStats["totalAttack"] * 1.90, "mark", "normal");
        result += e[t][1].getDebuff(this, "Round Mark", 1, {attackAmount: damageResult});
        result += e[t][1].getDebuff(this, "petrify", 2, {}, false, "", 0.45);
      }
    }
    
    return result;
  }
  
  
  eventEnemyActive(target, e) {
    var result = "";
    var damageResult = {};
    
    if (target._currentStats["totalHP"] > 0) {
      for (let t in e) {
        if (e[t][1].heroDesc() == this.heroDesc()) {
          damageResult = this.calcDamage(target, this._currentStats["totalAttack"] * 1.85, "mark", "normal");
          result += target.getDebuff(this, "Round Mark", 1, {attackAmount: damageResult});
          
          break;
        }
      }
    }
    
    if (random() < 0.3) {
      let healAmount = this.calcHeal(this, this._stats["totalHP"] * 0.10);
      result += this.getHeal(this, healAmount);
    }
    
    return result;
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    
    if (this._currentStats["totalHP"] <= 0 && this._currentStats["revive"] == 1) {          
      for (var b in this._buffs) {
        this.removeBuff(b);
      }
      
      for (var d in this._debuffs) {
        this.removeDebuff(d);
      }
          
      this._currentStats["revive"] = 0;
      this._currentStats["totalHP"] = this._stats["totalHP"];
      this._currentStats["energy"] = 0;
      result += "<div>" + this.heroDesc() + " has revived with full health.</div>";
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies, 6);
    var targetLock;
    
    for (let i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.24);
        result += targets[i].takeDamage(this, "Sleepless Mark", damageResult);
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
      
      
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 2.8, "mark", "normal");
        result += targets[i].getDebuff(this, "Round Mark", 1, {attackAmount: damageResult});
      }
      
      
      if (random() < 0.45) {
        targetLock = targets[i].getTargetLock(this);
        result += targetLock;
        
        if (targetLock == "") {
          damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 2.1, "mark", "normal");
          result += targets[i].getDebuff(this, "Round Mark", 1, {attackAmount: damageResult});
        }
      }
    }
    
    result += this.getBuff(this, "Damage Reduce", 3, {damageReduce: 0.15});
    
    return result;
  }
}


// Das Moge
class DasMoge extends hero {
  passiveStats() {
    // apply Dark Insight passive
    this.applyStatChange({skillDamage: 0.625, attackPercent: 0.30, hpPercent: 0.40}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventSelfBasic" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfBasic();
    } else if (["eventSelfActive", "eventAllyActive"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      return this.eventSelfActive();
    }
    
    return result;
  }
  
  
  eventSelfBasic() {
    var result = "";
    result += this.getBuff(this, "Attack Percent", 3, {attackPercent: 0.20});
    result += this.getBuff(this, "Speed", 3, {attackPercent: 15});
    return result;
  }
  
  
  eventSelfActive() {
    var result = "";
    result += this.getBuff(this, "Skill Damage", 15, {skillDamage: 0.20});
    result += this.getEnergy(this, 30);
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var bleedDamageResult = {damageAmount: 0};
    var rangerDamageResult = {damageAmount: 0};
    var targets = getAllTargets(this, this._enemies);
    var targetLock;
    
    for (let i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.15);
        result += targets[i].takeDamage(this, "Death Reaper", damageResult);
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
      
      
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        bleedDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "bleed", 0.56, 3);
        result += targets[i].getDebuff(this, "Bleed", 3, {bleed: bleedDamageResult["damageAmount"]}, false, "active");
      }
      
      
      if (targets[i]._heroClass == "Ranger") {
        targetLock = targets[i].getTargetLock(this);
        result += targetLock;
        
        if (targetLock == "") {
          rangerDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "bleed", 1.05, 3);
          result += targets[i].getDebuff(this, "Bleed", 3, {bleed: rangerDamageResult["damageAmount"]}, false, "active");
        }
      }
    }
    
    result += this.getBuff(this, "Skill Damage", 15, {skillDamage: 0.50});
    
    return result;
  }
}

/* End of heroSubclasses.js */


/* Start of artifact.js */

var artifacts = {
  "None": {
    stats: {},
    limit: "",
    limitStats: {}
  },

  "Antlers Cane": {
    stats: {precision: .7, attackPercent: 0.25, skillDamage: 0.6},
    limit: "",
    limitStats: {}
  },

  "Glittery Antlers Cane": {
    stats: {precision: .7, attackPercent: 0.25, skillDamage: 0.6},
    limit: "",
    limitStats: {},
    enhance: 0.03
  },

  "Radiant Antlers Cane": {
    stats: {precision: .7, attackPercent: 0.25, skillDamage: 0.6},
    limit: "",
    limitStats: {},
    enhance: 0.045
  },

  "Splendid Antlers Cane": {
    stats: {precision: .7, attackPercent: 0.25, skillDamage: 0.6},
    limit: "",
    limitStats: {},
    enhance: 0.06
  },
  
  "Augustus Magic Ball": {
    stats: {attackPercent: 0.25, speed: 70, block: 0.5},
    limit: "",
    limitStats: {}
  },
  
  "Glittery Augustus Magic Ball": {
    stats: {attackPercent: 0.25, speed: 70, block: 0.5},
    limit: "",
    limitStats: {},
    enhance: 1.2
  },
  
  "Radiant Augustus Magic Ball": {
    stats: {attackPercent: 0.25, speed: 70, block: 0.5},
    limit: "",
    limitStats: {},
    enhance: 1.8
  },
  
  "Spendid Augustus Magic Ball": {
    stats: {attackPercent: 0.25, speed: 70, block: 0.5},
    limit: "",
    limitStats: {},
    enhance: 2.5
  },
  
  "Demon Bell": {
    stats: {attackPercent: 0.18, hpPercent: 0.14, energy: 50},
    limit: "",
    limitStats: {}
  },
  
  "Glittery Demon Bell": {
    stats: {attackPercent: 0.18, hpPercent: 0.14, energy: 50},
    limit: "",
    limitStats: {},
    enhance: 0.30
  },
  
  "Radiant Demon Bell": {
    stats: {attackPercent: 0.18, hpPercent: 0.14, energy: 50},
    limit: "",
    limitStats: {},
    enhance: 0.30
  },
  
  "Splendid Demon Bell": {
    stats: {attackPercent: 0.18, hpPercent: 0.14, energy: 50},
    limit: "",
    limitStats: {},
    enhance: 1
  },
  
  "Golden Crown": {
    stats: {attackPercent: 0.18, hpPercent: 0.25, allDamageReduce: 0.25},
    limit: "",
    limitStats: {}
  },
  
  "Lucky Candy Bar": {
    stats: {attackPercent: 0.22, hpPercent: 0.18, stunImmune: 1.0},
    limit: "",
    limitStats: {}
  },
  
  "Glittery Lucky Candy Bar": {
    stats: {attackPercent: 0.22, hpPercent: 0.18, stunImmune: 1.0},
    limit: "",
    limitStats: {}
  },
  
  "Radiant Lucky Candy Bar": {
    stats: {attackPercent: 0.22, hpPercent: 0.18, stunImmune: 1.0},
    limit: "",
    limitStats: {},
    enhance: 0.10
  },
  
  "Splendid Lucky Candy Bar": {
    stats: {attackPercent: 0.22, hpPercent: 0.18, stunImmune: 1.0},
    limit: "",
    limitStats: {},
    enhance: 0.20
  },
  
  "Magic Stone Sword": {
    stats: {attackPercent: 0.21, damageReduce: 0.3, controlImmune: 0.25},
    limit: "",
    limitStats: {}
  },
  
  "Glittery Magic Stone Sword": {
    stats: {attackPercent: 0.21, damageReduce: 0.3, controlImmune: 0.25},
    limit: "",
    limitStats: {},
    enhance: 0.50
  },
  
  "Radiant Magic Stone Sword": {
    stats: {attackPercent: 0.21, damageReduce: 0.3, controlImmune: 0.25},
    limit: "",
    limitStats: {},
    enhance: 0.40
  },
  
  "Splendid Magic Stone Sword": {
    stats: {attackPercent: 0.21, damageReduce: 0.3, controlImmune: 0.25},
    limit: "",
    limitStats: {},
    enhance: 0.30
  },
  
  "Ruyi Scepter": {
    stats: {hpPercent: 0.25, speed: 75, controlPrecision: 0.50},
    limit: "",
    limitStats: {}
  },
  
  "Glittery Ruyi Scepter": {
    stats: {hpPercent: 0.25, speed: 75, controlPrecision: 0.50, controlImmunePen: 0.10},
    limit: "",
    limitStats: {}
  },
  
  "Radiant Ruyi Scepter": {
    stats: {hpPercent: 0.25, speed: 75, controlPrecision: 0.50, controlImmunePen: 0.20},
    limit: "",
    limitStats: {}
  },
  
  "Splendid Ruyi Scepter": {
    stats: {hpPercent: 0.25, speed: 75, controlPrecision: 0.50, controlImmunePen: 0.30},
    limit: "",
    limitStats: {}
  },
  
  "Staff Punisher of Immortal": {
    stats: {attackPercent: 0.21, crit: 0.15, critDamage: 0.5},
    limit: "",
    limitStats: {}
  },
  
  "Glittery Staff Punisher of Immortal": {
    stats: {attackPercent: 0.21, crit: 0.15, critDamage: 0.5},
    limit: "",
    limitStats: {},
    enhance: 0.06
  },
  
  "Radiant Staff Punisher of Immortal": {
    stats: {attackPercent: 0.21, crit: 0.15, critDamage: 0.5},
    limit: "",
    limitStats: {},
    enhance: 0.12
  },
  
  "Splendid Staff Punisher of Immortal": {
    stats: {attackPercent: 0.21, crit: 0.15, critDamage: 0.5},
    limit: "",
    limitStats: {},
    enhance: 0.18
  },
  
  "The Kiss of Ghost": {
    stats: {attackPercent: 0.25, armorBreak: 1.0, hpPercent: 0.14},
    limit: "",
    limitStats: {}
  },
  
  "Glittery The Kiss of Ghost": {
    stats: {attackPercent: 0.25, armorBreak: 1.0, hpPercent: 0.14},
    limit: "",
    limitStats: {},
    enhance: 0.15
  },
  
  "Radiant The Kiss of Ghost": {
    stats: {attackPercent: 0.25, armorBreak: 1.0, hpPercent: 0.14},
    limit: "",
    limitStats: {},
    enhance: 0.30
  },
  
  "Splendid The Kiss of Ghost": {
    stats: {attackPercent: 0.25, armorBreak: 1.0, hpPercent: 0.14},
    limit: "",
    limitStats: {},
    enhance: 0.45
  },
  
  "Wildfire Torch": {
    stats: {precision: 0.6, hpPercent: 0.18, dotReduce: 0.7},
    limit: "",
    limitStats: {}
  },
  
  "Magic Source": {
    stats: {energy: 50, skillDamage: 0.5},
    limit: "",
    limitStats: {}
  },
  
  "Orb of Annihilation": {
    stats: {energy: 50, skillDamage: 0.5},
    limit: "Dark",
    limitStats: {skillDamage: 0.4}
  },
  
  "Guilty Crown" :{
    stats: {attackPercent: 0.18, hpPercent: 0.14},
    limit: "Dark",
    limitStats: {controlImmune: 0.25}
  },
  
  "Sword of Justice": {
    stats: {attackPercent: 0.18, holyDamage: 0.3},
    limit: "Light",
    limitStats: {crit: 0.15}
  },
  
  "Echo of Death": {
    stats: {attackPercent: 0.18, crit: 0.15},
    limit: "",
    limitStats: {}
  },
  
  "Heavenly Bead": {
    stats: {attackPercent: 0.18, precision: 0.12},
    limit: "",
    limitStats: {}
  },
  
  "Invisible": {
    stats: {hpPercent: 0.15, block: 0.20},
    limit: "",
    limitStats: {}
  },
  
  "Wind God Messenger": {
    stats: {speed: 66, hpPercent: 0.14},
    limit: "",
    limitStats: {}
  },
  
  "Shadow Cape": {
    stats: {speed: 66, hpPercent: 0.14},
    limit: "Shadow",
    limitStats: {crit: 0.15}
  },
  
  "Tread of Lightness": {
    stats: {speed: 66, hpPercent: 0.14},
    limit: "Fortress",
    limitStats: {crit: 0.15}
  },
  
  "Warhammer of Hopelessness": {
    stats: {speed: 66, hpPercent: 0.14},
    limit: "Abyss",
    limitStats: {crit: 0.15}
  },
  
  "Sigh": {
    stats: {speed: 66, hpPercent: 0.14},
    limit: "Forest",
    limitStats: {crit: 0.15}
  },
  
  "Fearless Armor": {
    stats: {damageReduce: .3, hpPercent: 0.14},
    limit: "",
    limitStats: {}
  },
  
  "Withered Armor": {
    stats: {damageReduce: 0.3, hpPercent: 0.14},
    limit: "Shadow",
    limitStats: {hpPercent: 0.18}
  },
  
  "Barrier of Destiny": {
    stats: {damageReduce: 0.3, hpPercent: 0.14},
    limit: "Fortress",
    limitStats: {hpPercent: 0.18}
  },
  
  "The King of Demons": {
    stats: {damageReduce: 0.3, hpPercent: 0.15},
    limit: "Abyss",
    limitStats: {hpPercent: 0.18}
  },
  
  "Rune's Power": {
    stats: {damageReduce: 0.3, hpPercent: 0.14},
    limit: "Forest",
    limitStats: {hpPercent: 0.18}
  },
  
  "Spear of Destiny": {
    stats: {damageReduce: 0.3, hpPercent: 0.14},
    limit: "Light",
    limitStats: {holyDamage: 0.18}
  },
  
  "Nail of Destiny": {
    stats: {damageAgainstWarrior: 0.90, attack: 2700},
    limit: "",
    limitStats: {}
  },
  
  "Kharma's Eye": {
    stats: {damageAgainstWarrior: 0.90, attack: 2700},
    limit: "Shadow",
    limitStats: {armorBreak: 0.30}
  },
  
  "Murmur": {
    stats: {damageAgainstWarrior: 0.90, attack: 2700},
    limit: "Fortress",
    limitStats: {hpPercent: 0.18}
  },
  
  "Margaret's Legacy": {
    stats: {damageAgainstWarrior: 0.90, attack: 2700},
    limit: "Abyss",
    limitStats: {hpPercent: 0.18}
  },
  
  "Poisonous Rose": {
    stats: {damageAgainstWarrior: 0.90, attack: 2700},
    limit: "Forest",
    limitStats: {hpPercent: 0.18}
  },
  
  "Reaper's Scythe": {
    stats: {damageAgainstWarrior: 0.90, skillDamage: 0.50},
    limit: "Dark",
    limitStats: {skillDamage: 0.40}
  },
  
  "Guardian Angel": {
    stats: {damageAgainstWarrior: 0.90, hpPercent: 0.14},
    limit: "Light",
    limitStats: {holyDamage: 0.18}
  },
  
  "Azrael": {
    stats: {damageAgainstRanger: 0.90, attack: 2700},
    limit: "",
    limitStats: {}
  },
  
  "Aidan's Fury": {
    stats: {damageAgainstRanger: 0.90, attack: 2700},
    limit: "Shadow",
    limitStats: {attackPercent: 0.14}
  },
  
  "Rage of the Dragon": {
    stats: {damageAgainstRanger: 0.90, attack: 2700},
    limit: "Fortress",
    limitStats: {attackPercent: 0.14}
  },
  
  "The Golden Key": {
    stats: {damageAgainstRanger: 0.90, hpPercent: 0.15},
    limit: "Fortress",
    limitStats: {block: 0.14}
  },
  
  "Engulf": {
    stats: {damageAgainstRanger: 0.90, attack: 2700},
    limit: "Abyss",
    limitStats: {crit: 0.15}
  },
  
  "Forest Reverberation": {
    stats: {damageAgainstRanger: 0.90, attack: 2700},
    limit: "Forest",
    limitStats: {crit: 0.15}
  },
  
  "Taboo Seal": {
    stats: {damageAgainstRanger: 0.90, skillDamage: 0.50},
    limit: "Dark",
    limitStats: {skillDamage: 0.40}
  },
  
  "Time Control": {
    stats: {damageAgainstRanger: 0.90, hpPercent: 0.14},
    limit: "Light",
    limitStats: {holyDamage: 0.18}
  },
  
  "Ancient God's Whisper": {
    stats: {damageAgainstMage: 0.90, attack: 2700},
    limit: "",
    limitStats: {}
  },
  
  "Necronomicon": {
    stats: {damageAgainstMage: 0.90, attack: 2700},
    limit: "Shadow",
    limitStats: {attackPercent: 0.14}
  },
  
  "Frost Sword": {
    stats: {damageAgainstMage: 0.90, attack: 2700},
    limit: "Fortress",
    limitStats: {hpPercent: 0.18}
  },
  
  "The Demon Whisper": {
    stats: {damageAgainstMage: 0.90, attack: 2700},
    limit: "Abyss",
    limitStats: {attackPercent: 0.14}
  },
  
  "Golden Bow": {
    stats: {damageAgainstMage: 0.90, attack: 2700},
    limit: "Forest",
    limitStats: {critDamage: 0.40}
  },
  
  "Evil Holy Grail": {
    stats: {damageAgainstMage: 0.90, skillDamage: 0.50},
    limit: "Dark",
    limitStats: {skillDamage: 0.40}
  },
  
  "Awakening of Divine Power": {
    stats: {damageAgainstMage: 0.90, hpPercent: 0.14},
    limit: "Light",
    limitStats: {holyDamage: 0.18}
  },
  
  "Fiend's Touch": {
    stats: {damageAgainstAssassin: 0.90, attack: 2700},
    limit: "",
    limitStats: {}
  },
  
  "Field's Compass": {
    stats: {damageAgainstAssassin: 0.90, attack: 2700},
    limit: "Shadow",
    limitStats: {hpPercent: 0.18}
  },
  
  "The Masked Lover": {
    stats: {damageAgainstAssassin: 0.90, attack: 2700},
    limit: "Fortress",
    limitStats: {attackPercent: 0.14}
  },
  
  "Queen's Blade": {
    stats: {damageAgainstAssassin: 0.90, attack: 2700},
    limit: "Abyss",
    limitStats: {attackPercent: 0.14}
  },
  
  "Flower Language": {
    stats: {damageAgainstAssassin: 0.90, attack: 2700},
    limit: "Forest",
    limitStats: {attackPercent: 0.14}
  },
  
  "Ghost Cloak": {
    stats: {damageAgainstAssassin: 0.90, skillDamage: 0.50},
    limit: "Dark",
    limitStats: {skillDamage: 0.40}
  },
  
  "The Sword of Archangel": {
    stats: {damageAgainstAssassin: 0.90, hpPercent: 0.14},
    limit: "Light",
    limitStats: {holyDamage: 0.18}
  },
  
  "Eye of the Hell": {
    stats: {damageAgainstPriest: 0.90, attack: 2700},
    limit: "",
    limitStats: {}
  },
  
  "Magical Sacrifice": {
    stats: {damageAgainstPriest: 0.90, attack: 2700},
    limit: "Shadow",
    limitStats: {attackPercent: 0.14}
  },
  
  "Energy Core": {
    stats: {damageAgainstPriest: 0.90, attack: 2700},
    limit: "Fortress",
    limitStats: {skillDamage: 0.40}
  },
  
  "Yubashiri": {
    stats: {damageAgainstPriest: 0.90, attack: 2700},
    limit: "Fortress",
    limitStats: {attackPercent: 0.14}
  },
  
  "Destruction Box": {
    stats: {damageAgainstPriest: 0.90, attack: 2700},
    limit: "Abyss",
    limitStats: {attackPercent: 0.14}
  },
  
  "Elf Tears": {
    stats: {damageAgainstPriest: 0.90, attack: 2700},
    limit: "Forest",
    limitStats: {attackPercent: 0.14}
  },
  
  "Curse of Medusa": {
    stats: {damageAgainstPriest: 0.90, skillDamage: 0.50},
    limit: "Dark",
    limitStats: {skillDamage: 0.40}
  },
  
  "Bright Holy Water": {
    stats: {damageAgainstPriest: 0.90, hpPercent: 0.14},
    limit: "Light",
    limitStats: {holyDamage: 0.18}
  }
};

/* End of artifact.js */


/* Start of avatarFrame.js */

var avatarFrames = {
  "None": {},
  "Golden Amber": {hpPercent: 0.03, attackPercent: 0.01},
  "Golden Amber +1": {hpPercent: 0.04, attackPercent: 0.01},
  "Golden Amber +2": {hpPercent: 0.05, attackPercent: 0.01},
  "Golden Amber +3": {hpPercent: 0.06, attackPercent: 0.02},
  "Golden Amber +4": {hpPercent: 0.07, attackPercent: 0.02},
  "Golden Amber +5": {hpPercent: 0.08, attackPercent: 0.03},
  "Shining Crystal": {hpPercent: 0.03, attackPercent: 0.02, controlImmune: 0.01},
  "Shining Crystal +1": {hpPercent: 0.04, attackPercent: 0.02, controlImmune: 0.01},
  "Shining Crystal +2": {hpPercent: 0.05, attackPercent: 0.02, controlImmune: 0.01},
  "Shining Crystal +3": {hpPercent: 0.06, attackPercent: 0.03, controlImmune: 0.02},
  "Shining Crystal +4": {hpPercent: 0.07, attackPercent: 0.03, controlImmune: 0.02},
  "Shining Crystal +5": {hpPercent: 0.08, attackPercent: 0.04, controlImmune: 0.02},
  "Shining Crystal +6": {hpPercent: 0.09, attackPercent: 0.04, controlImmune: 0.03},
  "Starry Emerald": {hpPercent: 0.03, attackPercent: 0.03, controlImmune: 0.02},
  "Starry Emerald +1": {hpPercent: 0.04, attackPercent: 0.03, controlImmune: 0.02},
  "Starry Emerald +2": {hpPercent: 0.05, attackPercent: 0.03, controlImmune: 0.02},
  "Starry Emerald +3": {hpPercent: 0.06, attackPercent: 0.04, controlImmune: 0.03},
  "Starry Emerald +4": {hpPercent: 0.07, attackPercent: 0.04, controlImmune: 0.03},
  "Starry Emerald +5": {hpPercent: 0.08, attackPercent: 0.05, controlImmune: 0.03},
  "Starry Emerald +6": {hpPercent: 0.09, attackPercent: 0.05, controlImmune: 0.04},
  "Starry Emerald +7": {hpPercent: 0.1, attackPercent: 0.06, controlImmune: 0.04},
  "Azure Sapphire": {hpPercent: 0.04, attackPercent: 0.04, controlImmune: 0.02},
  "Azure Sapphire +1": {hpPercent: 0.05, attackPercent: 0.04, controlImmune: 0.02},
  "Azure Sapphire +2": {hpPercent: 0.06, attackPercent: 0.04, controlImmune: 0.02},
  "Azure Sapphire +3": {hpPercent: 0.07, attackPercent: 0.05, controlImmune: 0.03},
  "Azure Sapphire +4": {hpPercent: 0.08, attackPercent: 0.05, controlImmune: 0.03},
  "Azure Sapphire +5": {hpPercent: 0.09, attackPercent: 0.06, controlImmune: 0.03},
  "Azure Sapphire +6": {hpPercent: 0.1, attackPercent: 0.06, controlImmune: 0.04},
  "Azure Sapphire +7": {hpPercent: 0.11, attackPercent: 0.07, controlImmune: 0.04},
  "Azure Sapphire +8": {hpPercent: 0.12, attackPercent: 0.07, controlImmune: 0.04},
  "Royal Amethyst": {hpPercent: 0.05, attackPercent: 0.05, controlImmune: 0.03},
  "Royal Amethyst +1": {hpPercent: 0.06, attackPercent: 0.05, controlImmune: 0.03},
  "Royal Amethyst +2": {hpPercent: 0.07, attackPercent: 0.05, controlImmune: 0.03},
  "Royal Amethyst +3": {hpPercent: 0.08, attackPercent: 0.06, controlImmune: 0.04},
  "Royal Amethyst +4": {hpPercent: 0.09, attackPercent: 0.06, controlImmune: 0.04},
  "Royal Amethyst +5": {hpPercent: 0.1, attackPercent: 0.07, controlImmune: 0.04},
  "Royal Amethyst +6": {hpPercent: 0.11, attackPercent: 0.07, controlImmune: 0.05},
  "Royal Amethyst +7": {hpPercent: 0.12, attackPercent: 0.08, controlImmune: 0.05},
  "Royal Amethyst +8": {hpPercent: 0.13, attackPercent: 0.08, controlImmune: 0.05},
  "Royal Amethyst +9": {hpPercent: 0.14, attackPercent: 0.09, controlImmune: 0.06},
  "IDA Overseer": {hpPercent: 0.08, attackPercent: 0.03},
  "IDA Overseer +1": {hpPercent: 0.09, attackPercent: 0.03},
  "IDA Overseer +2": {hpPercent: 0.1, attackPercent: 0.03},
  "IDA Overseer +3": {hpPercent: 0.11, attackPercent: 0.04},
  "IDA Overseer +4": {hpPercent: 0.12, attackPercent: 0.04},
  "IDA Overseer +5": {hpPercent: 0.13, attackPercent: 0.05},
  "IDA Overseer +6": {hpPercent: 0.14, attackPercent: 0.05},
  "IDA Overseer +7": {hpPercent: 0.15, attackPercent: 0.06},
  "IDA Overseer +8": {hpPercent: 0.16, attackPercent: 0.06},
  "IDA Overseer +9": {hpPercent: 0.17, attackPercent: 0.07},
  "IDA Maverick": {hpPercent: 0.1, attackPercent: 0.03},
  "IDA Maverick +1": {hpPercent: 0.11, attackPercent: 0.03},
  "IDA Maverick +2": {hpPercent: 0.12, attackPercent: 0.03},
  "IDA Maverick +3": {hpPercent: 0.13, attackPercent: 0.04},
  "IDA Maverick +4": {hpPercent: 0.14, attackPercent: 0.04},
  "IDA Maverick +5": {hpPercent: 0.15, attackPercent: 0.05},
  "IDA Maverick +6": {hpPercent: 0.16, attackPercent: 0.05},
  "IDA Maverick +7": {hpPercent: 0.17, attackPercent: 0.06},
  "IDA Maverick +8": {hpPercent: 0.18, attackPercent: 0.06},
  "IDA Maverick +9": {hpPercent: 0.2, attackPercent: 0.07},
  "IDA Top 32": {hpPercent: 0.12, attackPercent: 0.03},
  "IDA Top 32 +1": {hpPercent: 0.13, attackPercent: 0.03},
  "IDA Top 32 +2": {hpPercent: 0.14, attackPercent: 0.03},
  "IDA Top 32 +3": {hpPercent: 0.15, attackPercent: 0.04},
  "IDA Top 32 +4": {hpPercent: 0.16, attackPercent: 0.04},
  "IDA Top 32 +5": {hpPercent: 0.17, attackPercent: 0.05},
  "IDA Top 32 +6": {hpPercent: 0.18, attackPercent: 0.05},
  "IDA Top 32 +7": {hpPercent: 0.19, attackPercent: 0.06},
  "IDA Top 32 +8": {hpPercent: 0.2, attackPercent: 0.06},
  "IDA Top 32 +9": {hpPercent: 0.22, attackPercent: 0.07},
  "IDA Top 8": {hpPercent: 0.13, attackPercent: 0.03},
  "IDA Top 8 +1": {hpPercent: 0.14, attackPercent: 0.03},
  "IDA Top 8 +2": {hpPercent: 0.15, attackPercent: 0.03},
  "IDA Top 8 +3": {hpPercent: 0.16, attackPercent: 0.04},
  "IDA Top 8 +4": {hpPercent: 0.17, attackPercent: 0.04},
  "IDA Top 8 +5": {hpPercent: 0.18, attackPercent: 0.05},
  "IDA Top 8 +6": {hpPercent: 0.19, attackPercent: 0.05},
  "IDA Top 8 +7": {hpPercent: 0.2, attackPercent: 0.06},
  "IDA Top 8 +8": {hpPercent: 0.21, attackPercent: 0.06},
  "IDA Top 8 +9": {hpPercent: 0.23, attackPercent: 0.07},
  "IDA 2nd Place": {hpPercent: 0.14, attackPercent: 0.03},
  "IDA 2nd Place +1": {hpPercent: 0.15, attackPercent: 0.03},
  "IDA 2nd Place +2": {hpPercent: 0.16, attackPercent: 0.03},
  "IDA 2nd Place +3": {hpPercent: 0.17, attackPercent: 0.04},
  "IDA 2nd Place +4": {hpPercent: 0.18, attackPercent: 0.04},
  "IDA 2nd Place +5": {hpPercent: 0.19, attackPercent: 0.05},
  "IDA 2nd Place +6": {hpPercent: 0.2, attackPercent: 0.05},
  "IDA 2nd Place +7": {hpPercent: 0.21, attackPercent: 0.06},
  "IDA 2nd Place +8": {hpPercent: 0.22, attackPercent: 0.06},
  "IDA 2nd Place +9": {hpPercent: 0.24, attackPercent: 0.07},
  "IDA Champion": {hpPercent: 0.15, attackPercent: 0.04},
  "IDA Champion +1": {hpPercent: 0.16, attackPercent: 0.04},
  "IDA Champion +2": {hpPercent: 0.17, attackPercent: 0.04},
  "IDA Champion +3": {hpPercent: 0.18, attackPercent: 0.05},
  "IDA Champion +4": {hpPercent: 0.19, attackPercent: 0.05},
  "IDA Champion +5": {hpPercent: 0.2, attackPercent: 0.06},
  "IDA Champion +6": {hpPercent: 0.21, attackPercent: 0.06},
  "IDA Champion +7": {hpPercent: 0.22, attackPercent: 0.07},
  "IDA Champion +8": {hpPercent: 0.23, attackPercent: 0.07},
  "IDA Champion +9": {hpPercent: 0.25, attackPercent: 0.08},
  "Black Gold": {hpPercent: 0.05, attackPercent: 0.05},
  "Black Gold +1": {hpPercent: 0.06, attackPercent: 0.05},
  "Black Gold +2": {hpPercent: 0.07, attackPercent: 0.05},
  "Black Gold +3": {hpPercent: 0.08, attackPercent: 0.06},
  "Black Gold +4": {hpPercent: 0.09, attackPercent: 0.06},
  "Black Gold +5": {hpPercent: 0.1, attackPercent: 0.06},
  "Black Gold +6": {hpPercent: 0.11, attackPercent: 0.07},
  "Black Gold +7": {hpPercent: 0.12, attackPercent: 0.07},
  "Black Gold +8": {hpPercent: 0.13, attackPercent: 0.07},
  "Black Gold +9": {hpPercent: 0.14, attackPercent: 0.08}
};

/* End of avatarFrame.js */


/* Start of equipment.js */

var weapons = {
  "None": {
    set: "",
    stats: {},
    limit: "",
    limitStats: {}
  },
  
  "Warrior's Epee": {
    set: "",
    stats: {attack: 3704, attackPercent: 0.07},
    limit: "Warrior",
    limitStats: {attackPercent: 0.06, block: 0.1}
  },
  
  "Weaver's Staff": {
    set: "",
    stats: {attack: 3704, attackPercent: 0.07},
    limit: "Mage",
    limitStats: {attackPercent: 0.06, crit: 0.05}
  },
  
  "Minstrel's Bow": {
    set: "",
    stats: {attack: 3704, attackPercent: 0.07},
    limit: "Ranger",
    limitStats: {attackPercent: 0.06, crit: 0.05}
  },
  
  "Assassin's Blade": {
    set: "",
    stats: {attack: 3704, attackPercent: 0.07},
    limit: "Assassin",
    limitStats: {attackPercent: 0.06, crit: 0.05}
  },
  
  "Oracle's Staff": {
    set: "",
    stats: {attack: 3704, attackPercent: 0.07},
    limit: "Priest",
    limitStats: {attackPercent: 0.06, attackPercent2: 0.05}
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
  }
};


var armors = {
  "None": {
    set: "",
    stats: {},
    limit: "",
    limitStats: {}
  },
  
  "Warrior's Armor": {
    set: "",
    stats: {hp: 52449, hpPercent: 0.07},
    limit: "Warrior",
    limitStats: {hpPercent: 0.06, damageReduce: 0.05}
  },
  
  "Weaver's Robe": {
    set: "",
    stats: {hp: 52449, hpPercent: 0.07},
    limit: "Mage",
    limitStats: {hpPercent: 0.06, precision: 0.1}
  },
  
  "Minstrel's Cape": {
    set: "",
    stats: {hp: 52449, hpPercent: 0.07},
    limit: "Ranger",
    limitStats: {hpPercent: 0.06, block: 0.05}
  },
  
  "Assassin's Cape": {
    set: "",
    stats: {hp: 52449, hpPercent: 0.07},
    limit: "Assassin",
    limitStats: {hpPercent: 0.06, armorBreak: 0.1}
  },
  
  "Oracle's Cape": {
    set: "",
    stats: {hp: 52449, hpPercent: 0.07},
    limit: "Priest",
    limitStats: {hpPercent: 0.06, damageReduce: 0.05}
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
  }
};


var shoes = {
  "None": {
    set: "",
    stats: {},
    limit: "",
    limitStats: {}
  },
  
  "Warrior's Boots": {
    set: "",
    stats: {hp: 32367, hpPercent: 0.07},
    limit: "Warrior",
    limitStats: {hpPercent: 0.06, speed: 20}
  },
  
  "Weaver's Boots": {
    set: "",
    stats: {hp: 32367, hpPercent: 0.07},
    limit: "Mage",
    limitStats: {hpPercent: 0.06, speed: 20}
  },
  
  "Minstrel's Boots": {
    set: "",
    stats: {hp: 32367, hpPercent: 0.07},
    limit: "Ranger",
    limitStats: {hpPercent: 0.06, speed: 20}
  },
  
  "Assassin's Boots": {
    set: "",
    stats: {hp: 32367, hpPercent: 0.07},
    limit: "Assassin",
    limitStats: {hpPercent: 0.06, speed: 20}
  },
  
  "Oracle's Boots": {
    set: "",
    stats: {hp: 32367, hpPercent: 0.07},
    limit: "Priest",
    limitStats: {hpPercent: 0.06, speed: 20}
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
  }
};


var accessories = {
  "None": {
    set: "",
    stats: {},
    limit: "",
    limitStats: {}
  },
  
  "Warrior's Necklace": {
    set: "",
    stats: {attack: 2469, attackPercent: 0.07},
    limit: "Warrior",
    limitStats: {attackPercent: 0.06, controlImmune: 0.05}
  },
  
  "Weaver's Necklace": {
    set: "",
    stats: {attack: 2469, attackPercent: 0.07},
    limit: "Mage",
    limitStats: {attackPercent: 0.06, skillDamage: 0.1}
  },
  
  "Minstrel's Ring": {
    set: "",
    stats: {attack: 2469, attackPercent: 0.07},
    limit: "Ranger",
    limitStats: {attackPercent: 0.06, damageReduce: 0.05}
  },
  
  "Assassin's Ring": {
    set: "",
    stats: {attack: 2469, attackPercent: 0.07},
    limit: "Assassin",
    limitStats: {attackPercent: 0.06, critDamage: 0.05}
  },
  
  "Ring of the Oracle": {
    set: "",
    stats: {attack: 2469, attackPercent: 0.07},
    limit: "Priest",
    limitStats: {attackPercent: 0.06, hpPercent: 0.05}
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


// for mass testing
var classGearMapping = {
  "Warrior": {
    weapon: "Warrior's Epee",
    armor: "Warrior's Armor",
    shoe: "Warrior's Boots",
    accessory: "Warrior's Necklace"
  },
  
  "Mage": {
    weapon: "Weaver's Staff",
    armor: "Weaver's Robe",
    shoe: "Weaver's Boots",
    accessory: "Weaver's Necklace"
  },
  
  "Ranger": {
    weapon: "Minstrel's Bow",
    armor: "Minstrel's Cape",
    shoe: "Minstrel's Boots",
    accessory: "Minstrel's Ring"
  },
  
  "Assassin": {
    weapon: "Assassin's Blade",
    armor: "Assassin's Cape",
    shoe: "Assassin's Boots",
    accessory: "Assassin's Ring"
  },
  
  "Priest": {
    weapon: "Oracle's Staff",
    armor: "Oracle's Cape",
    shoe: "Oracle's Boots",
    accessory: "Ring of the Oracle"
  }
};

/* End of equipment.js */


/* Start of guildTech.js */

var guildTech = {
  "Warrior": {
    hpPercent: {hpPercent: 0.005},
    attackPercent: {attackPercent: 0.005},
    crit: {crit: 0.005},
    block: {block: 0.005},
    skillDamage: {skillDamage: 0.01},
    speed: {speed: 4},
    constitution: {hpPercent: 0.01, attackPercent: 0.01},
    mind: {hpPercent: 0.01, skillDamage: 0.01},
    antiMage: {mageReduce: 0.01},
    antiRanger: {rangerReduce: 0.01},
    antiAssassin: {assassinReduce: 0.01},
    antiPriest: {priestReduce: 0.01},
    heartOfCrystal: {"Seal of LightImmune": 0.01, ShapeshiftImmune: 0.01},
    immortalRoar: {TauntImmune: 0.01, DazzleImmune: 0.01},
    spellOfAgility: {petrifyImmune: 0.01, twineImmune: 0.01, HorrifyImmune: 0.01},
    blessingOfPurification: {stunImmune: 0.01, freezeImmune: 0.01, SilenceImmune: 0.01}
  },
  "Mage": {
    hpPercent: {hpPercent: 0.005},
    attackPercent: {attackPercent: 0.005},
    crit: {crit: 0.005},
    precision: {precision: 0.005},
    skillDamage: {skillDamage: 0.01},
    speed: {speed: 4},
    constitution: {hpPercent: 0.01, attackPercent: 0.01},
    mind: {hpPercent: 0.01, skillDamage: 0.01},
    antiWarrior: {warriorReduce: 0.01},
    antiRanger: {rangerReduce: 0.01},
    antiAssassin: {assassinReduce: 0.01},
    antiPriest: {priestReduce: 0.01},
    heartOfCrystal: {"Seal of LightImmune": 0.01, ShapeshiftImmune: 0.01},
    immortalRoar: {TauntImmune: 0.01, DazzleImmune: 0.01},
    spellOfAgility: {petrifyImmune: 0.01, twineImmune: 0.01, HorrifyImmune: 0.01},
    blessingOfPurification: {stunImmune: 0.01, freezeImmune: 0.01, SilenceImmune: 0.01}
  },
  "Ranger": {
    hpPercent: {hpPercent: 0.005},
    attackPercent: {attackPercent: 0.005},
    block: {block: 0.005},
    precision: {precision: 0.005},
    skillDamage: {skillDamage: 0.01},
    speed: {speed: 4},
    constitution: {hpPercent: 0.01, attackPercent: 0.01},
    mind: {hpPercent: 0.01, skillDamage: 0.01},
    antiWarrior: {warriorReduce: 0.01},
    antiMage: {mageReduce: 0.01},
    antiAssassin: {assassinReduce: 0.01},
    antiPriest: {priestReduce: 0.01},
    heartOfCrystal: {"Seal of LightImmune": 0.01, ShapeshiftImmune: 0.01},
    immortalRoar: {TauntImmune: 0.01, DazzleImmune: 0.01},
    spellOfAgility: {petrifyImmune: 0.01, twineImmune: 0.01, HorrifyImmune: 0.01},
    blessingOfPurification: {stunImmune: 0.01, freezeImmune: 0.01, SilenceImmune: 0.01}
  },
  "Assassin": {
    hpPercent: {hpPercent: 0.005},
    critDamage: {critDamage: 0.005},
    crit: {crit: 0.005},
    armorBreak: {armorBreak: 0.005},
    skillDamage: {skillDamage: 0.01},
    speed: {speed: 4},
    constitution: {hpPercent: 0.01, attackPercent: 0.01},
    mind: {hpPercent: 0.01, skillDamage: 0.01},
    antiWarrior: {warriorReduce: 0.01},
    antiMage: {mageReduce: 0.01},
    antiRanger: {rangerReduce: 0.01},
    antiPriest: {priestReduce: 0.01},
    heartOfCrystal: {"Seal of LightImmune": 0.01, ShapeshiftImmune: 0.01},
    immortalRoar: {TauntImmune: 0.01, DazzleImmune: 0.01},
    spellOfAgility: {petrifyImmune: 0.01, twineImmune: 0.01, HorrifyImmune: 0.01},
    blessingOfPurification: {stunImmune: 0.01, freezeImmune: 0.01, SilenceImmune: 0.01}
  },
  "Priest": {
    hpPercent: {hpPercent: 0.005},
    block: {block: 0.005},
    crit: {crit: 0.005},
    speed: {speed: 2},
    skillDamage: {skillDamage: 0.01},
    speed2: {speed: 1, attackPercent: 0.005},
    constitution: {hpPercent: 0.01, attackPercent: 0.01},
    mind: {hpPercent: 0.01, skillDamage: 0.01},
    antiWarrior: {warriorReduce: 0.01},
    antiMage: {mageReduce: 0.01},
    antiRanger: {rangerReduce: 0.01},
    antiAssassin: {assassinReduce: 0.01},
    heartOfCrystal: {"Seal of LightImmune": 0.01, ShapeshiftImmune: 0.01},
    immortalRoar: {TauntImmune: 0.01, DazzleImmune: 0.01},
    spellOfAgility: {petrifyImmune: 0.01, twineImmune: 0.01, HorrifyImmune: 0.01},
    blessingOfPurification: {stunImmune: 0.01, freezeImmune: 0.01, SilenceImmune: 0.01}
  }
};

/* End of guildTech.js */


/* Start of skin.js */

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
    "Legendary Little Red Riding Hood": {hpPercent: 0.06, attackPercent: 0.06, damageReduce: 0.04},
    "Princess Carrie": {hpPercent: 0.03, damageReduce: 0.03, speed: 4},
    "Legendary Princess Carrie": {hpPercent: 0.06, damageReduce: 0.05, speed: 6}
  },
  
  "Cthugha": {
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
  
  "Faith Blade": {
    "Apocalypse Armor": {holyDamage: 0.05, crit: 0.02, critDamage: 0.05},
    "Legendary Apocalypse Armor": {holyDamage: 0.08, crit: 0.03, critDamage: 0.075},
    "Chaos Messenger": {holyDamage: 0.05, crit: 0.02}
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
    "Football Babe": {hpPercent: 0.03, attackPercent: 0.03, crit: 0.02},
    "Legendary Football Babe": {hpPercent: 0.06, attackPercent: 0.06, crit: 0.03}
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
  
  "Sherlock": {
    "Royal Guard": {hpPercent: 0.05, attackPercent: 0.03, speed: 4},
    "Legendary Royal Guard": {hpPercent: 0.08, attackPercent: 0.06, speed: 6}
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
  },
  
  "Asmodel": {
    "King of War": {hpPercent: 0.03, attackPercent: 0.02},
    "Frozen Heart": {attackPercent: 0.02, crit: 0.02, critDamage: 0.05},
    "Legendary Frozen Heart": {attackPercent: 0.04, crit: 0.03, critDamage: 0.10}
  },
  
  "Drake": {
    "Skin Placeholder": {},
    "Legendary Skin Placeholder": {}
  },
  
  "Russell": {
    "The Light Enforcer": {attackPercent: 0.03, holyDamage: 0.06, speed: 4},
    "Legendary The Light Enforcer": {attackPercent: 0.06, holyDamage: 0.10, speed: 6}
  },
  
  "Valkryie": {
    "Christmas Elf": {hpPercent: 0.05},
    "Combat Symphony": {hpPercent: 0.05, hpPercent2: 0.03, damageReduce: 0.03},
    "Legendary Combat Symphony": {hpPercent: 0.08, hpPercent2: 0.06, damageReduce: 0.04},
    "Jungle Hunter": {hpPercent: 0.05, crit: 0.02},
    "Legendary Jungle Hunter": {hpPercent: 0.08, crit: 0.03},
    "Spear of Trial": {hpPercent: 0.05, damageReduce: 0.03, block: 0.04},
    "Legendary Spear of Trial": {hpPercent: 0.08, damageReduce: 0.04, block: 0.06}
  },
  
  "Ormus": {
    "Dr. Ormus": {hpPercent: 0.02, attackPercent: 0.03},
    "Headmaster of Magic Academy": {controlImmune: 0.05, attackPercent: 0.03, healEffect: 0.05},
    "Legendary Headmaster of Magic Academy": {controlImmune: 0.06, attackPercent: 0.06, healEffect: 0.08}
  },
  
  "Rogan": {
    "Skin Placeholder": {},
    "Legendary Skin Placeholder": {}
  },
  
  "Gerke": {
    "Doomsday Angel": {hpPercent: 0.03, attackPercent: 0.02, holyDamage: 0.05},
    "Legendary Doomsday Angel": {hpPercent: 0.06, attackPercent: 0.04, holyDamage: 0.08}
  },
  
  "Sleepless": {
    "Shapeshifter": {hpPercent: 0.05},
    "Legendary Shapeshifter Placeholder": {hpPercent: 0.05}
  },
  
  "Das Moge": {
    "Black Warrior": {hpPercent: 0.03,  skillDamage: 0.03},
    "Radiation": {attackPercent: 0.02, damageReduce: 0.03, skillDamage: 0.10},
    "Legendary Radiation": {attackPercent: 0.04, damageReduce: 0.04, skillDamage: 0.15}
  }
};

/* End of skin.js */


/* Start of stone.js */

var stones = {
  "None": {},
  "S3 Attack, Attack": {attack: 4000, attackPercent: 0.37},
  "S3 Attack, Attack, Armor Break": {attack: 1550, attackPercent: 0.24, armorBreak: 0.5},
  "S3 Attack, Attack, Holy": {attack: 1550, attackPercent: 0.24, holyDamage: 0.36},
  "S3 Attack, Attack, Precision": {attack: 1550, attackPercent: 0.24, precision: 0.24},
  "S3 Attack, Attack, Skill": {attack: 1550, attackPercent: 0.24, skillDamage: 0.8},
  "S3 Attack, Block": {attackPercent: 0.28, block: 0.28},
  "S3 Crit, Armor Break": {crit: 0.23, armorBreak: 0.5},
  "S3 Crit, Crit, Attack": {attackPercent: 0.1, crit: 0.23, critDamage: 0.55},
  "S3 Crit, Precision": {precision: 0.23, crit: 0.23},
  "S3 HP, Attack": {hpPercent: 0.33, attackPercent: 0.26},
  "S3 HP, Attack, Holy": {hpPercent: 0.28, attack: 1550, holyDamage: 0.36},
  "S3 HP, Block": {hpPercent: 0.35, block: 0.28},
  "S3 HP, Crit": {hpPercent: 0.33, crit: 0.23},
  "S3 HP, Heal": {hpPercent: 0.33, effectBeingHealed: 0.29},
  "S3 HP, Heal, Attack": {hpPercent: 0.28, attack: 1550, healEffect: 0.29},
  "S3 HP, HP": {hp: 25000, hpPercent: 0.46},
  "S3 HP, Precision": {hpPercent: 0.33, precision: 0.24},
  "S3 Skill, Holy": {skillDamage: 0.8, holyDamage: 0.36},
  "S3 Skill, Precision": {skillDamage: 0.8, precision: 0.23},
  "S3 Speed, Attack": {attackPercent: 0.26, speed: 115},
  "S3 Speed, Crit": {speed: 115, crit: 0.23},
  "S3 Speed, Heal": {speed: 115, healEffect: 0.29},
  "S3 Speed, HP": {hpPercent: 0.32, speed: 115},
  "S3 Speed, Precision": {speed: 115, precision: 0.23}
};

/* End of stone.js */


/* Start of baseMonsterStats.js */

var baseMonsterStats = {
  "None": {
    className: monster,
    stats: {}
  },
  
  "Deer": {
    className: mDyne,
    stats: {
      attack: 9604,
      hp: 231805,
      armorPercent: 0.20,
      block: 0.15,
      speed: 220,
      fixedAttack: 91238,
      fixedHP: 3477075
    }
  },
  
  "Dragon": {
    className: mNiederhog,
    stats: {
      attack: 10547,
      hp: 211085,
      critDamage: 0.20,
      crit: 0.10,
      speed: 220,
      fixedAttack: 100196,
      fixedHP: 3166275
    }
  },
  
  "Fox": {
    className: mFox,
    stats: {
      attack: 10890,
      hp: 204610,
      skillDamage: 0.20,
      precision: 0.10,
      speed: 220,
      fixedAttack: 103455,
      fixedHP: 3069150
    }
  },
  
  "Ice Golem": {
    className: mIceGolem,
    stats: {
      attack: 11062,
      hp: 202020,
      holyDamage: 0.20,
      precision: 0.10,
      speed: 220,
      fixedAttack: 105089,
      fixedHP: 3030300
    }
  },
  
  "Phoenix": {
    className: mPhoenix,
    stats: {
      attack: 10377,
      hp: 201409,
      critDamage: 0.20,
      holyDamage: 0.20,
      speed: 220,
      fixedAttack: 98581,
      fixedHP: 3234270
    }
  },
  
  "Snake": {
    className: mJormangund,
    stats: {
      attack: 11149,
      hp: 199430,
      skillDamage: 0.20,
      block: 0.15,
      speed: 220,
      fixedAttack: 105915,
      fixedHP: 2991450
    }
  },
  
  "Sphinx": {
    className: mSphinx,
    stats: {
      attack: 10033,
      hp: 221445,
      precision: 0.10,
      holyDamage: 0.20,
      speed: 220,
      fixedAttack: 95313,
      fixedHP: 3321675
    }
  },
  
  "Stone Golem": {
    className: mStoneGolem,
    stats: {
      attack: 10719,
      hp: 207200,
      precision: 0.10,
      armorPercent: 0.20,
      speed: 220,
      fixedAttack: 101830,
      fixedHP: 3108000
    }
  },
  
  "Wolf": {
    className: mFenlier,
    stats: {
      attack: 11405,
      hp: 195545,
      armorBreak: 0.20,
      precision: 0.10,
      speed: 220,
      fixedAttack: 108347,
      fixedHP: 2933175
    }
  }
};

/* End of baseMonsterStats.js */


/* Start of baseHeroStats.js */

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
  
  "Asmodel": {
    className: Asmodel,
    heroFaction: "Light",
    heroClass: "Warrior",
    stats: {
      baseHP: 9357,
      baseAttack: 332,
      baseArmor: 62,
      baseSpeed: 235,
      growHP: 935.7,
      growAttack: 33,
      growArmor: 6.2,
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
      growArmor: 6.3,
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
  
  "Cthugha": {
    className: Cthugha,
    heroFaction: "Abyss",
    heroClass: "Ranger",
    stats: {
      baseHP: 7486,
      baseAttack: 447,
      baseArmor: 63,
      baseSpeed: 218,
      growHP: 748.6,
      growAttack: 44.7,
      growArmor: 6.3,
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
  
  "Das Moge": {
    className: DasMoge,
    heroFaction: "Dark",
    heroClass: "Ranger",
    stats: {
      baseHP: 7395,
      baseAttack: 343,
      baseArmor: 60,
      baseSpeed: 218,
      growHP: 739.5,
      growAttack: 34.3,
      growArmor: 6,
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
  
  "Drake": {
    className: Drake,
    heroFaction: "Dark",
    heroClass: "Assassin",
    stats: {
      baseHP: 10137,
      baseAttack: 343,
      baseArmor: 60,
      baseSpeed: 235,
      growHP: 1013.7,
      growAttack: 34.3,
      growArmor: 6,
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
  
  "Emily": {
    className: Emily,
    heroFaction: "Fortress",
    heroClass: "Priest",
    stats: {
      baseHP: 7005,
      baseAttack: 356,
      baseArmor: 63,
      baseSpeed: 195,
      growHP: 700.5,
      growAttack: 36,
      growArmor: 6.3,
      growSpeed: 2
    }
  },
  
  "Faith Blade": {
    className: FaithBlade,
    heroFaction: "Light",
    heroClass: "Assassin",
    stats: {
      baseHP: 9147,
      baseAttack: 507,
      baseArmor: 60,
      baseSpeed: 235,
      growHP: 914.7,
      growAttack: 50.4,
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
  
  "Gerke": {
    className: Gerke,
    heroFaction: "Light",
    heroClass: "Priest",
    stats: {
      baseHP: 8592,
      baseAttack: 329,
      baseArmor: 60,
      baseSpeed: 195,
      growHP: 859.2,
      growAttack: 33,
      growArmor: 6,
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
  
  "Kroos": {
    className: Kroos,
    heroFaction: "Abyss",
    heroClass: "Priest",
    stats: {
      baseHP: 7587,
      baseAttack: 433,
      baseArmor: 63,
      baseSpeed: 195,
      growHP: 758.7,
      growAttack: 43.3,
      growArmor: 6.3,
      growSpeed: 2
    }
  },
  
  "Michelle": {
    className: Michelle,
    heroFaction: "Light",
    heroClass: "Ranger",
    stats: {
      baseHP: 8287,
      baseAttack: 343,
      baseArmor: 60,
      baseSpeed: 220,
      growHP: 828.7,
      growAttack: 34.3,
      growArmor: 6,
      growSpeed: 2
    }
  },
  
  "Mihm": {
    className: Mihm,
    heroFaction: "Dark",
    heroClass: "Mage",
    stats: {
      baseHP: 7134,
      baseAttack: 402,
      baseArmor: 58,
      baseSpeed: 226,
      growHP: 713.4,
      growAttack: 40.2,
      growArmor: 5.8,
      growSpeed: 2
    }
  },
  
  "Nakia": {
    className: Nakia,
    heroFaction: "Abyss",
    heroClass: "Assassin",
    stats: {
      baseHP: 8473,
      baseAttack: 456,
      baseArmor: 61,
      baseSpeed: 245,
      growHP: 847.3,
      growAttack: 45.6,
      growArmor: 6.1,
      growSpeed: 2
    }
  },
  
  "Oberon": {
    className: Oberon,
    heroFaction: "Forest",
    heroClass: "Mage",
    stats: {
      baseHP: 6980,
      baseAttack: 410,
      baseArmor: 61,
      baseSpeed: 220,
      growHP: 698,
      growAttack: 41,
      growArmor: 6.1,
      growSpeed: 2
    }
  },
  
  "Ormus": {
    className: Ormus,
    heroFaction: "Fortress",
    heroClass: "Priest",
    stats: {
      baseHP: 6325,
      baseAttack: 369,
      baseArmor: 63,
      baseSpeed: 195,
      growHP: 632.5,
      growAttack: 37,
      growArmor: 6.3,
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
  
  "Rogan": {
    className: Rogan,
    heroFaction: "Forest",
    heroClass: "Assassin",
    stats: {
      baseHP: 7057,
      baseAttack: 354,
      baseArmor: 60,
      baseSpeed: 235,
      growHP: 705.7,
      growAttack: 35.4,
      growArmor: 6,
      growSpeed: 2
    }
  },
  
  "Russell": {
    className: Russell,
    heroFaction: "Light",
    heroClass: "Ranger",
    stats: {
      baseHP: 9010,
      baseAttack: 338,
      baseArmor: 61,
      baseSpeed: 226,
      growHP: 901,
      growAttack: 34,
      growArmor: 6.3,
      growSpeed: 2
    }
  },
  
  "Sherlock": {
    className: Sherlock,
    heroFaction: "Fortress",
    heroClass: "Mage",
    stats: {
      baseHP: 7980,
      baseAttack: 425,
      baseArmor: 60,
      baseSpeed: 220,
      growHP: 798,
      growAttack: 42.5,
      growArmor: 6,
      growSpeed: 2
    }
  },
  
  "Sleepless": {
    className: Sleepless,
    heroFaction: "Dark",
    heroClass: "Warrior",
    stats: {
      baseHP: 9980,
      baseAttack: 338,
      baseArmor: 61,
      baseSpeed: 227,
      growHP: 998,
      growAttack: 34,
      growArmor: 6.1,
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
      growArmor: 6.3,
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
  },
  
  "Valkryie": {
    className: Valkryie,
    heroFaction: "Forest",
    heroClass: "Ranger",
    stats: {
      baseHP: 7937,
      baseAttack: 357,
      baseArmor: 60,
      baseSpeed: 219,
      growHP: 793.7,
      growAttack: 35.7,
      growArmor: 6,
      growSpeed: 2
    }
  }
};

/* End of baseHeroStats.js */


/* Start of utilityFunctions.js */
function formatNum(num) {
  return "<span class ='num'>" + num + "</span>";
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
    "damageAgainstPoisoned", "damageAgainstFrozen", "dodge", "controlImmunePen",
    "warriorReduce", "mageReduce", "rangerReduce", "assassinReduce", "priestReduce",
    "freezeImmune", "petrifyImmune", "stunImmune", "twineImmune", "Seal of LightImmune",
    "ShapeshiftImmune", "TauntImmune", "DazzleImmune", "HorrifyImmune", "SilenceImmune",
    "damageAgainstWarrior", "damageAgainstMage", "damageAgainstRanger", "damageAgainstAssassin",
    "damageAgainstPriest"
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
  "hpPercent2": "HP Percent Multiplier",
  "attackPercent": "Attack Percent Multiplier",
  "attackPercent2": "Attack Percent Multiplier",
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
  "SilenceImmune": "Chance to Resist Silence",
  "damageDealt": "Damage Dealt",
  "damageHealed": "Damage Healed or Prevented",
  "energySnapshot": "Amount of Energy on Active",
  "demonTotemStacks": "Demon Totem Stacks",
  "heartOfOrmusTriggered": "Heart of Ormus Triggered"
};

/* End of utilityFunctions.js */


/* Start of simulation.js */

var basicQueue = [];
var activeQueue = [];
var triggerQueue = [];
var logColor = 0;
var roundNum = 0;

function runSim(attMonsterName, defMonsterName, numSims) {
  //var oCombatLog = document.getElementById("combatLog");
  //var numSims = document.getElementById("numSims").value;
  var winCount = 0;
  var orderOfAttack = [];
  var numOfHeroes = 0;
  var result = {};
  var monsterResult = "";
  var someoneWon = "";
  var endingRoundSum = 0;
  var endRoundDesc = "";
  var numLiving = 0;
  var tempTrigger;
  var currentHero;
  
  //var attMonsterName = document.getElementById("attMonster").value;
  var attMonster = new baseMonsterStats[attMonsterName]["className"](attMonsterName, "att");
  
  //var defMonsterName = document.getElementById("defMonster").value;
  var defMonster = new baseMonsterStats[defMonsterName]["className"](defMonsterName, "def");
  
  //var domSeed = document.getElementById("domSeed");
  random = Math.random;
  
  logColor = 0;
  //oCombatLog.innerHTML = "";
  
  for (var i = 0; i < attHeroes.length; i++) {
    attHeroes[i]._damageDealt = 0;
    attHeroes[i]._damageHealed = 0;
  }
  
  for (var i = 0; i < defHeroes.length; i++) {
    defHeroes[i]._damageDealt = 0;
    defHeroes[i]._damageHealed = 0;
  }
  
  for (var simIterNum = 1; simIterNum <= numSims; simIterNum++) {
    // @ start of single simulation
    
    //if(numSims == 1) {oCombatLog.innerHTML += "<p class ='logSeg'>Simulation #" + formatNum(simIterNum) +" Started.</p>"};
    someoneWon = "";
    uniqID = 0;
    attMonster._energy = 0;
    defMonster._energy = 0;
    
    // snapshot stats as they are
    numOfHeroes = attHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (attHeroes[i]._heroName != "None") {
        attHeroes[i].snapshotStats();
        attHeroes[i]._buffs = {};
        attHeroes[i]._debuffs = {};
      }
    }
    
    numOfHeroes = defHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (defHeroes[i]._heroName != "None") {
        defHeroes[i].snapshotStats();
        defHeroes[i]._buffs = {};
        defHeroes[i]._debuffs = {};
      }
    }
    
    // trigger start of battle abilities
    for (var h in attHeroes) {
      if ((attHeroes[h].isNotSealed() && attHeroes[h]._currentStats["totalHP"] > 0) || attHeroes[h]._currentStats["revive"] == 1) {
        temp = attHeroes[h].startOfBattle();
        //if(numSims == 1 && temp.length > 0) {oCombatLog.innerHTML += "<div class='log" + logColor + "'><p></p></div><div class='log" + logColor + "'>" + temp + "</div>";}
        logColor = (logColor + 1) % 2;
      }
    }
    
    for (var h in defHeroes) {
      if (defHeroes[h].isNotSealed() && defHeroes[h]._currentStats["totalHP"] > 0) {
        temp = defHeroes[h].startOfBattle();
        //if(numSims == 1 && temp.length > 0) {oCombatLog.innerHTML += "<div class='log" + logColor + "'><p></p></div><div class='log" + logColor + "'>" + temp + "</div>";}
        logColor = (logColor + 1) % 2;
      }
    }
    
    roundNum = 1;
    while (true) {
      // @ start of round
      
      // Output detailed combat log only if running a single simulation
      //if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg log" + logColor + "'>Round " + formatNum(roundNum) + " Start</p>";}
      logColor = (logColor + 1) % 2;
      
      
      orderOfAttack = attHeroes.concat(defHeroes);
      
      while (orderOfAttack.length > 0) {
        // @ start of hero action
        basicQueue = [];
        activeQueue = [];
        triggerQueue = [];
        
        
        orderOfAttack.sort(speedSort);
        currentHero = orderOfAttack.shift();
        
        if (currentHero._currentStats["totalHP"] > 0) {
          if(currentHero.isUnderStandardControl()) {
            //if(numSims == 1) {oCombatLog.innerHTML += "<div class='log" + logColor + "'><p></p></div><div class='log" + logColor + "'>" + currentHero.heroDesc() + " is under control effect, turn skipped.</div>";}
          } else {
            
            let isRussellCharging = false;
            if (currentHero._heroName == "Russell") {
              if (currentHero._currentStats["isCharging"]) {
                isRussellCharging = true;
              }
            }
            
            
            // decide on action
            if ((currentHero._currentStats["energy"] >= 100 && !("Silence" in currentHero._debuffs)) || isRussellCharging) {
              
              // set hero energy to 0
              if (this._heroName != "Russell") {
                currentHero._currentStats["energySnapshot"] = currentHero._currentStats["energy"];
                currentHero._currentStats["energy"] = 0;
              }
              
              // do active
              result = currentHero.doActive();
              //if(numSims == 1) {oCombatLog.innerHTML += "<div class='log" + logColor + "'><p></p></div><div class='log" + logColor + "'>" + result + "</div>";}
              
              // monster gains energy from hero active
              if (currentHero._attOrDef == "att") {
                if (attMonster._monsterName != "None") {
                  monsterResult = "<div>" + attMonster.heroDesc() + " gained " + formatNum(10) + " energy. ";
                  attMonster._energy += 10;
                  monsterResult += "Energy at " + formatNum(attMonster._energy) + ".</div>"
                  //if(numSims == 1) {oCombatLog.innerHTML += "<div class='log" + logColor + "'><p></p></div><div class='log" + logColor + "'>" + monsterResult + "</div>";}
                }
                
              } else {
                if (defMonster._monsterName != "None") {
                  monsterResult = "<div>" + defMonster.heroDesc() + " gained " + formatNum(10) + " energy. ";
                  defMonster._energy += 10;
                  monsterResult += "Energy at " + formatNum(defMonster._energy) + ".</div>"
                  //if(numSims == 1) {oCombatLog.innerHTML += "<div class='log" + logColor + "'><p></p></div><div class='log" + logColor + "'>" + monsterResult + "</div>";}
                }
              }
              
              // check for Aida's Balance Mark debuffs
              if ("Balance Mark" in currentHero._debuffs) {
                var firstKey = Object.keys(currentHero._debuffs["Balance Mark"])[0];
                triggerQueue.push([currentHero._debuffs["Balance Mark"][firstKey]["source"], "balanceMark", currentHero, currentHero._debuffs["Balance Mark"][firstKey]["effects"]["attackAmount"]]);
              }
              
              
              triggerQueue.push([currentHero, "eventSelfActive", activeQueue]);
              
              for (var h in currentHero._allies) {
                if (currentHero._heroPos != currentHero._allies[h]._heroPos) {
                  triggerQueue.push([currentHero._allies[h], "eventAllyActive", currentHero, activeQueue]);
                }
              }
              
              for (var h in currentHero._enemies) {
                triggerQueue.push([currentHero._enemies[h], "eventEnemyActive", currentHero, activeQueue]);
              }
  
  
              // get energy after getting hit by active
              temp = "";
              for (var i=0; i<activeQueue.length; i++) {
                if (activeQueue[i][1]._currentStats["totalHP"] > 0) {
                  if (activeQueue[i][2] > 0) {
                    if (activeQueue[i][3] == true) {
                      // double energy on being critted
                      temp += activeQueue[i][1].getEnergy(activeQueue[i][1], 20);
                    } else {
                      temp += activeQueue[i][1].getEnergy(activeQueue[i][1], 10);
                    }
                  }
                }
              }
              //if(numSims == 1) {oCombatLog.innerHTML += "<div class='log" + logColor + "'><p></p></div><div class='log" + logColor + "'>" + temp + "</div>";}
              
            } else if ("Horrify" in currentHero._debuffs) {
              //if(numSims == 1) {oCombatLog.innerHTML += "<div class='log" + logColor + "'><p></p></div><div class='log" + logColor + "'>" + currentHero.heroDesc() + " is Horrified, basic attack skipped.</div>";}
              
            } else {
              // do basic
              result = currentHero.doBasic();
              /*if(numSims == 1) {
                result = "<div class='log" + logColor + "'><p></p></div><div class='log" + logColor + "'>" + result + "</div>";
                oCombatLog.innerHTML += result;
              }  */
              
              // hero gains 50 energy after doing basic
              temp = currentHero.getEnergy(currentHero, 50);
              //if(numSims == 1) {oCombatLog.innerHTML += "<div class='log" + logColor + "'><p></p></div><div class='log" + logColor + "'>" + temp + "</div>";}
              
              
              triggerQueue.push([currentHero, "eventSelfBasic", basicQueue]);
              
              for (var h in currentHero._allies) {
                if (currentHero._heroPos != currentHero._allies[h]._heroPos) {
                  triggerQueue.push([currentHero._allies[h], "eventAllyBasic", currentHero, basicQueue]);
                }
              }
              
              for (var h in currentHero._enemies) {
                triggerQueue.push([currentHero._enemies[h], "eventEnemyBasic", currentHero, basicQueue]);
              }
              
              // get energy after getting hit by basic
              temp = "";
              for (var i=0; i<basicQueue.length; i++) {
                if (basicQueue[i][1]._currentStats["totalHP"] > 0) {
                  if (basicQueue[i][2] > 0) {
                    if (basicQueue[i][3] == true) {
                      // double energy on being critted
                      temp += basicQueue[i][1].getEnergy(basicQueue[i][1], 20);
                    } else {
                      temp += basicQueue[i][1].getEnergy(basicQueue[i][1], 10);
                    }
                  }
                }
              }
              //if(numSims == 1) {oCombatLog.innerHTML += "<div class='log" + logColor + "'><p></p></div><div class='log" + logColor + "'>" + temp + "</div>";}
            }
          }
              
              
          // process triggers and events    
          temp = processQueue();
          //if(numSims == 1 && temp.length > 0) {oCombatLog.innerHTML += "<div class='log" + logColor + "'>" + temp + "</div>";}
          someoneWon = checkForWin();
          if (someoneWon != "") {break;}
        
          logColor = (logColor + 1) % 2;
        }
      }
      
      if (someoneWon != "") {break;}
      
      // trigger end of round stuff
      //if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg log" + logColor + "'>End of round " + formatNum(roundNum) + ".</p>";}
      logColor = (logColor + 1) % 2;
      
      
      // handle monster stuff
      if (attMonster._monsterName != "None") {
        monsterResult = "<div>" + attMonster.heroDesc() + " gained " + formatNum(20) + " energy. ";
        attMonster._energy += 20;
        monsterResult += "Energy at " + formatNum(attMonster._energy) + ".</div>"
      
        if (attMonster._energy >= 100) {
          monsterResult += attMonster.doActive();
        }
        
        //if(numSims == 1) {oCombatLog.innerHTML += "<div class='log" + logColor + "'><p></p></div><div class='log" + logColor + "'>" + monsterResult + "</div>";}
        logColor = (logColor + 1) % 2;
      }
      
      if (defMonster._monsterName != "None") {
        monsterResult = "<div>" + defMonster.heroDesc() + " gained " + formatNum(20) + " energy. ";
        defMonster._energy += 20;
        monsterResult += "Energy at " + formatNum(defMonster._energy) + ".</div>"
      
        if (defMonster._energy >= 100) {
          monsterResult += defMonster.doActive();
        }
        
        //if(numSims == 1) {oCombatLog.innerHTML += "<div class='log" + logColor + "'><p></p></div><div class='log" + logColor + "'>" + monsterResult + "</div>";}
        logColor = (logColor + 1) % 2;
      }
      
      temp = processQueue();
      //if(numSims == 1 && temp.length > 0) {oCombatLog.innerHTML += "<div class='log" + logColor + "'>" + temp + "</div>";}
      someoneWon = checkForWin();
      if (someoneWon != "") {break;}
      
      
      // handle end of round abilities
      if (roundNum < 127) {
        temp = "";
          
        for (let h in attHeroes) {
          if (attHeroes[h]._currentStats["totalHP"] > 0) {
            temp += attHeroes[h].tickBuffs();
            temp += attHeroes[h].tickDebuffs();
          }
        }
          
        for (let h in defHeroes) {
          if (defHeroes[h]._currentStats["totalHP"] > 0) {
            temp += defHeroes[h].tickBuffs();
            temp += defHeroes[h].tickDebuffs();
          }
        }
          
          
        for (let h in attHeroes) {
          if ((attHeroes[h]._currentStats["totalHP"] > 0 && attHeroes[h].isNotSealed()) || attHeroes[h]._currentStats["revive"] == 1) {
            temp += attHeroes[h].endOfRound(roundNum);
          }
          
          
          if (attHeroes[h]._currentStats["totalHP"] > 0 && attHeroes[h].isNotSealed()) {
            temp += attHeroes[h].tickEnable3();
            
            
            if (attHeroes[h]._artifact.includes(" Antlers Cane")) {
              temp += "<div>" + attHeroes[h].heroDesc() + " gained increased damage from <span class='skill'>" + attHeroes[h]._artifact + "</span>.</div>";
              temp += attHeroes[h].getBuff(attHeroes[h], "All Damage Dealt", 15, {allDamageDealt: artifacts[attHeroes[h]._artifact]["enhance"]});
            }
          
          
            if (["Radiant Lucky Candy Bar", "Splendid Lucky Candy Bar"].includes(attHeroes[h]._artifact) && attHeroes[h].isUnderControl()) {
              temp += "<div><span class='skill'>" + attHeroes[h]._artifact + "</span> triggered.</div>";
              temp += attHeroes[h].getBuff(attHeroes[h], "Hand of Fate", 1, {allDamageReduce: artifacts[attHeroes[h]._artifact]["enhance"]}, true);
            }
          }
        }
          
        for (let h in defHeroes) {
          if ((defHeroes[h]._currentStats["totalHP"] > 0 && defHeroes[h].isNotSealed()) || defHeroes[h]._currentStats["revive"] == 1) {
            temp += defHeroes[h].endOfRound(roundNum);
          }
          
          
          if (defHeroes[h]._currentStats["totalHP"] > 0 && defHeroes[h].isNotSealed()) {
            temp += defHeroes[h].tickEnable3();
            
            
            if (defHeroes[h]._artifact.includes(" Antlers Cane")) {
              temp += "<div>" + defHeroes[h].heroDesc() + " gained increased damage from <span class='skill'>" + defHeroes[h]._artifact + "</span>.</div>";
              temp += defHeroes[h].getBuff(defHeroes[h], "All Damage Dealt", 15, {allDamageDealt: artifacts[defHeroes[h]._artifact]["enhance"]});
            }
          
          
            if (["Radiant Lucky Candy Bar", "Splendid Lucky Candy Bar"].includes(defHeroes[h]._artifact) && defHeroes[h].isUnderControl()) {
              temp += "<div><span class='skill'>" + defHeroes[h]._artifact + "</span> triggered.</div>";
              temp += defHeroes[h].getBuff(defHeroes[h], "Hand of Fate", 1, {allDamageReduce: artifacts[defHeroes[h]._artifact]["enhance"]}, true);
            }
          }
        }
          
          
        //if(numSims == 1 && temp.length > 0) {oCombatLog.innerHTML += "<div class='log" + logColor + "'><p></p></div><div class='log" + logColor + "'>" + temp + "</div>";}
        logColor = (logColor + 1) % 2;
        
        
        temp = processQueue();
        //if(numSims == 1 && temp.length > 0) {oCombatLog.innerHTML += "<div class='log" + logColor + "'>" + temp + "</div>";}
        someoneWon = checkForWin();
        if (someoneWon != "") {break;}
      } else {
        break;
      }
      
      
      // @ end of round
      roundNum++;
    }
    
    if (someoneWon == "att") {
      winCount++;
      //if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg'>Attacker wins!</p>";}
    } else {
      //if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg'>Defender wins!</p>";}
    }
    
    endingRoundSum += roundNum;
    
    
    numOfHeroes = attHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (attHeroes[i]._heroName != "None") {
        attHeroes[i]._damageDealt += attHeroes[i]._currentStats["damageDealt"];
        attHeroes[i]._currentStats["damageDealt"] = 0;
        attHeroes[i]._damageHealed += attHeroes[i]._currentStats["damageHealed"];
        attHeroes[i]._currentStats["damageHealed"] = 0;
      }
    }
    
    numOfHeroes = defHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (defHeroes[i]._heroName != "None") {
        defHeroes[i]._damageDealt += defHeroes[i]._currentStats["damageDealt"];
        defHeroes[i]._currentStats["damageDealt"] = 0;
        defHeroes[i]._damageHealed += defHeroes[i]._currentStats["damageHealed"];
        defHeroes[i]._currentStats["damageHealed"] = 0;
      }
    }
    
    //if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg'>Simulation #" + formatNum(simIterNum) +" Ended.</p>"};
    
    // @ end of simulation
  }
  /*
  oCombatLog.innerHTML += "<p class='logSeg'>Attacker won " + winCount + " out of " + numSims + " (" + formatNum((winCount/numSims * 100).toFixed(2)) + "%).</p>";
  oCombatLog.innerHTML += "<p class='logSeg'>Average Combat Length: " + formatNum((endingRoundSum/numSims).toFixed(2)) + " rounds.</p>";

  // damage summary
  oCombatLog.innerHTML += "<p><div class='logSeg'>Attacker average damage summary.</div>";
  for (var i = 0; i < attHeroes.length; i++) {
    if (attHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div><span class='att'>" + attHeroes[i]._heroName + "</span>: " + formatNum(Math.floor(attHeroes[i]._damageDealt / numSims)) + "</div>";
    }
  }
  if (attMonster._monsterName != "None") {
    oCombatLog.innerHTML += "<div><span class='att'>" + attMonster._monsterName + "</span>: " + formatNum(Math.floor(attMonster._currentStats["damageDealt"] / numSims)) + "</div>";
  }
  oCombatLog.innerHTML += "</p>";
  
  oCombatLog.innerHTML += "<p><div class='logSeg'>Defender average damage summary.</div>";
  for (var i = 0; i < defHeroes.length; i++) {
    if (defHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div><span class='def'>" + defHeroes[i]._heroName + "</span>: " + formatNum(Math.floor(defHeroes[i]._damageDealt / numSims)) + "</div>";
    }
  }
  if (defMonster._monsterName != "None") {
    oCombatLog.innerHTML += "<div><span class='def'>" + defMonster._monsterName + "</span>: " + formatNum(Math.floor(defMonster._currentStats["damageDealt"] / numSims)) + "</div>";
  }
  oCombatLog.innerHTML += "</p>";
  
  // healing and damage prevention summary
  oCombatLog.innerHTML += "<p><div class='logSeg'>Attacker average healing and damage prevention summary.</div>";
  for (var i = 0; i < attHeroes.length; i++) {
    if (attHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div><span class='att'>" + attHeroes[i]._heroName + "</span>: " + formatNum(Math.floor(attHeroes[i]._damageHealed / numSims)) + "</div>";
    }
  }
  if (attMonster._monsterName != "None") {
    oCombatLog.innerHTML += "<div><span class='att'>" + attMonster._monsterName + "</span>: " + formatNum(Math.floor(attMonster._currentStats["damageHealed"] / numSims)) + "</div>";
  }
  oCombatLog.innerHTML += "</p>";
  
  oCombatLog.innerHTML += "<p><div class='logSeg'>Defender average healing and damage prevention summary.</div>";
  for (var i = 0; i < defHeroes.length; i++) {
    if (defHeroes[i]._heroName != "None") {
      oCombatLog.innerHTML += "<div><span class='def'>" + defHeroes[i]._heroName + "</span>: " + formatNum(Math.floor(defHeroes[i]._damageHealed / numSims)) + "</div>";
    }
  }
  if (defMonster._monsterName != "None") {
    oCombatLog.innerHTML += "<div><span class='def'>" + defMonster._monsterName + "</span>: " + formatNum(Math.floor(defMonster._currentStats["damageHealed"] / numSims)) + "</div>";
  }
  oCombatLog.innerHTML += "</p>";
  
  oCombatLog.scrollTop = 0;*/
  
  return winCount;
}
  
  
// process all triggers and events
function processQueue() {
  var result = "";
  var temp = "";
  var copyQueue;
  
  while (triggerQueue.length > 0) {
    copyQueue = triggerQueue.slice();
    triggerQueue = [];
    
    copyQueue.sort(function(a,b) {
      if (a[0]._attOrDef == "att" && b[0]._attOrDef == "def") {
        return -1;
      } else if (a[0]._attOrDef == "def" && b[0]._attOrDef == "att") {
        return 1;
      } else if (a[0]._heroPos < b[0]._heroPos) {
        return -1;
      } else {
        return 1;
      }
    });
    
    for (var i in copyQueue) {
      temp = copyQueue[i][0].handleTrigger(copyQueue[i]);
      if (temp.length > 0) { result += "<div class='log" + logColor + "'><p></p>" + temp + "</div>"; }
      
      
      // enhanced artifact triggers
      if (copyQueue[i][0].isNotSealed() && copyQueue[i][0]._currentStats["totalHP"] > 0) {
        if (copyQueue[i][1] == "eventGotCC" && ["Radiant Lucky Candy Bar", "Splendid Lucky Candy Bar"].includes(copyQueue[i][0]._artifact)) {
          temp = copyQueue[i][0].getBuff(copyQueue[i][0], "Hand of Fate", 1, {allDamageReduce: artifacts[copyQueue[i][0]._artifact]["enhance"]}, true);
          result += "<div class='log" + logColor + "'><p></p>" + temp + "</div>";
        }
      
      
        if (["eventSelfBasic", "eventSelfActive"].includes(copyQueue[i][1]) && copyQueue[i][0]._artifact.includes(" The Kiss of Ghost")) {
          var damageDone = 0;
          for (let e in copyQueue[i][2]) {
            damageDone += copyQueue[i][2][e][2];
          }
          
          var healAmount = copyQueue[i][0].calcHeal(copyQueue[i][0], artifacts[copyQueue[i][0]._artifact]["enhance"] * damageDone);
          temp = "<div><span class='skill'>" + copyQueue[i][0]._artifact + "</span> triggered heal.</div>";
          temp += copyQueue[i][0].getHeal(copyQueue[i][0], healAmount);
          
          result += "<div class='log" + logColor + "'><p></p>" + temp + "</div>";
        }
      
      
        if (copyQueue[i][1] == "eventSelfActive" && copyQueue[i][0]._artifact.includes(" Demon Bell")) {
          var targets = getAllTargets(copyQueue[i][0], copyQueue[i][0]._allies);
          var energyGain = 10;
          temp = "<div><span class='skill'>" + copyQueue[i][0]._artifact + "</span> triggered energy gain.</div>";
          
          if (random() < artifacts[copyQueue[i][0]._artifact]["enhance"]) {
            energyGain += 10;
          }
          
          for (let i in targets) {
            temp += targets[i].getEnergy(copyQueue[i][0], energyGain);
          }
          
          result += "<div class='log" + logColor + "'><p></p>" + temp + "</div>";
        }
      
      
        if (["eventSelfBasic", "eventSelfActive"].includes(copyQueue[i][1]) && copyQueue[i][0]._artifact.includes(" Staff Punisher of Immortal")) {
          var damageResult = "";
          var didCrit = false;
          var damageAmount = 0;
          temp = "";
          
          for (let e in copyQueue[i][2]) {
            if (copyQueue[i][2][e][3] == true && copyQueue[i][2][e][1]._currentStats["totalHP"] > 0) {
              didCrit = true;
              
              damageAmount = copyQueue[i][2][e][1]._stats["totalHP"] * 0.12;
              if (damageAmount > copyQueue[i][0]._currentStats["totalAttack"] * 15) { damageAmount = copyQueue[i][0]._currentStats["totalAttack"] * 15; }
              
              damageResult = copyQueue[i][0].calcDamage(copyQueue[i][2][e][1], damageAmount, "passive", "true");
              temp += copyQueue[i][2][e][1].takeDamage(copyQueue[i][0], copyQueue[i][0]._artifact, damageResult);
            }
          }
          
          if (didCrit) {
            temp = "<div><span class='skill'>" + copyQueue[i][0]._artifact + "</span> triggered on crit.</div>" + temp;
            result += "<div class='log" + logColor + "'><p></p>" + temp + "</div>";
          }
        }
      }
    }
  }
  
  return result;
}


function checkForWin() {
  var attAlive = 0;
  var defAlive = 0;
  var numOfHeroes = 0;
  
  numOfHeroes = attHeroes.length;
  for (var i = 0; i < numOfHeroes; i++) {
    if (attHeroes[i]._currentStats["totalHP"] > 0 || (attHeroes[i]._currentStats["revive"] == 1 && attHeroes[i]._heroName != "Carrie")) {
      attAlive++;
    }
  }
  
  numOfHeroes = defHeroes.length;
  for (var i = 0; i < numOfHeroes; i++) {
    if (defHeroes[i]._currentStats["totalHP"] > 0 || (defHeroes[i]._currentStats["revive"] == 1 && defHeroes[i]._heroName != "Carrie")) {
      defAlive++;
    }
  }

  if (attAlive == 0 && defAlive >= 0) {
    return "def";
  } else if (attAlive > 0 && defAlive == 0) {
    return "att";
  } else {
    return "";
  }
}

/* End of simulation.js */


/* Unique to web worker implementation */

// Make sure dom is not referenced anywhere above
// need to adjust for avatar frame, pet, statues, and guild tech in heroes.js
// comment out summary in simulation.js
// replace if(numSims == 1)
// comment out 4 document lines
// comment out ocombatlog = ""
// add to runsim(attMonsterName, defMonsterName, numSims)
// performance adjustment: remove .toLocaleString()

var attMonsterName;
var defMonsterName;
var attFrame = "IDA Maverick +9";
var defFrame = "IDA Maverick +9";
var attHeroes = [];
var defHeroes = [];
var allAttTeams = {};
var allDefTeams = {};
var wid;
var numSims;

self.onmessage = handleCall;

function handleCall(e) {
  /* array containing:
    0: action to take
    1: attack team id
    2: defense team id
    3: worker id, optional
    4: number of simulations, optional
    5: jsonConfig, optional
  */
  
  if (e.data[0] == "init") {
    wid = e.data[3];
    numSims = e.data[4];
    
    // load all teams
    var jsonConfig = e.data[5];
    var teamIndex = 0;
    var team;
    var tHero;
    
    allAttTeams = {};
    allDefTeams = {};
    
    for (var t in jsonConfig) {
      // add team as attacker
      allAttTeams[teamIndex] = {};
      allAttTeams[teamIndex]["pet"] = jsonConfig[t][60];
      attMonsterName = jsonConfig[t][60];
      team = [];
      
      for (var p = 0; p < 60; p += 10) {
        tHero = new baseHeroStats[jsonConfig[t][p]]["className"](jsonConfig[t][p], Math.floor(p / 10), "att");
        
        tHero._heroLevel = 330;
        tHero._skin = jsonConfig[t][p+1];
        tHero._stone = jsonConfig[t][p+3];
        tHero._artifact = jsonConfig[t][p+4];
        tHero._enable1 = jsonConfig[t][p+5];
        tHero._enable2 = jsonConfig[t][p+6];
        tHero._enable3 = jsonConfig[t][p+7];
        tHero._enable4 = jsonConfig[t][p+8];
        tHero._enable5 = jsonConfig[t][p+9];
        
        if (jsonConfig[t][p+2] == "Class Gear") { 
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = classGearMapping[tHero._heroClass]["armor"];
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = classGearMapping[tHero._heroClass]["accessory"];
          
        } else if (jsonConfig[t][p+2] == "Split HP") { 
          tHero._weapon = "6* Thorny Flame Whip";
          tHero._armor = classGearMapping[tHero._heroClass]["armor"];
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = "6* Flame Necklace";
          
        } else if (jsonConfig[t][p+2] == "Split Attack") { 
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = "6* Flame Armor";
          tHero._shoe = "6* Flame Boots";
          tHero._accessory = "6* Flame Necklace";
          
        } else if (jsonConfig[t][p+2] == "No Armor") { 
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = "None";
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = classGearMapping[tHero._heroClass]["accessory"];
        }
        
        team.push(tHero);
      }
    
      allAttTeams[teamIndex]["team"] = team;
      
      
      // add team as defender
      allDefTeams[teamIndex] = {};
      allDefTeams[teamIndex]["pet"] = jsonConfig[t][60];
      defMonsterName = jsonConfig[t][60];
      team = [];
      
      for (var p = 0; p < 60; p += 10) {
        tHero = new baseHeroStats[jsonConfig[t][p]]["className"](jsonConfig[t][p], Math.floor(p / 10), "def");
        
        tHero._heroLevel = 330;
        tHero._skin = jsonConfig[t][p+1];
        tHero._stone = jsonConfig[t][p+3];
        tHero._artifact = jsonConfig[t][p+4];
        tHero._enable1 = jsonConfig[t][p+5];
        tHero._enable2 = jsonConfig[t][p+6];
        tHero._enable3 = jsonConfig[t][p+7];
        tHero._enable4 = jsonConfig[t][p+8];
        tHero._enable5 = jsonConfig[t][p+9];
        
        if (jsonConfig[t][p+2] == "Class Gear") { 
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = classGearMapping[tHero._heroClass]["armor"];
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = classGearMapping[tHero._heroClass]["accessory"];
          
        } else if (jsonConfig[t][p+2] == "Split HP") { 
          tHero._weapon = "6* Thorny Flame Whip";
          tHero._armor = classGearMapping[tHero._heroClass]["armor"];
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = "6* Flame Necklace";
          
        } else if (jsonConfig[t][p+2] == "Split Attack") { 
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = "6* Flame Armor";
          tHero._shoe = "6* Flame Boots";
          tHero._accessory = "6* Flame Necklace";
          
        } else if (jsonConfig[t][p+2] == "No Armor") { 
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = "None";
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = classGearMapping[tHero._heroClass]["accessory"];
        }
        
        team.push(tHero);
      }
    
      allDefTeams[teamIndex]["team"] = team;
      
      
      // update stats for team
      for (var h = 0; h < 6; h++) {
        allAttTeams[teamIndex]["team"][h].updateCurrentStats();
        allDefTeams[teamIndex]["team"][h].updateCurrentStats();
      }
      
      teamIndex++;
    }
  }
  

  attHeroes = allAttTeams[e.data[1]]["team"];
  defHeroes = allDefTeams[e.data[2]]["team"];
  
  attMonsterName = allAttTeams[e.data[1]]["pet"];
  defMonsterName = allDefTeams[e.data[2]]["pet"];
  
  for (var p = 0; p < 6; p++) {
    attHeroes[p]._allies = attHeroes;
    attHeroes[p]._enemies = defHeroes;

    defHeroes[p]._allies = defHeroes;
    defHeroes[p]._enemies = attHeroes;
  }
  
  var numWins = runSim(attMonsterName, defMonsterName, numSims);
  postMessage([wid, e.data[1], e.data[2], numWins]);
}

/* end unique to web worker implementation */
