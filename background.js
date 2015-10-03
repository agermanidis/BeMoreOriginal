chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        $.getJSON('http://agermanidis.com:5141/is_original?q='+request.query, function(response) {
            sendResponse({original: response});
        });
        return true;
  }
);
