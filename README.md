# vincitego.github.io
Idle Heroes Battle Simulator

To Do List

Functionality:
  - add combat simulation
  - implement aura
  - implement avatar frames
  - fully implement enables
  - implement monsters

Combat mechanics:
  - Exact method of applying attack and hp percent modifiers: 
    They seem to be applied by first adding all static modifers together
    Then applying percentage modifiers one source at a time in a specific order with a math.floor in between.
    Currently off by +/- 5 as displayed on Info screen
    Could be the result of incorrect ordering or base stats +/- 2
  - How much does armor stat reduce damage?
      = def / (180 + 20*level)
  - Can a crit be blocked?
      = Yes, see below
  - How much damage does a block reduce?
      = 30% normal, 44% crit, chance of crit and chance of block seem to use the same roll
  - How does global cc immunity interact with cc specific immunity?
      = multiplicative?
  - How does global damage reduce interact with class specific damage reduce?
      = multiplicative?
  - Precision effects
      = each percent reduces enemy block and adds 0.3% damage (does not affect %hp damage)
        max bonus damage capped at 45%
  - Holy Damage
      = 1% holy damage = 0.7% damage ignoring armor
  - Energy
      = attack: 50, get hit: 10, get crit: 20
  - Monster energy, how is it gained, does excess go into ability damage like hero energy does?

Add data
  - hero base stats
  - subclass heroes
  - stones
  - equipment
  - artifacts
  - guild tech
  - avatar frames
  - skins
  - monsters

Improve GUI