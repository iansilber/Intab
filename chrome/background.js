chrome.webRequest.onHeadersReceived.addListener(
    function(info) {
        var headers = info.responseHeaders;
        for (var i=headers.length-1; i>=0; --i) {
            var header = headers[i].name.toLowerCase();
            if (header == 'x-frame-options' || header == 'frame-options') {
                headers.splice(i, 1); // Remove header
            }
        }
        return {responseHeaders: headers};
    },
    {
        urls: [ '*://*/*' ], // Pattern to match all http(s) pages
        types: [ 'sub_frame' ]
    },
    ['blocking', 'responseHeaders']
);

var link = chrome.contextMenus.create({
    "title": "View with Intab", 
    "contexts": ["link", "selection"],
    "onclick": function(info) {

        if (info.linkUrl) {
            data = {method: 'link', href: info.linkUrl}
        } else if (info.selectionText) {
            data = {method: 'selection', text: info.selectionText}
        }

        chrome.tabs.getSelected(null, function(tab) {
          chrome.tabs.sendRequest(tab.id, data, function(response) {
            console.log(response.data);
          });
        });
    }
});