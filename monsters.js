class monster {
  constructor(sMonsterName, attOrDef) {
    this._monsterName = sMonsterName;
    this._attOrDef = attOrDef;
    
    if (attOrDef == "att") {
      this._allies = attHeroes;
      this._enemies = defHeroes;
    } else {
      this._allies = defHeroes;
      this._enemies = attHeroes;
    }
    
    this._currentStats = {
      "damageDealt": 0,
      "damageHealed": 0,
      "healEffect": 0.0
    };
    
    this._energy = 0;
  }
  
  heroDesc() {
    return "<span class='" + this._attOrDef + "'>" + this._monsterName + " (" + this._energy + " energy)</span>";
  }
  
  
  formatDamageResult(target, damageResult, strAttackDesc) {
    var result = "";
    var strTakeDamage = ""
    
    strAttackDesc = "<span class='skill'>" + strAttackDesc + "</span>";
    result = "<div>" + this.heroDesc() + " used " + strAttackDesc + " against " + target.heroDesc() + ".</div>";
    damageResult["damageAmount"] = Math.round(damageResult["damageAmount"]);
    strTakeDamage = target.takeDamage(this, damageResult);
    
    if (damageResult["damageAmount"] > 0) {
      result += strAttackDesc + " dealt " + formatNum(damageResult["damageAmount"]) + " damage.</div>";
    }
    
    result += strTakeDamage;
    
    return result;
  }
  
  
  doActive() {
    var result = "";
    
    result = "<div><span class='" + this._attOrDef + "'>" + this._monsterName + "</span> used <span class='skill'>Active</span>.</div>";
    
    this._energy = 0;
    return result;
  }
}


class mDeer extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = getRandomTargets(this._enemies);
    var numTargets = 4;
    
    if (targets.length < numTargets) {numTargets = targets.length;}
    
    for (var i=0; i < numTargets; i++) {
      damageResult = {
        damageAmount: 402068, 
        critted: 0, 
        blocked: 0, 
        damageSource: "monster", 
        damageType: "normal", 
        e5Desc: ""
      };
      result += this.formatDamageResult(targets[i], damageResult, "Emerald Nourishing");
    }
    
    var healAmount = 0;
    var targets = getRandomTargets(this._allies);
    
    if (targets.length < numTargets) {numTargets = targets.length;}
    
    for (var i=0; i < numTargets; i++) {
      result += targets[i].getBuff("Emerald Nourishing", 2, {armorPercent: 0.37, attackPercent: 0.15});
      
      healAmount = Math.floor(targets[i]._stats["totalHP"] * 0.2);
      result += targets[i].getHeal(this, healAmount);
    }
    
    this._energy = 0;
    
    return result;
  }
}


class mPhoenix extends monster {
  doActive() {
    return super.doActive();
  }
}