// 1* Foolish
class Foolish extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  doActive() {
    var result = {};
    var damageResult = [];
    var target = this.getFirstTarget();
    
    result["description"] = this._heroName + " did used active (Thump) against enemy " + target._heroName + " in position " + target._heroPos + ". ";
    
    damageResult = this.calcDamage(target, true, 1.8);
    damageResult.push("active");
    damageResult.push("normal");
    result["takeDamageDescription"] = target.takeDamage(this, damageResult);
    
    if (damageResult[1] == true && damageResult[2] == true) {
      result["description"] += "Blocked crit active dealt " + damageResult[0] + " damage. ";
    } else if (damageResult[1] == true && damageResult[2] == false) {
      result["description"] += "Crit active dealt " + damageResult[0] + " damage. ";
    } else if (damageResult[1] == false && damageResult[2] == true) {
      result["description"] += "Blocked active dealt " + damageResult[0] + " damage. ";
    } else {
      result["description"] += "Active dealt " + damageResult[0] + " damage. ";
    }
    
    result["eventDescription"] = this.alertDidActive(target, damageResult);
    
    this._currentStats["energy"] = 0;
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
    this.applyStatChange({attackPercent: 0.1, hpPercent: 0.2, armorBreak: 0.2}, "Passive1");
  }
}


// E5 Tara
class Tara extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  passiveStats() {
    // apply Immense Power passive
    this.applyStatChange({hpPercent: 0.4, holyDamage: 0.7, controlImmune: 0.3, damageReduce: 0.3}, "Passive1");
  }
}