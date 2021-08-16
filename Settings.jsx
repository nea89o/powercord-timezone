const { React } = require('powercord/webpack');
const {
  Category,
  SwitchItem,
  TextInput,
  RadioGroup,
  SelectInput
} = require('powercord/components/settings');
const tz = require('./tz');


  module.exports = class Settings extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      timezone: this.props.getSetting('timezone', 'GMT')
    };
  }

  render () {
    return <div>
      <SelectInput
        searchable={true}
        onChange={(e) => {
          this.props.updateSetting('timezone', e.value);
          this.setState({ timezone: e.value });
        }}
        value={this.state.timezone}
        options={[
          ...tz.timezones.map(it => ({
            value: it.code,
            label: `${it.name} (${it.offset})`
          }))
        ]}
      >
        My timezone
      </SelectInput>
    </div>;
  }

};
;


