var attHeroes = [
  new hero("None", 0, "att"), 
  new hero("None", 1, "att"), 
  new hero("None", 2, "att"), 
  new hero("None", 3, "att"), 
  new hero("None", 4, "att"), 
  new hero("None", 5, "att")
];

var defHeroes = [
  new hero("None", 0, "def"), 
  new hero("None", 1, "def"), 
  new hero("None", 2, "def"), 
  new hero("None", 3, "def"), 
  new hero("None", 4, "def"), 
  new hero("None", 5, "def")
];
  
  
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
  
  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function() {
    if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
      document.getElementById("topButton").style.display = "block";
    } else {
      document.getElementById("topButton").style.display = "none";
    }
  };

  
  // populate options
  addOptions(baseHeroStats, "Name");
  addOptions(weapons, "Weapon");
  addOptions(accessories, "Accessory");
  addOptions(armors, "Armor");
  addOptions(shoes, "Shoe");
  addOptions(stones, "Stone");
  addOptions(artifacts, "Artifact");
  
  var option;
  for(var x in avatarFrames) {
    option = document.createElement("option");
    option.text = x;
    document.getElementById("attAvatarFrame").add(option);
    
    option = document.createElement("option");
    option.text = x;
    document.getElementById("defAvatarFrame").add(option);
  }
  
  
  // load default configuration
  loadConfig();
}


// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


function addOptions(dictItems, strPostfix) {
  var option;
  
  for(var x in dictItems) {
    for(i=0; i<attHeroes.length; i++) {
      option = document.createElement("option");
      option.text = x;
      document.getElementById("attHero" + i + strPostfix).add(option);
    }
    
    for(i=0; i<defHeroes.length; i++) {
      option = document.createElement("option");
      option.text = x;
      document.getElementById("defHero" + i + strPostfix).add(option);
    }
  }
}


function changeHero(heroPos, prefix, skipUpdates = false) {
  var arrToUse = [];
  if (prefix == "att") {
    arrToUse = attHeroes;
  } else {
    arrToUse = defHeroes;
  }
  
  var pHeroName = arrToUse[heroPos]._heroName;
  var cHeroName = document.getElementById(prefix + "Hero" + heroPos + "Name").value;
  var cHeroSheet = document.getElementById(prefix + "Hero" + heroPos + "Sheet");
  var cHeroSkins = document.getElementById(prefix + "Hero" + heroPos + "Skin");
  
  if (cHeroName == pHeroName) {
    // no change, do nothing
  } else {
    console.log("Change Hero " + heroPos + ": " + pHeroName + " to " + cHeroName);
  
    cHeroSkins.value = "None";
    var skinLen = cHeroSkins.options.length - 1;
    for (var i = skinLen; i > 0; i--){
      cHeroSkins.remove(i);
    }
      
    if(cHeroName == "None") {
      arrToUse[heroPos] = new hero("None", heroPos, prefix);
      cHeroSheet.innerHTML = "";
    } else {
      arrToUse[heroPos] = new baseHeroStats[cHeroName]["className"](cHeroName, heroPos, prefix);
      
      if ([cHeroName] in skins) {
        var option;
        for(var x in skins[cHeroName]) {
          option = document.createElement("option");
          option.text = x;
          cHeroSkins.add(option);
        }
      }
    }
    
    if (skipUpdates == false) {
      if (prefix == "att") {
        updateAttackers();
      } else {
        updateDefenders();
      }
    }
  }
}


function updateHero(heroPos, prefix) {
  var cHeroName = document.getElementById(prefix + "Hero" + heroPos + "Name").value;
  var cHeroSheet = document.getElementById(prefix + "Hero" + heroPos + "Sheet");
  var arrToUse = [];
  
  if (cHeroName != "None") {
    console.log("updateHero " + heroPos + ": " + cHeroName);
    
    if (prefix == "att") {
      arrToUse = attHeroes;
    } else {
      arrToUse = defHeroes;
    }
  
    arrToUse[heroPos]._weapon = document.getElementById(prefix + "Hero" + heroPos + "Weapon").value;
    arrToUse[heroPos]._accessory = document.getElementById(prefix + "Hero" + heroPos + "Accessory").value;
    arrToUse[heroPos]._armor = document.getElementById(prefix + "Hero" + heroPos + "Armor").value;
    arrToUse[heroPos]._shoe = document.getElementById(prefix + "Hero" + heroPos + "Shoe").value;
    arrToUse[heroPos]._stone = document.getElementById(prefix + "Hero" + heroPos + "Stone").value;
    arrToUse[heroPos]._artifact = document.getElementById(prefix + "Hero" + heroPos + "Artifact").value;
    arrToUse[heroPos]._skin = document.getElementById(prefix + "Hero" + heroPos + "Skin").value;
    
    arrToUse[heroPos]._enable1 = document.getElementById(prefix + "Hero" + heroPos + "Enable1").value;
    arrToUse[heroPos]._enable2 = document.getElementById(prefix + "Hero" + heroPos + "Enable2").value;
    arrToUse[heroPos]._enable3 = document.getElementById(prefix + "Hero" + heroPos + "Enable3").value;
    arrToUse[heroPos]._enable4 = document.getElementById(prefix + "Hero" + heroPos + "Enable4").value;
    arrToUse[heroPos]._enable5 = document.getElementById(prefix + "Hero" + heroPos + "Enable5").value;
    
    arrToUse[heroPos].updateCurrentStats();
    cHeroSheet.innerHTML = arrToUse[heroPos].getHeroSheet();
  }
}


function updateAttackers() {
  for (var i = 0; i < attHeroes.length; i++) {
    updateHero(i, "att");
  }
}


function updateDefenders() {
  for (var i = 0; i < defHeroes.length; i++) {
    updateHero(i, "def");
  }
}


function createConfig() {
  var oConfig = document.getElementById("configText");
  oConfig.value = "{\n";
  
  var arrInputs = document.getElementsByTagName("INPUT");
  for (var e = 0; e < arrInputs.length; e++) {
    elem = arrInputs[e];
    
    if ("id" in elem) {
      if (elem.id.substring(0, 3) == "att" || elem.id.substring(0, 3) == "def") {
        oConfig.value += "\t\"" + elem.id + "\": \"" + elem.value + "\",\n";
      }
    }
  }
  
  var arrInputs = document.getElementsByTagName("SELECT");
  for (var e = 0; e < arrInputs.length; e++) {
    elem = arrInputs[e];
    
    if ("id" in elem) {
      if (elem.id.substring(0, 3) == "att" || elem.id.substring(0, 3) == "def") {
        if (e == arrInputs.length - 1) {
          oConfig.value += "\t\"" + elem.id + "\": \"" + elem.value + "\"\n";
        } else {
          oConfig.value += "\t\"" + elem.id + "\": \"" + elem.value + "\",\n";
        }
      }
    }
  }
  
  oConfig.value += "}\n";
}


function loadConfig() {
  var oConfig = document.getElementById("configText");
  var jsonConfig = JSON.parse(oConfig.value);
  
  for (var x in jsonConfig) {
    document.getElementById(x).value = jsonConfig[x];
    
    if (x.substring(x.length - 4, x.length) == "Name") {
      changeHero(x.substring(7, 8), x.substring(0, 3), true);
    }
  }
  
  updateAttackers();
  updateDefenders();
}