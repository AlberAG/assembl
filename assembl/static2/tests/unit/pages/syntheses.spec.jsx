import React from 'react';
import renderer from 'react-test-renderer';

import { DumbSyntheses } from '../../../js/app/pages/syntheses';

describe('Syntheses component', () => {
  it('should match Syntheses snapshot', () => {
    const props = {
      syntheses: [
        {
          id: 'fooId',
          subject: 'Foo',
          img: { externalUrl: 'http://foo.com/bar' },
          creationDate: '2017-02-10T09:15:20.707854+00:00'
        },
        {
          id: 'barId',
          subject: 'Bar',
          img: { externalUrl: 'http://foo.com/bar' },
          creationDate: '2017-02-10T09:15:20.707854+00:00'
        }
      ],
      slug: 'fooslug'
    };
    const rendered = renderer.create(<DumbSyntheses {...props} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});