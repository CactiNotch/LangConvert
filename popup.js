document.addEventListener("DOMContentLoaded", async () => {
  const convertToggleButton = document.getElementById("convertToggleButton");

  // Get current tab URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  // Check initial state
  const response = await chrome.runtime.sendMessage({
    type: "checkSiteStatus",
    url: url,
  });

  // Set initial button text
  convertToggleButton.textContent = response.isDisabled
    ? "Enable Conversion"
    : "Disable Conversion";

  // Add click handler
  convertToggleButton.addEventListener("click", async () => {
    const response = await chrome.runtime.sendMessage({
      type: "toggleSite",
      url: url,
    });

    // Update button text
    convertToggleButton.textContent = response.isDisabled
      ? "Enable Conversion"
      : "Disable Conversion";

    // Refresh the current tab to apply changes
    chrome.tabs.reload(tab.id);
  });
});
