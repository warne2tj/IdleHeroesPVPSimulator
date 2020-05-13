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
    statueStats["speed"] = 2 * document.getElementById(statuePrefix + "speed").value;
    statueStats["hpPercent"] = 0.01 * document.getElementById(statuePrefix + "hpPercent").value;
    statueStats["attackPercent"] = 0.005 * document.getElementById(statuePrefix + "attackPercent").value;
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
    if (this.hasStatus("petrify") || this.hasStatus("stun") || this.hasStatus("twine") || this.hasStatus("freeze")) { 
      return true;
    } else {
      return false;
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
      
      if (debuffKeys.length <= 1) {
        result += this.removeDebuff("Healing Curse");
      } else {
        delete this._debuffs["Healing Curse"][debuffKeys[0]];
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
        this._currentStats["totalArmor"] = Math.floor(this._currentStats["totalArmor"] * (1 + effects[strStatName]));
        
      } else if (strStatName == "heal") {
        healResult = this.getHeal(source, effects[strStatName]);
        
      } else {
        this._currentStats[strStatName] += effects[strStatName];
        
        if (strStatName == "attack") {
          this._currentStats["totalAttack"] = this.calcCombatAttack();
        }
      }
    }
    
    return result + "</div>" + healResult;
  }
  
  
  getDebuff(source, debuffName, duration, effects={}) {
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
    
    
    if (Math.random() < controlImmune && isControl) {
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
          this._currentStats["totalArmor"] = Math.floor(this._currentStats["totalArmor"] * (1 - effects[strStatName]));
          
        } else if (isDot(strStatName)) {
          damageResult = source.calcDamage(this, effects[strStatName], "debuff", "true");
          damageResult["damageType"] = strStatName;
          strDamageResult = this.takeDamage(source, "Debuff " + debuffName, damageResult);
          
        } else if (strStatName == "rounds") {
          //ignore, used to set twine rounds
          
        } else {
          this._currentStats[strStatName] -= effects[strStatName];
          
          if (strStatName == "attack") {
            this._currentStats["totalAttack"] = this.calcCombatAttack();
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
        result += this.removeDebuff("Power of Light");
        
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
            this._currentStats["totalArmor"] = Math.round(this._currentStats["totalArmor"] / (1 + this._buffs[strBuffName][s]["effects"][strStatName]));
            
          } else if(strStatName == "heal") {
            // do nothing, already healed
            
          } else {
            this._currentStats[strStatName] -= this._buffs[strBuffName][s]["effects"][strStatName];
            
            if (strStatName == "attack") {
              this._currentStats["totalAttack"] = this.calcCombatAttack();
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
            this._currentStats["totalArmor"] = Math.round(this._currentStats["totalArmor"] / (1 - this._debuffs[strDebuffName][s]["effects"][strStatName]));
            
          } else if (strStatName == "rounds") {
                // do nothing, used to set twine rounds
                
          } else if (isDot(strStatName)) {
            // do nothing
            
          } else {
            this._currentStats[strStatName] += this._debuffs[strDebuffName][s]["effects"][strStatName];
            
            if (strStatName == "attack") {
              this._currentStats["totalAttack"] = this.calcCombatAttack();
            }
          }
        }
        
        this._debuffs[strDebuffName][s];
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
                this._currentStats["totalArmor"] = Math.round(this._currentStats["totalArmor"] / (1 + this._buffs[b][s]["effects"][strStatName]));
                
              } else if (strStatName == "heal") {
                // do nothing
              } else {
                this._currentStats[strStatName] -= this._buffs[b][s]["effects"][strStatName];
                
                if (strStatName == "attack") {
                  this._currentStats["totalAttack"] = this.calcCombatAttack();
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
            }
            
            // remove the effects
            for (var strStatName in this._debuffs[b][s]["effects"]) {
              if (strStatName == "attackPercent") {
                this._currentStats["totalAttack"] = this.calcCombatAttack();
                
              } else if (strStatName == "armorPercent") {
                this._currentStats["totalArmor"] = Math.round(this._currentStats["totalArmor"] / (1 - this._debuffs[b][s]["effects"][strStatName]));
                
              } else if (strStatName == "rounds") {
                // do nothing, used to set twine rounds
                
              }  else if (isDot(strStatName)) {
                // do nothing, full burn damage already done
                
              } else {
                this._currentStats[strStatName] += this._debuffs[b][s]["effects"][strStatName];
                
                if (strStatName == "attack") {
                  this._currentStats["totalAttack"] = this.calcCombatAttack();
                }
              }
            }
            
            delete this._debuffs[b][s];
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
          
          for (var b in this._buffs) {
            result += this.removeBuff(b);
          }
          
          for (var d in this._debuffs) {
            result += this.removeDebuff(d);
          }
          
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
          var healAmount = this.calcHeal(this, Math.round(0.15 * (damageResult["damageAmount"])));
          result += "<div><span class='skill'>Balanced Strike</span> triggered heal on crit.</div>" + source.getHeal(source, healAmount);
        }
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