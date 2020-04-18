// base hero class, extend this class for each hero
class hero {
  constructor(sHeroName) {
    this._heroName = sHeroName;
    this._heroFaction = baseHeroStats[sHeroName]["heroFaction"];
    this._starLevel = baseHeroStats[sHeroName]["starLevel"];
    this._heroLevel = baseHeroStats[sHeroName]["heroLevel"];
    this._heroClass = baseHeroStats[sHeroName]["heroClass"];
    
    this._baseStats = Object.assign({}, baseHeroStats[sHeroName]["stats"]);
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
  
  // a bunch of functions to override by hero subclasses as needed.
  active() {
    // override to hero's active
    return;
  }
  
  
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
  updateCurrentStats() {
    console.log("Update current stats for " + this._heroName + " - " + this._heroClass);
    // start with base stats
    this._currentStats = Object.assign({}, this._baseStats);
    this._attackMultipliers = {};
    this._hpMultipliers = {};
    
    // get and apply guild tech
    var tech = guildTech[this._heroClass];
    
    for (var techName in tech){
      var techLevel = document.getElementById("tech" + this._heroClass + techName).value;
      
      for (var statToBuff in tech[techName]){
        var techStatsToBuff = {};
        var buffAmount = tech[techName][statToBuff]*techLevel;
        techStatsToBuff[statToBuff] = buffAmount;
        this.applyStatChange(techStatsToBuff, techName);
      }
    }
    
    
    // apply skin, stone, artifact
    this.applyStatChange(stones[this._stone], "stone");
    
    // apply equipment and set bonus
    this.applyStatChange(weapons[this._weapon]["stats"], "weapon");
    this.applyStatChange(armors[this._armor]["stats"], "armor");
    this.applyStatChange(shoes[this._shoe]["stats"], "shoe");
    this.applyStatChange(accessories[this._accessory]["stats"], "accessory");
    
    // apply enables
    
    // apply avatar frame, aura
    
    // apply monster
    
    // future: get and apply celestial island
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
  
  
  // Should not need override. Get hero stat description for display.
  getHeroSheet() {
    console.log("Get current stats for " + this._heroName);
    var heroSheet = "";
    
    heroSheet += "Level " + this._heroLevel + " " + this._heroName + "<br/>";
    heroSheet += this._starLevel + "* " + this._heroFaction + " " + this._heroClass + "<br/>";
    
    heroSheet += "<br/>Total HP: " + this.calcAttack();
    heroSheet += "<br/>Total Attack: " + this.calcHP();
    
    for (var statName in this._currentStats) {
      heroSheet += "<br/>" + statName + ": " + this._currentStats[statName];
    }
    
    return heroSheet;
  }
}


// 1* Foolish
class Foolish extends hero {
  constructor() {
    super("Foolish");
  }
}


// 5* Baade
class Baade extends hero {
  constructor() {
    super("Baade");
  }
  
  updateCurrentStats() {
    super.updateCurrentStats();
    
    // apply Will of Undead passive
    this.applyStatChange("attackPercent", 0.1);
    this.applyStatChange("hpPercent", 0.2);
    this.applyStatChange("armorBreak", 0.2);
  }
}