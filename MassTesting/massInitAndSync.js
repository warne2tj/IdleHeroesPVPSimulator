var attHeroes = [];
var defHeroes = [];
var allTeams = [];
var teamNames = [];
var simRunning = false;
  
  
function initialize() {
  // layout stuff
  var acc = document.getElementsByClassName("colorA");
  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      /* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
      this.classList.toggle("activeA");

      /* Toggle between hiding and showing the active panel */
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
  
  var acc = document.getElementsByClassName("colorB");
  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("activeB");

      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
  
  var acc = document.getElementsByClassName("colorC");
  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("activeC");

      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  }
}


function runMassLoop() {   
  var oLog = document.getElementById("summaryLog");
    
  if (simRunning == true) {
    oLog.innerHTML += "<p>Simulation already running.</p>";
  } else {
    var oConfig = document.getElementById("configText");
    var jsonConfig = JSON.parse(oConfig.value);
    var team;
    var tHero;
    
    allTeams = [];
    teamNames = [];
    
    for (var t in jsonConfig) {
      team = [];
      
      for (var p = 0; p < 60; p += 10) {
        tHero = new baseHeroStats[jsonConfig[t][p]]["className"](jsonConfig[t][p], 1 + (p % 10), "");
        
        tHero._skin = jsonConfig[t][p+1];
        tHero._stone = jsonConfig[t][p+3];
        tHero._artifact = jsonConfig[t][p+4];
        tHero._enable1 = jsonConfig[t][p+5];
        tHero._enable2 = jsonConfig[t][p+6];
        tHero._enable3 = jsonConfig[t][p+7];
        tHero._enable4 = jsonConfig[t][p+8];
        tHero._enable5 = jsonConfig[t][p+9];
        
        if (jsonConfig[t][p+2] == "Class Gear") { 
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = classGearMapping[tHero._heroClass]["armor"];
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = classGearMapping[tHero._heroClass]["accessory"];
          
        } else if (jsonConfig[t][p+2] == "Split HP") { 
          tHero._weapon = "6* Thorny Flame Whip";
          tHero._armor = classGearMapping[tHero._heroClass]["armor"];
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = "6* Flame Necklace";
          
        } else if (jsonConfig[t][p+2] == "Split Attack") { 
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = "6* Flame Armor";
          tHero._shoe = "6* Flame Boots";
          tHero._accessory = "6* Flame Necklace";
        }
        
        team.push(tHero);
      }
      
      allTeams.push(team);
      
      // [team name, monster, wins on attack, wins on defense]
      teamNames.push([t, jsonConfig[t][60], 0, 0]);
    }
    
    simRunning = true;
    oLog.innerHTML += "<p>Starting mass simulation.</p>";
    
    // start first matchup
    setTimeout(nextMatchup(0, 1), 1);
  }
}


function nextMatchup(attIndex, defIndex) {
  var oLog = document.getElementById("summaryLog");
  
  if (attIndex >= allTeams.length) {
    simRunning = false;
    oLog.innerHTML += "<p>Mass simulation finished.</p>";
  } else {
    if (attIndex != defIndex) {
      var numWins = 0;
      var numSims = document.getElementById("numSims").value;
      
      attHeroes = allTeams[attIndex];
      defHeroes = allTeams[defIndex];
      
      document.getElementById("attMonster").value = teamNames[attIndex][1];
      document.getElementById("defMonster").value = teamNames[defIndex][1];
      
      for (var p = 0; p < 6; p++) {
        attHeroes[p]._attOrDef = "att";
        attHeroes[p]._allies = attHeroes;
        attHeroes[p]._enemies = defHeroes;
        attHeroes[p].updateCurrentStats();
        
        defHeroes[p]._attOrDef = "def";
        defHeroes[p]._allies = defHeroes;
        defHeroes[p]._enemies = attHeroes;
        defHeroes[p].updateCurrentStats();
      }
      
      numWins = runSim();
      
      oLog.innerHTML += "<p><span class='att'>" + teamNames[attIndex][0] + "</span> versus <span class='def'>" + teamNames[defIndex][0] + "</span>: Won " + formatNum(numWins) + " out of " + formatNum(numSims) + ".</p>";
    }
    
    // start next matchup
    defIndex++;
    if (defIndex == allTeams.length) {
      attIndex++;
      defIndex = 0;
    }
    
    setTimeout(nextMatchup(attIndex, defIndex), 1);
  }
}