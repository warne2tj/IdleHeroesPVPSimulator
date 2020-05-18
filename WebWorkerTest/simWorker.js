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
    return {
      "damageAmount": attackDamage,
      "holyDamage": 0, 
      "critted": false, 
      "blocked": false, 
      "damageSource": damageSource, 
      "damageType": damageType, 
      "e5Description": ""
    };
  }
  
  
  doActive() {
    var result = "";
    
    result = "<div><span class='" + this._attOrDef + "'>" + this._monsterName + "</span> used <span class='skill'>Active Template</span>.</div>";
    
    this._energy = 0;
    return result;
  }
}


class mDeer extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = getRandomTargets(this, this._enemies);
    var numTargets = 4;
    
    if (targets.length < numTargets) {numTargets = targets.length;}
    
    for (var i=0; i < numTargets; i++) {
      damageResult = this.calcDamage(targets[i], 402068, "monster", "true");
      result += targets[i].takeDamage(this, "Emerald Nourishing", damageResult);
    }
    
    var healAmount = 0;
    var targets = getRandomTargets(this, this._allies);
    
    if (targets.length < numTargets) {numTargets = targets.length;}
    
    for (var i=0; i < numTargets; i++) {
      result += targets[i].getBuff(this, "Deer Buff", 2, {armorPercent: 0.37, attackPercent: 0.15});
      
      healAmount = Math.floor(targets[i]._stats["totalHP"] * 0.2);
      result += targets[i].getHeal(this, healAmount);
    }
    
    this._energy = 0;
    
    return result;
  }
}


