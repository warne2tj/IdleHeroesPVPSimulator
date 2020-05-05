class monster {
  constructor(sMonsterName, attOrDef) {
    this._monsterName = sMonsterName;
    this._attOrDef = attOrDef;
    this._heroClass = "monster";
    
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
  
  
  calcDamage(target, attackDamage, damageSource, damageType) {
    return {
      "damageAmount": attackDamage,
      "holyDamage": 0, 
      "critted": false, 
      "blocked": false, 
      "damageSource": "monster", 
      "damageType": damageType, 
      "e5Description": ""
    };
  }
  
  
  doActive() {
    var result = "";
    
    result = "<div><span class='" + this._attOrDef + "'>" + this._monsterName + "</span> used <span class='skill'>Active Template</span>.</div>";
    
    this._energy = 0;
    return result;
  }
}


class mDeer extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = getRandomTargets(this, this._enemies);
    var numTargets = 4;
    
    if (targets.length < numTargets) {numTargets = targets.length;}
    
    for (var i=0; i < numTargets; i++) {
      damageResult = this.calcDamage(targets[i], 402068, "monster", "true");
      result += targets[i].takeDamage(this, "Emerald Nourishing", damageResult);
    }
    
    var healAmount = 0;
    var targets = getRandomTargets(this, this._allies);
    
    if (targets.length < numTargets) {numTargets = targets.length;}
    
    for (var i=0; i < numTargets; i++) {
      result += targets[i].getBuff(this, "Deer Buff", 2, {armorPercent: 0.37, attackPercent: 0.15});
      
      healAmount = Math.floor(targets[i]._stats["totalHP"] * 0.2);
      result += targets[i].getHeal(this, healAmount);
    }
    
    this._energy = 0;
    
    return result;
  }
}


class mPhoenix extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = getRandomTargets(this, this._enemies);
    var numTargets = 4;
    
    if (targets.length < numTargets) {numTargets = targets.length;}
    
    for (var i=0; i < numTargets; i++) {
      damageResult = this.calcDamage(targets[i], 451830, "monster", "true");
      result += targets[i].takeDamage(this, "Blazing Spirit", damageResult);
      result += targets[i].getDebuff(this, "Phoenix Burn", 3, {burn: 363465});
    }
    
    var healAmount = 0;
    targets = getRandomTargets(this, this._allies);
    
    if (targets.length < numTargets) {numTargets = targets.length;}
    
    for (var i=0; i < numTargets; i++) {
      result += targets[i].getBuff(this, "Phoenix Buff", 3, {heal: 500353, damageAgainstBurning: 0.8});
    }
    
    this._energy = 0;
    
    return result;
  }
}