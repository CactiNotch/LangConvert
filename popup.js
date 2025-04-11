document.addEventListener("DOMContentLoaded", async () => {
  const toggleButton = document.getElementById("convertToggleButton");

  // Get current tab URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  // Check initial state
  const response = await chrome.runtime.sendMessage({
    type: "checkSiteStatus",
    url: url,
  });

  // Set initial button state
  if (response.isDisabled) {
    toggleButton.classList.remove("enabled");
    toggleButton.classList.add("disabled");
    toggleButton.textContent = "Conversion Disabled";
  } else {
    toggleButton.classList.remove("disabled");
    toggleButton.classList.add("enabled");
    toggleButton.textContent = "Conversion Enabled";
  }

  toggleButton.addEventListener("click", async () => {
    const response = await chrome.runtime.sendMessage({
      type: "toggleSite",
      url: url,
    });

    if (response.isDisabled) {
      toggleButton.classList.remove("enabled");
      toggleButton.classList.add("disabled");
      toggleButton.textContent = "Conversion Disabled";
    } else {
      toggleButton.classList.remove("disabled");
      toggleButton.classList.add("enabled");
      toggleButton.textContent = "Conversion Enabled";
    }

    chrome.tabs.reload(tab.id);
  });
});
