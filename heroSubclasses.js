/* 
Important Notes
  * Don't forget to check for Tara's Seal of Light if needed.
  * Don't forget to check for CC if needed.
  * When getting targets, check that the target is alive. In case all targets are dead. 
      Some effects still happen with no currently living targets.
      i.e. only sleepless left to resurrect at end of round, kroos attack still heals
  * After doing damage, check that damage amount is greater than 0. If it's 0, then the target was Carrie and she dodged.
  * When overriding events, you might need to check that the target or source of the event is the same as the hero being called
      Depending on the details of the skill that is. Some react to anyone triggering the event, some only react to themselves.
  * Rng for a hero's attack is initially generated at the beginning of their turn. Need to regenerate if they do further attacks. 
      But maybe not depending on if subsequent attacks use the same roll. This is an open question.
  
  

Important Function prototypes

  this.calcDamage(target, attackDamage, damageSource, damageType, skillDamage=1, canCrit=1, canBlock=1, armorReduces=1, dotRounds=0)
      return {"damageAmount", "critted", "blocked", "damageSource", "damageType", "e5Description"} 
      damageSource = passive, active, mark, monster, active2, debuff, other
        debuff: don't know if this damage type is needed, just in case
        active2: does not apply skill damage but applies other skill related effects
        other: does not trigger amenra shield
      damageType = normal, burn, bleed, poison, hpPercent


  this.takeDamage(source, strAttackDesc, damageResult{})

  this.getHeal(source, amount)

  this.getEnergy(source, amount)

  this.getBuff(source, buffName, duration, effects{})
  
  this.removeBuff(strBuffName)

  this.getDebuff(source, debuffName, duration, effects{})
  
  this.removeDebuff(strDebuffName)
  
  this.hasStatus(strStatus)
  
  this.isUnderStandardControl()
  
  isControlEffect(strName, effects)

  basicQueue[], activeQueue[] = push([source, target, damageAmount, critted]) to call the event

  deathQueue[] = push([source, target]) to call the event
  
  this.eventAllyBasic(e), this.eventAllyActive(e), this.eventAllyDied(e), this.eventEnemyDied(e) = called by all heroes so they can react to an event

  this.eventEnemyBasic(e), this.eventEnemyActive(e) = if overridden, call the super() version so the enemy still gains energy on an attack
    
*/



// 1* Foolish
class Foolish extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  doActive() {
    var result = "";
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
    
    for (var i=0; i<1; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.8);
      result = targets[i].takeDamage(this, "Thump", damageResult);
      activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
    }
    
    return result;
  }
}


// 5* Baade
class Baade extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Will of Undead passive
    this.applyStatChange({attackPercent: 0.1, hpPercent: 0.2, armorBreak: 0.2}, "PassiveStats");
  }
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {damageAmount: 0};
    var targets = getLowestHPTargets(this, this._enemies);
    var additionalDamage = 0;
    var maxTargets = 1;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 1.1, "basic", "normal", 1, 0);
      additionalDamage = damageResult["damageAmount"];
      result = targets[i].takeDamage(this, "Basic Attack", damageResult);
      
      if (targets[i]._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0) {
        var outcomeRoll = Math.random();
        
        if (outcomeRoll < 0.75) {
          if (outcomeRoll < 0.5) {
            additionalDamage = additionalDamage * 0.5;
          } else if (outcomeRoll < 0.75) {
            additionalDamage = additionalDamage * 1.25;
          }
          
          additionalDamage = Math.round(additionalDamage);
          additionalDamageResult = {
            damageAmount: additionalDamage, 
            critted: 0, 
            blocked: 0, 
            damageSource: "basic", 
            damageType: "normal", 
            e5Description: ""
          };
          
          result += targets[i].takeDamage(this, "Death Threat", additionalDamageResult);
        }
      }
      
      basicQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamage, damageResult["critted"]]);
    }
    
    return result;
  }
  
  doActive() {
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {damageAmount: 0};
    var targets = getLowestHPTargets(this, this._enemies);
    var healAmount = 0;
    var healEffect = 1 + this._currentStats["healEffect"];
    var additionalDamage = 0;
    var maxTargets = 1;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.5, 0);
      additionalDamage = damageResult["damageAmount"];
      result = targets[i].takeDamage(this, "Nether Strike", damageResult);
      
      if (targets[i]._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0) {
        var outcomeRoll = Math.random();
        
        if (outcomeRoll < 0.84) {
          if (outcomeRoll < 0.48) {
            additionalDamage = additionalDamage;
          } else if (outcomeRoll < 0.84) {
            additionalDamage = additionalDamage * 3;
          }
          
          additionalDamage = Math.round(additionalDamage);
          additionalDamageResult = {
            damageAmount: additionalDamage, 
            critted: 0, 
            blocked: 0, 
            damageSource: "active2", 
            damageType: "normal", 
            e5Description: ""
          };
          
          result += targets[i].takeDamage(this, "Nether Strike 2", additionalDamageResult);
        }
      }
      
      healAmount = Math.round((damageResult["damageAmount"] + additionalDamage) * 0.2 * healEffect);
      if (healAmount > 0) {
        result += this.getHeal(this, healAmount);
        result += this.getBuff(this, "Nether Strike", 6, {attackPercent: 0.4});
      }
      
      activeQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamage, damageResult["critted"]]);
    }
    
    return result;
  }
  
  eventEnemyDied(e) { 
    var result = ""
    
    if (!("Seal of Light" in this._debuffs)) {
      result = "<div>" + this.heroDesc() + " <span class='skill'>Blood Armor</span> passive triggered.</div>";
      result += this.getHeal(this, this._currentStats["totalAttack"] * (1 + this._currentStats["healEffect"]));
      result += this.getBuff(this, "Blood Armor", 1, {damageReduce: 0.1});
    }
    
    return result;
  }
}


