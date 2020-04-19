function runSim() {
  var oCombatLog = document.getElementById("combatLog");
  var numSims = document.getElementById("numSims").value;
  
  oCombatLog.innerHTML = "<div>Hello World</div>";
  
  for (var x = 1; x <= numSims; x++) {
    oCombatLog.innerHTML += "<p>Simulation #" + x +"</p>";
  }
}