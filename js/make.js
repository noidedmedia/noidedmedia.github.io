function startRoll(ary, idx) {
  var quote = ary[idx % ary.length];
  var elem = document.getElementById("rolling-content");
  elem.style.opacity = 0;
  elem.style.transform = "translateY(200%) rotateX(90deg)";
  window.setTimeout(function() {
    elem.style.opacity = 1;
    elem.innerHTML = quote;
    elem.style.transform = "translateY(0%)";
    // wait 1.5 seconds
    window.setTimeout(function(){
      elem.style.transform = "translateY(-200%) rotateX(-90deg)";
      window.setTimeout(startRoll.bind(null, ary, idx + 1), 500);
    }, 5000)
  }, 500);
}

var h = new XMLHttpRequest();
h.open("GET", "/make.json");
h.onreadystatechange = function() {
  if(h.readyState == XMLHttpRequest.DONE) {
    if(h.status == 200) {
      startRoll(JSON.parse(h.responseText), 0);
    }
    else {
      console.error("Not allowed");
    }
  }
}
h.send();
