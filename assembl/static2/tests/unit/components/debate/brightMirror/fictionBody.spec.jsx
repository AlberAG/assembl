// @flow
import React from 'react';
import initStoryshots from '@storybook/addon-storyshots';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import FictionBody from '../../../../../js/app/components/debate/brightMirror/fictionBody';
import type { FictionBodyProps } from '../../../../../js/app/components/debate/brightMirror/fictionBody';

// Separate the snapshots in directories next to each component
// Name should match with the story name
initStoryshots({
  storyKindRegex: /^FictionBody$/
});

configure({ adapter: new Adapter() });

const defaultId: string = '0';
const defaultTitle: string = 'Fugit veritatis nemo';
const defaultContent: string = 'Vero et ut et quia quo. Molestiae ut cupiditate odio numquam veniam esse cumque modi.';
const defaultLocale: string = 'en';

const defaultFictionBody: FictionBodyProps = {
  id: defaultId,
  title: defaultTitle,
  content: defaultContent,
  contentLocale: defaultLocale,
  lang: defaultLocale
};

describe('<FictionBody /> - with shallow', () => {
  let wrapper;
  let fictionBody: FictionBodyProps;

  beforeEach(() => {
    fictionBody = { ...defaultFictionBody };
    wrapper = shallow(<FictionBody {...fictionBody} />);
  });

  it('should render one h1 title and one div content', () => {
    expect(wrapper.find('h1 [className="fiction-title"]')).toHaveLength(1);
    expect(wrapper.find('div [className="fiction-content"]')).toHaveLength(1);
  });

  it('should display the fiction title', () => {
    expect(wrapper.contains(defaultTitle)).toBe(true);
  });

  it('should display "no title specified" when title is set to null', () => {
    wrapper.setProps({ title: '' });
    expect(wrapper.contains('Titre non défini')).toBe(true);
  });
});

describe('<FictionBody /> - with mount', () => {
  let wrapper;
  let fictionBody: FictionBodyProps;

  beforeEach(() => {
    fictionBody = { ...defaultFictionBody };
    wrapper = mount(<FictionBody {...fictionBody} />);
  });

  it('should display the fiction content', () => {
    const fictionContent: string = wrapper.find('div [className="fiction-content"]').text();
    expect(fictionContent).toEqual(defaultContent);
  });

  it('should display "no content specified" when content is set to null', () => {
    wrapper.setProps({ content: '' });
    const fictionContent: string = wrapper.find('div [className="fiction-content"]').text();
    expect(fictionContent).toEqual('Contenu non défini');
  });
});