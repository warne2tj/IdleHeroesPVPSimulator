# vincitego.github.io
Idle Heroes Battle Simulator version pre pre pre alpha


Description:
  Simulator for PVP battles in Idle Heroes. 

  
To Do List:
  Functionality:
    - add guild tech
    - equipment
    - stones
    - skins
    - artifacts
    - improve gui
    - implement baade
    - release to guild
    
    - fully implement enables
    - put in structure for buffs and debuffs
    - release to reddit
    
    - implement some monsters
        + phoenix
        + deer
    - subclass a couple of top tier heroes
    - implement rest of monsters
    - subclass more top tier heroes
    - improve gui
    

Combat Mechanics:
  - Exact order of applying attack and hp percent modifiers: 
    They seem to be applied by first adding all static modifers together
    Then applying percentage modifiers one source at a time in a specific order with a math.floor in between.
  - How much does armor stat reduce damage?
      = armor / (180 + 20*level)
  - How much damage does a block reduce?
      = 30% normal, 44% crit, chance of crit and chance of block seem to use the same roll
  - How does global cc immunity interact with cc specific immunity?
      = multiplicative
  - How does global damage reduce interact with class specific damage reduce?
      = multiplicative
  - Precision effects
      = each percent reduces enemy block and adds 0.3% damage 
        does not affect %hp damage
        max bonus damage capped at 45%
  - Holy Damage
      = 1% holy damage add 0.7% damage, ignoring armor
  - Energy
      = attack: 50, get hit: 10, get crit: 20
  - Skill Damage
      = additive to damage in skill description, not multiplicative
        each energy over 100 adds 1% skill damage
        does not affect hp-based or dot damage
  - Monster energy, how is it gained, does excess go into ability damage like hero energy does?
  
  
Questions about hero mechanics:
  - TBD as heroes are implemented
  
  
Far far far future functionality*:
  * i.e. may never get around to doing this
  - Utilize natural selection algorithm:
      + auto generate configurations
      + pit them against each other
      + most successful configurations "mate" and produce offspring for next generation
      + repeat