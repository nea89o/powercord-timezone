/* Adapted from: https://stackoverflow.com/a/45502134/5401763 under CC BY-SA 4.0 */
exports.splitSegments = function (string, pattern) {
  let segments = [];
  let match;
  let lastIndex = 0;
  pattern.lastIndex = 0;

  while (match = pattern.exec(string)) {
	if (match.index > lastIndex) {
	  segments.push(string.substring(lastIndex, match.index));
	}
	segments.push({ match });
	lastIndex = match.index + match[0].length;
  }
  if (lastIndex < string.length) {
	segments.push(string.substr(lastIndex));
  }
  return segments;
};
