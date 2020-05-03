var attHeroes = [];
var defHeroes = [];
var allTeams = [];
var teamNames = [];
var simRunning = false;
var attIndex = 0;
var defIndex = 1;
  
  
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
    attIndex = 0;
    defIndex = 1;
    
    for (var t in jsonConfig) {
      team = [];
      
      for (var p = 0; p < 66; p += 11) {
        tHero = new baseHeroStats[jsonConfig[t][p]]["className"](jsonConfig[t][p], 1 + (p % 11), "");
        
        tHero._heroLevel = jsonConfig[t][p+1];
        tHero._skin = jsonConfig[t][p+2];
        tHero._stone = jsonConfig[t][p+4];
        tHero._artifact = jsonConfig[t][p+5];
        tHero._enable1 = jsonConfig[t][p+6];
        tHero._enable2 = jsonConfig[t][p+7];
        tHero._enable3 = jsonConfig[t][p+8];
        tHero._enable4 = jsonConfig[t][p+9];
        tHero._enable5 = jsonConfig[t][p+10];
        
        if (jsonConfig[t][p+3] == "Class Gear") { 
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = classGearMapping[tHero._heroClass]["armor"];
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = classGearMapping[tHero._heroClass]["accessory"];
          
        } else if (jsonConfig[t][p+3] == "Split HP") { 
          tHero._weapon = "6* Thorny Flame Whip";
          tHero._armor = classGearMapping[tHero._heroClass]["armor"];
          tHero._shoe = classGearMapping[tHero._heroClass]["shoe"];
          tHero._accessory = "6* Flame Necklace";
          
        } else if (jsonConfig[t][p+3] == "Split Attack") { 
          tHero._weapon = classGearMapping[tHero._heroClass]["weapon"];
          tHero._armor = "6* Flame Armor";
          tHero._shoe = "6* Flame Boots";
          tHero._accessory = "6* Flame Necklace";
        }
        
        team.push(tHero);
      }
      
      allTeams.push(team);
      
      // [team name, monster, wins on attack, wins on defense]
      teamNames.push([t, jsonConfig[t][66], 0, 0]);
    }
    
    simRunning = true;
    oLog.innerHTML = "<p>Starting mass simulation.</p>";
    
    // start first matchup
    setTimeout(nextMatchup, 1);
  }
}


function nextMatchup() {
  var oLog = document.getElementById("summaryLog");
  var numSims = document.getElementById("numSims").value;
  
  if (attIndex >= allTeams.length) {
    var summary = "";
    var totalFights = (allTeams.length - 1) * numSims;
    
    teamNames.sort(function(a,b) {
      if (a[2] > b[2]) {
        return -1;
      } else if (a[2] < b[2]) {
        return 1;
      } else if (a[3] > b[3]) {
        return -1;
      } else if (a[3] < b[3]) {
        return 1;
      } else {
        return 0;
      }
    });
    
    for (var p = 0; p < teamNames.length; p++) {
      summary += "<div>Team " + teamNames[p][0] + " - Attack win rate(" + formatNum(Math.round(teamNames[p][2] / totalFights * 100, 2)) + "%), Defense win rate(" + formatNum(Math.round(teamNames[p][3] / totalFights * 100, 2)) + "%)</div>";
    }
    
    simRunning = false;
    oLog.innerHTML += "<p>Mass simulation finished.</p>" + summary;
    
  } else {
    if (attIndex != defIndex) {
      var numWins = 0;

      attHeroes = allTeams[attIndex];
      defHeroes = allTeams[defIndex];
      
      document.getElementById("attMonster").value = teamNames[attIndex][1];
      document.getElementById("defMonster").value = teamNames[defIndex][1];
      
      for (var p = 0; p < 6; p++) {
        attHeroes[p]._attOrDef = "att";
        attHeroes[p]._allies = attHeroes;
        attHeroes[p]._enemies = defHeroes;
 
        defHeroes[p]._attOrDef = "def";
        defHeroes[p]._allies = defHeroes;
        defHeroes[p]._enemies = attHeroes;
      }
      
      for (var p = 0; p < 6; p++) {
        attHeroes[p].updateCurrentStats();
        defHeroes[p].updateCurrentStats();
      }
      
      numWins = runSim();
      teamNames[attIndex][2] += numWins;
      teamNames[defIndex][3] += numSims - numWins;
      
      oLog.innerHTML += "<p><span class='att'>" + teamNames[attIndex][0] + "</span> versus <span class='def'>" + teamNames[defIndex][0] + "</span>: Won " + formatNum(numWins) + " out of " + formatNum(numSims) + ".</p>";
    }
    
    // start next matchup
    defIndex++;
    if (defIndex == allTeams.length) {
      attIndex++;
      defIndex = 0;
    }
    
    setTimeout(nextMatchup, 1);
  }
}