var i = 0;
var oldMessage = "";

self.onmessage = doCall;

function doCall(e) {
  oldMessage = e.data["oldValue"];
  setTimeout("doWork('test')", 1000);
  setTimeout(doWork, 5000);
}

function doWork(oldMessage) {
  postMessage({"oldValue": oldMessage});
}