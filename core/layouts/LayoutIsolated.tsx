import React from 'react';

const LayoutIsolated = ({ children }: { children: React.ReactNode }) => {
  return <section className="children__wrapper">{children}</section>;
};

export default LayoutIsolated;
