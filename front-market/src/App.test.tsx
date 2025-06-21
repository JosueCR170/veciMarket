import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { UserProvider } from './context/contextUsuario';

test('renders without crashing', () => {
  const { baseElement } = render(
    <UserProvider>
      <App />
    </UserProvider>
);
  expect(baseElement).toBeDefined();
});
