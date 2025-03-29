import { replaceAmericanWithAustralianText } from './textReplacer.js';

function walkTextNodes(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    // Avoid modifying input, textarea, and script elements
    const parentElement = node.parentElement;
    const forbiddenTags = ['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA'];
    
    if (parentElement && !forbiddenTags.includes(parentElement.tagName)) {
      node.nodeValue = replaceAmericanWithAustralianText(node.nodeValue);
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Recursively walk child nodes
    node.childNodes.forEach(walkTextNodes);
  }
}

function processPage() {
  walkTextNodes(document.body);
}

// Run the transformation when the page loads
processPage();

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach(walkTextNodes);
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});