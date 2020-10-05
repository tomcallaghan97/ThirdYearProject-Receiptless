import React from 'react';
import CameraScreen from '../components/CameraScreen';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<CameraScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});