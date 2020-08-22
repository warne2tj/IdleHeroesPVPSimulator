
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
        result += this.balanceMark(trigger[2], trigger[3]);
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
      result += this.eventSelfBasic();
    } else if (trigger[1] == "eventSelfDied") {
      result += this.eventSelfDied();
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
      result += this.eventAllyDied();
    } else if (trigger[1] == "devouringMark") {
      if (trigger[2]._currentStats["totalHP"] > 0) {
        result += this.devouringMark(trigger[2], trigger[3], trigger[4]);
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
        if (source.hasStatus("Burn") || source.hasStatus("Burn True")) {
          triggerQueue.push([this, "eventTookDamageFromBurning"]);
        }
        
        if (source.hasStatus("Bleed") || source.hasStatus("Bleed True")) {
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
        result += this.eventSelfBasic(trigger[2][0][1]);
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
        
        if (targets[i]._currentStats["totalHP"] > 0) {
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
      result += this.eventSelfBasic();
    } else if (["eventEnemyActive", "eventEnemyBasic"].includes(trigger[1])) {
      result += this.eventEnemyBasic(trigger[2], trigger[3]);
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
        result += this.eventAllyBasic(trigger[3]);
    } else if (["eventSelfBasic", "eventSelfActive"].includes(trigger[1]) && !(this.isUnderStandardControl()) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
        result += this.eventAllyBasic(trigger[2]);
    } else if (["eventAllyDied", "eventEnemyDied"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventAllyDied();
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
      result += this.eventEnemyDied();
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
    this._stats["reflectAmount"] = 0;
  }
  
  passiveStats() {
    // apply Shadow Imprint passive
    this.applyStatChange({hpPercent: 0.25, speed: 30, controlImmune: 0.3, effectBeingHealed: 0.3}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventEnemyBasic", "eventEnemyActive"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventEnemyBasic(trigger[3]);
    } else if (trigger[1] == "eventTookDamage" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventTookDamage();
    }
    
    return result;
  }
  
  
  startOfBattle() {
    var targets = getRandomTargets(this, this._enemies, 1);
    var result = targets[0].getDebuff(this, "Link of Souls", 127);
    return result;
  }
  
  
  eventTookDamage() {
    var result = "";
    var targets = getAllTargets(this, this._enemies);
    
    if (this._currentStats["linkCount"] < 5) {
      for (let i in targets) {
        if ("Link of Souls" in targets[i]._debuffs) {
          for (let s in targets[i]._debuffs["Link of Souls"]) {
            if (targets[i]._debuffs["Link of Souls"][s]["source"].heroDesc() == this.heroDesc()) {
              var damageResult = this.calcDamage(targets[i], this._currentStats["reflectAmount"], "passive", "true");
              result += targets[i].takeDamage(this, "Link of Souls", damageResult);
              
              this._currentStats["linkCount"]++;
              this._currentStats["reflectAmount"] = 0;
              break;
            }
          }
        }
      }
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
        result += targets[0].getDebuff(this, "Link of Souls", 127);
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
    
    if (damageAmount > 0 && !(isMonster(source))) {
      this._currentStats["reflectAmount"] += damageAmount;
      triggerQueue.push([this, "eventTookDamage"]);
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
      result += this.eventEnemyActive();
    } else if (trigger[1] == "eventTookDamage" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventTookDamage();
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
      result += this.eventSelfActive(trigger[2]);
    } else if (trigger[1] == "eventEnemyDied" && trigger[2].heroDesc() == this.heroDesc() && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventEnemyDied();
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
        damageResult = this.calcDamage(e[i][1], e[i][2] * 0.25, "passive", "poisonTrue");
        result += e[i][1].getDebuff(this, "Poison True", 2, {poisonTrue: damageResult["damageAmount"]}, false, "passive");
        
        if (e[i][1]._currentStats["totalHP"] > 0 && e[i][3] == true) {
          damageResult = this.calcDamage(e[i][1], e[i][2] * 0.25, "passive", "bleedTrue");
          result += e[i][1].getDebuff(this, "Bleed True", 2, {bleedTrue: damageResult["damageAmount"]}, false, "passive");
        }
      }
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = this._enemies;
    var healAmount = 0;
    var targetLock;
    var alreadyTargeted = {};
    
    for (let i in targets) {
      if (targets[i]._currentStats["totalHP"] > 0) {
        targetLock = targets[i].getTargetLock(this);
        result += targetLock;
        
        if (targetLock == "") {
          if ("Ghost Possessed" in this._enemies[i]._debuffs) {
            damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 1.8, "basic", "normal");
            result += targets[i].takeDamage(this, "GP - Basic Attack", damageResult);
            alreadyTargeted[targets[i]._heroPos] = [this, targets[i], damageResult["damageAmount"], damageResult["critted"]];
            
            healAmount = this.calcHeal(this, damageResult["damageAmount"]);
            result += this.getHeal(this, healAmount);
          }
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
        
        if (targets[0]._heroPos in alreadyTargeted) {
          alreadyTargeted[targets[0]._heroPos][2] += damageResult["damageAmount"];
          alreadyTargeted[targets[0]._heroPos][3] = alreadyTargeted[targets[0]._heroPos][3] || damageResult["critted"];
        } else {
          alreadyTargeted[targets[0]._heroPos] = [this, targets[0], damageResult["damageAmount"], damageResult["critted"]];
        }
      }
    }
    
    
    for (let i in alreadyTargeted) {
      basicQueue.push(alreadyTargeted[i]);
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
    var alreadyTargeted = {};
    
    for (let i in targets) {
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
        
          alreadyTargeted[targets[i]._heroPos] = [this, targets[i], damageResult["damageAmount"] + hpDamageResult["damageAmount"], damageResult["critted"]];
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
        
        
        if (targets[0]._heroPos in alreadyTargeted) {
          alreadyTargeted[targets[0]._heroPos][2] += damageResult["damageAmount"] + hpDamageResult["damageAmount"];
          alreadyTargeted[targets[0]._heroPos][3] = alreadyTargeted[targets[0]._heroPos][3] || damageResult["critted"];
        } else {
          alreadyTargeted[targets[0]._heroPos] = [this, targets[0], damageResult["damageAmount"], damageResult["critted"]];
        }
      }
    }
    
    
    for (let i in alreadyTargeted) {
      activeQueue.push(alreadyTargeted[i]);
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
      result += this.eventAllyBasic(trigger[2], trigger[3]);
    } else if (["eventSelfBasic", "eventSelfActive"].includes(trigger[1]) && "Blaze of Seraph" in this._buffs) {
      result += this.eventAllyBasic(this, trigger[2]);
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
      result += e[i][1].getDebuff(this, "Burn True", 2, {burnTrue: damageResult["damageAmount"]}, false, "passive");
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
      result += this.eventEnemyDied();
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
      result += this.eventSelfActive(trigger[2]);
    } else if (trigger[1] == "eventSelfBasic" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventSelfBasic(trigger[2]);
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
      result += this.eventSelfBasic();
    } else if (trigger[1] == "eventTwine" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventTwine();
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
      result += this.eventSelfBasic(trigger[2]);
    } else if (trigger[1] == "eventTookDamage" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventTookDamage(trigger[2], trigger[3]);
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
      result += this.eventHPlte30();
    } else if (trigger[1] == "eventGotCC" && this._currentStats["wellCalculatedStacks"] > 0 && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventGotCC(trigger[2], trigger[3], trigger[4]);
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
      result += this.eventSelfBasic();
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
      result += this.eventSelfBasic();
    } else if (["eventEnemyActive", "eventEnemyBasic"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventEnemyActive(trigger[2], trigger[3]);
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
        result += this.critMark(trigger[2], trigger[3]);
      }
    } else if (["eventEnemyActive", "eventEnemyBasic"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventEnemyActive(trigger[3]);
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
      result += this.eventSelfActive();
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
      result += this.eventSelfActive();
    } else if (trigger[1] == "eventSelfBasic" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventSelfBasic();
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
      result += this.eventGotCC();
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
      result += targets[i].getDebuff(this, "Burn True", 1, {burnTrue: damageResult["damageAmount"]});
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
          result += targets[i].getDebuff(this, "Burn True", 1, {burnTrue: damageResult["damageAmount"]});
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
        result += targets[i].getDebuff(this, "Burn True", 1, {burnTrue: damageResult["damageAmount"]});
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
      result += this.eventHPlte50();
    } else if (trigger[1] == "eventSelfBasic" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventSelfBasic(trigger[2]);
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
      result += this.eventSelfBasic();
    } else if (["eventEnemyActive", "eventEnemyBasic"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventEnemyActive(trigger[3]);
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
      result += this.eventSelfBasic(trigger[2]);
    } else if (["eventEnemyActive", "eventEnemyBasic"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventEnemyActive(trigger[2], trigger[3]);
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
      result += this.eventSelfBasic();
    } else if (["eventSelfActive", "eventAllyActive"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventSelfActive();
    }
    
    return result;
  }
  
  
  eventSelfBasic() {
    var result = "";
    result += this.getBuff(this, "Attack Percent", 3, {attackPercent: 0.20});
    result += this.getBuff(this, "Speed", 3, {speed: 15});
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
        
        bleedDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "bleed", 0.56, 3);
        result += targets[i].getDebuff(this, "Bleed", 3, {bleed: bleedDamageResult["damageAmount"]}, false, "active");
        
        if (targets[i]._heroClass == "Ranger") {
          rangerDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "bleed", 1.05, 3);
          result += targets[i].getDebuff(this, "Bleed", 3, {bleed: rangerDamageResult["damageAmount"]}, false, "active");
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + bleedDamageResult["damageAmount"] + rangerDamageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    result += this.getBuff(this, "Skill Damage", 15, {skillDamage: 0.50});
    
    return result;
  }
}


// Ignis
class Ignis extends hero {
  passiveStats() {
    // apply Blood of Dragons passive
    this.applyStatChange({hpPercent: 0.40, damageReduce: 0.30, healEffect: 0.25, speed: 60}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (trigger[1] == "eventSelfBasic" && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventSelfBasic();
    } else if (trigger[1] == "eventSelfDied") {
      result += this.eventSelfDied();
    }
    
    return result;
  }
  
  
  eventSelfBasic() {
    var result = "";
    var lostAmount = Math.floor(this._currentStats["totalHP"] * 0.25);
    var healAmount = 0;
    
    this._currentStats["totalHP"] -= lostAmount;
    result += "<div>" + this.heroDesc() + " <span class='skill'>Life Breath</span> consumed " + formatNum(lostAmount) + " HP.</div>";
    
    
    var targets = getLowestHPTargets(this, this._allies, 3);
    
    for (let i in targets) {
      healAmount = this.calcHeal(targets[i], this._stats["totalHP"] * 0.25);
      result += targets[i].getHeal(this, healAmount);
      result += targets[i].getBuff(this, "Damage Reduce", 2, {damageReduce: 0.15});
    }
    
    return result;
  }
  
  
  eventSelfDied() {
    var result = "";
    var targets = getNearestTargets(this, this._allies, 1);
    
    for (let i in targets) {
      let healAmount = this.calcHeal(targets[i], targets[i]._stats["totalHP"]);
      result += targets[i].getHeal(this, healAmount);
      result += targets[i].getEnergy(this, 100);
      result += targets[i].getBuff(this, "Control Immune", 15, {controlImmune: 1.0});
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getFrontTargets(this, this._enemies);
    var targetLock;
    
    for (let i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.28);
        result += targets[i].takeDamage(this, "Blessing of Dragonflame", damageResult);
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    
    targets = getLowestHPTargets(this, this._allies, 1);
    for (let i in targets) {
      let healAmount = this.calcHeal(targets[i], this._currentStats["totalHP"] * 0.50);
      result += targets[i].getHeal(this, healAmount);
    }
    
    
    targets = getNearestTargets(this, this._allies, 1);
    for (let i in targets) {
      result += targets[i].getBuff(this, "Damage Reduce", 3, {damageReduce: 0.40});
      result += targets[i].getEnergy(this, 100);
    }
    
    return result;
  }
}


// Heart Watcher
class HeartWatcher extends hero {
  passiveStats() {
    // apply Tough Heart passive
    this.applyStatChange({attackPercent: 0.30, crit: 0.30, hpPercent: 0.20}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventSelfBasic", "eventSelfActive"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventSelfBasic(trigger[2]);
    }
    
    return result;
  }
  
  
  eventSelfBasic(e) {
    var result = "";
    
    for (let i in e) {
      if (e[i][3] == true) {
        var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 2.8);
        result = this.getHeal(this, healAmount);
        break;
      }
    }
    
    return result;
  }
  
  
  getWatcherMarkAmount(target, wmAmount) {
    var currAmount = 0;
    
    if ("Watcher Mark" in target._debuffs) {
      for (let s of Object.values(target._debuffs["Watcher Mark"])) {
        currAmount += s["effects"]["allDamageTaken"];
      }
    }
    
    if (currAmount + wmAmount > 3) {
      wmAmount = 3 - currAmount;
    }
    
    return wmAmount;
  }
  
  
  doBasic() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 2);
    var targetLock;
    var wmAmount = 0;
    
    for (let i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "basic", "normal", 1.1);
        result += targets[i].takeDamage(this, "Weakness Strike", damageResult);
        basicQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
        
        wmAmount = this.getWatcherMarkAmount(targets[i], 0.35);
        result += targets[i].getDebuff(this, "Watcher Mark", 15, {allDamageTaken: wmAmount});
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies, 2);
    var targetLock;
    var reduceAttackAmount = 0;
    var wmAmount = 0;
    
    for (let i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.55);
        result += targets[i].takeDamage(this, "Mind Torture", damageResult);
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
        
        reduceAttackAmount = Math.floor(0.25 * targets[i]._stats["totalAttack"]);
        result += targets[i].getDebuff(this, "Attack", 2, {attack: reduceAttackAmount});
        
        wmAmount = this.getWatcherMarkAmount(targets[i], 0.45);
        result += targets[i].getDebuff(this, "Watcher Mark", 15, {allDamageTaken: wmAmount});
      }
    }
    
    return result;
  }
}


// King Barton
class KingBarton extends hero {
  passiveStats() {
    // apply King's Demeanor passive
    this.applyStatChange({hpPercent: 0.40, attackPercent: 0.35, controlImmune: 0.35, damageAgainstStun: 1.0}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = super.handleTrigger(trigger);
    
    if (["eventEnemyBasic", "eventEnemyActive"].includes(trigger[1]) && this._currentStats["totalHP"] > 0 && this.isNotSealed()) {
      result += this.eventEnemyBasic(trigger[3]);
    }
    
    return result;
  }
  
  
  eventEnemyBasic(e) {
    var result = "";
    
    for (var i in e) {
      if (e[i][1].heroDesc() == this.heroDesc()) {
        var targets = getAllTargets(this, this._enemies);
        var damageResult;
        
        result += this.getBuff(this, "Attack Percent", 1, {attackPercent: 0.30});
        
        for (let h in targets) {
          damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 1.5, "passive", "normal");
          result += targets[i].takeDamage(this, "The Call of the King", damageResult);
        }
        
        break;
      }
    }
    
    return result;
  }
  
  
  doBasic() { 
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    var targetLock;
    
    for (var i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "basic", "normal", 1.25);
        result += targets[i].takeDamage(this, "Heroic Charge", damageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          result += targets[i].getDebuff(this, "stun", 2, {}, false, "", 0.25);
        }
        
        basicQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doActive() { 
    var result = "";
    var damageResult = {};
    var targets = getFrontTargets(this, this._enemies);
    var targetLock;
    
    
    for (let i in targets) {
      targetLock = targets[i].getTargetLock(this);
      result += targetLock;
      
      if (targetLock == "") {
        damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 3.15);
        result += targets[i].takeDamage(this, "Hammer's Verdict", damageResult);
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    
    result += this.getBuff(this, "Damage Reduce", 3, {damageReduce: 0.20});
    result += this.getBuff(this, "Attack Percent", 3, {attackPercent: 0.40});
    
    
    targets = getAllTargets(this, this._allies);
    for (let i in targets) {
      result += targets[i].getBuff(this, "King's Shelter", 3, {damageReduce: 0.10}, true);
    }
    
    return result;
  }
}