// E5 Aida
class Aida extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  
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
      
      var damageResult = {
        damageAmount: damageAmount, 
        critted: 0, 
        blocked: 0, 
        damageSource: "mark", 
        damageType: "hpPercent", 
        e5Description: ""
      };
      
      result += target.removeDebuff("Balance Mark");
      result += target.takeDamage(this, "Balance Mark", damageResult);
    }
    
    return result;
  }
  
  
  endOfRound() {
    var result = "";
    var healAmount = 0;
    var healEffect = 1 + this._currentStats["healEffect"];
    
    if ("Fury of Justice" in this._buffs) {
      healAmount = damageInRound * 0.35 * healEffect;
      result += "<div><span class='skill'>Fury of Justice</span> heal triggered.</div>";
      result += this.getHeal(this, healAmount);
      result += this.removeBuff("Fury of Justice");
    }
    
    if (!("Seal of Light" in this._debuffs)) {
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
      
      healAmount = this._stats["totalHP"] * 0.15 * healEffect;
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
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 1.2, "basic", "normal");
      result = targets[i].takeDamage(this, "Basic Attack", damageResult);
      
      if (targets[i]._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0) {
        additionalDamage = targets[i]._stats["totalHP"] * 0.2;
        if (additionalDamage > this._currentStats["totalAttack"] * 15) {
          additionalDamage = this._currentStats["totalAttack"] * 15;
        }
        
        additionalDamageResult = {
          damageAmount: additionalDamage, 
          critted: 0, 
          blocked: 0, 
          damageSource: "basic", 
          damageType: "hpPercent", 
          e5Description: ""
        };
        
        result += targets[i].takeDamage(this, "Fury of Justice", additionalDamageResult);
      }
      
      basicQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamage, damageResult["critted"]]);
    }
    
    result += this.getBuff(this, "Fury of Justice", 99, {});
    
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
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.68, 1, 1, 0);
      result += targets[i].takeDamage(this, "Order Restore", damageResult);
      
      if (damageResult["damageAmount"] > 0) {
        targets[i].getDebuff(this, "Balance Mark", 3, {});
      }
      
      activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
    }
    
    return result;
    
  }
}



