const { Plugin } = require('powercord/entities');
const Settings = require('./Settings.jsx');
const manifest = require('./manifest.json');
const { getModule } = require('powercord/webpack');
const {
  inject,
  uninject
} = require('powercord/injector');
const { lookup } = require('./tz');
const {
  PLUGIN_ID,
  SETTINGS_INDEV_VERSION,
  INJECTION_ID_MESSAGE_RENDER,
  SETTINGS_TIMEZONE
} = require('./constants');
const { transformMessageArray } = require('./transformation.jsx');

const MessageContent = getModule((m) => m.type && m.type.displayName === 'MessageContent', false);

module.exports = class TimezonePowercord extends Plugin {
  async startPlugin () {
    inject(INJECTION_ID_MESSAGE_RENDER, MessageContent, 'type',
      transformMessageArray(() => lookup(this.settings.get(SETTINGS_TIMEZONE, 'GMT'))), true);

    if (this.settings.get(SETTINGS_INDEV_VERSION, '0') !== manifest.version) {
      powercord.api.notices.sendAnnouncement('timezone-request-tz', {
        color: 'green',
        message: 'This version of Timezone Powercord Plugin is still in development.',
        button: {
          text: 'Don\'t show again.',
          onClick: async () => {
            this.settings.set(SETTINGS_INDEV_VERSION, manifest.version);
          }
        }
      });
    }
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
