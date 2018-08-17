// @flow
import React from 'react';
/* eslint-disable */
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
/* eslint-enable */

import Checkbox101 from './checkbox101';

configure({ adapter: new Adapter() });

describe('<Checkbox101 /> - with shallow', () => {
  let wrapper;
  let onChangeHandler;

  beforeEach(() => {
    // Mock actions
    onChangeHandler = jest.fn();

    wrapper = shallow(<Checkbox101
      onChangeHandler={onChangeHandler}
    />);
  });

  it('should render one checkbox with a default label', () => {
    const defaultLabel = 'Default';

    expect(wrapper.find('input [type=\'checkbox\']')).toHaveLength(1);
    expect(wrapper.find('label').text()).toEqual(defaultLabel);
  });

  it('should render one checkbox with a custom label', () => {
    const customLabel = 'Custom Label';
    wrapper.setProps({ label: customLabel });

    expect(wrapper.find('input [type=\'checkbox\']')).toHaveLength(1);
    expect(wrapper.find('label').text()).toEqual(customLabel);
  });

  it('should render one checkbox that can be checked', () => {
    wrapper.find('input [type=\'checkbox\']').simulate('change');

    expect(onChangeHandler).toHaveBeenCalledTimes(1);
  });
});