// E5 Amen-Ra
class AmenRa extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  
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
  
  
  eventAllyActive(e) {
    var result = "";
    var damageResult = {};
    var targets;
    
    if (!("Seal of Light" in this._debuffs) && !(this.isUnderStandardControl())) {
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
        
        
        if (damageResult["damageAmount"] > 0 && targets[i]._currentStats["totalHP"] > 0 && Math.random() < (0.7 + controlPrecision)) {
          result += targets[i].getDebuff(this, "petrify", 2, {});
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
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



// E5 Aspen
class Aspen extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Dark Storm passive
    this.applyStatChange({hpPercent: 0.4, attackPercent: 0.2, crit: 0.35, armorBreak: 0.5}, "PassiveStats");
  }
}



// E5 Belrain
class Belrain extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
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
      activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
    }
    
    targets = getRandomTargets(this, this._allies);
    numTargets = 4;
    if (targets.length < numTargets) {
      numTargets = targets.length;
    }
    
    for (var i=0; i<numTargets; i++) {
      result += targets[i].getBuff(this, "Holylight Sparkle", 3, {attackPercent: 0.3, speed: 30, effectBeingHealed: 0.2});
      
      if (Math.random() < 0.4) {
        if ("Seal of Light" in targets[i]._debuffs) { result += targets[i].removeDebuff("Seal of Light"); }
        if ("petrify" in targets[i]._debuffs) { result += targets[i].removeDebuff("petrify"); }
        if ("stun" in targets[i]._debuffs) { result += targets[i].removeDebuff("stun"); }
        if ("entangle" in targets[i]._debuffs) { result += targets[i].removeDebuff("entangle"); }
        if ("freeze" in targets[i]._debuffs) { result += targets[i].removeDebuff("freeze"); }
      }
    }
    
    return result;
  }
}



// E5 Carrie
class Carrie extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
    this._stats["spiritPowerStacks"] = 0;
  }
  
  
  passiveStats() {
    // apply Darkness Befall passive
    this.applyStatChange({attackPercent: 0.25, controlImmune: 0.3, speed: 60}, "PassiveStats");
  }
  
  
  takeDamage(source, strAttackDesc, damageResult) {
    var result = "";
    var outcomeRoll = Math.random();
    
    result = "<div>" + source.heroDesc() + " used <span class='skill'>" + strAttackDesc + "</span> against " + this.heroDesc() + ".</div>";
    
    if (outcomeRoll < 0.4 && (damageResult["damageSource"] == "active" || damageResult["damageSource"] == "basic")) {
      result += "<div>Damage dodged by <span class='skill'>Darkness Befall</span>.</div>";
      this._currentStats["damageHealed"] += damageResult["damageAmount"];
      damageResult["damageAmount"] = 0;
    } else {
      result = super.takeDamage(source, strAttackDesc, damageResult);
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
      if (targets[0]._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0) {
        additionalDamageResult = {
          "damageAmount": this._currentStats["totalAttack"] * 0.06 * (targets[0]._currentStats["energy"] + 50),
          "critted": false,
          "blocked": false,
          "damageSource": "other",
          "damageType": "normal",
          "e5Description": ""
        };
        result += targets[0].takeDamage(this, "Outburst of Magic", additionalDamageResult);
        
        if (targets[0]._currentStats["totalHP"] > 0) {
          result += targets[0].getEnergy(this, 50);
          targets[0]._currentStats["energy"] = 0;
          result += "<div>" + targets[0].heroDesc() + " energy set to " + formatNum(0) + ".</div>";
        }
      }
      
      basicQueue.push([this, targets[0], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
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
      if (targets[i]._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0) {
        additionalDamageResult = {
          "damageAmount": this._currentStats["totalAttack"] * 0.06 * targets[i]._currentStats["energy"],
          "critted": false,
          "blocked": false,
          "damageSource": "other",
          "damageType": "normal",
          "e5Description": ""
        };
        result += targets[i].takeDamage(this, "Energy Oscillation", additionalDamageResult);
      
        if (targets[i]._currentStats["totalHP"] > 0 && Math.random() < 0.7) {
          result += targets[i].getDebuff(this, "Devouring Mark", 99, {});
        }
      }
      
      activeQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
    }
    
    return result;
  }
  
  
  devouringMark(target) {
    var result = "";
    var damageResult = {};
    
    // attack % per energy damage seems to be true damage
    damageResult = {
      "damageAmount": this._currentStats["totalAttack"] * 0.1 * target._currentStats["energy"],
      "critted": false,
      "blocked": false,
      "damageSource": "mark",
      "damageType": "normal",
      "e5Description": ""
    };
    result = target.takeDamage(this, "Devouring Mark", damageResult);
    result += target.removeDebuff("Devouring Mark");
    result += "<div>Energy set to " + formatNum(0) + ".</div>";
    target._currentStats["energy"] = 0;
    
    return result;
  }
  
  
  eventAllyDied(e) { 
    var result = "";
    
    if (e[1].heroDesc() == this.heroDesc()) {
      for (var buffName in this._buffs) {
        this.removeBuff(buffName);
      }
      for (var debuffName in this._debuffs) {
        this.removeDebuff(debuffName);
      }
      
      this._currentStats["spiritPowerStacks"] = 0;
      result = "<div>" + this.heroDesc() + " became a <span class='skill'>Shadowy Spirit</span>.</div>";
    } else if (this._currentStats["totalHP"] <= 0) {
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
  
  
  startOfRound() {
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
  
  
  endOfRound() {
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
        
        damageResult = {
          "damageAmount": damageAmount,
          "critted": false,
          "blocked": false,
          "damageSource": "passive",
          "damageType": "hpPercent",
          "e5Description": ""
        };
        result += targets[i].takeDamage(this, "Shadowy Spirit", damageResult);
        
        this._currentStats["spiritPowerStacks"] += 1;
      }
    }
    
    return result;
  }
}



// E5 Cthuga
class Cthuga extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Demon Bloodline passive
    this.applyStatChange({attackPercent: 0.25, hpPercent: 0.2, damageReduce: 0.2}, "PassiveStats");
  }
}



