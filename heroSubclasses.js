/* Function prototypes

calcDamage(target, attackDamage, damageSource, damageType, skillDamage=1, canCrit=1, canBlock=1, armorReduces=1)
    return {"damageAmount", "critted", "blocked", "damageSource", "damageType", "e5Description"} 
    damageSource = passive, active, monster, active2(does not apply skill damage)
    damageType = normal, burn, bleed, poison, mark


takeDamage(source, strAttackDesc, damageResult{})

getHeal(source, amount)

getEnergy(source, amount)

getBuff(source, buffName, duration, effects{})

getDebuff(source, debuffName, duration, effects{})

deathQueue[] = push([source, target])

basicQueue[], activeQueue[] = push([source, target, damageAmount, critted])

eventEnemyBasic(e), eventEnemyActive(e) = if overridden, call the super() version so the enemy still gains energy on an attack
    
*/


// 1* Foolish
class Foolish extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  doActive() {
    var result = "";
    var damageResult = {};
    var target = getFirstTarget(this._enemies);
    
    damageResult = this.calcDamage(target, this._currentStats["totalAttack"], "active", "normal", 1.8);
    result = target.takeDamage(this, "Thump", damageResult);
    activeQueue.push([this, target, damageResult["damageAmount"], damageResult["critted"]]);
    
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
    var target = getLowestHPTarget(this._enemies);
    var additionalDamage = 0;
    
    damageResult = this.calcDamage(target, this._currentStats["totalAttack"] * 1.1, "basic", "normal", 1, 0);
    additionalDamage = damageResult["damageAmount"];
    result = target.takeDamage(this, "Basic Attack", damageResult);
    
    if (target._currentStats["totalHP"] > 0) {
      var outcomeRoll = Math.random();
      
      if (outcomeRoll < 0.75) {
        if (outcomeRoll < 0.5) {
          additionalDamage = additionalDamage * 0.5;
        } else if (outcomeRoll < 0.75) {
          additionalDamage = additionalDamage * 1.25;
        }
        
        additionalDamage = Math.round(additionalDamage);
        damageResult["damageAmount"] += additionalDamage;
        additionalDamageResult = {
          damageAmount: additionalDamage, 
          critted: 0, 
          blocked: 0, 
          damageSource: "basic", 
          damageType: "normal", 
          e5Desc: ""
        };
        
        result += target.takeDamage(this, "Death Threat", additionalDamageResult);
      }
    }
    
    basicQueue.push([this, target, damageResult["damageAmount"] + additionalDamage, damageResult["critted"]]);
    
    return result;
  }
  
  doActive() {
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {damageAmount: 0};
    var target = getLowestHPTarget(this._enemies);
    var healAmount = 0;
    var additionalDamage = 0;
    
    damageResult = this.calcDamage(target, this._currentStats["totalAttack"], "active", "normal", 1.5, 0);
    additionalDamage = damageResult["damageAmount"];
    result = target.takeDamage(this, "Nether Strike", damageResult);
    
    if (target._currentStats["totalHP"] > 0) {
      var outcomeRoll = Math.random();
      
      if (outcomeRoll < 0.84) {
        if (outcomeRoll < 0.48) {
          additionalDamage = additionalDamage;
        } else if (outcomeRoll < 0.84) {
          additionalDamage = additionalDamage * 3;
        }
        
        additionalDamage = Math.round(additionalDamage);
        damageResult["damageAmount"] += additionalDamage;
        additionalDamageResult = {
          damageAmount: additionalDamage, 
          critted: 0, 
          blocked: 0, 
          damageSource: "active", 
          damageType: "normal", 
          e5Desc: ""
        };
        
        result += target.takeDamage(this, "Nether Strike 2", additionalDamageResult);
      }
    }
    
    healAmount = Math.round((damageResult["damageAmount"] + additionalDamage) * 0.2);
    result += this.getHeal(this, healAmount);
    result += this.getBuff(this, "Nether Strike", 6, {attackPercent: 0.4});
    
    activeQueue.push([this, target, damageResult["damageAmount"] + additionalDamage, damageResult["critted"]]);
    
    return result;
  }
  
  eventEnemyDied(e) { 
    var result = ""
    
    if (this._currentStats["totalHP"] > 0) {
      result = "<div>" + this.heroDesc() + " <span class='skill'>Blood Armor</span> passive triggered.</div>";
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
}



// E5 AmenRa
class AmenRa extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Aura of Despair passive
    this.applyStatChange({hpPercent: 0.2, attackPercent: 0.25, damageReduce: 0.25}, "PassiveStats");
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
}



// E5 Carrie
class Carrie extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  
  passiveStats() {
    // apply Darkness Befall passive
    this.applyStatChange({attackPercent: 0.25, controlImmune: 0.3, speed: 60}, "PassiveStats");
  }
  
  
  takeDamage(source, strAttackDesc, damageResult) {
    var result = "";
    var outcomeRoll = Math.random();
    
    result = "<div>" + source.heroDesc() + " used <span class='skill'>" + strAttackDesc + "</span> against " + this.heroDesc() + ".</div>";
    
    if (outcomeRoll < 0.4 && (damageResult["damageSource"].substring(0, 6) == "active" || damageResult["damageSource"].substring(0, 5) == "basic")) {
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
    var target = getRandomTargets(this._enemies)[0];
    
    damageResult = this.calcDamage(target, this._currentStats["totalAttack"] * 1.56, "basic", "normal");
    result = target.takeDamage(this, "Basic Attack", damageResult);
    
    if (target._currentStats["totalHP"] > 0) {
      additionalDamageResult = this.calcDamage(target, this._currentStats["totalAttack"] * 0.06 * (target._currentStats["energy"] + 50), "basic", "normal");
      result += target.takeDamage(this, "Outburst of Magic", additionalDamageResult);
      
      if (target._currentStats["totalHP"] > 0 && additionalDamageResult["damageAmount"] > 0) {
        result += target.getEnergy(this, 50);
        target._currentStats["energy"] = 0;
        result += "<div>" + target.heroDesc() + " energy set to " + formatNum(0) + ".</div>";
      }
    }
    
    basicQueue.push([this, target, damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {damageAmount: 0};
    var targets = getRandomTargets(this._enemies);
    var numTargets = 4;
    
    if (targets.length < numTargets) {
      numTargets = targets.length;
    }
    
    for (var i=0; i<numTargets; i++) {
      damageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"], "active", "normal", 2.2);
      result += targets[i].takeDamage(this, "Energy Devouring", damageResult);
      
      if (targets[i]._currentStats["totalHP"] > 0) {
        additionalDamageResult = this.calcDamage(targets[i], this._currentStats["totalAttack"] * 0.06 * targets[i]._currentStats["energy"], "active2", "normal");
        result += targets[i].takeDamage(this, "Energy Oscillation", additionalDamageResult);
      }
      
      if (targets[i]._currentStats["totalHP"] > 0 && Math.random() < 0.7) {
        result += targets[i].getDebuff(this, "Devouring Mark", 99, {});
      }
      
      activeQueue.push([this, targets[i], damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
    }
    
    return result;
  }
  
  
  devouringMark(target) {
    var result = "";
    var damageResult = {};
    
    damageResult = this.calcDamage(target, this._currentStats["totalAttack"] * 0.1 * target._currentStats["energy"], "mark", "normal");
    result = target.takeDamage(this, "Devouring Mark", damageResult);
    result += target.removeDebuff("Devouring Mark");
    result += "<div>Energy set to " + formatNum(0) + ".</div>";
    target._currentStats["energy"] = 0;
    
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