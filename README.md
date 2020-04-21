# vincitego.github.io
Idle Heroes Battle Simulator version pre pre pre alpha


Description:
  Simulator for PVP battles in Idle Heroes. 

  
To Do List:
  Functionality:
    - add guild tech
    - avatar frames
    - equipment
    - artifacts
    - skins
    - stones
    - fully implement enables
    - implement monsters

  Questions about mechanics:
    - Exact method of applying attack and hp percent modifiers: 
      They seem to be applied by first adding all static modifers together
      Then applying percentage modifiers one source at a time in a specific order with a math.floor in between.
      Currently off by +/- 3 as displayed on Info screen
      Could be the result of incorrect ordering of application or base stats +/- 2
    - Monster energy, how is it gained, does excess go into ability damage like hero energy does?

  Improve GUI