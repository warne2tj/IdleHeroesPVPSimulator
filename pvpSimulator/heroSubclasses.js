
// Aida
class Aida extends hero {
  passiveStats() {
    // apply Blessing of Light passive
    this.applyStatChange({hpPercent: 0.4, holyDamage: 1.0, damageReduce: 0.3, speed: 80}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = "";
    
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
    
    var damageResult = this.calcDamage(target, damageAmount, "mark", "hpPercent");
    result += target.takeDamage(this, "Balance Mark", damageResult);
    
    return result;
  }
  
  
  endOfRound(roundNum) {
    var result = "";
    var healAmount = 0;
    var damageResult = {};
    var targets = getAllTargets(this, this._enemies);
      
    for (var i=0; i<targets.length; i++) {
      damageResult = this.calcDamage(this, targets[i]._currentStats["totalAttack"] * 3, "passive", "normal");
      result += targets[i].takeDamage(this, "Final Verdict", damageResult);
      result += targets[i].getDebuff(this, "Effect Being Healed", 99, {effectBeingHealed: 0.1});
    }
    
    healAmount = this.calcHeal(this, this._stats["totalHP"] * 0.15);
    result += this.getHeal(this, healAmount);
    
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
    
    
    if (damageResult["damageAmount"] > 0) {
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
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1, 1, 0, 1, 0);
      result += targets[i].takeDamage(this, "Order Restore", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    targets = getAllTargets(this, this._enemies);
    for (var i = 0; i < targets.length; i++) {
      result += targets[i].getDebuff(this, "Balance Mark", 3, {attackAmount: this._currentStats["totalAttack"]});
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
    var result = "";
    
    if (["eventAllyActive", "eventSelfActive"].includes(trigger[1])) {
      result += this.eventAllyActive();
    }
    
    return result;
  }
  
  
  eventAllyActive() {
    var result = "";
    var damageResult = {};
    var targets;
    
    for (var i=1; i<=3; i++) {
      targets = getRandomTargets(this, this._enemies);
      
      if (targets.length > 0) {
        damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 2, "passive", "normal");
        result += targets[0].takeDamage(this, "Terrible Feast", damageResult);
      }
    }
    
    return result;
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
    var controlPrecision = 1 + this._currentStats["controlPrecision"];
    
    for (var i in targets) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2);
      result += targets[i].takeDamage(this, "Shadow Defense", damageResult);
      
      
      if (!("CarrieDodge" in damageResult)) {
        if (Math.random() < (0.7 * (1 + controlPrecision))) {
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


// Amuvor
class Amuvor extends hero {
  passiveStats() {
    // apply Journey of Soul passive
    this.applyStatChange({hpPercent: 0.3, speed: 60, attackPercent: .3, petrifyImmune: 1}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    var result = "";
    
    if (["eventAllyActive", "eventSelfActive"].includes(trigger[1])) {
      result += this.eventAllyActive(trigger[2]);
    }
    
    return result;
  }
  
  
  eventAllyActive(source) {
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
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 3.5);
      result = targets[i].takeDamage(this, "Scarlet Contract", damageResult);
      
      if (targets[i]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult)) {
        hpDamage = targets[i]._stats["totalHP"] * 0.21;
        if (hpDamage > this._currentStats["totalAttack"] * 15) {
          hpDamage = this._currentStats["totalAttack"] * 15;
        }
        
        hpDamageResult = this.calcDamage(targets[i], hpDamage, "active2", "hpPercent");
        result += targets[i].takeDamage(this, "Scarlet Contract HP", hpDamageResult);
      }
      
      if (targets[i]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult) && targets[i]._heroClass == "Priest") {
        priestDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active2", "normal", 1.7);
        result += targets[i].takeDamage(this, "Scarlet Contract Priest", priestDamageResult);
      }
      
      if (!("CarrieDodge" in damageResult)) {
        result += targets[i].getDebuff(this, "Effect Being Healed", 2, {effectBeingHealed: 0.3});
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + hpDamageResult["damageAmount"] + priestDamageResult["damageAmount"], damageResult["critted"] || priestDamageResult["critted"]]);
      }
      
      result += this.getBuff(this, "Crit", 3, {crit: 0.4});
    }
    
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
    var result = "";
    
    if (["eventSelfBasic", "eventSelfActive"].includes(trigger[1])) {
      result += this.eventSelfBasic();
    } else if (trigger[1] == "enemyHorrified") {
      result += this.enemyHorrified();
    }
    
    return result;
  }
  
  
  enemyHorrified() {
    var result = "";
    var healAmount = this.calcHeal(this, this._currentStats["totalAttack"] * 1.5);
    result += this.getHeal(this, healAmount);
    result += this.getBuff(this, "Shield", 99, {controlImmune: 0.2, damageReduce: 0.06});
    return result;
  }
  
  
  eventSelfBasic() {
    var result = "";
    result += this.getBuff(this, "Attack Percent", 99, {attackPercent: 0.15});
    result += this.getBuff(this, "Crit Damage", 99, {critDamage: 0.15});
    result += this.getBuff(this, "Shield", 99, {controlImmune: 0.2, damageReduce: 0.06});
    return result;
  }
  
  
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
          result += targets[0].getDebuff(this, "Horrify", 2, {});
          
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
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.6);
      result += targets[i].takeDamage(this, "Dread's Coming", damageResult);
      
      if (targets[i]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult)) {
        hpDamage = 0.2 * targets[i]._currentStats["totalHP"];
        maxDamage = 15 * this._currentStats["totalAttack"];
        if (hpDamage > maxDamage) { hpDamage = maxDamage; }
        
        hpDamageResult = this.calcDamage(targets[i], hpDamage, "active2", "hpPercent");
        result += targets[i].takeDamage(this, "Dread's Coming HP", hpDamageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          if (Math.random() < 0.5 * (1 + this._currentStats["controlPrecision"])) {
            result += targets[i].getDebuff(this, "Horrify", 2, {});
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
  
  
  handleTrigger(trigger) {
    var result = "";
    
    if (trigger[1] == "eventSelfBasic") {
      return this.eventSelfBasic();
    } else if (trigger[1] == "eventSelfDied") {
      return this.eventSelfDied();
    }
    
    return result;
  }
  
  
  eventSelfBasic() {
    var result = "";
    var healAmount;
    var targets = getLowestHPTargets(this, this._allies);
    var maxTargets = 3;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      healAmount = this.calcHeal(targets[i], this._currentStats["totalAttack"] * 2.5);
      result += targets[i].getBuff(this, "Heal", 2, {heal: healAmount});
    }
    
    return result;
  }
  
  
  eventSelfDied() { 
    var result = "";
    
    var targets = getAllTargets(this, this._allies);
    var healAmount;
    
    for (var i=0; i<targets.length; i++) {
      healAmount = this.calcHeal(targets[i], this._currentStats["totalAttack"] * 4);
      result += targets[i].getBuff(this, "Heal", 4, {heal: healAmount});
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
      result += targets[i].getBuff(this, "Attack Percent", 3, {attackPercent: 0.3});
      result += targets[i].getBuff(this, "Speed", 3, {speed: 30});
      result += targets[i].getBuff(this, "Effect Being Healed", 3, {effectBeingHealed: 0.2});
      
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
    this._stats["revive"] = 1;
    this._stats["spiritPowerStacks"] = 0;
  }
  
  
  passiveStats() {
    // apply Darkness Befall passive
    this.applyStatChange({attackPercent: 0.25, controlImmune: 0.3, speed: 60}, "PassiveStats");
  }
  
  
  handleTrigger(trigger) {
    if ((trigger[1] == "eventAllyDied" || trigger[1] == "eventEnemyDied") && this._currentStats["totalHP"] <= 0) {
      return this.eventAllyDied();
    } else if (trigger[1] == "devouringMark") {
      if (trigger[2]._currentStats["totalHP"] > 0 && "Devouring Mark" in trigger[2]._debuffs) {
        return this.devouringMark(trigger[2], trigger[3], trigger[4]);
      }
    }
    
    return "";
  }
  
  
  devouringMark(target, attackAmount, energyAmount) {
    var result = "";
    var damageResult = {};
    
    // attack % per energy damage seems to be true damage
    damageResult = this.calcDamage(target, attackAmount * 0.1 * energyAmount, "mark", "energy");
    result = target.takeDamage(this, "Devouring Mark", damageResult);
    result += target.removeDebuff("Devouring Mark");
    
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
      var targets = getLowestHPTargets(this, this._enemies);
      var maxDamage = 15 * this._currentStats["totalAttack"];
      
      if (targets.length > 0) {
        var damageAmount = 0.5 * (targets[0]._stats["totalHP"] - targets[0]._currentStats["totalHP"]);
        
        if (damageAmount > maxDamage) {
          damageAmount = maxDamage;
        }
        
        damageResult = this.calcDamage(targets[0], damageAmount, "passive", "hpPercent");
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
    var outcomeRoll = Math.random();
    
    result = "<div>" + source.heroDesc() + " used <span class='skill'>" + strAttackDesc + "</span> against " + this.heroDesc() + ".</div>";
    
    if (outcomeRoll < 0.4 && (damageResult["damageSource"] == "active" || damageResult["damageSource"] == "basic")) {
      result += "<div>Damage dodged by <span class='skill'>Darkness Befall</span>.</div>";
      this._currentStats["damageHealed"] += damageResult["damageAmount"];
      damageResult["damageAmount"] = 0;
      damageResult["CarrieDodge"] = true;
    } else {
      result = super.takeDamage(source, strAttackDesc, damageResult);
    }
    
    
    if (this._currentStats["totalHP"] <= 0 && damageResult["damageSource"].substring(0, 7) != "passive") {
      this._currentStats["spiritPowerStacks"] = 0;
      result += "<div>" + this.heroDesc() + " became a <span class='skill'>Shadowy Spirit</span>.</div>";
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
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.2);
      result += targets[i].takeDamage(this, "Energy Devouring", damageResult);
      
      // attack % per energy damage seems to be true damage
      if (targets[i]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult)) {
        if (targets[i]._currentStats["energy"] > 0) {
          var additionalDamageAmount = this._currentStats["totalAttack"] * 0.06 * targets[i]._currentStats["energy"];
          additionalDamageResult = this.calcDamage(targets[i], additionalDamageAmount, "active2", "energy");
          result += targets[i].takeDamage(this, "Energy Oscillation", additionalDamageResult);
        }
      
        if (targets[i]._currentStats["totalHP"] > 0 && Math.random() < 0.7) {
          result += targets[i].getDebuff(this, "Devouring Mark", 99, {attackAmount: this._currentStats["totalAttack"]});
        }
      }
      
      if (!("CarrieDodge" in damageResult)) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
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
  
  
  handleTrigger(trigger) {
    var result = "";
    
    if (trigger[1] == "eventTookDamage") {
      var burnDamageResult = {};
      var bleedDamageResult = {};
      var targets = getRandomTargets(this, this._enemies);
      var maxTargets = 3;
      
      if (targets.length < maxTargets) { maxTargets = targets.length; }
      
      for (var i = 0; i < maxTargets; i++) {
        burnDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 0.5, "passive", "burn", 1, 1, 3);
        bleedDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 0.5, "passive", "bleed", 1, 1, 3);
        
        result += targets[i].getDebuff(this, "Burn", 3, {burn: Math.round(burnDamageResult["damageAmount"])}, false, "passive");
        result += targets[i].getDebuff(this, "Bleed", 3, {bleed: Math.round(bleedDamageResult["damageAmount"])}, false, "passive");
      }
      
    } else if (trigger[1] == "eventTookDamageFromBurning") {
        result += "<div>" + this.heroDesc() + " <span class='skill'>Soul Shackle</span> triggered.</div>";
        result += this.getBuff(this, "Attack Percent", 3, {attackPercent: 0.10});
        
    } else if (trigger[1] == "eventTookDamageFromBleeding") {
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
    
    if (damageResult["damageSource"].substring(0, 6) == "active" || damageResult["damageSource"].substring(0, 5) == "basic") {
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
  
  
  handleTrigger(trigger) {
    var result = "";
    
    if (trigger[1] == "eventSelfBasic" && trigger[2].length > 0) {
      if (trigger[2][0][1]._currentStats["totalHP"] > 0) {
        return this.eventSelfBasic(trigger[2][0][1]);
      }
    } else if (trigger[1] == "eventTookDamage") {
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
    result += target.getDebuff(this, "petrify", 1, {});
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
    
    for (var i=0; i < targets.length; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 0.98);
      result += targets[i].takeDamage(this, "Chaotic Shade", damageResult);
      
      if (!("CarrieDodge" in damageResult) && targets[0]._currentStats["totalHP"] > 0) {
        if (Math.random() < 0.3 * (1 + this._currentStats["controlPrecision"])) {
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
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 2.5, "basic", "normal");
      result += targets[i].takeDamage(this, "Basic Attack", damageResult);
      
      if (!("CarrieDodge" in damageResult) && targets[i]._currentStats["totalHP"] > 0) {
        additionalDamage = this._currentStats["totalAttack"] * 2.5 * (1 + Object.keys(targets[i]._debuffs).length);
        additionalDamageResult = this.calcDamage(targets[i], additionalDamage, "basic2", "normal");
        result += targets[i].takeDamage(this, "Durative Weakness", additionalDamageResult);
      }
      
      if (!("CarrieDodge" in damageResult)) {
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
    var targets = getRandomTargets(this, this._enemies);
    var maxTargets = 4;
    
    if (targets.length < maxTargets) { maxTargets = targets.length; }
    
    for (var i=0; i<maxTargets; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 4);
      result += targets[i].takeDamage(this, "Ray of Delacium", damageResult);
      
      if (!("CarrieDodge" in damageResult) && targets[i]._currentStats["totalHP"] > 0) {
        additionalDamage = 4 * (1 + Object.keys(targets[i]._debuffs).length);
        additionalDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active2", "normal", additionalDamage);
        result += targets[i].takeDamage(this, "Ray of Delacium 2", additionalDamageResult);
        
        if (targets[i]._currentStats["totalHP"] > 0 && Math.random() < 0.7) {
          for (var b in targets[i]._debuffs) {
            for (var s in targets[i]._debuffs[b]) {
              if (isDot(b, targets[i]._debuffs[b][s]["effects"]) || isAttribute(b, targets[i]._debuffs[b][s]["effects"]) || isControlEffect(b, targets[i]._debuffs[b][s]["effects"])) {
                targets[i]._debuffs[b][s]["duration"] += 2;
                result += "<div><span class='skill'>Ray of Delacium</span> extended duration of Debuff <span class='skill'>" + b + "</span>.</div>";
              }
            }
          }
        }
      }
      
      if (!("CarrieDodge" in damageResult)) {
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
    var result = "";
    
    if (trigger[1] == "eventSelfBasic") {
      return this.eventSelfBasic();
    } else if (["eventEnemyActive", "eventEnemyBasic"].includes(trigger[1])) {
      return this.eventEnemyBasic(trigger[2], trigger[3]);
    }
    
    return result;
  }
  
  
  eventSelfBasic() {
    var result = "";
    var targets = getRandomTargets(this, this._enemies);
    
    if (targets.length > 0) {
      if (!("Shrink" in targets[0]._debuffs)) {
        result += targets[0].getDebuff(this, "Shrink", 2, {allDamageTaken: -0.30, allDamageDealt: 0.50});
      }
    }
    
    return result;
  }
  
  
  eventEnemyBasic(source, e) {
    var result = "";
    
    for (var i in e) {
      if ("Fairy's Guard" in e[i][1]._buffs) {
        var damageResult = e[i][1].calcDamage(e[i][1], e[i][1]._currentStats["totalAttack"] * 3, "passive", "normal", 1, 1, 0, 1, 0);
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
  
  
  handleTrigger(trigger) {
    var result = "";
    
    if (trigger[1] == "eventHPlte50" && this._currentStats["courageousTriggered"] == 0) {
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
  
  
  takeDamage(source, strAttackDesc, damageResult) {
    var result = "";
    
    result += super.takeDamage(source, strAttackDesc, damageResult);
    
    if (this._currentStats["totalHP"] > 0  && this._currentStats["totalHP"] / this._stats["totalHP"] <= 0.50 && this._currentStats["courageousTriggered"] == 0) {
      triggerQueue.push([this, "eventHPlte50"]);
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getRandomTargets(this, this._enemies);
    var maxTargets = 3;
    
    if (targets.length < maxTargets) { maxTargets = targets.length; }
    
    for (var i = 0; i < maxTargets; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 0.8, "basic", "normal");
      result += targets[i].takeDamage(this, "Element Fission", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
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
    
    for (var i=0; i < targets.length; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.16);
      result += targets[i].takeDamage(this, "Nether Nightmare", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        result += targets[i].getDebuff(this, "Precision", 3, {precision: 0.40});
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
    targets = getAllTargets(this, this._allies);
    for (var i=0; i < targets.length; i++) {
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
    var result = "";
    
    if (["eventAllyBasic", "eventAllyActive"].includes(trigger[1]) && !(this.isUnderStandardControl())) {
        return this.eventAllyBasic(trigger[3]);
    } else if (["eventSelfBasic", "eventSelfActive"].includes(trigger[1])) {
        return this.eventAllyBasic(trigger[2]);
    } else if (["eventAllyDied", "eventEnemyDied"].includes(trigger[1])) {
      return this.eventAllyDied();
    }
    
    return result;
  }
  
  
  eventAllyBasic(e) {
    var result = "";
    var damageResult = {};
    
    result += "<div>" + this.heroDesc() + " <span class='skill'>Instinct of Hunt</span> passive triggered.</div>";
    
    for (var i=0; i<e.length; i++) {
      if (e[i][1]._currentStats["totalHP"] > 0) {
        damageResult = this.calcDamage(e[i][1], this._currentStats["totalAttack"] * 2.5, "passive", "normal");
        result += e[i][1].takeDamage(this, "Instinct of Hunt", damageResult);
      }
    }
    
    result += this.getBuff(this, "Feather Blade", 99, {damageReduce: 0.04});
    result += this.getBuff(this, "Crit", 2, {crit: 0.05});
    
    return result;
  }
  
  
  eventAllyDied() {
    var result = "";
    
    result += "<div>" + this.heroDesc() + " <span class='skill'>Unbeatable Force</span> passive triggered.</div>";
    
    var healAmount = this.calcHeal(this, this._stats["totalHP"] * 0.3);
    result += this.getHeal(this, healAmount);
    result += this.getBuff(this, "Feather Blade", 99, {damageReduce: 0.04});
    result += this.getBuff(this, "Feather Blade", 99, {damageReduce: 0.04});
    
    return result;
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
        targets = getRandomTargets(this, this._enemies);
        
        if (targets.length > 0) {
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
  
  
  handleTrigger(trigger) {
    var result = "";
    
    if (trigger[1] == "eventEnemyDied") {
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
    var targets = getLowestHPTargets(this, this._enemies);
    
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 2, "basic", "normal", 1, 1, 0, 1, 0);
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
    var additionalDamageResult = {damageAmount: 0, critted: false};
    var hpDamage = 0;
    var hpDamageResult = {damageAmount: 0};
    var targets = getLowestHPTargets(this, this._enemies);
    var maxTargets = 2;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      if (targets[i]._currentStats["totalHP"] >= this._currentStats["totalHP"]) {
        result += targets[i].getDebuff(this, "stun", 2);
      }
      
      hpDamage = 0.20 * (targets[i]._stats["totalHP"] - targets[i]._currentStats["totalHP"]);
      if (hpDamage > this._currentStats["totalAttack"] * 15) { hpDamage = this._currentStats["totalAttack"] * 15; }
      hpDamageResult = this.calcDamage(targets[i], hpDamage, "active2", "hpPercent");
      result += targets[i].takeDamage(this, "Blade Assault HP", hpDamageResult);
        
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[i]._currentStats["totalHP"] > 0) {
          damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 3);
          result += targets[i].takeDamage(this, "Blade Assault", damageResult);
        }
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          additionalDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active2", "normal", 1.08, 1, 0, 1, 0);
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
    var result = "";
    
    if (["eventEnemyBasic", "eventEnemyActive"].includes(trigger[1])) {
      return this.eventEnemyBasic(trigger[3]);
    } else if (trigger[1] == "eventTookDamage") {
      return this.eventTookDamage(trigger[2], trigger[3]);
    }
    
    return result;
  }
  
  
  startOfBattle() {
    var targets = getRandomTargets(this, this._enemies);
    var result = targets[0].getDebuff(this, "Link of Souls", 99, {});
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
      targets = getLowestHPTargets(this, this._allies);
      if (targets.length > 0) {
        var healAmount = this.calcHeal(this, 0.25 * targets[0]._stats["totalHP"]);
        result += targets[0].getHeal(this, healAmount);
      }
    }
    
    
    if (Math.random() < 0.5 && this._currentStats["totalHP"] > 0) {
      targets = getRandomTargets(this, this._enemies);
      var maxTargets = 2;
      if (targets.length < maxTargets) { maxTargets = targets.length; }
      
      for (var i = 0; i < maxTargets; i++) {
        result += "<div>" + this.heroDesc() + " <span class='skill'>Cloak of Fog</span> drained " + targets[i].heroDesc() + " energy.</div>";
        result += targets[i].loseEnergy(this, 30);
      }
    }
    
    
    var linked = false;
    targets = getRandomTargets(this, this._enemies);
    
    if (targets.length > 0) {
      for (var i = 0; i < targets.length; i++) {
        if ("Link of Souls" in targets[i]._debuffs) { linked = true; }
      }
      
      if (!(linked)) {
        result += targets[0].getDebuff(this, "Link of Souls", 99, {});
      }
    }
    
    this._currentStats["linkCount"] = 0;
    
    return result;
  }
  
  
  eventEnemyBasic(e) {
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
    var targets = getRandomTargets(this, this._enemies);
    var maxTargets = 2;
    var buffRemoved;
    
    if (targets.length < maxTargets) {
      maxTargets = targets.length;
    }
    
    for (var i=0; i<maxTargets; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2);
      result += targets[i].takeDamage(this, "Demon Totem", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[i]._currentStats["totalHP"] > 0 && Math.random() < 0.60) {
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
  
  
  handleTrigger(trigger) {
    var result = "";
    
    if (["eventEnemyActive", "eventAllyActive", "eventSelfActive"].includes(trigger[1])) {
      return this.eventEnemyActive();
    } else if (trigger[1] == "eventTookDamage") {
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
  
  
  eventEnemyActive() {
    var result = "";
    result += this.getBuff(this, "Attack Percent", 99, {attackPercent: 0.05});
    result += this.getBuff(this, "Crit Damage", 99, {critDamage:0.02});
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
    var targets = getRandomTargets(this, this._enemies);
    var numTargets = 3;
    
    if (targets.length < numTargets) {
      numTargets = targets.length;
    }
    
    for (var i=0; i<numTargets; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.06);
      result += targets[i].takeDamage(this, "Torment of Flesh and Soul", damageResult);
      
      
      if (targets[i]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult)) {
        bleedDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active2", "bleed", 1, 3);
        bleedDamageResult["damageAmount"] = Math.round(bleedDamageResult["damageAmount"]);
        result += targets[i].getDebuff(this, "Bleed", 3, {bleed: bleedDamageResult["damageAmount"]}, false, "active");
      }
      
      
      if (targets[i]._currentStats["totalHP"] > 0 && !("CarrieDodge" in damageResult)) {
        if (isFrontLine(targets[i], this._enemies)) {
          hpDamage = targets[i]._stats["totalHP"] * 0.15;
          var maxDamage = this._currentStats["totalAttack"] * 15;
          if (hpDamage > maxDamage) { hpDamage = maxDamage; }
          
          hpDamageResult = this.calcDamage(targets[i], hpDamage, "active2", "hpPercent");
          result += targets[i].takeDamage(this, "Torment of Flesh and Soul Front Line", hpDamageResult);
        }
        
        if (isBackLine(targets[i], this._enemies)){
          additionalDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active2", "normal", 1.08, 2);
          result += targets[i].takeDamage(this, "Torment of Flesh and Soul Back Line", additionalDamageResult);
        }
        
      }
      
      if (!("CarrieDodge" in damageResult)) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"] + hpDamageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"] || additionalDamageResult["critted"]]);
      }
    }
    
    return result;
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getFrontTargets(this, this._enemies);
    
    for (var i=0; i<targets.length; i++) {
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
  
  
  handleTrigger(trigger) {
    var result = "";
    
    if (["eventSelfBasic", "eventSelfActive"].includes(trigger[1])) {
      return this.eventSelfActive(trigger[2]);
    } else if (trigger[1] == "eventEnemyDied" && trigger[2].heroDesc() == this.heroDesc()) {
      return this.eventEnemyDied();
    }
    
    return result;
  }
  
  
  eventEnemyDied(e) {
    var result = "";
    var targets = getRandomTargets(this, this._enemies);
    
    if (targets.length > 0) {
      result += targets[0].getDebuff(this, "Ghost Possessed", 3);
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
        result += e[i][1].getDebuff(this, "Poison", 2, {poison: Math.round(damageResult["damageAmount"])}, "passive");
        
        if (e[i][1]._currentStats["totalHP"] > 0 && e[i][3] == true) {
          damageResult = this.calcDamage(e[i][1], e[i][2] * 0.25, "passive", "bleed");
          result += e[i][1].getDebuff(this, "Bleed", 2, {bleed: Math.round(damageResult["damageAmount"])}, "passive");
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
    
    for (var i=0; i < this._enemies.length; i++) {
      if ("Ghost Possessed" in this._enemies[i]._debuffs) {
        damageResult = this.calcDamage(this._enemies[i], this._currentStats["totalAttack"] * 1.8, "basic", "normal");
        result += this._enemies[i].takeDamage(this, "GP - Basic Attack", damageResult);
        
        if (!("CarrieDodge" in damageResult)) {
          basicQueue.push([this, this._enemies[i], damageResult["damageAmount"], damageResult["critted"]]);
          healAmount = this.calcHeal(this, damageResult["damageAmount"]);
          result += this.getHeal(this, healAmount);
        }
      }
    }
    
    
    targets = getLowestHPTargets(this, this._enemies);
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"] * 1.8, "basic", "normal");
      result += targets[0].takeDamage(this, "Basic Attack", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[0]._currentStats["totalHP"] > 0 && !("Ghost Possessed" in targets[0]._debuffs)) {
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
    var targets = getAllTargets(this, this._enemies);
    var healAmount = 0;
    var hpDamage = 0;
    var hpDamageResult = {damageAmount: 0};
    
    for (var i=0; i < this._enemies.length; i++) {
      if ("Ghost Possessed" in this._enemies[i]._debuffs) {
        damageResult = this.calcDamage(this._enemies[i], this._currentStats["totalAttack"], "active", "normal", 4.4);
        result += this._enemies[i].takeDamage(this, "GP - Ghost Possession", damageResult);
        
        if (!("CarrieDodge" in damageResult)) {
          if (this._enemies[i]._currentStats["totalHP"] > 0) {
            hpDamage = this._enemies[i]._stats["totalHP"] * 0.10;
            if (hpDamage > this._currentStats["totalAttack"] * 15) { hpDamage = this._currentStats["totalAttack"] * 15; }
            hpDamageResult = this.calcDamage(this._enemies[i], hpDamage, "active2", "hpPercent");
            result += this._enemies[i].takeDamage(this, "GP - Ghost Possession HP", hpDamageResult);
          }
          
          healAmount = this.calcHeal(this, damageResult["damageAmount"] + hpDamageResult["damageAmount"]);
          result += this.getHeal(this, healAmount);
        
          activeQueue.push([this, this._enemies[i], damageResult["damageAmount"] + hpDamageResult["damageAmount"], damageResult["critted"]]);
        }
      }
    }
    
    
    targets = getLowestHPTargets(this, this._enemies);
    if (targets.length > 0) {
      damageResult = this.calcDamage(targets[0], this._currentStats["totalAttack"], "active", "normal", 4.4);
      result += targets[0].takeDamage(this, "Ghost Possession", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[0]._currentStats["totalHP"] > 0) {
          hpDamage = targets[0]._stats["totalHP"] * 0.10;
          if (hpDamage > this._currentStats["totalAttack"] * 15) { hpDamage = this._currentStats["totalAttack"] * 15; }
          hpDamageResult = this.calcDamage(targets[0], hpDamage, "active2", "hpPercent");
          result += targets[0].takeDamage(this, "Ghost Possession HP", hpDamageResult);
          
          if (targets[0]._currentStats["totalHP"] > 0 && !("Ghost Possessed" in targets[0]._debuffs)) {
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
  
  
  handleTrigger(trigger) {
    var result = "";
    
    if (trigger[1] == "eventHPlte50" && this._currentStats["flameInvasionTriggered"] == 0) {
      this._currentStats["flameInvasionTriggered"] = 1;
      result += "<div>" + this.heroDesc() + " <span class='skill'>Flame Invasion</span> triggered.</div>";
      
      var targets = getAllTargets(this, this._enemies);
      for (var h in targets) {
        if (Math.random() < 0.75 * (1 + this._currentStats["controlPrecision"])) {
          result += targets[h].getDebuff(this, "stun", 2, {});
        }
      }
    }
    
    return result;
  }
  
  
  takeDamage(source, strAttackDesc, damageResult) {
    var result = "";
    
    result += super.takeDamage(source, strAttackDesc, damageResult);
    
    if (this._currentStats["totalHP"] > 0  && this._currentStats["totalHP"] / this._stats["totalHP"] <= 0.50 && this._currentStats["flameInvasionTriggered"] == 0) {
      triggerQueue.push([this, "eventHPlte50"]);
    }
    
    return result
  }
  
  
  doBasic() {
    var result = "";
    var damageResult = {};
    var targets = getBackTargets(this, this._enemies);
    
    for (var i = 0; i < targets.length; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 0.90, "basic", "normal");
      result += targets[i].takeDamage(this, "Vicious Fire Perfusion", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        result += targets[i].getDebuff(this, "Armor Percent", 3, {armorPercent: 0.15});
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
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 1.5);
      result += targets[i].takeDamage(this, "Weak Curse", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (!("Weak Curse" in targets[i]._debuffs)) {
          result += targets[i].getDebuff(this, "All Damage Taken", 3, {allDamageTaken: -0.50});
        }
        
        activeQueue.push([this, targets[i], damageResult["damageAmount"], damageResult["critted"]]);
      }
    }
    
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
        if (targets[i]._currentStats["totalHP"] > 0 && Math.random() < 0.4 * (1 + this._currentStats["controlPrecision"])) {
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
  
  
  takeDamage(source, strAttackDesc, damageResult) {
    var result = "";
    var reflectDamageResult = {};
    var tempDamageAmount = damageResult["damageAmount"];
    
    
    if (["active", "active2", "basic", "basic2"].includes(damageResult["damageSource"]) && "Reflection Armor" in this._buffs && !("Guardian Shadow" in this._buffs)) {
      damageResult["damageAmount"] = damageResult["damageAmount"] / 2;
      
      result += super.takeDamage(source, strAttackDesc, damageResult);
      
      result += "<div><span class='skill'>Reflection Armor</span> consumed.</div>";
      tempDamageAmount = Math.floor(tempDamageAmount / 2)
      
      reflectDamageResult = source.calcDamage(this, tempDamageAmount, "passive", "true");
      result += source.takeDamage(this, "Reflection Armor", reflectDamageResult);
      this._currentStats["damageHealed"] += tempDamageAmount;
      
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
  
  
  takeDamage(source, strAttackDesc, damageResult) {
    var result = "";
    
    result += super.takeDamage(source, strAttackDesc, damageResult);
    
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
        if (targets[0]._currentStats["totalHP"] > 0 && !("Shapeshift" in targets[0]._debuffs) && Math.random() < 0.5 * (1 + this._currentStats["controlPrecision"])) {
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
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 3);
      result += targets[i].takeDamage(this, "Master Showman", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        if (targets[i]._currentStats["totalHP"] > 0 && !("Shapeshift" in targets[i]._debuffs) && Math.random() < ccChance * (1 + this._currentStats["controlPrecision"])) {
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
          damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 4, "passive", "normal", 1, 1, 0, 1, 0);
          result += targets[i].takeDamage(this, "Fluctuation of Light", damageResult);
          
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
  
  
  calcDamage(target, attackDamage, damageSource, damageType, skillDamage=1, canCrit=1, dotRounds=0, canBlock=1, armorReduces=1) {
    var result = "";
    
    if ("Rampage" in this._buffs) {
      result = super.calcDamage(target, attackDamage, damageSource, damageType, skillDamage, canCrit, dotRounds, 0, armorReduces);
    } else {
      result = super.calcDamage(target, attackDamage, damageSource, damageType, skillDamage, canCrit, dotRounds, canBlock, armorReduces);
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
        
        if (Math.random() < 0.3 * (1 + this._currentStats["controlPrecision"])) {
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
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 4.2);
      result += targets[i].takeDamage(this, "Iron Whirlwind", damageResult);
      
      if (!("CarrieDodge" in damageResult)) {
        activeQueue.push([this, targets[i], damageResult["damageAmount"] * 2, damageResult["critted"]]);
        
        if (targets[i]._currentStats["totalHP"] > 0) {
          result += targets[i].takeDamage(this, "Iron Whirlwind", damageResult);
        }
        
        if (targets[i]._currentStats["totalHP"] > 0 && Math.random() < 0.5 * (1 + this._currentStats["controlPrecision"])) {
          result += targets[i].getDebuff(this, "Taunt", 2, {});
        }
      }
    }
    
    result += this.getBuff(this, "Iron Whirlwind", 2, {allDamageReduce: 0.2});
    
    return result;
  }
}