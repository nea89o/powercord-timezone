const { splitSegments } = require('./util');
const { React } = require('powercord/webpack');
const { open } = require('powercord/modal');
const { getLabel } = require('./popup.jsx');
const {
  timezones,
  lookup
} = require('./tz');

const timezonePattern = new RegExp('(\\d+):(\\d+) *(' + timezones.map(it => `(?:${it.code})`).join('|') + ')', 'g');

function transformMessage (userTimezoneProvider, msgConstruct) {
  if (!('content' in msgConstruct) || !('flatMap' in msgConstruct.content)) {
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
      return getLabel(time, timezone, userTimezone);
    });
  }
  return [ part ];
}

exports.transformMessageArray = userTimezoneProvider => args =>
  args.map(it => transformMessage(userTimezoneProvider, it));
