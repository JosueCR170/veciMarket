import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { UserProvider } from './context/contextUsuario';
import { LocationProvider } from './context/contextLocation';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <UserProvider>
      <LocationProvider>
       <App />
      </LocationProvider>
    </UserProvider>
  </React.StrictMode>
);