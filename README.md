# vincitego.github.io
Idle Heroes Battle Simulator version pre pre pre alpha


Description:
  Simulator for PVP battles in Idle Heroes. 

  
To Do List
  * implement baade
  * ---------
  * apply class specific damage reduction from guild tech
  * fully implement enables
  * adjust for hp% damage, dot damage, dot damage reduction in calcDamage
  * ------------
  * figure out if golden crown all damage reduce is different from regular damage reduce
  * implement some monsters
    + phoenix
    + deer
  * subclass a couple of heroes
  * implement rest of monsters
  * subclass more heroes
  * improve gui
  
  
Hero mechanics:
  * TBD as heroes are implemented
    

Mechanics:
  * Order of applying attack and hp percent modifiers
    + they seem to be applied by first adding all constant modifers together
    + then applying percentage modifiers one source at a time in a specific order 
    + with a math.floor in between
  * HP % damage
    + ignores armor
    + affected by block?
    + ignores damage reduce
    + affected by holy damage?
    + ignores skill damage
    + ignores precision
    + ignores crit
  * Armor
    + damage mitigation = armor / (180 + 20*level)
  * Block
    + 30% reduced normal damage, 44% reduced crit damage
    + chance of crit and chance of block seem to use the same roll
  * Precision
    + each percent reduces enemy block and adds 0.3% damage 
    + max bonus damage capped at 45%
  * Holy Damage
    + 1% holy damage add 0.7% damage
    + ignores armor
  * Crit Damage
    + 50% extra damage based
    + Add 2% damage per 1% of crit damage stat
  * Energy
    + attack: 50, get hit: 10, get crit: 20
  * Skill Damage
    + additive to damage in skill description, not multiplicative
    + each energy over 100 adds 1% skill damage
    + does not affect hp% based or dot damage
  * How does global cc immunity interact with cc specific immunity?
    + multiplicative?
  * How does global damage reduce interact with class specific damage reduce?
    + multiplicative?
  * Monster energy, how is it gained, does excess go into ability damage like hero energy does?
  
  
Far far far future functionality*:
  * i.e. may never get around to doing this
  * Utilize natural selection algorithm:
    + auto generate configurations
    + pit them against each other
    + most successful configurations "mate" and produce offspring for next generation
    + mutation rate: 10%?
    + repeat