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
  w.postMessage({oldValue: document.getElementById("result").value});
}

function stopWorker() {
  w.terminate();
  w = undefined;
}

function processWorker(e){
  document.getElementById("result").value = event.data["oldValue"];
}