# vincitego.github.io
Idle Heroes Battle Simulator version Alpha


Description:
  Simulator for PVP battles in Idle Heroes. 
  
  
Implemented Heroes:
  * Foolish
  * Baade 5 star
  * Carrie E5
  * Tara E5 (up next)
  
  
Implemented Monsters:
  * Deer
  * Phoenix

  
To Do List
  * ----------- Priority 1 ------------
  * figure out if golden crown all damage reduce is different from regular damage reduce
  * subclass top tier heroes
  * ----------- Priority 2 ------------
  * allow for 10*-E5 of different levels
  * implement rest of monsters
  * add swap, copy, move functionality for team management
  * ----------- Priority 3 ------------
  * improve look of hero stat sheet
  * refactor damage description to read better, output directly to combat log(?)
  * improve gui (incorporate icons?)
  
  
Hero Mechanics:
  * TBD as heroes are implemented
  * Baade 5* vs. Foolish
    + Attack amount always the same
    + Is the second part of the last passive another source of damage?
    + So additional damage does not trigger if hero dies from first part?
  * Carrie
    + Dodge, is it all or nothing? Do basics or actives that do multiple attacks dodge all or is each attack evaulated separately? Ex: Garuda.
    

Mechanics:
  * Order of applying attack and hp percent modifiers
    + they seem to be applied by first adding all constant modifers together
    + then applying percentage modifiers one source at a time in a specific order 
    + with a math.floor in between
    + current best guess on order: enable level bonus, enable selected skills, equipment, set bonus, skin, guild tech, passive, artifact, stone
  * Leveling
    + base stats are different at 5*, 6*, and 10*
    + increases by usually 10% of base stats per level, some stats for some heroes grow at a different amount
    + except speed, speed increases a flat 2 per level
    + each tier adds an additive percentage bonus to stats
    + 20% for hp and attack, 10% for speed
    + enabling adds a multiplier for attack (10%) and hp (14%) per enable level
    + this multiplier affects other sources of attack and hp
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
  * Damage calculation
    + unlike stat calculations, damage appears to be rounded instead of floored.
    + abilities that do further calculations on this number use the true unrounded number. See baade.
    + another possibility is that baades damage is calculated as a single block but his extra damage only triggers if the "normal" damage wouldn't kill the target
  * How does global cc immunity interact with cc specific immunity?
    + multiplicative?
  * How does global damage reduce interact with class specific damage reduce?
    + multiplicative?
  * Heal effect and effect being healed
    + is hp% healing affected by these stats?
  * Monster 
    + energy +20 at end of round, +10 on ally active
    + active does true damage
    + excess energy does not increase damage of active
    + static attack and hp buff, how does it work?
    + monsters act at end of turn before buffs and debuffs tick
    + which means their buffs/debuffs last one round less than stated, dots still do full damage
    + first tick of dot happens right away, then debuffs tick, that's 2 rounds worth of dots that occur at the end of the turn
  * Buffs/debuffs
    + currently applying percent buff debuffs using rounding to match the calculate damage, but should they be fully recalculated using floor in between each application?
    + do buffs tick first, then debuffs?
    + can you die in the middle of a buff/debuff resolution if there's a heal buff on the "stack"?
  * Enable3 skills
    + do they trigger before or after buffs/debuffs tick?
    + does purify remove an entire stack of debuffs?
  * Enable5 skills
    + does balanced strike count as a separate source of attack?
    + unbending will: is this a buff that can be cleansed? ie by Gustin
  
  
Far far far future functionality*:
  * i.e. may never get around to doing this
  * Utilize natural selection algorithm:
    + auto generate configurations
    + pit them against each other
    + most successful configurations "mate" and produce offspring for next generation
    + mutation rate: 10%?
    + repeat