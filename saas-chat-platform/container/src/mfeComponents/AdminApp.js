import React, { useRef, useEffect } from 'react';
import { mount } from 'admin/AdminApp';

const AdminApp = () => {
  const ref = useRef(null);

  useEffect(() => {
    const mountFn = mount(ref.current);
    
    return () => {
      if (mountFn && mountFn.unmount) {
        mountFn.unmount();
      }
    };
  }, []);

  return <div ref={ref} />;
};

export default AdminApp;