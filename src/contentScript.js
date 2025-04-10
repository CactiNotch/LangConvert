import { replaceAmericanWithCommonwealthText } from "./textReplacer.js";

function walkTextNodes(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    // Avoid modifying input, textarea, and script elements
    const parentElement = node.parentElement;
    const forbiddenTags = ["SCRIPT", "STYLE", "INPUT", "TEXTAREA"];

    if (parentElement && !forbiddenTags.includes(parentElement.tagName)) {
      node.nodeValue = replaceAmericanWithCommonwealthText(node.nodeValue);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Recursively walk child nodes
    node.childNodes.forEach(walkTextNodes);
  }
}

function processPage() {
  walkTextNodes(document.body);
}

// Check if translations is enabled for the current site before processing
async function init() {
  const response = await chrome.runtime.sendMessage({
    type: "checkSiteStatus",
    url: window.location.href,
  });

  if (!response.isDisabled) {
    // Process existing content
    processPage();

    // Observe for changes in the DOM and re-run the transformation
    // Might be removed if performance is an issue
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(walkTextNodes);
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

init();
