import {
  DICTIONARY,
  EXCEPTIONS,
  ER_TO_RE_WORDS,
  PREFIXES,
  SUFFIXES,
} from "./americanToCommonwealthDictionary.js";
import { determineContext } from "./contextUtils.js";

function capitaliseIfNeeded(prefix, original, replacement) {
  // Handle case with prefix
  if (prefix) {
    let processedPrefix = prefix;

    // Preserve the capitalisation of the prefix
    if (prefix[0] === prefix[0].toUpperCase()) {
      processedPrefix = prefix[0].toUpperCase() + prefix.slice(1).toLowerCase();
    } else {
      processedPrefix = prefix.toLowerCase();
    }

    return [processedPrefix + replacement, true];
  }
  // Handle case without prefix
  else {
    // Preserve the capitalisation of the original word
    if (original[0] === original[0].toUpperCase()) {
      replacement = replacement[0].toUpperCase() + replacement.slice(1);
    }

    return [replacement, false];
  }
}

function handleErToReReplacement(prefix, base, suffix, auBase) {
  // let replacementBase = capitaliseIfNeeded(prefix, base, auBase);
  const [replacementBase, hasPrefix] = capitaliseIfNeeded(prefix, base, auBase);

  // Handle special cases for -er to -re conversion with suffixes
  let adjustedSuffix = suffix;

  if (suffix.startsWith("e")) {
    adjustedSuffix = suffix.slice(1);
  }

  if (suffix === "ing") {
    // For words like "centering" -> "centring", remove the trailing 'e'
    return replacementBase.slice(0, -1) + adjustedSuffix;
  }

  return replacementBase + adjustedSuffix;
}

export function replaceAmericanWithCommonwealthText(text) {
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
    `\\b(${PREFIXES.join("|")})?` +
      `(${Object.keys(combinedDictionary).join("|")})` +
      `(${SUFFIXES.join("|")})?\\b`,
    "gi"
  );

  return text.replace(regex, (match, prefix = "", base, suffix = "") => {
    // Skip exceptions
    if (EXCEPTIONS.includes(match.toLowerCase())) return match;
    console.log(
      "match: " + match,
      "prefix: " + prefix,
      "base: " + base,
      "suffix: " + suffix
    );

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
        prefix,
        base,
        suffix,
        combinedDictionary[base.toLowerCase()]
      );
    }

    // Standard replacement
    const auBase = combinedDictionary[base.toLowerCase()];
    if (!auBase) return match;

    const [replacement, hasPrefix] = capitaliseIfNeeded(prefix, base, auBase);

    return hasPrefix
      ? replacement + suffix.toLowerCase()
      : (prefix || "") + replacement + suffix.toLowerCase();
  });
}
