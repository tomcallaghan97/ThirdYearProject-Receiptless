import React from 'react';
import ExpensesScreen from '../components/ExpensesScreen';

import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(<ExpensesScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});