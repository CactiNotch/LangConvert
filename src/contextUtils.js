// contextUtils.js
const VERB_INDICATORS = ['to', 'will', 'should', 'must', 'can', 'could'];

export function determineContext(word, surroundingText) {
  const words = surroundingText.split(/\s+/);
  const prevWord = words[words.length - 1].toLowerCase();
  return VERB_INDICATORS.includes(prevWord) ? 'verb' : 'noun';
}