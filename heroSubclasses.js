/* 
Important Notes
  * Don't forget to check for Tara's Seal of Light if needed.
  * Don't forget to check for CC if needed.
  * When getting targets, check that the target is alive. In case all targets are dead. 
      Some effects still happen with no currently living targets.
      i.e. only sleepless left to resurrect at end of round, kroos attack still heals
  * After doing damage, check that damage amount is greater than 0. If it's 0, then the target was Carrie and she dodged.
  * When overriding events, you might need to check that the target or source of the event is the same as the hero being called
      Depending on the details of the skill that is. 
      Some react to anyone triggering the event, some only react to themselves.
  * Rng for a hero's attack is initially generated at the beginning of their turn. 
      Need to regenerate if they do further attacks. 
      But maybe not depending on if subsequent attacks use the same roll. This is an open question.
  
  

Important Function prototypes

  this.calcDamage(target, attackDamage, damageSource, damageType, skillDamage=1, canCrit=1, dotRounds=0)
      return {"damageAmount", "critted", "blocked", "damageSource", "damageType", "e5Description"} 
      damageSource = passive, basic, active, mark, monster, active2, debuff
        active2: does not apply skill damage but applies other skill related effects
      damageType = normal, burn, bleed, poison, hpPercent, energy, true


  this.takeDamage(source, strAttackDesc, damageResult{}, armorReduces=1)
      
  this.calcHeal(target, healAmount)

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
  
  this.eventAllyBasic(src, e), this.eventAllyActive(src, e), this.eventAllyDied(e), this.eventEnemyDied(e) = called by all heroes so they can react to an event

  this.eventEnemyBasic(src, e), this.eventEnemyActive(src, e) = if overridden, call the super() version so the enemy still gains energy on an attack
    
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
          
          additionalDamageResult = this.calcDamage(targets[i], additionalDamage, "basic", "true");
          result += targets[i].takeDamage(this, "Death Threat", additionalDamageResult);
        }
      }
      
      basicQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
    }
    
    return result;
  }
  
  doActive() {
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {damageAmount: 0};
    var targets = getLowestHPTargets(this, this._enemies);
    var healAmount = 0;
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
          
          additionalDamageResult = this.calcDamage(targets[i], additionalDamage, "active", "true");
          result += targets[i].takeDamage(this, "Nether Strike 2", additionalDamageResult);
        }
      }
      
      if (damageResult["damageAmount"] > 0) {
        healAmount = this.calcHeal(this, (damageResult["damageAmount"] + additionalDamageResult["damageAmount"]) * 0.2);
        if (healAmount > 0) {
          result += this.getHeal(this, healAmount);
          result += this.getBuff(this, "Nether Strike", 6, {attackPercent: 0.4});
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  eventEnemyDied(e) { 
    var result = ""
    
    if (!("Seal of Light" in this._debuffs)) {
      var healAmount = this.calcHeal(this, this._currentStats["totalAttack"]);
      
      result = "<div>" + this.heroDesc() + " <span class='skill'>Blood Armor</span> passive triggered.</div>";
      result += this.getHeal(this, healAmount);
      result += this.getBuff(this, "Blood Armor", 1, {damageReduce: 0.1});
    }
    
    return result;
  }
}


// Aida
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
      
      var damageResult = this.calcDamage(target, damageAmount, "mark", "hpPercent");
      result += target.removeDebuff("Balance Mark");
      result += target.takeDamage(this, "Balance Mark", damageResult);
    }
    
    return result;
  }
  
  
  endOfRound() {
    var result = "";
    var healAmount = 0;
    
    if ("Fury of Justice" in this._buffs) {
      healAmount = this.calcHeal(this, damageInRound * 0.35);
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
        
        additionalDamageResult = this.calcDamage(targets[i], additionalDamage, "basic", "hpPercent");
        result += targets[i].takeDamage(this, "Fury of Justice", additionalDamageResult);
      }
      
      if (damageResult["damageAmount"] > 0) {
        basicQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
      }
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
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal");
      result += targets[i].takeDamage(this, "Order Restore", damageResult, 0);
      
      if (damageResult["damageAmount"] > 0) {
        targets[i].getDebuff(this, "Balance Mark", 3, {});
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
    
  }
}



// Amen-Ra
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
  
  
  eventAllyActive(source, e) {
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
        
        if (damageResult["damageAmount"] > 0) {
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
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  
  passiveStats() {
    // apply Journey of Soul passive
    this.applyStatChange({hpPercent: 0.3, speed: 60, attackPercent: .3, petrifyImmune: 1}, "PassiveStats");
  }
  
  
  eventAllyActive(source, e) {
    var result = "";
    
    // Does not trigger himself on his own active
    if (!("Seal of Light" in this._debuffs) && this.heroDesc() != source.heroDesc()) {
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
      
      if (damageResult["damageAmount"] > 0) {
        result += "<div><span class='skill'>Arcane Imprisonment</span> reduced target's energy by " + formatNum(50) + ".</div>";
        if (targets[0]._currentStats["energy"] > 50) {
          targets[0]._currentStats["energy"] -= 50;
        } else {
          targets[0]._currentStats["energy"] = 0;
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
      
      if (targets[i]._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0) {
        hpDamage = targets[i]._stats["totalHP"] * 0.21;
        if (hpDamage > this._currentStats["totalAttack"] * 15) {
          hpDamage = this._currentStats["totalAttack"] * 15;
        }
        
        hpDamageResult = this.calcDamage(targets[i], hpDamage, "active", "hpPercent");
        result += targets[i].takeDamage(this, "Scarlet Contract HP", hpDamageResult);
        result += targets[i].getDebuff(this, "Scarlet Contract", 2, {effectBeingHealed: 0.3});
      }
      
      if (targets[i]._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0 && targets[i]._heroClass == "Priest") {
        priestDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.7);
        result += targets[i].takeDamage(this, "Scarlet Contract Priest", priestDamageResult);
      }
      
      if (damageResult["damageAmount"] > 0) {
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
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Dark Storm passive
    this.applyStatChange({hpPercent: 0.4, attackPercent: 0.2, crit: 0.35, armorBreak: 0.5}, "PassiveStats");
  }
  
  
  eventAllyActive(source, e) {
    var result = "";
    if (source.heroDesc() == this.heroDesc() && !("Seal of Light" in this._debuffs)) {
      result += this.getBuff(this, "Soul Sacrifice", 99, {attackPercent: 0.15, critDamage: 0.15});
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
      
      if (targets[0]._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0) {
        hpDamage = 0.15 * (targets[0]._stats["totalHP"] - targets[0]._currentStats["totalHP"]);
        maxDamage = 15 * this._currentStats["totalAttack"];
        if (hpDamage > maxDamage) { hpDamage = maxDamage; }
        
        hpDamageResult = this.calcDamage(targets[0], hpDamage, "basic", "hpPercent");
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
            additionalDamageResult = this.calcDamage(targets[0], additionalDamage, "basic", "true");
            result += targets[0].takeDamage(this, "Rage of Shadow Below 35%", additionalDamageResult);
            
            var healAmount = this.calcHeal(this, additionalDamageResult["damageAmount"]);
            result += this.getHeal(this, healAmount);
          }
        }
      }
      
      if (damageResult["damageAmount"] > 0) {
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
      
      if (targets[i]._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0) {
        hpDamage = 0.2 * targets[i]._currentStats["totalHP"];
        maxDamage = 15 * this._currentStats["totalAttack"];
        if (hpDamage > maxDamage) { hpDamage = maxDamage; }
        
        hpDamageResult = this.calcDamage(targets[i], hpDamage, "active", "hpPercent");
        result += targets[i].takeDamage(this, "Dread's Coming HP", hpDamageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          var beforeHorrifyCount = 0;
          if (!("Horrify" in targets[i]._debuffs)) {
            beforeHorrifyCount = 0;
          } else {
            beforeHorrifyCount = Object.keys(targets[i]._debuffs["Horrify"]).length;
          }
          
          if (Math.random() < 0.5) {
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

            additionalDamageResult = this.calcDamage(targets[i], additionalDamage, "active", "true");
            result += targets[i].takeDamage(this, "Dread's Coming Below 35%", additionalDamageResult);
            
            var healAmount = this.calcHeal(this, additionalDamageResult["damageAmount"]);
            result += this.getHeal(this, healAmount);
          }
        }
      }
      
      if (damageResult["damageAmount"] > 0) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + hpDamageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
}



// Belrain
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
      
      if (damageResult["damageAmount"] > 0) {
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
        if ("Seal of Light" in targets[i]._debuffs) { result += targets[i].removeDebuff("Seal of Light"); }
        if ("Horrify" in targets[i]._debuffs) { result += targets[i].removeDebuff("Horrify"); }
        if ("petrify" in targets[i]._debuffs) { result += targets[i].removeDebuff("petrify"); }
        if ("stun" in targets[i]._debuffs) { result += targets[i].removeDebuff("stun"); }
        if ("entangle" in targets[i]._debuffs) { result += targets[i].removeDebuff("entangle"); }
        if ("freeze" in targets[i]._debuffs) { result += targets[i].removeDebuff("freeze"); }
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
    } else {
      result = super.takeDamage(source, strAttackDesc, damageResult, armorReduces);
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
        var additionalDamageAmount = this._currentStats["totalAttack"] * 0.06 * (targets[0]._currentStats["energy"] + 50);
        additionalDamageResult = this.calcDamage(targets[0], additionalDamageAmount, "basic", "energy");
        result += targets[0].takeDamage(this, "Outburst of Magic", additionalDamageResult);
        
        if (targets[0]._currentStats["totalHP"] > 0) {
          result += targets[0].getEnergy(this, 50);
          targets[0]._currentStats["energy"] = 0;
          result += "<div>" + targets[0].heroDesc() + " energy set to " + formatNum(0) + ".</div>";
        }
      }
      
      if (damageResult["damageAmount"] > 0) {
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
      if (targets[i]._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0) {
        var additionalDamageAmount = this._currentStats["totalAttack"] * 0.06 * targets[i]._currentStats["energy"];
        additionalDamageResult = this.calcDamage(targets[i], additionalDamageAmount, "active", "energy");
        result += targets[i].takeDamage(this, "Energy Oscillation", additionalDamageResult);
      
        if (targets[i]._currentStats["totalHP"] > 0 && Math.random() < 0.7) {
          result += targets[i].getDebuff(this, "Devouring Mark", 99, {});
        }
      }
      
      if (damageResult["damageAmount"] > 0) {
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
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Demon Bloodline passive
    this.applyStatChange({attackPercent: 0.25, hpPercent: 0.2, damageReduce: 0.2}, "PassiveStats");
  }
}



// Dark Arthindol
class DarkArthindol extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  
  passiveStats() {
    // apply Black Hole passive
    this.applyStatChange({skillDamage: 1.0, hpPercent: 0.4, speed: 60}, "PassiveStats");
  }
  
  
  takeDamage(source, strAttackDesc, damageResult, armorReduces=1) {
    var result = "";
    var preHP = this._currentStats["totalHP"];
    
    result += super.takeDamage(source, strAttackDesc, damageResult, armorReduces);
    
    var postHP = this._currentStats["totalHP"];
    
    if (!("Seal of Light" in this._debuffs) && (preHP - postHP)/this._stats["totalHP"] >= 0.03) {
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
      
      if (damageResult["damageAmount"] > 0 && targets[0]._currentStats["totalHP"] > 0) {
        result += "<div><span class='skill'>Petrify</span> reduced target's energy by " + formatNum(50) + ".</div>";
        if (targets[0]._currentStats["energy"] > 50) {
          targets[0]._currentStats["energy"] -= 50;
        } else {
          targets[0]._currentStats["energy"] = 0;
        }
        
        result += targets[0].getDebuff(this, "petrify", 1, {});
      }
        
      if (damageResult["damageAmount"] > 0) {
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
      
      if (damageResult["damageAmount"] > 0 && targets[0]._currentStats["totalHP"] > 0) {
        if (Math.random() < 0.3) {
          result += targets[i].getDebuff(this, "petrify", 2, {});
        }
        
        if (Math.random() < 0.3) {
          result += "<div><span class='skill'>Chaotic Shade</span> reduced target's energy by " + formatNum(30) + ".</div>";
          if (targets[i]._currentStats["energy"] > 30) {
            targets[i]._currentStats["energy"] -= 30;
          } else {
            targets[i]._currentStats["energy"] = 0;
          }
        }
      }
      
      if (damageResult["damageAmount"] > 0) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    result += this.getBuff(this, "Chaotic Shade", 2, {damageReduce: 0.4});
    
    return result;
  }
}



// Garuda
class Garuda extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Eagle Power passive
    this.applyStatChange({attackPercent: 0.25, hpPercent: 0.3, critDamage: 0.4, controlImmune: 0.3}, "PassiveStats");
  }
  
  
  eventAllyBasic(source, e) {
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
  
  
  eventAllyActive(source, e) {
    return this.eventAllyBasic(source, e);
  }
  
  
  eventAllyDied(e) {
    var result = "";
    
    if (!("Seal of Light" in this._debuffs)) {
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
      
      if (damageResult["damageAmount"] > 0) {
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



// Gustin
class Gustin extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Shadow Imprint passive
    this.applyStatChange({hpPercent: 0.25, speed: 30, controlImmune: 0.3, effectBeingHealed: 0.3}, "PassiveStats");
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
    
    if (!("Seal of Light" in this._debuffs)) {
      if (this._currentStats["blockCount"] >= 3) {
        this._currentStats["blockCount"] = 0;
        
        if ("Seal of Light" in this._debuffs) { result += this.removeDebuff("Seal of Light"); }
        if ("Horrify" in this._debuffs) { result += this.removeDebuff("Horrify"); }
        if ("petrify" in this._debuffs) { result += this.removeDebuff("petrify"); }
        if ("stun" in this._debuffs) { result += this.removeDebuff("stun"); }
        if ("entangle" in this._debuffs) { result += this.removeDebuff("entangle"); }
        if ("freeze" in this._debuffs) { result += this.removeDebuff("freeze"); }
        
        
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
    }
    
    return result;
  }
  
  
  eventAllyBasic(source, e) {
    return this.eventEnemyBasic(source, e);
  }
  
  
  eventEnemyActive(source, e) {
    var result = "";
    
    if (!("Seal of Light" in this._debuffs)) {
      result += this.getBuff(this, "Descending Raven", 99, {attackPercent: 0.05, critDamage:0.02});
      result += this.eventEnemyBasic(e);
    }
    
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
      
      
      if (targets[i]._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0) {
        bleedDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "bleed", 1, 3);
        bleedDamageResult["damageAmount"] = Math.round(bleedDamageResult["damageAmount"]);
        result += targets[i].getDebuff(this, "Torment of Flesh and Soul", 3, {bleed: bleedDamageResult["damageAmount"]});
      }
      
      
      if (targets[i]._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0) {
        if (targets[i]._heroPos <= 2) {
          additionalDamage = targets[i]._stats["totalHP"] * 0.15;
          var maxDamage = this._currentStats["totalAttack"] * 15;
          if (additionalDamage > maxDamage) { additionalDamage = maxDamage; }
          
          additionalDamageResult = this.calcDamage(targets[i], additionalDamage, "active", "hpPercent");
          result += targets[i].takeDamage(this, "Torment of Flesh and Soul Front Line", additionalDamageResult);
          
        } else if (damageResult["critted"] == true){
          additionalDamageResult = this.calcDamage(targets[i], damageResult["damageAmount"] * 1.08, "active2", "true");
          result += targets[i].takeDamage(this, "Torment of Flesh and Soul Back Line", additionalDamageResult);
        }
        
      }
      
      if (damageResult["damageAmount"] > 0) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
}



// Mihm
class Mihm extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Unreal Instinct passive
    this.applyStatChange({hpPercent: 0.4, damageReduce: 0.3, speed: 60, controlImmune: 1.0}, "PassiveStats");
  }
}



// Nakia
class Nakia extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Arachnid Madness passive
    this.applyStatChange({attackPercent: 0.35, crit: 0.35, controlImmune: 0.3, speed: 30}, "PassiveStats");
  }
}



// Oberon
class Oberon extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Strength of Elf passive
    this.applyStatChange({attackPercent: 0.3, hpPercent: 0.35, speed: 40, effectBeingHealed: 0.3}, "PassiveStats");
  }
}



// Penny
class Penny extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Troublemaker Gene passive
    this.applyStatChange({attackPercent: 0.3, hpPercent: 0.25, crit: 0.3, precision: 1.0}, "PassiveStats");
  }
  
  
  eventAllyBasic(source, e) {
    var result = "";
    
    for (var i in e) {
      if (this.heroDesc() == source.heroDesc() && e[i][3] == true && !("Seal of Light" in this._debuffs)) {
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
    
    if (["bleed", "poison", "burn"].includes(damageResult["damageType"])) {
      var dotReduce = this._currentStats["dotReduce"];
      tempDamageAmount = tempDamageAmount * (1 - dotReduce);
    }
    
    tempDamageAmount = Math.round(tempDamageAmount * (1-allDamageReduce) * (1-reduceDamage) * (1-armorMitigation) * (1-classDamageReduce));
    tempHolyDamage = Math.round(tempHolyDamage * (1-allDamageReduce) * (1-reduceDamage) * (1-classDamageReduce));
    
    
    if (["active", "active2", "basic"].includes(damageResult["damageSource"]) && "Reflection Armor" in this._buffs && !("Guardian Shadow" in this._buffs)) {
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
        
        if (damageResult["damageAmount"] > 0) {
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
        
        if (damageResult["damageAmount"] > 0) {
          activeQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
        }
        
        if (damageResult["damageAmount"] > 0 && targets[0]._currentStats["totalHP"] > 0) {
          burnDamageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "burn", 1.5, 6);
          result += targets[0].getDebuff(this, "Fatal Fireworks Burn", 6, {burn: Math.round(burnDamageResult["damageAmount"])});
        }
      }
    }
    
    result += this.getBuff(this, "Dynamite Armor", 99, {});
    
    return result;
  }
}



// Tara
class Tara extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Immense Power passive
    this.applyStatChange({hpPercent: 0.4, holyDamage: 0.7, controlImmune: 0.3, damageReduce: 0.3}, "PassiveStats");
  }
  
  
  eventAllyBasic(source, e) {
    var result = "";
    
    if (this.heroDesc() == source.heroDesc() && !(this.isUnderStandardControl()) && !("Seal of Light" in this._debuffs)) {
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
      
      if (damageResult["damageAmount"] > 0) {
        basicQueue.push([this, targets[0], damageResult["damageAmount"], damageResult["critted"]]);
      }
      
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
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Machine Forewarning passive
    this.applyStatChange({armorPercent: 0.3, hpPercent: 0.4, attackPercent: 0.25, controlImmune: 0.3, energy: 50}, "PassiveStats");
  }
}