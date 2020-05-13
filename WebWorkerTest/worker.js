var i = 0;

self.onmessage = doCall;

function doCall(e) {
  oldMessage = e.data["oldValue"];
  setTimeout("doWork('" + e.data["oldValue"] + "')", 5000);
}

function doWork(oldMessage) {
  postMessage({"oldValue": oldMessage});
}