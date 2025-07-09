import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const mount = (el) => {
  const root = createRoot(el);
  root.render(<App />);
  
  return {
    onParentNavigate() {
      // Handle navigation from parent
    },
    unmount() {
      root.unmount();
    },
  };
};

// If we are in development and in isolation, call mount immediately
if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#root');
  
  if (devRoot) {
    mount(devRoot);
  }
}

// We are running through container and we should export the mount function
export { mount };
export default mount;