# vincitego.github.io
Idle Heroes Battle Simulator version Alpha


Description:
  Simulator for PVP battles in Idle Heroes. 
  
  
Implemented Heroes:
  * Foolish
  * Baade 5 star
  * The rest are only there for stat verification and testing

  
To Do List
  * implement some monsters
    + phoenix
    + deer
  * ------------
  * figure out if golden crown all damage reduce is different from regular damage reduce
  * subclass some top tier heroes
  * implement rest of monsters
  * improve gui
  * refactor damage description to flow better for reading purposes
  
  
Hero Mechanics:
  * TBD as heroes are implemented
  * Baade 5* vs. Foolish
    + Attack amount always the same
    + Is the second part of the last passive another source of damage?
    + So additional damage does not trigger if hero dies from first part?
  * Carrie
    + Energy attack percent damage, what affects it?
    

Mechanics:
  * Order of applying attack and hp percent modifiers
    + they seem to be applied by first adding all constant modifers together
    + then applying percentage modifiers one source at a time in a specific order 
    + with a math.floor in between
    + current best guess: enable level bonus, enable selected skills, equipment, set bonus, skin, guild tech, passive, artifact, stone
  * Leveling
    + base stats are different at 5*, 6*, and 10*
    + increases base stats by usually 10% per level, some stats for some heroes grow at a different amount
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
    + unlike all the other calculations, damage appears to be rounded instead of floored.
    + abilities that do further calculations on this number use the true unrounded number. See baade.
  * How does global cc immunity interact with cc specific immunity?
    + multiplicative?
  * How does global damage reduce interact with class specific damage reduce?
    + multiplicative?
  * Heal effect and effect being healed
    + is hp% healing affected by these stats?
  * Monster energy, how is it gained, does excess go into ability damage like hero energy does?
  * Buffs/debuffs
    + currently applying percent buff debuffs using rounding to match the calculate damage, but should they be fully recalculated using floor in between each application?
    + do buffs tick first, then debuffs?
    + can you die in the middle of a buff/debuff resolution if there's a heal buff on the "stack"?
  * Enable3 skills
    + do they trigger before or after buffs/debuffs tick?
    + does purify remove an entire stack of debuffs?
  * Enable5 skills
    + does balanced strike count as a separate source of attack?
    + unbending will: does the triggering damage count as 1 of the 4 stacks?
  
  
Far far far future functionality*:
  * i.e. may never get around to doing this
  * Utilize natural selection algorithm:
    + auto generate configurations
    + pit them against each other
    + most successful configurations "mate" and produce offspring for next generation
    + mutation rate: 10%?
    + repeat