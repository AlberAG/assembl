// @flow
import * as React from 'react';

type Props = {
  checked: boolean,
  id: string,
  name: string,
  title: string,
  label: string,
  labelRight: string,
  disabled: boolean,
  theme: string,
  mode: string,
  onChange: Function
};

class SwitchButton extends React.Component<Props> {
  static defaultProps = {
    id: '',
    name: 'switch-button',
    title: '',
    label: '',
    labelRight: '',
    disabled: false,
    theme: 'rsbc-switch-button-flat-round',
    mode: 'switch',
    onChange: () => {}
  };

  render() {
    let id;
    let label;
    let labelRight;
    let mode = this.props.mode || 'switch';

    if (this.props.id === '' && this.props.name !== '') {
      id = this.props.name;
    }

    if (this.props.label !== '') {
      label = <label htmlFor={id}>{this.props.label}</label>;
    }

    if (this.props.labelRight !== '') {
      labelRight = <label htmlFor={id}>{this.props.labelRight}</label>;
    }

    if (['switch', 'select'].indexOf(mode) < -1) {
      mode = 'switch';
    }

    const props = {
      checked: this.props.checked,
      disabled: this.props.disabled,
      onChange: this.props.onChange,
      name: this.props.name,
      type: 'checkbox',
      value: '1',
      id: id
    };

    return (
      <div className={`rsbc-switch-button rsbc-mode-${mode} ${this.props.theme}${this.props.disabled ? ' disabled' : ''}`}>
        {label}
        <input {...props} />
        <label htmlFor={id} />
        {labelRight}
      </div>
    );
  }
}

export default SwitchButton;