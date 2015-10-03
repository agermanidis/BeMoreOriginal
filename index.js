var WAIT_DURATION = 200;
var UPDATE_RATE = 100;

var cache = {};
var countdown = 0;
var shouldUpdate = false;
var lastText = "";

var LOADER_GIF_URL = chrome.extension.getURL("images/loader.gif");
var SUCCESS_ICON_URL = chrome.extension.getURL("images/success.png");
var FAIL_ICON_URL = chrome.extension.getURL("images/fail.png");

var INDICATOR_HTML = "<div class='bmo-indicator-container'><span class='bmo-indicator'></span></div>";

$(".toolbar").prepend(INDICATOR_HTML);

function countdownLoop() {
    if (countdown <= 0 && shouldUpdate) {
        makeOriginalityRequest();
    }
    countdown = Math.max(0, countdown - UPDATE_RATE);
    setTimeout(countdownLoop, UPDATE_RATE);
}

countdownLoop();

function makeOriginalityRequest() {
    shouldUpdate = false;

    var text = currentFocus.find(".tweet-box").text();
    
    if (text.length === 0) {
        clearIndicator();
        return;
    }

    if (cache[text] !== undefined) {
        updateOriginality(cache[text]);
        return;
    }

    chrome.runtime.sendMessage({query: text}, function(request) {
        var original = request.original;
        cache[text] = original;

        if ($(".tweet-box").text().length === 0) {
            clearIndicator();
            return;
        }

        if (shouldUpdate) {
            return; 
        }

        updateOriginality(original);
    });
}

function clearIndicator() {
    currentFocus.find(".bmo-indicator").html("");
    currentFocus.find(".js-tweet-btn").attr("disabled", "disabled");
}

function updateOriginality(original) {
    if (lastText.length === 0) { return; }

    var twitterSearchUrl = 'https://twitter.com/search?q="' + encodeURIComponent(lastText) + '"';
    
    if (original) {
        currentFocus.find(".bmo-indicator").html("Original Tweet").css({'color': 'green'}).append("<img class='bmo-success-or-fail' src='"+SUCCESS_ICON_URL+"'></img>");
        currentFocus.find(".js-tweet-btn").removeAttr("disabled");
        
    } else {
        currentFocus.find(".bmo-indicator").html("<a style='color: red;' target='_blank' href='"+twitterSearchUrl+"'>Unoriginal Tweet</a>").append("<img class='bmo-success-or-fail' src='"+FAIL_ICON_URL+"'></img>");
        currentFocus.find(".js-tweet-btn").attr("disabled", "disabled");
    }
}

var currentFocus = $(".tweet-box");

function ensureIndicatorExists() {
    var $el = currentFocus.find(".bmo-indicator");
    if ($el.length === 0) {
        currentFocus.find(".toolbar").prepend(INDICATOR_HTML);
    }
}

$(document.body).on("focusin", ".tweet-box", function(evt) {
    currentFocus = $(evt.target).closest(".tweet-form");
    ensureIndicatorExists();
});

$(document.body).on("keyup", ".tweet-box", function() {
    var text = currentFocus.find(".tweet-box").text();
    if (text === lastText) { return; }
    lastText = text;
    currentFocus.find(".bmo-indicator").html("").append("<img class='bmo-loader' src='"+LOADER_GIF_URL+"'></img>");
    shouldUpdate = true;
    countdown = WAIT_DURATION;
});
