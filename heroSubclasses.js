// 1* Foolish
class Foolish extends hero {
  constructor(sHeroName, iHeroPos, attOrDef) {
    super(sHeroName, iHeroPos, attOrDef);
  }
  
  doActive() {
    var result = {};
    var damageResult = [];
    var target = this.getFirstTarget();
    
    result["description"] = "<div>" + this.heroDesc() + " used active (Thump) against " + target.heroDesc() + ".</div>";
    
    damageResult = this.calcDamage(target, this._currentStats["totalAttack"], true, 1.8);
    damageResult.push("active");
    damageResult.push("normal");
    result["takeDamageDescription"] = target.takeDamage(this, damageResult);
    
    if (damageResult[1] == true && damageResult[2] == true) {
      result["description"] += "Blocked crit active dealt " + formatNum(damageResult[0]) + " damage. ";
    } else if (damageResult[1] == true && damageResult[2] == false) {
      result["description"] += "Crit active dealt " + formatNum(damageResult[0]) + " damage. ";
    } else if (damageResult[1] == false && damageResult[2] == true) {
      result["description"] += "Blocked active dealt " + formatNum(damageResult[0]) + " damage. ";
    } else {
      result["description"] += "Active dealt " + formatNum(damageResult[0]) + " damage. ";
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
  
  doBasic() {
    var result = {};
    var damageResult = [];
    var target = this.getLowestHPTarget();
    var attackDamage = this._currentStats["totalAttack"];
    var outcomeRoll = Math.random();
    
    if (outcomeRoll < 0.25) {
      attackDamage *= 1.1;
    } else if (outcomeRoll < 0.75) {
      attackDamage *= 1.5;
    } else {
      attackDamage *= 2.25;
    }
    
    result["description"] = "<div>" + this.heroDesc() + " did basic attack against " + target.heroDesc() + ".</div>";
    
    damageResult = this.calcDamage(target, attackDamage, false, 1, 0);
    damageResult.push("basic");
    damageResult.push("normal");
    result["takeDamageDescription"] = target.takeDamage(this, damageResult);
    
    if (damageResult[1] == true && damageResult[2] == true) {
      result["description"] += "Blocked crit attack dealt " + formatNum(damageResult[0]) + " damage. ";
    } else if (damageResult[1] == true && damageResult[2] == false) {
      result["description"] += "Crit attack dealt " + formatNum(damageResult[0]) + " damage. ";
    } else if (damageResult[1] == false && damageResult[2] == true) {
      result["description"] += "Blocked basic attack dealt " + formatNum(damageResult[0]) + " damage. ";
    } else {
      result["description"] += "Basic attack dealt " + formatNum(damageResult[0]) + " damage. ";
    }
    
    this._currentStats["energy"] += 50;
    result["description"] += "Gained " + formatNum(50) + " energy. Energy at " + formatNum(this._currentStats["energy"]) + ".";
    result["eventDescription"] = this.alertDidBasic(target, damageResult);
    
    return result;
  }
  
  eventEnemyDied(source, target, damageResult) { 
    var result = ""
    
    if (this._currentStats["totalHP"] > 0) {
      result = "<div>" + this.heroDesc() + " Blood Armor passive triggered.</div>";
      result += "<div>" + this.getHeal(this, this._currentStats["totalAttack"]);
      result += " Gained " + formatNum(10) + "% damage reduce.</div>";
      
      this.getBuff("Blood Armor", 1, {damageReduce: 0.1});
    }
    
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
    this.applyStatChange({hpPercent: 0.4, holyDamage: 0.7, controlImmune: 0.3, damageReduce: 0.3}, "Passive1");
  }
}