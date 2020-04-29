/* 
Important Notes
  * Don't forget to account for Tara's Seal of Light.
  * When getting targets, check that the target is alive. In case all targets are dead. i.e. only sleepless left to resurrect at end of round.
  * After doing damage, check that damage amount is greater than 0. If it's 0, then the target was Carrie and she dodged.
  * When overriding events, you probably need to check that the target or source of the event is the same as the hero being called, depending on the details of the skill
  * Also, check that the hero answering the event is alive. Notable exception: Carrie
  * Rng for a hero's attack is initially generated at the beginning of their turn. Need to regenerate if they do further attacks. But maybe not depending on if subsequent attacks use the same roll.
  
  

Important Function prototypes

  calcDamage(target, attackDamage, damageSource, damageType, skillDamage=1, canCrit=1, canBlock=1, armorReduces=1)
      return {"damageAmount", "critted", "blocked", "damageSource", "damageType", "e5Description"} 
      damageSource = passive, active, monster, active2(does not apply skill damage but applies other skill related effects)
      damageType = normal, burn, bleed, poison, mark


  takeDamage(source, strAttackDesc, damageResult{})

  getHeal(source, amount)

  getEnergy(source, amount)

  getBuff(source, buffName, duration, effects{})
  
  removeBuff(strBuffName)

  getDebuff(source, debuffName, duration, effects{})
  
  removeDebuff(strDebuffName)

  basicQueue[], activeQueue[] = push([source, target, damageAmount, critted]) to call the event

  deathQueue[] = push([source, target]) to call the event
  
  eventAllyBasic(e), eventAllyActive(e), eventAllyDied(e), eventEnemyDied(e) = called by all heroes so they can react to an event

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
    var target = getFirstTarget(this, this._enemies);
    
    if (target._heroName != "None") {
      damageResult = this.calcDamage(target, this._currentStats["totalAttack"], "active", "normal", 1.8);
      result = target.takeDamage(this, "Thump", damageResult);
      activeQueue.push([this, target, damageResult["damageAmount"], damageResult["critted"]]);
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
    var target = getLowestHPTarget(this, this._enemies);
    var additionalDamage = 0;
    
    if (target._heroName != "None") {
      damageResult = this.calcDamage(target, this._currentStats["totalAttack"] * 1.1, "basic", "normal", 1, 0);
      additionalDamage = damageResult["damageAmount"];
      result = target.takeDamage(this, "Basic Attack", damageResult);
      
      if (target._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0) {
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
    }
    
    return result;
  }
  
  doActive() {
    var result = "";
    var damageResult = {};
    var additionalDamageResult = {damageAmount: 0};
    var target = getLowestHPTarget(this, this._enemies);
    var healAmount = 0;
    var additionalDamage = 0;
    
    if (target._heroName != "None") {
      damageResult = this.calcDamage(target, this._currentStats["totalAttack"], "active", "normal", 1.5, 0);
      additionalDamage = damageResult["damageAmount"];
      result = target.takeDamage(this, "Nether Strike", damageResult);
      
      if (target._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0) {
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
            damageSource: "active2", 
            damageType: "normal", 
            e5Desc: ""
          };
          
          result += target.takeDamage(this, "Nether Strike 2", additionalDamageResult);
        }
      }
      
      healAmount = Math.round((damageResult["damageAmount"] + additionalDamage) * 0.2);
      if (healAmount > 0) {
        result += this.getHeal(this, healAmount);
        result += this.getBuff(this, "Nether Strike", 6, {attackPercent: 0.4});
      }
      
      activeQueue.push([this, target, damageResult["damageAmount"] + additionalDamage, damageResult["critted"]]);
    }
    
    return result;
  }
  
  eventEnemyDied(e) { 
    var result = ""
    
    if (this._currentStats["totalHP"] > 0) {
      if ("Seal of Light" in this._debuffs) {
        result += "<div><span class='skill'>Seal of Light</span> prevented " + this.heroDesc() + " from triggering <span class='skill'>Blood Armor</span>.</div>";
      } else {
        result = "<div>" + this.heroDesc() + " <span class='skill'>Blood Armor</span> passive triggered.</div>";
        result += this.getBuff(this, "Blood Armor", 1, {damageReduce: 0.1});
      }
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
      var target = targets[0];
      
      damageResult = this.calcDamage(target, this._currentStats["totalAttack"] * 1.56, "basic", "normal");
      result = target.takeDamage(this, "Basic Attack", damageResult);
      
      // attack % per energy damage seems to be true damage
      if (target._currentStats["totalHP"] > 0 && damageResult["damageAmount"] > 0) {
        additionalDamageResult = {
          "damageAmount": this._currentStats["totalAttack"] * 0.06 * (target._currentStats["energy"] + 50),
          "critted": false,
          "blocked": false,
          "damageSource": "other",
          "damageType": "normal",
          "e5Description": ""
        };
        result += target.takeDamage(this, "Outburst of Magic", additionalDamageResult);
        
        if (target._currentStats["totalHP"] > 0) {
          result += target.getEnergy(this, 50);
          target._currentStats["energy"] = 0;
          result += "<div>" + target.heroDesc() + " energy set to " + formatNum(0) + ".</div>";
        }
      }
      
      basicQueue.push([this, target, damageResult["damageAmount"] + additionalDamageResult["damageAmount"], damageResult["critted"]]);
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
    } else if (this._currentStats["totalHP"] == 0) {
      this._currentStats["spiritPowerStacks"] += 1;
    }
    
    return result; 
  }
  
  
  eventEnemyDied(e) { 
    if (this._currentStats["totalHP"] == 0) {
      this._currentStats["spiritPowerStacks"] += 1;
    }
    
    return ""; 
  }
  
  
  startOfRound() {
    var result = "";
    
    if (this._currentStats["totalHP"] == 0) {
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
    
    if (this._currentStats["totalHP"] == 0) {
      var damageResult = {};
      var target = getLowestHPTarget(this, this._enemies);
      var damageAmount = 0.5 * (target._stats["totalHP"] - target._currentStats["totalHP"]);
      var maxDamage = 15 * this._currentStats["totalAttack"];
      
      if (target._heroName != "None") {
        if (damageAmount > maxDamage) {
          damageAmount = maxDamage;
        }
        
        damageResult = {
          "damageAmount": damageAmount,
          "critted": false,
          "blocked": false,
          "damageSource": "passive",
          "damageType": "normal",
          "e5Description": ""
        };
        result += target.takeDamage(this, "Shadowy Spirit", damageResult);
        
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
  
  
  eventAllyBasic(e) {
    var result = "";
    
    if (this._currentStats["totalHP"] > 0) {
      if (this.heroDesc() == e[0].heroDesc()) {
        if ("Seal of Light" in this._debuffs) {
          result += "<div><span class='skill'>Seal of Light</span> prevented " + this.heroDesc() + " from triggering <span class='skill'>Fluctuation of Light</span>.</div>";
        } else {
          var damageResult = {};
          
          for (var i=0; i<this._enemies.length; i++) {
            if (this._enemies[i]._currentStats["totalHP"] > 0) {
              this._rng = Math.random();
              damageResult = this.calcDamage(this._enemies[i], this._currentStats["totalAttack"] * 4, "passive", "normal", 1, 1, 1, 0);
              result += this._enemies[i].takeDamage(this, "Fluctuation of Light", damageResult);
              
              if (Math.random() < 0.3) {
                result += this._enemies[i].getDebuff(this, "Power of Light", 99, {});
              }
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
      var target = targets[0];
      
      damageResult = this.calcDamage(target, this._currentStats["totalAttack"] * 3, "basic", "normal");
      result = target.takeDamage(this, "Basic Attack", damageResult);
      basicQueue.push([this, target, damageResult["damageAmount"], damageResult["critted"]]);
      
      if (damageResult["damageAmount"] > 0) {
        result += target.getDebuff(this, "Power of Light", 99, {});
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
      var target = targets[0];
      
      damageResult = this.calcDamage(target, this._currentStats["totalAttack"], "active", "normal", 3);
      result = target.takeDamage(this, "Seal of Light", damageResult);
      
      if (damageResult["damageAmount"] > 0) {
        var numAdditionalAttacks = Math.floor(Math.random() * 3) + 1;
        
        for (var i=0; i<numAdditionalAttacks; i++) {
          result += target.takeDamage(this, "Seal of Light", damageResult);
        }
        
        result += target.getDebuff(this, "Power of Light", 99, {});
      }
      
      targets = getAllTargets(this, this._enemies);
      for (var h in targets) {
        if ("Power of Light" in targets[h]._debuffs && Math.random() < 0.6) {
          result += targets[h].getDebuff(this, "Power of Light", 99, {});
        }
      }
      
      basicQueue.push([this, target, damageResult["damageAmount"] * (numAdditionalAttacks + 1), damageResult["critted"]]);
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