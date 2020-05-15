class testClass {
  constructor(str) {
    this._obj = {"key": str};
  }
}

var w;

function init() {
  if (typeof(Worker) !== "undefined") {
    if (typeof(w) == "undefined") {
      w = new Worker("./worker.js");
    }
    w.onmessage = processWorker;
  } else {
    document.getElementById("result").value = "Sorry! No Web Worker support.";
  }
}

function startWorker() {
  var o = new testClass(document.getElementById("result").value);
  w.postMessage(o);
  o._obj["key"] = "overwrite";
  document.getElementById("result").value = o._obj["key"] = "overwrite";
}

function stopWorker() {
  w.terminate();
  w = undefined;
}

function processWorker(e){
  document.getElementById("result").value = event.data["oldValue"];
}