const {
  React,
  getModule
} = require('powercord/webpack');
const { Modal } = require('powercord/components/modal');
const {
  FormTitle,
  FormNotice
} = require('powercord/components');
const {
  close,
  open
} = require('powercord/modal');
const { SETTINGS_TIMEZONE } = require('./constants');
const {
  lookup,
  timezones
} = require('./tz');
const { SelectInput } = require('powercord/components/settings');

class TimezoneConverterPopup extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = { timezone: props.toTimezone };
  }

  render () {
    console.log(this.state, this.props);
    return <Modal size={Modal.Sizes.LARGE} className={'vrmodal'}>
      <Modal.Header>
        <FormTitle tag={'h4'}>
          Time converter
        </FormTitle>
        <Modal.CloseButton onClick={close}/>
      </Modal.Header>
      <Modal.Content>
        <p><SelectInput
          searchable={true}
          onChange={(e) => {
            this.setState({ timezone: lookup(e.value) });
          }}
          value={this.state.timezone.code}
          options={[
            ...timezones.map(it => ({
              value: it.code,
              label: `${it.name} (${it.offset})`
            }))
          ]}
        >
          Convert to timezone
        </SelectInput></p>
        <p>{text(this.props.time, this.props.fromTimezone, this.state.timezone)}</p>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
      </Modal.Content>
    </Modal>;
  }
}

function a (time) {
  return ((time / 60) | 0) + ':' + (time % 60);
}

function text (time, fromTimezone, toTimezone) {
  let offset = toTimezone.offsetminutes - fromTimezone.offsetminutes;
  let adjusted = (time + offset) % (24 * 60);
  return `${a(time)} ${fromTimezone.code} -> ${a(adjusted)} ${toTimezone.code}`;
}

function getLabel (time, fromTimezone, toTimezone) {
  return <span
    onClick={() => open(() => <TimezoneConverterPopup
      time={time}
      fromTimezone={fromTimezone}
      toTimezone={toTimezone}/>)}>
    {text(time, fromTimezone, toTimezone)}
  </span>;
}

module.exports = {
  TimezoneConverterPopup,
  getLabel
};