class mPhoenix extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = getRandomTargets(this, this._enemies);
    var numTargets = 4;
    
    if (targets.length < numTargets) {numTargets = targets.length;}
    
    for (var i=0; i < numTargets; i++) {
      damageResult = this.calcDamage(targets[i], 451830, "monster", "true");
      result += targets[i].takeDamage(this, "Blazing Spirit", damageResult);
      result += targets[i].getDebuff(this, "Phoenix Burn", 3, {burnTrue: 363465});
    }
    
    var healAmount = 0;
    targets = getRandomTargets(this, this._allies);
    
    if (targets.length < numTargets) {numTargets = targets.length;}
    
    for (var i=0; i < numTargets; i++) {
      result += targets[i].getBuff(this, "Phoenix Buff", 3, {heal: 500353, damageAgainstBurning: 0.8});
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
    this._rng = Math.random();
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
    this._stats["fixedAttack"] = 0;
    this._stats["fixedHP"] = 0;
    this._stats["damageAgainstBurning"] = 0.0;
    this._stats["damageAgainstBleed"] = 0.0;
    this._stats["allDamageReduce"] = 0.0;
    this._stats["allDamageTaken"] = 0.0;
    this._stats["allDamageDealt"] = 0.0;
    
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
    
    for (var techName in tech){
      var techLevel = document.getElementById(this._attOrDef + "Tech" + this._heroClass + techName).value;
      
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
    var sAvatarFrame = document.getElementById(this._attOrDef + "AvatarFrame").value;
    this.applyStatChange(avatarFrames[sAvatarFrame], "avatarFrame");
    
    
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
    
    
    // monster
    var monsterName = document.getElementById(this._attOrDef + "Monster").value;
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
    
    
    this._stats["totalHP"] = this.calcHP();
    this._stats["totalAttack"] = this.calcAttack();
    this._stats["totalArmor"] = this.calcArmor();
  }
  
  
  applyStatChange(arrStats, strSource) {
    for (var strStatName in arrStats) {
      if (strStatName == "attackPercent" || strStatName == "attackPercent2") {
        this._attackMultipliers[strSource + ":" + strStatName] = 1 + arrStats[strStatName];
      } else if (strStatName == "hpPercent") {
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
      "unbendingWillTriggered", "unbendingWillStacks"
    ];
    
    heroSheet += "Level " + this._heroLevel + " " + this._heroName + "<br/>";
    heroSheet += this._starLevel + "* " + this._heroFaction + " " + this._heroClass + "<br/>";
    
    for (var statName in this._stats) {
      if (arrIntStats.includes(statName)) {
        heroSheet += "<br/>" + statName + ": " + this._stats[statName].toFixed();
      } else {
        heroSheet += "<br/>" + statName + ": " + this._stats[statName].toFixed(2);
      }
    }
    
    return heroSheet;
  }
  
  heroDesc() {
    if (this._heroName == "None") {
      return "";
    } else {
      var pos1 = parseInt(this._heroPos) + 1;
      return "<span class='" + this._attOrDef + "'>" + this._heroName + "-" + pos1 + " (" + this._currentStats["totalHP"].toLocaleString() + " hp, " + this._currentStats["totalAttack"].toLocaleString() + " attack, " + this._currentStats["energy"].toLocaleString() + " energy)</span>";
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
    var result = false;
    var b = "";
    var s = "";
    var e = "";
    
    for (b in this._debuffs) {
      if (b == strStatus) {
        return true; 
      } else {
        for (s in this._debuffs[b]) {
          for (e in this._debuffs[b][s]["effects"]) {
            if (e == strStatus) { return true; }
          }
        }
      }
    }
    
    for (b in this._buffs) {
      if (b == strStatus) {
        return true; 
      } else {
        for (s in this._buffs[b]) {
          for (e in this._buffs[b][s]["effects"]) {
            if (e == strStatus) { return true; }
          }
        }
      }
    }
    
    return result;
  }
  
  
  isUnderStandardControl() {
    if (this.hasStatus("petrify") || this.hasStatus("stun") || this.hasStatus("twine") || this.hasStatus("freeze") || this.hasStatus("Shapeshift")) { 
      return true;
    } else {
      return false;
    }
  }
  
  
  isNotSealed() {
    if ("Seal of Light" in this._debuffs || "Shapeshift" in this._debuffs) {
      return false;
    } else {
      return true;
    }
  }
  
  
  // can further extend this to account for new mechanics by adding parameters to the end
  // supply a default value so as to not break other calls to this function
  calcDamage(target, attackDamage, damageSource, damageType, skillDamage=1, canCrit=1, dotRounds=0, canBlock=1) {
    // Get damage related stats
    var critChance = canCrit * this._currentStats["crit"];
    var critDamage = 2*this._currentStats["critDamage"] + 1.5;
    var precision = this._currentStats["precision"];
    var precisionDamageIncrease = 1;
    var holyDamageIncrease = this._currentStats["holyDamage"] * .7;
    var holyDamage = attackDamage * holyDamageIncrease;
    var lethalFightback = 1;
    var damageAgainstBurning = 1;
    var damageAgainstBleed = 1;
    var allDamageDealt = 1 + this._currentStats["allDamageDealt"]
    
    if (critChance < 0) { critChance = 0; }
    if (precision < 0) { precision = 0; }
    
    var critDamageReduce = target._currentStats["critDamageReduce"];
    var blockChance = canBlock * (target._currentStats["block"] - precision);
    
    var factionA = this._heroFaction;
    var factionB = target._heroFaction;
    var factionBonus = 1;
    var e5Desc = "";
    
    if (
      (factionA == "Abyss" && factionB == "Forest") ||
      (factionA == "Forest" && factionB == "Shadow") ||
      (factionA == "Shadow" && factionB == "Fortress") ||
      (factionA == "Fortress" && factionB == "Abyss") ||
      (factionA == "Dark" && factionB == "Light") ||
      (factionA == "Light" && factionB == "Dark")
    ) {
      factionBonus += 0.3;
      precision += 0.15;
    }
    precisionDamageIncrease = precision >= 1.5 ? 1.45 : 1.0 + precision * 0.3;

    if (
      this._enable2 == "LethalFightback" && 
      this._currentStats["totalHP"] < target._currentStats["totalHP"] &&
      !(["burn", "bleed", "poison", "dot", "hpPercent", "true"].includes(damageType)) &&
      (damageSource.substring(0, 6) == "active" || damageSource.substring(0, 5) == "basic")
    ) {
      lethalFightback = 1.12;
      e5Desc = "<div><span class='skill'>Lethal Fightback</span> triggered additional damage.</div>";
    }
    
    if (target.hasStatus("burn")) {
       damageAgainstBurning += this._currentStats["damageAgainstBurning"];
    }
    
    if (target.hasStatus("bleed")) {
      damageAgainstBleed += this._currentStats["damageAgainstBleed"];
    }
    
    
    // damage source and damage type overrides
    if (damageSource.substring(0, 6) == "active") {
      if (isDot(damageType)) {
        skillDamage += (this._currentStats["skillDamage"] + ((this._currentStats["energy"] - 100) / 100)) / (dotRounds + 1);
      } else if (!(["hpPercent", "energy", "true"].includes(damageType))) {
        skillDamage += this._currentStats["skillDamage"] + ((this._currentStats["energy"] - 100) / 100);
      }
    }
    
    if (["passive", "mark"].includes(damageSource) || isDot(damageType)) {
      critChance = 0;
      blockChance = 0;
    }
    
    if (["hpPercent", "energy", "true"].includes(damageType) || damageSource == "debuff") {
      precisionDamageIncrease = 1;
      holyDamage = 0;
      factionBonus = 1;
      damageAgainstBurning = 1;
      damageAgainstBleed = 1;
      critChance = 0;
      blockChance = 0;
    }
    
    
    attackDamage = attackDamage * skillDamage * precisionDamageIncrease * factionBonus * lethalFightback * damageAgainstBurning * damageAgainstBleed * allDamageDealt;
    holyDamage = holyDamage * skillDamage * precisionDamageIncrease * factionBonus * lethalFightback * damageAgainstBurning * damageAgainstBleed * allDamageDealt;    
    
    var blocked = false;
    var critted = false;
    
    if (this._rng >= (1 - critChance) && this._rng >= (1 - blockChance)) {
      // blocked crit
      attackDamage = attackDamage * 0.56 * (1-critDamageReduce) * critDamage;
      holyDamage = holyDamage * 0.56 * (1-critDamageReduce) * critDamage;
      blocked = true;
      critted = true;
    } else if (this._rng >= (1 - critChance) && this._rng < (1 - blockChance)) {
      // crit
      attackDamage = attackDamage * (1-critDamageReduce) * critDamage;
      holyDamage = holyDamage * (1-critDamageReduce) * critDamage;
      critted = true;
    } else if (this._rng < (1 - critChance) && this._rng >= (1 - blockChance)) {
      // blocked normal
      attackDamage = attackDamage * 0.7;
      holyDamage = holyDamage * 0.7;
      blocked = true;
    } else {
      // normal
    }
    
    // E5 Balanced strike
    if ((damageSource.substring(0, 6) == "active" || damageSource.substring(0, 5) == "basic") && this._enable5 == "BalancedStrike" && !(["burn", "bleed", "poison", "dot", "hpPercent", "true"].includes(damageType))) {
      if (critted == false) {
        attackDamage *= 1.3;
        holyDamage *= 1.3;
        e5Desc = "<div><span class='skill'>Balanced Strike</span> triggered additional damage on non-crit.</div>";
      }
    }
    
    return {
      "damageAmount": attackDamage,
      "holyDamage": holyDamage, 
      "critted": critted, 
      "blocked": blocked, 
      "damageSource": damageSource, 
      "damageType": damageType, 
      "e5Description": e5Desc
    };
  }
  
  
  calcHeal(target, healAmount) {
    var healEffect = this._currentStats["healEffect"] + 1;
    return healAmount * healEffect;
  }
  
  
  getHeal(source, amount) {
    var result = "";
    var effectBeingHealed = 1 + this._currentStats["effectBeingHealed"];
    if (effectBeingHealed < 0) { effectBeingHealed = 0; }
    
    var amountHealed = Math.round(amount * effectBeingHealed);
    
      
    if (!(isMonster(source)) && "Healing Curse" in this._debuffs) {
      var debuffKeys = Object.keys(this._debuffs["Healing Curse"]);
      var debuffStack = this._debuffs["Healing Curse"][debuffKeys[0]];
      var damageResult = {};
      
      result += "<div>Heal from " + source.heroDesc() + " blocked by <span class='skill'>Healing Curse</span>.</div>";
      
      damageResult = debuffStack["source"].calcDamage(this, amountHealed, "passive", "true");
      result += this.takeDamage(debuffStack["source"], "Healing Curse", damageResult);
      
      if (this._currentStats["totalHP"] > 0) {
        result += this.removeDebuff("Healing Curse", debuffKeys[0]);
      }
      
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
        var s = Object.keys(this._debuffs["Devouring Mark"])[0];
        result += this._debuffs["Devouring Mark"][s]["source"].devouringMark(this);
      }
    }
    
    return result;
  }
  
  
  loseEnergy(source, amount) {
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
    for (var b in this._buffs) {
      for (var s in this._buffs[b]) {
        for (var e in this._buffs[b][s]["effects"]) {
          if (e == "attackPercent") {
            att = Math.floor(att * (1 + this._buffs[b][s]["effects"][e]));
          }
        }
      }
    }
    
    // apply debuffs
    for (var b in this._debuffs) {
      for (var s in this._debuffs[b]) {
        for (var e in this._debuffs[b][s]["effects"]) {
          if (e == "attackPercent") {
            att = Math.floor(att * (1 - this._debuffs[b][s]["effects"][e]));
          }
        }
      }
    }
    
    att += this._stats["fixedAttack"];
    return att;
  }
  
  
  calcCombatArmor() {
    var armr = this._currentStats["armor"];
    
    for (var x in this._armorMultipliers) {
      armr = Math.floor(armr * this._armorMultipliers[x]);
    }
    
    // apply buffs
    for (var b in this._buffs) {
      for (var s in this._buffs[b]) {
        for (var e in this._buffs[b][s]["effects"]) {
          if (e == "armorPercent") {
            armr = Math.floor(armr * (1 + this._buffs[b][s]["effects"][e]));
          }
        }
      }
    }
    
    // apply debuffs
    for (var b in this._debuffs) {
      for (var s in this._debuffs[b]) {
        for (var e in this._debuffs[b][s]["effects"]) {
          if (e == "armorPercent") {
            armr = Math.floor(armr * (1 - this._debuffs[b][s]["effects"][e]));
          }
        }
      }
    }
    
    return armr;
  }
  
  
  getBuff(source, buffName, duration, effects={}) {
    var result = "";
    var healResult = "";
    
    if (duration > 15) {
      result += "<div>" + this.heroDesc() + " gained buff <span class='skill'>" + buffName + "</span>.";
    } else if (duration ==1) {
      result += "<div>" + this.heroDesc() + " gained buff <span class='skill'>" + buffName + "</span> for " + formatNum(1) + " round.";
    } else {
      result += "<div>" + this.heroDesc() + " gained buff <span class='skill'>" + buffName + "</span> for " + formatNum(duration) + " rounds.";
    }
    
    
    var keyAt = uuid();
    if (buffName in this._buffs) {
      this._buffs[buffName][keyAt] = {"source": source, "duration": duration, "effects": effects};
    } else {
      this._buffs[buffName] = {};
      this._buffs[buffName][keyAt] = {"source": source, "duration": duration, "effects": effects};
    }
    
    
    for (var strStatName in effects) {
      result += " " + strStatName + " " + formatNum(effects[strStatName]) + ".";
      
      if (strStatName == "attackPercent") {
        this._currentStats["totalAttack"] = this.calcCombatAttack();
        
      } else if (strStatName == "armorPercent") {
        this._currentStats["totalArmor"] = this.calcCombatArmor();
        
      } else if (strStatName == "heal") {
        healResult = this.getHeal(source, effects[strStatName]);
        
      } else {
        this._currentStats[strStatName] += effects[strStatName];
        
        if (strStatName == "attack") {
          this._currentStats["totalAttack"] = this.calcCombatAttack();
        } else if (strStatName == "armor") {
          this._currentStats["totalArmor"] = this.calcCombatArmor();
        }
      }
    }
    
    return result + "</div>" + healResult;
  }
  
  
  getDebuff(source, debuffName, duration, effects={}, bypassControlImmune=false) {
    var damageResult = {};
    var strDamageResult = "";
    var result = "";
    var controlImmune = this._currentStats["controlImmune"];
    var isControl = isControlEffect(debuffName, effects);
    
    
    if (isControl) {
      if ((debuffName + "Immune") in this._currentStats) {
        controlImmune = 1 - (1-controlImmune) * (1 - this._currentStats[debuffName + "Immune"]);
      }
    }
    
    
    if (Math.random() < controlImmune && isControl && !(bypassControlImmune)) {
      result += "<div>" + this.heroDesc() + " resisted debuff <span class='skill'>" + debuffName + "</span>.</div>";
    } else {
      if (duration > 15) {
        result += "<div>" + this.heroDesc() + " gained debuff <span class='skill'>" + debuffName + "</span>.";
      } else if (duration ==1) {
        result += "<div>" + this.heroDesc() + " gained debuff <span class='skill'>" + debuffName + "</span> for " + formatNum(1) + " round.";
      } else {
        result += "<div>" + this.heroDesc() + " gained debuff <span class='skill'>" + debuffName + "</span> for " + formatNum(duration) + " rounds.";
      }
      
      
      var keyAt = uuid();
      if (debuffName in this._debuffs) {
        this._debuffs[debuffName][keyAt] = {"source": source, "duration": duration, "effects": effects};
      } else {
        this._debuffs[debuffName] = {};
        this._debuffs[debuffName][keyAt] = {"source": source, "duration": duration, "effects": effects};
      }
      
      
      // process effects
      for (var strStatName in effects) {
        result += " " + strStatName + " " + formatNum(effects[strStatName]) + ".";
        
        if (strStatName == "attackPercent") {
          this._currentStats["totalAttack"] = this.calcCombatAttack();
          
        } else if (strStatName == "armorPercent") {
          this._currentStats["totalArmor"] = this.calcCombatArmor();
          
        } else if (isDot(strStatName)) {
          damageResult = source.calcDamage(this, effects[strStatName], "debuff", "true");
          damageResult["damageType"] = strStatName;
          strDamageResult = this.takeDamage(source, "Debuff " + debuffName, damageResult);
          
        } else if (["rounds", "stacks"].includes(strStatName)) {
          //ignore, used to track other stuff
          
        } else {
          this._currentStats[strStatName] -= effects[strStatName];
          
          if (strStatName == "attack") {
            this._currentStats["totalAttack"] = this.calcCombatAttack();
          } else if (strStatName == "armor") {
            this._currentStats["totalArmor"] = this.calcCombatArmor();
          }
        }
      }
      
      result += "</div>";
      
      
      // handle special debuffs
      if (debuffName == "Devouring Mark" && this._currentStats["energy"] >= 100) {
        result += source.devouringMark(this);
        
      } else if (debuffName == "Power of Light" && Object.keys(this._debuffs[debuffName]).length >= 2) {
        result += this.getDebuff(source, "Seal of Light", 2, {});
        
      } else if (debuffName == "Seal of Light") {
        if ("Power of Light" in this._debuffs) {
          result += this.removeDebuff("Power of Light");
        }
        
      } else if (debuffName == "twine") {
        for (var h in source._allies) {
          if (source._allies[h]._heroName == "Oberon") {
            result += source._allies[h].twine(this);
          }
        }
      }
    }
    
    return result + strDamageResult;
  }


  removeBuff(strBuffName, stack="") {   
    var result = "";
    result += "<div>" + this.heroDesc() + " lost buff <span class='skill'>" + strBuffName + "</span>."

    // for each stack
    for (var s in this._buffs[strBuffName]) {
      // remove the effects
      if (stack == "" || stack == s) {
        for (var strStatName in this._buffs[strBuffName][s]["effects"]) {
          result += " " + strStatName + " " + formatNum(this._buffs[strBuffName][s]["effects"][strStatName]) + ".";

          if (strStatName == "attackPercent") {
            this._currentStats["totalAttack"] = this.calcCombatAttack();
            
          } else if (strStatName == "armorPercent") {
            this._currentStats["totalArmor"] = this.calcCombatArmor();
            
          } else if(strStatName == "heal") {
            // do nothing, already healed
            
          } else {
            this._currentStats[strStatName] -= this._buffs[strBuffName][s]["effects"][strStatName];
            
            if (strStatName == "attack") {
              this._currentStats["totalAttack"] = this.calcCombatAttack();
            } else if (strStatName == "armor") {
              this._currentStats["totalArmor"] = this.calcCombatArmor();
            }
          }
        }
      }
    }
    
    if (Object.keys(this._buffs[strBuffName]).length == 0) {
      delete this._buffs[strBuffName];
    }

    return result + "</div>";
  }


  removeDebuff(strDebuffName, stack = "") {   
    var result = "";
    result += "<div>" + this.heroDesc() + " lost debuff <span class='skill'>" + strDebuffName + "</span>."

    // for each stack
    for (var s in this._debuffs[strDebuffName]) {
      // remove the effects
      if (stack == "" || stack == s) {
        for (var strStatName in this._debuffs[strDebuffName][s]["effects"]) {
          result += " " + strStatName + " " + formatNum(this._debuffs[strDebuffName][s]["effects"][strStatName]) + ".";

          if (strStatName == "attackPercent") {
            this._currentStats["totalAttack"] = this.calcCombatAttack();
            
          } else if (strStatName == "armorPercent") {
            this._currentStats["totalArmor"] = this.calcCombatArmor();
            
          } else if (["rounds", "stacks"].includes(strStatName)) {
                // do nothing, used to track other stuff
                
          } else if (isDot(strStatName)) {
            // do nothing
            
          } else {
            this._currentStats[strStatName] += this._debuffs[strDebuffName][s]["effects"][strStatName];
            
            if (strStatName == "attack") {
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

    return result + "</div>";
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
          this._buffs[b][s]["duration"] -= 1;
          
          if (this._buffs[b][s]["duration"] == 0) {
            result += "<div>" + this.heroDesc() + " buff (<span class='skill'>" + b + "</span>) ended.</div>";
            
            // remove the effects
            for (var strStatName in this._buffs[b][s]["effects"]) {
              if (strStatName == "attackPercent") {
                this._currentStats["totalAttack"] = this.calcCombatAttack();
                
              } else if (strStatName == "armorPercent") {
                this._currentStats["totalArmor"] = this.calcCombatArmor();
                
              } else if (strStatName == "heal") {
                // do nothing
              } else {
                this._currentStats[strStatName] -= this._buffs[b][s]["effects"][strStatName];
                
                if (strStatName == "attack") {
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
        
        if (stacksLeft == 0) {
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
          this._debuffs[b][s]["duration"] -= 1;
          
          if (this._debuffs[b][s]["duration"] == 0) {
            result += "<div>" + this.heroDesc() + " debuff (<span class='skill'>" + b + "</span>) ended.</div>";
            
            if (b == "Sow Seeds") {
              result += this.getDebuff(this._debuffs[b][s]["source"], "twine", this._debuffs[b][s]["effects"]["rounds"]);
            } else {
              // remove the effects
              for (var strStatName in this._debuffs[b][s]["effects"]) {
                if (strStatName == "attackPercent") {
                  this._currentStats["totalAttack"] = this.calcCombatAttack();
                  
                } else if (strStatName == "armorPercent") {
                  this._currentStats["totalArmor"] = this.calcCombatArmor();
                  
                } else if (["rounds", "stacks"].includes(strStatName)) {
                  // do nothing, used to track stuff
                  
                }  else if (isDot(strStatName)) {
                  // do nothing, full burn damage already done
                  
                } else {
                  this._currentStats[strStatName] += this._debuffs[b][s]["effects"][strStatName];
                  
                  if (strStatName == "attack") {
                    this._currentStats["totalAttack"] = this.calcCombatAttack();
                  } else if (strStatName == "armor") {
                    this._currentStats["totalArmor"] = this.calcCombatArmor();
                  }
                }
              }
            }
            
            if (this._currentStats["totalHP"] > 0) {
              delete this._debuffs[b][s];
            }
          } else {
            stacksLeft++;
            
            for (var strStatName in this._debuffs[b][s]["effects"]) {
              if (isDot(strStatName)) {
                if (this._currentStats["totalHP"] > 0) {
                  damageResult = this._debuffs[b][s]["source"].calcDamage(this, this._debuffs[b][s]["effects"][strStatName], "debuff", strStatName);
                  damageResult["damageType"] = strStatName;
                  result += "<div>" + this.heroDesc() + " layer of debuff <span class='skill'>" + b + "</span> ticked.</div>";
                  result += "<div>" + this.takeDamage(this._debuffs[b][s]["source"], "Debuff " + b, damageResult) + "</div>";
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
  
  
  tickEnable3(numLiving) {
    var result = "";
    
    if (this._enable3 == "Resilience") {
      var healAmount = this.calcHeal(this, Math.round(0.15 * (this._stats["totalHP"] - this._currentStats["totalHP"])));
      
      if (healAmount > 0) {
        result += "<div>" + this.heroDesc() + " Resilience triggered.</div>" 
        result += this.getHeal(this, healAmount);
      }
      
    } else if (this._enable3 == "SharedFate") {
      var attBuff = numLiving * 0.012;
      if (numLiving > 0) {
        result += "<div>" + this.heroDesc() + " gained Shared Fate. Increased attack by " + formatNum(attBuff * 100) + "%.</div>";
        this.getBuff("SharedFate", 1, {attackPercent: attBuff});
      }
      
    } else if (this._enable3 == "Purify") {
      var listDebuffs = []; 
      var rng;
      
      for (var d in this._debuffs) {
        if (isDispellable(d)) {
          for (var s in this._debuffs[d]) {
            listDebuffs.push([d, s]);
          }
        }
      }
      
      rng = Math.floor(Math.random() * listDebuffs.length)
      
      if (listDebuffs.length > 0) {
        result += "<div>" + this.heroDesc() + " <span class='skill'>Purify</span> removed debuff.</div>";
        result += this.removeDebuff(listDebuffs[rng][0], listDebuffs[rng][1]);
      }
    }
    
    return result;
  }
  
  
  // a bunch of functions for override by hero subclasses as needed to trigger special abilities.
  // usually you'll want to check that the hero is still alive before triggering their effect
  
  passiveStats() { return; }
  eventAllyBasic(e) { return ""; }
  eventEnemyBasic(e) { return ""; }
  eventAllyActive(e) { return ""; }
  eventEnemyActive(e) { return ""; }
  eventAllyDied(e) { return ""; }
  eventEnemyDied(e) { return ""; }
  startOfRound(roundNum) { return ""; }
  endOfRound(roundNum) { return ""; }
  
  
  
  takeDamage(source, strAttackDesc, damageResult, armorReduces=1) {
    var result = "";
    var beforeHP = this._currentStats["totalHP"];
    
    var armorBreak = 0;
    var classDamageReduce = 0;
    
    if (isMonster(source)) {
      armorBreak = 0;
      classDamageReduce = 0;
    } else {
      armorBreak = source._currentStats["armorBreak"] >= 1 ? 1 : source._currentStats["armorBreak"];
      classDamageReduce = this._currentStats[source._heroClass.toLowerCase() + "Reduce"];
    }
    
    var armorMitigation = armorReduces * (this._currentStats["totalArmor"] * (1 - armorBreak) / (180 + 20*(this._heroLevel)));
    var reduceDamage = this._currentStats["damageReduce"] > 0.75 ? 0.75 : this._currentStats["damageReduce"];
    var allDamageReduce = this._currentStats["allDamageReduce"];
    var allDamageTaken = 1 + this._currentStats["allDamageTaken"];
    
    strAttackDesc = "<span class='skill'>" + strAttackDesc + "</span>";
    result = "<div>" + source.heroDesc() + " used " + strAttackDesc + " against " + this.heroDesc() + ".</div>";
    
    
    if (["hpPercent", "energy", "true", "burnTrue"].includes(damageResult["damageType"])) {
      armorMitigation = 0;
      reduceDamage = 0;
      classDamageReduce = 0;
      allDamageTaken = 1;
    }
    
    if (isDot(damageResult["damageType"])) {
      var dotReduce = this._currentStats["dotReduce"];
      damageResult["damageAmount"] = damageResult["damageAmount"] * (1 - dotReduce);
      damageResult["holyDamage"] = damageResult["holyDamage"] * (1 - dotReduce);
    }
    
    damageResult["damageAmount"] = Math.round(damageResult["damageAmount"] * (1-allDamageReduce) * (1-reduceDamage) * (1-armorMitigation) * (1-classDamageReduce) * allDamageTaken);
    damageResult["holyDamage"] = Math.round(damageResult["holyDamage"] * (1-allDamageReduce) * (1-reduceDamage) * (1-classDamageReduce) * allDamageTaken);
    damageResult["damageAmount"] += damageResult["holyDamage"];
    
    // amenra shields
    if ("Guardian Shadow" in this._buffs && !(["passive", "mark"].includes(damageResult["damageSource"])) && !(isMonster(source))) {
      var keyDelete = Object.keys(this._buffs["Guardian Shadow"]);
      
      result += "<div>Damage prevented by <span class='skill'>Guardian Shadow</span>.</div>";
      result += this.getHeal(this._buffs["Guardian Shadow"][keyDelete[0]]["source"], damageResult["damageAmount"]);
      this._buffs["Guardian Shadow"][keyDelete[0]]["source"]._currentStats["damageHealed"] += 2 * damageResult["damageAmount"];
      damageResult["damageAmount"] = 0;
      
      delete this._buffs["Guardian Shadow"][keyDelete[0]];
      
      if (keyDelete.length <= 1) {
        result += this.removeBuff("Guardian Shadow");
      }
    } else {
      damageInRound += damageResult["damageAmount"];
      
      if (this._currentStats["totalHP"] <= damageResult["damageAmount"]) {
        // hero would die, check for unbending will
        if (this._enable5 == "UnbendingWill" && this._currentStats["unbendingWillTriggered"] == 0 && damageResult["damageSource"] != "mark") {
          this._currentStats["unbendingWillTriggered"] = 1;
          this._currentStats["unbendingWillStacks"] = 3;
          this._currentStats["damageHealed"] += damageResult["damageAmount"];
          result += "<div>Damage prevented by <span class='skill'>Unbending Will</span>.</div>";
          damageResult["damageAmount"] = 0;
          
        } else if (this._currentStats["unbendingWillStacks"] > 0 && damageResult["damageSource"] != "mark") {
          this._currentStats["unbendingWillStacks"] -= 1;
          this._currentStats["damageHealed"] += damageResult["damageAmount"];
          result += "<div>Damage prevented by <span class='skill'>Unbending Will</span>.</div>";
          damageResult["damageAmount"] = 0;
          
          if (this._currentStats["unbendingWillStacks"] == 0) {
            result += "<div><span class='skill'>Unbending Will</span> ended.</div>";
          }
          
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

          deathQueue.push([source, this]);
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

      
      // balanced strike enable heal
      if ((damageResult["damageSource"].substring(0, 6) == "active" || damageResult["damageSource"].substring(0, 5) == "basic") && source._enable5 == "BalancedStrike") {
        if (damageResult["critted"] == true) {
          var healAmount = source.calcHeal(source, Math.round(0.15 * (damageResult["damageAmount"])));
          result += "<div><span class='skill'>Balanced Strike</span> triggered heal on crit.</div>" + source.getHeal(source, healAmount);
        }
      }
    }
    
    if (this._currentStats["totalHP"] > 0 && "Shapeshift" in this._debuffs && damageResult["damageAmount"] > 0 && (damageResult["damageSource"].substring(0, 6) == "active" || damageResult["damageSource"].substring(0, 5) == "basic")) {
      var shapeshiftKey = Object.keys(this._debuffs["Shapeshift"])[0];
      if (this._debuffs["Shapeshift"][shapeshiftKey]["effects"]["stacks"] > 1) {
        this._debuffs["Shapeshift"][shapeshiftKey]["effects"]["stacks"]--;
      } else {
        result += this.removeDebuff("Shapeshift", shapeshiftKey);
      }
    }
    
    result += damageResult["e5Description"];
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
    
    if (targets.length > 0) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "basic", "normal");
      result += targets[0].takeDamage(this, "Basic Attack", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
    var maxTargets = 2;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.5);
      result += targets[i].takeDamage(this, "Active Template", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
}

/* End of heroes.js */


/* Start of heroSubclasses.js */

/* 
Important Notes
  * Don't forget to check for Tara's Seal of Light if needed.
  * Don't forget to check for CC if needed.
  * When getting targets, check that the target is alive. In case all targets are dead. 
      Some effects still happen with no currently living targets.
      i.e. only sleepless left to resurrect at end of round, kroos attack still heals
  * After doing damage, check that damageresult doesn't contain CarrieDodge.
  * When overriding events, you might need to check that the target or source of the event is the same as the hero being called
      Depending on the details of the skill that is. 
      Some react to anyone triggering the event, some only react to themselves.
  * Rng for a hero's attack is initially generated at the beginning of their turn. 
      Need to regenerate if they do further attacks. 
      But maybe not depending on if subsequent attacks use the same roll. This is an open question.
  
  

Important Function prototypes

  this.calcDamage(target, attackDamage, damageSource, damageType, skillDamage=1, canCrit=1, dotRounds=0)
      return {"damageAmount", "critted", "blocked", "damageSource", "damageType", "e5Description"} 
      damageSource = passive, basic, active, mark, monster, basic2, active2, debuff
        basic2, active2: for skills that do multiple attacks, Carrie dodge only checked once per skill 
        active2: does not apply skill damage but applies other skill related effects
      damageType = normal, burn, bleed, poison, hpPercent, energy, true


  this.takeDamage(source, strAttackDesc, damageResult{}, armorReduces=1)
      
  this.calcHeal(target, healAmount)

  this.getHeal(source, amount)

  this.getEnergy(source, amount)
  
  this.loseEnergy(source, amount)

  this.getBuff(source, buffName, duration, effects{})
  
  this.removeBuff(strBuffName, stack="")

  this.getDebuff(source, debuffName, duration, effects{})
  
  this.removeDebuff(strDebuffName, stack="")
  
  this.hasStatus(strStatus)
  
  this.isUnderStandardControl()
  
  isControlEffect(strName, effects)
  
  startOfRound(roundNum)
  
  endOfRound(roundNum)

  basicQueue[], activeQueue[] = push([source, target, damageAmount, critted]) to call the event

  deathQueue[] = push([source, target]) to call the event
  
  this.eventAllyBasic(source, e), this.eventAllyActive(source, e), this.eventAllyDied(e), this.eventEnemyDied(e) = called by all heroes so they can react to an event

  this.eventEnemyBasic(source, e), this.eventEnemyActive(source, e) = if overridden, call the super() version so the enemy still gains energy on an attack
    
*/


// Aida
class Aida extends hero {
  passiveStats() {
    // apply Blessing of Light passive
    this.applyStatChange({hpPercent: 0.4, holyDamage: 1.0, damageReduce: 0.3, speed: 80}, "PassiveStats");
  }
  
  
  balanceMark(target) {
    var result = "";
    
    if (target._currentStats["totalHP"] > 0) {
      var damageAmount = target._stats["totalHP"] * 0.25;
      
      if (damageAmount > this._currentStats["totalAttack"] * 30) {
        damageAmount = this._currentStats["totalAttack"] * 30;
      }
      
      var damageResult = this.calcDamage(target, damageAmount, "mark", "hpPercent");
      result += target.removeDebuff("Balance Mark");
      result += target.takeDamage(this, "Balance Mark", damageResult);
    }
    
    return result;
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    var healAmount = 0;
    
    if (this._currentStats["totalHP"] > 0) {
      var damageResult = {};
      var targets = getAllTargets(this, this._enemies);
      
      for (var i=0; i<targets.length; i++) {
        if (targets[i]._currentStats["totalHP"] > 0) {
          this._rng = Math.random();
          damageResult = this.calcDamage(this, targets[i]._currentStats["totalAttack"] * 3, "passive", "normal");
          result += targets[i].takeDamage(this, "Final Verdict", damageResult);
          
          if (targets[i]._currentStats["totalHP"] > 0) {
            result += targets[i].getDebuff(this, "Final Verdict", 99, {effectBeingHealed: 0.1});
          }
        }
      }
      
      healAmount = this.calcHeal(this, this._stats["totalHP"] * 0.15);
      result += this.getHeal(this, healAmount);
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {damageAmount: 0};
    var targets = getHighestHPTargets(this, this._enemies);
    var additionalDamage = 0;
    var maxTargets = 1;
    var healAmount = 0;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 1.2, "basic", "normal");
      result = targets[i].takeDamage(this, "Basic Attack", damageResult);
      
      if (targets[i]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult)) {
        additionalDamage = targets[i]._stats["totalHP"] * 0.2;
        if (additionalDamage > this._currentStats["totalAttack"] * 15) {
          additionalDamage = this._currentStats["totalAttack"] * 15;
        }
        
        additionalDamageResult = this.calcDamage(targets[i], additionalDamage, "basic2", "hpPercent");
        result += targets[i].takeDamage(this, "Fury of Justice", additionalDamageResult);
      }
      
      if (!("CarrieDodge" in damageResult)) {
        basicQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    
    if (!("CarrieDodge" in damageResult)) {
      healAmount = this.calcHeal(this, (damageResult["damageAmount"] + additionalDamageResult["damageAmount"]) * 0.35);
      result += this.getHeal(this, healAmount);
    }
    
    return result;
    
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    var numTargets = 4;
    
    if (targets.length < numTargets) {
      numTargets = targets.length;
    }
    
    for (var i=0; i<numTargets; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal");
      result += targets[i].takeDamage(this, "Order Restore", damageResult, 0);
      
      if (!("CarrieDodge" in damageResult)) {
        targets[i].getDebuff(this, "Balance Mark", 3, {});
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
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
  
  
  getDebuff(source, debuffName, duration, effects) {
    var result = "";
    
    if (isControlEffect(debuffName, effects)) {
      duration--;
      
      if (duration == 0) {
        result = "<div>" + this.heroDesc() + " negated <span class='skill'>" + debuffName + "</span> by reducing it's duration to " + formatNum(0) + " rouunds.</div>";
      } else {
        result = super.getDebuff(source, debuffName, duration, effects);
      }
    } else {
      result = super.getDebuff(source, debuffName, duration, effects);
    }
    
    return result;
  }
  
  
  eventAllyActive(source, e) {
    var result = "";
    var damageResult = {};
    var targets;
    
    if (!(this.isUnderStandardControl())) {
      for (var i=1; i<=3; i++) {
        targets = getRandomTargets(this, this._enemies);
        
        if (targets.length > 0) {
          this._rng = Math.random();
          damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 2, "passive", "normal");
          result += targets[0].takeDamage(this, "Terrible Feast", damageResult);
        }
      }
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var targets;
    
    result = super.doBasic();
    
    for (var i=1; i<=2; i++) {
      targets = getRandomTargets(this, this._enemies);
      
      if (targets.length > 0) {
        result += targets[0].getDebuff(this, "Healing Curse", 99, {});
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getFrontTargets(this, this._enemies);
    var controlPrecision = this._currentStats["controlPrecision"];
    
    for (var i in targets) {
      if (targets[i]._currentStats["totalHP"] > 0) {
        targets[i]._rng = Math.random();
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2);
        result += targets[i].takeDamage(this, "Shadow Defense", damageResult);
        
        
        if (!("CarrieDodge" in damageResult) && targets[i]._currentStats["totalHP"] > 0 && Math.random() < (0.7 + controlPrecision)) {
          result += targets[i].getDebuff(this, "petrify", 2, {});
        }
        
        if (!("CarrieDodge" in damageResult)) {
          activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
        }
      }
    }
    
    targets = getAllTargets(this, this._allies);
    for (i in targets) {
      result += targets[i].getBuff(this, "Guardian Shadow", 99, {});
      result += targets[i].getBuff(this, "Guardian Shadow", 99, {});
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
  
  
  eventAllyActive(source, e) {
    var result = "";
    
    // Does not trigger himself on his own active
    if (this.heroDesc() != source.heroDesc()) {
      result += "<div>" + this.heroDesc() + " <span class='skill'>Energy Oblivion</span> triggered.</div>";
      
      var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 2);
      result += this.getHeal(this, healAmount)
      result += this.getEnergy(this, 35);
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getLowestHPTargets(this, this._enemies);
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 1.8, "basic", "normal");
      result += targets[0].takeDamage(this, "Basic Attack", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
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
    var targets = getRandomTargets(this, this._enemies);
    var maxTargets = 2;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      this._rng = Math.random();
      
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 3.5);
      result = targets[i].takeDamage(this, "Scarlet Contract", damageResult);
      
      if (targets[i]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult)) {
        hpDamage = targets[i]._stats["totalHP"] * 0.21;
        if (hpDamage > this._currentStats["totalAttack"] * 15) {
          hpDamage = this._currentStats["totalAttack"] * 15;
        }
        
        hpDamageResult = this.calcDamage(targets[i], hpDamage, "active2", "hpPercent");
        result += targets[i].takeDamage(this, "Scarlet Contract HP", hpDamageResult);
        result += targets[i].getDebuff(this, "Scarlet Contract", 2, {effectBeingHealed: 0.3});
      }
      
      if (targets[i]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult) && targets[i]._heroClass == "Priest") {
        priestDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active2", "normal", 1.7);
        result += targets[i].takeDamage(this, "Scarlet Contract Priest", priestDamageResult);
      }
      
      if (!("CarrieDodge" in damageResult)) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + hpDamageResult["damageAmount"] + priestDamageResult["damageAmount"], damageResult["critted"]]);
      }
      
      result += this.getBuff(this, "Scarlet Contract", 3, {crit: 0.4});
    }
    
    result += this.getBuff(this, "Fury of Justice", 99, {});
    
    return result;
    
  }
}



// Aspen
class Aspen extends hero {
  passiveStats() {
    // apply Dark Storm passive
    this.applyStatChange({hpPercent: 0.4, attackPercent: 0.2, crit: 0.35, armorBreak: 0.5}, "PassiveStats");
  }
  
  
  eventAllyActive(source, e) {
    var result = "";
    if (source.heroDesc() == this.heroDesc()) {
      result += this.getBuff(this, "Soul Sacrifice Attack", 99, {attackPercent: 0.15, critDamage: 0.15});
      result += this.getBuff(this, "Shield", 99, {controlImmune: 0.2, damageReduce: 0.06});
    }
    return result;
  }
  
  
  eventAllyBasic(source, e) { return this.eventAllyActive(source, e); }
  
  
  getBuff(source, buffName, duration, effects) {
    if ("Shield" in this._buffs && buffName == "Shield") {
      if (Object.keys(this._buffs["Shield"]).length < 5) {
        return super.getBuff(source, buffName, duration, effects);
      } else {
        return "";
      }
    } else {
      return super.getBuff(source, buffName, duration, effects);
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
    var targets = getLowestHPTargets(this, this._enemies);
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 2, "basic", "normal");
      result += targets[0].takeDamage(this, "Basic Attack", damageResult);
      
      if (targets[0]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult)) {
        hpDamage = 0.15 * (targets[0]._stats["totalHP"] - targets[0]._currentStats["totalHP"]);
        maxDamage = 15 * this._currentStats["totalAttack"];
        if (hpDamage > maxDamage) { hpDamage = maxDamage; }
        
        hpDamageResult = this.calcDamage(targets[0], hpDamage, "basic2", "hpPercent");
        result += targets[0].takeDamage(this, "Rage of Shadow HP", hpDamageResult);
        
        if (targets[0]._currentStats["totalHP"] > 0) {
          var beforeHorrifyCount = 0;
          if (!("Horrify" in targets[0]._debuffs)) {
            beforeHorrifyCount = 0;
          } else {
            beforeHorrifyCount = Object.keys(targets[0]._debuffs["Horrify"]).length;
          }
          
          result += targets[0].getDebuff(this, "Horrify", 2, {});
          
          var afterHorrifyCount = 0;
          if (!("Horrify" in targets[0]._debuffs)) {
            afterHorrifyCount = 0;
          } else {
            afterHorrifyCount = Object.keys(targets[0]._debuffs["Horrify"]).length;
          }
          
          if (afterHorrifyCount > beforeHorrifyCount) {
            var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 1.5);
            result += this.getHeal(this, healAmount);
            result += this.getBuff(this, "Shield", 99, {controlImmune: 0.2, damageReduce: 0.06});
          }
          
          if (targets[0]._currentStats["totalHP"] > 0 && (targets[0]._currentStats["totalHP"] / targets[0]._stats["totalHP"]) < 0.35) {
            additionalDamage = 1.6 * (damageResult["damageAmount"] + hpDamageResult["damageAmount"]);
            additionalDamageResult = this.calcDamage(targets[0], additionalDamage, "basic2", "true");
            result += targets[0].takeDamage(this, "Rage of Shadow Below 35%", additionalDamageResult);
            
            var healAmount = this.calcHeal(this, additionalDamageResult["damageAmount"]);
            result += this.getHeal(this, healAmount);
          }
        }
      }
      
      if (!("CarrieDodge" in damageResult)) {
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
    var targets = getRandomTargets(this, this._enemies);
    var maxTargets = 4;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i = 0; i < maxTargets; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.6);
      result += targets[i].takeDamage(this, "Dread's Coming", damageResult);
      
      if (targets[i]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult)) {
        hpDamage = 0.2 * targets[i]._currentStats["totalHP"];
        maxDamage = 15 * this._currentStats["totalAttack"];
        if (hpDamage > maxDamage) { hpDamage = maxDamage; }
        
        hpDamageResult = this.calcDamage(targets[i], hpDamage, "active2", "hpPercent");
        result += targets[i].takeDamage(this, "Dread's Coming HP", hpDamageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          var beforeHorrifyCount = 0;
          if (!("Horrify" in targets[i]._debuffs)) {
            beforeHorrifyCount = 0;
          } else {
            beforeHorrifyCount = Object.keys(targets[i]._debuffs["Horrify"]).length;
          }
          
          if (Math.random() < 0.5 + this._currentStats["controlPrecision"]) {
            result += targets[i].getDebuff(this, "Horrify", 2, {});
          }
          
          var afterHorrifyCount = 0;
          if (!("Horrify" in targets[i]._debuffs)) {
            afterHorrifyCount = 0;
          } else {
            afterHorrifyCount = Object.keys(targets[i]._debuffs["Horrify"]).length;
          }
          
          if (afterHorrifyCount > beforeHorrifyCount) {
            var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 1.5);
            result += this.getHeal(this, healAmount);
            result += this.getBuff(this, "Shield", 99, {controlImmune: 0.2, damageReduce: 0.06});
          }
          
          if (targets[i]._currentStats["totalHP"] > 0 && (targets[i]._currentStats["totalHP"] / targets[i]._stats["totalHP"]) < 0.35) {
            additionalDamage = 2.2 * (damageResult["damageAmount"] + hpDamageResult["damageAmount"]);

            additionalDamageResult = this.calcDamage(targets[i], additionalDamage, "active2", "true");
            result += targets[i].takeDamage(this, "Dread's Coming Below 35%", additionalDamageResult);
            
            var healAmount = this.calcHeal(this, additionalDamageResult["damageAmount"]);
            result += this.getHeal(this, healAmount);
          }
        }
      }
      
      if (!("CarrieDodge" in damageResult)) {
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
  
  
  eventAllyDied(e) { 
    var result = "";
    
    if (e[1].heroDesc() == this.heroDesc()) {
      var targets = getAllTargets(this, this._allies);
      var healEffect = 1 + this._currentStats["healEffect"];
      var healAmount = Math.round(this._currentStats["totalAttack"] * 4 * healEffect);
      
      for (var i=0; i<targets.length; i++) {
        result += targets[i].getBuff(this, "Light of Souls", 4, {heal: healAmount});
      }
    }
    
    return result; 
  }
  
  
  doBasic() {
    var result = super.doBasic();
    var healEffect = 1 + this._currentStats["healEffect"];
    var healAmount = Math.round(this._currentStats["totalAttack"] * 2.5 * healEffect);
    var targets = getLowestHPTargets(this, this._allies);
    var maxTargets = 3;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      result += targets[i].getBuff(this, "Sanctity Will", 2, {heal: healAmount});
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    var numTargets = 4;
    
    if (targets.length < numTargets) {
      numTargets = targets.length;
    }
    
    for (var i=0; i<numTargets; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.82);
      result += targets[i].takeDamage(this, "Holylight Sparkle", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    targets = getRandomTargets(this, this._allies);
    numTargets = 4;
    if (targets.length < numTargets) {
      numTargets = targets.length;
    }
    
    for (var i=0; i<numTargets; i++) {
      result += targets[i].getBuff(this, "Holylight Sparkle", 3, {attackPercent: 0.3, speed: 30, effectBeingHealed: 0.2});
      
      if (Math.random() < 0.4) {
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
    this._stats["spiritPowerStacks"] = 0;
  }
  
  
  passiveStats() {
    // apply Darkness Befall passive
    this.applyStatChange({attackPercent: 0.25, controlImmune: 0.3, speed: 60}, "PassiveStats");
  }
  
  
  takeDamage(source, strAttackDesc, damageResult, armorReduces=1) {
    var result = "";
    var outcomeRoll = Math.random();
    
    result = "<div>" + source.heroDesc() + " used <span class='skill'>" + strAttackDesc + "</span> against " + this.heroDesc() + ".</div>";
    
    if (outcomeRoll < 0.4 && (damageResult["damageSource"] == "active" || damageResult["damageSource"] == "basic")) {
      result += "<div>Damage dodged by <span class='skill'>Darkness Befall</span>.</div>";
      this._currentStats["damageHealed"] += damageResult["damageAmount"];
      damageResult["damageAmount"] = 0;
      damageResult["CarrieDodge"] = true;
    } else {
      result = super.takeDamage(source, strAttackDesc, damageResult, armorReduces);
    }
    
    
    if (this._currentStats["totalHP"] <= 0 && damageResult["damageSource"].substring(0, 7) != "passive") {
      this._currentStats["spiritPowerStacks"] = 0;
      result += "<div>" + this.heroDesc() + " became a <span class='skill'>Shadowy Spirit</span>.</div>";
      
      for (var b in this._buffs) {
        this.removeBuff(b);
      }
      
      for (var d in this._debuffs) {
        this.removeDebuff(d);
      }
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {damageAmount: 0};
    var targets = getRandomTargets(this, this._enemies);
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 1.56, "basic", "normal");
      result = targets[0].takeDamage(this, "Basic Attack", damageResult);
      
      // attack % per energy damage seems to be true damage
      if (targets[0]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult)) {
        var additionalDamageAmount = this._currentStats["totalAttack"] * 0.06 * (targets[0]._currentStats["energy"] + 50);
        additionalDamageResult = this.calcDamage(targets[0], additionalDamageAmount, "basic2", "energy");
        result += targets[0].takeDamage(this, "Outburst of Magic", additionalDamageResult);
        
        if (targets[0]._currentStats["totalHP"] > 0) {
          result += targets[0].getEnergy(this, 50);
          targets[0]._currentStats["energy"] = 0;
          result += "<div>" + targets[0].heroDesc() + " energy set to " + formatNum(0) + ".</div>";
        }
      }
      
      if (!("CarrieDodge" in damageResult)) {
        basicQueue.push([this, targets[0], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {damageAmount: 0};
    var targets = getRandomTargets(this, this._enemies);
    var numTargets = 4;
    
    if (targets.length < numTargets) {
      numTargets = targets.length;
    }
    
    for (var i=0; i<numTargets; i++) {
      this._rng = Math.random();
      
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.2);
      result += targets[i].takeDamage(this, "Energy Devouring", damageResult);
      
      // attack % per energy damage seems to be true damage
      if (targets[i]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult)) {
        var additionalDamageAmount = this._currentStats["totalAttack"] * 0.06 * targets[i]._currentStats["energy"];
        additionalDamageResult = this.calcDamage(targets[i], additionalDamageAmount, "active2", "energy");
        result += targets[i].takeDamage(this, "Energy Oscillation", additionalDamageResult);
      
        if (targets[i]._currentStats["totalHP"] > 0 && Math.random() < 0.7) {
          result += targets[i].getDebuff(this, "Devouring Mark", 99, {});
        }
      }
      
      if (!("CarrieDodge" in damageResult)) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  devouringMark(target) {
    var result = "";
    var damageResult = {};
    
    // attack % per energy damage seems to be true damage
    damageResult = this.calcDamage(target, this._currentStats["totalAttack"] * 0.1 * target._currentStats["energy"], "mark", "energy");
    result = target.takeDamage(this, "Devouring Mark", damageResult);
    
    if (target._currentStats["totalHP"] > 0) {
      result += target.removeDebuff("Devouring Mark");
      result += "<div>Energy set to " + formatNum(0) + ".</div>";
      target._currentStats["energy"] = 0;
    }
    
    return result;
  }
  
  
  eventAllyDied(e) { 
    var result = "";
    
    if (this._currentStats["totalHP"] <= 0 && e[1].heroDesc() != this.heroDesc()) {
      this._currentStats["spiritPowerStacks"] += 1;
    }
    
    return result; 
  }
  
  
  eventEnemyDied(e) { 
    if (this._currentStats["totalHP"] <= 0) {
      this._currentStats["spiritPowerStacks"] += 1;
    }
    
    return ""; 
  }
  
  
  startOfRound(roundNum) {
    var result = "";
    
    if (this._currentStats["totalHP"] <= 0) {
      if (this._currentStats["spiritPowerStacks"] >= 4) {
        this._currentStats["spiritPowerStacks"] = 0;
        this._currentStats["totalHP"] = this._stats["totalHP"];
        this._currentStats["energy"] = 100;
        result += "<div>" + this.heroDesc() + " has revived with full health and energy.</div>";
      }
    }
    
    return result;
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    
    if (this._currentStats["totalHP"] <= 0) {
      var damageResult = {};
      var targets = getLowestHPTargets(this, this._enemies);
      var maxDamage = 15 * this._currentStats["totalAttack"];
      var maxTargets = 1;
      
      if (targets.length < maxTargets) {
        maxTargets = targets.length;
      }
      
      for (var i=0; i<maxTargets; i++) {
        var damageAmount = 0.5 * (targets[i]._stats["totalHP"] - targets[i]._currentStats["totalHP"]);
        
        if (damageAmount > maxDamage) {
          damageAmount = maxDamage;
        }
        
        damageResult = this.calcDamage(targets[i], damageAmount, "passive", "hpPercent");
        result += targets[i].takeDamage(this, "Shadowy Spirit", damageResult);
        
        this._currentStats["spiritPowerStacks"] += 1;
      }
    }
    
    return result;
  }
}



// Cthuga
class Cthuga extends hero {
  passiveStats() {
    // apply Demon Bloodline passive
    this.applyStatChange({attackPercent: 0.25, hpPercent: 0.2, damageReduce: 0.2}, "PassiveStats");
  }
  
  
  takeDamage(source, strAttackDesc, damageResult, armorReduces=1) {
    var result = "";
    
    if (!(isMonster(source)) && ["burn", "bleed"].includes(damageResult["damageType"])) {
      damageResult["damageAmount"] = 0;
    }
    
    result = super.takeDamage(source, strAttackDesc, damageResult, armorReduces);
    
    if (this.isNotSealed() && this._currentStats["totalHP"] > 0 && !(isMonster(source)) && (damageResult["damageType"].substring(0, 6) == "active" || damageResult["damageType"].substring(0, 5) == "basic")) {
      if (source.hasStatus("burn")) {
        result += "<div>" + this.heroDesc() + " <span class='skill'>Soul Shackle</span> triggered.</div>";
        result += this.getBuff(this, "Soul Shackle Attack", 3, {attackPercent: 0.10});
      }
      
      if (source.hasStatus("bleed")) {
        var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 0.6);
        result += this.getBuff(this, "Soul Shackle Heal", 3, {heal: healAmount});
      }
    }
    
    if (this.isNotSealed() && this._currentStats["totalHP"] > 0 && (damageResult["damageType"].substring(0, 6) == "active" || damageResult["damageType"].substring(0, 5) == "basic")) {
      var burnDamageResult = {};
      var bleedDamageResult = {};
      var targets = getRandomTargets(this, this._enemies);
      var maxTargets = 3;
      
      if (targets.length < maxTargets) { maxTargets = targets.length; }
      
      for (var i = 0; i < maxTargets; i++) {
        burnDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 0.5, "passive", "burn");
        bleedDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 0.5, "passive", "bleed");
        
        result += targets[i].getDebuff(this, "Flame Chase Burn", 3, {burn: Math.round(burnDamageResult["damageAmount"])});
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          result += targets[i].getDebuff(this, "Flame Chase Bleed", 3, {bleed: Math.round(bleedDamageResult["damageAmount"])});
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
    var targets = getRandomTargets(this, this._enemies);
    var maxTargets = 3;
    var isBleedOrBurn = false;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.36);
      result += targets[i].takeDamage(this, "Terror Blade", damageResult);
      
      if (!("CarrieDodge" in damageResult) && targets[i]._currentStats["totalHP"] > 0) {
        detonateDamage = 0;
        
        for (var d in targets[i]._debuffs) {
          for (var s in targets[i]._debuffs[d]) {
            isBleedOrBurn = false;
            
            for (var e in targets[i]._debuffs[d][s]["effects"]) {
              if (["bleed", "burn"].includes(e)) {
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
          
          detonateDamageResult = this.calcDamage(targets[i], detonateDamage, "active2", "true");
          result += targets[i].takeDamage(this, "Terror Blade Detonate", detonateDamageResult);
        }
      }
      
      if (!("CarrieDodge" in damageResult)) {
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
  
  
  takeDamage(source, strAttackDesc, damageResult, armorReduces=1) {
    var result = "";
    var preHP = this._currentStats["totalHP"];
    
    result += super.takeDamage(source, strAttackDesc, damageResult, armorReduces);
    
    var postHP = this._currentStats["totalHP"];
    
    if (this.isNotSealed() && (preHP - postHP)/this._stats["totalHP"] >= 0.03) {
      result += this.getBuff(this, "Preemptive Defense", 6, {attackPercent: 0.03, skillDamage: 0.05});
      result += this.getEnergy(this, 10);
    }
    
    return result
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "basic", "normal");
      result += targets[0].takeDamage(this, "Basic Attack", damageResult);
      
      if (!("CarrieDodge" in damageResult) && targets[0]._currentStats["totalHP"] > 0) {
        result += "<div><span class='skill'>Petrify</span> drained target's energy.</div>";
        result += targets[0].loseEnergy(this, 50)
        result += targets[0].getDebuff(this, "petrify", 1, {});
      }
        
      if (!("CarrieDodge" in damageResult)) {
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
    
    for (var i=0; i < targets.length; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 0.98);
      result += targets[i].takeDamage(this, "Chaotic Shade", damageResult);
      
      if (!("CarrieDodge" in damageResult) && targets[0]._currentStats["totalHP"] > 0) {
        if (Math.random() < 0.3 + this._currentStats["controlPrecision"]) {
          result += targets[i].getDebuff(this, "petrify", 2, {});
        }
        
        if (Math.random() < 0.3) {
          result += "<div><span class='skill'>Chaotic Shade</span> drained target's energy.</div>";
          result += targets[i].loseEnergy(this, 30);
        }
      }
      
      if (!("CarrieDodge" in damageResult)) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    result += this.getBuff(this, "Chaotic Shade", 2, {damageReduce: 0.4});
    
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
    var targets = getRandomTargets(this, this._enemies);
    var maxTargets = 3;
    var maxToCopy = 3;
    
    if (targets.length < maxTargets) { maxTargets = targets.length; }
    
    if (targets.length > 0 && this._currentStats["totalHP"] > 0) {
      var validDebuffs = [];
      
      for (var d in targets[0]._debuffs) {
        for (var s in targets[0]._debuffs[d]) {
          if (isDot(d, targets[0]._debuffs[d][s]["effects"]) || isAttribute(d, targets[0]._debuffs[d][s]["effects"])) {
            validDebuffs.push([d, targets[0]._debuffs[d][s], Math.random()]);
          }
        }
      }
      
      if (validDebuffs.length < maxToCopy) { maxToCopy = validDebuffs.length; }
      
      validDebuffs.sort(function(a,b) {
        if (a[2] > b[2]) {
          return 1;
        } else {
          return -1;
        }
      });
      
      if (targets.length > 1 && maxToCopy > 0) {
        result += "<p><div>" + this.heroDesc() + " <span class='skill'>Transmissive Seed</span> triggered. Copying dots and attribute reduction debuffs.</div>";
        
        for (var h = 1; h < maxTargets; h++) {
          for (var d = 0; d < maxToCopy; d++) {
            if (validDebuffs[0] in targets[h]._debuffs) {
              if (Object.keys(targets[h]._debuffs[d]).length < 3) {
                result += targets[h].getDebuff(validDebuffs[d][1]["source"], validDebuffs[d][0], validDebuffs[d][1]["duration"], validDebuffs[d][1]["effects"]);
              }
            } else {
              result += targets[h].getDebuff(validDebuffs[d][1]["source"], validDebuffs[d][0], validDebuffs[d][1]["duration"], validDebuffs[d][1]["effects"]);
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
    var targets = getRandomTargets(this, this._enemies);
    var maxTargets = 3;
    
    if (targets.length < maxTargets) { maxTargets = targets.length; }
    
    for (var i=0; i<maxTargets; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 2.5, "basic", "normal");
      result += targets[i].takeDamage(this, "Basic Attack", damageResult);
      
      if (!("CarrieDodge" in damageResult) && targets[i]._currentStats["totalHP"] > 0) {
        additionalDamage = this._currentStats["totalAttack"] * 2.5 * (1 + Object.keys(targets[i]._debuffs).length);
        additionalDamageResult = this.calcDamage(targets[i], additionalDamage, "basic2", "normal");
        result += targets[i].takeDamage(this, "Durative Weakness", additionalDamageResult);
      }
      
      if (!("CarrieDodge" in damageResult)) {
        basicQueue.push([this, targets[0], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  doActive() {
    var result = "";
    var damageResult = {};
    var additionalDamage = 0;
    var additionalDamageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    var maxTargets = 4;
    
    if (targets.length < maxTargets) { maxTargets = targets.length; }
    
    for (var i=0; i<maxTargets; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 4);
      result += targets[i].takeDamage(this, "Ray of Delacium", damageResult);
      
      if (!("CarrieDodge" in damageResult) && targets[i]._currentStats["totalHP"] > 0) {
        additionalDamage = 4 * (1 + Object.keys(targets[i]._debuffs).length);
        additionalDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active2", "normal", additionalDamage);
        result += targets[i].takeDamage(this, "Ray of Delacium 2", additionalDamageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0 && Math.random() < 0.7) {
          for (var b in targets[i]._debuffs) {
            if (isControlEffect(b)) {
              for (var s in targets[i]._debuffs[b]) {
                targets[i]._debuffs[b][s]["duration"] += 2;
                result += "<div><span class='skill'>Ray of Delacium</span> extended duration of <span class='skill'>" + b + "</span>.</div>";
              }
            } else {
              for (var s in targets[i]._debuffs[b]) {
                if (isDot(b, targets[i]._debuffs[b][s]["effects"]) || isAttribute(b, targets[i]._debuffs[b][s]["effects"])) {
                  targets[i]._debuffs[b][s]["duration"] += 2;
                  result += "<div><span class='skill'>Ray of Delacium</span> extended duration of <span class='skill'>" + b + "</span>.</div>";
                }
              }
            }
          }
        }
      }
      
      if (!("CarrieDodge" in damageResult)) {
        activeQueue.push([this, targets[0], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
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
  
  
  eventEnemyBasic(source, e) {
    var result = "";
    
    for (var i in e) {
      if ("Fairy's Guard" in e[i][1]._buffs) {
        var damageResult = e[i][1].calcDamage(e[i][1], e[i][1]._currentStats["totalAttack"] * 3, "passive", "normal");
        result += source.takeDamage(e[i][1], "Fairy's Guard", damageResult, 0);
        
        var healAmount = e[i][1].calcHeal(e[i][1], e[i][1]._currentStats["totalAttack"] * 1.5);
        result += e[i][1].getHeal(e[i][1], healAmount);
      }
    }
    
    return result;
  }
  
  
  eventEnemyActive(source, e) {
    return this.eventEnemyBasic(source, e);
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    
    if (this._currentStats["totalHP"] > 0) {
      var targets = getRandomTargets(this, this._enemies);
      var speedDiff = 0;
      
      for (var i = 0; i < targets.length; i++) {
        if (targets[i]._currentStats["speed"] > this._currentStats["speed"]) {
          result += "<div>" + this.heroDesc() + " <span class='skill'>Exchange, Not Steal!</span> swapped speed with " + targets[i].heroDesc() + ".</div>";
          
          speedDiff = targets[i]._currentStats["speed"] - this._currentStats["speed"];
          result += this.getBuff(this, "Exchange, Not Steal!", 1, {speed: speedDiff});
          result += targets[i].getDebuff(this, "Exchange, Not Steal!", 1, {speed: speedDiff});
        }
        break;
      }
      
      
      var targets = getRandomTargets(this, this._allies);
      if (targets.length > 0) {
        result += targets[0].getBuff(this, "Fairy's Guard", 2, {});
      }
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = super.doBasic();
    var targets = getRandomTargets(this, this._enemies);
    
    if (targets.length > 0) {
      if (!("Shrink" in targets[0]._debuffs)) {
        result += targets[0].getDebuff(this, "Shrink", 2, {allDamageTaken: -0.30, allDamageDealt: 0.50});
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 4);
      result += targets[0].takeDamage(this, "You Miss Lilliput?!", damageResult);
      
      if (!("Shrink" in targets[0]._debuffs) && !("CarrieDodge" in damageResult) && targets[0]._currentStats["totalHP"] > 0) {
        result += targets[0].getDebuff(this, "Shrink", 2, {allDamageTaken: -0.30, allDamageDealt: 0.50});
      }
    }
    
    var targets = getRandomTargets(this, this._allies);
    var maxTargets = 3;
    if (targets.length < maxTargets) { maxTargets = targets.length; }
    
    for (var i = 0; i < maxTargets; i++) {
      result += targets[i].getBuff(this, "Fairy's Guard", 2, {});
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
  
  
  passiveStats() {
    // apply Spiritual Blessing passive
    this.applyStatChange({hpPercent: 0.40, speed: 50}, "PassiveStats");
  }
  
  
  takeDamage(source, strAttackDesc, damageResult, armorReduces=1) {
    var result = "";
    
    result += super.takeDamage(source, strAttackDesc, damageResult, armorReduces);
    
    if (this._currentStats["totalHP"] > 0  && this._currentStats["totalHP"] / this._stats["totalHP"] < 0.50 && this._currentStats["courageousTriggered"] == 0) {
      this._currentStats["courageousTriggered"] = 1;
      result += "<div>" + this.heroDesc() + " <span class='skill>Courageous</span> triggered.</div>";
      
      var targets = getAllTargets(this, this._allies);
      for (var h in targets) {
        result += targets[h].getBuff(this, "Courageous", 3, {attackPercent: 0.29});
      }
      
      targets = getAllTargets(this, this._enemies);
      for (var h in targets) {
        result += targets[h].getDebuff(this, "Courageous", 3, {armorPercent: 0.29});
      }
    }
    
    return result
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    var maxTargets = 3;
    
    if (targets.length < maxTargets) { maxTargets = targets.length; }
    
    for (var i = 0; i < maxTargets; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 0.8, "basic", "normal");
      result += targets[i].takeDamage(this, "Element Fission", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[i]._currentStats["totalHP"] > 0) {
          result += targets[i].getDebuff(this, "Element Fission", 3, {crit: 0.20});
        }
        
        basicQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
    
    for (var i=0; i < targets.length; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.16);
      result += targets[i].takeDamage(this, "Nether Nightmare", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[i]._currentStats["totalHP"] > 0) {
          result += targets[i].getDebuff(this, "Nether Nightmare", 3, {precision: 0.40});
        }
        
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    targets = getAllTargets(this, this._allies);
    for (var i=0; i < targets.length; i++) {
      result += targets[i].getBuff(this, "Nether Nightmare", 3, {speed: 30, attackPercent: 0.20});
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
  
  
  eventAllyBasic(source, e) {
    var result = "";
    
    if (!(this.isUnderStandardControl())) {
      var damageResult = {};
      
      result += "<div>" + this.heroDesc() + " <span class='skill'>Instinct of Hunt</span> passive triggered.</div>";
      result += this.getBuff(this, "Feather Blade", 99, {damageReduce: 0.04});
      result += this.getBuff(this, "Instinct of Hunt", 2, {crit: 0.05});
      
      for (var i=0; i<e.length; i++) {
        if (e[i][1]._currentStats["totalHP"] > 0) {
          this._rng = Math.random();
          damageResult = this.calcDamage(e[i][1], this._currentStats["totalAttack"] * 2.5, "passive", "normal");
          result += e[i][1].takeDamage(this, "Instinct of Hunt", damageResult);
        }
      }
    }
    
    return result;
  }
  
  
  eventAllyActive(source, e) {
    return this.eventAllyBasic(source, e);
  }
  
  
  eventAllyDied(e) {
    var result = "";
    
    if (this.isNotSealed()) {
      result += "<div>" + this.heroDesc() + " <span class='skill'>Unbeatable Force</span> passive triggered.</div>";
      
      var healAmount = this.calcHeal(this, this._stats["totalHP"] * 0.3);
      result += this.getHeal(this, healAmount);
      result += this.getBuff(this, "Feather Blade", 99, {damageReduce: 0.04});
      result += this.getBuff(this, "Feather Blade", 99, {damageReduce: 0.04});
    }
    
    return result;
  }
  
  
  eventEnemyDied(e) {
    return this.eventAllyDied(e);
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    var numTargets = 3;
    
    if (targets.length < numTargets) {
      numTargets = targets.length;
    }
    
    for (var i=0; i<numTargets; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 4.8);
      result += targets[i].takeDamage(this, "Fatal Feather", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    // Use up all Feather Blades
    if ("Feather Blade" in this._buffs) {
      var numBlades = Object.keys(this._buffs["Feather Blade"]).length;
      for (var i=1; i<= numBlades; i++) {
        this._rng = Math.random();
        targets = getRandomTargets(this, this._enemies);
        
        if (targets.length > 0) {
          this._rng = Math.random();
          damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active2", "normal", 3.2);
          result += targets[0].takeDamage(this, "Feather Blade", damageResult);
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
  
  
  eventEnemyDied(e) {
    var result = "";
    
    if (this.isNotSealed()) {
      result += this.getEnergy(this, 100);
      result += this.getBuff(this, "Blood Nourishing", 3, {holyDamage: 0.30});
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getLowestHPTargets(this, this._enemies);
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 2, "basic", "normal");
      result += targets[0].takeDamage(this, "Basic Attack", damageResult, 0);
      
      if (!("CarrieDodge" in damageResult)) {
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {damageAmount: 0};
    var hpDamage = 0;
    var hpDamageResult = {damageAmount: 0};
    var targets = getLowestHPTargets(this, this._enemies);
    var maxTargets = 2;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 3);
      result += targets[i].takeDamage(this, "Blade Assault", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[i]._currentStats["totalHP"] > 0) {
          additionalDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active2", "normal", 1.08);
          result += targets[i].takeDamage(this, "Blade Assault 2", additionalDamageResult, 0);
        }
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          hpDamage = 0.20 * (targets[i]._stats["totalHP"] - targets[i]._currentStats["totalHP"]);
          if (hpDamage > this._currentStats["totalAttack"] * 15) { hpDamage = this._currentStats["totalAttack"] * 15; }
          hpDamageResult = this.calcDamage(targets[i], hpDamage, "active2", "hpPercent");
          result += targets[i].takeDamage(this, "Blade Assault HP", hpDamageResult);
        }
        
        if (targets[i]._currentStats["totalHP"] > this._currentStats["totalHP"]) {
          result += targets[i].getDebuff(this, "stun", 2);
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"] + hpDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
}


// Gustin
class Gustin extends hero {
  passiveStats() {
    // apply Shadow Imprint passive
    this.applyStatChange({hpPercent: 0.25, speed: 30, controlImmune: 0.3, effectBeingHealed: 0.3}, "PassiveStats");
  }
  
  startOfRound(roundNum) {
    var targets = getRandomTargets(this, this._enemies);
    var linked = false;
    var result = "";
    
    if (targets.length > 0) {
      for (var i = 0; i < targets.length; i++) {
        if ("Link of Souls" in targets[i]._debuffs) { linked = true; }
      }
      
      if (!(linked)) {
        result += targets[0].getDebuff(this, "Link of Souls", 99, {});
      }
    }
    
    return result;
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    var targets = [];
    
    if (Math.random() < 0.5 && this._currentStats["totalHP"] > 0) {
      targets = getRandomTargets(this, this._enemies);
      var maxTargets = 2;
      if (targets.length < maxTargets) { maxTargets = targets.length; }
      
      for (var i = 0; i < maxTargets; i++) {
        result += "<div>" + this.heroDesc() + " <span class='skill'>Cloak of Fog</span> drained " + targets[i].heroDesc() + " energy.</div>";
        result += targets[i].loseEnergy(this, 30);
      }
    }
    
    if ("Demon Totem" in this._buffs) {
      targets = getLowestHPTargets(this, this._allies);
      if (targets.length > 0) {
        var healAmount = this.calcHeal(this, 0.25 * targets[0]._stats["totalHP"]);
        result += targets[0].getHeal(this, healAmount);
      }
    }
    
    return result;
  }
  
  
  eventEnemyBasic(source, e) {
    var result = "";
    
    if ("Demon Totem" in this._buffs) {
      for (var i in e) {
        if (this._currentStats["demonTotemStacks"] > 0 && Math.random() < 0.6) {
          this._currentStats["demonTotemStacks"]--;
          result += "<div>" + this.heroDesc() + " <span class='skill'>Demon Totem</span> triggered dispell.</div>";
          
          var listDebuffs = []; 
          var allDebuffs = Object.keys(e[i][1]._debuffs);
          var maxDispell = 2;
          
          for (var d in allDebuffs) {
            if (isDispellable(allDebuffs[d])) {
              listDebuffs.push([allDebuffs[d], Math.random()]);
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
  
  
  eventEnemyActive(source, e) {
    return this.eventEnemyBasic(source, e);
  }
  
  
  takeDamage(source, strAttackDesc, damageResult, armorReduces=1) {
    var result = "";
    var preHP = this._currentStats["totalHP"];
    
    result += super.takeDamage(source, strAttackDesc, damageResult, armorReduces);
    
    var postHP = this._currentStats["totalHP"];
    var damageAmount = 0.70 * (preHP - postHP);
    
    if (damageAmount > 0 && source._currentStats["totalHP"] > 0  && (damageResult["damageType"].substring(0, 6) == "active" || damageResult["damageType"].substring(0, 5) == "basic")) {
      var damageResult = this.calcDamage(source, damageAmount, "passive", "true");
      result += source.takeDamage(this, "Link of Souls", damageResult);
    }
    
    return result
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    var maxTargets = 2;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2);
      result += targets[i].takeDamage(this, "Demon Totem", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[i]._currentStats["totalHP"] > 0 && Math.random() < 0.60) {
          for (var b in targets[i]._buffs) {
            for (var s in targets[i]._buffs[b]) {
              if (isAttribute(b, targets[i]._buffs[b][s]["effects"])) {
                result += targets[i].removeBuff(b, s);
              }
            }
          }
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    result += this.getBuff(this, "Demon Totem", 3, {});
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
  
  
  eventEnemyBasic(source, e) {
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
      var targets = getRandomTargets(this, this._enemies);
      var totalDamage = 0;
      var maxTargets = 3;
      
      if (targets.length < maxTargets) { maxTargets = targets.length; }
      
      for (var i = 0; i < maxTargets; i++) {
        damageResult = this.calcDamage(targets[i], damageAmount, "passive", "hpPercent");
        result += targets[i].takeDamage(this, "Crimson Contract", damageResult);
        totalDamage += damageResult["damageAmount"];
      }
      
      var healAmount = this.calcHeal(this, totalDamage * 0.4);
      result += this.getHeal(this, healAmount);
    }
    
    return result;
  }
  
  
  eventAllyBasic(source, e) {
    return this.eventEnemyBasic(source, e);
  }
  
  
  eventEnemyActive(source, e) {
    var result = "";
    
    result += this.getBuff(this, "Descending Raven", 99, {attackPercent: 0.05, critDamage:0.02});
    result += this.eventEnemyBasic(e);
    
    return result;
  }
  
  
  eventAllyActive(source, e) {
    return this.eventEnemyActive(source, e);
  }
  
  
  takeDamage(source, strAttackDesc, damageResult, armorReduces=1) {
    var result = super.takeDamage(source, strAttackDesc, damageResult, armorReduces);
    
    if (damageResult["blocked"] == true) {
      this._currentStats["blockCount"]++;
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var bleedDamageResult = {};
    var additionalDamage = 0;
    var additionalDamageResult = {damageAmount: 0};
    var targets = getRandomTargets(this, this._enemies);
    var numTargets = 3;
    
    if (targets.length < numTargets) {
      numTargets = targets.length;
    }
    
    for (var i=0; i<numTargets; i++) {
      this._rng = Math.random();
      
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.06);
      result += targets[i].takeDamage(this, "Torment of Flesh and Soul", damageResult);
      
      
      if (targets[i]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult)) {
        bleedDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active2", "bleed", 1, 3);
        bleedDamageResult["damageAmount"] = Math.round(bleedDamageResult["damageAmount"]);
        result += targets[i].getDebuff(this, "Torment of Flesh and Soul", 3, {bleed: bleedDamageResult["damageAmount"]});
      }
      
      
      if (targets[i]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult)) {
        if (isFrontLine(targets[i], this._enemies)) {
          additionalDamage = targets[i]._stats["totalHP"] * 0.15;
          var maxDamage = this._currentStats["totalAttack"] * 15;
          if (additionalDamage > maxDamage) { additionalDamage = maxDamage; }
          
          additionalDamageResult = this.calcDamage(targets[i], additionalDamage, "active2", "hpPercent");
          result += targets[i].takeDamage(this, "Torment of Flesh and Soul Front Line", additionalDamageResult);
          
        }
        
        if (damageResult["critted"] == true && isBackLine(targets[i], this._enemies)){
          additionalDamageResult = this.calcDamage(targets[i], damageResult["damageAmount"] * 1.08, "active2", "true");
          result += targets[i].takeDamage(this, "Torment of Flesh and Soul Back Line", additionalDamageResult);
        }
        
      }
      
      if (!("CarrieDodge" in damageResult)) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getFrontTargets(this, this._enemies);
    
    for (var i=0; i<targets.length; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "basic", "normal");
      result += targets[i].takeDamage(this, "Basic Attack", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
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
  
  
  eventEnemyDied(e) {
    var result = "";
    
    if (this.isNotSealed() && e[0].heroDesc() == this.heroDesc()) {
      var targets = getRandomTargets(this, this._enemies);
      
      if (targets.length > 0) {
        result += targets[0].getDebuff(this, "Ghost Possessed", 3);
      }
      
      result += this.getBuff(this, "Poisonous Blade", 3, {armorBreak: 1.0});
    }
    
    return result;
  }
  
  
  eventAllyActive(source, e) {
    var result = "";
    var damageResult = {};
    
    if (source.heroDesc() == this.heroDesc()) {
      for (var i in e) {
        if (e[i][1]._currentStats["totalHP"] > 0) {
          damageResult = this.calcDamage(e[i][1], e[i][2] * 0.25, "passive", "poison");
          result += e[i][1].getDebuff(this, "Poisonous Blade - Poison", 2, {poison: Math.round(damageResult["damageAmount"])});
          
          if (e[i][1]._currentStats["totalHP"] > 0 && e[i][3] == true) {
            damageResult = this.calcDamage(e[i][1], e[i][2] * 0.25, "passive", "bleed");
            result += e[i][1].getDebuff(this, "Poisonous Blade - Bleed", 2, {bleed: Math.round(damageResult["damageAmount"])});
          }
        }
      }
    }
    
    return result;
  }
  
  
  eventAllyBasic(source, e) {
    return this.eventAllyActive(source, e);
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getLowestHPTargets(this, this._enemies);
    var healAmount = 0;
    
    for (var i=0; i < this._enemies.length; i++) {
      if (this._enemies[i]._currentStats["totalHP"] > 0 && "Ghost Possessed" in this._enemies[i]._debuffs) {
        damageResult = this.calcDamage(this._enemies[i], this._currentStats["totalAttack"] * 1.8, "basic", "normal");
        result += this._enemies[i].takeDamage(this, "GP - Basic Attack", damageResult);
        
        if (!("CarrieDodge" in damageResult)) {
          basicQueue.push([this, this._enemies[i], damageResult["damageAmount"], damageResult["critted"]]);
          healAmount = this.calcHeal(this, damageResult["damageAmount"]);
          result += this.getHeal(this, healAmount);
        }
        
        if (this._enemies[i]._currentStats["totalHP"] > 0) {
          result += this._enemies[i].getDebuff(this, "Ghost Possessed", 3);
        }
        
        this._rng = Math.random();
      }
    }
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 1.8, "basic", "normal");
      result += targets[0].takeDamage(this, "Basic Attack", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[0]._currentStats["totalHP"] > 0) {
          result += targets[0].getDebuff(this, "Ghost Possessed", 3);
        }
        
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getLowestHPTargets(this, this._enemies);
    var healAmount = 0;
    var hpDamage = 0;
    var hpDamageResult = {damageAmount: 0};
    
    for (var i=0; i < this._enemies.length; i++) {
      if (this._enemies[i]._currentStats["totalHP"] > 0 && "Ghost Possessed" in this._enemies[i]._debuffs) {
        damageResult = this.calcDamage(this._enemies[i], this._currentStats["totalAttack"], "active", "normal", 4.4);
        result += this._enemies[i].takeDamage(this, "GP - Ghost Possession", damageResult);
        
        if (!("CarrieDodge" in damageResult)) {
          if (this._enemies[i]._currentStats["totalHP"] > 0) {
            hpDamage = this._enemies[i]._currentStats["totalHP"] * 0.10;
            if (hpDamage > this._currentStats["totalAttack"] * 15) { hpDamage = this._currentStats["totalAttack"] * 15; }
            hpDamageResult = this.calcDamage(this._enemies[i], hpDamage, "active2", "hpPercent");
            result += this._enemies[i].takeDamage(this, "Ghost Possession HP", hpDamageResult);
            
            if (this._enemies[i]._currentStats["totalHP"] > 0) {
              result += this._enemies[i].getDebuff(this, "Ghost Possessed", 3);
            }
          }
        
          activeQueue.push([this, this._enemies[0], damageResult["damageAmount"] + hpDamageResult["damageAmount"], damageResult["critted"]]);
          healAmount = this.calcHeal(this, damageResult["damageAmount"] + hpDamageResult["damageAmount"]);
          result += this.getHeal(this, healAmount);
        }
        
        this._rng = Math.random();
      }
    }
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 4.4);
      result += targets[0].takeDamage(this, "Ghost Possession", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[0]._currentStats["totalHP"] > 0) {
          hpDamage = targets[0]._currentStats["totalHP"] * 0.10;
          if (hpDamage > this._currentStats["totalAttack"] * 15) { hpDamage = this._currentStats["totalAttack"] * 15; }
          hpDamageResult = this.calcDamage(targets[0], hpDamage, "active2", "hpPercent");
          result += targets[0].takeDamage(this, "Ghost Possession HP", hpDamageResult);
          
          if (targets[0]._currentStats["totalHP"] > 0) {
            result += targets[0].getDebuff(this, "Ghost Possessed", 3);
          }
        }
        
        activeQueue.push([this, targets[0], damageResult["damageAmount"] + hpDamageResult["damageAmount"], damageResult["critted"]]);
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
  
  
  takeDamage(source, strAttackDesc, damageResult, armorReduces=1) {
    var result = "";
    
    result += super.takeDamage(source, strAttackDesc, damageResult, armorReduces);
    
    if (this._currentStats["totalHP"] > 0  && this._currentStats["totalHP"] / this._stats["totalHP"] < 0.50 && this._currentStats["flameInvasionTriggered"] == 0) {
      this._currentStats["flameInvasionTriggered"] = 1;
      result += "<div>" + this.heroDesc() + " <span class='skill'>Flame Invasion</span> triggered.</div>";
      
      var targets = getAllTargets(this, this._enemies);
      for (var h in targets) {
        if (Math.random() < 0.75 + this._currentStats["controlPrecision"]) {
          result += targets[h].getDebuff(this, "stun", 2, {});
        }
      }
    }
    
    return result
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getBackTargets(this, this._enemies);
    
    for (var i = 0; i < targets.length; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 0.90, "basic", "normal");
      result += targets[i].takeDamage(this, "Vicious Fire Perfusion", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[i]._currentStats["totalHP"] > 0) {
          result += targets[i].getDebuff(this, "Vicious Fire Perfusion", 3, {armorPercent: 0.15});
        }
        
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    
    var maxTargets = 2;
    var healAmount = 0;
    
    targets = getRandomTargets(this, this._allies);
    if (targets.length < maxTargets) { maxTargets = targets.length; }
    
    for (var i = 0; i < maxTargets; i++) {
      healAmount = this.calcHeal(targets[i], targets[i]._stats["totalHP"] * 0.20);
      result += targets[i].getHeal(this, healAmount);
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    var maxTargets = 4;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.5);
      result += targets[i].takeDamage(this, "Weak Curse", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[i]._currentStats["totalHP"] > 0) {
          if (!("Weak Curse" in targets[i]._debuffs)) {
            result += targets[i].getDebuff(this, "Weak Curse", 3, {allDamageTaken: -0.50});
          }
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    this._currentStats["energy"] = 0;
    targets = getRandomTargets(this, this._allies);
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
  
  
  startOfRound(roundNum) {
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
      result += this.getBuff(this, "Blaze of Seraph", 99);
    }
    
    return result;
  }
  
  
  eventAllyBasic(source, e) {
    var result = "";
    
    if ("Blaze of Seraph" in source._buffs) {
      for (var i = 0; i < e.length; i++) {
        var damageAmount = e[i][1]._stats["totalHP"] * 0.06;
        if (damageAmount > this._currentStats["totalAttack"] * 5) {
          damageAmount = this._currentStats["totalAttack"] * 5;
        }
        
        var damageResult = this.calcDamage(e[i][1], damageAmount, "passive", "hpPercent");
        result += e[i][1].getDebuff(this, "Blaze of Seraph Burn", 2, {burnTrue: Math.round(damageResult["damageAmount"])});
      }
    }
    
    return result;
  }
  
  
  eventAllyActive(source, e) {
    return this.eventAllyBasic(source, e);
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    var maxTargets = 4;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.98);
      result += targets[i].takeDamage(this, "Divine Sanction", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[i]._currentStats["totalHP"] > 0 && Math.random() < 0.4 + this._currentStats["controlPrecision"]) {
          result += targets[i].getDebuff(this, "stun", 2);
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    targets = getLowestHPPercentTargets(this, this._allies);
    if (targets.length > 0) {
      var healAmount = this.calcHeal(targets[0], this._currentStats["totalAttack"] * 10);
      result += targets[0].getHeal(this, healAmount);
    }
    
    targets = getRandomTargets(this, this._allies);
    if (targets.length > 0) {
      result += targets[0].getBuff(this, "Blaze of Seraph", 3);
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
  
  
  eventEnemyDied(e) {
    var result = "";
    
    if (this.isNotSealed() && this._currentStats["totalHP"] > 0) {
      var targets = getAllTargets(this, this._enemies);
      var damageResult = {};
      
      for (var i = 0; i < targets.length; i++) {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 2, "passive", "dot");
        result += targets[i].getDebuff(this, "Shadow Fission", 2, {dot: damageResult["damageAmount"]});
      }
    }
    
    return result;
  }
  
  
  eventAllyDied(e) {
    return this.eventEnemyDied(e);
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getLowestHPTargets(this, this._enemies);
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 1.4, "basic", "normal");
      result += targets[0].takeDamage(this, "Energy Absorbing", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[0]._currentStats["totalHP"] > 0) {
          result += targets[0].loseEnergy(this, 60);
        }
        
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 4);
      result += targets[0].takeDamage(this, "Collapse Rays", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[0]._currentStats["totalHP"] > 0) {
          if (isFrontLine(targets[0], this._enemies)) {
            result += targets[0].getDebuff(this, "Collapse Rays Armor", 3, {armorPercent: 0.75});
            result += targets[0].getDebuff(this, "petrify", 2);
          }
          
          if (isBackLine(targets[0], this._enemies)) {
            result += targets[0].getDebuff(this, "Collapse Rays Backline", 3, {attackPercent: 0.30, speed: 80});
          }
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
  
  
  eventAllyBasic(source, e) {
    var result = "";
    
    if (source.heroDesc() == this.heroDesc()) {
      var damageResult = {};
      
      for (var i = 0; i < e.length; i++) {
        if (e[i][1]._currentStats["totalHP"] > 0 && e[i][1].hasStatus("bleed")) {
          this._rng = Math.random();
          damageResult = this.calcDamage(e[i][1], this._currentStats["totalAttack"], "passive", "bleed");
          result += e[i][1].getDebuff(this, "Relentless Rage", 3, {bleed: Math.round(damageResult["damageAmount"])});
          
          if (e[i][3] == true) {
            result += e[i][1].getDebuff(this, "Relentless Rage Crit Bleed", 3, {bleed: Math.round(damageResult["damageAmount"])});
          }
        }
      }
    }
    
    return result;
  }
  
  
  eventAllyActive(source, e) {
    return this.eventAllyBasic(source, e);
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getBackTargets(this, this._enemies);
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[targets.length-1], this._currentStats["totalAttack"], "basic", "normal");
      result += targets[targets.length-1].takeDamage(this, "Basic Attack", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        basicQueue.push([this, targets[targets.length-1], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    for (var i in targets) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "basic", "bleed");
      result += targets[i].getDebuff(this, "Abyss of Torment", 3, {bleed: Math.round(damageResult["damageAmount"]), speed: 30});
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var bleedDamageResult = {damageAmount: 0};
    var targets = getBackTargets(this, this._enemies);
    var maxTargets = 2;
    
    if (targets.length < maxTargets) { maxTargets = targets.length; }
    
    for (var i in targets) {
      targets[i]._rng = Math.random;
    }
    
    targets.sort(function(a,b) {
      if (a._rng < b._rng) {
        return -1;
      } else {
        return 1;
      }
    });
    
    for (var i = 0; i < maxTargets; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.3);
      result += targets[i].takeDamage(this, "Ferocious Bite", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[i]._currentStats["totalHP"] > 0) {
          bleedDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active2", "bleed", 1.98 * 15, 15);
          result += targets[i].getDebuff(this, "Ferocious Bite", 15, {bleed: Math.round(bleedDamageResult["damageAmount"] / 15)});
        }
        
        if ("Relentless Rage" in targets[i]._debuffs && targets[i]._currentStats["totalHP"] > 0) {
          result += targets[i].getDebuff(this, "Ferocious Bite Slow Bleed", 15, {bleed: Math.round(bleedDamageResult["damageAmount"] / 15)});
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
  
  
  twine(target) {
    var result = "";
    
    if (this.isNotSealed() && this._currentStats["totalHP"] > 0) {
      var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 1.8);
      result += this.getHeal(this, healAmount);
      result += this.getBuff(this, "Natural Manipulation", 6, {attackPercent: 0.20});
      
      
      var damageResult = {};
      var targets = getRandomTargets(this, this._enemies);
      var maxTargets = 3;
      
      if (targets.length < maxTargets) { maxTargets = targets.length; }
      
      for (var i = 0; i < maxTargets; i++) {
        this._rng = Math.random();
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 6, "passive", "poison", 1, 1, 3);
        result += targets[i].getDebuff(this, "Natural Manipulation", 3, {poison: Math.round(damageResult["damageAmount"] / 3)});
      }
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "basic", "normal");
      result += targets[0].takeDamage(this, "Basic Attack", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    
    targets = getRandomTargets(this, this._enemies);
    if (targets.length > 0) {
      result += targets[0].getDebuff(this, "Sow Seeds", 1, {rounds: 1});
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    var i = 0;
    
    for ( ; i < targets.length; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.85);
      result += targets[i].takeDamage(this, "Lethal Twining", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[i]._currentStats["totalHP"] > 0) {
          result+= targets[i].getDebuff(this, "twine", 2);
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
      
      i++;
      break;
    }
    
    
    for ( ; i < targets.length; i++) {
      if (targets[i]._currentStats["totalHP"] > 0) {
        this._rng = Math.random();
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.25);
        result += targets[i].takeDamage(this, "Lethal Twining", damageResult);
        
        if (!("CarrieDodge" in damageResult)) {
          if (targets[i]._currentStats["totalHP"] > 0) {
            result+= targets[i].getDebuff(this, "Sow Seeds", 1, {rounds: 2});
          }
          
          activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
        }
        
        i++;
        break;
      }
    }
    
    
    for ( ; i < targets.length; i++) {
      if (targets[i]._currentStats["totalHP"] > 0) {
        this._rng = Math.random();
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.65);
        result += targets[i].takeDamage(this, "Lethal Twining", damageResult);
        
        if (!("CarrieDodge" in damageResult)) {
          if (targets[i]._currentStats["totalHP"] > 0) {
            result+= targets[i].getDebuff(this, "Sow Seeds", 2, {rounds: 2});
          }
          
          activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
        }
        
        i++;
        break;
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
  
  
  eventAllyBasic(source, e) {
    var result = "";
    
    for (var i in e) {
      if (this.heroDesc() == source.heroDesc() && e[i][3] == true) {
        var damageResult = {};
        var targets = getAllTargets(this, this._enemies);
        
        result += "<div>" + this.heroDesc() + " <span class='skill'>Eerie Trickery</span> triggered on crit.</div>";
        
        for (var h=0; h<targets.length; h++) {
          if (targets[h]._currentStats["totalHP"] > 0) {
            damageResult = this.calcDamage(targets[h], e[i][2], "passive", "true");
            result += targets[h].takeDamage(this, "Eerie Trickery", damageResult);
          }
        }
        
        result += this.getBuff(this, "Dynamite Armor", 99, {});
        result += this.getBuff(this, "Reflection Armor", 99, {});
      }
    }
    
    return result;
  }
  
  
  eventAllyActive(source, e) {
    return this.eventAllyBasic(source, e);
  }
  
  
  takeDamage(source, strAttackDesc, damageResult, armorReduces=1) {
    var result = "";
    var reflectDamageResult = {};
    var tempDamageAmount = damageResult["damageAmount"];
    var tempHolyDamage = damageResult["holyDamage"];
    
    var armorBreak = source._currentStats["armorBreak"] >= 1 ? 1 : source._currentStats["armorBreak"];
    var armorMitigation = armorReduces * (this._currentStats["totalArmor"] * (1 - armorBreak) / (180 + 20*(this._heroLevel)));
    var reduceDamage = this._currentStats["damageReduce"] > 0.75 ? 0.75 : this._currentStats["damageReduce"];
    var classDamageReduce = this._currentStats[source._heroClass.toLowerCase() + "Reduce"];
    var allDamageReduce = this._currentStats["allDamageReduce"];
    
    if (["hpPercent", "energy", "true"].includes(damageResult["damageType"])) {
      armorMitigation = 0;
      reduceDamage = 0;
      classDamageReduce = 0;
    }
    
    if (isDot(damageResult["damageType"])) {
      var dotReduce = this._currentStats["dotReduce"];
      tempDamageAmount = tempDamageAmount * (1 - dotReduce);
    }
    
    tempDamageAmount = Math.round(tempDamageAmount * (1-allDamageReduce) * (1-reduceDamage) * (1-armorMitigation) * (1-classDamageReduce));
    tempHolyDamage = Math.round(tempHolyDamage * (1-allDamageReduce) * (1-reduceDamage) * (1-classDamageReduce));
    
    
    if (["active", "active2", "basic", "basic2"].includes(damageResult["damageSource"]) && "Reflection Armor" in this._buffs && !("Guardian Shadow" in this._buffs)) {
      damageResult["damageAmount"] = damageResult["damageAmount"] / 2;
      damageResult["holyDamage"] = damageResult["holyDamage"] / 2;
      
      result += super.takeDamage(source, strAttackDesc, damageResult, armorReduces);
      
      result += "<div><span class='skill'>Reflection Armor</span> consumed.</div>";
      tempDamageAmount = Math.floor(tempDamageAmount / 2) + Math.floor(tempHolyDamage / 2);
      
      reflectDamageResult = source.calcDamage(this, tempDamageAmount, "passive", "true");
      result += source.takeDamage(this, "Reflection Armor", reflectDamageResult, armorReduces);
      this._currentStats["damageHealed"] += tempDamageAmount;
      
      var keyDelete = Object.keys(this._buffs["Reflection Armor"]);
      if (keyDelete.length <= 1) {
        delete this._buffs["Reflection Armor"];
      } else {
        delete this._buffs["Reflection Armor"][keyDelete[0]];
      }
      
    } else {
      result += super.takeDamage(source, strAttackDesc, damageResult, armorReduces);
    }
    
    return result;
  }
  
  
  getDebuff(source, debuffName, duration, effects) {
    var result = "";
    var isControl = isControlEffect(debuffName, effects);
    
    if ("Dynamite Armor" in this._buffs && isControl) {
      var controlImmune = this._currentStats["controlImmune"];
      
      if (isControl) {
        if ((debuffName + "Immune") in this._currentStats) {
          controlImmune = 1 - (1-controlImmune) * (1 - this._currentStats[debuffName + "Immune"]);
        }
        
        if (Math.random() < controlImmune && isControl) {
          result += "<div>" + this.heroDesc() + " resisted debuff <span class='skill'>" + debuffName + "</span>.</div>";
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
      result += super.getDebuff(source, debuffName, duration, effects);
    }
    
    return result;
  }
  
  
  doBasic() { 
    var result = "";
    var damageResult = {};
    var targets = getFrontTargets(this, this._enemies);
    
    for (var i in targets) {
      if (targets[i]._currentStats["totalHP"] > 0) {
        targets[i]._rng = Math.random();
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 1.8, "basic", "normal");
        result += targets[i].takeDamage(this, "Gunshot Symphony", damageResult);
        
        if (!("CarrieDodge" in damageResult)) {
          basicQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
        }
      }
    }
    
    result += this.getBuff(this, "Gunshot Symphony", 2, {critDamage: 0.4});
    result += this.getBuff(this, "Reflection Armor", 99, {});
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var burnDamageResult = {};
    var targets = getHighestHPTargets(this, this._enemies);
    
    if (targets.length > 0) {
      if (targets[0]._currentStats["totalHP"] > 0) {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 4.5);
        result += targets[0].takeDamage(this, "Fatal Fireworks", damageResult);
        
        if (!("CarrieDodge" in damageResult)) {
          activeQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
        }
        
        if (!("CarrieDodge" in damageResult) && targets[0]._currentStats["totalHP"] > 0) {
          burnDamageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active2", "burn", 1.5, 6);
          result += targets[0].getDebuff(this, "Fatal Fireworks Burn", 6, {burn: Math.round(burnDamageResult["damageAmount"])});
        }
      }
    }
    
    result += this.getBuff(this, "Dynamite Armor", 99, {});
    
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
  
  
  takeDamage(source, strAttackDesc, damageResult, armorReduces=1) {
    var result = "";
    
    result += super.takeDamage(source, strAttackDesc, damageResult, armorReduces);
    
    var postHP = this._currentStats["totalHP"];
    
    if (this.isNotSealed() && this._currentStats["totalHP"] > 0 && postHP/this._stats["totalHP"] < 0.50 && this._currentStats["wellCalculatedStacks"] > 1) {
      this._currentStats["wellCalculatedStacks"] -= 2;
      
      var targets = getHighestHPTargets(this, this._enemies);
      
      if (targets.length > 0) {
        if (targets[0]._currentStats["totalHP"] > this._currentStats["totalHP"]) {
          var swapAmount = targets[0]._currentStats["totalHP"] - this._currentStats["totalHP"];
          if (swapAmount > this._currentStats["totalAttack"] * 50) { swapAmount = Math.floor(this._currentStats["totalAttack"] * 50);}
          
          this._currentStats["totalHP"] += swapAmount;
          targets[0]._currentStats["totalHP"] -= swapAmount;
          
          this._currentStats["damageHealed"] += swapAmount;
          this._currentStats["damageDealt"] += swapAmount;
          
          result += "<div>" + this.heroDesc() + " <span class='skill'>Deceiving Tricks</span> swapped " + formatNum(swapAmount) + " HP with " + source.heroDesc() + ".</div>";
        }
      }
    }
    
    return result
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    
    if (this._currentStats["totalHP"] > 0) {
      if(Math.random() < 0.5) {
        result = "<div>" + this.heroDesc() + " gained <span class='num'>2</span> stacks of <span class='skill'>Well-Calculated</span>.</div>";
        this._currentStats["wellCalculatedStacks"] += 2;
      } else {
        result = "<div>" + this.heroDesc() + " gained <span class='num'>1</span> stack of <span class='skill'>Well-Calculated</span>.</div>";
        this._currentStats["wellCalculatedStacks"] += 1;
      }
    }
    
    return result;
  }
  
  
  getDebuff(source, debuffName, duration, effects) {
    var result = "";
    
    if (isControlEffect(debuffName, effects) && this.isNotSealed() && this._currentStats["wellCalculatedStacks"] > 0 && !(["Seal of Light", "Magic Trick"].includes(debuffName))) {
      var controlImmune = this._currentStats["controlImmune"];
      
      if ((debuffName + "Immune") in this._currentStats) {
        controlImmune = 1 - (1-controlImmune) * (1 - this._currentStats[debuffName + "Immune"]);
      }
      
      if (Math.random() < controlImmune) {
        result += "<div>" + this.heroDesc() + " resisted debuff <span class='skill'>" + debuffName + "</span>.</div>";
      } else {
        this._currentStats["wellCalculatedStacks"] -= 1;
        
        // transfer cc
        result += "<div>" + this.heroDesc() + " <span class='skill'>Well-Calculated</span> transfered <span class='skill'>" + debuffName + "</span.</div>";
        
        var targets = getRandomTargets(this, this._enemies);
        if (targets.length > 0) {
          result += targets[0].getDebuff(this, debuffName, duration, effects)
        }
      }
      
    } else if (debuffName.includes("Mark") && this.isNotSealed() && this._currentStats["wellCalculatedStacks"] > 0) {
      this._currentStats["wellCalculatedStacks"] -= 1;
      result += "<div>" + this.heroDesc() + " <span class='skill'>Well-Calculated</span> prevented <span class='skill'>" + debuffName + "</span.</div>";
      
    } else {
      result += super.getDebuff(source, debuffName, duration, effects);
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "basic", "normal");
      result += targets[0].takeDamage(this, "Basic Attack", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[0]._currentStats["totalHP"] > 0 && !("Shapeshift" in targets[0]._debuffs) && Math.random() < 0.5 + this._currentStats["controlPrecision"]) {
          result += targets[0].getDebuff(this, "Shapeshift", 15, {stacks: 3});
        }
        
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    var maxTargets = 2;
    var ccChance = 1.0;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 3);
      result += targets[i].takeDamage(this, "Master Showman", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[i]._currentStats["totalHP"] > 0 && !("Shapeshift" in targets[i]._debuffs) && Math.random() < ccChance + this._currentStats["controlPrecision"]) {
          result += targets[i].getDebuff(this, "Shapeshift", 15, {stacks: 3});
        }
        
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
  
  
  eventAllyBasic(source, e) {
    var result = "";
    
    if (this.heroDesc() == source.heroDesc() && !(this.isUnderStandardControl())) {
      var damageResult = {};
      var targets = getAllTargets(this, this._enemies);
      
      for (var i=0; i<targets.length; i++) {
        if (targets[i]._currentStats["totalHP"] > 0) {
          this._rng = Math.random();
          damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 4, "passive", "normal");
          result += targets[i].takeDamage(this, "Fluctuation of Light", damageResult, 0);
          
          if (Math.random() < 0.3) {
            result += targets[i].getDebuff(this, "Power of Light", 99, {});
          }
        }
      }
    }
    
    return result;
  }
  
  
  eventAllyActive(source, e) {
    return this.eventAllyBasic(source, e);
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 3, "basic", "normal");
      result = targets[0].takeDamage(this, "Basic Attack", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
      
      if (!("CarrieDodge" in damageResult)) {
        result += targets[0].getDebuff(this, "Power of Light", 99, {});
      }
    }
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    var numAdditionalAttacks = 0;
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 3);
      result = targets[0].takeDamage(this, "Seal of Light", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        var numAdditionalAttacks = Math.floor(Math.random() * 3) + 1;
        damageResult["damageSource"] = "active2";
        
        for (var i=0; i<numAdditionalAttacks; i++) {
          result += targets[0].takeDamage(this, "Seal of Light", damageResult);
        }
        
        result += targets[0].getDebuff(this, "Power of Light", 99, {});
        activeQueue.push([this, targets[0], damageResult["damageAmount"] * (numAdditionalAttacks + 1), damageResult["critted"]]);
      }
      
      targets = getAllTargets(this, this._enemies);
      for (var h in targets) {
        if ("Power of Light" in targets[h]._debuffs && Math.random() < 0.6) {
          result += targets[h].getDebuff(this, "Power of Light", 99, {});
        }
      }
      
    }
      
    result += this.getBuff(this, "Tara Holy Damage Buff", 99, {holyDamage: 0.5});
    
    return result;
  }
}



// Unimax-3000
class UniMax3000 extends hero {
  passiveStats() {
    // apply Machine Forewarning passive
    this.applyStatChange({armorPercent: 0.3, hpPercent: 0.4, attackPercent: 0.25, controlImmune: 0.3, energy: 50}, "PassiveStats");
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    
    if (this._currentStats["totalHP"] > 0) {
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
        
        result += this.getBuff(this, "Energy Overload", 99, {critDamage: 0.5});
        result += this.getBuff(this, "Rampage", 99, {crit: 1.0});
      }
    }
    
    return result;
  }
  
  
  calcDamage(target, attackDamage, damageSource, damageType, skillDamage=1, canCrit=1, dotRounds=0, canBlock=1) {
    var result = "";
    
    if ("Rampage" in this._buffs) {
      result = super.calcDamage(target, attackDamage, damageSource, damageType, skillDamage, canCrit, dotRounds, 0);
    } else {
      result = super.calcDamage(target, attackDamage, damageSource, damageType, skillDamage, canCrit, dotRounds, canBlock);
    }
    
    return result;
  }
  
  
  eventEnemyBasic(source, e) {
    var result = "";
    
    for (var i in e) {
      if (this._currentStats["totalHP"] > 0 && e[i][1].heroDesc() == this.heroDesc()) {
        var attackStolen = Math.floor(source._currentStats["totalAttack"] * 0.2);
        
        result += "<div>" + this.heroDesc() + " <span class='skill'>Frenzied Taunt</span> triggered.</div>"
        result += source.getDebuff(this, "Frenzied Taunt", 2, {attackPercent: 0.2});
        result += this.getBuff(this, "Frenzied Taunt", 2, {attack: attackStolen});
        
        if (Math.random() < 0.3 + this._currentStats["controlPrecision"]) {
          result += source.getDebuff(this, "Taunt", 2, {});
        }
      }
    }
    
    return result;
  }
  
  
  eventEnemyActive(source, e) {
    return this.eventEnemyBasic(source, e);
  }
  
  
  doBasic() {
    var result = super.doBasic();
    var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 1.5);
    
    result += this.getBuff(this, "Frenzied Taunt", 2, {heal: healAmount});
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getBackTargets(this, this._enemies);
    
    for (var i=0; i<targets.length; i++) {
      this._rng = Math.random();
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 4.2);
      result += targets[i].takeDamage(this, "Iron Whirlwind", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"] * 2, damageResult["critted"]]);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          result += targets[i].takeDamage(this, "Iron Whirlwind", damageResult);
        }
        
        if (targets[i]._currentStats["totalHP"] > 0 && Math.random() < 0.5 + this._currentStats["controlPrecision"]) {
          result += targets[i].getDebuff(this, "Taunt", 2, {});
        }
      }
    }
    
    result += this.getBuff(this, "Iron Whirlwind", 2, {allDamageReduce: 0.2});
    
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
  
  "Augustus Magic Ball": {
    stats: {attackPercent: 0.25, speed: 70, block: 0.5},
    limit: "",
    limitStats: {}
  },
  
  "Demon Bell": {
    stats: {attackPercent: 0.18, hpPercent: 0.14, energy: 50},
    limit: "",
    limitStats: {}
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
  
  "Magic Stone Sword": {
    stats: {attackPercent: 0.21, damageReduce: 0.3, controlImmune: 0.25},
    limit: "",
    limitStats: {}
  },
  
  "Ruyi Scepter": {
    stats: {hpPercent: 0.25, speed: 75, controlPrecision: 0.5},
    limit: "",
    limitStats: {}
  },
  
  "Staff Punisher of Immortal": {
    stats: {attackPercent: 0.21, crit: 0.15, critDamage: 0.5},
    limit: "",
    limitStats: {}
  },
  
  "The Kiss of Ghost": {
    stats: {attackPercent: 0.25, armorBreak: 1.0, hpPercent: 0.14},
    limit: "",
    limitStats: {}
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
  }
};

/* End of artifact.js */


/* Start of avatarFrame.js */

var avatarFrames = {
  "None": {},
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
    stunImmune: {stunImmune: 0.01},
    freezeImmune: {freezeImmune: 0.01},
    petrifyImmune: {petrifyImmune: 0.01},
    twineImmune: {twineImmune: 0.01}
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
    stunImmune: {stunImmune: 0.01},
    freezeImmune: {freezeImmune: 0.01},
    petrifyImmune: {petrifyImmune: 0.01},
    twineImmune: {twineImmune: 0.01}
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
    stunImmune: {stunImmune: 0.01},
    freezeImmune: {freezeImmune: 0.01},
    petrifyImmune: {petrifyImmune: 0.01},
    twineImmune: {twineImmune: 0.01}
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
    stunImmune: {stunImmune: 0.01},
    freezeImmune: {freezeImmune: 0.01},
    petrifyImmune: {petrifyImmune: 0.01},
    twineImmune: {twineImmune: 0.01}
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
    stunImmune: {stunImmune: 0.01},
    freezeImmune: {freezeImmune: 0.01},
    petrifyImmune: {petrifyImmune: 0.01},
    twineImmune: {twineImmune: 0.01}
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
  
  "Sherlock": {
    "Skin Placeholder": {},
    "Legendary Skin Placeholder": {}
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

/* End of skin.js */


/* Start of stone.js */

var stones = {
  "None": {},
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
    className: mDeer,
    stats: {
      attack: 9604,
      hp: 231805,
      armorPercent: 0.2,
      block: 0.15,
      speed: 220,
      fixedAttack: 91238,
      fixedHP: 3477075
    }
  },
  
  "Phoenix": {
    className: mPhoenix,
    stats: {
      attack: 10377,
      hp: 201409,
      critDamage: 0.2,
      holyDamage: 0.2,
      speed: 220,
      fixedAttack: 98581,
      fixedHP: 3234270
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
  
  "Cthuga": {
    className: Cthuga,
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

/* End of baseHeroStats.js */


/* Start of utilityFunctions.js */

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
  if (["Seal of Light", "Power of Light", "Ghost Possessed", "Link of Souls", "Demon Totem", "Shrink"].includes(strName)) {
    return false;
  } else {
    return true;
  }
}


function isControlEffect(strName, effects={}) {
  if (["stun", "petrify", "freeze", "twine", "Silence", "Taunt", "Seal of Light", "Horrify", "Shapeshift"].includes(strName)) {
    return true;
  } else {
    return false;
  }
}


function isDot(strName, effects={}) {
  if (["burn", "bleed", "poison", "dot", "burnTrue"].includes(strName)) {
    return true;
  } else {
    for (var e in effects) {
      if (["burn", "bleed", "poison", "dot", "burnTrue"].includes(e)) {
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
    "fixedHP", "allDamageTaken", "allDamageDealt", "damageAgainstBurning", "damageAgainstBleed",
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
  
  if (!(isMonster(source))) {
    if (!(source._attOrDef == arrTargets[0]._attOrDef) && "Taunt" in source._debuffs) {
      for (var s in source._debuffs["Taunt"]) {
        if (source._debuffs["Taunt"][s]["source"]._currentStats["totalHP"] > 0) {
          copyTargets.push(source._debuffs["Taunt"][s]["source"]);
          return copyTargets;
        }
      }
    }
  }
  
  return arrTargets;
}

/* End of utilityFunctions.js */


/* Start of simulation.js */

var deathQueue = [];
var basicQueue = [];
var activeQueue = [];
var damageInRound = 0;


function runSim(attMonsterName, defMonsterName, numSims) {
  //var oCombatLog = document.getElementById("combatLog");
  //var numSims = document.getElementById("numSims").value;
  var roundNum = 0;
  var winCount = 0;
  var orderOfAttack = [];
  var numOfHeroes = 0;
  var result = {};
  var monsterResult = "";
  var someoneWon = "";
  var endRoundDesc = "";
  var numLiving = 0;
  
  
  var attMonsterName = document.getElementById("attMonster").value;
  var attMonster = new baseMonsterStats[attMonsterName]["className"](attMonsterName, "att");
  
  var defMonsterName = document.getElementById("defMonster").value;
  var defMonster = new baseMonsterStats[defMonsterName]["className"](defMonsterName, "def");
  
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
    
    ////if(numSims == 1) {oCombatLog.innerHTML += "<p class ='logSeg'>Simulation #" + formatNum(simIterNum) +" Started.</p>"};
    someoneWon = "";
    attMonster._energy = 0;
    defMonster._energy = 0;
    
    // snapshot stats as they are
    orderOfAttack = [];
    
    numOfHeroes = attHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (attHeroes[i]._heroName != "None") {
        attHeroes[i].snapshotStats();
        attHeroes[i]._buffs = {};
        attHeroes[i]._debuffs = {};
        orderOfAttack.push(attHeroes[i]);
      }
    }
    
    numOfHeroes = defHeroes.length;
    for (var i = 0; i < numOfHeroes; i++) {
      if (defHeroes[i]._heroName != "None") {
        defHeroes[i].snapshotStats();
        defHeroes[i]._buffs = {};
        defHeroes[i]._debuffs = {};
        orderOfAttack.push(defHeroes[i]);
      }
    }
    
    for (roundNum = 1; roundNum <= 15; roundNum++) {
      // @ start of round
      
      // track amount of damage done in a round for Aida
      damageInRound = 0;
      
      // Output detailed combat log only if running a single simulation
      //if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg'>Round " + formatNum(roundNum) + " Start</p>";}
      
      orderOfAttack.sort(speedSort);
      
      // trigger hero start of round abilities
      for (var h in attHeroes) {
        if (attHeroes[h].isNotSealed()) {
          temp = attHeroes[h].startOfRound(roundNum);
          //if(numSims == 1) {oCombatLog.innerHTML += temp;}
        }
      }
      
      for (var h in defHeroes) {
        if (defHeroes[h].isNotSealed()) {
          temp = defHeroes[h].startOfRound(roundNum);
          //if(numSims == 1) {oCombatLog.innerHTML += temp;}
        }
      }
      
      
      for (var orderNum = 0; orderNum < orderOfAttack.length; orderNum++) {
        // @ start of hero action
        deathQueue = [];
        basicQueue = [];
        activeQueue = [];
        
        if (orderOfAttack[orderNum]._currentStats["totalHP"] > 0) {
          if(orderOfAttack[orderNum].isUnderStandardControl()) {
            //if(numSims == 1) {oCombatLog.innerHTML += "<p>" + orderOfAttack[orderNum].heroDesc() + " is under control effect, turn skipped.</p>";}
          } else {
            //if(numSims == 1) {oCombatLog.innerHTML += "<p></p>";}
            orderOfAttack[orderNum]._rng = Math.random();
            
            // decide on action
            if (orderOfAttack[orderNum]._currentStats["energy"] >= 100 && !("Silence" in orderOfAttack[orderNum]._debuffs)) {
              // set hero energy to 0
              orderOfAttack[orderNum]._currentStats["energy"] = 0;
              
              // do active
              result = orderOfAttack[orderNum].doActive();
              //if(numSims == 1) {oCombatLog.innerHTML += "<div>" + result + "</div>";}
              
              temp = processDeathQueue(oCombatLog);
              //if(numSims == 1) {oCombatLog.innerHTML += temp;}
              someoneWon = checkForWin();
              if (someoneWon != "") {break;}
              
              // monster gains energy from hero active
              if (orderOfAttack[orderNum]._attOrDef == "att") {
                if (attMonster._monsterName != "None") {
                  monsterResult = "<div>" + attMonster.heroDesc() + " gained " + formatNum(10) + " energy. ";
                  attMonster._energy += 10;
                  monsterResult += "Energy at " + formatNum(attMonster._energy) + ".</div>"
                  //if(numSims == 1) {oCombatLog.innerHTML += monsterResult;}
                }
                
              } else {
                if (defMonster._monsterName != "None") {
                  monsterResult = "<div>" + defMonster.heroDesc() + " gained " + formatNum(10) + " energy. ";
                  defMonster._energy += 10;
                  monsterResult += "Energy at " + formatNum(defMonster._energy) + ".</div>"
                  //if(numSims == 1) {oCombatLog.innerHTML += monsterResult;}
                }
              }
              
              // check for Aida's Balance Mark debuffs
              if ("Balance Mark" in orderOfAttack[orderNum]._debuffs) {
                var firstKey = Object.keys(orderOfAttack[orderNum]._debuffs["Balance Mark"])[0];
                temp = orderOfAttack[orderNum]._debuffs["Balance Mark"][firstKey]["source"].balanceMark(orderOfAttack[orderNum]);
                //if(numSims == 1) {oCombatLog.innerHTML += temp;}
              }
              
              temp = processDeathQueue(oCombatLog);
              //if(numSims == 1) {oCombatLog.innerHTML += temp;}
              someoneWon = checkForWin();
              if (someoneWon != "") {break;}
              
              
              // process active queue
              temp = alertDidActive(orderOfAttack[orderNum], activeQueue);
              //if(numSims == 1) {oCombatLog.innerHTML += temp;}
              
            } else if ("Horrify" in orderOfAttack[orderNum]._debuffs) {
              //if(numSims == 1) {oCombatLog.innerHTML += "<p>" + orderOfAttack[orderNum].heroDesc() + " is Horrified, basic attack skipped.</p>";}
            } else {
              // do basic
              result = orderOfAttack[orderNum].doBasic();
              //if(numSims == 1) {oCombatLog.innerHTML += "<div>" + result + "</div>";}  
              
              temp = processDeathQueue(oCombatLog);
              //if(numSims == 1) {oCombatLog.innerHTML += temp;}
              someoneWon = checkForWin();
              if (someoneWon != "") {break;}
              
              // hero gains 50 energy after doing basic
              temp = orderOfAttack[orderNum].getEnergy(orderOfAttack[orderNum], 50);
              //if(numSims == 1) {oCombatLog.innerHTML += temp;}
              
              temp = processDeathQueue(oCombatLog);
              //if(numSims == 1) {oCombatLog.innerHTML += temp;}
              someoneWon = checkForWin();
              if (someoneWon != "") {break;}
              
              // process basic queue
              temp = alertDidBasic(orderOfAttack[orderNum], basicQueue);
              //if(numSims == 1) {oCombatLog.innerHTML += temp;}
            }
          }
              
          temp = processDeathQueue(oCombatLog);
          //if(numSims == 1) {oCombatLog.innerHTML += temp;}
          
          someoneWon = checkForWin();
          
          if (someoneWon != "") {break;}
        }
      }
      
      if (someoneWon != "") {break;}
      
      // trigger end of round stuff
      //if(numSims == 1) {oCombatLog.innerHTML += "<p></p><div class='logSeg'>End of round " + formatNum(roundNum) + ".</div>";}
      
      
      // attack first
      // handle monster stuff
      if (attMonster._monsterName != "None") {
        monsterResult = "<p></p><div>" + attMonster.heroDesc() + " gained " + formatNum(20) + " energy. ";
        attMonster._energy += 20;
        monsterResult += "Energy at " + formatNum(attMonster._energy) + ".</div>"
      
        if (attMonster._energy >= 100) {
          monsterResult += attMonster.doActive();
        }
        
        //if(numSims == 1) {oCombatLog.innerHTML += monsterResult;}
      }
      
      temp = processDeathQueue(oCombatLog);
      //if(numSims == 1) {oCombatLog.innerHTML += temp;}
      
      someoneWon = checkForWin();
      if (someoneWon != "") {break;}
      
      
      // handle buffs and debuffs
      //if(numSims == 1) {oCombatLog.innerHTML += "<p></p>";}
      for (var h in attHeroes) {
        temp = attHeroes[h].tickBuffs();
        //if(numSims == 1) {oCombatLog.innerHTML += temp;}
      }
      
      for (var h in attHeroes) {
        temp = attHeroes[h].tickDebuffs();
        //if(numSims == 1) {oCombatLog.innerHTML += temp;}
      }
      
      temp = processDeathQueue(oCombatLog);
      //if(numSims == 1) {oCombatLog.innerHTML += temp;}
      
      someoneWon = checkForWin();
      if (someoneWon != "") {break;}
      
      
      // get number of living heroes for shared fate enable
      numLiving = 0;
      //if(numSims == 1) {oCombatLog.innerHTML += "<p></p>";}
      for (var h in orderOfAttack) {
        if (orderOfAttack[h]._currentStats["totalHP"] > 0) { numLiving++; }
      }
      
      // trigger E3 enables
      for (var h in attHeroes) {
        if (attHeroes[h]._currentStats["totalHP"] > 0 && attHeroes[h].isNotSealed()) { 
          temp = attHeroes[h].tickEnable3(numLiving);
          //if(numSims == 1) {oCombatLog.innerHTML += temp;}
        }
      }
      
      temp = processDeathQueue(oCombatLog);
      //if(numSims == 1) {oCombatLog.innerHTML += temp;}
      
      someoneWon = checkForWin();
      if (someoneWon != "") {break;}
      
      
      // trigger hero end of round abilities
      for (var h in attHeroes) {
        if (attHeroes[h].isNotSealed()) {
          temp = attHeroes[h].endOfRound(roundNum);
          //if(numSims == 1) {oCombatLog.innerHTML += temp;}
        }
      }
      
      temp = processDeathQueue(oCombatLog);
      //if(numSims == 1) {oCombatLog.innerHTML += temp;}
      
      someoneWon = checkForWin();
      if (someoneWon != "") {break;}
      
      
      
      // defender second
      // handle monster stuff
      if (defMonster._monsterName != "None") {
        monsterResult = "<p></p><div>" + defMonster.heroDesc() + " gained " + formatNum(20) + " energy. ";
        defMonster._energy += 20;
        monsterResult += "Energy at " + formatNum(defMonster._energy) + ".</div>"
      
        if (defMonster._energy >= 100) {
          monsterResult += defMonster.doActive();
        }
        
        //if(numSims == 1) {oCombatLog.innerHTML += monsterResult;}
      }
      
      temp = processDeathQueue(oCombatLog);
      //if(numSims == 1) {oCombatLog.innerHTML += temp;}
      
      someoneWon = checkForWin();
      if (someoneWon != "") {break;}
      
      
      // handle buffs and debuffs
      //if(numSims == 1) {oCombatLog.innerHTML += "<p></p>";}
      for (var h in defHeroes) {
        temp = defHeroes[h].tickBuffs();
        //if(numSims == 1) {oCombatLog.innerHTML += temp;}
      }
      
      for (var h in defHeroes) {
        temp = defHeroes[h].tickDebuffs();
        //if(numSims == 1) {oCombatLog.innerHTML += temp;}
      }
      
      temp = processDeathQueue(oCombatLog);
      //if(numSims == 1) {oCombatLog.innerHTML += temp;}
      
      someoneWon = checkForWin();
      if (someoneWon != "") {break;}
      
      
      // get number of living heroes for shared fate enable
      numLiving = 0;
      //if(numSims == 1) {oCombatLog.innerHTML += "<p></p>";}
      for (var h in orderOfAttack) {
        if (orderOfAttack[h]._currentStats["totalHP"] > 0) { numLiving++; }
      }
      
      // trigger E3 enables
      for (var h in defHeroes) {
        if (defHeroes[h]._currentStats["totalHP"] > 0) { 
          temp = defHeroes[h].tickEnable3(numLiving);
          //if(numSims == 1) {oCombatLog.innerHTML += temp;}
        }
      }
      
      temp = processDeathQueue(oCombatLog);
      //if(numSims == 1) {oCombatLog.innerHTML += temp;}
      
      someoneWon = checkForWin();
      if (someoneWon != "") {break;}
      
      
      // trigger hero end of round abilities
      for (var h in defHeroes) {
        if (defHeroes[h].isNotSealed()) {
          temp = defHeroes[h].endOfRound(roundNum);
          //if(numSims == 1) {oCombatLog.innerHTML += temp;}
        }
      }
      
      temp = processDeathQueue(oCombatLog);
      //if(numSims == 1) {oCombatLog.innerHTML += temp;}
      
      someoneWon = checkForWin();
      if (someoneWon != "") {break;}
      
      
      // @ end of round
    }
    
    if (someoneWon == "att") {
      winCount++;
      //if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg'>Attacker wins!</p>";}
    } else {
      //if(numSims == 1) {oCombatLog.innerHTML += "<p class='logSeg'>Defender wins!</p>";}
    }
    
    
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
  
  oCombatLog.scrollTop = 0;
  */
  return winCount;
}


// alerters to trigger other heroes in response to an action

// tell all heroes a hero did a basic attack and the outcome
function alertDidBasic(source, e) {
  var result = "";
  var temp = "";
  var livingAllies = [];
  var livingEnemies = [];
    
  e.sort(function(a,b) {
    if (a[1]._attOrDef == "att" && b[1]._attOrDef == "def") {
      return -1;
    } else if (a[1]._attOrDef == "def" && b[1]._attOrDef == "att") {
      return 1;
    } else if (a[1]._heroPos < b[1]._heroPos) {
      return -1;
    } else {
      return 1;
    }
  });
  
  
  // enemies get energy after getting hit by basic
  for (var i=0; i<e.length; i++) {
    if (e[i][1]._currentStats["totalHP"] > 0) {
      if (e[i][2] > 0) {
        if (e[i][3] == true) {
          // double energy on being critted
          result += e[i][1].getEnergy(e[i][1], 20);
        } else {
          result += e[i][1].getEnergy(e[i][1], 10);
        }
      }
    }
  }
  
  
  // get currently living allies and enemies
  for (var i = 0; i < source._allies.length; i++) {
    if (source._allies[i]._heroName != "None" && source._allies[i]._currentStats["totalHP"] > 0) {
      livingAllies.push(source._allies[i])
    }
  }
  
  for (var i = 0; i < source._enemies.length; i++) {
    if (source._enemies[i]._heroName != "None" && 
      (source._enemies[i]._currentStats["totalHP"] > 0 || source._enemies[i]._heroName == "Elyvia")
    ) {
      livingEnemies.push(source._enemies[i])
    }
  }
  
  
  // alert living allies and enemies
  for (var i = 0; i < livingAllies.length; i++) {
    if (livingAllies[i].isNotSealed()) {
      temp = livingAllies[i].eventAllyBasic(source, e);
      if (temp != "") {
        result += "<div>" + temp + "</div>";
      }
    }
  }
  
  for (var i = 0; i < livingEnemies.length; i++) {
    if (livingEnemies[i].isNotSealed()) {
      temp = livingEnemies[i].eventEnemyBasic(source, e);
      if (temp != "") {
        result += "<div>" + temp + "</div>";
      }
    }
  }
  
  return result;
}


// tell all heroes a hero did an active and the outcome
function alertDidActive(source, e) {
  var result = "";
  var temp = "";
  var livingAllies = [];
  var livingEnemies = [];
    
  e.sort(function(a,b) {
    if (a[1]._attOrDef == "att" && b[1]._attOrDef == "def") {
      return -1;
    } else if (a[1]._attOrDef == "def" && b[1]._attOrDef == "att") {
      return 1;
    } else if (a[1]._heroPos < b[1]._heroPos) {
      return -1;
    } else {
      return 1;
    }
  });
  
  
  // enemies get energy after getting hit by active
  for (var i=0; i<e.length; i++) {
    if (e[i][1]._currentStats["totalHP"] > 0) {
      if (e[i][2] > 0) {
        if (e[i][3] == true) {
          // double energy on being critted
          result += e[i][1].getEnergy(e[i][1], 20);
        } else {
          result += e[i][1].getEnergy(e[i][1], 10);
        }
      }
    }
  }
  
  
  // get currently living allies and enemies
  for (var i = 0; i < source._allies.length; i++) {
    if (source._allies[i]._heroName != "None" && source._allies[i]._currentStats["totalHP"] > 0) {
      livingAllies.push(source._allies[i])
    }
  }
  
  for (var i = 0; i < source._enemies.length; i++) {
    if (source._enemies[i]._heroName != "None" && 
      (source._enemies[i]._currentStats["totalHP"] > 0 || source._enemies[i]._heroName == "Elyvia")
    ) {
      livingEnemies.push(source._enemies[i])
    }
  }
  
  
  // alert living allies and enemies
  for (var i = 0; i < livingAllies.length; i++) {
    if (livingAllies[i].isNotSealed()) {
      temp = livingAllies[i].eventAllyActive(source, e);
      if (temp != "") {
        result += "<div>" + temp + "</div>";
      }
    }
  }
  
  for (var i = 0; i < livingEnemies.length; i++) {
    if (livingEnemies[i].isNotSealed()) {
      temp = livingEnemies[i].eventEnemyActive(source, e);
      if (temp != "") {
        result += "<div>" + temp + "</div>";
      }
    }
  }
  
  return result;
}
  
  
// tell all heroes a hero died
function processDeathQueue(oCombatLog) {
  var result = "";
  var temp = "";
  var copyQueue;
  var livingAttackers;
  var livingDefenders;
  var livingAllies;
  var livingEnemies;
  
  
  while (deathQueue.length > 0) {
    copyQueue = [];
    for (var i=0; i<deathQueue.length; i++) {
      copyQueue.push(deathQueue[i]);
    }
    deathQueue = [];
    
    copyQueue.sort(function(a,b) {
      if (a[1]._attOrDef == "att" && b[1]._attOrDef == "def") {
        return -1;
      } else if (a[1]._attOrDef == "def" && b[1]._attOrDef == "att") {
        return 1;
      } else if (a[1]._heroPos < b[1]._heroPos) {
        return -1;
      } else {
        return 1;
      }
    });
    
    // get currently living attackers and defenders
    livingAttackers = [];
    for (var i = 0; i < attHeroes.length; i++) {
      if ((attHeroes[i]._heroName != "None" && attHeroes[i]._currentStats["totalHP"] > 0) || attHeroes[i]._heroName == "Carrie") {
        livingAttackers.push(attHeroes[i])
      }
    }
    
    livingDefenders = [];
    for (var i = 0; i < defHeroes.length; i++) {
      if ((defHeroes[i]._heroName != "None" && defHeroes[i]._currentStats["totalHP"] > 0) || defHeroes[i]._heroName == "Carrie") {
        livingDefenders.push(defHeroes[i])
      }
    }
    
    for (var i=0; i<copyQueue.length; i++) {
      if (copyQueue[i][1]._attOrDef == "att") {
        livingAllies = livingAttackers;
        livingEnemies = livingDefenders;
      } else {
        livingAllies = livingDefenders;
        livingEnemies = livingAttackers;
      }
      
      
      for (var j = 0; j < livingAllies.length; j++) {
        temp = livingAllies[j].eventAllyDied(copyQueue[i]);
        if (temp != "") {
          result += "<div>" + temp + "</div>";
        }
      }
      
      for (var j = 0; j < livingEnemies.length; j++) {
        temp = livingEnemies[j].eventEnemyDied(copyQueue[i]);
        if (temp != "") {
          result += "<div>" + temp + "</div>";
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
    if (attHeroes[i]._currentStats["totalHP"] > 0 || attHeroes[i]._currentStats["revive"] == 1) {
      attAlive++;
    }
  }
  
  numOfHeroes = defHeroes.length;
  for (var i = 0; i < numOfHeroes; i++) {
    if (defHeroes[i]._currentStats["totalHP"] > 0 || defHeroes[i]._currentStats["revive"] == 1) {
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
// search for document and innerhtml
// need to adjust for avatar frame, pet, and guild tech

var attMonsterName;
var defMonsterName;
var attFrame;
var defFrame;
var attHeroes = [];
var defHeroes = [];

self.onmessage = handleCall;

function handleCall(e) {
  /* array containing:
    0: attack team id
    1: attack team dna
    2: defense team id
    3: defense team dna
    4: number of simulations to run
    5: worker id
  */
  
  attMonsterName = e[1][60];
  attFrame = "";
  
  defMonsterName = e[3][60]
  defFrame = "";
  
  
  // load teams from DNA
  console.log(e[1]);
  console.log(e[3]);
  
  
  var numWins = Math.random()*numSims; //runSim(attMonsterName, defMonsterName, e[6]);
  postMessage(e[5], e[0], e[2], numWins);
}

/* end unique to web worker implementation */

/*

      allTeams[teamIndex] = {};
      allTeams[teamIndex]["dna"] = jsonConfig[t];
      allTeams[teamIndex]["teamName"] = t;
      allTeams[teamIndex]["pet"] = jsonConfig[t][60];
      allTeams[teamIndex]["attWins"] = 0;
      allTeams[teamIndex]["defWins"] = 0;
      allTeams[teamIndex]["weakAgainst"] = "None";
      allTeams[teamIndex]["weakAgainstWins"] = 0;
      
      team = [];
      species = "";
      
      for (var p = 0; p < 60; p += 10) {
        species += jsonConfig[t][p] + ", ";
        tHero = new baseHeroStats[jsonConfig[t][p]]["className"](jsonConfig[t][p], 1 + (p % 10), "");
        
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
        }
        
        team.push(tHero);
      }
      
      species += jsonConfig[t][p];
      allTeams[teamIndex]["species"] = species;
      allTeams[teamIndex]["team"] = team;
      teamIndex++;
      
      
      ---------------------------------
      

      attHeroes = allTeams[attIndex]["team"];
      defHeroes = allTeams[defIndex]["team"];
      
      document.getElementById("attMonster").value = allTeams[attIndex]["pet"];
      document.getElementById("defMonster").value = allTeams[defIndex]["pet"];
      
      for (var p = 0; p < 6; p++) {
        attHeroes[p]._attOrDef = "att";
        attHeroes[p]._allies = attHeroes;
        attHeroes[p]._enemies = defHeroes;
 
        defHeroes[p]._attOrDef = "def";
        defHeroes[p]._allies = defHeroes;
        defHeroes[p]._enemies = attHeroes;
      }
      
      for (var p = 0; p < 6; p++) {
        attHeroes[p].updateCurrentStats();
        defHeroes[p].updateCurrentStats();
      }      
*/      