exports.stringify = function() {
  return JSON.stringify(this.attributes);
};

exports.parse = function(resp) {
  return JSON.parse(resp);
};

