const { Plugin } = require('powercord/entities');
const Settings = require('./Settings.jsx');
const manifest = require('./manifest.json');
const { getModule } = require('powercord/webpack');
const {
  inject,
  uninject
} = require('powercord/injector');
const { lookup } = require('./tz');

const { transformMessageArray } = require('./transformation.jsx');

const PLUGIN_ID = 'timezone-powercord';
const INJECTION_ID_MESSAGE_RENDER = PLUGIN_ID + '-message-render';

const MessageContent = getModule((m) => m.type && m.type.displayName === 'MessageContent', false);


module.exports = class TimezonePowercord extends Plugin {
  async startPlugin () {
    inject(INJECTION_ID_MESSAGE_RENDER, MessageContent, 'type', (args) => {
      return transformMessageArray(
        () => lookup(this.settings.get('timezone', 'GMT')))(args);
    }, true);
    powercord.api.notices.sendAnnouncement('timezone-request-tz', {
      color: 'green',
      message: 'Timezone Powercord Plugin has been loaded.'
    });
    powercord.api.settings.registerSettings(PLUGIN_ID, {
      category: this.entityID,
      label: 'Timezone Powercord Plugin',
      render: Settings
    });
  }

  async pluginWillUnload () {
    uninject(INJECTION_ID_MESSAGE_RENDER);
    powercord.api.settings.unregisterSettings(this.entityID);
  }

};
