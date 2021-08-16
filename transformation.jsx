const { splitSegments } = require('./util');
const { React } = require('powercord/webpack');
const {
  timezones,
  lookup
} = require('./tz');

const timezonePattern = new RegExp('(\\d+):(\\d+) *(' + timezones.map(it => `(?:${it.code})`).join('|') + ')', 'g');

function transformMessage (userTimezoneProvider, msgConstruct) {
  if (!('content' in msgConstruct)) {
	return msgConstruct;
  }
  return Object.assign({}, msgConstruct, {
	content: msgConstruct.content.flatMap(it => transformPart(userTimezoneProvider, it))
  });
}

function transformPart (userTimezoneProvider, part) {
  if (typeof part === 'string') {
	return splitSegments(part, timezonePattern).map(it => {
	  if (typeof it === 'string') {
		return it;
	  }
	  let [ _, hour, minute, tz ] = it.match;
	  let timezone = lookup(tz);
	  let time = hour * 60 + minute;
	  let userTimezone = userTimezoneProvider();
	  let offset = userTimezone.offsetminutes - timezone.offsetminutes;
	  let adjusted = (time + offset) % (24 * 60);
	  return (<>
		{hour}:{minute} {timezone.code} -> {adjusted / 60}:{adjusted % 60} {userTimezone.code}
	  </>);
	});
  }
  return [ part ];
}

exports.transformMessageArray = userTimezoneProvider => args =>
  args.map(it => transformMessage(userTimezoneProvider, it));
