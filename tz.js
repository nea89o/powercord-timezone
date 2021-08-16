const { timezones } = require('./timezones.json');
module.exports = {
  lookup (name) {
	const casefolded = name.toLowerCase();
	return timezones.find(it => it.code.toLowerCase() === casefolded);
  },
  timezones
};