// E5 Garuda
class Garuda extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Eagle Power passive
    this.applyStatChange({attackPercent: 0.25, hpPercent: 0.3, critDamage: 0.4, controlImmune: 0.3}, "PassiveStats");
  }
  
  
  eventAllyBasic(e) {
    var result = "";
    
    if (!("Seal of Light" in this._debuffs) && !(this.isUnderStandardControl())) {
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
  
  
  eventAllyActive(e) {
    return this.eventAllyBasic(e);
  }
  
  
  eventAllyDied(e) {
    var result = "";
    
    if (!("Seal of Light" in this._debuffs)) {
      result += "<div>" + this.heroDesc() + " <span class='skill'>Unbeatable Force</span> passive triggered.</div>";
      result += this.getHeal(this, this._stats["totalHP"] * 0.3 * (1 + this._currentStats["healEffect"]));
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
      activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
    }
    
    // Use up all Feather Blades
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
    
    return result;
  }
}



// E5 Gustin
class Gustin extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Shadow Imprint passive
    this.applyStatChange({hpPercent: 0.25, speed: 30, controlImmune: 0.3, effectBeingHealed: 0.3}, "PassiveStats");
  }
}



// E5 Horus
class Horus extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Corrupted Rebirth passive
    this.applyStatChange({hpPercent: 0.4, attackPercent: 0.3, armorBreak: 0.4, block: 0.6}, "PassiveStats");
  }
}



// E5 Mihm
class Mihm extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Unreal Instinct passive
    this.applyStatChange({hpPercent: 0.4, damageReduce: 0.3, speed: 60, controlImmune: 1.0}, "PassiveStats");
  }
}



// E5 Nakia
class Nakia extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Arachnid Madness passive
    this.applyStatChange({attackPercent: 0.35, crit: 0.35, controlImmune: 0.3, speed: 30}, "PassiveStats");
  }
}



// E5 Oberon
class Oberon extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Strength of Elf passive
    this.applyStatChange({attackPercent: 0.3, hpPercent: 0.35, speed: 40, effectBeingHealed: 0.3}, "PassiveStats");
  }
}



