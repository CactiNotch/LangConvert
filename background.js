let disabledSites = new Set();

chrome.storage.local.get(["disabledSites"], (result) => {
  if (result.disabledSites) {
    disabledSites = new Set(result.disabledSites);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "toggleSite") {
    const hostname = new URL(request.url).hostname;

    if (disabledSites.has(hostname)) {
      disabledSites.delete(hostname);
    } else {
      disabledSites.add(hostname);
    }

    // Save to storage
    chrome.storage.local.set({
      disabledSites: Array.from(disabledSites),
    });

    // Send status back
    sendResponse({
      isDisabled: disabledSites.has(hostname),
    });
  }

  if (request.type === "checkSiteStatus") {
    const hostname = new URL(request.url).hostname;
    sendResponse({
      isDisabled: disabledSites.has(hostname),
    });
  }
});
