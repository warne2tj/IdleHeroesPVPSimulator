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
    
    // Copy the 4 main variable base stats from baseHeroStats,
    // add other stats tied to items, tech, buffs, etc.
    this._baseStats = Object.assign({}, baseHeroStats[sHeroName]["stats"]);
    this._baseStats["totalHP"] = this._baseStats["hp"];
    this._baseStats["totalAttack"] = this._baseStats["attack"];
    this._baseStats["displayHP"] = this._baseStats["hp"];
    this._baseStats["displayAttack"] = this._baseStats["attack"];
    this._baseStats["skillDamage"] = 0.0;
    this._baseStats["precision"] = 0.0;
    this._baseStats["block"] = 0.0;
    this._baseStats["crit"] = 0.0;
    this._baseStats["critDamage"] = 0.0;
    this._baseStats["armorBreak"] = 0.0;
    this._baseStats["controlImmune"] = 0.0;
    this._baseStats["damageReduce"] = 0.0;
    this._baseStats["holyDamage"] = 0.0;
    this._baseStats["warriorReduce"] = 0.0;
    this._baseStats["mageReduce"] = 0.0;
    this._baseStats["rangerReduce"] = 0.0;
    this._baseStats["assassinReduce"] = 0.0;
    this._baseStats["priestReduce"] = 0.0;
    this._baseStats["freezeImmune"] = 0.0;
    this._baseStats["petrifyImmune"] = 0.0;
    this._baseStats["stunImmune"] = 0.0;
    this._baseStats["twineImmune"] = 0.0;
    this._baseStats["critDamageReduce"] = 0.0;
    this._baseStats["effectBeingHealed"] = 0.0;
    this._baseStats["dotReduce"] = 0.0;
    this._baseStats["energy"] = 50;
    this._baseStats["controlPrecision"] = 0.0;
    
    this._currentStats = {};
    this._attackMultipliers = {};
    this._hpMultipliers = {};
    // Non-displayed stat multipliers not reflected on info sheet
    // e.g. Avatar Frame, Auras, and Monsters
    this._ndAttackMultipliers = {};
    this._ndHPMultipliers = {};
    
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
  }
  
  // a bunch of functions for override by hero subclasses as needed to trigger special abilities.
  doActive() { return;}
  passive1() { return;}
  passive2() { return;}
  passive3() { return;}
  allyDied() { return;}
  enemyDied() { return;}
  
  
  applyStatChange(arrStats, strSource) {
    for (var strStatName in arrStats) {
      if (strStatName == "attackPercent") {
        this._attackMultipliers[strSource] = 1 + arrStats[strStatName];
      } else if (strStatName == "hpPercent") {
        this._hpMultipliers[strSource] = 1 + arrStats[strStatName];
      } else {
        this._currentStats[strStatName] += arrStats[strStatName];
        
        if (strStatName == "damageReduce" && this._currentStats[strStatName] > 0.7) {
          this._currentStats[strStatName] = 0.7;
        }
      }
    }
  }
  
  
  applyNdStatChange(arrStats, strSource) {
    for (var strStatName in arrStats) {
      if (strStatName == "attackPercent") {
        this._ndAttackMultipliers[strSource] = 1 + arrStats[strStatName];
      } else if (strStatName == "hpPercent") {
        this._ndHPMultipliers[strSource] = 1 + arrStats[strStatName];
      } else {
        this._currentStats[strStatName] += arrStats[strStatName];
        
        if (strStatName == "damageReduce" && this._currentStats[strStatName] > 0.7) {
          this._currentStats[strStatName] = 0.7;
        }
      }
    }
  }
  
  
  // Update current stats based on user selections.
  updateCurrentStats() {
    var arrLimits = [this._heroClass, this._heroFaction];
    var keySet = "";
    
    // start with base stats
    this._currentStats = Object.assign({}, this._baseStats);
    this._attackMultipliers = {};
    this._hpMultipliers = {};
    this._ndAttackMultipliers = {};
    this._ndHPMultipliers = {};
    
    
    // apply passives, does nothing unless overridden in subclass
    this.passive1();
    this.passive2();
    this.passive3();
    
    
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
    
    
    // stone
    this.applyStatChange(stones[this._stone], "stone");
    
    
    // artifact
    this.applyStatChange(artifacts[this._artifact]["stats"], "artifact");
    if (arrLimits.includes(artifacts[this._artifact]["limit"])) {
      this.applyStatChange(artifacts[this._artifact]["limitStats"], "artifactLimit");
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
    
    
    // avatar frame
    var sAvatarFrame = document.getElementById(this._attOrDef + "AvatarFrame").value;
    this.applyNdStatChange(avatarFrames[sAvatarFrame], "avatarFrame");
    
    
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
    
    
    // implement monster
    
    
    // future: implement celestial island
    
    this._currentStats["displayHP"] = this.calcHP();
    this._currentStats["displayAttack"] = this.calcAttack();
    this._currentStats["totalHP"] = this.calcTotalHP();
    this._currentStats["totalAttack"] = this.calcTotalAttack();
  }
  
  
  calcAttack() {
    var att = this._currentStats["attack"];
    
    for (var x in this._attackMultipliers) {
      att = Math.floor(att * this._attackMultipliers[x]);
    }
    
    return att;
  }
  
  calcHP() {
    var ehp = this._currentStats["hp"];
    
    for (var x in this._hpMultipliers) {
      ehp = Math.floor(ehp * this._hpMultipliers[x]);
    }
    
    return ehp;
  }
  
  
  calcTotalAttack() {
    var att = this._currentStats["displayAttack"];
    
    for (var x in this._ndAttackMultipliers) {
      att = Math.floor(att * this._ndAttackMultipliers[x]);
    }
    
    return att;
  }
  
  calcTotalHP() {
    var ehp = this._currentStats["displayHP"];
    
    for (var x in this._ndHPMultipliers) {
      ehp = Math.floor(ehp * this._ndHPMultipliers[x]);
    }
    
    return ehp;
  }
  
  
  // Get hero stats for display.
  getHeroSheet() {
    console.log("Get stats summary for " + this._heroName);
    var heroSheet = "";
    
    heroSheet += "Level " + this._heroLevel + " " + this._heroName + "<br/>";
    heroSheet += this._starLevel + "* " + this._heroFaction + " " + this._heroClass + "<br/>";
    
    for (var statName in this._currentStats) {
      if (["hp", "attack", "speed", "armor", "totalHP", "totalAttack", "displayHP", "displayAttack"].includes(statName)) {
        heroSheet += "<br/>" + statName + ": " + this._currentStats[statName].toFixed();
      } else {
        heroSheet += "<br/>" + statName + ": " + this._currentStats[statName].toFixed(2);
      }
    }
    
    return heroSheet;
  }
}