// E5 Penny
class Penny extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Troublemaker Gene passive
    this.applyStatChange({attackPercent: 0.3, hpPercent: 0.25, crit: 0.3, precision: 1.0}, "PassiveStats");
  }
  
  
  eventAllyBasic(e) {
    var result = "";
    
    for (var i in e) {
      if (this.heroDesc() == e[i][0].heroDesc() && e[i][3] == true && !("Seal of Light" in this._debuffs)) {
        var damageResult = {};
        var targets = getAllTargets(this, this._enemies);
        
        result += "<div>" + this.heroDesc() + " <span class='skill'>Eerie Trickery</span> triggered on crit.</div>";
        
        for (var h=0; h<targets.length; h++) {
          if (targets[h]._currentStats["totalHP"] > 0) {
            damageResult = {
              damageAmount: e[i][2], 
              critted: 0, 
              blocked: 0, 
              damageSource: "passive", 
              damageType: "normal", 
              e5Description: ""
            };
            result += targets[h].takeDamage(this, "Eerie Trickery", damageResult);
          }
        }
        
        result += this.getBuff(this, "Dynamite Armor", 99, {});
        result += this.getBuff(this, "Reflection Armor", 99, {});
      }
    }
    
    return result;
  }
  
  
  eventAllyActive(e) {
    return this.eventAllyBasic(e);
  }
  
  
  takeDamage(source, strAttackDesc, damageResult) {
    var result = "";
    var reflectDamageResult = {};
    var tempDamageAmount = damageResult["damageAmount"];
    var allDamageReduce = this._currentStats["allDamageReduce"];
    
    
    if (["bleed", "poison", "burn"].includes(damageResult["damageType"])) {
      var dotReduce = this._currentStats["dotReduce"];
      tempDamageAmount = tempDamageAmount * (1 - dotReduce);
    }
    
    tempDamageAmount = Math.round(tempDamageAmount * (1-allDamageReduce));
    
    
    if (["active", "active2", "basic"].includes(damageResult["damageSource"]) && "Reflection Armor" in this._buffs && !("Guardian Shadow" in this._buffs)) {
      damageResult["damageAmount"] = damageResult["damageAmount"] / 2;
      result += super.takeDamage(source, strAttackDesc, damageResult);
      
      result += "<div><span class='skill'>Reflection Armor</span> consumed.</div>";
      tempDamageAmount = Math.floor(tempDamageAmount / 2);
      
      reflectDamageResult = {
        damageAmount: tempDamageAmount, 
        critted: 0, 
        blocked: 0, 
        damageSource: "passive", 
        damageType: "normal", 
        e5Description: ""
      }
      
      result += source.takeDamage(this, "Reflection Armor", reflectDamageResult);
      this._currentStats["damageHealed"] += tempDamageAmount;
      
      delete this._buffs["Reflection Armor"][Object.keys(this._buffs["Reflection Armor"])[0]];
      
    } else {
      result += super.takeDamage(source, strAttackDesc, damageResult);
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
          delete this._buffs["Dynamite Armor"][Object.keys(this._buffs["Dynamite Armor"])[0]];
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
        basicQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
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
        activeQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
        
        if (damageResult["damageAmount"] > 0 && targets[0]._currentStats["totalHP"] > 0) {
          burnDamageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "burn", 1.5, 0, 0, 1, 6);
          result += targets[0].getDebuff(this, "Fatal Fireworks Burn", 6, {burn: Math.round(burnDamageResult["damageAmount"])});
        }
      }
    }
    
    result += this.getBuff(this, "Dynamite Armor", 99, {});
    
    return result;
  }
}



// E5 Tara
class Tara extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Immense Power passive
    this.applyStatChange({hpPercent: 0.4, holyDamage: 0.7, controlImmune: 0.3, damageReduce: 0.3}, "PassiveStats");
  }
  
  
  eventAllyBasic(e) {
    var result = "";
    
    if (e.length > 0) {
      if (this.heroDesc() == e[0][0].heroDesc() && !(this.isUnderStandardControl()) && !("Seal of Light" in this._debuffs)) {
        var damageResult = {};
        var targets = getAllTargets(this, this._enemies);
        
        for (var i=0; i<targets.length; i++) {
          if (targets[i]._currentStats["totalHP"] > 0) {
            this._rng = Math.random();
            damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 4, "passive", "normal", 1, 0, 0, 0);
            result += targets[i].takeDamage(this, "Fluctuation of Light", damageResult);
            
            if (Math.random() < 0.3) {
              result += targets[i].getDebuff(this, "Power of Light", 99, {});
            }
          }
        }
      }
    }
    
    return result;
  }
  
  
  eventAllyActive(e) {
    return this.eventAllyBasic(e);
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 3, "basic", "normal");
      result = targets[0].takeDamage(this, "Basic Attack", damageResult);
      basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      
      if (damageResult["damageAmount"] > 0) {
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
      
      if (damageResult["damageAmount"] > 0) {
        var numAdditionalAttacks = Math.floor(Math.random() * 3) + 1;
        
        for (var i=0; i<numAdditionalAttacks; i++) {
          result += targets[0].takeDamage(this, "Seal of Light", damageResult);
        }
        
        result += targets[0].getDebuff(this, "Power of Light", 99, {});
      }
      activeQueue.push([this, targets[0], damageResult["damageAmount"] * (numAdditionalAttacks + 1), damageResult["critted"]]);
      
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



// E5 Unimax-3000
class UniMax3000 extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Machine Forewarning passive
    this.applyStatChange({armorPercent: 0.3, hpPercent: 0.4, attackPercent: 0.25, controlImmune: 0.3, energy: 50}, "PassiveStats");
  }
}