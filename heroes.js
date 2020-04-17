// base hero class, extend this class for each hero
class hero {
  constructor(sHeroName) {
    // base stats before anything is applied, even passives
    this._baseStats = Object.assign({}, baseHeroStats[sHeroName]);
    
    delete this._baseStats["className"];
    this._baseStats["heroName"] = sHeroName;
    this._baseStats["skillDamage"] = 0.0;
    this._baseStats["precision"] = 0.0;
    this._baseStats["block"] = 0.0;
    this._baseStats["crit"] = 0.0;
    this._baseStats["critDamage"] = 0.0;
    this._baseStats["armorBreak"] = 0.0;
    this._baseStats["controlImmune"] = 0.0;
    this._baseStats["damageReduce"] = 0.0;
    this._baseStats["holyDamage"] = 0.0;
    this._baseStats["holyDamage"] = 0.0;
    this._baseStats["freezeImmune"] = 0.0;
    this._baseStats["petrifyImmune"] = 0.0;
    this._baseStats["stunImmune"] = 0.0;
    this._baseStats["twineImmune"] = 0.0;
    this._baseStats["energy"] = 50;
    this._baseStats["dotReduce"] = 0.0;
    this._baseStats["controlPrecision"] = 0.0;
    
    // set current stats to copy of base stats
    this._currentStats = Object.assign({}, this._baseStats);
    
    // set enables to selected enable function
    this._enable1 = null;
    this._enable2 = null;
    this._enable3 = null;
    this._enable4 = null;
    this._enable5 = null;
    
    // set equipment
    this._stone = null;
    this._artifact = null;
    this._weapon = null;
    this._armor = null;
    this._shoe = null;
    this._accessory = null;
    this._skin = null;
    
    // call any passives that adjust base stats
    // this.passive2();
    
    this._buffDebuffs = {};
    
  }
  
  
  active() {
    // override to hero's active
    return;
  }
  
  
  passive1() {
    // override this function to apply effects of the hero's first passive
    return;
  }
  
  
  passive2() {
    // override this function to apply effects of the hero's second passive
    return;
  }
  
  
  passive3() {
    // override this function to apply effects of the hero's third passive
    return;
  }
  
  
  enableA() {
    // should not need to override this as enables are the same for all heroes
    return;
  }
  
  
  getHeroSheet() {
    var heroSheet = "";
    
    heroSheet += "Level " + this._baseStats["heroLevel"] + " " + this._baseStats["heroName"] + "<br/>";
    heroSheet += this._baseStats["starLevel"] + "* " + this._baseStats["heroFaction"] + " " + this._baseStats["heroClass"] + "<br/>";
    
    for (var statName in this._currentStats) {
      heroSheet += "<br/>" + statName + ": " + this._currentStats[statName];
    }
    
    return heroSheet;
  }
}


// 1* Foolish
class Foolish extends hero {
  constructor() {
    super("Foolish");
  }
}