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
      "damageHealed": 0
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
    damageResult[0] = Math.round(damageResult[0]);
    strTakeDamage = target.takeDamage(this, damageResult);
    
    if (damageResult[0] > 0) {
      result += strAttackDesc + " dealt " + formatNum(damageResult[0]) + " damage.</div>";
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
  
  
  getRandomTargets(arrTargets) {
    var copyTargets = [];
    
    for (var i=0; i<arrTargets.length; i++) {
      if (arrTargets[i]._currentStats["totalHP"] > 0) {
        arrTargets[i]._rng = Math.random();
        copyTargets.push(arrTargets[i]);
      }
    }
    
    copyTargets.sort(function(a,b) {
      if (a._rng > b._rng) {
        return 1;
      } else if (a._rng < b._rng) {
        return -1;
      } else {
        return 0;
      }
    });
    
    return copyTargets;
  }
}


class mDeer extends monster {
  doActive() {
    var result = "";
    var damageResult = [];
    var targets = this.getRandomTargets(this._enemies);
    var numTargets = 4;
    
    if (targets.length < numTargets) {numTargets = targets.length;}
    
    for (var i=0; i < numTargets; i++) {
      damageResult = [402068, 0, 0, "monster", "normal", ""];
      result += this.formatDamageResult(targets[i], damageResult, "Emerald Nourishing");
    }
    
    var healAmount = 0;
    //buffs = {armorPercent: 0.37, attackPercent: 0.15} 2 rounds
    //heal 20% hp
    
    
    this._energy = 0;
    
    //result["description"] += this.getHeal(this, healAmount);
    
    //this.getBuff("Nether Strike", 6, {attackPercent: 0.4});
    //result["description"] += " Baade gains " + formatNum(40) + "% attack for " + formatNum(6) + " rounds.";
    
    return result;
  }
}


class mPhoenix extends monster {
  doActive() {
    return super.doActive();
  }
}