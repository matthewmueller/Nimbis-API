/*
 * Generate a unique ID of a given length
 */
exports.id = function(len) {
  return Math.random().toString(36).substr(2,len);
};