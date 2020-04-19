// base hero class, extend this class for each hero
class hero {
  constructor(sHeroName, iHeroPos) {
    this._heroName = sHeroName;
    this._heroPos = iHeroPos
    this._heroFaction = baseHeroStats[sHeroName]["heroFaction"];
    this._starLevel = baseHeroStats[sHeroName]["starLevel"];
    this._heroLevel = baseHeroStats[sHeroName]["heroLevel"];
    this._heroClass = baseHeroStats[sHeroName]["heroClass"];
    
    this._baseStats = Object.assign({}, baseHeroStats[sHeroName]["stats"]);
    this._baseStats["totalHP"] = this._baseStats["hp"];
    this._baseStats["totalAttack"] = this._baseStats["attack"];
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
    this._hpMultipliers = {}
    
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
    
    // update current stats based on selected gear, enables, guild tech, etc.
    this.updateCurrentStats();
  }
  
  // a bunch of functions for override by hero subclasses as needed.
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
  
  
  // Update current stats based on user selections.
  // The order in which multipliers are applied seem to matter,
  // They seem to be applied in a certain order with a floor in between each multiplier.
  // Currently off by +/- 5 as displayed on Info screen
  // Could be the result of incorrect ordering below or base stats +/- 2
  updateCurrentStats() {
    var prefix = this._heroPos < 6 ? "att" : "def";
    var arrLimits = [this._heroClass, this._heroFaction];
    var keySet = "";
    
    console.log("Update current stats for " + this._heroName + " - " + this._heroClass);
    
    // start with base stats
    this._currentStats = Object.assign({}, this._baseStats);
    this._attackMultipliers = {};
    this._hpMultipliers = {};
    
    
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
    
    
    // Must do it this way because set bonus multipliers seem to be applied in a specific order
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
    
    
    // apply skin, stone, artifact
    this.applyStatChange(stones[this._stone], "stone");
    
    this.applyStatChange(artifacts[this._artifact]["stats"], "artifact");
    if (arrLimits.includes(artifacts[this._artifact]["limit"])) {
      this.applyStatChange(artifacts[this._artifact]["limitStats"], "artifactLimit");
    }
    
    if (this._skin != "None") {
      this.applyStatChange(skins[this._heroName][this._skin], "skin");
    }
    
    
    // get and apply guild tech
    var tech = guildTech[this._heroClass];
    
    for (var techName in tech){
      var techLevel = document.getElementById(prefix + "Tech" + this._heroClass + techName).value;
      
      for (var statToBuff in tech[techName]){
        var techStatsToBuff = {};
        var buffAmount = tech[techName][statToBuff]*techLevel;
        techStatsToBuff[statToBuff] = buffAmount;
        this.applyStatChange(techStatsToBuff, techName);
      }
    }
    
    // apply monster, aura, avatar frame
    
    // future: get and apply celestial island
    
    this._currentStats["totalHP"] = this.calcHP();
    this._currentStats["totalAttack"] = this.calcAttack();
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
  
  
  // Get hero stats for display.
  getHeroSheet() {
    console.log("Get current stats for " + this._heroName);
    var heroSheet = "";
    
    heroSheet += "Level " + this._heroLevel + " " + this._heroName + "<br/>";
    heroSheet += this._starLevel + "* " + this._heroFaction + " " + this._heroClass + "<br/>";
    
    for (var statName in this._currentStats) {
      if (["hp", "attack", "speed", "armor", "totalHP", "totalAttack"].includes(statName)) {
        heroSheet += "<br/>" + statName + ": " + this._currentStats[statName].toFixed();
      } else {
        heroSheet += "<br/>" + statName + ": " + this._currentStats[statName].toFixed(2);
      }
    }
    
    return heroSheet;
  }
}