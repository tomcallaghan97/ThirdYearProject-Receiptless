import React from 'react';
import ReceiptsScreen from '../components/ReceiptsScreen';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<ReceiptsScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});