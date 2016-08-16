// Takes a object of quote -> length
var quote_timer = function(quotes) {
  var quoteArray = undefined;
  var container = document.getElementById("quote-inner");
  var TIME_BETWEEN_QUOTES = 3000;

  var getQuoteArray = function() {
    if(quoteArray) {
      return quoteArray;
    }
    var a = [];
    for(var q in quotes) {
      for(var i = 0; i < quotes[q]; i++) {
        a.push(q);
      }
    }
    quoteArray = a;
    return quoteArray;
  }

  var update = function() {
    var ar = getQuoteArray();
    var quote = ar[Math.floor(Math.random()*ar.length)];
    clearQuote(function() {
      window.setTimeout(function () {
        typeQuote(quote, function() {
          window.setTimeout(update, 3000);
        })
      }, 500);
    });
  };

  var performAnimation = function(frame, isFinished, frameTime, callback) {
    var timeDelta = 500;
    var lastTime = 0;
    var frameCount = 1;
    function doFrame(time) {
      if(timeDelta > frameTime(frameCount)) {
        frame();
        timeDelta = 0;
      }
      else {
        timeDelta += (time - lastTime);
      }
      frameCount++;
      lastTime = time;
      if(isFinished()) {
        callback();
      }
      else {
        window.requestAnimationFrame(doFrame);
      }
    }
    window.requestAnimationFrame(doFrame);
  }

  var clearQuote = function(callback) {
    function clearCharacter() {
      var html = container.innerHTML;
      var chompLength = html.length - 1;
      container.innerHTML = html.substring(0,chompLength);
    }

    function isDone() {
      return container.innerHTML.length == 0;
    }

    function frameTime(frameCount) {
      return frameCount > 0 ? 20/frameCount: 10;
    }

    performAnimation(clearCharacter,
      isDone,
      frameTime,
      callback);
  }

  var typeQuote = function(quote, callback) {
    var charIndex = 0;
    function typeCharacter() {
      var char = quote.charAt(charIndex);
      container.innerHTML = container.innerHTML + char;
      charIndex++;
    }

    function finishedTyping() {
      return charIndex >= quote.length;
    }

    function frameTime() {
      return 50;
    }

    performAnimation(typeCharacter, 
      finishedTyping,
      frameTime,
      callback);
  }

  // Load a quote immediately
  update();
}


document.addEventListener("DOMContentLoaded", function() {
  var x = new XMLHttpRequest();
  x.open("GET", "quotes.json", true);
  x.onreadystatechange=function() {
    if (x.readyState == 4 && x.status == 200) {
      // Parse the JSON into an object.
      var obj = JSON.parse(x.responseText);
      var quotes = obj["quotes"];
      quote_timer(quotes);
    }
  }
  x.send();
});
