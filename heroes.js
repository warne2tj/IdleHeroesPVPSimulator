// base hero class, extend this class for each hero
class hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    this._heroName = sHeroName;
    this._heroPos = iHeroPos;
    this._attOrDef = attOrDef;
    this._heroFaction = baseHeroStats[sHeroName]["heroFaction"];
    this._starLevel = baseHeroStats[sHeroName]["starLevel"];
    this._heroLevel = baseHeroStats[sHeroName]["heroLevel"];
    this._heroClass = baseHeroStats[sHeroName]["heroClass"];
    
    // start with base stats
    this._stats = {};
    
    this._currentStats = {};
    this._attackMultipliers = {};
    this._hpMultipliers = {};
    this._armorMultipliers = {};
    
    // Non-displayed stat multipliers not reflected on info sheet
    // e.g. Avatar Frame, Auras, and Monsters
    this._ndAttackMultipliers = {};
    this._ndHPMultipliers = {};
    this._ndArmorMultipliers = {};
    
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
  }
  
  
  // Update current stats based on user selections.
  updateCurrentStats() {
    var arrLimits = [this._heroClass, this._heroFaction];
    var keySet = "";
    
    // start with base stats
    this._stats = Object.assign({}, baseHeroStats[this._heroName]["stats"]);
    this._stats["totalHP"] = this._stats["hp"];
    this._stats["totalAttack"] = this._stats["attack"];
    this._stats["totalArmor"] = this._stats["armor"];
    this._stats["displayHP"] = this._stats["hp"];
    this._stats["displayAttack"] = this._stats["attack"];
    this._stats["displayArmor"] = this._stats["armor"];
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
    this._stats["effectBeingHealed"] = 0.0;
    this._stats["healEffect"] = 0.0;
    this._stats["dotReduce"] = 0.0;
    this._stats["energy"] = 50;
    this._stats["controlPrecision"] = 0.0;
    this._stats["unbendingWillTriggered"] = 0;
    this._stats["unbendingWillStacks"] = 0;
    
    this._attackMultipliers = {};
    this._hpMultipliers = {};
    this._armorMultipliers = {};
    this._ndAttackMultipliers = {};
    this._ndHPMultipliers = {};
    this._ndArmorMultipliers = {};
    
    
    // apply enable bonus
    if (this._starLevel > 10) {
      this.applyStatChange({hpPercent: (this._starLevel - 10) * 0.14, attackPercent: (this._starLevel - 10) * 0.1}, "enableBonuses")
    }
    
    
    // apply enables
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
    
    switch(this._enable2) {
      case "Shelter":
        this.applyStatChange({critDamageReduce: 0.15}, "enable2");
        break;
        
      case "Vitality2":
        this.applyStatChange({effectBeingHealed: 0.15}, "enable2");
        break;
    }
    
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
    
    
    // implement monster
    
    
    // aura
    // note: too lazy right now to split out the non-display 
    //       bonuses to damage reduce and control immune
    var arrToUse;
    if (this._attOrDef == "att") {
      arrToUse = attHeroes;
    } else {
      arrToUse = defHeroes;
    }
    
    var arrIdentical = {
      0: {},
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
    
    if (heroCount == 6) {
      for (var x in factionCount) {
        this.applyNdStatChange(arrIdentical[factionCount[x]], "faction" + x);
      }
    
      var addBonuses = {
        damageReduce: 0.02 * (factionCount["Shadow"] + factionCount["Fortress"] + factionCount["Abyss"] + factionCount["Forest"]),
        controlImmune: 0.04 * (factionCount["Light"] + factionCount["Dark"])
      }
      this.applyNdStatChange(addBonuses, "auraAdditionalBonuses");
    }
    
    
    // avatar frame
    var sAvatarFrame = document.getElementById(this._attOrDef + "AvatarFrame").value;
    this.applyNdStatChange(avatarFrames[sAvatarFrame], "avatarFrame");
    
    
    // future: implement celestial island
    
    this._stats["displayHP"] = this.calcHP();
    this._stats["displayAttack"] = this.calcAttack();
    this._stats["displayArmor"] = this.calcArmor();
    this._stats["totalHP"] = this.calcTotalHP();
    this._stats["totalAttack"] = this.calcTotalAttack();
    this._stats["totalArmor"] = this.calcTotalArmor();
  }
  
  
  applyStatChange(arrStats, strSource) {
    for (var strStatName in arrStats) {
      if (strStatName == "attackPercent") {
        this._attackMultipliers[strSource] = 1 + arrStats[strStatName];
      } else if (strStatName == "hpPercent") {
        this._hpMultipliers[strSource] = 1 + arrStats[strStatName];
      } else if (strStatName == "armorPercent") {
        this._armorMultipliers[strSource] = 1 + arrStats[strStatName];
      } else {
        this._stats[strStatName] += arrStats[strStatName];
      }
    }
  }
  
  
  applyNdStatChange(arrStats, strSource) {
    for (var strStatName in arrStats) {
      if (strStatName == "attackPercent") {
        this._ndAttackMultipliers[strSource] = 1 + arrStats[strStatName];
      } else if (strStatName == "hpPercent") {
        this._ndHPMultipliers[strSource] = 1 + arrStats[strStatName];
      } else if (strStatName == "armorPercent") {
        this._ndArmorMultipliers[strSource] = 1 + arrStats[strStatName];
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
    
    return att;
  }
  
  calcHP() {
    var ehp = this._stats["hp"];
    for (var x in this._hpMultipliers) {
      ehp = Math.floor(ehp * this._hpMultipliers[x]);
    }
    
    return ehp;
  }
  
  calcArmor() {
    var ehp = this._stats["armor"];
    for (var x in this._armorMultipliers) {
      ehp = Math.floor(ehp * this._armorMultipliers[x]);
    }
    
    return ehp;
  }
  
  
  calcTotalAttack() {
    var att = this._stats["displayAttack"];
    
    for (var x in this._ndAttackMultipliers) {
      att = Math.floor(att * this._ndAttackMultipliers[x]);
    }
    
    return att;
  }
  
  calcTotalHP() {
    var ehp = this._stats["displayHP"];
    
    for (var x in this._ndHPMultipliers) {
      ehp = Math.floor(ehp * this._ndHPMultipliers[x]);
    }
    
    return ehp;
  }
  
  calcTotalArmor() {
    var ehp = this._stats["displayArmor"];
    
    for (var x in this._ndArmorMultipliers) {
      ehp = Math.floor(ehp * this._ndArmorMultipliers[x]);
    }
    
    return ehp;
  }
  
  
  // Get hero stats for display.
  getHeroSheet() {
    console.log("Get stats summary for " + this._heroName);
    var heroSheet = "";
    var arrIntStats = [
      "hp", "attack", "speed", "armor", 
      "totalHP", "totalAttack", "totalArmor", 
      "displayHP", "displayAttack", "displayArmor",
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
    var pos1 = parseInt(this._heroPos) + 1;
    
    return "<span class='" + this._attOrDef + "'>" + this._heroName + "-" + pos1 + " (" + this._currentStats["totalHP"].toLocaleString() + " hp, " + this._currentStats["totalAttack"].toLocaleString() + " attack, " + this._currentStats["energy"].toLocaleString() + " energy)</span>";
  }
  
  
  // Snapshot stats for combat
  snapshotStats() {
    this._currentStats = Object.assign({}, this._stats);
    this._currentStats["damageDealt"] = 0;
    this._currentStats["damageHealed"] = 0;
  }
  
  
  // utility functions for combat
  
  // can further extend this to account for new mechanics by adding parameters to the end
  // supply a default value so as to not break other calls to this function
  calcDamage(target, attackDamage, damageSource, damageType, skillDamage=1, canCrit=1, canBlock=1, armorReduces=1) {
    // Get damage related stats
    var critChance = canCrit * this._currentStats["crit"];
    var critDamage = 2*this._currentStats["critDamage"] + 1.5;
    var precision = this._currentStats["precision"];
    var precisionDamageIncrease = 1.0;
    var armorBreak = this._currentStats["armorBreak"] >= 1.0 ? 1.0 : this._currentStats["armorBreak"];
    var holyDamageIncrease = this._currentStats["holyDamage"] * 70;
    var holyDamage = attackDamage * holyDamageIncrease;
    var lethalFightback = 1.0;
    
    var armorMitigation = armorReduces * (target._currentStats["armor"] * (1 - armorBreak) / (180 + 20*(target._heroLevel)));
    var reduceDamage = target._currentStats["damageReduce"] > 0.75 ? 0.75 : target._currentStats["damageReduce"];
    var critDamageReduce = target._currentStats["critDamageReduce"];
    var classDamageReduce = target._currentStats[this._heroClass.toLowerCase() + "Reduce"];
    var blockChance = canBlock * (target._currentStats["block"] - precision);
    
    var factionA = this._heroFaction;
    var factionB = target._heroFaction;
    var factionBonus = 1.0;
    var e5Desc = "";
    
    if (damageSource.substring(0, 6) == "active") {
      skillDamage += this._currentStats["skillDamage"] + ((this._currentStats["energy"] - 100) / 100);
    }
    
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
      !(["bleed", "poison", "burn"].includes(damageType)) &&
      (damageSource.substring(0, 6) == "active" || damageSource.substring(0, 5) == "basic")
    ) {
      lethalFightback = 1.12;
      e5Desc = "<div><span class='skill'>Lethal Fightback</span> triggered additional damage.</div>";
    }
    
    attackDamage = attackDamage * (1-reduceDamage) * (1-armorMitigation) * (1-classDamageReduce) * skillDamage * precisionDamageIncrease * factionBonus * lethalFightback;
    holyDamage = holyDamage * (1-reduceDamage) * (1-classDamageReduce) * skillDamage * precisionDamageIncrease * factionBonus * lethalFightback;
    
    var outcomeRoll = Math.random();
    var blocked = false;
    var critted = false;
    
    if (outcomeRoll >= (1 - critChance) && outcomeRoll >= (1 - blockChance)) {
      // blocked crit
      attackDamage = attackDamage * 0.56 * (1-critDamageReduce) * critDamage;
      holyDamage = holyDamage * 0.56 * (1-critDamageReduce) * critDamage;
      blocked = true;
      critted = true;
    } else if (outcomeRoll >= (1 - critChance) && outcomeRoll < (1 - blockChance)) {
      // crit
      attackDamage = attackDamage * (1-critDamageReduce) * critDamage;
      holyDamage = holyDamage * (1-critDamageReduce) * critDamage;
      critted = true;
    } else if (outcomeRoll < (1 - critChance) && outcomeRoll >= (1 - blockChance)) {
      // blocked normal
      attackDamage = attackDamage * 0.7;
      holyDamage = holyDamage * 0.7;
      blocked = true;
    } else {
      // normal
    }
    
    if (["bleed", "poison", "burn"].includes(damageType)) {
      var dotReduce = this._currentStats["dotReduce"];
      attackDamage *= (1 - dotReduce);
      holyDamage *= (1 - dotReduce);
    }
    
    // E5 Balanced strike
    if ((damageSource.substring(0, 6) == "active" || damageSource.substring(0, 5) == "basic") && this._enable5 == "BalancedStrike") {
      if (critted == true) {
        var healAmount = Math.round(0.15 * (attackDamage + holyDamage));
        e5Desc = "<div><span class='skill'>Balanced Strike</span> triggered heal on crit.</div>" + this.getHeal(this, healAmount);
      } else {
        attackDamage *= 1.3;
        holyDamage *= 1.3;
        e5Desc = "<div><span class='skill'>Balanced Strike</span> triggered additional damage on non-crit.</div>";
      }
    }
    
    return [attackDamage + holyDamage, critted, blocked, damageSource, damageType, e5Desc];
  }
  
  
  getHeal(source, amount) {
    var healEffect = 1 + source._currentStats["healEffect"];
    var effectBeingHealed = 1 + this._currentStats["effectBeingHealed"];
    var amountHealed = Math.round(amount * healEffect * effectBeingHealed);
    var result = source.heroDesc() + " healed ";
    
    if (this._currentStats["totalHP"] + amountHealed > this._stats["totalHP"]) {
      this._currentStats["totalHP"] = this._stats["totalHP"];
    } else {
      this._currentStats["totalHP"] += amountHealed;
    }
    
    // prevent overheal 
    source._currentStats["damageHealed"] += amountHealed;
    result += this.heroDesc() + " for " + formatNum(amountHealed) + ". ";
    return result;
  }
  
  
  getEnergy(source, amount) {
    var result = "<div>" + source.heroDesc() + " gained " + formatNum(amount) + " energy. Energy at "; 
    
    this._currentStats["energy"] += amount;
    result += formatNum(this._currentStats["energy"]) + ".</div>"
    
    return result;
  }
  
  
  getBuff(buffName, duration, effects) {
    for (var strStatName in effects) {
      if (strStatName == "attackPercent") {
        this._currentStats["totalAttack"] = Math.floor(this._currentStats["totalAttack"] * (1 + effects[strStatName]));
      } else {
        this._currentStats[strStatName] += effects[strStatName];
      }
    }
    
    if (buffName in this._buffs) {
      var keyAt = Object.keys(this._buffs[buffName]).length;
      this._buffs[buffName][keyAt] = {"duration": duration, "effects": effects};
    } else {
      this._buffs[buffName] = {};
      this._buffs[buffName][0] = {"duration": duration, "effects": effects};
    }
  }
  
  
  getDebuff(debuffName, duration, effects) {
    for (var strStatName in effects) {
      if (strStatName == "attackPercent") {
        this._currentStats["totalAttack"] = Math.floor(this._currentStats["totalAttack"] * (1 - effects[strStatName]));
      } else {
        this._currentStats[strStatName] -= effects[strStatName];
      }
    }
    
    if (debuffName in this._debuffs) {
      var keyAt = Object.keys(this._debuffs[debuffName]).length;
      this._debuffs[debuffName][keyAt] = {"duration": duration, "effects": effects};
    } else {
      this._debuffs[debuffName] = {};
      this._debuffs[debuffName][0] = {"duration": duration, "effects": effects};
    }
  }
  
  
  removeBuff(strBuffName) {        
    // for each stack
    for (var s in this._buffs[strBuffName]) {
      // remove the effects
      for (var strStatName in this._buffs[strBuffName][s]["effects"]) {
        if (strStatName == "attackPercent") {
          this._currentStats["totalAttack"] = Math.round(this._currentStats["totalAttack"] / (1 + this._buffs[strBuffName][s]["effects"][strStatName]));
        } else {
          this._currentStats[strStatName] -= this._buffs[strBuffName][s]["effects"][strStatName];
        }
      }
    }
    
    delete this._buffs[strBuffName];
  }
  
  
  removeDebuff(strDebuffName) {        
    // for each stack
    for (var s in this._debuffs[strDebuffName]) {
      // remove the effects
      for (var strStatName in this._debuffs[strDebuffName][s]["effects"]) {
        if (strStatName == "attackPercent") {
          this._currentStats["totalAttack"] = Math.round(this._currentStats["totalAttack"] / (1 - this._debuffs[strDebuffName][s]["effects"][strStatName]));
        } else {
          this._currentStats[strStatName] += this._debuffs[strDebuffName][s]["effects"][strStatName];
        }
      }
    }
    
    delete this._buffs[strDebuffName];
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
          if (this._buffs[b][s]["duration"] > 0) {
            this._buffs[b][s]["duration"] -= 1;
            
            if (this._buffs[b][s]["duration"] == 0) {
              result += "<div>" + this.heroDesc() + " buff (<span class='skill'>" + b + "</span>) ended.</div>";
              
              // remove the effects
              for (var strStatName in this._buffs[b][s]["effects"]) {
                if (strStatName == "attackPercent") {
                  this._currentStats["totalAttack"] = Math.round(this._currentStats["totalAttack"] / (1 + this._buffs[b][s]["effects"][strStatName]));
                } else {
                  this._currentStats[strStatName] -= this._buffs[b][s]["effects"][strStatName];
                }
              }
            } else {
              stacksLeft++;
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
    var stacksLeft = 0;
    
    if (this._currentStats["totalHP"] > 0) {
      // for each buff name
      for (var b in this._debuffs) {
        stacksLeft = 0;
        
        // for each stack
        for (var s in this._debuffs[b]) {
          if (this._debuffs[b][s]["duration"] > 0) {
            this._debuffs[b][s]["duration"] -= 1;
            
            if (this._debuffs[b][s]["duration"] == 0) {
              result += "<div>" + this.heroDesc() + " debuff (<span class='skill'>" + b + "</span>) ended.</div>";
              
              // remove the effects
              for (var strStatName in this._debuffs[b][s]["effects"]) {
                if (strStatName == "attackPercent") {
                  this._currentStats["totalAttack"] = Math.round(this._currentStats["totalAttack"] / (1 - this._debuffs[b][s]["effects"][strStatName]));
                } else {
                  this._currentStats[strStatName] += this._debuffs[b][s]["effects"][strStatName];
                }
              }
            } else {
              stacksLeft++;
            }
          }
        }
        
        if (stacksLeft == 0) {
          delete this._debuffs[b];
        }
      }
    }
    
    return result;
  }
  
  
  tickEnable3(numLiving) {
    var result = "";
    
    if (this._enable3 == "Resilience") {
      var healAmount = Math.round(0.15 * (this._stats["totalHP"] - this._currentStats["totalHP"]));
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
      var listDebuffs = Object.keys(this._debuffs);
      var rng = Math.floor(Math.random() * listDebuffs.length);
      
      if (listDebuffs.length > 0) {
        this.removeDebuff(listDebuffs[rng]);
        result += "<div>" + this.heroDesc() + " Purify triggered. Removed all stacks of debuff " + listDebuffs[rng] + ".</div>";
      }
    }
    
    return result;
  }
  
  
  // targeting functions
  
  getFirstTarget() {
    // get first living target
    for (var i=0; i<this._allies.length; i++) {
      if (this._enemies[i]._currentStats["totalHP"] > 0) {
        return this._enemies[i];
      }
    }
  }
  
  
  getLowestHPTarget() {
    // get first living target with lowest current HP
    var target = new hero("None");
    
    for (var i=0; i<this._enemies.length; i++) {
      if (this._enemies[i]._currentStats["totalHP"] > 0 && (target._heroName == "None" || this._enemies[i]._currentStats["totalHP"] < target._currentStats["totalHP"])) {
        target = this._enemies[i];
      }
    }
    
    return target;
  }
  
  
  // alerters to trigger other heroes in response to an action
  
  // tell all heroes this hero did a basic attack and the outcome
  alertDidBasic(target, damageResult) {
    var result = "";
    var temp = "";
    
    for (var i = 0; i < this._allies.length; i++) {
      temp = this._allies[i].eventAllyBasic(this, target, damageResult);
      if (temp != "") {
        result += "<div>" + temp + "</div>";
      }
    }
    
    for (var i = 0; i < this._enemies.length; i++) {
      temp = this._enemies[i].eventEnemyBasic(this, target, damageResult);
      if (temp != "") {
        result += "<div>" + temp + "</div>";
      }
    }
    
    return result;
  }
  
  
  // tell all heroes this hero did an active and the outcome
  alertDidActive(target, damageResult) {
    var result = "";
    var temp = "";
    
    for (var i = 0; i < this._allies.length; i++) {
      temp = this._allies[i].eventAllyActive(this, damageResult);
      if (temp != "") {
        result += "<div>" + temp + "</div>";
      }
    }
    
    for (var i = 0; i < this._enemies.length; i++) {
      temp = this._enemies[i].eventEnemyActive(this, damageResult);
      if (temp != "") {
        result += "<div>" + temp + "</div>";
      }
    }
    
    return result;
  }
  
  
  // tell all heroes this hero died
  alertHeroDied(killer) {
    var result = "";
    var temp = "";
    
    for (var i = 0; i < this._allies.length; i++) {
      temp = this._allies[i].eventAllyDied(killer, this);
      if (temp != "") {
        result += "<div>" + temp + "</div>";
      }
    }
    
    for (var i = 0; i < this._enemies.length; i++) {
      temp = this._enemies[i].eventEnemyDied(killer, this);
      if (temp != "") {
        result += "<div>" + temp + "</div>";
      }
    }
    
    return result;
  }
  
  
  // a bunch of functions for override by hero subclasses as needed to trigger special abilities.
  
  // damageResult = [damage amount, was crit, was block, damage source, damage type]
  // damage source: basic, active, passive
  // damage type: normal, blood, mark, etc
  
  // usually you'll want to check that the hero is still alive before triggering their effect
  
  passiveStats() { return;}
  eventAllyBasic(source, target, damageResult) { return "";}
  eventEnemyBasic(source, target, damageResult) { return "";}
  eventAllyActive(source, target, damageResult) { return "";}
  eventEnemyActive(source, target, damageResult) { return "";}
  eventAllyDied(source, target, damageResult) { return "";}
  eventEnemyDied(source, target, damageResult) { return "";}
  
  
  takeDamage(source, damageResult) {
    var beforeHP = this._currentStats["totalHP"];
    var result = "";
    
    if (this._currentStats["totalHP"] <= damageResult[0]) {
      // hero would die, check for unbending will
      if (this._enable5 == "UnbendingWill" && this._currentStats["unbendingWillTriggered"] == 0 && damageResult[4] != "mark") {
        this._currentStats["unbendingWillTriggered"] = 1;
        this._currentStats["unbendingWillStacks"] = 3;
        this._currentStats["damageHealed"] += damageResult[0];
        damageResult[0] = 0;
        result += "<div>Damage prevented by <span class='skill'>Unbending Will</span>.</div>";
      } else if (this._currentStats["unbendingWillStacks"] > 0 && damageResult[4] != "mark") {
        this._currentStats["unbendingWillStacks"] -= 1;
        this._currentStats["damageHealed"] += damageResult[0];
        damageResult[0] = 0;
        result += "<div>Damage prevented by <span class='skill'>Unbending Will</span>.</div>";
        
        if (this._currentStats["unbendingWillStacks"] == 0) {
          result += "<div><span class='skill'>Unbending Will</span> ended.</div>";
        }
      } else {
        // hero died
        source._currentStats["damageDealt"] += damageResult[0];
        this._currentStats["totalHP"] = 0;
        result += "<div>Enemy health dropped from " + formatNum(beforeHP) + " to " + formatNum(0) + ".</div><div>" + this.heroDesc() + " died.</div>";
        result += this.alertHeroDied(source);
      }
    } else {
      this._currentStats["totalHP"] = this._currentStats["totalHP"] - damageResult[0];
      source._currentStats["damageDealt"] += damageResult[0];
      result += "<div>Enemy health dropped from " + formatNum(beforeHP) + " to " + formatNum(this._currentStats["totalHP"]) + ".</div>";
    }
    
    if (this._currentStats["totalHP"] > 0) {
      // gain energy
      if (damageResult[3] == "basic" || damageResult[3] == "active") {
        if (damageResult[1] == true) {
          // crit
          result += this.getEnergy(this, 20);
        } else {
          result += this.getEnergy(this, 10);
        }
      }
    }
    
    return result;
  }
  
  
  formatDamageResult(target, damageResult, strAttackDesc) {
    var result = "";
    var strTakeDamage = ""
    
    strAttackDesc = "<span class='skill'>" + strAttackDesc + "</span>";
    result = "<div>" + this.heroDesc() + " used " + strAttackDesc + " against " + target.heroDesc() + ".</div>";
    damageResult[0] = Math.round(damageResult[0]);
    strTakeDamage = target.takeDamage(this, damageResult);
    
    if (damageResult[0] > 0) {
      if (damageResult[1] == true && damageResult[2] == true) {
        result += "Blocked crit " + strAttackDesc + " dealt " + formatNum(damageResult[0]) + " damage.";
      } else if (damageResult[1] == true && damageResult[2] == false) {
        result += "Crit " + strAttackDesc + " dealt " + formatNum(damageResult[0]) + " damage.";
      } else if (damageResult[1] == false && damageResult[2] == true) {
        result += "Blocked " + strAttackDesc + " dealt " + formatNum(damageResult[0]) + " damage.";
      } else {
        result += strAttackDesc + " dealt " + formatNum(damageResult[0]) + " damage.";
      }
      result += "</div>"
    }
    
    result += damageResult[5];
    result += strTakeDamage;
    
    return result;
  }
  
  
  doBasic() {
    var result = {};
    var damageResult = [];
    var target = this.getFirstTarget();
    
    damageResult = this.calcDamage(target, this._currentStats["totalAttack"], "basic", "normal");
    result["description"] = this.formatDamageResult(target, damageResult, "Basic Attack");
    result["description"] += this.getEnergy(this, 50);
    result["eventDescription"] = this.alertDidBasic(target, damageResult);
    
    return result;
  }
  
  
  doActive() { 
    var result = {};
    var damageResult = [];
    var target = this.getFirstTarget();
    
    damageResult = this.calcDamage(target, this._currentStats["totalAttack"], "active", "normal");
    result["description"] = this.formatDamageResult(target, damageResult, "Active (Template)");
    this._currentStats["energy"] = 0;
    result["eventDescription"] = this.alertDidActive(target, damageResult);
    
    return result;
  }
}