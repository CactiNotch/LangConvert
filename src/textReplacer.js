// textReplacer.js
import {
  DICTIONARY,
  EXCEPTIONS,
  ER_TO_RE_WORDS,
} from "./americanToAustralianDictionary.js";
import { determineContext } from "./contextUtils.js";

function capitaliseIfNeeded(original, replacement) {
  return original[0] === original[0].toUpperCase()
    ? replacement[0].toUpperCase() + replacement.slice(1)
    : replacement;
}

function handleErToReReplacement(base, suffix, auBase) {
  let replacementBase = capitaliseIfNeeded(base, auBase);

  // Handle special cases for -er to -re conversion
  if (suffix.startsWith("e")) {
    suffix = suffix.slice(1);
  }
  if (suffix === "ing") {
    replacementBase = replacementBase.slice(0, -1);
  }

  return replacementBase + suffix;
}

export function replaceAmericanWithAustralianText(text) {
  // Combine all dictionaries into a single lookup
  const combinedDictionary = {
    ...DICTIONARY.miscellaneous,
    ...DICTIONARY.orSuffix,
    ...DICTIONARY.reSuffix,
    ...DICTIONARY.izeSuffix,
    ...DICTIONARY.travel,
  };

  // Create a regex to match words with potential suffixes
  const regex = new RegExp(
    "\\b(" +
      Object.keys(combinedDictionary).join("|") +
      ")(ed|ing|s|es|al|ation|ations|ally|er|ers|ment|ments|e)?\\b",
    "gi"
  );

  return text.replace(regex, (match, base, suffix = "") => {
    // Skip exceptions
    if (EXCEPTIONS.includes(match.toLowerCase())) return match;

    // Handle special context-sensitive words
    const contextWord = Object.keys(DICTIONARY.contextSensitive).find((w) =>
      base.toLowerCase().includes(w)
    );
    if (contextWord) {
      const context = determineContext(base, text);
      return DICTIONARY.contextSensitive[contextWord](context);
    }

    // Handle ER to RE words
    if (ER_TO_RE_WORDS.includes(base.toLowerCase())) {
      return handleErToReReplacement(
        base,
        suffix,
        combinedDictionary[base.toLowerCase()]
      );
    }

    // Standard replacement
    const auBase = combinedDictionary[base.toLowerCase()];
    if (!auBase) return match;

    const replacementBase = capitaliseIfNeeded(base, auBase);
    return replacementBase + suffix;
  });
}
