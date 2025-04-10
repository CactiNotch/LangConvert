let disabledSites = new Set();
console.log("Background script loaded!");

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

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-conversion") {
    // Get current tab
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tabs.length === 0) return;
    const tab = tabs[0];

    try {
      const hostname = new URL(tab.url).hostname;

      // Toggle site status
      if (disabledSites.has(hostname)) {
        disabledSites.delete(hostname);
      } else {
        disabledSites.add(hostname);
      }

      // Save to storage
      chrome.storage.local.set({
        disabledSites: Array.from(disabledSites),
      });

      // Refresh the page to apply changes
      chrome.tabs.reload(tab.id);
    } catch (error) {
      console.error("Error processing command:", error);
    }
  }
});
